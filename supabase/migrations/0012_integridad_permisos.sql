-- 0012 — Cierra 3 huecos encontrados en la auditoría de integridad (61, Gates 1 y 5), 2026-11-09.
--
-- 1) ESTADO DE PAGO EDITABLE POR EL CLIENTE: la policy de 0007 ("admin de la org renombra su
--    organizacion") permitía UPDATE de TODA la fila. Un gerente con su propia sesión podía llamar
--    la API de Supabase y ponerse `subscription_status = 'active'` o mover `trial_ends_at`, `access_until`,
--    etc. — usar la app gratis para siempre. Desde ahora `authenticated` solo puede actualizar
--    la columna `name`; el estado de pago lo escribe únicamente el webhook (service role).
revoke update on public.organizations from anon, authenticated;
grant update (name) on public.organizations to authenticated;

-- 2) INTENTOS INSERTABLES DIRECTO: la policy "worker inserta sus propios intentos" dejaba al
--    trabajador insertar filas en `attempts` con cualquier lección/puntaje, sin pasar por
--    `registrar_intento` (que valida trabajador activo y fecha). Esas filas alimentan las
--    "competencias" del Pase QR. La app nunca inserta directo (solo usa la RPC, que es
--    security definer y no necesita esta policy), así que se elimina sin efecto para el usuario.
drop policy if exists "worker inserta sus propios intentos" on public.attempts;
revoke insert, update, delete on public.attempts from anon, authenticated;
revoke insert, update, delete on public.streaks from anon, authenticated;
revoke insert, update, delete on public.qr_passes from anon, authenticated;

-- 3) PIN DE 4 DÍGITOS SIN LÍMITE DE INTENTOS: con el código de cuadrilla (que no es secreto) se
--    podían probar los 10.000 PIN de un trabajador. Se bloquea 15 minutos tras 5 fallos seguidos.
--    Tabla sin policies (RLS activo): solo el servidor (service role) la lee y escribe.
create table if not exists public.worker_login_failures (
  worker_user_id uuid primary key references auth.users(id) on delete cascade,
  failures int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.worker_login_failures enable row level security;
revoke all on public.worker_login_failures from anon, authenticated;

-- Suma un fallo de forma atómica (sin carreras entre peticiones simultáneas) y devuelve hasta
-- cuándo queda bloqueado (null = todavía no). Al bloquear, el contador vuelve a 0.
create or replace function public.registrar_fallo_pin(p_worker uuid)
returns timestamptz
language plpgsql security definer set search_path = ''
as $$
declare
  v_failures int;
  v_locked timestamptz;
begin
  insert into public.worker_login_failures as f (worker_user_id, failures, updated_at)
  values (p_worker, 1, now())
  on conflict (worker_user_id) do update
    set failures = case when f.locked_until is not null and f.locked_until <= now() then 1
                        else f.failures + 1 end,
        locked_until = case when f.locked_until is not null and f.locked_until <= now() then null
                            else f.locked_until end,
        updated_at = now()
  returning failures, locked_until into v_failures, v_locked;

  if v_failures >= 5 then
    update public.worker_login_failures
      set failures = 0, locked_until = now() + interval '15 minutes', updated_at = now()
      where worker_user_id = p_worker
      returning locked_until into v_locked;
  end if;

  return v_locked;
end;
$$;

revoke execute on function public.registrar_fallo_pin(uuid) from public, anon, authenticated;

notify pgrst, 'reload schema';

-- Comprobación: deben salir 3 filas.
--   organizations_update_cols = {name}  ·  attempts_insert_policy = 0  ·  tabla_bloqueo = 1
select 'organizations_update_cols' as chequeo,
       (select array_agg(column_name::text order by column_name)
          from information_schema.column_privileges
         where table_schema = 'public' and table_name = 'organizations'
           and grantee = 'authenticated' and privilege_type = 'UPDATE')::text as resultado
union all
select 'attempts_insert_policy',
       (select count(*) from pg_policies
         where schemaname = 'public' and tablename = 'attempts' and cmd = 'INSERT')::text
union all
select 'tabla_bloqueo',
       (select count(*) from information_schema.tables
         where table_schema = 'public' and table_name = 'worker_login_failures')::text;
