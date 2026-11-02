"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RANKING_HTML } from "./markup";
import "./page.css";

type FilaRanking = { o_crew_id: string; o_crew_name: string; o_total_pts: number; o_es_mia: boolean };

const MEDALLA =
  '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amarillo-sombra)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.5 7 21l5-2 5 2-1.5-6.5"/></svg><span class="sr-only">1°</span>';

// Migrada desde ranking.html (ACEPTADA CON OBSERVACIONES, ronda 3 — ver ESTADO.md →
// veredicto:ranking). Desde `chips-ilustrativos-app-principal` el ranking es REAL: suma los
// puntos (attempts.score) de cada trabajador por cuadrilla vía el RPC obtener_ranking_cuadrillas
// (migración 0008) — nunca expone intentos individuales de otro trabajador, solo el total por
// cuadrilla. No hay columna de tendencia (▲/▼): no existe un histórico de posiciones guardado
// todavía, así que no se fabrica ese dato.
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
    const estadoForzado = qs.get("estado");

    const skeleton = root.querySelector<HTMLElement>("#apSkeleton");
    const contenido = root.querySelector<HTMLElement>("#apContenido");
    const vacio = root.querySelector<HTMLElement>("#apVacio");
    const error = root.querySelector<HTMLElement>("#apError");
    const offlineBanner = root.querySelector<HTMLElement>("#apOffline");
    const toast = root.querySelector<HTMLElement>("#apToast");
    const lista = root.querySelector<HTMLElement>("#rkLista");
    const resumen = root.querySelector<HTMLElement>("#rkResumen");

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

    function pintarFilas(filas: FilaRanking[]) {
      if (!lista) return;
      lista.innerHTML = filas
        .map((f, i) => {
          const pos = i + 1;
          const clases = ["rk-fila", pos === 1 ? "medalla" : "", f.o_es_mia ? "tuya" : ""].filter(Boolean).join(" ");
          const posHtml = pos === 1 ? MEDALLA : `${pos}°`;
          const nombre = f.o_crew_name + (f.o_es_mia ? " (tú)" : "");
          return `<div class="${clases}"><p class="pos">${posHtml}</p><p class="nombre"></p><p class="pts" data-pts="${f.o_total_pts}">0 pts</p></div>`
            .replace("<p class=\"nombre\"></p>", `<p class="nombre">${escaparHtml(nombre)}</p>`);
        })
        .join("");
      const miPos = filas.findIndex((f) => f.o_es_mia) + 1;
      if (resumen) {
        resumen.textContent = miPos
          ? `Vas ${miPos}° de ${filas.length} cuadrilla${filas.length === 1 ? "" : "s"}`
          : `${filas.length} cuadrilla${filas.length === 1 ? "" : "s"} activa${filas.length === 1 ? "" : "s"}`;
      }
    }

    function escaparHtml(s: string) {
      const d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }

    async function cargarPeriodo(periodo: "semana" | "mes") {
      try {
        const res = await fetch(`/api/app/ranking?periodo=${periodo}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { filas: FilaRanking[] };
        const filas = data.filas ?? [];
        const hayPuntos = filas.some((f) => f.o_total_pts > 0);
        vacio?.classList.remove("show");
        error?.classList.remove("show");
        contenido?.classList.remove("show");
        if (filas.length === 0 || !hayPuntos) {
          vacio?.classList.add("show");
          return;
        }
        pintarFilas(filas);
        contenido?.classList.add("show");
        revelarStagger();
        animarPuntos();
      } catch {
        contenido?.classList.remove("show");
        vacio?.classList.remove("show");
        error?.classList.add("show");
      }
    }

    function cargar(periodo: "semana" | "mes" = "semana") {
      skeleton?.classList.add("show");
      window.setTimeout(async () => {
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
        await cargarPeriodo(periodo);
      }, 500);
    }

    let periodoActual: "semana" | "mes" = "semana";
    root.querySelector("#apReintentar")?.addEventListener("click", () => cargar(periodoActual));
    root.querySelector("#apIrReto")?.addEventListener("click", () => router.push("/app"));

    const filtroSemana = root.querySelector<HTMLElement>("#rkFiltroSemana");
    const filtroMes = root.querySelector<HTMLElement>("#rkFiltroMes");
    filtroSemana?.addEventListener("click", () => {
      if (periodoActual === "semana") return;
      periodoActual = "semana";
      filtroSemana.classList.add("activo");
      filtroMes?.classList.remove("activo");
      cargarPeriodo("semana");
      mostrarToast("Viendo el ranking de esta semana");
    });
    filtroMes?.addEventListener("click", () => {
      if (periodoActual === "mes") return;
      periodoActual = "mes";
      filtroMes.classList.add("activo");
      filtroSemana?.classList.remove("activo");
      cargarPeriodo("mes");
      mostrarToast("Viendo el ranking de este mes");
    });

    cargar("semana");
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="rk"
      dangerouslySetInnerHTML={{ __html: RANKING_HTML }}
    />
  );
}
