# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 18/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Global — todo enlace/botón táctil, más visible en el logo del header que no tiene fondo que lo absorba] Ningún selector resetea `-webkit-tap-highlight-color`; computed style confirma el default `rgba(51,181,229,.4)` sin sobreescribir, así que cada tap en móvil dispara un flash azul genérico que no es del kit de marca y pisa el mecanismo "presionable" ya diseñado → fix: `-webkit-tap-highlight-color: transparent;` en `*`/`body`, apoyado en los `:active`/`:hover` existentes.
2. [Carrusel "La app por dentro", sección 5, `.carrusel`] Confirmado en vivo: al enfocarlo con teclado recibe el anillo de foco NATIVO del navegador (`outline: auto`, color ámbar rgb(229,151,0)), no el azul de marca que sí aplica a `a/button/.boton/summary` — rompe consistencia y encaje óptico contra las esquinas redondeadas del resto de la UI → fix: agregar `.carrusel:focus-visible{outline:3px solid var(--azul);outline-offset:3px}` o `tabindex="-1"` si no necesita foco propio.
3. [Secciones "La app por dentro" / "Oferta"] El claim "el estándar de la IOGP que usan las principales petroleras del mundo" no tiene ninguna prueba visible en pantalla (sin logos, testimonio o demo) — especificidad sin respaldo → fix: sumar al menos una prueba mínima (cita de experto, captura real, badge de validación) antes de publicar.
4. [CTA hero, sección 1] Contraste medido del botón verde (#46a302) contra el fondo crema del hero = 3.10:1, pasa el mínimo de 3:1 por un margen casi nulo → fix: oscurecer `--verde-sombra` (≈#3d9202) para dejar colchón real.
5. [Sección Oferta, tarjetas de plan] Dos botones "Empezar prueba gratis" idénticos en paralelo (uno por plan) diluyen la regla de una sola acción primaria por sección → fix: un único CTA que tome el plan ya seleccionado visualmente en la tarjeta.
