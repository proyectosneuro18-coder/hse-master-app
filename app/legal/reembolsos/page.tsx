import "../legal.css";
import { LegalHeader, LegalNav, LegalWrap } from "../LegalChrome";

// Plazo de 21 días VERIFICADO en el panel de Hotmart (sección "Fijación de precios" del
// producto) el 2026-11-02 — ver FICHA-MERCADO.md §4. Si el dueño cambia ese número en Hotmart,
// hay que subir este texto también.
export default function ReembolsosPage() {
  return (
    <div className="lx-page">
      <LegalHeader />
      <LegalWrap>
        <p className="lx-fecha">Última actualización: 2 de noviembre de 2026</p>
        <h1 className="lx-titulo">Política de Reembolsos y Cancelación</h1>
        <p className="lx-resumen">
          En simple: la prueba de 14 días es gratis, así que no hay nada que cobrarte hasta que tú
          decides seguir. Si ya pagaste y te arrepientes, tienes 21 días para pedir que te
          devolvamos tu dinero. Y cancelar tu suscripción toma menos de 2 minutos, sin llamarnos.
        </p>

        <h2>1. Durante la prueba gratis</h2>
        <p>
          Los primeros 14 días no se cobra nada — no pedimos tarjeta para empezar. No hay ningún
          cargo que reembolsar mientras estás en la prueba.
        </p>

        <h2>2. Si ya pagaste</h2>
        <p>
          Una vez que activas un plan pago, tienes <strong>21 días corridos desde la fecha de
          compra</strong> para pedir el reembolso completo de tu primer pago, sin tener que dar
          explicaciones. Este plazo lo administra y lo garantiza directamente{" "}
          <strong>Hotmart</strong>, nuestro procesador de pagos.
        </p>
        <p>
          Para pedirlo: ingresa a tu cuenta de comprador en{" "}
          <a href="https://www.hotmart.com" target="_blank" rel="noopener noreferrer">hotmart.com</a>
          {" "}→ Compras → selecciona HSE Master App → Solicitar reembolso. También puedes
          escribirnos a <a href="mailto:soporte@hse-master-app.com">soporte@hse-master-app.com</a> y
          te ayudamos con el trámite.
        </p>
        <p>
          Pasados los 21 días, los cobros ya realizados no son reembolsables, pero puedes cancelar
          la renovación cuando quieras para que no se te vuelva a cobrar (ver abajo).
        </p>

        <h2>3. Cómo cancelar tu suscripción</h2>
        <p>Cancelar no borra tu historial ni tu progreso — solo detiene el próximo cobro.</p>
        <ol>
          <li>Ingresa a <a href="https://www.hotmart.com" target="_blank" rel="noopener noreferrer">hotmart.com</a> con el correo con el que compraste.</li>
          <li>Ve a <strong>Compras</strong> y selecciona <strong>HSE Master App</strong>.</li>
          <li>Toca <strong>Cancelar suscripción</strong>.</li>
        </ol>
        <p>
          Tu cuadrilla mantiene el acceso hasta el final del período que ya pagaste. Después de
          esa fecha, el acceso se pausa (no se borra) — puedes reactivar cuando quieras.
        </p>
        <p>Si prefieres que lo hagamos por ti, escríbenos a <a href="mailto:soporte@hse-master-app.com">soporte@hse-master-app.com</a> con el correo de tu cuenta.</p>

        <h2>4. Si un pago falla</h2>
        <p>
          Si tu método de pago falla, Hotmart reintenta el cobro automáticamente durante unos días
          y te avisamos por correo. Si no se logra procesar, el acceso se pausa hasta que
          actualices tu método de pago — no se trata de una cancelación, puedes reactivar en
          cualquier momento.
        </p>

        <LegalNav actual="reembolsos" />
      </LegalWrap>
    </div>
  );
}
