# VEREDICTO revisor-visual — paywall (activación de prueba gratis)
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [paywall.html línea 53, `.pw-emocion b { color: var(--rojo-sombra) }` sobre `--bg:#fffaf0`] la frase que agita el dolor principal del avatar — "la mano en la línea de fuego" — mide ~4.36:1 de contraste (texto normal 14px, no "grande" aunque sea bold), por debajo del mínimo AA 4.5:1 → fix: oscurecer el tono (ej. #a83d1a) o subirlo a ≥18.66px/bold y reverificar el contraste real antes de declarar listo.
2. [paywall.html líneas 129-154] headline + 2 párrafos (dolor + beneficio) + timeline de 3 pasos (~9 líneas de cuerpo) se despliegan íntegros antes de que el usuario vea el precio o el botón de activar → en una pantalla cuyo único trabajo es decidir sí/no, obliga a leer y bajar mucho antes de llegar a la oferta → fix: comprimir a 1 frase de dolor + 1 de beneficio arriba, dejar el detalle del timeline como refuerzo más compacto o colapsable.
3. [paywall.html líneas 159-177 y 209-214] el `role="radiogroup"`/`role="radio"` de los planes solo maneja `Enter`/`Espacio` vía JS, con `tabindex="0"` en ambas tarjetas — un usuario de teclado/lector de pantalla espera mover la selección con flechas ← → dentro del grupo (patrón ARIA radiogroup estándar), no tabular dos veces → fix: implementar navegación por flechas con una sola tarjeta tabbable por vez.
4. [paywall.html línea 181] "Compromiso del Primer Pase: si no lo completan el día 1, te ayudamos sin costo" no explica en esta misma pantalla qué es "el Primer Pase" que hay que completar — obliga a recordar un término visto en otra pantalla (onboarding), violando "reconocer en vez de recordar" para quien aterriza directo aquí → fix: agregar 3-4 palabras aclaratorias en la misma línea (ej. "tu primera charla de 3 minutos").
5. [paywall.html líneas 129-131, densidad general] tres bloques de texto con jerarquía de énfasis similar (headline azul, emoción en rojo, sub con negrita negra) compiten por la atención del usuario antes de ver una sola acción — ningún bloque es claramente secundario al entrecerrar los ojos → fix: bajar el peso visual de uno de los tres (p.ej. quitar el color del segundo párrafo y dejarlo en negro/gris puro) para que quede un único foco de énfasis cromático.
