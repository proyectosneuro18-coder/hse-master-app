"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { guardarConsentimiento, initAnalytics, leerConsentimiento } from "@/lib/analytics";

const HAY_CLAVE = !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
const sinSuscripcion = () => () => {};

// Arranca la medición en toda la app y muestra el aviso de cookies hasta que la persona responda
// (Ley 1581 — autorización previa; 36 → Privacidad). Sin clave de PostHog configurada no muestra
// nada: no hay nada que consentir.
export function Analitica() {
  // El almacenamiento del navegador solo existe en el cliente: en el servidor el aviso no se pinta
  // y en el navegador se decide al hidratar, sin parpadeo ni desajuste de hidratación.
  const sinResponder = useSyncExternalStore(
    sinSuscripcion,
    () => leerConsentimiento() === null,
    () => false,
  );
  const [respondido, setRespondido] = useState(false);

  useEffect(() => {
    if (HAY_CLAVE) initAnalytics();
  }, []);

  if (!HAY_CLAVE || !sinResponder || respondido) return null;

  function responder(valor: "aceptado" | "rechazado") {
    guardarConsentimiento(valor);
    setRespondido(true);
  }

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-[var(--hse-radius-card)] border-3 border-[var(--hse-ink)] bg-[var(--hse-surface)] p-4 font-[family-name:var(--hse-font-body)] text-[var(--hse-ink)] shadow-[0_6px_0_-2px_rgb(26_26_26/0.08),0_10px_24px_rgb(26_26_26/0.18)]"
    >
      <p className="text-sm">
        Usamos cookies de medición para saber qué partes de la app sirven y cuáles mejorar. Nunca
        guardamos tu nombre ni tu correo en ellas.{" "}
        <Link href="/legal/privacidad" className="font-bold text-[var(--hse-azul-sombra)] underline">
          Más información
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => responder("rechazado")}
          className="flex-1 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] py-2.5 text-sm font-bold text-[var(--hse-ink)] transition active:scale-[0.98]"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => responder("aceptado")}
          className="flex-1 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] py-2.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
