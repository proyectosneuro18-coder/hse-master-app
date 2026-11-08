import { NextResponse, type NextRequest } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { olvidarEnAnalitica } from "@/lib/analytics-server";

// Derechos del titular (Ley 1581 de 2012 / 47-LEGAL-FISCAL-Y-PRIVACIDAD.md): el Gerente de HSE
// puede DESCARGAR todos los datos de su empresa (GET) y ELIMINAR su cuenta con todo lo que
// contiene (DELETE), sin escribirle a soporte. Ver ESTADO.md → Sesión 12.

type Membership = { org_id: string; role: "owner" | "admin" };

async function gerenteActual() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, membership: null };
  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .maybeSingle<Membership>();
  return { supabase, user, membership };
}

// ── DESCARGAR ──────────────────────────────────────────────────────────────────
// Usa la sesión del propio gerente (no el cliente admin): las reglas de seguridad de la base
// (RLS) garantizan que solo salgan datos de SU empresa. Nunca incluye el PIN (ni su hash) ni el
// código secreto del Pase QR.
export async function GET() {
  const { supabase, user, membership } = await gerenteActual();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!membership) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  const orgId = membership.org_id;
  const [org, crews, workers, modulos] = await Promise.all([
    supabase
      .from("organizations")
      .select("name, created_at, subscription_status, plan_name, trial_ends_at, access_until, first_paid_at")
      .eq("id", orgId)
      .maybeSingle(),
    supabase.from("crews").select("id, name, code, archived, created_at").eq("org_id", orgId).order("name"),
    supabase
      .from("workers")
      .select("user_id, full_name, crew_id, active, created_at, streaks(current_streak, longest_streak, last_completed_date)")
      .eq("org_id", orgId)
      .order("full_name"),
    supabase.from("modules").select("title, lessons(id)"),
  ]);

  if (org.error || crews.error || workers.error) {
    return NextResponse.json({ error: "No pudimos preparar tus datos. Intenta de nuevo." }, { status: 500 });
  }

  type W = {
    user_id: string;
    full_name: string;
    crew_id: string;
    active: boolean;
    created_at: string;
    streaks: { current_streak: number; longest_streak: number; last_completed_date: string | null } | null;
  };
  const listaWorkers = (workers.data ?? []) as unknown as W[];
  const ids = listaWorkers.map((w) => w.user_id);

  const intentos = ids.length
    ? await supabase
        .from("attempts")
        .select("worker_user_id, lesson_id, score, passed, completed_at")
        .in("worker_user_id", ids)
        .order("completed_at")
    : { data: [], error: null };
  if (intentos.error) {
    return NextResponse.json({ error: "No pudimos preparar tus datos. Intenta de nuevo." }, { status: 500 });
  }

  const nombreCuadrilla = new Map((crews.data ?? []).map((c) => [c.id as string, c.name as string]));
  const nombreTrabajador = new Map(listaWorkers.map((w) => [w.user_id, w.full_name]));
  const tituloModulo = new Map<string, string>();
  for (const m of (modulos.data ?? []) as unknown as { title: string; lessons: { id: string }[] | null }[]) {
    for (const l of m.lessons ?? []) tituloModulo.set(l.id, m.title);
  }

  const exportacion = {
    descripcion:
      "Copia de todos los datos de tu empresa guardados en HSE Master App. No incluye los PIN de los trabajadores: se guardan cifrados y nadie puede leerlos.",
    exportado_el: new Date().toISOString(),
    tu_cuenta: { correo: user.email, rol: membership.role === "owner" ? "dueño" : "administrador" },
    empresa: org.data,
    cuadrillas: (crews.data ?? []).map((c) => ({
      nombre: c.name,
      codigo: c.code,
      archivada: c.archived ?? false,
      creada_el: c.created_at,
    })),
    trabajadores: listaWorkers.map((w) => ({
      nombre: w.full_name,
      cuadrilla: nombreCuadrilla.get(w.crew_id) ?? null,
      activo: w.active,
      dado_de_alta_el: w.created_at,
      racha_actual: w.streaks?.current_streak ?? 0,
      racha_mas_larga: w.streaks?.longest_streak ?? 0,
      ultimo_reto_el: w.streaks?.last_completed_date ?? null,
    })),
    retos_respondidos: (intentos.data ?? []).map((a) => ({
      trabajador: nombreTrabajador.get(a.worker_user_id as string) ?? null,
      modulo: tituloModulo.get(a.lesson_id as string) ?? null,
      puntaje: a.score,
      aprobado: a.passed,
      fecha: a.completed_at,
    })),
  };

  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(exportacion, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="hse-master-app-mis-datos-${fecha}.json"`,
      "Cache-Control": "no-store",
    },
  });
}

// ── ELIMINAR ───────────────────────────────────────────────────────────────────
// Borra la empresa completa: cuentas de los trabajadores (y con ellas sus retos, rachas y
// Pases, por cascada), cuadrillas, membresías y la cuenta del propio dueño. Irreversible.
// Reglas:
//  - Solo el DUEÑO (owner) puede hacerlo, no un administrador invitado.
//  - Debe escribir "ELIMINAR" (confirmación explícita, se valida también aquí, no solo en pantalla).
//  - Si tiene una suscripción con cobro vigente (active / past_due), primero debe cancelarla en
//    Hotmart: si no, Hotmart seguiría cobrando por una cuenta que ya no existe.
// Lo que NO se borra: el registro económico de pagos (`payment_transactions`, sin datos
// personales — solo monto/moneda/ID de Hotmart, obligatorio para la contabilidad) y el log del
// webhook (sin datos personales). Hotmart conserva sus propios datos de la compra.
export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (String(body?.confirmacion ?? "").trim().toUpperCase() !== "ELIMINAR") {
    return NextResponse.json({ error: 'Escribe "ELIMINAR" para confirmar.' }, { status: 400 });
  }

  const { user, membership } = await gerenteActual();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!membership) return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  if (membership.role !== "owner") {
    return NextResponse.json(
      { error: "Solo el dueño de la cuenta puede eliminarla. Pídeselo a quien la creó." },
      { status: 403 },
    );
  }

  const admin = createAdminClient();
  const orgId = membership.org_id;

  const { data: org } = await admin
    .from("organizations")
    .select("subscription_status")
    .eq("id", orgId)
    .maybeSingle<{ subscription_status: string }>();
  if (org && ["active", "past_due"].includes(org.subscription_status)) {
    return NextResponse.json(
      {
        error:
          "Tienes una suscripción con cobro vigente. Cancélala primero en Hotmart (así no te vuelven a cobrar) y luego elimina tu cuenta aquí.",
        codigo: "SUSCRIPCION_VIGENTE",
      },
      { status: 409 },
    );
  }

  // 1) Cuentas de los trabajadores (su login no es un correo real; borrarlas arrastra sus
  //    retos, rachas y Pases por cascada).
  const { data: workers, error: workersErr } = await admin.from("workers").select("user_id").eq("org_id", orgId);
  if (workersErr) {
    return NextResponse.json({ error: "No pudimos eliminar tu cuenta. Intenta de nuevo." }, { status: 500 });
  }
  for (const w of workers ?? []) {
    const { error } = await admin.auth.admin.deleteUser(w.user_id as string);
    if (error && !/not found/i.test(error.message)) {
      // Se puede reintentar sin riesgo: lo ya borrado no se vuelve a tocar.
      return NextResponse.json(
        { error: "Se borró solo una parte de tus datos. Vuelve a intentarlo para terminar." },
        { status: 500 },
      );
    }
  }

  // 2) La empresa (cuadrillas y membresías se van por cascada).
  const { error: orgErr } = await admin.from("organizations").delete().eq("id", orgId);
  if (orgErr) {
    return NextResponse.json(
      { error: "Se borró solo una parte de tus datos. Vuelve a intentarlo para terminar." },
      { status: 500 },
    );
  }

  // 3) La cuenta del propio dueño.
  const { error: ownerErr } = await admin.auth.admin.deleteUser(user.id);
  if (ownerErr && !/not found/i.test(ownerErr.message)) {
    return NextResponse.json(
      { error: "Se borró solo una parte de tus datos. Vuelve a intentarlo para terminar." },
      { status: 500 },
    );
  }

  // 4) Sus mediciones en PostHog (solo códigos internos, nunca nombre ni correo).
  const ids = [user.id, ...(workers ?? []).map((w) => w.user_id as string)];
  const analitica = await olvidarEnAnalitica(ids);

  // Registro de auditoría sin datos personales (47-LEGAL → Derecho a eliminación).
  console.info(
    `[cuenta-eliminada] org=${orgId} trabajadores=${workers?.length ?? 0} analitica=${analitica.pendiente ? "pendiente" : analitica.borrados} at=${new Date().toISOString()}`,
  );
  return NextResponse.json({ ok: true });
}
