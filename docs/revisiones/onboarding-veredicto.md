# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/onboarding-375.png · docs/revisiones/onboarding-375-b.png · docs/revisiones/onboarding-375-c.png
Usabilidad: 30/40
Craft: 10/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla de carga, 2da línea — "Ajustando al reto que marcaste..."] Para los 4 retos predefinidos (todo menos "Otra cosa"), el código usa `RECONOCIMIENTOS[respuestas.reto].titulo` (ej. "No es que no les importe") en vez del texto real de la respuesta del usuario (ej. "Firman la charla y no retienen nada"). El mensaje de confirmación en el momento de más confianza pre-paywall muestra una frase que no corresponde a lo que el usuario eligió → guardar el label visible del chip al seleccionarlo (ej. `respuestas.retoLabel`) y usarlo en `textos[2]` de `iniciarCarga()`, dejando `RECONOCIMIENTOS[...].titulo` solo para el texto de la pantalla de reconocimiento.
2. [Header, barra de progreso al usar "Atrás"] `actualizarProgreso(num)` fija el ancho según el paso de destino sin importar la dirección, así que la barra RETROCEDE visualmente al volver una pregunta (ej. de 58% a 32%) → si el criterio del sistema es que la barra nunca retroceda, congelar el ancho al máximo alcanzado (`Math.max(actual, nuevo)`) y solo bajarlo si de verdad se quiere comunicar "estás editando una respuesta anterior".
3. [Pasos 1 y 4, mitad inferior de la pantalla] Tras los 3-4 chips queda cerca del 50-60% del alto de pantalla completamente vacío (ver onboarding-375.png) — el bloque de pregunta+chips no se centra ni se acompaña de nada, se lee como una pantalla a medio terminar → centrar verticalmente el `.onb-paso` en el `.onb-stage` o llenar el espacio con contexto visual (ilustración simple, nota de ayuda) en vez de dejarlo muerto.
4. [Fondo y chips de toda la pantalla] Cero tinte/gradiente en el fondo (`--bg: #fffaf0` plano) y cero elevación en los chips (solo borde de 3px, sin sombra ni offset) — la única "profundidad" real del kit vive en el borde inferior de los botones. El resultado visual es una pantalla de un solo plano → aplicar el mismo mecanismo de "borde más oscuro debajo" que ya usan los botones también a los chips/cards, o un tinte sutil de fondo distinto para el stage vs. el header.
5. [Identidad visual general — tipografía chunky + bordes negros gruesos + botón con border-bottom "presionable" + amarillo+multicolor] El kit es reconocible de inmediato como un remix cercano del lenguaje de Duolingo (documentado y defendido en FICHA-ARTE, pero el riesgo de intercambiabilidad sigue activo a ojo entrenado) → reforzar un dispositivo ownable propio del nicho (ícono de casco/pozo, textura industrial) que no dependa solo de la paleta rotada en hue.

Nota adicional (código, no bloqueante para el puntaje de arriba pero sí accesibilidad): los chips de selección única no llevan `role="radiogroup"`/`role="radio"`/`aria-checked`, solo una clase visual `.seleccionado` — un lector de pantalla no anuncia cuál quedó elegida.
