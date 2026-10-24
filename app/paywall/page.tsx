"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PAYWALL_HTML } from "./markup";
import "./page.css";

// Migrada desde paywall.html (ACEPTADO CON OBSERVACIONES, ronda 24 — ver ESTADO.md
// → veredicto:paywall) preservando el HTML/CSS/lógica aprobados tal cual.
export default function PaywallPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.wired === "1") return;
    root.dataset.wired = "1";

    root.classList.add("js-motion");
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revelarTodo() {
      root!.querySelectorAll<HTMLElement>(".pw-reveal").forEach((el, i) => {
        if (sinMovimiento) {
          el.classList.add("in");
          return;
        }
        setTimeout(() => el.classList.add("in"), 80 + i * 80);
      });
    }
    function contarNumero(el: HTMLElement | null, hasta: number, decimales: number) {
      if (!el) return;
      if (sinMovimiento) {
        el.textContent = decimales ? hasta.toFixed(decimales) : String(hasta);
        return;
      }
      const duracion = 550;
      const inicio = performance.now();
      function tick(ahora: number) {
        const t = Math.min(1, (ahora - inicio) / duracion);
        const valor = hasta * t;
        el!.textContent = decimales ? valor.toFixed(decimales) : String(Math.round(valor));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    try {
      try {
        const onb = JSON.parse(sessionStorage.getItem("hseOnboarding") || "{}");
        const ETIQUETAS_CUADRILLA: Record<string, string> = {
          "Menos de 10 trabajadores": "menos de 10 trabajadores",
          "Entre 10 y 20 trabajadores": "tu cuadrilla de 10 a 20",
          "Más de 20 trabajadores": "tu cuadrilla de más de 20",
        };
        const cuadrillaEl = root!.querySelector<HTMLElement>("#pwCuadrilla");
        if (cuadrillaEl) cuadrillaEl.textContent = ETIQUETAS_CUADRILLA[onb.cuadrilla] || "tu cuadrilla";

        const PERSONAS_ESTIMADAS: Record<string, number> = {
          "Menos de 10 trabajadores": 8,
          "Entre 10 y 20 trabajadores": 15,
          "Más de 20 trabajadores": 25,
        };
        const n = PERSONAS_ESTIMADAS[onb.cuadrilla] || 15;
        if (n) {
          const anualTotal = root!.querySelector<HTMLElement>("#pwAnualTotal");
          const mensualTotal = root!.querySelector<HTMLElement>("#pwMensualTotal");
          if (anualTotal)
            anualTotal.textContent = `≈ US$${Math.round(6.67 * n)}/mes en total para tus ${n} trabajadores`;
          if (mensualTotal)
            mensualTotal.textContent = `≈ US$${8 * n}/mes en total para tus ${n} trabajadores`;
        }
      } catch {
        const cuadrillaEl = root!.querySelector<HTMLElement>("#pwCuadrilla");
        if (cuadrillaEl) cuadrillaEl.textContent = "tu cuadrilla";
      }

      const planes = Array.from(root.querySelectorAll<HTMLElement>(".pw-plan"));
      function elegirPlan(plan: HTMLElement, enfocar: boolean) {
        planes.forEach((p) => {
          p.classList.remove("elegido");
          p.setAttribute("aria-checked", "false");
          p.setAttribute("tabindex", "-1");
        });
        plan.classList.add("elegido");
        plan.setAttribute("aria-checked", "true");
        plan.setAttribute("tabindex", "0");
        if (enfocar) plan.focus();
      }
      planes.forEach((plan, i) => {
        plan.addEventListener("click", () => elegirPlan(plan, false));
        plan.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            elegirPlan(plan, false);
            return;
          }
          if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) return;
          e.preventDefault();
          const siguiente =
            e.key === "ArrowDown" || e.key === "ArrowRight"
              ? planes[(i + 1) % planes.length]
              : planes[(i - 1 + planes.length) % planes.length];
          elegirPlan(siguiente, true);
        });
      });

      const activarBtn = root.querySelector<HTMLButtonElement>("#pwActivar");
      const errorMsg = root.querySelector<HTMLElement>("#pwError");
      function activarPrueba() {
        try {
          errorMsg?.classList.remove("show");
          if (activarBtn) {
            activarBtn.disabled = true;
            activarBtn.textContent = "Activando…";
          }
          const elegido = root!.querySelector<HTMLElement>(".pw-plan.elegido");
          try {
            sessionStorage.setItem("hsePlanElegido", elegido ? elegido.dataset.plan! : "anual");
          } catch {}
          router.push("/login");
        } catch {
          if (activarBtn) {
            activarBtn.disabled = false;
            activarBtn.textContent = "Crear mi acceso y activar la prueba";
          }
          const txt = errorMsg?.querySelector(".txt");
          if (txt)
            txt.textContent = navigator.onLine
              ? "Algo falló al continuar."
              : "Parece que no tienes conexión.";
          errorMsg?.classList.add("show");
        }
      }
      activarBtn?.addEventListener("click", activarPrueba);
      root.querySelector("#pwReintentar")?.addEventListener("click", activarPrueba);

      // "Volver" regresa al paso exacto donde iba el usuario (history.back) en vez de
      // reiniciar el recorrido; si no hay historial real, el href normal a /onboarding
      // igual resume por sessionStorage.
      root.querySelector("#pwCerrar")?.addEventListener("click", (e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      });
    } finally {
      revelarTodo();
      const retraso = sinMovimiento ? 0 : 480;
      setTimeout(() => {
        contarNumero(root!.querySelector("#pwPrecioAnual"), 6.67, 2);
        contarNumero(root!.querySelector("#pwPrecioMensual"), 8, 0);
      }, retraso);
    }
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="pw"
      dangerouslySetInnerHTML={{ __html: PAYWALL_HTML }}
    />
  );
}
