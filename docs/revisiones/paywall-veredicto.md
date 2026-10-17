# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [paywall.html línea 127] El botón "volver" (`<a href="onboarding.html">`) reinicia todo el recorrido de bienvenida en vez de regresar al último paso donde iba el usuario — rompe control y libertad (heurística 3, verificado en código) → Fix: guardar el último paso visto en sessionStorage y que `onboarding.html` reanude ahí, o usar `history.back()`.
2. [paywall.html líneas 133-154] La duración real de la prueba (14 días) nunca se declara explícita y directamente — solo se infiere sumando "Día 12" + "Día 14" del timeline, obligando al usuario a hacer el cálculo (heurística 2/8) → Fix: agregar un rótulo visible tipo "Prueba gratis de 14 días" junto al headline o como título del bloque timeline.
3. [paywall.html líneas 182-190] Tres mensajes de confianza consecutivos y parcialmente redundantes ("Hoy no pagas nada · Sin tarjeta" / "Compromiso del Primer Pase" / "Tus datos son privados...") saturan el cierre de la pantalla y diluyen cuál es el mensaje más importante (heurística 8, estético y minimalista) → Fix: fusionar reversibilidad + garantía en un solo bloque jerarquizado (título + 1 línea) y dejar la nota de privacidad aparte.
4. [paywall.html líneas 81-105 y 247-256] Las tarjetas de plan (`.pw-plan`) solo cambian color/check al elegirlas — no tienen ningún `:active`/feedback de "hundimiento" que confirme el toque en el instante del clic, a diferencia del CTA que sí responde (craft eje movimiento) → Fix: agregar `transform: scale(0.98)` en `:active` a `.pw-plan` para igualar el estándar de feedback táctil de toda pieza tocable.
5. [FICHA-ARTE.md líneas 30-32, reflejado en paywall.html CSS `.pw-boton`/`.pw-plan`] El mecanismo visual completo (bordes gruesos negros + botón "presionable" con border-bottom + tipografía chunky + bloques de color funcional) replica casi en su totalidad la gramática visual de Duolingo más allá del hue ya rotado — documentado y aprobado por el usuario, pero sigue leyéndose como clon de mecánica de una app con marca propia (craft eje identidad) → No corregible sin reabrir la ficha (cosa juzgada); se deja constancia para decisión del usuario, no se fuerza el cambio.
