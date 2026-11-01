import type { ReactNode } from "react";

export function LegalHeader() {
  return (
    <div className="lx-header">
      <a href="/" className="lx-logo" aria-label="Ir al inicio">
        <span className="dot" />HSE Master App
      </a>
    </div>
  );
}

export function LegalNav({ actual }: { actual: "privacidad" | "terminos" | "reembolsos" }) {
  const paginas: { href: string; label: string; id: typeof actual }[] = [
    { href: "/legal/privacidad", label: "Privacidad", id: "privacidad" },
    { href: "/legal/terminos", label: "Términos", id: "terminos" },
    { href: "/legal/reembolsos", label: "Reembolsos", id: "reembolsos" },
  ];
  return (
    <nav className="lx-nav" aria-label="Otras páginas legales">
      {paginas
        .filter((p) => p.id !== actual)
        .map((p) => (
          <a key={p.id} href={p.href}>
            {p.label}
          </a>
        ))}
      <a href="mailto:soporte@hse-master-app.com">Escríbenos</a>
    </nav>
  );
}

export function LegalWrap({ children }: { children: ReactNode }) {
  return <div className="lx-wrap">{children}</div>;
}
