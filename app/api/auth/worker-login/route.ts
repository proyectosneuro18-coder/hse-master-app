import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Login del trabajador de campo: código de cuadrilla (no es secreto) + PIN personal
// de 4 dígitos (ver ESTADO.md → Decisiones técnicas → Auth). Flujo:
//   GET  ?code=XXXX   → lista los nombres de la cuadrilla (para que el trabajador elija el suyo)
//   POST { code, workerUserId, pin } → valida el PIN y abre sesión real (sin contraseña visible)

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Falta el código de cuadrilla." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: crew } = await admin
    .from("crews")
    .select("id, name")
    .eq("code", code)
    .maybeSingle();

  if (!crew) {
    return NextResponse.json({ error: "No encontramos esa cuadrilla. Revisa el código." }, { status: 404 });
  }

  const { data: workers } = await admin
    .from("workers")
    .select("user_id, full_name")
    .eq("crew_id", crew.id)
    .eq("active", true)
    .order("full_name");

  return NextResponse.json({
    crewName: crew.name,
    workers: (workers ?? []).map((w) => ({ id: w.user_id, fullName: w.full_name })),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = body?.code?.trim().toUpperCase();
  const workerUserId = body?.workerUserId;
  const pin = body?.pin?.trim();

  if (!code || !workerUserId || !pin) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Revalida que el trabajador SÍ pertenece a la cuadrilla de ese código (nunca confiar
  // en lo que mandó el cliente sin cruzarlo contra la base de datos).
  const { data: worker } = await admin
    .from("workers")
    .select("user_id, pin_hash, active, crew_id, crews!inner(code)")
    .eq("user_id", workerUserId)
    .eq("active", true)
    .maybeSingle<{ user_id: string; pin_hash: string; active: boolean; crew_id: string; crews: { code: string } }>();

  // Mensaje de error genérico (anti-enumeración, ver 26-AUTH-MODERNO.md): nunca revelar
  // si el problema fue "cuadrilla equivocada" vs. "PIN equivocado" vs. "no existe".
  const credencialesInvalidas = () =>
    NextResponse.json({ error: "Código o PIN incorrectos." }, { status: 401 });

  if (!worker || worker.crews.code !== code) {
    return credencialesInvalidas();
  }

  const pinValido = await bcrypt.compare(pin, worker.pin_hash);
  if (!pinValido) {
    return credencialesInvalidas();
  }

  const { data: userData, error: userErr } = await admin.auth.admin.getUserById(workerUserId);
  if (userErr || !userData?.user?.email) {
    return NextResponse.json({ error: "No pudimos iniciar tu sesión. Intenta de nuevo." }, { status: 500 });
  }

  // Abre sesión real SIN contraseña visible: genera un enlace mágico de un solo uso
  // server-side y lo canjea de inmediato por una sesión (nunca se envía ningún email).
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: userData.user.email,
  });
  const hashedToken = linkData?.properties?.hashed_token;
  if (linkErr || !hashedToken) {
    return NextResponse.json({ error: "No pudimos iniciar tu sesión. Intenta de nuevo." }, { status: 500 });
  }

  const supabase = await createServerClient();
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: hashedToken,
  });
  if (verifyErr) {
    return NextResponse.json({ error: "No pudimos iniciar tu sesión. Intenta de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
