-- 0013 — El servidor califica el reto (auditoría de integridad 61, Gate 5), 2026-11-09.
--
-- PROBLEMA: `registrar_intento` recibía `p_passed`/`p_score` desde el celular y les creía. Las
-- lecciones aprobadas alimentan las "competencias" del Pase QR que el supervisor revisa antes de
-- dejar entrar a alguien al pozo: con conocimientos técnicos se podían marcar las 9 aprobadas en
-- un minuto, sin responder nada.
--
-- AHORA:
--  1) El celular manda la RESPUESTA ELEGIDA (índice de la opción), no "aprobé". El servidor la
--     compara con `lessons.content->>'respuesta_correcta'`.
--  2) Orden: solo se puede aprobar la SIGUIENTE lección pendiente (la que la app muestra como
--     reto de hoy) o repasar una ya aprobada. Saltarse lecciones se rechaza.
--  3) Ritmo: una sola lección aprobada por día local del trabajador (el producto es "1 reto
--     diario"). Un segundo aprobado el mismo día se rechaza.
--  Rechazos deliberados usan errcode 22023 → la cola sin señal los descarta, no los reintenta.
--
-- Límite conocido (documentado en CLAIMS-LEDGER): la respuesta correcta viaja al celular porque
-- el modo sin señal da la explicación sin red. Con 2) y 3), quien hace trampa avanza al mismo
-- ritmo que quien responde de verdad: el Pase certifica "completó en orden N retos diarios".
--
-- COMPATIBILIDAD: se elimina la firma vieja (p_score, p_passed). El código publicado antes de
-- este cambio recibirá "función no encontrada" (PGRST202) hasta publicar el nuevo; sus retos
-- quedan en la cola del celular (no se pierden). Correr esto y publicar el código en seguida.

drop function if exists public.registrar_intento(uuid, int, boolean);
drop function if exists public.registrar_intento(uuid, int, boolean, date);
drop function if exists public.registrar_intento(uuid, int, date);

create function public.registrar_intento(
  p_lesson_id uuid,
  p_respuesta int,
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
  v_correcta int;
  v_passed boolean;
  v_siguiente uuid;
  v_ya_aprobada boolean;
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

  select (l.content->>'respuesta_correcta')::int into v_correcta
    from public.lessons l where l.id = p_lesson_id;
  if v_correcta is null then
    raise exception 'LECCION_INVALIDA' using errcode = '22023';
  end if;

  -- Un intento a la vez por trabajador (evita aprobar 2 lecciones en peticiones simultáneas).
  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 0));

  v_passed := p_respuesta is not null and p_respuesta = v_correcta;

  if v_passed then
    v_ya_aprobada := exists (
      select 1 from public.attempts a
       where a.worker_user_id = v_uid and a.lesson_id = p_lesson_id and a.passed
    );

    if not v_ya_aprobada then
      -- La siguiente lección pendiente, con el mismo orden que usa la app (app/app/page.tsx):
      -- módulos por order_index, primera lección de cada módulo.
      select l.id into v_siguiente
        from public.modules m
        join lateral (
          select l2.id from public.lessons l2
           where l2.module_id = m.id
           order by l2.order_index
           limit 1
        ) l on true
       where not exists (
         select 1 from public.attempts a
          where a.worker_user_id = v_uid and a.lesson_id = l.id and a.passed
       )
       order by m.order_index
       limit 1;

      if v_siguiente is distinct from p_lesson_id then
        raise exception 'LECCION_FUERA_DE_ORDEN' using errcode = '22023';
      end if;
    end if;

    select last_completed_date into v_last_date
      from public.streaks where worker_user_id = v_uid;
    if v_last_date is not null and v_last_date >= v_today then
      raise exception 'YA_COMPLETO_HOY' using errcode = '22023';
    end if;
  end if;

  insert into public.attempts (worker_user_id, lesson_id, score, passed)
  values (v_uid, p_lesson_id, case when v_passed then 100 else 0 end, v_passed)
  returning id into v_attempt_id;

  if v_passed then
    if not exists (select 1 from public.streaks where worker_user_id = v_uid) then
      insert into public.streaks (worker_user_id, current_streak, longest_streak, last_completed_date)
      values (v_uid, 1, 1, v_today);
    elsif v_last_date = v_today - 1 then
      update public.streaks
        set current_streak = current_streak + 1,
            longest_streak = greatest(longest_streak, current_streak + 1),
            last_completed_date = v_today
        where worker_user_id = v_uid;
    else
      update public.streaks
        set current_streak = 1,
            longest_streak = greatest(longest_streak, 1),
            last_completed_date = v_today
        where worker_user_id = v_uid;
    end if;
    v_extendida := true;
  end if;

  return query
    select v_attempt_id, s.current_streak, s.longest_streak, v_extendida
    from public.streaks s where s.worker_user_id = v_uid
    union all
    select v_attempt_id, 0, 0, false
    where not exists (select 1 from public.streaks s2 where s2.worker_user_id = v_uid);
end;
$$;

revoke execute on function public.registrar_intento(uuid, int, date) from public, anon;
grant execute on function public.registrar_intento(uuid, int, date) to authenticated;

notify pgrst, 'reload schema';

-- Comprobación: debe salir UNA fila "registrar_intento(uuid,integer,date)" con volatil = v
select oid::regprocedure as funcion, provolatile as volatil
from pg_proc where proname = 'registrar_intento';
