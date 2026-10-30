// Máquina de estados de la suscripción de una organización (patrón de docs/sistema/18-VENTA-HOTMART.md).
//
// El trial de 14 días NO pasa por Hotmart (la app lo activa sola al registrarse, ver ESTADO.md
// → "Estrategia de monetización"): el estado 'trialing' nace en la app. Hotmart solo entra
// cuando hay un COBRO REAL — por eso aquí no hay un evento de "inicio de trial" de Hotmart.
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "refunded"
  | "chargeback";

// ⚠️ Verificar en el panel de Hotmart (Herramientas → Webhook) antes de confiar en estos
// nombres: el catálogo de eventos puede variar por cuenta/versión (18-VENTA-HOTMART.md).
const EVENT_TO_STATUS: Record<string, SubscriptionStatus> = {
  PURCHASE_APPROVED: "active",
  PURCHASE_COMPLETE: "active",
  PURCHASE_DELAYED: "past_due",
  SUBSCRIPTION_CANCELLATION: "cancelled",
  PURCHASE_EXPIRED: "expired",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
};

// SWITCH_PLAN (cambio nativo mensual↔anual) no cambia el estado — solo el plan_name.
export const PLAN_CHANGE_EVENT = "SWITCH_PLAN";

const TERMINAL_NEGATIVE: SubscriptionStatus[] = ["refunded", "chargeback"];
const FULL_ACCESS: SubscriptionStatus[] = ["trialing", "active"];

export function statusForEvent(event: string): SubscriptionStatus | null {
  return EVENT_TO_STATUS[event] ?? null;
}

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivar un refund/chargeback con un evento viejo reentregado. */
export function canTransition(from: SubscriptionStatus | null, to: SubscriptionStatus): boolean {
  if (from === null) return true;
  if (TERMINAL_NEGATIVE.includes(from) && (to === "active" || to === "trialing")) return false;
  return true;
}

export function hasFullAccess(
  status: SubscriptionStatus,
  now: Date,
  accessUntil?: Date | null,
  graceEndsAt?: Date | null,
): boolean {
  if (FULL_ACCESS.includes(status)) return true;
  if (status === "cancelled") return !!accessUntil && now < accessUntil;
  if (status === "past_due") return !!graceEndsAt && now < graceEndsAt;
  return false;
}
