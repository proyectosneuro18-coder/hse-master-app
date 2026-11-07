-- 0011 — Arregla `registrar_intento` (rota desde 0009) y la prepara para el modo sin señal.
--
-- 1) BUG REAL: 0009 declaró la función `stable`. Postgres prohíbe INSERT/UPDATE dentro de una
--    función no-volátil y la rechazaba en CADA llamada con
--    "0A000: INSERT is not allowed in a non-volatile function" — ningún trabajador podía guardar
--    su reto desde que 0009 se aplicó. Verificado contra la base de desarrollo con un trabajador
--    temporal (2026-11-07). Esta versión vuelve a ser volátil (el default, sin `stable`).
--
-- 2) MODO SIN SEÑAL: nuevo parámetro opcional `p_fecha` = el día LOCAL del celular en que el
--    trabajador completó el reto. Sirve para dos cosas:
--    a) un reto hecho sin señal y enviado al día siguiente cuenta para el día en que se hizo
--       (la racha no se rompe por culpa de la falta de señal en el pozo);
--    b) usa el día local del trabajador y no el día UTC del servidor (en Colombia, UTC-5, un
--       reto hecho a las 8 p. m. caía en "mañana" y al día siguiente la app decía "ya hecho").
--    Para que no se pueda inventar historial, solo se aceptan fechas de los últimos 3 días
--    (o mañana, por diferencias de zona horaria); fuera de ese rango se rechaza.
drop function if exists public.registrar_intento(uuid, int, boolean);
drop function if exists public.registrar_intento(uuid, int, boolean, date);

create function public.registrar_intento(
  p_lesson_id uuid,
  p_score int,
  p_passed boolean,
  p_fecha date default null
)
returns table (
  attempt_id uuid,
  o_current_streak int,
  o_longest_streak int,
  racha_extendida boolean
)
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_attempt_id uuid;
  v_last_date date;
  v_today date := coalesce(p_fecha, current_date);
  v_extendida boolean := false;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.workers where user_id = v_uid and active) then
    raise exception 'NOT_A_WORKER' using errcode = 'P0001';
  end if;

  if v_today < current_date - 3 or v_today > current_date + 1 then
    raise exception 'FECHA_FUERA_DE_RANGO' using errcode = '22023';
  end if;

  insert into public.attempts (worker_user_id, lesson_id, score, passed)
  values (v_uid, p_lesson_id, p_score, p_passed)
  returning id into v_attempt_id;

  if p_passed then
    select last_completed_date
      into v_last_date
      from public.streaks where worker_user_id = v_uid;

    if not found then
      insert into public.streaks (worker_user_id, current_streak, longest_streak, last_completed_date)
      values (v_uid, 1, 1, v_today);
      v_extendida := true;
    elsif v_last_date is null then
      update public.streaks
        set current_streak = 1,
            longest_streak = greatest(longest_streak, 1),
            last_completed_date = v_today
        where worker_user_id = v_uid;
      v_extendida := true;
    elsif v_last_date >= v_today then
      -- ya contaba ese día (o uno posterior, si los retos sin señal llegan desordenados)
      v_extendida := false;
    elsif v_last_date = v_today - 1 then
      update public.streaks
        set current_streak = current_streak + 1,
            longest_streak = greatest(longest_streak, current_streak + 1),
            last_completed_date = v_today
        where worker_user_id = v_uid;
      v_extendida := true;
    else
      update public.streaks
        set current_streak = 1,
            longest_streak = greatest(longest_streak, 1),
            last_completed_date = v_today
        where worker_user_id = v_uid;
      v_extendida := true;
    end if;
  end if;

  return query
    select v_attempt_id, s.current_streak, s.longest_streak, v_extendida
    from public.streaks s where s.worker_user_id = v_uid;
end;
$$;

revoke execute on function public.registrar_intento(uuid, int, boolean, date) from public, anon;
grant execute on function public.registrar_intento(uuid, int, boolean, date) to authenticated;

-- Avisa a la API de Supabase que la función cambió (si no, puede seguir usando la vieja un rato).
notify pgrst, 'reload schema';

-- Comprobación: debe salir UNA fila "registrar_intento(uuid,integer,boolean,date)" con volatil = v
select oid::regprocedure as funcion, provolatile as volatil
from pg_proc where proname = 'registrar_intento';
