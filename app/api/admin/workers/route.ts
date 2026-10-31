import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Da de alta un trabajador desde el panel del Gerente de HSE (app/panel). Patrón de
// ESTADO.md → Decisiones técnicas → Auth: el trabajador entra con código de cuadrilla + PIN,
// nunca con email/password — por eso necesita un usuario "sintético" en auth.users, que solo
// el servidor (service role) puede crear. Todo lo demás (crews/workers) se escribe con la
// sesión REAL del gerente, para que RLS (private.is_org_admin) sea quien decide si puede, no
// el servidor confiando en un org_id que mande el cliente.

function generarCodigoCuadrilla() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin O/0/I/1 (se confunden al dictarlo)
  let codigo = "";
  for (let i = 0; i < 6; i++) codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return codigo;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const fullName: string | undefined = body?.fullName?.trim();
  const pin: string | undefined = body?.pin?.trim();
  const crewId: string | undefined = body?.crewId;
  const newCrewName: string | undefined = body?.newCrewName?.trim();

  if (!fullName || !pin || !/^\d{4}$/.test(pin) || (!crewId && !newCrewName)) {
    return NextResponse.json({ error: "Faltan datos o el PIN no tiene 4 dígitos." }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // La sesión del gerente ya trae su propio org_id — nunca se confía en uno enviado por el cliente.
  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .maybeSingle<{ org_id: string }>();

  if (!membership) {
    return NextResponse.json({ error: "No tienes permiso para gestionar cuadrillas." }, { status: 403 });
  }
  const orgId = membership.org_id;

  // 1) Resolver la cuadrilla (RLS en `crews` ya impide ver/crear fuera de su propia org).
  let crew: { id: string; name: string; code: string };
  if (crewId) {
    const { data } = await supabase.from("crews").select("id, name, code").eq("id", crewId).maybeSingle();
    if (!data) {
      return NextResponse.json({ error: "No encontramos esa cuadrilla." }, { status: 400 });
    }
    crew = data;
  } else {
    let codigo = generarCodigoCuadrilla();
    let intento = 0;
    let creada: { id: string; name: string; code: string } | null = null;
    // Reintenta si el código al azar ya existe (muy improbable, pero el código es único).
    while (!creada && intento < 5) {
      const { data, error } = await supabase
        .from("crews")
        .insert({ org_id: orgId, name: newCrewName, code: codigo })
        .select("id, name, code")
        .single();
      if (!error) creada = data;
      else codigo = generarCodigoCuadrilla();
      intento++;
    }
    if (!creada) {
      return NextResponse.json({ error: "No pudimos crear la cuadrilla. Intenta de nuevo." }, { status: 500 });
    }
    crew = creada;
  }

  // 2) Crear el usuario sintético (nunca recibe email real: el trabajador entra con código+PIN).
  const admin = createAdminClient();
  const syntheticEmail = `worker-${randomUUID()}@workers.hse-master-app.internal`;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: syntheticEmail,
    email_confirm: true,
  });
  if (createErr || !created?.user) {
    return NextResponse.json({ error: "No pudimos crear el acceso del trabajador." }, { status: 500 });
  }

  // 3) Insertar en `workers` con la sesión del gerente (RLS valida que es admin de esta org).
  const pinHash = await bcrypt.hash(pin, 10);
  const { error: insertErr } = await supabase.from("workers").insert({
    user_id: created.user.id,
    org_id: orgId,
    crew_id: crew.id,
    full_name: fullName,
    pin_hash: pinHash,
    active: true,
  });

  if (insertErr) {
    await admin.auth.admin.deleteUser(created.user.id); // limpia el usuario huérfano
    return NextResponse.json({ error: "No pudimos guardar al trabajador. Intenta de nuevo." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    crew: { id: crew.id, name: crew.name, code: crew.code },
    worker: { id: created.user.id, fullName },
  });
}

// Edita un trabajador ya existente (heurística 3 — Control y libertad del usuario: un error
// de nombre o PIN al dar de alta debe poder corregirse). Renombrar y activar/desactivar van
// protegidos solo por RLS (misma sesión del gerente); el PIN se re-hashea aquí porque el
// cliente nunca debe calcular ni ver el hash.
export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const workerId: string | undefined = body?.workerId;
  const fullName: string | undefined = body?.fullName?.trim();
  const active: boolean | undefined = typeof body?.active === "boolean" ? body.active : undefined;
  const pin: string | undefined = body?.pin?.trim() || undefined;

  if (!workerId || (pin && !/^\d{4}$/.test(pin))) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cambios: Record<string, unknown> = {};
  if (fullName) cambios.full_name = fullName;
  if (active !== undefined) cambios.active = active;
  if (pin) cambios.pin_hash = await bcrypt.hash(pin, 10);

  if (Object.keys(cambios).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
  }

  // RLS ("admin de la org actualiza trabajadores") rechaza esto solo si el gerente intenta
  // editar un trabajador de otra organización — nunca hace falta validar el org_id a mano aquí.
  const { error } = await supabase.from("workers").update(cambios).eq("user_id", workerId);
  if (error) {
    return NextResponse.json({ error: "No pudimos guardar los cambios." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
