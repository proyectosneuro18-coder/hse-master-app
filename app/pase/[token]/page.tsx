import { createClient } from "@/lib/supabase/server";
import { CircleCheck, CircleX, ShieldAlert } from "lucide-react";

// Lee un parámetro dinámico de ruta en tiempo de petición (no se puede prerenderizar de forma
// estática: cada token real debe consultarse en el momento) — Next 16 + cacheComponents exige
// este opt-in explícito o falla el build.
export const instant = false;

type ResultadoPase = {
  o_nombre: string;
  o_cuadrilla: string;
  o_vigente: boolean;
  o_current_streak: number;
  o_competencias: string[];
};

// Página PÚBLICA (sin login) que ve un supervisor en el pozo al escanear el QR del pasaporte de
// un trabajador (app/app/perfil). Construida el 2026-11-02 tras la auditoría de integridad de
// lanzamiento (docs/release/CLAIMS-LEDGER.md): "El Pase" era solo una promesa de venta sin
// implementación real. El RPC `verificar_pase` (migración 0010) solo expone lo mínimo necesario
// para decidir si dejar pasar al trabajador — nunca email, PIN ni el historial de intentos.
export default async function PasePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("verificar_pase", { p_token: token });
  const resultado = (data?.[0] ?? null) as ResultadoPase | null;

  return (
    <div className="min-h-dvh font-[family-name:var(--hse-font-body)] text-[var(--hse-ink)] bg-[var(--hse-neutro-antes)]">
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-4 py-10">
        <div className="flex items-center justify-center gap-2 pb-2">
          <span className="size-6 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)]" />
          <span className="font-[family-name:var(--hse-font-display)] text-sm font-extrabold">HSE Master App</span>
        </div>

        {!resultado ? (
          <div className="flex flex-col items-center gap-3 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] p-8 text-center shadow-[0_4px_0_var(--hse-neutro-track)]">
            <ShieldAlert className="size-10 text-[var(--hse-ink-2)]" strokeWidth={2} />
            <h1 className="font-[family-name:var(--hse-font-display)] text-lg font-bold">Pase no válido</h1>
            <p className="text-sm text-[var(--hse-ink-2)]">
              Este código no corresponde a ningún trabajador activo. Puede estar mal escaneado o
              pertenecer a alguien que ya no está en la cuadrilla.
            </p>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center gap-3 rounded-[var(--hse-radius-boton)] border-2 p-8 text-center shadow-[0_4px_0_var(--hse-neutro-track)] ${
              resultado.o_vigente
                ? "border-[var(--hse-verde-sombra)] bg-[color-mix(in_oklab,var(--hse-verde)_14%,var(--hse-surface))]"
                : "border-[var(--hse-rojo-texto)] bg-[color-mix(in_oklab,var(--hse-rojo)_12%,var(--hse-surface))]"
            }`}
          >
            {resultado.o_vigente ? (
              <CircleCheck className="size-12 text-[var(--hse-verde-sombra)]" strokeWidth={2} />
            ) : (
              <CircleX className="size-12 text-[var(--hse-rojo-texto)]" strokeWidth={2} />
            )}
            <h1 className="font-[family-name:var(--hse-font-display)] text-xl font-extrabold">{resultado.o_nombre}</h1>
            <p className="text-sm font-semibold text-[var(--hse-ink-2)]">{resultado.o_cuadrilla}</p>

            <p
              className={`mt-1 rounded-full border-2 px-4 py-1.5 text-sm font-extrabold ${
                resultado.o_vigente
                  ? "border-[var(--hse-verde-sombra)] text-[var(--hse-verde-sombra)]"
                  : "border-[var(--hse-rojo-texto)] text-[var(--hse-rojo-texto)]"
              }`}
            >
              {resultado.o_vigente ? "Capacitación vigente hoy" : "Capacitación NO vigente"}
            </p>

            <p className="text-xs text-[var(--hse-ink-2)]">
              Racha de seguridad: <strong>{resultado.o_current_streak} días</strong>
            </p>

            {resultado.o_competencias.length > 0 && (
              <div className="mt-2 flex w-full flex-col gap-1.5 text-left">
                <p className="text-xs font-bold tracking-wide text-[var(--hse-ink-2)] uppercase">Competencias aprobadas</p>
                {resultado.o_competencias.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-xs font-semibold">
                    <CircleCheck className="size-4 shrink-0 text-[var(--hse-verde-sombra)]" strokeWidth={2.4} />
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-[var(--hse-ink-2)]">
          Pase digital de HSE Master App — verificación en tiempo real, sin instalar nada.
        </p>
      </div>
    </div>
  );
}
