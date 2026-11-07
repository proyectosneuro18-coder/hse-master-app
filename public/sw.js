// Service worker de HSE Master App — modo sin señal de la app del trabajador (/app).
// Promesa de venta (landing → "Sin señal, sin excusa" + FAQ): el reto se completa sin
// conexión y se sincroniza solo. Ver ESTADO.md → Decisiones técnicas → Offline-first.
//
// Estrategia:
//  - Páginas del trabajador (/app, /app/progreso, /app/ranking, /app/perfil): primero la red;
//    si no hay señal, la última copia guardada. Así siempre se ve lo más nuevo cuando hay red.
//  - Archivos del build (/_next/static/*) y marca (/brand/*): llevan hash en el nombre, nunca
//    cambian → se sirven desde la copia guardada.
//  - Nada más se toca: ni /api, ni el panel del Gerente, ni el login, ni Supabase (otro dominio),
//    ni peticiones que no sean GET. Los datos privados quedan solo en el celular del propio
//    trabajador y se borran al cerrar sesión (mensaje "limpiar").

const VERSION = "v1";
const CACHE_PAGINAS = `hse-paginas-${VERSION}`;
const CACHE_ESTATICOS = `hse-estaticos-${VERSION}`;
const PAGINAS_TRABAJADOR = ["/app", "/app/progreso", "/app/ranking", "/app/perfil"];

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(
        nombres
          .filter((n) => n.startsWith("hse-") && n !== CACHE_PAGINAS && n !== CACHE_ESTATICOS)
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

function esPaginaTrabajador(url) {
  return PAGINAS_TRABAJADOR.includes(url.pathname.replace(/\/$/, "") || "/");
}

function esEstatico(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/brand/");
}

// Una respuesta solo se guarda si es la página real (no una redirección al login por sesión
// vencida, ni un error del servidor).
function sePuedeGuardar(resp) {
  return resp && resp.ok && !resp.redirected && resp.type === "basic";
}

async function guardarEstaticosDeLaPagina(html) {
  const urls = new Set();
  // Se guarda por ruta sin "?..." — así lo busca después el manejador de fetch de abajo.
  for (const m of html.matchAll(/\/_next\/static\/[^"'\\\s)<>?]+/g)) urls.add(m[0]);
  const cache = await caches.open(CACHE_ESTATICOS);
  await Promise.all(
    [...urls].map(async (u) => {
      if (await cache.match(u)) return;
      try {
        const r = await fetch(u);
        if (!r.ok) return;
        await cache.put(u, r.clone());
        // Las hojas de estilo traen las fuentes (Baloo 2 / DM Sans) dentro: también se guardan.
        if (u.endsWith(".css")) {
          const css = await r.text();
          for (const f of css.matchAll(/\/_next\/static\/media\/[^"')\s]+/g)) {
            if (!(await cache.match(f[0]))) {
              const rf = await fetch(f[0]).catch(() => null);
              if (rf && rf.ok) await cache.put(f[0], rf);
            }
          }
        }
      } catch {
        // sin red en este momento: se reintenta en la próxima visita con señal
      }
    }),
  );
}

async function guardarPagina(ruta, resp) {
  const cache = await caches.open(CACHE_PAGINAS);
  await cache.put(ruta, resp.clone());
  const html = await resp.text();
  await guardarEstaticosDeLaPagina(html);
}

// Descarga las 4 pantallas del trabajador para que estén listas ANTES de perder la señal.
async function precargarPaginas() {
  await Promise.all(
    PAGINAS_TRABAJADOR.map(async (ruta) => {
      try {
        const r = await fetch(ruta, { credentials: "same-origin", redirect: "follow" });
        if (sePuedeGuardar(r)) await guardarPagina(ruta, r);
      } catch {
        // sin red: queda la copia anterior
      }
    }),
  );
}

self.addEventListener("message", (event) => {
  const tipo = event.data && event.data.tipo;
  if (tipo === "precargar") {
    event.waitUntil(precargarPaginas());
  } else if (tipo === "limpiar") {
    // Cerrar sesión: no deben quedar datos del trabajador en el celular.
    event.waitUntil(caches.delete(CACHE_PAGINAS));
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" && esPaginaTrabajador(url)) {
    const ruta = url.pathname.replace(/\/$/, "");
    event.respondWith(
      (async () => {
        try {
          const r = await fetch(req);
          if (sePuedeGuardar(r)) event.waitUntil(guardarPagina(ruta, r.clone()));
          return r;
        } catch {
          const cache = await caches.open(CACHE_PAGINAS);
          const copia = (await cache.match(ruta)) || (await cache.match("/app"));
          return copia || Response.error();
        }
      })(),
    );
    return;
  }

  if (esEstatico(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_ESTATICOS);
        const copia = await cache.match(url.pathname);
        if (copia) return copia;
        const r = await fetch(req);
        if (r.ok) event.waitUntil(cache.put(url.pathname, r.clone()));
        return r;
      })(),
    );
  }
});
