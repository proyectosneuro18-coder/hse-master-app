# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Header, paywall.html líneas 37-42] `.pw-header` no define `justify-content: space-between` ni `.pw-cerrar` tiene `margin-left:auto` — con flexbox por defecto (flex-start) el logo y el botón de volver deberían renderizar pegados a la izquierda, no distribuidos extremo a extremo como se ve en el screenshot capturado. Verificar de inmediato si el screenshot quedó desactualizado respecto al código actual (riesgo crítico: la pantalla real puede no coincidir con lo puntuado aquí) → fix: agregar `justify-content: space-between;` a `.pw-header` y re-capturar.
2. [Hero, líneas 44-46 CSS + script 196-253] Todo bloque `.pw-reveal` arranca en `opacity:0` y SOLO la clase `.in`, añadida por JavaScript, lo hace visible — si el JS no corre (bloqueado, CSP, error de red en el script), toda la pantalla bajo el header queda en blanco permanente, sin `<noscript>` de respaldo → fix: fijar `opacity:1` por defecto en CSS y dejar que solo la transición de entrada (no la visibilidad base) dependa de JS.
3. [CTA, línea 184 + handler líneas 247-251] El botón dice "Activar mi prueba gratis de 14 días" pero al tocarlo no activa nada: navega a `login.html` sin avisar que falta crear el acceso primero — rompe la expectativa que el propio copy genera (heurística 1/9) → fix: microcopy bajo el botón ("Último paso: crea tu acceso para activarla") o cambiar el CTA a algo como "Crear mi acceso y activar prueba".
4. [Íconos SVG, línea 140 (`stroke="#1a1a1a"`) y líneas 166/175 (`stroke="#fff"`)] Colores hardcodeados en hex dentro de los SVG en vez de heredar los tokens del tema (`--ink`, `--surface`), violando la regla de "tokens para todo color, nunca hex directo" → fix: usar `stroke="currentColor"` heredando `color` del contenedor.
5. [Hero, líneas 134-136] Tres bloques de texto corridos (titular + frase de dolor en rojo + subtítulo del mecanismo) antes de cualquier interacción en la pantalla que más debe convertir — redundancia que alarga la lectura inicial → fix: fusionar `.pw-emocion` y `.pw-sub` en una sola línea de refuerzo (dolor → mecanismo) de máximo 2 renglones.
