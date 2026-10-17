# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 12:00
Screenshot: docs/revisiones/onboarding-375.png, docs/revisiones/onboarding-375-b.png, docs/revisiones/onboarding-375-c.png
Usabilidad: 32/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Eje 2 Profundidad — toda la pantalla, pasos 1/2/4] El lenguaje visual es "flat + borde negro 3px" (chips con sombra casi imperceptible: `0 4px 0 -1px` + blur de 6px al 6% de opacidad, línea 74 de onboarding.html). No hay superficie elevada real ni hundida más allá del botón "presionable". Este es el TECHO ESTRUCTURAL del eje, no un detalle cosmético: mientras la identidad "Casco de Oro" exija bordes gruesos sin blur (firma aprobada en FICHA-ARTE.md), ninguna sombra adicional en chips/cards va a subir este eje sin romper esa firma — la única vía es un fondo ligeramente hundido detrás de grupos de chips o un panel elevado puntual, no más sombra en los mismos elementos.
2. [Eje 3 Identidad — onboarding completo] El sistema de interacción (botón con border-bottom sólido que se hunde al tocar, chip con check circular, radios "gorditos", fuente chunky Baloo 2) es el mismo mecanismo íntegro de Duolingo con el hue rotado — reconocible de inmediato por cualquiera que conozca esa app. El único elemento ownable propio de HSE en estas 3 pantallas es el ícono de escudo del paso de reconocimiento; no alcanza para que el kit deje de ser intercambiable (test de eje 3: "¿el kit podría cambiarse por el de otra app sin que se note?" → aquí, sí se nota, pero hacia Duolingo, no hacia un genérico de IA).
3. [Botón "Continuar" del input "Otra cosa", paso 2, línea 211 del código] Nace `disabled` — viola literalmente la ANCLA #3 del CTA vivo ("NUNCA disabled por defecto... valida al click con hint, nada de pill muerto esperando el form perfecto"). El fix de esta ronda (opacidad 0.4→0.65, línea 102) corrigió el síntoma visual pero no la regla de fondo: el botón debería nacer habilitado y mostrar un hint ("escribe tu reto para continuar") al hacer click vacío, no quedarse gris hasta que el campo tenga texto.
4. [Accesibilidad de teclado — `role="radiogroup"`/`role="radio"`, líneas 347-351 del código] Se declara el rol ARIA de radiogroup pero no se implementa la navegación por flechas entre radios que ese rol promete a lectores de pantalla y usuarios de teclado — cada chip solo se alcanza con Tab individual. El rol declarado miente sobre el comportamiento real.
5. [Paso 2 — "¿Cuál es tu reto más urgente hoy?"] 5 opciones (4 chips + "Otra cosa") superan el límite de 4 que fija el gate de carga cognitiva para una sola decisión — el resto del flujo (pasos 1 y 4) usa 3-4 opciones; este paso es visiblemente más denso que sus vecinos.

Lo que sí quedó verificado y resuelto en esta ronda (no repetir como hallazgo):
- Padding simétrico del `.onb-paso` confirmado en código (`24px 16px` en los 4 lados) y visualmente los huecos sobre la pregunta y bajo los chips se ven iguales en el paso 1.
- Modal de salida con transición opacity+scale de 200ms (ya no es un corte display:none↔flex).
- El número del anillo de carga cuenta progresivamente entre metas (rAF tick de 500ms), no salta.
- La pregunta a 28-30px está correctamente trazada al archivo 50 (A2) y documentada en FICHA-ARTE como excepción razonada — no es un desvío.
- El copy traza limpio a FICHA-AVATAR.md: "cuadrilla", "charla", "Pase de los 3 Minutos", los 4 retos (firman/certificados/no-se-quien/auditoría) mapean 1 a 1 con los dolores y el ángulo del hero documentados en la ficha.
