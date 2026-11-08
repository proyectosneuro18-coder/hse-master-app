// Analítica de producto (cliente) — 36-ANALITICA-Y-EVENTOS.md + 60-OPERACION-DE-CONVERSION.md.
// ÚNICO punto de contacto con PostHog en el navegador: los componentes solo importan estas
// funciones, nunca `posthog-js` directo.
//
// Reglas que este archivo garantiza:
//  - Eventos `objeto_accion` en snake_case (nombres estables: renombrar parte la serie histórica).
//  - CERO datos personales en eventos: ni nombre, ni correo — la identidad es el user_id (uuid).
//  - Consentimiento (Ley 1581 / 47): antes de que la persona acepte, PostHog corre en memoria
//    (sin cookies ni almacenamiento en su navegador); al aceptar pasa a persistencia normal.
//    Si rechaza, sigue en memoria para siempre (se mide la visita, sin rastrearla entre visitas).
//  - Sesión comercial de 30 min de inactividad (`session_id`) y marca `is_qa` con `?qa=1`.
//  - Atribución: el primer `src`/`utm_source` que trae la persona se guarda 30 días y viaja en
//    cada evento como `source` (y al checkout de Hotmart como `sck`).
//  - Sin clave configurada (NEXT_PUBLIC_POSTHOG_KEY vacía) no hace nada: la app nunca se rompe.
import posthog from "posthog-js";

export type Consentimiento = "aceptado" | "rechazado" | null;

const CLAVE_CONSENTIMIENTO = "hse:consentimiento-analitica";
const CLAVE_ORIGEN = "hse:origen";
const CLAVE_SESION = "hse:sesion";
const CLAVE_QA = "hse:qa";
const CLAVE_DIA_ACTIVO = "hse:ultimo-dia-activo";
const TREINTA_MIN = 30 * 60 * 1000;
const TREINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

let iniciado = false;

function haySoporte() {
  return typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
}

function leer(almacen: "local" | "session", clave: string): string | null {
  try {
    return (almacen === "local" ? window.localStorage : window.sessionStorage).getItem(clave);
  } catch {
    return null;
  }
}

function escribir(almacen: "local" | "session", clave: string, valor: string) {
  try {
    (almacen === "local" ? window.localStorage : window.sessionStorage).setItem(clave, valor);
  } catch {
    // modo privado estricto: se mide igual, solo sin recordar entre páginas
  }
}

export function leerConsentimiento(): Consentimiento {
  const v = leer("local", CLAVE_CONSENTIMIENTO);
  return v === "aceptado" || v === "rechazado" ? v : null;
}

// Lo que se guarda en el navegador para medir (origen, sesión, día activo) solo se guarda si la
// persona aceptó. Antes de eso vive en memoria de la página.
const memoria = new Map<string, string>();
function guardarMedicion(clave: string, valor: string) {
  memoria.set(clave, valor);
  if (leerConsentimiento() === "aceptado") escribir("local", clave, valor);
}
function leerMedicion(clave: string): string | null {
  return memoria.get(clave) ?? (leerConsentimiento() === "aceptado" ? leer("local", clave) : null);
}

function capturarOrigenYQa() {
  const p = new URLSearchParams(window.location.search);
  if (p.get("qa") === "1") escribir("session", CLAVE_QA, "1");

  const src = p.get("src") ?? p.get("utm_source");
  if (!src) return;
  const crudo = leerMedicion(CLAVE_ORIGEN);
  const previo = crudo ? (JSON.parse(crudo) as { source: string; at: number }) : null;
  // Primer toque gana mientras siga vigente (30 días).
  if (previo && Date.now() - previo.at < TREINTA_DIAS) return;
  const limpio = src.toLowerCase().replace(/[^a-z0-9_:-]/g, "").slice(0, 60);
  if (limpio) guardarMedicion(CLAVE_ORIGEN, JSON.stringify({ source: limpio, at: Date.now() }));
}

export function origenActual(): string {
  try {
    const crudo = leerMedicion(CLAVE_ORIGEN);
    if (!crudo) return "directo";
    const { source, at } = JSON.parse(crudo) as { source: string; at: number };
    return Date.now() - at < TREINTA_DIAS ? source : "directo";
  } catch {
    return "directo";
  }
}

function sesionActual(): string {
  const ahora = Date.now();
  try {
    const crudo = leerMedicion(CLAVE_SESION);
    const s = crudo ? (JSON.parse(crudo) as { id: string; ultimo: number }) : null;
    const id = s && ahora - s.ultimo < TREINTA_MIN ? s.id : crypto.randomUUID();
    guardarMedicion(CLAVE_SESION, JSON.stringify({ id, ultimo: ahora }));
    return id;
  } catch {
    return "sin-sesion";
  }
}

export function esQa(): boolean {
  return leer("session", CLAVE_QA) === "1";
}

export function initAnalytics() {
  if (!haySoporte() || iniciado) return;
  iniciado = true;
  capturarOrigenYQa();
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false, // solo eventos de producto con nombre (36)
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: "identified_only",
    persistence: leerConsentimiento() === "aceptado" ? "localStorage+cookie" : "memory",
  });
}

export function guardarConsentimiento(valor: "aceptado" | "rechazado") {
  escribir("local", CLAVE_CONSENTIMIENTO, valor);
  if (valor === "aceptado") {
    for (const [k, v] of memoria) escribir("local", k, v);
    if (iniciado) posthog.set_config({ persistence: "localStorage+cookie" });
  }
  track("consentimiento_respondido", { respuesta: valor });
}

export function track(evento: string, props: Record<string, unknown> = {}) {
  if (!haySoporte()) return;
  if (!iniciado) initAnalytics();
  posthog.capture(evento, {
    ...props,
    source: origenActual(),
    session_id: sesionActual(),
    is_qa: esQa(),
  });
}

// Identidad SIN datos personales: solo el uuid y propiedades no sensibles.
export function identificar(userId: string, props: { rol: "gerente" | "trabajador"; plan?: string }) {
  if (!haySoporte()) return;
  if (!iniciado) initAnalytics();
  posthog.identify(userId, { ...props, source: origenActual() });
}

export function olvidarIdentidad() {
  if (!haySoporte() || !iniciado) return;
  posthog.reset();
}

// Una vez por día activo (base de la retención D1/D7/D30 — 36). Requiere consentimiento para
// recordar el día entre visitas; sin él, se emite como mucho una vez por visita.
export function trackDiaActivo(props: Record<string, unknown>) {
  const d = new Date();
  const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  if (!haySoporte()) return;
  if (!iniciado) initAnalytics();
  // Por persona: en un celular compartido (o el mismo navegador) cada identidad cuenta su día.
  const clave = `${CLAVE_DIA_ACTIVO}:${posthog.get_distinct_id()}`;
  if (leerMedicion(clave) === hoy) return;
  guardarMedicion(clave, hoy);
  track("sesion_iniciada", props);
}

// Cuando un elemento entra de verdad en pantalla (≥35% visible), una sola vez (60: "visto"
// es exposición real, no montaje del componente).
export function alVerse(el: Element | null, alAparecer: () => void): () => void {
  if (!el || typeof IntersectionObserver === "undefined") return () => {};
  const obs = new IntersectionObserver(
    ([entrada]) => {
      if (!entrada?.isIntersecting) return;
      alAparecer();
      obs.disconnect();
    },
    { threshold: 0.35 },
  );
  obs.observe(el);
  return () => obs.disconnect();
}
