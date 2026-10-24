"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ONBOARDING_HTML } from "./markup";
import "./page.css";

// Migrada desde onboarding.html (LISTA, ronda 16: 38/40 usabilidad, 16/20 craft — ver
// ESTADO.md → veredicto:onboarding) preservando el HTML/CSS/lógica aprobados tal cual.
// El script original queda casi textual: usa document.getElementById porque solo una
// instancia de esta pantalla vive montada a la vez (se destruye al navegar a /paywall o /).
export default function OnboardingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Guarda contra el doble-montaje de React StrictMode en desarrollo: sin esto, el
    // script de abajo se ejecutaría 2 veces y duplicaría listeners.
    if (root.dataset.wired === "1") return;
    root.dataset.wired = "1";

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window || true) {
      root.classList.add("js-motion");
    }

    const respuestas: Record<string, string | null> = {
      cuadrilla: null,
      reto: null,
      retoTexto: null,
      retoLabel: null,
      horario: null,
    };
    const pasos = Array.from(root.querySelectorAll<HTMLElement>(".onb-paso"));
    let pasoActual = 1;
    const PROGRESO: Record<number, number> = { 1: 8, 2: 32, 3: 58, 4: 80, 5: 100 };
    const fill = root.querySelector<HTMLElement>("#onbProgressFill");
    const pctEl = root.querySelector<HTMLElement>("#onbPct");
    const atrasBtn = root.querySelector<HTMLElement>("#onbAtras");

    function guardarProgreso() {
      try {
        sessionStorage.setItem("hseOnboarding", JSON.stringify(respuestas));
      } catch {}
    }

    const progressBar = root!.querySelector<HTMLElement>(".onb-progress");
    const srPaso = root!.querySelector<HTMLElement>("#onbSrPaso");
    function actualizarProgreso(paso: number) {
      if (fill) fill.style.width = PROGRESO[paso] + "%";
      if (pctEl) pctEl.textContent = PROGRESO[paso] + "%";
      progressBar?.setAttribute("aria-valuenow", String(PROGRESO[paso]));
      if (srPaso) srPaso.textContent = `Paso ${paso} de 5`;
    }
    function actualizarAtras(paso: number) {
      atrasBtn?.classList.toggle("show", paso > 1 && paso < 5);
    }
    function actualizarHeader(paso: number) {
      root!.querySelector("#onbHeaderMedio")?.classList.toggle("oculto", paso === 5);
      root!
        .querySelector("#onbLogo")
        ?.setAttribute("aria-label", paso > 1 ? "Salir del recorrido de bienvenida" : "Ir al inicio");
    }

    let transicionando = false;
    function irAPaso(num: number, direccion: "adelante" | "atras") {
      if (transicionando) return;
      const actualEl = pasos.find((p) => Number(p.dataset.paso) === pasoActual);
      const siguienteEl = pasos.find((p) => Number(p.dataset.paso) === num);
      if (!siguienteEl || siguienteEl === actualEl || !actualEl) return;
      transicionando = true;
      setTimeout(() => {
        transicionando = false;
      }, sinMovimiento ? 0 : 320);
      if (sinMovimiento) {
        actualEl.classList.remove("activo");
        siguienteEl.classList.add("activo");
      } else {
        siguienteEl.classList.add(direccion === "adelante" ? "entrando-der" : "entrando-izq");
        actualEl.classList.add(direccion === "adelante" ? "saliendo-izq" : "entrando-der");
        requestAnimationFrame(() => {
          actualEl.classList.remove("activo");
          siguienteEl.classList.add("activo");
          requestAnimationFrame(() => {
            siguienteEl.classList.remove("entrando-der", "entrando-izq");
          });
        });
        setTimeout(() => {
          actualEl.classList.remove("saliendo-izq", "entrando-der", "entrando-izq");
        }, 320);
      }
      pasoActual = num;
      actualizarProgreso(num);
      actualizarAtras(num);
      actualizarHeader(num);
      if (num !== 5) animarChipsDelPaso(siguienteEl);
      if (num === 3) prepararReconocimiento();
      if (num === 5) iniciarCarga();
    }

    function animarChipsDelPaso(pasoEl: HTMLElement) {
      const chips = pasoEl.querySelectorAll<HTMLElement>(".onb-chip");
      chips.forEach((chip, i) => {
        chip.classList.remove("in");
        if (sinMovimiento) {
          chip.classList.add("in");
          return;
        }
        setTimeout(() => chip.classList.add("in"), 80 + i * 60);
      });
      const ic = pasoEl.querySelector<HTMLElement>(".onb-reco .ic");
      const h2 = pasoEl.querySelector<HTMLElement>(".onb-reco h2");
      const p = pasoEl.querySelector<HTMLElement>(".onb-reco p");
      [ic, h2, p].forEach((el, i) => {
        if (!el) return;
        el.classList.remove("in");
        if (sinMovimiento) {
          el.classList.add("in");
          return;
        }
        setTimeout(() => el.classList.add("in"), 80 + i * 90);
      });
    }

    // Selección de chips (auto-avance en single-select) + semántica de radiogroup
    root.querySelectorAll<HTMLElement>("[data-grupo]").forEach((grupo) => {
      grupo.setAttribute("role", "radiogroup");
      const chipsDelGrupo = Array.from(grupo.querySelectorAll<HTMLElement>(".onb-chip"));
      chipsDelGrupo.forEach((chip, i) => {
        chip.setAttribute("role", "radio");
        chip.setAttribute("aria-checked", "false");
        chip.setAttribute("tabindex", i === 0 ? "0" : "-1");
        chip.addEventListener("keydown", (e) => {
          if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) return;
          e.preventDefault();
          const idx = chipsDelGrupo.indexOf(chip);
          const siguiente =
            e.key === "ArrowDown" || e.key === "ArrowRight"
              ? chipsDelGrupo[(idx + 1) % chipsDelGrupo.length]
              : chipsDelGrupo[(idx - 1 + chipsDelGrupo.length) % chipsDelGrupo.length];
          chipsDelGrupo.forEach((c) => c.setAttribute("tabindex", "-1"));
          siguiente.setAttribute("tabindex", "0");
          siguiente.focus();
        });
        chip.addEventListener("click", () => {
          if (grupo.style.pointerEvents === "none") return;
          grupo.style.pointerEvents = "none";
          grupo.classList.add("bloqueado");
          setTimeout(() => {
            grupo.style.pointerEvents = "";
            grupo.classList.remove("bloqueado");
          }, 320);
          chipsDelGrupo.forEach((c) => {
            c.classList.remove("seleccionado");
            c.setAttribute("aria-checked", "false");
            c.setAttribute("tabindex", "-1");
          });
          chip.classList.add("seleccionado");
          chip.setAttribute("aria-checked", "true");
          chip.setAttribute("tabindex", "0");
          const nombre = grupo.dataset.grupo!;
          const valor = chip.dataset.valor!;

          root!.querySelector("#onbRetoInputWrap")?.classList.remove("show");
          respuestas[nombre] = valor;
          if (nombre === "reto") {
            respuestas.retoTexto = null;
            respuestas.retoLabel = chip.querySelector("span")!.textContent;
          }
          guardarProgreso();

          setTimeout(() => {
            if (nombre === "cuadrilla") irAPaso(2, "adelante");
            else if (nombre === "reto") irAPaso(3, "adelante");
            else if (nombre === "horario") irAPaso(5, "adelante");
          }, 300);
        });
      });
    });

    // "Otra cosa": revela el input libre
    const onOtraCosa = () => {
      root!.querySelectorAll<HTMLElement>('[data-grupo="reto"] .onb-chip').forEach((c) => {
        c.classList.remove("seleccionado");
        c.setAttribute("aria-checked", "false");
      });
      root!.querySelector("#onbRetoInputWrap")?.classList.add("show");
      (root!.querySelector("#onbRetoInput") as HTMLElement | null)?.focus();
    };
    root.querySelector("#onbOtraCosa")?.addEventListener("click", onOtraCosa);

    const retoInput = root.querySelector<HTMLInputElement>("#onbRetoInput");
    const retoContinuar = root.querySelector<HTMLElement>("#onbRetoContinuar");
    const retoHint = root.querySelector<HTMLElement>("#onbRetoHint");
    retoInput?.addEventListener("input", () => retoHint?.classList.remove("show"));
    retoInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        retoContinuar?.click();
      }
    });
    retoContinuar?.addEventListener("click", () => {
      const texto = retoInput?.value.trim() ?? "";
      if (!texto) {
        retoHint?.classList.add("show");
        retoInput?.focus();
        return;
      }
      respuestas.reto = "otra";
      respuestas.retoTexto = texto;
      respuestas.retoLabel = respuestas.retoTexto;
      guardarProgreso();
      irAPaso(3, "adelante");
    });

    // Reconocimiento dinámico según el reto elegido
    const ICONO_CASCO =
      '<path d="M3.5 17.5h17"/><path d="M5 17.5Q5 7 12 7Q19 7 19 17.5"/><path d="M12 7V4"/>';
    const ICONO_QR =
      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM19 14v3M14 19h3M17 17h4v4h-4z"/>';
    const ICONO_PREGUNTA =
      '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><path d="M12 17h.01"/>';
    const RECONOCIMIENTOS: Record<string, { titulo: string; cuerpo: string; icono: string }> = {
      firman: {
        titulo: "No es que no les importe",
        cuerpo:
          "Una firma en papel nunca prueba que entendieron — el <b>Pase de los 3 Minutos</b> reemplaza la firma por una prueba real, todos los días.",
        icono: ICONO_CASCO,
      },
      certificados: {
        titulo: "No es tu equipo el que falla",
        cuerpo:
          "Cientos de carpetas de papel no fueron hechas para escalar. El Pase convierte cada certificación en un <b>código QR</b> que se verifica en segundos.",
        icono: ICONO_QR,
      },
      "no-se-quien": {
        titulo: "Un examen no distingue entender de adivinar",
        cuerpo:
          "El Pase mide si tu gente retuvo la regla de verdad, con retos de 3 minutos que <b>no se pueden adivinar</b>.",
        icono: ICONO_PREGUNTA,
      },
      auditoria: {
        titulo: "Juntar papeles no debería tomarte días",
        cuerpo:
          "Con el Pase, cada trabajador trae su <b>código QR</b> listo — tu evidencia vive en el sistema, no en una carpeta.",
        icono: ICONO_QR,
      },
    };
    function prepararReconocimiento() {
      const titulo = root!.querySelector<HTMLElement>("#onbRecoTitulo");
      const cuerpo = root!.querySelector<HTMLElement>("#onbRecoCuerpo");
      const iconoSvg = root!.querySelector<HTMLElement>(".onb-reco .ic svg");
      if (respuestas.reto === "otra" && respuestas.retoTexto) {
        if (titulo) titulo.textContent = "Gracias por contarnos";
        if (cuerpo)
          cuerpo.innerHTML = `Anotamos tu reto: "${respuestas.retoTexto}". El <b>Pase de los 3 Minutos</b> está pensado para convertir la seguridad en un hábito diario, no en papeleo.`;
        if (iconoSvg) iconoSvg.innerHTML = ICONO_CASCO;
      } else {
        const r = RECONOCIMIENTOS[respuestas.reto ?? ""] ?? RECONOCIMIENTOS.firman;
        if (titulo) titulo.textContent = r.titulo;
        if (cuerpo) cuerpo.innerHTML = r.cuerpo;
        if (iconoSvg) iconoSvg.innerHTML = r.icono;
      }
    }
    root.querySelector("#onbRecoContinuar")?.addEventListener("click", () => irAPaso(4, "adelante"));

    // Atrás
    atrasBtn?.addEventListener("click", () => {
      if (pasoActual > 1) irAPaso(pasoActual - 1, "atras");
    });

    // Modal de salida
    const modalFondo = root.querySelector<HTMLElement>("#onbModalFondo");
    const modalSeguir = root.querySelector<HTMLElement>("#onbModalSeguir");
    let elementoAntesDelModal: HTMLElement | null = null;
    function pedirSalir(e?: Event) {
      if (pasoActual > 1) {
        if (e) e.preventDefault();
        elementoAntesDelModal = document.activeElement as HTMLElement | null;
        modalFondo?.classList.add("show");
        modalSeguir?.focus();
      } else {
        router.push("/");
      }
    }
    function cerrarModal() {
      modalFondo?.classList.remove("show");
      elementoAntesDelModal?.focus();
    }
    root.querySelector("#onbLogo")?.addEventListener("click", pedirSalir);
    root.querySelector("#onbSalir")?.addEventListener("click", pedirSalir);
    modalSeguir?.addEventListener("click", cerrarModal);
    root.querySelector("#onbModalSalir")?.addEventListener("click", () => router.push("/"));
    modalFondo?.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Escape") cerrarModal();
    });

    // Loading: anillo + líneas con pausas (labor illusion)
    function iniciarCarga() {
      guardarProgreso();
      const lineas = Array.from(
        root!.querySelector("#onbLineas")!.querySelectorAll<HTMLElement>(".onb-linea"),
      );
      const textos: Record<string, string> = {
        "1": `Analizando el tamaño de tu cuadrilla: ${respuestas.cuadrilla || "—"}`,
        "2": `Ajustando al reto que marcaste: ${respuestas.retoLabel || "—"}`,
        "3": `Configurando el horario de tu charla: ${respuestas.horario || "—"}`,
        "4": "Preparando tu panel de HSE",
      };
      lineas.forEach((l) => {
        const txt = l.querySelector(".txt");
        if (txt) txt.textContent = textos[l.dataset.linea ?? ""];
      });

      const aro = root!.querySelector<SVGCircleElement>("#onbAro");
      const aroPct = root!.querySelector<HTMLElement>("#onbAroPct");
      const aroNum = aroPct?.querySelector<HTMLElement>(".num");
      const aroWrap = root!.querySelector<HTMLElement>(".onb-anillo");
      const CIRCUNFERENCIA = 314;
      let pctActual = 0;
      function setAro(pct: number) {
        if (aro) {
          aro.style.transition = sinMovimiento ? "none" : "stroke-dashoffset 500ms ease";
          aro.setAttribute("stroke-dashoffset", String(CIRCUNFERENCIA * (1 - pct / 100)));
        }
        if (pct >= 100) {
          setTimeout(() => aroWrap?.classList.add("listo"), sinMovimiento ? 0 : 450);
        }
        if (sinMovimiento) {
          if (aroNum) aroNum.textContent = pct + "%";
          pctActual = pct;
          return;
        }
        const desde = pctActual;
        const hasta = pct;
        const inicio = performance.now();
        const duracion = 500;
        pctActual = pct;
        function tick(ahora: number) {
          const t = Math.min(1, (ahora - inicio) / duracion);
          if (aroNum) aroNum.textContent = Math.round(desde + (hasta - desde) * t) + "%";
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      const metas = [25, 55, 80, 100];
      const tiempos = sinMovimiento ? [0, 0, 0, 0] : [700, 900, 900, 900];
      let acumulado = 150;
      lineas.forEach((linea, i) => {
        setTimeout(() => {
          lineas.forEach((l2, j) => {
            if (j < i) {
              l2.classList.remove("activa");
              l2.classList.add("vista", "completa");
            }
          });
          linea.classList.add("vista", "activa");
          setAro(metas[i]);
        }, acumulado);
        acumulado += tiempos[i];
      });
      setTimeout(() => {
        lineas.forEach((l) => {
          l.classList.remove("activa");
          l.classList.add("vista", "completa");
        });
      }, acumulado);
      setTimeout(() => router.push("/paywall"), acumulado + 500);
    }

    actualizarProgreso(1);
    animarChipsDelPaso(pasos[0]);

    // Si ya hay respuestas guardadas en esta sesión, no las repite desde cero.
    function marcarChipGuardado(grupo: string, valor: string | null) {
      if (!valor) return;
      const chip = root!.querySelector<HTMLElement>(
        `[data-grupo="${grupo}"] .onb-chip[data-valor="${CSS.escape(valor)}"]`,
      );
      if (chip) {
        chip.classList.add("seleccionado");
        chip.setAttribute("aria-checked", "true");
      }
    }
    try {
      const guardado = JSON.parse(sessionStorage.getItem("hseOnboarding") || "null");
      if (guardado && guardado.cuadrilla) {
        Object.assign(respuestas, guardado);
        marcarChipGuardado("cuadrilla", guardado.cuadrilla);
        if (!guardado.reto) {
          irAPaso(2, "adelante");
        } else {
          if (guardado.reto !== "otra") marcarChipGuardado("reto", guardado.reto);
          irAPaso(4, "adelante");
          if (guardado.horario) marcarChipGuardado("horario", guardado.horario);
        }
      }
    } catch {}
  }, [router]);

  return (
    <div
      ref={rootRef}
      className="onb"
      dangerouslySetInnerHTML={{ __html: ONBOARDING_HTML }}
    />
  );
}
