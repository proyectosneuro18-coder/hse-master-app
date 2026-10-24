# VEREDICTO revisor-visual — app-principal
Fecha: 2026-10-23 00:00 (ronda 4 — re-revisión tras corregir 3 defectos de la ronda 3)
Screenshot: docs/revisiones/app-principal-375.png
Usabilidad: 28/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [app-principal.html líneas 280-287, chips "Vidas" y "2° Ranking" — PENDIENTE de la ronda 3, sin cambios] siguen sin ningún affordance de ayuda/contexto: "2° Ranking" no dice de cuántos participantes, "Vidas" no explica qué pasa si llegan a 0 — a diferencia de "Pase", que ya tiene su botón "¿Qué es el Pase?" con toast explicativo de 5s. El usuario tiene que inferir o recordar reglas de otra pantalla (viola heurística 6) → dar a "Vidas" y "Ranking" el mismo tratamiento de ayuda que ya tiene "Pase".
2. [heurística 7, código completo — PENDIENTE, sin cambios] el único atajo de teclado/eficiencia sigue siendo Escape para cerrar el modal; nada acelera al usuario recurrente que ya conoce la rutina diaria (ej. Enter para "Empezar mi reto" cuando el botón tiene foco, o completar el ejercicio con teclas 1-4) → sigue siendo el eje más débil de la pantalla; documentar como deuda explícita para la próxima ronda.
3. [craft eje 3 — identidad, paleta "Casco de Oro"] la paleta multicolor (amarillo+verde+azul+rojo, bordes gruesos de 2.5-3px, botones con border-bottom sólido) sigue siendo reconocible de inmediato como una derivación directa de Duolingo pese a la rotación de hue documentada en FICHA-ARTE — un ojo entrenado identifica el mecanismo de inspiración al toque. El bloque-héroe amarillo ayuda como dispositivo ownable, pero por sí solo no compensa que el resto del sistema (chips, botón presionable, badges circulares) replica 1:1 la gramática visual de la app líder → sumar un segundo detalle de firma propio (textura/grano, trazo de ilustración propio en el ícono de racha, o un patrón decorativo de fondo) que no dependa de la paleta ni de la mecánica de botón.
4. [craft eje 5 — encaje óptico, tamaños de ícono] los íconos SVG de los chips (18px), el del bloque-héroe (20px) y el del reto de hoy (22px) no siguen una escala fija relacionada con el tamaño del texto que acompañan — se ve como 3 decisiones sueltas en vez de 1 sistema → unificar a 2 tamaños (ej. 18px para labels/chips, 24px para bloques protagonistas).
5. [modal del ejercicio, líneas 362-366] el cierre solo responde al botón "X" y a Escape; no hay tap-fuera-para-cerrar en el backdrop — válido como decisión de diseño, pero junto con el defecto #2 (sin otros atajos) refuerza que la pantalla ofrece pocas vías alternativas de control y libertad → opcional: permitir cerrar tocando el backdrop cuando el usuario aún no completó el ejercicio.

Notas de verificación — los 3 cambios de la ronda 3, punto por punto:
1. Toasts con lenguaje de proceso de desarrollo ("se construye a continuación en esta sesión"): CONFIRMADO resuelto en código — líneas 474, 477, 481 ahora dicen "Tu ruta de aprendizaje llega muy pronto", "Tu pasaporte de competencia llega muy pronto" y "'[tab]' llega muy pronto" respectivamente. Revisados los 4 triggers (avatar, Progreso, Ranking, Perfil): los 4 usan el copy nuevo, cero jerga de desarrollo/sesión visible. El toast de ayuda del Pase (línea 580, "El Pase: el mecanismo de tu app que revisa...") usa lenguaje de producto, no de proceso — aceptable. Heurística 2 sube de forma clara. Resuelto.
2. Ícono de candado en el chip "Vidas" confundía con el tema de bloqueo del reto: CONFIRMADO resuelto — línea 281 ahora es un SVG de casco de seguridad (domo + visera + dos remaches), visualmente distinto del candado que sigue usándose en el ejercicio ("Candado + etiqueta", línea 373). Verificado también en el screenshot: el ícono rojo del chip "Vidas" ya no se lee como lock. Coherente con que la mecánica de "vidas" del proyecto son cascos (confirmado en ESTADO.md). Resuelto.
3. Scrim del modal `rgb(26 26 26/0.55)` se veía oliva/turbio sobre el héroe amarillo: CONFIRMADO resuelto — línea 191 ahora es `rgb(8 10 26 / 0.86)`. En docs/revisiones/app-principal-375-b.png el fondo tras el modal se ve azul-negro parejo, sin viraje a verde/oliva; el héroe amarillo detrás queda claramente oscurecido y neutralizado, no mezclado en un tono sucio. Resuelto.

Pendientes conocidos (no nuevos, no bloquean la lectura de esta ronda pero siguen sin corregirse):
- Falta de affordance de ayuda en "Vidas"/"Ranking" (ver defecto #1 arriba).
- Único atajo de teclado es Escape (ver defecto #2 arriba).

Notas de verificación adicionales:
- Gate de carga cognitiva: pasa (0 fallas) — 1 acción primaria, grupos ≤7 ítems, controles "Pronto" correctamente atenuados y con feedback al tocarlos (toast), nada que memorizar entre pantallas.
- CTA héroe vivo: 4/4 — contraste verde-sombra/ink ok, `:active`/`disabled` definidos y coherentes con el estado del modal, nunca disabled por defecto salvo mientras el modal está abierto o tras completar el reto, área táctil ancho completo ~56px alto.
- Movimiento: mismas 6/7 baseline verificadas en código que en la ronda 3 (stagger, conteo del héroe, tap <150ms, modal con opacity+scale, celebración en hito real, guard `js-motion`/`prefers-reduced-motion`); "transición entre tabs" sigue sin ser demostrable porque los otros 3 tabs son stubs "Pronto".
- Identidad (eje 3): paleta "Casco de Oro" consistente con FICHA-ARTE.md, hues ya rotados respecto a los hex exactos de Duolingo; no coincide con las paletas vetadas del test anti-clon ("Capítulo"/"Umbral") pero sigue siendo una derivación muy legible del líder del nicho (ver defecto #3).
- Gate doble (≥36/40 y ≥16/20): NO se cumple ninguno de los dos umbrales — 28/40 y 15/20. Los 3 defectos corregidos de la ronda 3 eran reales y están bien resueltos (sin regresiones detectadas), pero los 2 defectos pendientes (heurística 6 parcial y heurística 7) y los matices de craft (identidad e íconos) siguen sin atacarse — insuficiente para declarar la pantalla lista.
