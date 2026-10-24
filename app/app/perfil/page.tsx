"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PERFIL_HTML } from "./markup";
import "./page.css";

// Migrada desde perfil.html (ACEPTADA CON OBSERVACIONES, ronda 3 — ver ESTADO.md
// → veredicto:perfil). ⚠️ Racha/nivel/vidas y el Pasaporte QR siguen siendo DATO DE
// DEMOSTRACIÓN — ver la misma nota de app/app/page.tsx. "Cerrar sesión" SÍ quedó
// conectado a Supabase Auth real (supabase.auth.signOut()) — no depende de contenido
// pendiente, así que no tenía sentido dejarlo simulado como el resto.
export default function PerfilPage() {
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
      contarNumero(root!.querySelector("#pfNumRacha"), 12, 650);
      contarNumero(root!.querySelector("#pfNumNivel"), 4, 500);
      contarNumero(root!.querySelector("#pfNumVidas"), 3, 450);
    }

    function aplicarEmpty() {
      const competencias = root!.querySelector("#pfCompetencias");
      if (competencias)
        competencias.innerHTML =
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
        if (estadoForzado === "empty") aplicarEmpty();
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
      if (estadoForzado === "empty") {
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
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="pf"
      dangerouslySetInnerHTML={{ __html: PERFIL_HTML }}
    />
  );
}
