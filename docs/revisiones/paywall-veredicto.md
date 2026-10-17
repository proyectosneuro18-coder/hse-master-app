# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 16:10
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Fondo de la pantalla, desde "SI DECIDES SEGUIR..." hacia abajo] El único gesto de profundidad es el gradiente radial sutil pegado al header; las tarjetas de plan, el CTA y la línea de confianza viven sobre el fill plano `--bg` con solo borde (sin sombra, sin tinte) → extender el tinte radial hacia la mitad inferior o dar a las tarjetas una sombra/elevación real para que la pantalla completa, no solo el primer tercio, tenga los 3 niveles de profundidad.
2. [Línea de reversibilidad bajo el CTA, línea 165 de paywall.html] El fix añadió el plazo pero con un alcance que no coincide con la definición real: en landing.html (líneas 667-668) el "Compromiso del Primer Pase" es ayuda personal SI la cuadrilla no completa su primer Pase el día 1 — no es una cobertura "hasta el día 14". Tal como quedó escrito ("Respaldado por el Compromiso del Primer Pase hasta el día 14") suena a que el compromiso protege todo el periodo de prueba, lo cual no es cierto → reescribir alineado al alcance real, ej. "Hoy no pagas nada · Sin tarjeta · Si tu cuadrilla no completa su primer Pase, te ayudamos sin costo".
3. [Timeline, nodos "Día 12" y "Día 14" + línea de confianza final] La agitación emocional (★ dolor visceral) solo vive en las 2 líneas de arriba y, ahora, en el ítem "Hoy" del timeline (que en realidad describe mecanismo, no emoción) — el resto de la pantalla (Día 12, Día 14, precios, CTA, confianza) sigue siendo puro dato administrativo, sin anclar ni al miedo a la auditoría ni a la identidad de "líder que modernizó" de FICHA-AVATAR.md → anclar al menos el nodo "Día 14" o la línea de confianza final a esa identidad.
4. [Badge "2 MESES GRATIS", línea 78-79 de paywall.html] El radio bajó a 8px y ya no rinde como píldora (correcto, confirmado con la altura real de la caja ~27px), pero introduce una tercera familia de radio no declarada en FICHA-ARTE (que fija 14px para chips y 16/20px para botones/cards) → documentar la excepción en la ficha o mover el badge a un radio de la familia existente.
5. [Ícono de candado, línea de confianza final bajo el footer] Con el texto envuelto en 2 líneas a 375px, el ícono queda centrado respecto al bloque completo en vez de alinearse con la primera línea de texto, por lo que se ve ligeramente descentrado hacia abajo → usar `align-items: flex-start` con un ajuste de margen, o fijar la posición del ícono respecto al cap-height de la primera línea.
