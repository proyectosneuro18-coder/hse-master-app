"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./login.css";

type Estado = "form" | "enviando" | "enviado" | "verificando";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useRef(createClient()).current;

  const [estado, setEstado] = useState<Estado>("form");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [errorCodigo, setErrorCodigo] = useState("");
  const [reveal, setReveal] = useState(false);
  const [segundosReenvio, setSegundosReenvio] = useState(60);

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (estado !== "enviado" || segundosReenvio <= 0) return;
    const t = setInterval(() => setSegundosReenvio((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [estado, segundosReenvio]);

  function emailValido(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function enviarEnlace(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const correo = email.trim();
    if (!emailValido(correo)) {
      setError("Escribe un correo válido para poder enviarte el enlace.");
      return;
    }
    setEstado("enviando");
    const { error: errOtp } = await supabase.auth.signInWithOtp({
      email: correo,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/app`,
        shouldCreateUser: true,
      },
    });
    if (errOtp) {
      setEstado("form");
      setError("No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.");
      return;
    }
    setEstado("enviado");
    setSegundosReenvio(60);
  }

  async function reenviar() {
    if (segundosReenvio > 0) return;
    await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/app`,
      },
    });
    setSegundosReenvio(60);
  }

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setErrorCodigo("");
    if (codigo.trim().length < 6) {
      setErrorCodigo("Escribe el código de 6 dígitos que te enviamos.");
      return;
    }
    setEstado("verificando");
    const { error: errVerify } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: codigo.trim(),
      type: "email",
    });
    if (errVerify) {
      setEstado("enviado");
      setErrorCodigo("Ese código no es válido o ya venció. Pide uno nuevo.");
      return;
    }
    router.push("/app");
  }

  async function continuarConGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=/app` },
    });
  }

  const cls = (base: string) => `${base} lg-reveal${reveal ? " in" : ""}`;

  return (
    <div className="lg-page js-motion">
      <div className="lg-header">
        <a href="/" className="lg-logo" aria-label="Ir al inicio">
          <span className="dot" />HSE Master App
        </a>
      </div>

      <main className="wrap">
        {estado !== "enviado" && estado !== "verificando" && (
          <div>
            <h1 className={cls("lg-titulo")}>Entra a tu panel</h1>
            <p className={cls("lg-sub")}>
              Para guardarlo y verlo en cualquier dispositivo, desde el celular o la oficina.
            </p>

            <form className={cls("lg-form")} onSubmit={enviarEnlace} noValidate>
              <input
                type="email"
                className={`lg-input${error ? " con-error" : ""}`}
                placeholder="tu@correo.com"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={estado === "enviando"}
              />
              <p className={`lg-error${error ? " show" : ""}`}>{error}</p>
              <button
                type="submit"
                className={`lg-boton${estado === "enviando" ? " enviando" : ""}`}
                disabled={estado === "enviando"}
              >
                <span className="lg-spinner" aria-hidden="true" />
                <span className="lg-texto">Enviarme mi enlace de acceso</span>
              </button>
            </form>

            <div className={cls("lg-separador")}>o</div>

            <button type="button" className={cls("lg-secundario")} onClick={continuarConGoogle}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.07-1.47-.22-2.12H12v3.85h6.6c-.13 1.09-.86 2.73-2.47 3.83l-.02.15 3.59 2.78.25.02c2.28-2.1 3.57-5.2 3.57-8.51" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.78-2.95c-1.01.71-2.37 1.2-4.15 1.2-3.17 0-5.86-2.1-6.82-5.01l-.14.01-3.73 2.89-.05.14C3.25 21.3 7.28 24 12 24" />
                <path fill="#FBBC05" d="M5.18 14.34c-.25-.74-.39-1.53-.39-2.34s.14-1.6.38-2.34l-.01-.16-3.78-2.94-.12.06A11.9 11.9 0 0 0 0 12c0 1.93.47 3.76 1.26 5.38l3.92-3.04" />
                <path fill="#EA4335" d="M12 4.75c2.25 0 3.77.97 4.64 1.79l3.39-3.31C17.94 1.2 15.24 0 12 0 7.28 0 3.25 2.7 1.26 6.62l3.91 3.04C6.14 6.85 8.83 4.75 12 4.75" />
              </svg>
              Continuar con Google
            </button>

            <p className={cls("lg-caption")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Sin contraseñas: te llegará un enlace de un solo uso
            </p>
          </div>
        )}

        {(estado === "enviado" || estado === "verificando") && (
          <div className="lg-enviado">
            <span className="ic">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--hse-ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
            </span>
            <h2>Revisa tu correo</h2>
            <p>
              Te enviamos el enlace a <b>{email.trim()}</b>
            </p>

            <form className="lg-codigo-wrap" onSubmit={verificarCodigo}>
              <label className="lg-codigo-label" htmlFor="codigo">
                ¿Recibiste un código? Escríbelo aquí
              </label>
              <input
                id="codigo"
                className={`lg-codigo-input${errorCodigo ? " con-error" : ""}`}
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                disabled={estado === "verificando"}
              />
              <p className={`lg-error${errorCodigo ? " show" : ""}`}>{errorCodigo}</p>
              <button
                type="submit"
                className={`lg-boton${estado === "verificando" ? " enviando" : ""}`}
                style={{ marginTop: 12 }}
                disabled={estado === "verificando"}
              >
                <span className="lg-spinner" aria-hidden="true" />
                <span className="lg-texto">Entrar con el código</span>
              </button>
            </form>

            <button
              type="button"
              className="lg-reenviar"
              disabled={segundosReenvio > 0}
              onClick={reenviar}
            >
              {segundosReenvio > 0 ? `Reenviar en ${segundosReenvio}s` : "Reenviar el enlace"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
