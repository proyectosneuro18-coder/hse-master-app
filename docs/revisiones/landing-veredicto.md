# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 12/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sticky-CTA + botón "volver arriba", mobile ≤760px] El fix de tap-target de 44px en `.sticky-nav a` subió la altura real de `#stickyCta` de ~90px a ~114-148px (con safe-area), pero `.subir-arriba` sigue fijo en `bottom:90px` con z-index:55 (< 60 de la barra) → cuando la barra está visible, entre ~24px y el 100% del botón circular queda tapado detrás del panel opaco de la barra. Fix: recalcular el `bottom` del botón con la altura real medida de `#stickyCta` (CSS var actualizada por JS) o subir su z-index por encima del 60.
2. [Fix de texto ≥14px, incompleto — todo el CSS] Se subieron 2 textos a 14px (`.prueba-industria`, `.stack .item p`) pero quedan al menos 3 oraciones completas más por debajo del mínimo: `.nota-iogp` (13px, bajo los 3 pasos), `.trial-strip` (13px, bajo los planes de precio) y `.mailto-status` (12px, feedback dinámico al hacer clic en "Quiero el plan..."). Fix: auditar TODO el archivo por `font-size` <14px en párrafos de oración completa, no solo los 2 reportados esta ronda.
3. [Botón "volver arriba", transición de `.sin-sticky`] `bottom` no está en la lista de `transition` del botón (solo opacity/transform/visibility) → al cerrar la barra o llegar al footer el botón salta de golpe (66px) sin animar, mientras la barra desliza suave en 250ms. Fix: agregar `bottom 200ms ease` a la transición de `.subir-arriba`.
4. [Sección Oferta, botones de plan] El copy promete "prueba gratis, sin tarjeta" en tono de autoservicio instantáneo, pero el clic abre un `mailto:` a ventas (hay que escribir y esperar respuesta humana) — desalineación de expectativa. Fix: mientras no haya checkout real, el texto del botón debería decir algo explícito como "Escríbenos para activar tu prueba".
5. [Copy — especificidad y prueba, toda la landing] Ningún claim grande tiene respaldo externo verificable (cero testimonio, demo o caso real; solo la cita a la norma IOGP) — es el eje más débil del copy (2/4). Fix: sumar al menos 1 prueba social real (aunque sea cualitativa, de un piloto) antes de escalar tráfico pago.
