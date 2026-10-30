-- HSE Master App — conexión con Hotmart (cobro de la suscripción de la organización)
-- Patrón canónico: docs/sistema/18-VENTA-HOTMART.md (sección "SEGURIDAD DEL WEBHOOK DE HOTMART")
-- Modelo: trial en la propia app (14 días, sin tarjeta) → al pagar de verdad en Hotmart, el
-- webhook sube la organización del Gerente de HSE a 'active' (busca su org por el email con el
-- que compró, o por el código de suscriptor si ya estaba vinculado).

-- ── Estado de suscripción de la organización ──────────────────────────────────
alter table public.organizations
  add column if not exists subscription_status text not null default 'trialing'
    check (subscription_status in
      ('trialing', 'active', 'past_due', 'cancelled', 'expired', 'refunded', 'chargeback')),
  add column if not exists trial_ends_at timestamptz,
  add column if not exists access_until timestamptz,   -- cancelada pero paga hasta esta fecha
  add column if not exists grace_ends_at timestamptz,   -- pago atrasado: gracia hasta esta fecha
  add column if not exists first_paid_at timestamptz,   -- primer cobro real (métrica trial→pago)
  add column if not exists plan_name text,              -- 'mensual' / 'anual', tal como lo mande Hotmart
  add column if not exists hotmart_subscriber_code text unique;

-- ── Idempotencia técnica: Hotmart REENVÍA eventos ────────────────────────────
create table if not exists public.processed_events (
  event_id     text primary key,
  event_type   text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);

-- ── Log de salud del webhook (éxitos Y fallos — ver 21-BACKOFFICE.md) ────────
create table if not exists public.webhook_log (
  id          bigserial primary key,
  event_id    text,
  type        text,
  result      text not null check (result in
                ('applied', 'duplicate', 'illegal', 'unauthorized', 'not_found', 'error')),
  detail      text,
  received_at timestamptz not null default now()
);
create index if not exists webhook_log_received_idx on public.webhook_log (received_at desc);
create index if not exists webhook_log_result_idx   on public.webhook_log (result, received_at desc);

-- ── Ledger económico: dedupe de INGRESOS, distinto del dedupe técnico ───────
create table if not exists public.payment_transactions (
  provider text not null,
  transaction_id text not null,
  economic_kind text not null check (economic_kind in ('sale', 'refund', 'chargeback')),
  product_id text,
  offer_id text,
  amount_minor bigint,
  currency text,
  occurred_at timestamptz not null default now(),
  raw_event_id text not null,
  primary key (provider, transaction_id, economic_kind)
);

-- Estas 3 tablas solo las escribe el servidor (service role, que salta RLS) — ningún cliente
-- debe poder leerlas ni escribirlas directo, por eso llevan RLS activo sin policies.
alter table public.processed_events enable row level security;
alter table public.webhook_log enable row level security;
alter table public.payment_transactions enable row level security;

-- ── RPC transaccional: idempotencia + ledger + transición de estado, todo atómico ──
drop function if exists public.apply_hotmart_event(
  text, text, text, text, text, text, timestamptz, timestamptz, timestamptz, timestamptz,
  text, text, text, bigint, text
);
create or replace function public.apply_hotmart_event(
  p_event_id text,
  p_event_type text,
  p_payload_hash text,
  p_email text,
  p_subscriber_code text,
  p_new_status text,          -- null = evento informativo que no cambia el estado (ej. SWITCH_PLAN)
  p_trial_ends_at timestamptz,
  p_access_until timestamptz,
  p_grace_ends_at timestamptz,
  p_first_paid_at timestamptz,
  p_plan_name text,
  p_transaction_id text,      -- null si el evento no es económico (ej. cancelación)
  p_economic_kind text,       -- 'sale' | 'refund' | 'chargeback', requerido si p_transaction_id no es null
  p_amount_minor bigint,
  p_currency text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted_event text;
  v_org_id uuid;
  v_current text;
begin
  -- 1) Idempotencia técnica: si este event_id ya se procesó, no repetir nada.
  insert into public.processed_events(event_id, event_type, payload_hash)
  values (p_event_id, p_event_type, p_payload_hash)
  on conflict (event_id) do nothing
  returning event_id into v_inserted_event;

  if v_inserted_event is null then
    return 'duplicate';
  end if;

  -- 2) Localizar la organización: primero por el código de suscriptor ya vinculado,
  --    si no, por el email del Gerente de HSE (owner) con el que compró en Hotmart.
  if p_subscriber_code is not null then
    select id, subscription_status into v_org_id, v_current
    from public.organizations
    where hotmart_subscriber_code = p_subscriber_code
    limit 1;
  end if;

  if v_org_id is null and p_email is not null then
    select o.id, o.subscription_status into v_org_id, v_current
    from public.organizations o
    join public.memberships m on m.org_id = o.id and m.role = 'owner'
    join auth.users u on u.id = m.user_id
    where lower(u.email) = lower(p_email)
    limit 1;
  end if;

  if v_org_id is null then
    return 'not_found';
  end if;

  -- 3) Ledger económico (dedupe de ingresos, independiente del dedupe técnico del paso 1).
  if p_transaction_id is not null and p_economic_kind is not null then
    insert into public.payment_transactions(
      provider, transaction_id, economic_kind, amount_minor, currency, raw_event_id
    ) values (
      'hotmart', p_transaction_id, p_economic_kind, p_amount_minor, p_currency, p_event_id
    )
    on conflict (provider, transaction_id, economic_kind) do nothing;
  end if;

  -- 4) Transición de estado (si el evento trae una) — bloquea reactivar algo ya terminal.
  if p_new_status is not null then
    if v_current in ('refunded', 'chargeback') and p_new_status in ('active', 'trialing') then
      return 'illegal';
    end if;

    update public.organizations
    set subscription_status = p_new_status,
        trial_ends_at = coalesce(p_trial_ends_at, trial_ends_at),
        access_until = p_access_until,
        grace_ends_at = p_grace_ends_at,
        first_paid_at = coalesce(first_paid_at, p_first_paid_at),
        plan_name = coalesce(p_plan_name, plan_name),
        hotmart_subscriber_code = coalesce(hotmart_subscriber_code, p_subscriber_code)
    where id = v_org_id;
  elsif p_plan_name is not null then
    -- SWITCH_PLAN: no cambia el estado, solo el nombre del plan.
    update public.organizations
    set plan_name = p_plan_name,
        hotmart_subscriber_code = coalesce(hotmart_subscriber_code, p_subscriber_code)
    where id = v_org_id;
  end if;

  return 'applied';
end;
$$;

revoke execute on function public.apply_hotmart_event(
  text, text, text, text, text, text, timestamptz, timestamptz, timestamptz, timestamptz,
  text, text, text, bigint, text
) from anon, authenticated;
-- Solo lo llama el endpoint del webhook con la service role key (que ya salta grants) —
-- revocado de anon/authenticated para que ningún cliente lo invoque vía la API pública.
