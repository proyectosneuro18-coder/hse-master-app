"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { APP_HOME_HTML } from "./markup";
import "./page.css";

// Migrada desde app-principal.html (ACEPTADA CON OBSERVACIONES, ronda 4 — ver ESTADO.md
// → veredicto:app-principal) preservando el HTML/CSS/lógica aprobados tal cual.
// ⚠️ El reto diario y la racha siguen siendo DATOS DE DEMOSTRACIÓN (RACHA_INICIAL = 12,
// como en el original) — conectarlos a datos reales de Supabase requiere que exista
// contenido real de módulos/lecciones y la pantalla de admin que sube cuadrillas
// (ninguna existe todavía, ver ESTADO.md → Próximas sesiones). Migrar esta pantalla no
// inventa esa conexión: solo la pasa a código real preservando su comportamiento actual.
export default function AppHomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Esta pantalla es el ritual diario del TRABAJADOR. El Gerente de HSE (owner/admin) también
  // cae aquí tras su magic link (ver app/login/page.tsx, redirige siempre a /app) — se le manda
  // a su propio panel (app/panel) en vez de mostrarle el reto diario, que no es para él.
  useEffect(() => {
    let cancelado = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || cancelado) return;
      const { data } = await supabase
        .from("memberships")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["owner", "admin"])
        .maybeSingle();
      if (!cancelado && data) router.replace("/panel");
    });
    return () => {
      cancelado = true;
    };
  }, [router]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.wired === "1") return;
    root.dataset.wired = "1";
    root.classList.add("js-motion");

    const qs = new URLSearchParams(window.location.search);
    let estadoForzado = qs.get("estado"); // empty | error | offline
    const RACHA_INICIAL = 12;
    let rachaActual = RACHA_INICIAL;

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

    function contarHasta(el: HTMLElement | null, destino: number, ms: number) {
      if (!el) return;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const inicio = 0;
        const t0 = performance.now();
        function paso(ahora: number) {
          const p = Math.min(1, (ahora - t0) / ms);
          const valor = Math.round(inicio + (destino - inicio) * p);
          el!.innerHTML = valor + " <small>días</small>";
          if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
      } else {
        el.innerHTML = destino + " <small>días</small>";
      }
    }

    function revelarStagger() {
      const nodos = contenido!.querySelectorAll<HTMLElement>(".ap-reveal");
      nodos.forEach((n, i) => {
        window.setTimeout(() => n.classList.add("in"), i * 70);
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
        contarHasta(root!.querySelector("#apRachaNum"), rachaActual, 700);
      }, 650);
    }

    root.querySelector("#apReintentar")?.addEventListener("click", () => {
      error?.classList.remove("show");
      skeleton?.classList.add("show");
      estadoForzado = null;
      cargar();
    });
    root.querySelector("#apVerProgreso")?.addEventListener("click", () => {
      router.push("/app/progreso");
    });

    const boton = root.querySelector<HTMLButtonElement>("#apBoton");
    const retoIcono = root.querySelector<HTMLElement>("#apRetoIcono");
    const anuncio = root.querySelector<HTMLElement>("#apAnuncio");
    const heroe = root.querySelector<HTMLElement>("#apHeroe");
    const ejercicio = root.querySelector<HTMLElement>("#apEjercicio");
    const ejPregunta = root.querySelector<HTMLElement>("#apEjPregunta");
    const ejExito = root.querySelector<HTMLElement>("#apEjExito");
    const ejFeedback = root.querySelector<HTMLElement>("#apEjFeedback");
    let ejResuelto = false;
    let retoYaCompletado = false;

    function abrirEjercicio() {
      ejResuelto = false;
      ejExito?.classList.remove("show");
      if (ejPregunta) ejPregunta.style.display = "";
      if (ejFeedback) {
        ejFeedback.className = "ap-ej-feedback";
        ejFeedback.textContent = "";
      }
      root!.querySelectorAll<HTMLElement>(".ap-ej-item").forEach((btn) => {
        btn.classList.remove("correcto", "incorrecto");
      });
      ejercicio?.classList.add("show");
      if (boton) boton.disabled = true;
      document.body.style.overflow = "hidden";
      root!.querySelector<HTMLElement>("#apEjSalir")?.focus();
    }
    function cerrarEjercicio() {
      ejercicio?.classList.remove("show");
      document.body.style.overflow = "";
      if (!retoYaCompletado && boton) boton.disabled = false;
      boton?.focus();
    }

    root.querySelector("#apEjSalir")?.addEventListener("click", cerrarEjercicio);
    ejercicio?.addEventListener("click", (ev) => {
      if (ev.target === ejercicio) cerrarEjercicio();
    });
    const onKeydown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && ejercicio?.classList.contains("show")) cerrarEjercicio();
    };
    document.addEventListener("keydown", onKeydown);

    root.querySelectorAll<HTMLElement>(".ap-ej-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (ejResuelto) return;
        const esPeligro = item.getAttribute("data-peligro") === "true";
        if (esPeligro) {
          ejResuelto = true;
          item.classList.add("correcto");
          navigator.vibrate?.(20);
          window.setTimeout(() => {
            if (ejPregunta) ejPregunta.style.display = "none";
            ejExito?.classList.add("show");
          }, 450);
        } else {
          item.classList.add("incorrecto");
          window.setTimeout(() => item.classList.remove("incorrecto"), 500);
          if (ejFeedback) {
            ejFeedback.textContent = "Ese ya está asegurado. Busca el que puede energizarse solo.";
            ejFeedback.className = "ap-ej-feedback mal show";
          }
        }
      });
    });

    function completarReto() {
      if (boton) {
        const txt = boton.querySelector(".txt");
        if (txt) txt.textContent = "Reto completado hoy";
        boton.disabled = true;
      }
      if (retoIcono)
        retoIcono.innerHTML =
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--verde-sombra)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6 9 17-5-5"/><path d="M20 6 9 17l-5-5"/></svg>';
      const retoTitulo = root!.querySelector("#apRetoTitulo");
      const retoSub = root!.querySelector("#apRetoSub");
      if (retoTitulo) retoTitulo.textContent = "Completaste el reto de hoy";
      if (retoSub) retoSub.textContent = "Vuelve mañana para seguir tu racha";
      rachaActual += 1;
      contarHasta(root!.querySelector("#apRachaNum"), rachaActual, 500);
      const diaHoy = root!.querySelector<HTMLElement>("#apDiaHoy");
      if (diaHoy) {
        diaHoy.classList.remove("hoy");
        diaHoy.classList.add("hecho");
        const c = diaHoy.querySelector(".c");
        if (c)
          c.innerHTML =
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--hse-blanco)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      }
      heroe?.classList.add("pulso");
      window.setTimeout(() => heroe?.classList.remove("pulso"), 450);
      navigator.vibrate?.(20);
      if (anuncio) anuncio.textContent = "Reto completado. Tu racha de seguridad ahora es de " + rachaActual + " días.";
    }

    root.querySelector("#apEjContinuar")?.addEventListener("click", () => {
      retoYaCompletado = true;
      cerrarEjercicio();
      completarReto();
    });

    boton?.addEventListener("click", () => {
      if (boton.disabled) return;
      boton.classList.add("cargando");
      boton.disabled = true;
      window.setTimeout(() => {
        boton.classList.remove("cargando");
        boton.disabled = false;
        abrirEjercicio();
      }, 400);
    });

    root.querySelector("#apAyudaPase")?.addEventListener("click", () => {
      mostrarToast(
        "El Pase: el mecanismo de tu app que revisa el historial de tu cuadrilla y te avisa de patrones de riesgo",
        5000,
      );
    });

    cargar();

    return () => document.removeEventListener("keydown", onKeydown);
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="ap"
      dangerouslySetInnerHTML={{ __html: APP_HOME_HTML }}
    />
  );
}
