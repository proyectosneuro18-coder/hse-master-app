# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 34/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Tarjeta "Anual" elegida, franja diagonal del borde izquierdo — paywall.html líneas 91-93, `.pw-plan.elegido::after` con `repeating-linear-gradient(135deg, var(--ink) 0 6px, var(--amarillo-sombra) 6px 12px)`] La franja negro/dorado diagonal reproduce el patrón universal de cinta de peligro/precaución — exactamente el código visual que un gerente de HSE está entrenado a leer como "riesgo/advertencia", no como "elegido/recomendado". En la pantalla donde se vende el plan Anual (el que la app quiere que elija), usar ese patrón es contraintuitivo para este avatar específico → fix: cambiar a una barra sólida de acento o a un ribbon "Recomendado" sin rayado tipo cinta de peligro.
2. [Botón CTA "Crear mi acceso y activar la prueba" — paywall.html líneas 270-278, handler de `pwActivar`] El clic dispara `window.location.href = 'login.html'` sin deshabilitar el botón ni mostrar ningún estado intermedio (spinner/texto "Activando…"); si la navegación tarda, el usuario no tiene confirmación de que su toque se registró y puede tocar varias veces → fix: deshabilitar el botón y mostrar un estado de carga inmediato al click, antes de navegar.
3. [Subtítulo emocional vs. títulos del timeline — paywall.html línea 50 `.pw-emocion` (14px/700) y línea 71 `.pw-linea .titulo` (14px/800)] Ambos bloques comparten casi el mismo tamaño y peso tipográfico, aplanando el escalón entre el nivel "subtítulo" (que debería pesar más) y el nivel "cuerpo/ítem de lista" — al entrecerrar los ojos no se distingue cuál es más importante → fix: bajar `.pw-linea .titulo` a 13px/700 o subir `.pw-emocion` a 15-16px para marcar jerarquía clara.
4. [Bloque de precios, panel completo visible sin scroll] Conviven simultáneamente 5 acentos de color (amarillo del plan elegido, rojo del badge "2 MESES GRATIS", verde del botón CTA, degradé azul/amarillo del hairline superior, y la franja negro-dorado del plan elegido) — es la paleta de marca aprobada, pero la densidad de acentos en una sola vista compite por la atención del usuario y diluye cuál es la acción principal → fix: quitar la franja diagonal de la tarjeta elegida y dejar que el fondo amarillo liso sea suficiente señal de selección.
5. [Mensaje de error — paywall.html línea 192, `#pwError`] "Algo falló al continuar — inténtalo de nuevo o recarga la página" es el único manejo de error de la pantalla; cumple qué-pasó+qué-hacer en lenguaje simple pero la única acción que ofrece es "recargar la página completa" en vez de un botón de reintento inline → fix: agregar un botón "Reintentar" dentro del propio mensaje en lugar de pedir recargar toda la página.
