-- Endurece `registrar_intento`: usaba `set search_path = public, pg_temp` (0006), que ya evita
-- el ataque clásico de "search_path hijacking" pero no sigue el estándar más estricto del SO
-- (25-BASE-DE-DATOS.md / 27-REVISION-SEGURIDAD.md: SECURITY DEFINER SET search_path = '').
-- Todas las referencias dentro de la función ya estaban completamente calificadas
-- (`public.workers`, `public.attempts`, `public.streaks`, `auth.uid()`), así que el cambio no
-- afecta el comportamiento — solo cierra la ruta teórica de inyección de esquema.
create or replace function public.registrar_intento(
  p_lesson_id uuid,
  p_score int,
  p_passed boolean
)
returns table (
  attempt_id uuid,
  o_current_streak int,
  o_longest_streak int,
  racha_extendida boolean
)
language plpgsql security definer set search_path = '' stable
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

  if p_passed then
    select last_completed_date, current_streak, longest_streak
      into v_last_date, v_current, v_longest
      from public.streaks where worker_user_id = v_uid;

    if v_last_date is null then
      insert into public.streaks (worker_user_id, current_streak, longest_streak, last_completed_date)
      values (v_uid, 1, 1, v_today);
      v_extendida := true;
    elsif v_last_date = v_today then
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

-- `apply_hotmart_event` (0003) también usa SECURITY DEFINER sin `search_path = ''`: NO se toca
-- aquí a propósito — está a cargo exclusivamente del webhook (service role, nunca invocable por
-- un cliente, no tiene grant a `authenticated`/`anon`), así que el riesgo de secuestro de esquema
-- vía un rol atacante no aplica igual; se deja anotado en ESTADO.md como mejora de defensa en
-- profundidad para una sesión de seguridad dedicada, no bloqueante.
