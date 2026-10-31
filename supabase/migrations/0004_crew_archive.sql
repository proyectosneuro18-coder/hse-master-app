-- Permite archivar (soft-delete) una cuadrilla creada por error desde app/panel.
-- Solo se archivan cuadrillas VACÍAS (sin trabajadores) — ver validación en
-- app/api/admin/crews/route.ts; así nunca se oculta el acceso de un trabajador real.
alter table public.crews
  add column if not exists archived boolean not null default false;

-- El panel (app/panel/page.tsx) solo lista cuadrillas activas; las RLS existentes
-- (private.is_org_admin) ya cubren el acceso, esta columna solo filtra qué se muestra.
