import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelClient, type CrewConDatos, type EstadoSuscripcion } from "./PanelClient";

// Lee cookies() de la sesión real de cada Gerente de HSE — nunca se puede prerenderizar ni
// cachear entre visitantes (Next 16 + cacheComponents exige este opt-in explícito o falla el build).
export const instant = false;

// Panel del Gerente de HSE (owner/admin) — ver y dar de alta su cuadrilla. Pantalla NUEVA
// (primer ejemplar de este tipo: dashboard denso, no el ritual diario del trabajador), ver
// ESTADO.md → "Próximas sesiones" (Sesión 7). Workers NO entran aquí: redirige a /app.
export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, role")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .maybeSingle<{ org_id: string; role: string }>();

  if (!membership) redirect("/app"); // es un trabajador, no el Gerente de HSE

  const { data: org } = await supabase
    .from("organizations")
    .select("name, subscription_status, trial_ends_at, access_until, grace_ends_at, plan_name")
    .eq("id", membership.org_id)
    .single<{
      name: string;
      subscription_status: EstadoSuscripcion;
      trial_ends_at: string | null;
      access_until: string | null;
      grace_ends_at: string | null;
      plan_name: string | null;
    }>();

  // Filtra por `archived` (migración 0004); si esa columna aún no existe en esta base de
  // datos, reintenta sin el filtro — así el panel sigue funcionando mientras el usuario corre
  // la migración, en vez de mostrarse vacío por un error silencioso de columna inexistente.
  const consultaCrews = () =>
    supabase
      .from("crews")
      .select("id, name, code, workers(user_id, full_name, active, streaks(current_streak, last_completed_date))")
      .eq("org_id", membership.org_id)
      .order("name");

  const primerIntento = await consultaCrews().eq("archived", false);
  let crews = primerIntento.data;
  if (primerIntento.error) {
    ({ data: crews } = await consultaCrews());
  }

  const crewsConDatos = (crews ?? []) as unknown as CrewConDatos[];

  return (
    <PanelClient
      orgName={org?.name ?? "Tu empresa"}
      ownerEmail={user.email ?? ""}
      estado={org?.subscription_status ?? "trialing"}
      trialEndsAt={org?.trial_ends_at ?? null}
      accessUntil={org?.access_until ?? null}
      graceEndsAt={org?.grace_ends_at ?? null}
      planName={org?.plan_name ?? null}
      crews={crewsConDatos}
    />
  );
}
