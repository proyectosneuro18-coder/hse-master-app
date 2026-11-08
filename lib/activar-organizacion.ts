import { createAdminClient } from "@/lib/supabase/admin";
import { trackServidor } from "@/lib/analytics-server";

const DIAS_PRUEBA = 14;

function nombreDesdeEmail(email: string) {
  const usuario = email.split("@")[0] ?? "Mi empresa";
  const limpio = usuario.replace(/[._-]+/g, " ").trim();
  return limpio ? limpio.charAt(0).toUpperCase() + limpio.slice(1) : "Mi empresa";
}

// Se llama UNA sola vez: cuando un usuario autenticado no tiene ni membresía (Gerente de HSE)
// ni fila en `workers` (trabajador) — la única forma de llegar ahí es haber iniciado sesión
// por primera vez como Gerente de HSE (ver app/app/page.tsx). Crea su organización con la
// prueba gratis de `DIAS_PRUEBA` días ya activa (ver ESTADO.md → Estrategia de monetización:
// trial-first, sin tarjeta) y lo deja como dueño (`owner`).
//
// Usa el cliente admin porque `organizations`/`memberships` no tienen política de INSERT para
// usuarios normales (ver 0001_init.sql) — solo el servidor puede dar de alta una organización.
export async function crearOrganizacionParaNuevoUsuario(userId: string, email: string | undefined) {
  const admin = createAdminClient();

  const trialEndsAt = new Date(Date.now() + DIAS_PRUEBA * 24 * 3600 * 1000).toISOString();

  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .insert({ name: nombreDesdeEmail(email ?? "Mi empresa"), subscription_status: "trialing", trial_ends_at: trialEndsAt })
    .select("id")
    .single();
  if (orgErr || !org) throw new Error(orgErr?.message ?? "No se pudo crear la organización");

  const { error: membershipErr } = await admin
    .from("memberships")
    .insert({ org_id: org.id, user_id: userId, role: "owner" });
  if (membershipErr) throw new Error(membershipErr.message);

  // Analítica server-side (36): la prueba gratis empieza aquí, no en Hotmart (modelo trial-first).
  await trackServidor(userId, "trial_iniciado", { dias_prueba: DIAS_PRUEBA });

  return org.id;
}
