// Cola de retos completados SIN SEÑAL (modo offline del trabajador).
// Cuando el trabajador responde bien el reto y no hay conexión, el intento se guarda aquí, en
// el propio celular, y se envía solo a Supabase cuando vuelve la señal (al abrir la app con red
// o al dispararse el evento `online`). Ver public/sw.js para la otra mitad (abrir la app sin red).
//
// Se usa localStorage (no IndexedDB): el volumen es mínimo (1 reto por día, máx. unos pocos días
// sin señal) y quien envía es la propia página, no el service worker — no hace falta más.

import { createClient } from "@/lib/supabase/client";

export type RetoPendiente = {
  leccionId: string;
  fecha: string; // día LOCAL del celular en que se completó (YYYY-MM-DD)
  // Índice de la opción elegida: el SERVIDOR califica (0013). Los retos guardados antes de ese
  // cambio no lo traen; ver `sincronizarPendientes`.
  respuesta?: number;
};

export type UltimoReto = {
  fecha: string; // día local del último reto completado (con o sin señal)
  racha: number; // racha que se le mostró al trabajador ese día
};

const MAX_PENDIENTES = 10;

const clavePendientes = (uid: string) => `hse:retos-pendientes:${uid}`;
const claveUltimo = (uid: string) => `hse:ultimo-reto:${uid}`;

export function fechaLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

export function fechaLocalAyer(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return fechaLocal(d);
}

function leerJSON<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = window.localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribirJSON(clave: string, valor: unknown): boolean {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false; // modo privado estricto / almacenamiento lleno: quien llama decide qué decir
  }
}

export function leerPendientes(uid: string): RetoPendiente[] {
  const lista = leerJSON<RetoPendiente[]>(clavePendientes(uid), []);
  return Array.isArray(lista) ? lista : [];
}

export function agregarPendiente(uid: string, reto: RetoPendiente): boolean {
  const lista = leerPendientes(uid).filter((p) => p.fecha !== reto.fecha);
  lista.push(reto);
  lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
  return escribirJSON(clavePendientes(uid), lista.slice(-MAX_PENDIENTES));
}

export function leerUltimo(uid: string): UltimoReto | null {
  return leerJSON<UltimoReto | null>(claveUltimo(uid), null);
}

export function guardarUltimo(uid: string, ultimo: UltimoReto) {
  escribirJSON(claveUltimo(uid), ultimo);
}

// Un error de "sin red" de supabase-js no trae código de Postgres (viene de fetch()).
function esErrorDeRed(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false;
  if (typeof navigator !== "undefined" && !navigator.onLine) return true;
  return !err.code || /fetch|network|load failed/i.test(err.message ?? "");
}

export type ResultadoEnvio =
  | { tipo: "guardado"; racha: number | null }
  | { tipo: "sin-red" }
  | { tipo: "error"; rechazadoAPropósito: boolean };

// Rechazos deliberados de `registrar_intento` (0013): reintentarlos nunca va a funcionar.
// P0001 = no autenticado / ya no es trabajador activo · 22023 = fecha fuera del rango de 3 días,
// lección fuera de orden o ya completó un reto ese día.
const RECHAZOS_DEFINITIVOS = new Set(["P0001", "22023"]);

export async function enviarIntento(leccionId: string, respuesta: number, fecha: string): Promise<ResultadoEnvio> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return { tipo: "sin-red" };
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("registrar_intento", {
      p_lesson_id: leccionId,
      p_respuesta: respuesta,
      p_fecha: fecha,
    });
    if (error) {
      if (esErrorDeRed(error)) return { tipo: "sin-red" };
      return { tipo: "error", rechazadoAPropósito: RECHAZOS_DEFINITIVOS.has(error.code ?? "") };
    }
    const fila = (data as { o_current_streak: number }[] | null)?.[0];
    return { tipo: "guardado", racha: fila?.o_current_streak ?? null };
  } catch {
    return { tipo: "sin-red" };
  }
}

let sincronizando = false;

// Envía en orden de fecha todo lo pendiente. Lo que no se pudo enviar por falta de red o por una
// falla del servidor queda para el próximo intento (nunca se pierde un reto por un error ajeno al
// trabajador); solo lo que el servidor rechaza A PROPÓSITO (p. ej. fecha fuera del rango de 3
// días) se descarta, para no reintentarlo para siempre.
// `respaldo`: el reto que la app muestra hoy y su respuesta correcta. Sirve para los retos que
// quedaron en cola ANTES de que el servidor calificara (0013) y no traen `respuesta`: la versión
// vieja solo encolaba retos respondidos BIEN, así que su respuesta era la correcta. Si la lección
// no coincide, no hay forma honesta de calificarlo y se descarta.
export async function sincronizarPendientes(
  uid: string,
  respaldo?: { leccionId: string | null; respuestaCorrecta: number },
): Promise<{ enviados: number; racha: number | null }> {
  if (sincronizando) return { enviados: 0, racha: null };
  sincronizando = true;
  let enviados = 0;
  let racha: number | null = null;
  try {
    const pendientes = leerPendientes(uid);
    const quedan: RetoPendiente[] = [];
    for (let i = 0; i < pendientes.length; i++) {
      const p = pendientes[i];
      const respuesta =
        p.respuesta ?? (respaldo && respaldo.leccionId === p.leccionId ? respaldo.respuestaCorrecta : undefined);
      if (respuesta === undefined) continue;
      const r = await enviarIntento(p.leccionId, respuesta, p.fecha);
      if (r.tipo === "guardado") {
        enviados++;
        racha = r.racha ?? racha;
      } else if (r.tipo === "sin-red" || !r.rechazadoAPropósito) {
        quedan.push(...pendientes.slice(i));
        break;
      }
    }
    escribirJSON(clavePendientes(uid), quedan);
  } finally {
    sincronizando = false;
  }
  return { enviados, racha };
}
