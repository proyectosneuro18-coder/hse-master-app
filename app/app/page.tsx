import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { evaluarAcceso, type SubscriptionStatus } from "@/lib/membership-fsm";
import { crearOrganizacionParaNuevoUsuario } from "@/lib/activar-organizacion";
import { AppHomeClient, type RetoHoy } from "./AppHomeClient";

// Lee cookies() de la sesión real del trabajador — nunca se puede prerenderizar ni cachear
// entre visitantes (Next 16 + cacheComponents exige este opt-in explícito o falla el build).
export const instant = false;

type ModuloConLeccion = {
  id: string;
  title: string;
  order_index: number;
  lessons: { id: string; content: unknown }[] | null;
};

type ContenidoLeccion = {
  intro?: string;
  pregunta?: string;
  opciones?: string[];
  respuesta_correcta?: number;
  explicacion?: string;
};

// Ritual diario del trabajador (M0) — ver ESTADO.md → veredicto:app-principal. Desde la
// Sesión 7 trae el reto, la racha y el progreso de módulos reales de Supabase en vez de los
// datos de demostración originales (ver AppHomeClient.tsx para el detalle de qué sigue siendo
// ilustrativo: vidas, ranking cruzado, el insight de "El Pase").
export default async function AppHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .maybeSingle();
  if (membership) redirect("/panel"); // es el Gerente de HSE, no un trabajador

  const { data: worker } = await supabase
    .from("workers")
    .select("full_name, org_id")
    .eq("user_id", user.id)
    .maybeSingle<{ full_name: string; org_id: string }>();

  if (!worker) {
    // Autenticado, sin membresía de owner/admin y sin fila en `workers`: la única forma de
    // llegar aquí así es haber iniciado sesión por primera vez como Gerente de HSE (un
    // trabajador siempre llega con su fila de `workers` ya creada por worker-login). Le nace
    // su organización con la prueba de 14 días ya activa (ver lib/activar-organizacion.ts).
    await crearOrganizacionParaNuevoUsuario(user.id, user.email);
    redirect("/panel");
  }

  // RLS de `organizations` solo deja leer a quien tiene una fila en `memberships` (owner/admin);
  // un trabajador no la tiene (ver ESTADO.md → Decisiones técnicas → Modelo de datos), así que
  // esta lectura puntual usa el cliente admin — `worker.org_id` ya viene de una fila de `workers`
  // scopeada al propio usuario autenticado arriba, nunca de algo que mande el cliente.
  const admin = createAdminClient();
  const { data: org } = await admin
    .from("organizations")
    .select("subscription_status, trial_ends_at, access_until, grace_ends_at")
    .eq("id", worker.org_id)
    .maybeSingle<{
      subscription_status: SubscriptionStatus;
      trial_ends_at: string | null;
      access_until: string | null;
      grace_ends_at: string | null;
    }>();

  const acceso = evaluarAcceso(org?.subscription_status ?? "trialing", new Date(), {
    trialEndsAt: org?.trial_ends_at ? new Date(org.trial_ends_at) : null,
    accessUntil: org?.access_until ? new Date(org.access_until) : null,
    graceEndsAt: org?.grace_ends_at ? new Date(org.grace_ends_at) : null,
  });
  if (!acceso.tieneAcceso) redirect(`/acceso-vencido?motivo=${acceso.motivo}`);

  const { data: streak } = await supabase
    .from("streaks")
    .select("current_streak, last_completed_date")
    .eq("worker_user_id", user.id)
    .maybeSingle<{ current_streak: number; last_completed_date: string | null }>();

  // "¿Ya lo hizo hoy?" se decide en el celular con su fecha LOCAL (AppHomeClient), no aquí: el
  // servidor corre en UTC y en Colombia (UTC-5) un reto de las 8 p. m. caía en "mañana".

  const { data: modulos } = await supabase
    .from("modules")
    .select("id, title, order_index, lessons(id, content)")
    .order("order_index");
  const modulosTyped = (modulos ?? []) as unknown as ModuloConLeccion[];
  const totalModulos = modulosTyped.length;

  const { data: intentos } = await supabase
    .from("attempts")
    .select("lesson_id")
    .eq("worker_user_id", user.id)
    .eq("passed", true);
  const aprobadas = new Set((intentos ?? []).map((a) => a.lesson_id as string));
  const modulosAprobados = modulosTyped.filter((m) => m.lessons?.[0] && aprobadas.has(m.lessons[0].id)).length;

  const retoModulo =
    modulosTyped.find((m) => m.lessons?.[0] && !aprobadas.has(m.lessons[0].id)) ?? modulosTyped[0];
  const leccion = retoModulo?.lessons?.[0] ?? null;
  const contenido = (leccion?.content ?? {}) as ContenidoLeccion;

  const reto: RetoHoy = {
    leccionId: leccion?.id ?? null,
    moduloTitulo: retoModulo?.title ?? "Tu reto de hoy",
    intro: contenido.intro ?? "",
    pregunta: contenido.pregunta ?? "",
    opciones: contenido.opciones ?? [],
    respuestaCorrecta: contenido.respuesta_correcta ?? 0,
    explicacion: contenido.explicacion ?? "",
  };

  const { data: ranking } = await supabase.rpc("obtener_ranking_cuadrillas", { p_periodo: "semana" });
  const filasRanking = (ranking ?? []) as { o_crew_id: string; o_es_mia: boolean }[];
  const posicionRanking = filasRanking.findIndex((f) => f.o_es_mia) + 1 || null;

  return (
    <AppHomeClient
      nombreTrabajador={worker.full_name}
      userId={user.id}
      rachaInicial={streak?.current_streak ?? 0}
      ultimaFechaCompletada={streak?.last_completed_date ?? null}
      modulosAprobados={modulosAprobados}
      totalModulos={totalModulos}
      reto={reto}
      posicionRanking={posicionRanking}
      totalCuadrillas={filasRanking.length}
    />
  );
}
