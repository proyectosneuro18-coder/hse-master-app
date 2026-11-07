"use client";

import { useEffect } from "react";

// Activa el modo sin señal de la app del trabajador (public/sw.js) y precarga sus 4 pantallas
// cada vez que se abre con red, para que estén listas antes de entrar a una zona sin cobertura.
// Solo en producción: en `next dev` los archivos no llevan hash y una copia guardada dejaría
// ver código viejo mientras se desarrolla.
export function RegistrarServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    let cancelado = false;
    const precargar = () => {
      if (navigator.onLine) navigator.serviceWorker.controller?.postMessage({ tipo: "precargar" });
    };

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        if (cancelado) return;
        // En la primera visita la página aún no está controlada: se le pide al worker activo.
        (navigator.serviceWorker.controller ?? reg.active)?.postMessage({ tipo: "precargar" });
      })
      .catch(() => {
        // Navegador sin soporte o modo privado: la app sigue funcionando con red, solo sin modo offline.
      });

    window.addEventListener("online", precargar);
    return () => {
      cancelado = true;
      window.removeEventListener("online", precargar);
    };
  }, []);

  return null;
}

// Al cerrar sesión: borra del celular las pantallas guardadas del trabajador.
export async function limpiarCopiasSinSenal() {
  try {
    navigator.serviceWorker?.controller?.postMessage({ tipo: "limpiar" });
    if ("caches" in window) await caches.delete("hse-paginas-v1");
  } catch {
    // nada que limpiar
  }
}
