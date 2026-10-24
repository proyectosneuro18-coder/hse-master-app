-- RPC transaccional: registrar un intento Y actualizar la racha en la misma transacción.
-- Es el corazón del LOOP de retención (gatillo→acción→recompensa→inversión, Regla de Oro 6a):
-- el intento de hoy cambia la racha que la app muestra mañana. Atómica por defecto (todo el
-- cuerpo de una función Postgres corre en una transacción) — ver 25-BASE-DE-DATOS.md.

create or replace function public.registrar_intento(
  p_lesson_id uuid,
  p_score int,
  p_passed boolean
)
returns table (
  attempt_id uuid,
  current_streak int,
  longest_streak int,
  racha_extendida boolean
)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := (select auth.uid());
  v_attempt_id uuid;
  v_last_date date;
  v_current int;
  v_longest int;
  v_today date := current_date;
  v_extendida boolean := false;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.workers where user_id = v_uid and active) then
    raise exception 'NOT_A_WORKER' using errcode = 'P0001';
  end if;

  insert into public.attempts (worker_user_id, lesson_id, score, passed)
  values (v_uid, p_lesson_id, p_score, p_passed)
  returning id into v_attempt_id;

  -- Solo un intento APROBADO alimenta la racha (gatillo real, no cualquier intento).
  if p_passed then
    select last_completed_date, current_streak, longest_streak
      into v_last_date, v_current, v_longest
      from public.streaks where worker_user_id = v_uid;

    if v_last_date is null then
      insert into public.streaks (worker_user_id, current_streak, longest_streak, last_completed_date)
      values (v_uid, 1, 1, v_today);
      v_extendida := true;
    elsif v_last_date = v_today then
      -- ya se contó hoy: no duplicar la racha por un segundo módulo el mismo día.
      v_extendida := false;
    elsif v_last_date = v_today - 1 then
      update public.streaks
        set current_streak = current_streak + 1,
            longest_streak = greatest(longest_streak, current_streak + 1),
            last_completed_date = v_today
        where worker_user_id = v_uid;
      v_extendida := true;
    else
      -- racha rota: se reinicia en 1 (el win-back/racha-rota lo diseña 56 en la UI).
      update public.streaks
        set current_streak = 1,
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

revoke execute on function public.registrar_intento(uuid, int, boolean) from public, anon;
grant execute on function public.registrar_intento(uuid, int, boolean) to authenticated;
