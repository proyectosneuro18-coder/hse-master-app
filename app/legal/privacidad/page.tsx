import "../legal.css";
import { LegalHeader, LegalNav, LegalWrap } from "../LegalChrome";

// Borrador redactado por el agente con los datos reales del responsable (Henry Antonio
// Montañez Caro, persona natural, Colombia — confirmados por el usuario el 2026-11-01), siguiendo
// la especificación de docs/sistema/47-LEGAL-FISCAL-Y-PRIVACIDAD.md §2.1. El dueño debe revisarla
// y, antes de vender a escala, validarla con un abogado local (misma regla del SO).
export default function PrivacidadPage() {
  return (
    <div className="lx-page">
      <LegalHeader />
      <LegalWrap>
        <p className="lx-fecha">Última actualización: 7 de noviembre de 2026</p>
        <h1 className="lx-titulo">Política de Privacidad</h1>
        <p className="lx-resumen">
          En simple: guardamos solo lo necesario para que tu equipo entrene y para que tú veas su
          progreso. No vendemos tus datos a nadie. Puedes pedirnos que los borremos cuando quieras.
        </p>

        <h2>1. Quiénes somos</h2>
        <p>
          HSE Master App es operada por <strong>Henry Antonio Montañez Caro</strong>, persona
          natural, con domicilio en Colombia. Para cualquier tema de privacidad, escribe a{" "}
          <a href="mailto:soporte@hse-master-app.com">soporte@hse-master-app.com</a>.
        </p>

        <h2>2. Qué datos recopilamos</h2>
        <ul>
          <li>
            <strong>Del Gerente de HSE (quien paga la suscripción):</strong> correo electrónico, el
            nombre de su empresa y los datos de facturación que procesa Hotmart (nunca pasan por
            nuestros servidores).
          </li>
          <li>
            <strong>De cada trabajador:</strong> su nombre, un PIN de 4 números (lo guardamos
            cifrado, nunca en texto plano — ni nosotros podemos leerlo), y su cuadrilla.
          </li>
          <li>
            <strong>Datos de uso:</strong> qué lecciones completó, su racha de días seguidos, y la
            fecha de cada intento. Es la información que hace funcionar el progreso y los reportes
            del Gerente de HSE.
          </li>
          <li>
            <strong>Datos técnicos básicos:</strong> los que recoge automáticamente nuestro
            proveedor de hosting (Vercel) para que la app funcione y no la ataquen (dirección IP,
            tipo de navegador).
          </li>
        </ul>
        <p>
          No pedimos ni guardamos ubicación, fecha de nacimiento, ni número de teléfono. Los datos
          de pago (tarjeta, etc.) los procesa Hotmart directamente — nunca llegan a nuestra base de
          datos.
        </p>

        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Hacer que la app funcione: iniciar sesión, guardar tu progreso, mostrar tu racha.</li>
          <li>Que el Gerente de HSE vea la adopción real de su cuadrilla (ese es el producto).</li>
          <li>Cobrar la suscripción (a través de Hotmart) y avisarte por correo sobre tu cuenta.</li>
          <li>Dar soporte cuando nos escribes.</li>
        </ul>
        <p>
          Hoy la app <strong>no usa inteligencia artificial</strong> para generar contenido — las
          lecciones son escritas por nosotros, no por un modelo de IA. Si eso cambia en el futuro,
          actualizaremos esta política antes de hacerlo y te avisaremos.
        </p>

        <h2>4. Con quién compartimos tus datos</h2>
        <p>Nunca vendemos tus datos. Los únicos que los procesan por nosotros, y solo para operar la app, son:</p>
        <table className="lx-tabla">
          <thead>
            <tr>
              <th>Quién</th>
              <th>Para qué</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Supabase</td>
              <td>Base de datos y el inicio de sesión</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Donde vive la aplicación (hosting)</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Enviar los correos de tu cuenta (pago confirmado, pago fallido, etc.)</td>
            </tr>
            <tr>
              <td>Hotmart</td>
              <td>Procesar el cobro de la suscripción</td>
            </tr>
          </tbody>
        </table>
        <p>
          Algunos de estos proveedores procesan datos en servidores fuera de Colombia (por ejemplo,
          en Estados Unidos). Es lo que se llama <strong>transferencia internacional de datos</strong>,
          y al usar la app la autorizas para ese único propósito: que la aplicación funcione.
        </p>

        <h2>5. Cuánto tiempo guardamos tus datos</h2>
        <p>
          Mientras tu empresa tenga una cuenta activa. Si cancelas o dejas de pagar, conservamos tu
          historial de progreso por si reactivas la cuenta; si prefieres que lo borremos antes,
          puedes eliminarlo tú mismo desde tu panel.
        </p>

        <h2>6. Tus derechos</h2>
        <p>Como Gerente de HSE puedes hacerlo tú mismo, al instante, desde tu panel (sección &ldquo;Tus datos&rdquo;):</p>
        <ul>
          <li>
            <strong>Descargar tus datos:</strong> un archivo con tu empresa, tus cuadrillas, tus
            trabajadores y los retos que respondieron. No incluye los PIN, que se guardan cifrados.
          </li>
          <li>
            <strong>Corregir un dato:</strong> editar el nombre de tu empresa, de una cuadrilla o de un
            trabajador.
          </li>
          <li>
            <strong>Eliminar a un trabajador</strong> con todo su progreso, si se va de tu empresa o
            te lo pide.
          </li>
          <li>
            <strong>Eliminar tu cuenta y todos los datos</strong> de tu empresa por completo. Si tienes
            una suscripción con cobro vigente, primero debes cancelarla en Hotmart.
          </li>
        </ul>
        <p>
          Si eres trabajador de campo, pídeselo a tu Gerente de HSE o escríbenos a{" "}
          <a href="mailto:soporte@hse-master-app.com">soporte@hse-master-app.com</a>: respondemos en un
          máximo de 15 días hábiles. Al eliminar una cuenta conservamos solo el registro contable de
          los pagos (monto, moneda y número de la transacción de Hotmart, sin datos personales), que la
          ley nos obliga a guardar. Esta política se basa en la Ley 1581 de 2012 de Colombia
          (protección de datos personales) y en los estándares equivalentes de otros países de la región.
        </p>

        <h2>7. Seguridad</h2>
        <p>
          El PIN de los trabajadores se guarda cifrado (nunca en texto plano). El acceso a los
          datos de cada empresa está separado por reglas de seguridad en la base de datos: un
          Gerente de HSE nunca puede ver los datos de otra empresa.
        </p>

        <h2>8. Menores de edad</h2>
        <p>
          HSE Master App es una herramienta para personal adulto de campo (18 años o más) de
          empresas del sector petrolero. No está dirigida a menores de edad y no recopilamos a
          propósito datos de menores.
        </p>

        <h2>9. Cambios a esta política</h2>
        <p>
          Si hacemos un cambio importante, lo avisaremos por correo a las cuentas activas antes de
          que entre en vigor. La fecha de la última actualización siempre está arriba de esta
          página.
        </p>

        <LegalNav actual="privacidad" />
      </LegalWrap>
    </div>
  );
}
