"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { track } from "@/lib/analytics";
import "../login.css";
import "./trabajador.css";

type Paso = "codigo" | "nombre" | "pin";
type Trabajador = { id: string; fullName: string };

// Login del trabajador de campo (ESTADO.md → falta-pantalla-login-trabajador): código de
// cuadrilla (no es secreto, lo sabe todo el equipo) + elegir su nombre + PIN personal de 4
// dígitos — nunca contraseña ni email, ver 26-AUTH-MODERNO.md y la Decisión técnica de Auth
// en ESTADO.md. Llama a app/api/auth/worker-login, que ya existía pero nunca tuvo pantalla.
export default function LoginTrabajadorPage() {
  const router = useRouter();

  const [paso, setPaso] = useState<Paso>("codigo");
  const [reveal, setReveal] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [errorCodigo, setErrorCodigo] = useState("");
  const [buscando, setBuscando] = useState(false);

  const [crewName, setCrewName] = useState("");
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [trabajadorElegido, setTrabajadorElegido] = useState<Trabajador | null>(null);

  const [pin, setPin] = useState("");
  const [errorPin, setErrorPin] = useState("");
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 60);
    return () => clearTimeout(t);
  }, []);

  async function buscarCuadrilla(e: React.FormEvent) {
    e.preventDefault();
    setErrorCodigo("");
    const limpio = codigo.trim().toUpperCase();
    if (limpio.length < 6) {
      setErrorCodigo("Escribe el código completo de 6 letras o números.");
      return;
    }
    setBuscando(true);
    const res = await fetch(`/api/auth/worker-login?code=${encodeURIComponent(limpio)}`);
    const data = await res.json().catch(() => null);
    setBuscando(false);
    if (!res.ok || !data) {
      setErrorCodigo(data?.error ?? "No encontramos esa cuadrilla. Revisa el código.");
      return;
    }
    if (!data.workers?.length) {
      setErrorCodigo("Esa cuadrilla todavía no tiene trabajadores dados de alta.");
      return;
    }
    setCrewName(data.crewName);
    setTrabajadores(data.workers);
    setCodigo(limpio);
    setPaso("nombre");
  }

  function elegirTrabajador(t: Trabajador) {
    setTrabajadorElegido(t);
    setPin("");
    setErrorPin("");
    setPaso("pin");
  }

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErrorPin("");
    if (!trabajadorElegido) return;
    if (pin.length !== 4) {
      setErrorPin("Escribe tu PIN de 4 números.");
      return;
    }
    setEntrando(true);
    const res = await fetch("/api/auth/worker-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: codigo, workerUserId: trabajadorElegido.id, pin }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setEntrando(false);
      setPin("");
      setErrorPin(data?.error ?? "Código o PIN incorrectos.");
      track("login_trabajador_fallido");
      return;
    }
    track("login_trabajador_completado");
    router.push("/app");
  }

  const cls = (base: string) => `${base} lg-reveal${reveal ? " in" : ""}`;

  return (
    <div className="lg-page js-motion">
      <div className="lg-header">
        <Link href="/" className="lg-logo" aria-label="Ir al inicio">
          <span className="dot" />HSE Master App
        </Link>
      </div>

      <main className="wrap">
        {paso === "codigo" && (
          <div>
            <h1 className={cls("lg-titulo")}>Entra con tu cuadrilla</h1>
            <p className={cls("lg-sub")}>Escribe el código de 6 caracteres que te dio tu Gerente de HSE.</p>

            <form className={cls("lg-form")} onSubmit={buscarCuadrilla} noValidate>
              <input
                className={`lg-codigo-input${errorCodigo ? " con-error" : ""}`}
                placeholder="QATEST"
                autoComplete="off"
                autoCapitalize="characters"
                autoFocus
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                disabled={buscando}
              />
              <p className={`lg-error${errorCodigo ? " show" : ""}`}>{errorCodigo}</p>
              <button type="submit" className={`lg-boton${buscando ? " enviando" : ""}`} disabled={buscando}>
                <span className="lg-spinner" aria-hidden="true" />
                <span className="lg-texto">Continuar</span>
              </button>
            </form>

            <p className={cls("lg-caption")}>
              <a href="/login" className="lt-link">¿Eres el Gerente de HSE? Entra con tu correo</a>
            </p>
          </div>
        )}

        {paso === "nombre" && (
          <div>
            <button type="button" className="lt-volver" onClick={() => setPaso("codigo")}>
              ← Cambiar cuadrilla
            </button>
            <h1 className="lg-titulo">Cuadrilla {crewName}</h1>
            <p className="lg-sub">Toca tu nombre en la lista.</p>

            <div className="lt-lista">
              {trabajadores.map((t) => (
                <button key={t.id} type="button" className="lt-nombre" onClick={() => elegirTrabajador(t)}>
                  <span className="lt-avatar" aria-hidden="true">
                    {t.fullName.trim().charAt(0).toUpperCase()}
                  </span>
                  {t.fullName}
                </button>
              ))}
            </div>
          </div>
        )}

        {paso === "pin" && trabajadorElegido && (
          <div>
            <button type="button" className="lt-volver" onClick={() => setPaso("nombre")}>
              ← Elegir otro nombre
            </button>
            <h1 className="lg-titulo">Hola, {trabajadorElegido.fullName.split(" ")[0]}</h1>
            <p className="lg-sub">Escribe tu PIN personal de 4 números.</p>

            <form className="lg-form" onSubmit={entrar} noValidate>
              <input
                className={`lg-codigo-input lt-pin${errorPin ? " con-error" : ""}`}
                inputMode="numeric"
                type="password"
                autoComplete="off"
                autoFocus
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                disabled={entrando}
              />
              <p className={`lg-error${errorPin ? " show" : ""}`}>{errorPin}</p>
              <button type="submit" className={`lg-boton${entrando ? " enviando" : ""}`} disabled={entrando}>
                <span className="lg-spinner" aria-hidden="true" />
                <span className="lg-texto">Entrar</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
