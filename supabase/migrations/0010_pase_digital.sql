-- "El Pase" (el pasaporte QR que un supervisor verifica en el pozo) — mecanismo central de
-- venta (FICHA-MODELO.md §7, Reporte de validación Sesión 1), señalado como BLOQUEANTE en la
-- auditoría de integridad de lanzamiento del 2026-11-02 (docs/release/CLAIMS-LEDGER.md) porque
-- nunca se construyó: era solo un texto fijo con un ícono de QR vacío.
--
-- Diseño: cada trabajador tiene un `pase_token` opaco (UUID random, no el user_id real, no
-- secuencial) que codifica el QR. Un supervisor sin cuenta en la app escanea el QR en el pozo y
-- llega a una página pública `/pase/[token]` que muestra SOLO lo mínimo necesario para decidir
-- si deja pasar al trabajador: nombre, cuadrilla, si su capacitación está vigente hoy y las
-- competencias (módulos) que ya aprobó. Nunca expone email, PIN, ni el historial de intentos.

alter table public.workers
  add column if not exists pase_token uuid not null default gen_random_uuid() unique;
create index if not exists workers_pase_token_idx on public.workers(pase_token);

-- Security definer: el supervisor que escanea el QR normalmente NO tiene cuenta en la app
-- (ni auth.uid()), así que este RPC se habilita también para `anon`. Por diseño solo devuelve
-- los campos mínimos no sensibles — nunca el user_id real, el email ni el PIN.
create or replace function public.verificar_pase(p_token uuid)
returns table (
  o_nombre text,
  o_cuadrilla text,
  o_vigente boolean,
  o_current_streak int,
  o_competencias text[]
)
language plpgsql security definer set search_path = '' stable
as $$
declare
  v_worker_id uuid;
  v_today date := current_date;
begin
  select w.user_id into v_worker_id from public.workers w where w.pase_token = p_token and w.active;
  if v_worker_id is null then
    return;
  end if;

  return query
    select
      w.full_name,
      c.name,
      coalesce(s.last_completed_date, '1900-01-01'::date) >= v_today - 1,
      coalesce(s.current_streak, 0),
      coalesce(array_agg(distinct m.title order by m.title) filter (where m.title is not null), array[]::text[])
    from public.workers w
    join public.crews c on c.id = w.crew_id
    left join public.streaks s on s.worker_user_id = w.user_id
    left join public.attempts a on a.worker_user_id = w.user_id and a.passed
    left join public.lessons l on l.id = a.lesson_id
    left join public.modules m on m.id = l.module_id
    where w.user_id = v_worker_id
    group by w.full_name, c.name, s.last_completed_date, s.current_streak;
end;
$$;
revoke execute on function public.verificar_pase(uuid) from public;
grant execute on function public.verificar_pase(uuid) to anon, authenticated;
