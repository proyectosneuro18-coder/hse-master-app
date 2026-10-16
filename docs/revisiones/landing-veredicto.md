# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Carrusel "La app por dentro", .flecha] Botones prev/next de 36x36px, por debajo del minimo de 44px de touch target -> subir a 44x44px.
2. [.boton-verde — hero/CTA final/sticky/plan Anual] Relleno en var(--verde-sombra) y borde inferior en var(--ink) en vez del mecanismo de FICHA-ARTE (borde inferior en tono mas oscuro del MISMO color) -> background: var(--verde); border-bottom-color: var(--verde-sombra).
3. [Oferta, botones de plan Anual vs Mensual] border-bottom de 6px vs 4px entre la variante primaria y .link-secundario, comparadas lado a lado -> unificar grosor (4px) en todas las variantes de .boton.
4. [Animacion de entrada — Oferta/Garantia/FAQ/CTA final] Estas 4 secciones revelan el bloque completo de una sola vez (.reveal en el wrap) mientras Problema/Agitacion/Solucion animan cada tarjeta con stagger de 60ms -> agregar .reveal a cada .plan/.stack .item/.faq-item.
5. [Primer viewport del Hero] 6+ focos simultaneos (badge, palabra azul en el h1, CTA verde, 2 lineas de chip de confianza, mockup con bloque amarillo+2 mini-chips+boton+float-chip) siguen compitiendo por la mirada -> mover la segunda linea de "prueba-industria" (QR) a la seccion de Solucion.
