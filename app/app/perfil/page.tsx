import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PerfilClient } from "./PerfilClient";

// Lee cookies() de la sesión real del trabajador — nunca se puede prerenderizar ni cachear
// entre visitantes (Next 16 + cacheComponents exige este opt-in explícito o falla el build).
export const instant = false;

type ModuloConLeccion = { title: string; lessons: { id: string }[] | null };

// Migrada desde perfil.html (ACEPTADA CON OBSERVACIONES, ronda 3 — ver ESTADO.md →
// veredicto:perfil). Desde la auditoría de integridad de lanzamiento (2026-11-02,
// docs/release/CLAIMS-LEDGER.md) "El Pase" dejó de ser dato de demostración: nombre, cuadrilla,
// racha, vigencia y competencias (módulos aprobados) vienen de Supabase, y el QR codifica el
// `pase_token` real del trabajador (migración 0010_pase_digital.sql) hacia la página pública de
// verificación `/pase/[token]`. "Nivel" y "Vidas" en esta pantalla siguen siendo ilustrativos
// (mismas mecánicas sin definir en el esquema que en la pantalla principal).
export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: worker } = await supabase
    .from("workers")
    .select("full_name, pase_token, crews(name)")
    .eq("user_id", user.id)
    .maybeSingle<{ full_name: string; pase_token: string; crews: { name: string } | null }>();
  if (!worker) redirect("/panel"); // es el Gerente de HSE, no un trabajador

  const { data: streak } = await supabase
    .from("streaks")
    .select("current_streak, last_completed_date")
    .eq("worker_user_id", user.id)
    .maybeSingle<{ current_streak: number; last_completed_date: string | null }>();

  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const fechasVigentes = [hoy.toISOString().slice(0, 10), ayer.toISOString().slice(0, 10)];
  const estaVigente = !!streak?.last_completed_date && fechasVigentes.includes(streak.last_completed_date);

  const { data: modulos } = await supabase
    .from("modules")
    .select("title, lessons(id)")
    .order("order_index");
  const modulosTyped = (modulos ?? []) as unknown as ModuloConLeccion[];

  const { data: intentos } = await supabase
    .from("attempts")
    .select("lesson_id")
    .eq("worker_user_id", user.id)
    .eq("passed", true);
  const aprobadas = new Set((intentos ?? []).map((a) => a.lesson_id as string));
  const competencias = modulosTyped
    .filter((m) => m.lessons?.[0] && aprobadas.has(m.lessons[0].id))
    .map((m) => m.title);

  return (
    <PerfilClient
      nombreCompleto={worker.full_name}
      cuadrillaNombre={worker.crews?.name ?? "Tu cuadrilla"}
      paseToken={worker.pase_token}
      currentStreak={streak?.current_streak ?? 0}
      estaVigente={estaVigente}
      competencias={competencias}
    />
  );
}
