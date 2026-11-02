-- Permite al owner/admin de una organización renombrarla desde app/panel (hoy nace con un
-- nombre derivado del correo, ver lib/activar-organizacion.ts). Solo faltaba el update policy:
-- la select ("miembros ven su organizacion") y el helper private.is_org_admin ya existían
-- desde 0001_init.sql.
create policy "admin de la org renombra su organizacion" on public.organizations
  for update using (private.is_org_admin(id)) with check (private.is_org_admin(id));
