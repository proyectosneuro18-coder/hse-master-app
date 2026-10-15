# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 24/40
Craft: 11/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. CTA principal "Quiero mi prueba gratis de 14 días" (hero, botón verde) — sin el borde negro de 2.5-3px que la FICHA-ARTE exige en "TODOS los bloques y botones" (código: `.boton{border:none}` en el `<style>`, solo tiene border-bottom de 5px) y contraste verde-sobre-crema ≈2:1, bajo el mínimo 3:1 exigido para el CTA héroe → agregar `border: 3px solid var(--ink)` a `.boton` manteniendo el border-bottom del efecto presionable.
2. Botones `.boton`, `.boton-verde`, `.boton-amarillo` (hoja de estilos) — no tienen :hover ni :active definidos en el CSS, pese a que la propia ficha pide que el botón "se hunda (pierda el border-bottom) al tocar" → agregar `.boton:active{border-bottom-width:0; transform:translateY(4px)}` con transición ≤150ms.
3. Sección 3 "Agitación" (párrafo único, bajo el h2) — bloque de ~5 oraciones que a 375px ocupa muchas más de 3-4 líneas, justo en la sección que debe doler rápido, no cansar leyendo → partir en 2-3 bloques cortos de máx. 3 líneas cada uno.
4. Hero, botón CTA (visible en el screenshot a 375px) — el texto "QUIERO MI PRUEBA GRATIS DE 14 DÍAS" se parte en 2 líneas dentro del botón, rompiendo el encaje óptico "gordito de una línea" del resto de chips/badges → acortar el copy a "Quiero mi prueba gratis" o rediseñar el botón para una sola línea cómoda en mobile.
5. Icono de racha "🔥" (hero y primer slide del carrusel) — usa un emoji de sistema en vez de un SVG propio, rompiendo la consistencia del sistema de íconos (el resto de la pantalla usa SVG con el mismo trazo: checks, lupa, candado, escudo) → reemplazar por un SVG de llama con el mismo stroke que los demás íconos.
