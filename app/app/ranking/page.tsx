"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RANKING_HTML } from "./markup";
import "./page.css";

// Migrada desde ranking.html (ACEPTADA CON OBSERVACIONES, ronda 3 — ver ESTADO.md
// → veredicto:ranking). ⚠️ El ranking de la cuadrilla sigue siendo DATO DE
// DEMOSTRACIÓN — ver la misma nota de app/app/page.tsx.
export default function RankingPage() {
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
        window.setTimeout(() => n.classList.add("in"), i * 80);
      });
    }

    function animarPuntos() {
      const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root!.querySelectorAll<HTMLElement>(".rk-fila .pts[data-pts]").forEach((el) => {
        const destino = parseInt(el.getAttribute("data-pts") ?? "0", 10);
        if (reducido) {
          el.textContent = destino.toLocaleString("es") + " pts";
          return;
        }
        const t0 = performance.now();
        function paso(ahora: number) {
          const p = Math.min(1, (ahora - t0) / 700);
          el.textContent = Math.round(destino * p).toLocaleString("es") + " pts";
          if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
      });
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
        animarPuntos();
      }, 600);
    }

    root.querySelector("#apReintentar")?.addEventListener("click", () => {
      error?.classList.remove("show");
      skeleton?.classList.add("show");
      estadoForzado = null;
      cargar();
    });
    root.querySelector("#apIrReto")?.addEventListener("click", () => router.push("/app"));

    const filtroSemana = root.querySelector<HTMLElement>("#rkFiltroSemana");
    const filtroMes = root.querySelector<HTMLElement>("#rkFiltroMes");
    function aplicarPeriodo(periodo: "semana" | "mes") {
      root!.querySelectorAll<HTMLElement>(".rk-fila .delta[data-semana]").forEach((el) => {
        el.textContent = el.getAttribute("data-" + periodo);
      });
    }
    filtroSemana?.addEventListener("click", () => {
      filtroSemana.classList.add("activo");
      filtroMes?.classList.remove("activo");
      aplicarPeriodo("semana");
      mostrarToast("Viendo el ranking de esta semana");
    });
    filtroMes?.addEventListener("click", () => {
      filtroMes.classList.add("activo");
      filtroSemana?.classList.remove("activo");
      aplicarPeriodo("mes");
      mostrarToast("Viendo el ranking de este mes");
    });

    cargar();
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="rk"
      dangerouslySetInnerHTML={{ __html: RANKING_HTML }}
    />
  );
}
