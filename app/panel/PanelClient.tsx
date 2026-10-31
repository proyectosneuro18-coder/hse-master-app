"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Users,
  UserPlus,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  X,
  LogOut,
  Pencil,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

export type EstadoSuscripcion =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "refunded"
  | "chargeback";

type Worker = {
  user_id: string;
  full_name: string;
  active: boolean;
  streaks: { current_streak: number; last_completed_date: string | null } | null;
};

export type CrewConDatos = {
  id: string;
  name: string;
  code: string;
  workers: Worker[];
};

// Rotación de acento por cuadrilla (identidad "Casco de Oro" — bloques grandes multicolor,
// nunca un solo acento repetido en toda la pantalla, ver FICHA-ARTE.md).
const ACENTOS = [
  { bg: "var(--hse-azul)", sombra: "var(--hse-azul-sombra)", texto: "var(--hse-azul-texto)" },
  { bg: "var(--hse-verde)", sombra: "var(--hse-verde-sombra)", texto: "var(--hse-verde-sombra)" },
  { bg: "var(--hse-rojo)", sombra: "var(--hse-rojo-sombra)", texto: "var(--hse-rojo-texto)" },
] as const;

function formatearFecha(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
}

function useConteo(destino: number, sinMovimiento: boolean) {
  const [valor, setValor] = useState(sinMovimiento ? destino : 0);
  useEffect(() => {
    if (sinMovimiento) {
      setValor(destino);
      return;
    }
    let raf = 0;
    const inicio = performance.now();
    const duracion = 600;
    const paso = (ahora: number) => {
      const p = Math.min((ahora - inicio) / duracion, 1);
      setValor(Math.round(destino * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [destino, sinMovimiento]);
  return valor;
}

function BannerEstado({
  estado,
  trialEndsAt,
  accessUntil,
  graceEndsAt,
  planName,
}: {
  estado: EstadoSuscripcion;
  trialEndsAt: string | null;
  accessUntil: string | null;
  graceEndsAt: string | null;
  planName: string | null;
}) {
  if (estado === "active") {
    return (
      <div className="flex items-center gap-2 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-verde-sombra)] bg-[var(--hse-verde)]/15 px-4 py-2.5 text-sm font-medium text-[var(--hse-ink)]">
        <Check className="size-4 shrink-0 text-[var(--hse-verde-sombra)]" strokeWidth={3} />
        Plan {planName ?? "activo"} — todo al día
      </div>
    );
  }
  if (estado === "trialing") {
    const fecha = formatearFecha(trialEndsAt);
    return (
      <div className="flex items-center gap-2 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-azul-sombra)] bg-[var(--hse-azul)]/10 px-4 py-2.5 text-sm font-medium text-[var(--hse-azul-texto)]">
        <Flame className="size-4 shrink-0" strokeWidth={2.5} />
        Prueba gratis {fecha ? `— termina el ${fecha}` : "activa"}
      </div>
    );
  }
  if (estado === "past_due") {
    const fecha = formatearFecha(graceEndsAt);
    return (
      <div className="flex items-start gap-2 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-rojo-sombra)] bg-[var(--hse-rojo)]/10 px-4 py-2.5 text-sm font-medium text-[var(--hse-rojo-texto)]">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
        <span>
          Tu último pago no se procesó{fecha ? ` — tienes acceso hasta el ${fecha}` : ""}. Actualiza tu
          método de pago en Hotmart para no perder el acceso.
        </span>
      </div>
    );
  }
  if (estado === "cancelled") {
    const fecha = formatearFecha(accessUntil);
    return (
      <div className="flex items-start gap-2 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-rojo-sombra)] bg-[var(--hse-rojo)]/10 px-4 py-2.5 text-sm font-medium text-[var(--hse-rojo-texto)]">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
        Suscripción cancelada{fecha ? ` — tu acceso sigue activo hasta el ${fecha}` : ""}.
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-rojo-sombra)] bg-[var(--hse-rojo)]/10 px-4 py-2.5 text-sm font-medium text-[var(--hse-rojo-texto)]">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
      Sin acceso activo — contáctanos si crees que es un error.
    </div>
  );
}

function ChipCodigo({ code }: { code: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).catch(() => {});
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1500);
      }}
      className="flex items-center gap-1.5 rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-ink)] bg-[var(--hse-neutro-antes)] px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-[var(--hse-ink)] transition active:scale-95"
      aria-label={`Copiar código de cuadrilla ${code}`}
    >
      {code}
      {copiado ? (
        <Check className="size-3.5 text-[var(--hse-verde-sombra)]" strokeWidth={3} />
      ) : (
        <Copy className="size-3.5 opacity-60" strokeWidth={2.5} />
      )}
    </button>
  );
}

function FilaTrabajador({ worker, onEditar }: { worker: Worker; onEditar: (w: Worker) => void }) {
  const racha = worker.streaks?.current_streak ?? 0;
  return (
    <div className="flex items-center justify-between gap-2 border-t border-[var(--hse-tab-borde)] py-3 first:border-t-0">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-[var(--hse-ink)]">{worker.full_name}</p>
        <p className="text-xs text-[var(--hse-ink-2)]">{worker.active ? "Activo" : "Inactivo"}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1 rounded-[var(--hse-radius-chip)] bg-[var(--hse-amarillo)]/25 px-2.5 py-1 text-sm font-bold text-[var(--hse-ink)]">
          <Flame className="size-3.5 text-[var(--hse-amarillo-sombra)]" strokeWidth={2.5} fill="var(--hse-amarillo)" />
          {racha}
        </div>
        <button
          type="button"
          onClick={() => onEditar(worker)}
          aria-label={`Editar a ${worker.full_name}`}
          className="rounded-full p-1.5 text-[var(--hse-ink-2)] transition active:scale-90"
        >
          <Pencil className="size-4" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

function TarjetaCuadrilla({
  crew,
  acento,
  onAgregar,
  onRenombrar,
  onEditarTrabajador,
}: {
  crew: CrewConDatos;
  acento: (typeof ACENTOS)[number];
  onAgregar: (crewId: string, crewName: string) => void;
  onRenombrar: (crewId: string, crewName: string, workerCount: number) => void;
  onEditarTrabajador: (w: Worker) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--hse-radius-card)] border-3 border-[var(--hse-ink)] bg-[var(--hse-surface)] shadow-[0_6px_0_-2px_rgb(26_26_26/0.08),0_10px_20px_rgb(26_26_26/0.1)]">
      <div className="h-1.5" style={{ background: acento.bg }} />
      <div className="p-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-ink)]"
            style={{ background: `color-mix(in srgb, ${acento.bg} 20%, transparent)` }}
          >
            <Users className="size-4" style={{ color: acento.texto }} strokeWidth={2.5} />
          </span>
          <h3 className="min-w-0 flex-1 truncate text-lg font-bold text-[var(--hse-ink)]">{crew.name}</h3>
          <button
            type="button"
            onClick={() => onAgregar(crew.id, crew.name)}
            aria-label={`Agregar trabajador a ${crew.name}`}
            className="shrink-0 rounded-full p-1.5 transition active:scale-90"
            style={{ background: `color-mix(in srgb, ${acento.bg} 18%, transparent)`, color: acento.texto }}
          >
            <UserPlus className="size-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => onRenombrar(crew.id, crew.name, crew.workers.length)}
            aria-label={`Renombrar ${crew.name}`}
            className="shrink-0 rounded-full p-1.5 transition active:scale-90"
            style={{ background: `color-mix(in srgb, ${acento.bg} 18%, transparent)`, color: acento.texto }}
          >
            <Pencil className="size-4" strokeWidth={2.25} />
          </button>
        </div>
        <div className="mt-2">
          <ChipCodigo code={crew.code} />
        </div>

        {crew.workers.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--hse-ink-2)]">Todavía no agregaste a nadie aquí.</p>
        ) : (
          <div className="mt-1 mb-1">
            {crew.workers.map((w) => (
              <FilaTrabajador key={w.user_id} worker={w} onEditar={onEditarTrabajador} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CascaronModal({
  titulo,
  onCerrar,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
  return (
    <DialogContent className="max-w-[min(92vw,420px)] rounded-[var(--hse-radius-card)] border-3 border-[var(--hse-ink)] bg-[var(--hse-surface)] p-0 font-[family-name:var(--hse-font-body)] [&_button[data-slot=dialog-close]]:hidden">
      <div className="flex items-center justify-between border-b-2 border-[var(--hse-tab-borde)] px-5 py-4">
        <DialogHeader className="gap-0">
          <DialogTitle className="font-[family-name:var(--hse-font-display)] text-lg font-bold text-[var(--hse-ink)]">
            {titulo}
          </DialogTitle>
          <DialogDescription className="sr-only">Formulario del panel del Gerente de HSE.</DialogDescription>
        </DialogHeader>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="rounded-full p-1 text-[var(--hse-ink-2)] transition hover:bg-[var(--hse-neutro-antes)]"
        >
          <X className="size-5" />
        </button>
      </div>
      {children}
    </DialogContent>
  );
}

function ModalAgregarTrabajador({
  abierto,
  onOpenChange,
  crewPreseleccionada,
  crews,
}: {
  abierto: boolean;
  onOpenChange: (v: boolean) => void;
  crewPreseleccionada: { id: string; name: string } | null;
  crews: CrewConDatos[];
}) {
  const router = useRouter();
  const sinMovimiento = useReducedMotion();
  const [modo, setModo] = useState<"existente" | "nueva">(crewPreseleccionada ? "existente" : crews.length ? "existente" : "nueva");
  const [crewId, setCrewId] = useState(crewPreseleccionada?.id ?? crews[0]?.id ?? "");
  const [nuevaCuadrilla, setNuevaCuadrilla] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<{ crewCode: string; crewName: string; fullName: string } | null>(null);

  function reset() {
    setFullName("");
    setPin("");
    setError(null);
    setExito(null);
    setNuevaCuadrilla("");
    setModo(crewPreseleccionada ? "existente" : crews.length ? "existente" : "nueva");
    setCrewId(crewPreseleccionada?.id ?? crews[0]?.id ?? "");
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) return setError("Escribe el nombre del trabajador.");
    if (!/^\d{4}$/.test(pin)) return setError("El PIN debe tener exactamente 4 números.");
    if (modo === "nueva" && !nuevaCuadrilla.trim()) return setError("Escribe el nombre de la cuadrilla.");
    if (modo === "existente" && !crewId) return setError("Elige una cuadrilla.");

    setEnviando(true);
    try {
      const res = await fetch("/api/admin/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          pin,
          ...(modo === "existente" ? { crewId } : { newCrewName: nuevaCuadrilla.trim() }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Algo falló. Intenta de nuevo.");
        return;
      }
      setExito({ crewCode: data.crew.code, crewName: data.crew.name, fullName: data.worker.fullName });
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Revisa tu conexión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Dialog
      open={abierto}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <CascaronModal titulo={exito ? "¡Listo!" : "Agregar trabajador"} onCerrar={() => onOpenChange(false)}>
        {exito ? (
          <motion.div
            initial={sinMovimiento ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="flex flex-col gap-4 px-5 py-5"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--hse-verde-sombra)] bg-[var(--hse-verde)]/15">
                <Check className="size-5 text-[var(--hse-verde-sombra)]" strokeWidth={3} />
              </span>
              <p className="text-sm text-[var(--hse-ink)]">
                <strong>{exito.fullName}</strong> ya puede entrar a la app.
              </p>
            </div>
            <p className="text-sm text-[var(--hse-ink-2)]">
              Comparte con él estos 2 datos (nunca por un canal público):
            </p>
            <div className="flex flex-col gap-2 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-neutro-antes)] p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--hse-ink-2)]">Cuadrilla</span>
                <span className="font-bold">{exito.crewName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--hse-ink-2)]">Código</span>
                <span className="font-mono font-bold tracking-wider">{exito.crewCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--hse-ink-2)]">PIN</span>
                <span className="font-mono font-bold tracking-wider">el que escribiste</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] py-2.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none"
            >
              Entendido
            </button>
          </motion.div>
        ) : (
          <form onSubmit={enviar} className="flex flex-col gap-3.5 px-5 py-5">
            {crews.length > 0 && (
              <div className="flex gap-1.5 rounded-[var(--hse-radius-chip)] bg-[var(--hse-neutro-antes)] p-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setModo("existente")}
                  className={`flex-1 rounded-[calc(var(--hse-radius-chip)-4px)] py-1.5 transition duration-200 ${modo === "existente" ? "bg-[var(--hse-surface)] text-[var(--hse-ink)] shadow-sm" : "text-[var(--hse-ink-2)]"}`}
                >
                  Cuadrilla existente
                </button>
                <button
                  type="button"
                  onClick={() => setModo("nueva")}
                  className={`flex-1 rounded-[calc(var(--hse-radius-chip)-4px)] py-1.5 transition duration-200 ${modo === "nueva" ? "bg-[var(--hse-surface)] text-[var(--hse-ink)] shadow-sm" : "text-[var(--hse-ink-2)]"}`}
                >
                  Cuadrilla nueva
                </button>
              </div>
            )}

            {modo === "existente" && crews.length > 0 ? (
              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
                Cuadrilla
                <select
                  value={crewId}
                  onChange={(e) => setCrewId(e.target.value)}
                  className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-base font-normal text-[var(--hse-ink)]"
                >
                  {crews.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
                Nombre de la cuadrilla
                <input
                  value={nuevaCuadrilla}
                  onChange={(e) => setNuevaCuadrilla(e.target.value)}
                  placeholder="Ej. Turno A — Pozo 4"
                  className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-base font-normal text-[var(--hse-ink)] placeholder:text-[var(--hse-ink-2)]"
                />
              </label>
            )}

            <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
              Nombre completo del trabajador
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Carlos Pérez"
                autoFocus
                className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-base font-normal text-[var(--hse-ink)] placeholder:text-[var(--hse-ink-2)]"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
              PIN de 4 números (él lo usará para entrar)
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="0000"
                className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-center font-mono text-lg tracking-[0.5em] text-[var(--hse-ink)] placeholder:tracking-[0.5em] placeholder:text-[var(--hse-ink-2)]"
              />
              <span className="text-xs font-normal text-[var(--hse-ink-2)]">
                {pin.length === 4 ? (
                  <span className="inline-flex items-center gap-1 text-[var(--hse-verde-sombra)]">
                    <Check className="size-3" strokeWidth={3} /> Listo
                  </span>
                ) : (
                  `Faltan ${4 - pin.length} número${4 - pin.length === 1 ? "" : "s"}`
                )}
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-[var(--hse-radius-chip)] bg-[var(--hse-rojo)]/10 px-3 py-2 text-sm font-medium text-[var(--hse-rojo-texto)]">
                {error}
              </p>
            )}

            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-4 py-2.5 text-sm font-bold text-[var(--hse-ink)] transition active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] py-2.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none disabled:opacity-60"
              >
                {enviando ? "Guardando..." : "Agregar trabajador"}
              </button>
            </div>
          </form>
        )}
      </CascaronModal>
    </Dialog>
  );
}

function ModalEditarTrabajador({
  worker,
  onOpenChange,
  onGuardado,
}: {
  worker: Worker | null;
  onOpenChange: (v: boolean) => void;
  onGuardado: (deshacer: () => Promise<void>) => void;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(worker?.full_name ?? "");
  const [activo, setActivo] = useState(worker?.active ?? true);
  const [pin, setPin] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (worker) {
      setFullName(worker.full_name);
      setActivo(worker.active);
      setPin("");
      setError(null);
    }
  }, [worker]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!worker) return;
    setError(null);
    if (!fullName.trim()) return setError("El nombre no puede quedar vacío.");
    if (pin && !/^\d{4}$/.test(pin)) return setError("El nuevo PIN debe tener exactamente 4 números.");

    setEnviando(true);
    try {
      const res = await fetch("/api/admin/workers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: worker.user_id,
          fullName: fullName.trim(),
          active: activo,
          ...(pin ? { pin } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Algo falló. Intenta de nuevo.");
        return;
      }
      const nombreAnterior = worker.full_name;
      const activoAnterior = worker.active;
      const workerId = worker.user_id;
      onGuardado(async () => {
        await fetch("/api/admin/workers", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerId, fullName: nombreAnterior, active: activoAnterior }),
        });
        router.refresh();
      });
      onOpenChange(false);
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Revisa tu conexión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Dialog open={!!worker} onOpenChange={onOpenChange}>
      <CascaronModal titulo="Editar trabajador" onCerrar={() => onOpenChange(false)}>
        <form onSubmit={enviar} className="flex flex-col gap-3.5 px-5 py-5">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
            Nombre completo
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
              className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-base font-normal text-[var(--hse-ink)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
            Nuevo PIN (déjalo vacío para no cambiarlo)
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              placeholder="0000"
              className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-center font-mono text-lg tracking-[0.5em] text-[var(--hse-ink)] placeholder:tracking-[0.5em] placeholder:text-[var(--hse-ink-2)]"
            />
          </label>

          <button
            type="button"
            onClick={() => setActivo((v) => !v)}
            className="flex items-center justify-between rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--hse-ink)]"
          >
            {activo ? "Activo — puede entrar a la app" : "Inactivo — no puede entrar"}
            <span
              className="relative h-6 w-10 shrink-0 rounded-full border-2 border-[var(--hse-ink)] transition"
              style={{ background: activo ? "var(--hse-verde)" : "var(--hse-neutro-track)" }}
            >
              <span
                className="absolute top-0.5 size-4 rounded-full bg-[var(--hse-surface)] border border-[var(--hse-ink)] transition-transform"
                style={{ transform: activo ? "translateX(18px)" : "translateX(2px)" }}
              />
            </span>
          </button>

          {error && (
            <p role="alert" className="rounded-[var(--hse-radius-chip)] bg-[var(--hse-rojo)]/10 px-3 py-2 text-sm font-medium text-[var(--hse-rojo-texto)]">
              {error}
            </p>
          )}

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-4 py-2.5 text-sm font-bold text-[var(--hse-ink)] transition active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] py-2.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none disabled:opacity-60"
            >
              {enviando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </CascaronModal>
    </Dialog>
  );
}

function ModalRenombrarCuadrilla({
  crew,
  onOpenChange,
  onGuardado,
  onArchivada,
}: {
  crew: { id: string; name: string; workerCount: number } | null;
  onOpenChange: (v: boolean) => void;
  onGuardado: (deshacer: () => Promise<void>) => void;
  onArchivada: () => void;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(crew?.name ?? "");
  const [enviando, setEnviando] = useState(false);
  const [archivando, setArchivando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (crew) {
      setNombre(crew.name);
      setError(null);
    }
  }, [crew]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!crew) return;
    if (!nombre.trim()) return setError("El nombre no puede quedar vacío.");
    setEnviando(true);
    try {
      const res = await fetch("/api/admin/crews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crewId: crew.id, name: nombre.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Algo falló. Intenta de nuevo.");
        return;
      }
      const nombreAnterior = crew.name;
      const crewId = crew.id;
      onGuardado(async () => {
        await fetch("/api/admin/crews", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ crewId, name: nombreAnterior }),
        });
        router.refresh();
      });
      onOpenChange(false);
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Revisa tu conexión.");
    } finally {
      setEnviando(false);
    }
  }

  async function archivar() {
    if (!crew) return;
    setArchivando(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crewId: crew.id, archived: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No pudimos archivar la cuadrilla.");
        return;
      }
      onOpenChange(false);
      onArchivada();
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Revisa tu conexión.");
    } finally {
      setArchivando(false);
    }
  }

  return (
    <Dialog open={!!crew} onOpenChange={onOpenChange}>
      <CascaronModal titulo="Renombrar cuadrilla" onCerrar={() => onOpenChange(false)}>
        <form onSubmit={enviar} className="flex flex-col gap-3.5 px-5 py-5">
          <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--hse-ink)]">
            Nombre de la cuadrilla
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-3 py-2.5 text-base font-normal text-[var(--hse-ink)]"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-[var(--hse-radius-chip)] bg-[var(--hse-rojo)]/10 px-3 py-2 text-sm font-medium text-[var(--hse-rojo-texto)]">
              {error}
            </p>
          )}
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-surface)] px-4 py-2.5 text-sm font-bold text-[var(--hse-ink)] transition active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] py-2.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none disabled:opacity-60"
            >
              {enviando ? "Guardando..." : "Guardar"}
            </button>
          </div>
          {crew && crew.workerCount === 0 && (
            <button
              type="button"
              onClick={archivar}
              disabled={archivando}
              className="text-sm font-semibold text-[var(--hse-rojo-texto)] underline-offset-2 transition hover:underline disabled:opacity-60"
            >
              {archivando ? "Archivando..." : "Archivar esta cuadrilla (está vacía)"}
            </button>
          )}
        </form>
      </CascaronModal>
    </Dialog>
  );
}

export function PanelClient({
  orgName,
  estado,
  trialEndsAt,
  accessUntil,
  graceEndsAt,
  planName,
  crews,
}: {
  orgName: string;
  estado: EstadoSuscripcion;
  trialEndsAt: string | null;
  accessUntil: string | null;
  graceEndsAt: string | null;
  planName: string | null;
  crews: CrewConDatos[];
}) {
  const router = useRouter();
  const sinMovimiento = useReducedMotion();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [crewPreseleccionada, setCrewPreseleccionada] = useState<{ id: string; name: string } | null>(null);
  const [workerEditando, setWorkerEditando] = useState<Worker | null>(null);
  const [crewRenombrando, setCrewRenombrando] = useState<{ id: string; name: string; workerCount: number } | null>(null);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [toast, setToast] = useState<{ mensaje: string; deshacer: () => Promise<void> } | null>(null);
  const [deshaciendo, setDeshaciendo] = useState(false);
  // Monta los diálogos secundarios solo tras la primera interacción real — así el HTML inicial
  // nunca incluye el Dialog (evita que sus listeners internos se evalúen durante el render
  // inicial de la página, que es lo único que debe quedar predecible para Next).
  const [interactuado, setInteractuado] = useState(false);

  function mostrarToastDeshacer(mensaje: string, deshacer: () => Promise<void>) {
    setToast({ mensaje, deshacer });
    setTimeout(() => setToast((t) => (t?.mensaje === mensaje ? null : t)), 6000);
  }

  const totalTrabajadores = crews.reduce((acc, c) => acc + c.workers.length, 0);
  const activosConRacha = crews.reduce(
    (acc, c) => acc + c.workers.filter((w) => (w.streaks?.current_streak ?? 0) > 0).length,
    0,
  );
  const trabajadoresAnimado = useConteo(totalTrabajadores, !!sinMovimiento);
  const rachaAnimado = useConteo(activosConRacha, !!sinMovimiento);

  function abrirModal(crewId?: string, crewName?: string) {
    setInteractuado(true);
    setCrewPreseleccionada(crewId && crewName ? { id: crewId, name: crewName } : null);
    setModalAbierto(true);
  }

  function editarTrabajador(w: Worker) {
    setInteractuado(true);
    setWorkerEditando(w);
  }

  function renombrarCuadrilla(id: string, name: string, workerCount: number) {
    setInteractuado(true);
    setCrewRenombrando({ id, name, workerCount });
  }

  function cerrarSesion() {
    setCerrandoSesion(true);
    createClient()
      .auth.signOut()
      .finally(() => router.push("/login"));
  }

  return (
    <div
      className="min-h-dvh font-[family-name:var(--hse-font-body)] text-[var(--hse-ink)]"
      style={{
        background:
          "radial-gradient(ellipse 600px 320px at 50% -10%, color-mix(in srgb, var(--hse-amarillo) 32%, transparent), transparent), " +
          "radial-gradient(ellipse 500px 380px at 85% 70%, color-mix(in srgb, var(--hse-azul) 10%, transparent), transparent), " +
          "radial-gradient(ellipse 500px 380px at 10% 95%, color-mix(in srgb, var(--hse-verde) 10%, transparent), transparent), var(--hse-bg)",
      }}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 pt-6 pb-16">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[var(--hse-ink-2)] uppercase">
              Panel del Gerente de HSE
            </p>
            <h1 className="font-[family-name:var(--hse-font-display)] text-2xl font-bold text-[var(--hse-ink)]">
              {orgName}
            </h1>
          </div>
          <button
            type="button"
            onClick={cerrarSesion}
            disabled={cerrandoSesion}
            aria-label="Cerrar sesión"
            className="mt-1 flex shrink-0 items-center gap-1 rounded-[var(--hse-radius-chip)] px-2 py-1.5 text-xs font-semibold text-[var(--hse-ink-2)] transition active:scale-95 disabled:opacity-60"
          >
            <LogOut className="size-4" strokeWidth={2.25} />
            {cerrandoSesion ? "Saliendo..." : "Salir"}
          </button>
        </header>

        <BannerEstado
          estado={estado}
          trialEndsAt={trialEndsAt}
          accessUntil={accessUntil}
          graceEndsAt={graceEndsAt}
          planName={planName}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[var(--hse-radius-card)] border-3 border-[var(--hse-ink)] bg-[var(--hse-surface)] p-4 shadow-[0_6px_0_-2px_rgb(26_26_26/0.08),0_10px_20px_rgb(26_26_26/0.1)]">
            <span className="flex size-8 items-center justify-center rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-ink)] bg-[var(--hse-azul)]/20">
              <Users className="size-4 text-[var(--hse-azul)]" strokeWidth={2.5} />
            </span>
            <p className="mt-2 text-2xl font-bold text-[var(--hse-ink)]">{trabajadoresAnimado}</p>
            <p className="text-xs text-[var(--hse-ink-2)]">Trabajadores</p>
          </div>
          <div className="rounded-[var(--hse-radius-card)] border-3 border-[var(--hse-ink)] bg-[var(--hse-surface)] p-4 shadow-[0_6px_0_-2px_rgb(26_26_26/0.08),0_10px_20px_rgb(26_26_26/0.1)]">
            <span className="flex size-8 items-center justify-center rounded-[var(--hse-radius-chip)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)]/30">
              <Flame className="size-4 text-[var(--hse-amarillo-sombra)]" strokeWidth={2.5} fill="var(--hse-amarillo)" />
            </span>
            <p className="mt-2 text-2xl font-bold text-[var(--hse-ink)]">{rachaAnimado}</p>
            <p className="text-xs text-[var(--hse-ink-2)]">Con racha activa</p>
          </div>
        </div>

        {crews.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[var(--hse-radius-card)] border-3 border-dashed border-[var(--hse-ink-2)] bg-[var(--hse-surface)] px-6 py-10 text-center">
            <Users className="size-9 text-[var(--hse-ink-2)]" strokeWidth={1.75} />
            <p className="text-base font-semibold text-[var(--hse-ink)]">Todavía no tienes cuadrillas</p>
            <p className="text-sm text-[var(--hse-ink-2)]">Crea la primera y agrega a tu gente — toma menos de 1 minuto.</p>
            <button
              type="button"
              onClick={() => abrirModal()}
              className="mt-1 flex items-center gap-1.5 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] px-4 py-3.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none"
            >
              <UserPlus className="size-4" strokeWidth={2.5} />
              Crear mi primera cuadrilla
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {crews.map((crew, i) => (
              <motion.div
                key={crew.id}
                initial={sinMovimiento ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: sinMovimiento ? 0 : i * 0.06 }}
              >
                <TarjetaCuadrilla
                  crew={crew}
                  acento={ACENTOS[i % ACENTOS.length]}
                  onAgregar={abrirModal}
                  onRenombrar={renombrarCuadrilla}
                  onEditarTrabajador={editarTrabajador}
                />
              </motion.div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => abrirModal()}
          className="flex items-center justify-center gap-1.5 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-amarillo)] py-3.5 text-sm font-bold text-[var(--hse-ink)] shadow-[0_4px_0_var(--hse-amarillo-sombra)] transition active:translate-y-[4px] active:shadow-none"
        >
          <UserPlus className="size-4" strokeWidth={2.5} />
          Nueva cuadrilla
        </button>

        <div className="rounded-[var(--hse-radius-card)] border-3 border-[var(--hse-ink)] bg-[var(--hse-neutro-antes)] p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-[var(--hse-ink-2)]" strokeWidth={2.25} />
            <h3 className="text-base font-bold text-[var(--hse-ink)]">Plan y facturación</h3>
          </div>
          <p className="mt-2 text-sm text-[var(--hse-ink-2)]">
            {planName ? `Plan ${planName}` : "Plan de prueba"} · la suscripción se gestiona y cobra desde
            Hotmart con el correo con el que compraste.
          </p>
        </div>
      </div>

      {interactuado && (
        <>
          <ModalAgregarTrabajador
            abierto={modalAbierto}
            onOpenChange={setModalAbierto}
            crewPreseleccionada={crewPreseleccionada}
            crews={crews}
          />
          <ModalEditarTrabajador
            worker={workerEditando}
            onOpenChange={(v) => !v && setWorkerEditando(null)}
            onGuardado={(deshacer) => mostrarToastDeshacer("Cambios guardados", deshacer)}
          />
          <ModalRenombrarCuadrilla
            crew={crewRenombrando}
            onOpenChange={(v) => !v && setCrewRenombrando(null)}
            onGuardado={(deshacer) => mostrarToastDeshacer("Cuadrilla renombrada", deshacer)}
            onArchivada={() => {
              const crewId = crewRenombrando?.id;
              mostrarToastDeshacer("Cuadrilla archivada", async () => {
                if (!crewId) return;
                await fetch("/api/admin/crews", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ crewId, archived: false }),
                });
                router.refresh();
              });
            }}
          />
        </>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={sinMovimiento ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-[var(--hse-radius-boton)] border-2 border-[var(--hse-ink)] bg-[var(--hse-ink)] px-4 py-3 text-sm font-semibold text-[var(--hse-surface)]"
          >
            <span>{deshaciendo ? "Deshaciendo..." : toast.mensaje}</span>
            <button
              type="button"
              disabled={deshaciendo}
              onClick={async () => {
                setDeshaciendo(true);
                try {
                  await toast.deshacer();
                  setToast(null);
                } catch {
                  setToast({ mensaje: "No pudimos deshacer el cambio. Vuelve a intentarlo.", deshacer: toast.deshacer });
                } finally {
                  setDeshaciendo(false);
                }
              }}
              className="shrink-0 rounded-[var(--hse-radius-chip)] bg-[var(--hse-amarillo)] px-3 py-1.5 text-xs font-bold text-[var(--hse-ink)] transition active:scale-95 disabled:opacity-60"
            >
              Deshacer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
