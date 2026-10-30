import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyHotmart } from "@/lib/hotmart-verify";
import { statusForEvent, PLAN_CHANGE_EVENT } from "@/lib/membership-fsm";

// Endpoint que Hotmart llama cuando pasa algo con un pago. Patrón de seguridad completo en
// docs/sistema/18-VENTA-HOTMART.md → "SEGURIDAD DEL WEBHOOK DE HOTMART (implementación real)".
// (runtime Node, el default de este proyecto — necesitamos node:crypto y el raw body, no Edge;
// no se declara `export const runtime` porque choca con `cacheComponents` de next.config.ts)

const REPLAY_WINDOW_MS = 5 * 60 * 1000; // 5 minutos — rechaza peticiones repetidas/viejas
const GRACE_DAYS = 5; // días de gracia en pago atrasado antes de cortar el acceso

// ⚠️ Inactivo mientras no exista el producto real en Hotmart: una vez creado (Paso A de
// 18-VENTA-HOTMART.md), pegar su ID aquí como variable de entorno para activar el candado.
// Sin esto configurado, el endpoint sigue siendo seguro (el hottok ya filtra peticiones
// falsas) pero no distingue "tu producto" de otro producto de la misma cuenta Hotmart.
const EXPECTED_PRODUCT_ID = process.env.HOTMART_PRODUCT_ID;

async function logResult(
  admin: ReturnType<typeof createAdminClient>,
  result: "applied" | "duplicate" | "illegal" | "unauthorized" | "not_found" | "error",
  eventId?: string,
  type?: string,
  detail?: string,
) {
  await admin.from("webhook_log").insert({ event_id: eventId, type, result, detail });
}

export async function POST(req: NextRequest) {
  const admin = createAdminClient();

  // 1) RAW body (bytes exactos) — se lee ANTES de parsear, nunca se usa req.json() primero.
  const rawBody = await req.text();

  // 2) Autenticidad — hottok en tiempo constante, sobre HTTPS.
  const hottok = req.headers.get("x-hotmart-hottok") ?? undefined;
  if (!verifyHotmart({ hottok })) {
    await logResult(admin, "unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 3) Parsear SOLO después de verificar.
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // 4) Frescura (anti-replay).
  const ts = payload.creation_date ?? payload.data?.purchase?.approved_date;
  if (ts && Date.now() - Number(ts) > REPLAY_WINDOW_MS) {
    return NextResponse.json({ error: "stale" }, { status: 400 });
  }

  const event: string = payload.event;
  const eventId: string =
    payload.id ??
    payload.event_id ??
    payload.data?.purchase?.transaction ??
    `${event}:${payload.data?.buyer?.email}:${ts ?? ""}`; // compuesto determinista, NUNCA Date.now()

  // 5) Allowlist de catálogo (si ya se configuró el producto real — ver EXPECTED_PRODUCT_ID arriba).
  const productId: string | undefined = payload.data?.product?.id?.toString();
  if (EXPECTED_PRODUCT_ID && productId && productId !== EXPECTED_PRODUCT_ID) {
    await logResult(admin, "unauthorized", eventId, event, "product_id no coincide");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const email: string | undefined = payload.data?.buyer?.email ?? payload.email;
  const subscriberCode: string | undefined = payload.data?.subscription?.subscriber?.code;
  const planName: string | undefined = payload.data?.subscription?.plan?.name ?? payload.data?.plans?.[0]?.name;
  const transactionId: string | undefined = payload.data?.purchase?.transaction;
  const amountMinor: number | undefined = payload.data?.purchase?.price?.value
    ? Math.round(Number(payload.data.purchase.price.value) * 100)
    : undefined;
  const currency: string | undefined = payload.data?.purchase?.price?.currency_value;

  const newStatus = statusForEvent(event);
  const isPlanChange = event === PLAN_CHANGE_EVENT;

  if (!newStatus && !isPlanChange) {
    // Evento que no nos interesa (ej. uno que esta cuenta todavía no mapea) — 200 para que
    // Hotmart no lo reintente, pero SIN tocar ningún estado.
    return NextResponse.json({ received: true, ignored: event });
  }

  // Economía: solo los eventos de dinero real entran al ledger (dedupe de ingresos).
  let economicKind: "sale" | "refund" | "chargeback" | null = null;
  if (newStatus === "active") economicKind = "sale";
  else if (newStatus === "refunded") economicKind = "refund";
  else if (newStatus === "chargeback") economicKind = "chargeback";

  const now = Date.now();
  const firstPaidAt = newStatus === "active" ? new Date(now).toISOString() : null;
  const graceEndsAt = newStatus === "past_due" ? new Date(now + GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString() : null;
  // Cancelada: Hotmart debería mandar la fecha del próximo (ya no habrá) cobro — si no viene,
  // se corta el acceso de inmediato (fail-closed) en vez de regalar un período no confirmado.
  // ⚠️ Verificar el campo real en la prueba E2E (18-VENTA-HOTMART.md) y ajustar aquí.
  const accessUntil: string | null =
    newStatus === "cancelled" ? (payload.data?.subscription?.date_next_charge ? new Date(payload.data.subscription.date_next_charge).toISOString() : null) : null;

  const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

  const { data, error } = await admin.rpc("apply_hotmart_event", {
    p_event_id: eventId,
    p_event_type: event,
    p_payload_hash: payloadHash,
    p_email: email ?? null,
    p_subscriber_code: subscriberCode ?? null,
    p_new_status: isPlanChange ? null : newStatus,
    p_trial_ends_at: null,
    p_access_until: accessUntil,
    p_grace_ends_at: graceEndsAt,
    p_first_paid_at: firstPaidAt,
    p_plan_name: planName ?? null,
    p_transaction_id: economicKind ? transactionId ?? null : null,
    p_economic_kind: economicKind,
    p_amount_minor: amountMinor ?? null,
    p_currency: currency ?? null,
  });

  if (error) {
    console.error("webhook hotmart error", { event, code: error.code }); // nunca loguear el payload completo (PII)
    await logResult(admin, "error", eventId, event, error.code);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }

  const result = data as string; // 'applied' | 'duplicate' | 'illegal' | 'not_found'
  await logResult(admin, result as any, eventId, event);

  if (result === "not_found") {
    // No existe (todavía) una organización con ese email/código — no es un ataque, puede ser
    // un comprador que pagó en Hotmart antes de registrarse en la app. 200 para que Hotmart no
    // reintente indefinidamente; el soporte lo reconcilia a mano (ver "RUTA DE RESCATE DE ACCESO").
    return NextResponse.json({ received: true, matched: false });
  }

  return NextResponse.json({ received: true, result });
}
