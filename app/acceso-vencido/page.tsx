import type { MotivoSinAcceso } from "@/lib/membership-fsm";
import { CerrarSesionBoton } from "./CerrarSesionBoton";
import "./acceso-vencido.css";

const COPY: Record<MotivoSinAcceso, { titulo: string; texto: string }> = {
  trial_vencido: {
    titulo: "Tu prueba gratis terminó",
    texto: "Avísale a tu Gerente de HSE para que active un plan pago y puedas seguir con tu racha.",
  },
  pago_fallido: {
    titulo: "El último pago de tu empresa no pasó",
    texto: "Avísale a tu Gerente de HSE para que actualice el método de pago.",
  },
  cancelado: {
    titulo: "Tu empresa canceló el acceso",
    texto: "Si crees que es un error, avísale a tu Gerente de HSE.",
  },
  otro: {
    titulo: "Tu acceso no está activo ahorita",
    texto: "Avísale a tu Gerente de HSE o escríbenos a soporte@hse-master-app.com.",
  },
};

// Lee searchParams en cada visita — nunca se puede prerenderizar (Next 16 + cacheComponents
// exige este opt-in explícito o falla el build, igual que app/panel/page.tsx).
export const instant = false;

function esMotivoValido(v: string | undefined): v is MotivoSinAcceso {
  return !!v && v in COPY;
}

// Se muestra cuando la organización del trabajador no tiene acceso activo (trial vencido, pago
// fallido o cancelado) — ver app/app/page.tsx, que calcula el motivo con `evaluarAcceso` (ver
// ESTADO.md → Sesión 7, punto 3) y redirige aquí en vez de dejarlo entrar al ritual diario.
export default async function AccesoVencidoPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;
  const copy = COPY[esMotivoValido(motivo) ? motivo : "otro"];

  return (
    <div className="av-page">
      <main className="av-wrap">
        <span className="av-icono" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            <path d="M12 15v2" />
          </svg>
        </span>
        <h1 className="av-titulo">{copy.titulo}</h1>
        <p className="av-texto">{copy.texto}</p>
        <CerrarSesionBoton />
      </main>
    </div>
  );
}
