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

export function statusForEvent(event: string): SubscriptionStatus | null {
  return EVENT_TO_STATUS[event] ?? null;
}

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivar un refund/chargeback con un evento viejo reentregado. */
export function canTransition(from: SubscriptionStatus | null, to: SubscriptionStatus): boolean {
  if (from === null) return true;
  if (TERMINAL_NEGATIVE.includes(from) && (to === "active" || to === "trialing")) return false;
  return true;
}

export type MotivoSinAcceso = "trial_vencido" | "pago_fallido" | "cancelado" | "otro";

export type AccesoInfo = { tieneAcceso: true } | { tieneAcceso: false; motivo: MotivoSinAcceso };

// Único punto de verdad para decidir si una organización puede USAR la app hoy. `trialing`
// NO es acceso incondicional: expira en `trialEndsAt` igual que cualquier otro estado expira
// en su propia fecha — antes de esta función, nada en el código leía `trial_ends_at` para
// cortar el acceso (ver ESTADO.md → Sesión 7, punto 3).
export function evaluarAcceso(
  status: SubscriptionStatus,
  now: Date,
  fechas: { trialEndsAt?: Date | null; accessUntil?: Date | null; graceEndsAt?: Date | null },
): AccesoInfo {
  if (status === "active") return { tieneAcceso: true };
  if (status === "trialing") {
    if (!fechas.trialEndsAt || now < fechas.trialEndsAt) return { tieneAcceso: true };
    return { tieneAcceso: false, motivo: "trial_vencido" };
  }
  if (status === "past_due") {
    if (fechas.graceEndsAt && now < fechas.graceEndsAt) return { tieneAcceso: true };
    return { tieneAcceso: false, motivo: "pago_fallido" };
  }
  if (status === "cancelled") {
    if (fechas.accessUntil && now < fechas.accessUntil) return { tieneAcceso: true };
    return { tieneAcceso: false, motivo: "cancelado" };
  }
  return { tieneAcceso: false, motivo: "otro" }; // expired, refunded, chargeback
}
