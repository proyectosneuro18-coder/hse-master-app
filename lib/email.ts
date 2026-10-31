import { Resend } from "resend";
import { env } from "@/lib/env";

// Emails transaccionales del flujo de pago (18-VENTA-HOTMART.md → "EMAILS CON RESEND").
// Modelo trial-first: el usuario YA tiene cuenta desde que activó su prueba en la app
// (ese login corre con el magic link propio de Supabase, no con Resend). Estos 3 emails
// cubren el momento en que Hotmart confirma dinero real: pago aprobado, pago fallido,
// cancelación — no un "bienvenido, crea tu cuenta" porque la cuenta ya existía.

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM = `HSE Master App <${env.EMAIL_FROM ?? "hola@hse-master-app.com"}>`;
const APP_URL = "https://hse-master-app.com";

function wrap(bodyHtml: string) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#FFFAF0;padding:32px 16px">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border:3px solid #1A1A1A;
        border-radius:20px;padding:32px 28px">
        ${bodyHtml}
        <p style="color:#6B6B6B;font-size:13px;margin-top:32px">
          ¿Dudas? Responde a este correo y te ayudamos.
        </p>
      </div>
    </div>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#FFE600;color:#1A1A1A;
    padding:14px 28px;border:3px solid #1A1A1A;border-radius:16px;text-decoration:none;
    font-weight:700;font-size:15px;margin-top:16px">${label}</a>`;
}

// Fuera de este módulo NUNCA se registra el resultado del envío con datos del comprador (PII).
async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.error("email: RESEND_API_KEY no configurada, correo no enviado", { subject });
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("email: fallo al enviar", { subject, error: err instanceof Error ? err.message : err });
  }
}

export async function sendPaymentConfirmedEmail(email: string, planName?: string | null) {
  const plan = planName ? ` (plan ${planName})` : "";
  await send(
    email,
    "Tu pago quedó confirmado — tu cuadrilla sigue capacitándose",
    wrap(`
      <h1 style="font-size:22px;margin:0 0 12px">¡Listo, tu pago fue aprobado! 🎉</h1>
      <p style="font-size:15px;line-height:1.5;color:#1A1A1A">
        Tu suscripción a HSE Master App${plan} ya está activa. Tu cuadrilla sigue viendo
        su racha, su ranking y su Pasaporte Digital sin interrupciones.
      </p>
      ${button(`${APP_URL}/login`, "Entrar a mi panel →")}
    `),
  );
}

export async function sendPaymentFailedEmail(email: string) {
  await send(
    email,
    "No pudimos procesar tu pago — así lo arreglas",
    wrap(`
      <h1 style="font-size:22px;margin:0 0 12px">Tu último pago no se procesó</h1>
      <p style="font-size:15px;line-height:1.5;color:#1A1A1A">
        Puede ser la tarjeta vencida o un rechazo del banco. Tu acceso sigue activo unos
        días mientras lo resuelves — actualiza tu método de pago para que no se interrumpa.
      </p>
      ${button(`${APP_URL}/login`, "Actualizar mi pago →")}
    `),
  );
}

export async function sendCancellationEmail(email: string, accessUntil?: string | null) {
  const hasta = accessUntil
    ? ` Tu acceso sigue activo hasta el ${new Date(accessUntil).toLocaleDateString("es")}.`
    : "";
  await send(
    email,
    "Confirmamos la cancelación de tu suscripción",
    wrap(`
      <h1 style="font-size:22px;margin:0 0 12px">Lamentamos verte ir</h1>
      <p style="font-size:15px;line-height:1.5;color:#1A1A1A">
        Tu suscripción a HSE Master App quedó cancelada.${hasta} Si fue por algo que
        podamos resolver, responde este correo — con gusto lo vemos contigo.
      </p>
      ${button(`${APP_URL}/login`, "Reactivar mi cuenta →")}
    `),
  );
}
