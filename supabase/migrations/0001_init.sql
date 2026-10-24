-- HSE Master App — esquema inicial (multi-tenant: organización + membresías)
-- Patrón canónico: docs/sistema/25-BASE-DE-DATOS.md (RLS rápido) + 09-SEGURIDAD.md

create schema if not exists private;

-- ── ORGANIZACIONES Y MEMBRESÍAS ─────────────────────────────────────────────
-- Una organización = la empresa contratista/operadora que paga la suscripción.
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- owner/admin = Gerente de HSE (compra y ve el dashboard); worker = trabajador de campo.
create table public.memberships (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'worker' check (role in ('owner', 'admin', 'worker')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index memberships_user_idx on public.memberships(user_id);

-- Helper security definer: evita RLS recursivo al consultar memberships desde otras políticas.
create or replace function private.is_org_admin(p_org_id uuid)
returns boolean
language sql security definer set search_path = '' stable
as $$
  select exists (
    select 1 from public.memberships
    where org_id = p_org_id
      and user_id = (select auth.uid())
      and role in ('owner', 'admin')
  );
$$;
revoke execute on function private.is_org_admin(uuid) from anon, authenticated;
grant execute on function private.is_org_admin(uuid) to authenticated;

create or replace function private.is_org_member(p_org_id uuid)
returns boolean
language sql security definer set search_path = '' stable
as $$
  select exists (
    select 1 from public.memberships
    where org_id = p_org_id and user_id = (select auth.uid())
  );
$$;
revoke execute on function private.is_org_member(uuid) from anon, authenticated;
grant execute on function private.is_org_member(uuid) to authenticated;

alter table public.organizations enable row level security;
create policy "miembros ven su organizacion" on public.organizations
  for select using (private.is_org_member(id));

alter table public.memberships enable row level security;
create policy "ve su propia membresia o es admin de la org" on public.memberships
  for select using (
    user_id = (select auth.uid()) or private.is_org_admin(org_id)
  );

-- ── CUADRILLAS ───────────────────────────────────────────────────────────────
create table public.crews (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null unique, -- código de cuadrilla (login del trabajador, no es secreto)
  created_at timestamptz not null default now()
);
create index crews_org_idx on public.crews(org_id);

alter table public.crews enable row level security;
create policy "admin de la org gestiona cuadrillas" on public.crews
  for all using (private.is_org_admin(org_id)) with check (private.is_org_admin(org_id));
create policy "worker ve su propia cuadrilla" on public.crews
  for select using (
    exists (select 1 from public.workers w where w.crew_id = crews.id and w.user_id = (select auth.uid()))
  );

-- ── TRABAJADORES (auth.users sintético: código de cuadrilla + PIN, ver 26) ───
create table public.workers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  crew_id uuid not null references public.crews(id) on delete cascade,
  full_name text not null,
  pin_hash text not null, -- hash del PIN de 4 dígitos (bcrypt), validado en el servidor
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index workers_org_idx on public.workers(org_id);
create index workers_crew_idx on public.workers(crew_id);

create or replace function private.is_org_admin_of_worker(p_worker_user_id uuid)
returns boolean
language sql security definer set search_path = '' stable
as $$
  select exists (
    select 1 from public.workers w
    where w.user_id = p_worker_user_id and private.is_org_admin(w.org_id)
  );
$$;
revoke execute on function private.is_org_admin_of_worker(uuid) from anon, authenticated;
grant execute on function private.is_org_admin_of_worker(uuid) to authenticated;

alter table public.workers enable row level security;
create policy "worker ve su propia fila o su admin la ve" on public.workers
  for select using (
    user_id = (select auth.uid()) or private.is_org_admin(org_id)
  );
create policy "admin de la org gestiona trabajadores" on public.workers
  for insert with check (private.is_org_admin(org_id));
create policy "admin de la org actualiza trabajadores" on public.workers
  for update using (private.is_org_admin(org_id)) with check (private.is_org_admin(org_id));
create policy "admin de la org elimina trabajadores" on public.workers
  for delete using (private.is_org_admin(org_id));

-- ── CONTENIDO CURADO (global, no pertenece a ninguna organización) ──────────
-- "Las 9 Reglas que Salvan Vidas" — ver progreso.html / FICHA-MODELO.md.
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  order_index int not null,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  order_index int not null,
  content jsonb not null default '{}'::jsonb, -- micro-módulo de 3 min + trivia
  created_at timestamptz not null default now()
);
create index lessons_module_idx on public.lessons(module_id);

-- Contenido global: cualquier usuario autenticado lo lee; solo se escribe desde el
-- panel de administración del SO (service role) — ninguna policy de insert/update/delete.
alter table public.modules enable row level security;
create policy "autenticados leen los modulos" on public.modules
  for select to authenticated using (true);

alter table public.lessons enable row level security;
create policy "autenticados leen las lecciones" on public.lessons
  for select to authenticated using (true);

-- ── PROGRESO POR TRABAJADOR ───────────────────────────────────────────────────
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  worker_user_id uuid not null references public.workers(user_id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  score int,
  passed boolean not null default false,
  completed_at timestamptz not null default now()
);
create index attempts_worker_completed_idx on public.attempts(worker_user_id, completed_at desc);
create index attempts_lesson_idx on public.attempts(lesson_id);

alter table public.attempts enable row level security;
create policy "worker ve y registra sus propios intentos" on public.attempts
  for select using (
    worker_user_id = (select auth.uid()) or private.is_org_admin_of_worker(worker_user_id)
  );
create policy "worker inserta sus propios intentos" on public.attempts
  for insert with check (worker_user_id = (select auth.uid()));

-- ── RACHAS ────────────────────────────────────────────────────────────────────
create table public.streaks (
  worker_user_id uuid primary key references public.workers(user_id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_completed_date date
);

alter table public.streaks enable row level security;
create policy "worker ve su racha o su admin la ve" on public.streaks
  for select using (
    worker_user_id = (select auth.uid()) or private.is_org_admin_of_worker(worker_user_id)
  );
-- Las rachas se actualizan SOLO vía la RPC transaccional registrar_intento() (ver 0002):
-- sin policy de insert/update para el cliente — evita que el usuario se auto-otorgue racha.

-- ── PASAPORTE DIGITAL QR ──────────────────────────────────────────────────────
create table public.qr_passes (
  worker_user_id uuid primary key references public.workers(user_id) on delete cascade,
  token text not null unique,
  issued_at timestamptz not null default now()
);

alter table public.qr_passes enable row level security;
create policy "worker ve su propio pase o su admin lo ve" on public.qr_passes
  for select using (
    worker_user_id = (select auth.uid()) or private.is_org_admin_of_worker(worker_user_id)
  );
