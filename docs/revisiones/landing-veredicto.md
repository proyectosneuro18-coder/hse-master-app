# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Hero, .phone-stage] El mockup de 220px de ancho acumula racha+2 mini-chips+botón falso+2 float-chip (a/b)+etiqueta "Vista previa" = 7+ elementos flotantes de peso visual similar compitiendo en poco espacio → recortar a máximo 1 float-chip y mover el resto de señales de confianza a la fila de prueba estática que ya existe debajo del CTA.
2. [CSS .phone-mini vs .slide .frame, landing.html líneas ~95 y ~180] El mismo componente "marco de teléfono" usa border 8px/radius 32px en el hero y border 9px/radius 34px en el carrusel → igualar ambos valores exactos (mismo border-width y radius en los dos sitios).
3. [Hero vs sección "La app por dentro"] La etiqueta "Vista previa" se posiciona distinto en cada lugar: en el hero cuelga fuera del marco en la esquina inferior-izquierda (.vista-previa-tag, bottom:-14px/left:-4px); en el carrusel aparece centrada y superpuesta dentro del marco (.frame::after, bottom:10px, centrada) → usar un único patrón de posición para el mismo componente en toda la pantalla.
4. [Sección Oferta, .plan.rec vs plan mensual] Desde que el botón del plan mensual comparte el mecanismo .boton (border-bottom 6px + press), los dos CTA de planes quedan con peso visual casi idéntico (mismo ancho completo, mismo efecto 3D), diluyendo cuál es la acción recomendada pese al fondo amarillo y el badge "2 MESES GRATIS" del anual → bajar deliberadamente el peso del botón mensual (quitar o reducir el border-bottom de prensado, o agregar un micro-texto "ahorra con el plan anual ↑" junto a él).
5. [Identidad visual global] Más allá del rotado de hue ya documentado, el único dispositivo "industrial" visible es la franja de 6px de rayas de peligro bajo el header — el resto de la pantalla (cards redondeadas, botones "gorditos", mecánica de prensado) sigue leyéndose como plantilla genérica de app de hábitos tipo Duolingo → llevar el tratamiento de rayas de peligro a al menos una segunda superficie visible (ej. esquina del marco del teléfono del hero o un separador entre secciones) para que la firma de seguridad industrial se note sin entrecerrar los ojos.
