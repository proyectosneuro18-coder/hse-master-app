import "../legal.css";
import { LegalHeader, LegalNav, LegalWrap } from "../LegalChrome";

export default function TerminosPage() {
  return (
    <div className="lx-page">
      <LegalHeader />
      <LegalWrap>
        <p className="lx-fecha">Última actualización: 1 de noviembre de 2026</p>
        <h1 className="lx-titulo">Términos y Condiciones</h1>
        <p className="lx-resumen">
          En simple: te damos una herramienta de entrenamiento diario en seguridad industrial. No
          reemplaza las capacitaciones y permisos que exige la ley en tu país — es un refuerzo
          diario para que tu equipo retenga lo que ya debe saber.
        </p>

        <h2>1. Qué es este servicio</h2>
        <p>
          HSE Master App es una aplicación de microaprendizaje: cada día, el trabajador responde
          una pregunta corta sobre seguridad industrial (HSE/IOGP) y acumula una racha. El Gerente
          de HSE ve ese progreso en un panel.
        </p>
        <p>
          <strong>Lo que NO es:</strong> no es un sistema de gestión de HSE completo, no sustituye
          las capacitaciones presenciales ni los permisos de trabajo que exige la regulación local
          o la política de seguridad de tu empresa, y no garantiza la ausencia de accidentes. Es
          una herramienta de refuerzo diario, no el único control de seguridad de tu operación.
        </p>

        <h2>2. Tu cuenta</h2>
        <ul>
          <li>El Gerente de HSE crea la cuenta de su empresa con su correo (sin contraseña, con un enlace de acceso).</li>
          <li>Los trabajadores entran con el código de su cuadrilla y un PIN personal que les asigna su Gerente de HSE — nunca con su propio correo.</li>
          <li>Eres responsable de que el código de cuadrilla y los PIN no se compartan fuera de tu empresa.</li>
          <li>Podemos suspender una cuenta que use la app de forma indebida (por ejemplo, para compartir el acceso con otra empresa) o que incumpla estos términos.</li>
        </ul>

        <h2>3. La suscripción</h2>
        <ul>
          <li>Toda cuenta empieza con 14 días de prueba gratis, sin pedir tarjeta.</li>
          <li>Pasada la prueba, el acceso se mantiene activo mientras la suscripción esté al día. El cobro y la renovación los gestiona <strong>Hotmart</strong>, nuestro procesador de pagos — nunca manejamos tu tarjeta directamente.</li>
          <li>La suscripción se <strong>renueva automáticamente</strong> cada período (mensual o anual, según el plan elegido) hasta que la canceles.</li>
          <li>Puedes cancelar cuando quieras desde tu cuenta de comprador en Hotmart (hotmart.com → Compras → selecciona HSE Master App → Cancelar). Ver el detalle en nuestra <a href="/legal/reembolsos">Política de Reembolsos</a>.</li>
          <li>Si el pago falla o la suscripción se cancela, el acceso de los trabajadores se corta — tu historial de progreso queda guardado por si reactivas la cuenta.</li>
        </ul>

        <h2>4. Uso aceptable</h2>
        <p>No está permitido:</p>
        <ul>
          <li>Compartir el código de cuadrilla o los PIN con personas ajenas a tu empresa.</li>
          <li>Intentar acceder a datos de otra empresa o de otro trabajador que no sea el tuyo.</li>
          <li>Usar la app para fines distintos al entrenamiento de tu propio equipo.</li>
          <li>Intentar vulnerar la seguridad de la aplicación o de la base de datos.</li>
        </ul>

        <h2>5. Dónde vive tu información</h2>
        <p>
          La aplicación corre sobre Vercel y Supabase, y los correos transaccionales se envían con
          Resend. El detalle de qué datos se guardan y para qué está en nuestra{" "}
          <a href="/legal/privacidad">Política de Privacidad</a>.
        </p>

        <h2>6. Limitación de responsabilidad</h2>
        <p>
          HSE Master App se entrega &quot;tal cual&quot;. Hacemos lo posible para que esté siempre
          disponible y funcione bien, pero no garantizamos que esté libre de errores o
          interrupciones. En la medida que lo permita la ley, no somos responsables por accidentes,
          pérdidas o daños derivados del uso (o de la falta de uso) de la aplicación — la seguridad
          industrial de tu operación sigue siendo responsabilidad de tu empresa y de sus propios
          controles, permisos y procedimientos.
        </p>

        <h2>7. Terminación</h2>
        <p>
          Puedes dejar de usar la app cuando quieras, cancelando tu suscripción. Nosotros podemos
          suspender o cerrar una cuenta que incumpla estos términos, avisando por correo cuando sea
          posible.
        </p>

        <h2>8. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de Colombia. Cualquier disputa se resuelve primero
          intentando un acuerdo directo — escríbenos a{" "}
          <a href="mailto:soporte@hse-master-app.com">soporte@hse-master-app.com</a> antes que nada.
        </p>

        <h2>9. Cambios a estos términos</h2>
        <p>
          Si hacemos un cambio importante, lo avisaremos por correo a las cuentas activas antes de
          que entre en vigor.
        </p>

        <LegalNav actual="terminos" />
      </LegalWrap>
    </div>
  );
}
