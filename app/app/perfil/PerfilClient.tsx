"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/client";
import { PERFIL_HTML } from "./markup";
import "./page.css";

type Props = {
  nombreCompleto: string;
  cuadrillaNombre: string;
  paseToken: string;
  currentStreak: number;
  estaVigente: boolean;
  competencias: string[];
};

const CHECK_SVG =
  '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--hse-blanco)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export function PerfilClient({
  nombreCompleto,
  cuadrillaNombre,
  paseToken,
  currentStreak,
  estaVigente,
  competencias,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.wired === "1") return;
    root.dataset.wired = "1";
    root.classList.add("js-motion");

    const supabase = createClient();
    const qs = new URLSearchParams(window.location.search);
    const estadoForzado = qs.get("estado");

    const skeleton = root.querySelector<HTMLElement>("#apSkeleton");
    const contenido = root.querySelector<HTMLElement>("#apContenido");
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
        window.setTimeout(() => n.classList.add("in"), i * 70);
      });
    }

    function contarNumero(el: HTMLElement | null, destino: number, ms: number) {
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = String(destino);
        return;
      }
      const t0 = performance.now();
      function paso(ahora: number) {
        const p = Math.min(1, (ahora - t0) / ms);
        el!.textContent = String(Math.round(destino * p));
        if (p < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    }
    function animarChips() {
      contarNumero(root!.querySelector("#pfNumRacha"), currentStreak, 650);
    }

    function pintarIdentidad() {
      const primerNombre = nombreCompleto.trim().split(/\s+/)[0] || nombreCompleto;
      const iniciales = nombreCompleto
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join("");
      const avatar = root!.querySelector<HTMLElement>("#pfAvatar");
      if (avatar) avatar.textContent = iniciales || "--";
      const nombreEl = root!.querySelector<HTMLElement>("#pfNombre");
      if (nombreEl) nombreEl.textContent = nombreCompleto;
      const rolEl = root!.querySelector<HTMLElement>("#pfRol");
      if (rolEl) rolEl.textContent = `Técnico de campo · ${cuadrillaNombre}`;
      const paseNombreEl = root!.querySelector<HTMLElement>("#pfPaseNombre");
      if (paseNombreEl) paseNombreEl.textContent = nombreCompleto;
      const cuadrillaEl = root!.querySelector<HTMLElement>("#pfCuadrilla");
      if (cuadrillaEl) cuadrillaEl.textContent = cuadrillaNombre;
      const fullNombreEl = root!.querySelector<HTMLElement>("#pfFullNombre");
      if (fullNombreEl) fullNombreEl.textContent = nombreCompleto;
      const fullCuadrillaEl = root!.querySelector<HTMLElement>("#pfFullCuadrilla");
      if (fullCuadrillaEl) fullCuadrillaEl.textContent = `${cuadrillaNombre} · ${estaVigente ? "Vigente hoy" : "No vigente"}`;
      const vigenteEl = root!.querySelector<HTMLElement>("#pfVigente");
      if (vigenteEl) {
        const span = vigenteEl.querySelector(".punto");
        vigenteEl.textContent = estaVigente ? "Vigente hoy" : "No vigente";
        if (span) vigenteEl.prepend(span);
        vigenteEl.classList.toggle("vencido", !estaVigente);
      }
      void primerNombre;
    }

    function pintarCompetencias() {
      const cont = root!.querySelector<HTMLElement>("#pfCompetencias");
      if (!cont) return;
      if (competencias.length === 0) {
        cont.innerHTML =
          '<p class="pf-pase-vacio">Todavía no tienes competencias vigentes — tu pase se activa en cuanto completes tu primer reto.</p>';
        return;
      }
      cont.innerHTML = competencias
        .map((titulo) => `<div class="item"><span class="punto2" aria-hidden="true">${CHECK_SVG}</span>${escaparHtml(titulo)}</div>`)
        .join("");
    }

    function escaparHtml(s: string) {
      const d = document.createElement("div");
      d.textContent = s;
      return d.innerHTML;
    }

    async function pintarQr() {
      const url = `${window.location.origin}/pase/${paseToken}`;
      // QRCode.toString no acepta var(--...) — exige un hex literal. Es el mismo valor que
      // --hse-ink en app/globals.css (FICHA-ARTE.md), copiado aquí porque la librería lo pide así.
      const svg = await QRCode.toString(url, { type: "svg", margin: 0, color: { dark: "#1a1a1a", light: "#00000000" } });
      const mini = root!.querySelector<HTMLElement>("#pfQrMini");
      if (mini) mini.innerHTML = svg;
      const full = root!.querySelector<HTMLElement>("#pfQrFull");
      if (full) full.innerHTML = svg;
    }

    function aplicarEmpty() {
      const competenciasEl = root!.querySelector("#pfCompetencias");
      if (competenciasEl)
        competenciasEl.innerHTML =
          '<p class="pf-pase-vacio">Todavía no tienes competencias vigentes — tu pase se activa en cuanto completes tu primer reto.</p>';
      const btn = root!.querySelector<HTMLElement>("#apMostrarPase");
      if (btn) {
        btn.classList.add("secundario");
        const txt = btn.querySelector(".txt");
        if (txt) txt.textContent = "Ir a mi primer reto";
      }
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
        contenido?.classList.add("show");
        pintarIdentidad();
        if (estadoForzado === "empty" || competencias.length === 0) {
          aplicarEmpty();
        } else {
          pintarCompetencias();
        }
        pintarQr();
        revelarStagger();
        animarChips();
      }, 600);
    }

    root.querySelector("#apReintentar")?.addEventListener("click", () => {
      error?.classList.remove("show");
      skeleton?.classList.add("show");
      cargar();
    });

    root.querySelectorAll<HTMLElement>(".pf-fila[data-proximo]").forEach((fila) => {
      fila.addEventListener("click", () => {
        mostrarToast(`"${fila.getAttribute("data-proximo")}" llega muy pronto`);
      });
    });

    function cerrarSesion(boton: HTMLButtonElement) {
      boton.disabled = true;
      boton.classList.add("cargando");
      supabase.auth.signOut().finally(() => router.push("/login"));
    }
    root.querySelector<HTMLButtonElement>("#apSalirHeader")?.addEventListener("click", function () {
      cerrarSesion(this);
    });
    root.querySelector<HTMLButtonElement>("#apSalirFila")?.addEventListener("click", function () {
      cerrarSesion(this);
    });

    const pfFull = root.querySelector<HTMLElement>("#pfFull");
    function abrirPaseCompleto() {
      pfFull?.classList.add("show");
      document.body.style.overflow = "hidden";
      root!.querySelector<HTMLElement>("#pfFullSalir")?.focus();
    }
    function cerrarPaseCompleto() {
      pfFull?.classList.remove("show");
      document.body.style.overflow = "";
    }
    root.querySelector("#apMostrarPase")?.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (estadoForzado === "empty" || competencias.length === 0) {
        router.push("/app");
        return;
      }
      abrirPaseCompleto();
    });
    root.querySelector("#pfFullSalir")?.addEventListener("click", cerrarPaseCompleto);
    pfFull?.addEventListener("click", (ev) => {
      if (ev.target === pfFull) cerrarPaseCompleto();
    });
    const onKeydown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && pfFull?.classList.contains("show")) cerrarPaseCompleto();
    };
    document.addEventListener("keydown", onKeydown);

    cargar();

    return () => document.removeEventListener("keydown", onKeydown);
  }, [router, nombreCompleto, cuadrillaNombre, paseToken, currentStreak, estaVigente, competencias]);

  return (
    <div
      ref={rootRef}
      className="pf"
      dangerouslySetInnerHTML={{ __html: PERFIL_HTML }}
    />
  );
}
