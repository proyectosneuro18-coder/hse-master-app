"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { APP_HOME_HTML } from "./markup";
import "./page.css";

export type RetoHoy = {
  leccionId: string | null;
  moduloTitulo: string;
  intro: string;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
};

type Props = {
  nombreTrabajador: string;
  rachaInicial: number;
  yaCompletadoHoy: boolean;
  modulosAprobados: number;
  totalModulos: number;
  reto: RetoHoy;
  posicionRanking: number | null;
  totalCuadrillas: number;
};

const FECHA_HOY = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

// Pantalla principal del trabajador (M0, el ritual diario) — ver ESTADO.md → veredicto:app-principal.
// Conectada a datos reales desde la Sesión 7: la racha, el reto del día (pregunta/opciones/
// explicación de la lección real), el conteo de módulos y (desde `chips-ilustrativos-app-principal`)
// la posición real de ranking y las "vidas" (cascos, mecánica real por intento del día — nunca
// bloquea el reto obligatorio, mandato de FICHA-MODELO.md §5) vienen de Supabase/estado local.
// El insight de "El Pase" sigue siendo ilustrativo (sin motor real detrás todavía).
export function AppHomeClient({
  nombreTrabajador,
  rachaInicial,
  yaCompletadoHoy,
  modulosAprobados,
  totalModulos,
  reto,
  posicionRanking,
  totalCuadrillas,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.wired === "1") return;
    root.dataset.wired = "1";
    root.classList.add("js-motion");

    const qs = new URLSearchParams(window.location.search);
    let estadoForzado = qs.get("estado"); // empty | error | offline
    if (!reto.leccionId && !estadoForzado) estadoForzado = "empty";
    let rachaActual = rachaInicial;

    const skeleton = root.querySelector<HTMLElement>("#apSkeleton");
    const contenido = root.querySelector<HTMLElement>("#apContenido");
    const vacio = root.querySelector<HTMLElement>("#apVacio");
    const error = root.querySelector<HTMLElement>("#apError");
    const offlineBanner = root.querySelector<HTMLElement>("#apOffline");
    const toast = root.querySelector<HTMLElement>("#apToast");

    const saludo = root.querySelector<HTMLElement>("#apSaludo");
    const primerNombre = nombreTrabajador.trim().split(/\s+/)[0] || nombreTrabajador;
    if (saludo) saludo.textContent = `Buenos días, ${primerNombre}`;
    const fecha = root.querySelector<HTMLElement>("#apFecha");
    if (fecha) fecha.textContent = FECHA_HOY.charAt(0).toUpperCase() + FECHA_HOY.slice(1);
    const chipModulos = root.querySelector<HTMLElement>("#apChipModulos");
    if (chipModulos) chipModulos.textContent = `${modulosAprobados}/${totalModulos}`;
    const chipRanking = root.querySelector<HTMLElement>("#apChipRanking");
    if (chipRanking) chipRanking.textContent = posicionRanking && totalCuadrillas > 1 ? `${posicionRanking}°` : "—";

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

    const retoTitulo = root.querySelector<HTMLElement>("#apRetoTitulo");
    const retoSub = root.querySelector<HTMLElement>("#apRetoSub");
    const retoIcono = root.querySelector<HTMLElement>("#apRetoIcono");
    const boton = root.querySelector<HTMLButtonElement>("#apBoton");
    const anuncio = root.querySelector<HTMLElement>("#apAnuncio");
    const heroe = root.querySelector<HTMLElement>("#apHeroe");
    const diaHoy = root.querySelector<HTMLElement>("#apDiaHoy");

    function marcarCompletadoHoyEnUI() {
      if (boton) {
        const txt = boton.querySelector(".txt");
        if (txt) txt.textContent = "Reto completado hoy";
        boton.disabled = true;
      }
      if (retoIcono)
        retoIcono.innerHTML =
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--verde-sombra)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6 9 17-5-5"/><path d="M20 6 9 17l-5-5"/></svg>';
      if (retoTitulo) retoTitulo.textContent = "Completaste el reto de hoy";
      if (retoSub) retoSub.textContent = "Vuelve mañana para seguir tu racha";
      if (diaHoy) {
        diaHoy.classList.remove("hoy");
        diaHoy.classList.add("hecho");
        const c = diaHoy.querySelector(".c");
        if (c)
          c.innerHTML =
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--hse-blanco)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
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
        if (estadoForzado === "empty") {
          vacio?.classList.add("show");
          return;
        }
        if (retoTitulo) retoTitulo.textContent = `Reto de hoy · ${reto.moduloTitulo}`;
        if (retoSub) retoSub.textContent = "3 minutos · responde la pregunta de seguridad";
        contenido?.classList.add("show");
        revelarStagger();
        contarHasta(root!.querySelector("#apRachaNum"), rachaActual, 700);
        if (yaCompletadoHoy) marcarCompletadoHoyEnUI();
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

    const ejercicio = root.querySelector<HTMLElement>("#apEjercicio");
    const ejPregunta = root.querySelector<HTMLElement>("#apEjPregunta");
    const ejExito = root.querySelector<HTMLElement>("#apEjExito");
    const ejFeedback = root.querySelector<HTMLElement>("#apEjFeedback");
    const ejIntro = root.querySelector<HTMLElement>("#apEjIntro");
    const ejTit = root.querySelector<HTMLElement>("#apEjTit");
    const ejGrid = root.querySelector<HTMLElement>("#apEjGrid");
    const ejExitoTxt = root.querySelector<HTMLElement>("#apEjExitoTxt");
    let ejResuelto = false;
    let retoYaCompletado = yaCompletadoHoy;
    let enviandoIntento = false;

    // "Vidas" (cascos): mecánica visible y predecible, NUNCA una barrera para completar la
    // capacitación obligatoria del día — mandato de FICHA-MODELO.md §5 (lo opuesto al sistema
    // de "energía" de Duolingo que frustra a quien ya pagó). Bajan con cada respuesta
    // incorrecta del reto de hoy, se reinician a 3 en cada reto nuevo, y en 0 se sigue
    // pudiendo responder las veces que haga falta.
    const chipVidas = root.querySelector<HTMLElement>("#apChipVidas");
    let vidasRestantes = 3;
    function actualizarVidas() {
      if (chipVidas) chipVidas.textContent = String(vidasRestantes);
    }

    function pintarPregunta() {
      if (ejIntro) ejIntro.textContent = reto.intro;
      if (ejTit) ejTit.textContent = reto.pregunta;
      if (!ejGrid) return;
      ejGrid.innerHTML = "";
      reto.opciones.forEach((texto, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ap-ej-item";
        btn.dataset.idx = String(idx);
        btn.textContent = texto;
        ejGrid.appendChild(btn);
      });
    }

    function abrirEjercicio() {
      if (retoYaCompletado) {
        mostrarToast("Ya completaste tu reto de hoy. Vuelve mañana.");
        return;
      }
      ejResuelto = false;
      vidasRestantes = 3;
      actualizarVidas();
      ejExito?.classList.remove("show");
      if (ejPregunta) ejPregunta.style.display = "";
      if (ejFeedback) {
        ejFeedback.className = "ap-ej-feedback";
        ejFeedback.textContent = "";
      }
      pintarPregunta();
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

    ejGrid?.addEventListener("click", async (ev) => {
      const item = (ev.target as HTMLElement)?.closest<HTMLElement>(".ap-ej-item");
      if (!item || ejResuelto || enviandoIntento) return;
      const idx = Number(item.dataset.idx);
      const esCorrecta = idx === reto.respuestaCorrecta;
      if (!esCorrecta) {
        item.classList.add("incorrecto");
        window.setTimeout(() => item.classList.remove("incorrecto"), 500);
        vidasRestantes = Math.max(0, vidasRestantes - 1);
        actualizarVidas();
        if (ejFeedback) {
          ejFeedback.textContent =
            vidasRestantes > 0
              ? "Esa no es — vuelve a intentarlo."
              : "Esa no es — sigue intentando, el reto de hoy no se bloquea.";
          ejFeedback.className = "ap-ej-feedback mal show";
        }
        return;
      }

      ejResuelto = true;
      item.classList.add("correcto");
      navigator.vibrate?.(20);

      if (!reto.leccionId) {
        window.setTimeout(() => {
          if (ejPregunta) ejPregunta.style.display = "none";
          if (ejExitoTxt) ejExitoTxt.textContent = reto.explicacion;
          ejExito?.classList.add("show");
        }, 450);
        return;
      }

      enviandoIntento = true;
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("registrar_intento", {
        p_lesson_id: reto.leccionId,
        p_score: 100,
        p_passed: true,
      });
      enviandoIntento = false;

      if (rpcError) {
        item.classList.remove("correcto");
        ejResuelto = false;
        mostrarToast("No pudimos guardar tu respuesta — revisa tu conexión e intenta de nuevo.");
        return;
      }

      const nuevaRacha = data?.[0]?.o_current_streak ?? rachaActual;
      rachaActual = nuevaRacha;

      window.setTimeout(() => {
        if (ejPregunta) ejPregunta.style.display = "none";
        if (ejExitoTxt) ejExitoTxt.textContent = reto.explicacion;
        ejExito?.classList.add("show");
      }, 450);
    });

    function completarReto() {
      retoYaCompletado = true;
      marcarCompletadoHoyEnUI();
      contarHasta(root!.querySelector("#apRachaNum"), rachaActual, 500);
      heroe?.classList.add("pulso");
      window.setTimeout(() => heroe?.classList.remove("pulso"), 450);
      navigator.vibrate?.(20);
      if (anuncio) anuncio.textContent = "Reto completado. Tu racha de seguridad ahora es de " + rachaActual + " días.";
    }

    root.querySelector("#apEjContinuar")?.addEventListener("click", () => {
      cerrarEjercicio();
      completarReto();
    });

    boton?.addEventListener("click", () => {
      if (boton.disabled) return;
      boton.classList.add("cargando");
      boton.disabled = true;
      window.setTimeout(() => {
        boton.classList.remove("cargando");
        boton.disabled = retoYaCompletado;
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
  }, [router, nombreTrabajador, rachaInicial, yaCompletadoHoy, modulosAprobados, totalModulos, reto]);

  return (
    <div
      ref={rootRef}
      className="ap"
      dangerouslySetInnerHTML={{ __html: APP_HOME_HTML }}
    />
  );
}
