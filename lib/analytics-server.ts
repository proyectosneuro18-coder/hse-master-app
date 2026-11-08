import { PostHog } from "posthog-node";

// Analítica server-side (36 → "Captura server-side de eventos críticos"): lo que mueve dinero o
// llega por webhook se registra aquí, no en el navegador (un bloqueador de anuncios no puede
// borrar una venta). Mismo `distinctId` (user_id) que `identificar()` en el cliente → se unen.
// Sin POSTHOG_KEY configurada no hace nada. Nunca lanza: medir jamás debe romper un webhook.

let cliente: PostHog | null | undefined;

function ph(): PostHog | null {
  if (cliente !== undefined) return cliente;
  const key = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  cliente = key
    ? new PostHog(key, {
        host: process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        // Serverless: enviar al instante y vaciar al final de cada request (nunca shutdown por request).
        flushAt: 1,
        flushInterval: 0,
      })
    : null;
  return cliente;
}

export async function trackServidor(userId: string, evento: string, props: Record<string, unknown> = {}) {
  const c = ph();
  if (!c) return;
  try {
    c.capture({ distinctId: userId, event: evento, properties: { ...props, capturado: "server" } });
    await c.flush();
  } catch (e) {
    console.error("[analitica] no se pudo enviar", evento, e instanceof Error ? e.message : e);
  }
}

// Derecho de eliminación (47 / 36 → "DERECHO AL OLVIDO"): borra a la persona y sus eventos en
// PostHog. Requiere una clave PERSONAL de PostHog (secreta, solo servidor) y el ID del proyecto;
// sin ellas no se puede borrar desde aquí (se registra para hacerlo a mano). En PostHog solo hay
// un código interno (uuid), nunca nombre ni correo.
export async function olvidarEnAnalitica(userIds: string[]): Promise<{ borrados: number; pendiente: boolean }> {
  const clavePersonal = process.env.POSTHOG_PERSONAL_API_KEY;
  const proyecto = process.env.POSTHOG_PROJECT_ID;
  if (!userIds.length) return { borrados: 0, pendiente: false };
  if (!clavePersonal || !proyecto) {
    console.warn(`[analitica] borrado pendiente (sin clave personal) de ${userIds.length} persona(s)`);
    return { borrados: 0, pendiente: true };
  }
  const host = (process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(
    ".i.posthog.com",
    ".posthog.com",
  );
  let borrados = 0;
  for (const id of userIds) {
    try {
      const busq = await fetch(
        `${host}/api/projects/${proyecto}/persons/?distinct_id=${encodeURIComponent(id)}`,
        { headers: { Authorization: `Bearer ${clavePersonal}` } },
      );
      const datos = (await busq.json()) as { results?: { id: string }[] };
      for (const persona of datos.results ?? []) {
        const r = await fetch(`${host}/api/projects/${proyecto}/persons/${persona.id}/?delete_events=true`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${clavePersonal}` },
        });
        if (r.ok) borrados++;
      }
    } catch (e) {
      console.error("[analitica] no se pudo borrar una persona", e instanceof Error ? e.message : e);
    }
  }
  return { borrados, pendiente: false };
}
