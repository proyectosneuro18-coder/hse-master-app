-- RPC para el ranking real de cuadrillas (app/app/ranking + el chip "Ranking" de la pantalla
-- principal, ver `chips-ilustrativos-app-principal` en ESTADO.md). Antes mostraban datos de
-- demostración fijos porque RLS de `attempts` solo deja ver intentos propios o, si eres
-- admin, los de tu organización (`private.is_org_admin_of_worker`) — un trabajador normal
-- NUNCA puede leer los intentos de otro trabajador directamente, ni siquiera de su misma
-- cuadrilla. Esta función agrega los puntos POR CUADRILLA (nunca expone el intento individual
-- de otro trabajador) y corre con los privilegios del dueño de la función (security definer),
-- así que puede cruzar cuadrillas sin necesitar abrir la RLS de `attempts`.
create or replace function public.obtener_ranking_cuadrillas(p_periodo text default 'semana')
returns table (o_crew_id uuid, o_crew_name text, o_total_pts bigint, o_es_mia boolean)
language plpgsql security definer set search_path = '' stable
as $$
declare
  v_uid uuid := (select auth.uid());
  v_org_id uuid;
  v_crew_id uuid;
  v_desde timestamptz;
begin
  select org_id, crew_id into v_org_id, v_crew_id from public.workers where user_id = v_uid;
  if v_org_id is null then
    -- también lo puede llamar un Gerente de HSE (owner/admin) sin fila en `workers`
    select org_id into v_org_id from public.memberships
      where user_id = v_uid and role in ('owner', 'admin') limit 1;
  end if;
  if v_org_id is null then
    return;
  end if;

  v_desde := case when p_periodo = 'mes' then date_trunc('month', now()) else now() - interval '7 days' end;

  return query
    select c.id, c.name, coalesce(sum(a.score), 0)::bigint, c.id = v_crew_id
    from public.crews c
    left join public.workers w on w.crew_id = c.id
    left join public.attempts a on a.worker_user_id = w.user_id and a.completed_at >= v_desde and a.passed
    where c.org_id = v_org_id and not c.archived
    group by c.id, c.name
    order by coalesce(sum(a.score), 0) desc, c.name;
end;
$$;
revoke execute on function public.obtener_ranking_cuadrillas(text) from anon;
grant execute on function public.obtener_ranking_cuadrillas(text) to authenticated;
