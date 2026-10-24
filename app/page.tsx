"use client";

import { useEffect, useRef } from "react";
import { LANDING_HTML } from "./landing-markup";
import "./page.css";

// Migrada desde landing.html (51 rondas de revisión independiente, ver ESTADO.md
// → veredicto:landing) preservando el HTML/CSS aprobado tal cual — ver
// scripts/migrate-screen.mjs. El script original se porta aquí, scopeado a
// `root` en vez de `document` donde corresponde.
export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    if ("IntersectionObserver" in window && !sinMovimiento) {
      root.classList.add("js-reveal");
    }

    // Conteo animado del dato héroe (la racha)
    const rachaEl = root.querySelector<HTMLElement>("#rachaNum");
    if (rachaEl) {
      if (sinMovimiento) {
        rachaEl.textContent = "12";
      } else {
        const destino = 12;
        const duracion = 700;
        const inicio = performance.now();
        let frame = 0;
        function tick(ahora: number) {
          const t = Math.min(1, (ahora - inicio) / duracion);
          const easeOut = 1 - Math.pow(1 - t, 3);
          if (rachaEl) rachaEl.textContent = String(Math.round(easeOut * destino));
          if (t < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
        cleanups.push(() => cancelAnimationFrame(frame));
      }
    }

    // Barra de módulos completados
    const barraModulos = root.querySelector<HTMLElement>("#barraModulos");
    if (barraModulos) {
      const frame = requestAnimationFrame(() => {
        barraModulos.style.width = "75%";
      });
      cleanups.push(() => cancelAnimationFrame(frame));
    }

    // Sticky CTA + botón "volver arriba"
    const heroBtn = root.querySelector<HTMLElement>(".hero .boton");
    const sticky = root.querySelector<HTMLElement>("#stickyCta");
    const subirArriba = root.querySelector<HTMLElement>("#subirArriba");
    const stickyCerrarBtn = root.querySelector<HTMLElement>("#stickyCerrar");
    const footerLegal = root.querySelector<HTMLElement>("footer.legal");

    if (heroBtn && sticky && subirArriba && footerLegal) {
      let stickyDescartado = false;
      try {
        stickyDescartado = localStorage.getItem("stickyCerrado") === "1";
      } catch {}
      let heroBtnOutOfView = false;
      let footerVisible = false;

      function actualizarSticky() {
        const stickyVisible = heroBtnOutOfView && !stickyDescartado && !footerVisible;
        sticky!.classList.toggle("show", stickyVisible);
        subirArriba!.classList.toggle("show", heroBtnOutOfView);
        subirArriba!.classList.toggle("sin-sticky", !stickyVisible);
        if (stickyVisible) {
          document.documentElement.style.setProperty("--sticky-h", `${sticky!.offsetHeight}px`);
        }
      }

      const io = new IntersectionObserver(([e]) => {
        heroBtnOutOfView = !e.isIntersecting;
        actualizarSticky();
      }, { threshold: 0 });
      io.observe(heroBtn);

      const footerIo = new IntersectionObserver(([e]) => {
        footerVisible = e.isIntersecting;
        actualizarSticky();
      }, { threshold: 0 });
      footerIo.observe(footerLegal);

      window.addEventListener("resize", actualizarSticky);
      cleanups.push(() => {
        io.disconnect();
        footerIo.disconnect();
        window.removeEventListener("resize", actualizarSticky);
      });

      const onSubirArriba = () => window.scrollTo({ top: 0, behavior: "smooth" });
      subirArriba.addEventListener("click", onSubirArriba);
      cleanups.push(() => subirArriba.removeEventListener("click", onSubirArriba));

      if (stickyCerrarBtn) {
        const onCerrar = () => {
          stickyDescartado = true;
          try {
            localStorage.setItem("stickyCerrado", "1");
          } catch {}
          actualizarSticky();
        };
        stickyCerrarBtn.addEventListener("click", onCerrar);
        cleanups.push(() => stickyCerrarBtn.removeEventListener("click", onCerrar));
      }
    }

    // FAQ: acordeón exclusivo
    const faqItems = Array.from(root.querySelectorAll<HTMLDetailsElement>(".faq-item"));
    const onToggle = (item: HTMLDetailsElement) => () => {
      if (item.open) {
        faqItems.forEach((otro) => {
          if (otro !== item) otro.open = false;
        });
      }
    };
    const faqHandlers = faqItems.map((item) => {
      const handler = onToggle(item);
      item.addEventListener("toggle", handler);
      return { item, handler };
    });
    cleanups.push(() => faqHandlers.forEach(({ item, handler }) => item.removeEventListener("toggle", handler)));

    // Carrusel "La app por dentro"
    const carrusel = root.querySelector<HTMLElement>("#carrusel");
    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>(".dots button"));
    const flechaPrev = root.querySelector<HTMLButtonElement>("#carruselPrev");
    const flechaNext = root.querySelector<HTMLButtonElement>("#carruselNext");

    if (carrusel && flechaPrev && flechaNext) {
      const slides = Array.from(carrusel.querySelectorAll<HTMLElement>(".slide"));
      const anchoSlide = () => slides[0].getBoundingClientRect().width + 16;

      function irASlide(i: number) {
        carrusel!.scrollTo({ left: i * anchoSlide(), behavior: "smooth" });
      }

      const dotHandlers = dots.map((dot, i) => {
        const handler = () => irASlide(i);
        dot.addEventListener("click", handler);
        return { dot, handler };
      });

      const onPrev = () => {
        const actual = Math.round(carrusel.scrollLeft / anchoSlide());
        irASlide(Math.max(0, actual - 1));
      };
      const onNext = () => {
        const actual = Math.round(carrusel.scrollLeft / anchoSlide());
        irASlide(Math.min(slides.length - 1, actual + 1));
      };
      flechaPrev.addEventListener("click", onPrev);
      flechaNext.addEventListener("click", onNext);

      const onKeydown = (e: KeyboardEvent) => {
        const actual = Math.round(carrusel.scrollLeft / anchoSlide());
        if (e.key === "ArrowRight") {
          e.preventDefault();
          irASlide(Math.min(slides.length - 1, actual + 1));
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          irASlide(Math.max(0, actual - 1));
        }
      };
      carrusel.addEventListener("keydown", onKeydown);

      function actualizarFlechas(idx: number) {
        flechaPrev!.disabled = idx <= 0;
        flechaNext!.disabled = idx >= slides.length - 1;
      }
      const onScroll = () => {
        const idx = Math.round(carrusel.scrollLeft / anchoSlide());
        dots.forEach((d, i) => {
          d.classList.toggle("on", i === idx);
          d.setAttribute("aria-current", String(i === idx));
        });
        actualizarFlechas(idx);
      };
      carrusel.addEventListener("scroll", onScroll);
      actualizarFlechas(0);

      cleanups.push(() => {
        dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener("click", handler));
        flechaPrev.removeEventListener("click", onPrev);
        flechaNext.removeEventListener("click", onNext);
        carrusel.removeEventListener("keydown", onKeydown);
        carrusel.removeEventListener("scroll", onScroll);
      });
    }

    // Confirmación honesta tras el clic en "Escríbenos" (mailto)
    const mailtoHandlers = Array.from(root.querySelectorAll<HTMLElement>(".cta-mailto")).flatMap((boton) => {
      const estado = boton.nextElementSibling as HTMLElement | null;
      if (!estado || !estado.classList.contains("mailto-status")) return [];
      const handler = () => {
        estado.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Tu correo debería haberse abierto. Si no, escríbenos a <a href="mailto:ventas@hsemasterapp.com" class="link-correo">ventas@hsemasterapp.com</a> o cópialo aquí abajo.';
        estado.classList.add("show");
      };
      boton.addEventListener("click", handler);
      return [{ boton, handler }];
    });
    cleanups.push(() => mailtoHandlers.forEach(({ boton, handler }) => boton.removeEventListener("click", handler)));

    // Copiar correo
    const copiarHandlers = Array.from(root.querySelectorAll<HTMLButtonElement>(".copiar-correo")).map((boton) => {
      const textoOriginal = boton.textContent;
      const handler = async () => {
        const correo = boton.dataset.correo ?? "";
        let copiado = false;
        try {
          await navigator.clipboard.writeText(correo);
          copiado = true;
        } catch {
          try {
            const area = document.createElement("textarea");
            area.value = correo;
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            copiado = document.execCommand("copy");
            document.body.removeChild(area);
          } catch {
            copiado = false;
          }
        }
        boton.textContent = copiado ? "¡Copiado!" : `No se pudo copiar — es: ${correo}`;
        boton.classList.add(copiado ? "copiado" : "fallo");
        setTimeout(() => {
          boton.textContent = textoOriginal;
          boton.classList.remove("copiado", "fallo");
        }, copiado ? 2000 : 5000);
      };
      boton.addEventListener("click", handler);
      return { boton, handler };
    });
    cleanups.push(() => copiarHandlers.forEach(({ boton, handler }) => boton.removeEventListener("click", handler)));

    // Revelado al hacer scroll
    const reveals = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (!sinMovimiento && "IntersectionObserver" in window) {
      const timeouts: number[] = [];
      const revealIo = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const t = window.setTimeout(() => entry.target.classList.add("in"), i * 60);
            timeouts.push(t);
            revealIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach((el) => revealIo.observe(el));
      cleanups.push(() => {
        revealIo.disconnect();
        timeouts.forEach((t) => clearTimeout(t));
      });
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={rootRef}
      className="lnd"
      // Markup aprobado (51 rondas de revisión), migrado tal cual desde landing.html.
      dangerouslySetInnerHTML={{ __html: LANDING_HTML }}
    />
  );
}
