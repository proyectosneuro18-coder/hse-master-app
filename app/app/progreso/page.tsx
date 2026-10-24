"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PROGRESO_HTML } from "./markup";
import "./page.css";

// Migrada desde progreso.html (ACEPTADA CON OBSERVACIONES, ronda 2 — ver ESTADO.md
// → veredicto:progreso). ⚠️ El mapa de las 9 Reglas sigue siendo DATO DE DEMOSTRACIÓN
// (2/9 completadas, hardcodeado) — ver la misma nota de app/app/page.tsx.
export default function ProgresoPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.wired === "1") return;
    root.dataset.wired = "1";
    root.classList.add("js-motion");

    const qs = new URLSearchParams(window.location.search);
    let estadoForzado = qs.get("estado");

    const skeleton = root.querySelector<HTMLElement>("#apSkeleton");
    const contenido = root.querySelector<HTMLElement>("#apContenido");
    const vacio = root.querySelector<HTMLElement>("#apVacio");
    const error = root.querySelector<HTMLElement>("#apError");
    const offlineBanner = root.querySelector<HTMLElement>("#apOffline");
    const toast = root.querySelector<HTMLElement>("#apToast");

    let toastTimer: number | undefined;
    function mostrarToast(msg: string, ms?: number) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("show");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("show"), ms || 2600);
    }

    function revelarStagger() {
      contenido!.querySelectorAll<HTMLElement>(".ap-reveal").forEach((n, i) => {
        window.setTimeout(() => n.classList.add("in"), i * 90);
      });
    }

    function animarBarra() {
      const total = 9;
      const hechos = 2;
      const fill = root!.querySelector<HTMLElement>("#pgBarraFill");
      const numEl = root!.querySelector<HTMLElement>("#pgCompletados");
      window.setTimeout(() => {
        if (fill) fill.style.width = Math.round((hechos / total) * 100) + "%";
      }, 150);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (numEl) numEl.textContent = String(hechos);
        return;
      }
      const t0 = performance.now();
      function paso(ahora: number) {
        const p = Math.min(1, (ahora - t0) / 600);
        if (numEl) numEl.textContent = String(Math.round(hechos * p));
        if (p < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    }

    function cargar() {
      window.setTimeout(() => {
        skeleton?.classList.remove("show");
        if (!navigator.onLine || estadoForzado === "offline") {
          offlineBanner?.classList.add("show");
        }
        if (estadoForzado === "error") {
          error?.classList.add("show");
          return;
        }
        if (estadoForzado === "empty") {
          vacio?.classList.add("show");
          return;
        }
        contenido?.classList.add("show");
        revelarStagger();
        animarBarra();
      }, 600);
    }

    root.querySelector("#apReintentar")?.addEventListener("click", () => {
      error?.classList.remove("show");
      skeleton?.classList.add("show");
      estadoForzado = null;
      cargar();
    });
    root.querySelector("#apIrReto")?.addEventListener("click", () => router.push("/app"));

    root.querySelectorAll<HTMLElement>(".pg-nodo, .pg-resto-item").forEach((nodo) => {
      nodo.addEventListener("click", () => {
        const estado = nodo.getAttribute("data-estado");
        const nombre = nodo.getAttribute("data-nombre");
        if (estado === "actual") {
          router.push("/app");
        } else if (estado === "hecho") {
          mostrarToast(`Ya completaste "${nombre}" — vuelve a repasarlo cuando quieras`);
        } else {
          mostrarToast("Se desbloquea cuando termines tu reto actual");
        }
      });
    });

    cargar();
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="pr"
      dangerouslySetInnerHTML={{ __html: PROGRESO_HTML }}
    />
  );
}
