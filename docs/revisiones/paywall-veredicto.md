# VEREDICTO revisor-visual — paywall (activación de prueba gratis)
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 34/40
Craft: 18/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [paywall.html líneas 161-162 y 169-170, tarjetas de plan] el precio solo se muestra "/usuario/mes" (US$6.67 y US$8) sin el costo total para la cuadrilla que el propio onboarding ya reportó (10 a 20 personas, usado en la línea 127 del headline) — el comprador B2B (Carlos, FICHA-AVATAR.md, "poder adquisitivo... lo compara contra multas") tiene que hacer la cuenta él mismo antes de decidir → fix: agregar una línea dinámica bajo cada precio ("≈ US$67-133/mes para tu cuadrilla de 10 a 20"), leyendo el mismo dato de `sessionStorage` que ya alimenta `pwCuadrilla` (línea 194).
2. [paywall.html línea 121] `<a href="onboarding.html" class="pw-cerrar" aria-label="Volver al recorrido de bienvenida">` apunta al archivo sin parámetro ni ancla de paso — no hay evidencia en este código de que el onboarding reanude en el último paso contestado; si reinicia desde el principio, el botón etiquetado "volver" en realidad fuerza a recontestar las 4 preguntas ya dadas (viola "reconocer en vez de recordar" y "control y libertad") → fix: pasar un parámetro de reanudación (`onboarding.html?resume=1`) y verificar que esa página lo honre, o cambiar el aria-label a lo que realmente hace si reinicia.
3. [paywall.html líneas 38-40 y 120] `.pw-logo` (el link con el logo "HSE Master App") no tiene padding ni min-height — su área táctil real es ~24px (la altura del `.dot`), por debajo del mínimo de 44px que la Regla 5 de UX exige para todo botón/link tocable en 375px → fix: agregar `padding: 10px 4px` o `min-height: 44px; display: inline-flex; align-items: center;` al `.pw-logo`.
4. [paywall.html líneas 50-51, 69, 93 (small), 95, 105, 109 — jerarquía tipográfica] fuera del headline (28px) y el precio (22px), todo el cuerpo —`pw-sub`, `pw-emocion`, `.titulo` del timeline, `.nota` del plan, el texto del botón y `pw-reversibilidad`— comparte 14px y se diferencia solo por peso/color; al entrecerrar los ojos el nivel 2-3 de la jerarquía (DESIGN-CORE: 4 niveles nítidos) se ve plano → fix: bajar `pw-sub` (el texto menos prioritario, la descripción general) a 13px o subir `.nota`/`pw-planes-tit` a 15px para abrir un tercer escalón real.
5. [paywall.html línea 48 vs FICHA-ARTE.md línea 32] `.pw-headline { font-size: 28px; }` supera el tope ~23-26px que la ficha fija para la escala "display" de la app, y a diferencia del h1 de landing (34/46px, excepción documentada en la ficha) o la pregunta de onboarding (28-32px, excepción documentada citando `50-DISENO-ONBOARDING-PAYWALL.md`), el headline del paywall no tiene una excepción registrada que lo justifique → fix: documentar la excepción en FICHA-ARTE.md (si el paywall se trata como "marketing display") o bajarlo a 26px para no crear una quinta variante no registrada.

Nota de seguimiento: los 5 defectos de la ronda 7 (contraste del dolor en rojo, exceso de texto antes del precio, navegación por flechas del radiogroup, "Compromiso del Primer Pase" sin aclarar, competencia de 3 colores) están corregidos y verificados en este código — no se repiten en esta ronda.
