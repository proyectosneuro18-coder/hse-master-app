# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Carrusel "La app por dentro", controles de puntos] los dots de paginación miden 10px (22px el activo) sin área de toque adicional — muy por debajo del mínimo táctil de 44px, riesgo real de mis-tap en celular → agregar un hit-area invisible de ≥44x44px a `.dots button` sin tocar el tamaño visual.
2. [Hero "phone-mini" y carrusel "La app por dentro", contenido de los mockups] el texto decorativo dentro de los teléfonos (nombres de ranking, "RETO DEL DÍA", opciones de respuesta, etc.) no tiene `aria-hidden="true"` — un lector de pantalla lo narra como información real de la página, confundiendo a quien navega sin mouse → envolver `.phone-mini .scr` y `.frame .in` en `aria-hidden="true"`.
3. [FAQ "Preguntas antes de empezar", grupo "Sobre tu decisión de compra"] no hay ninguna pregunta sobre dónde se alojan los datos de la cuadrilla ni quién puede verlos — un Gerente de HSE que responde ante auditorías vive justo esa preocupación y hoy no tiene respuesta → sumar una pregunta tipo "¿Dónde quedan los datos de mi cuadrilla y quién puede verlos?".
4. [Sección "La app por dentro" (subtítulo bajo el badge VISTA PREVIA) y slide "Pase Digital" ("Cuadrilla Pozo 7 · Vigente hoy")] quedaron 2 párrafos en `font-weight:600` mientras el resto del texto secundario ya bajó a 400 en la ronda anterior — rompe la consistencia de jerarquía recién lograda → bajar esos 2 estilos inline a `font-weight:400`.
5. [FICHA-ARTE.md, tabla "Acentos de apoyo" — línea del rojo] la ficha sigue listando el badge "Para Gerentes de HSE" como ejemplo de uso del rojo/alerta, pero el código ya lo cambió a ink neutro (corrección aprobada en la ronda 45) — la ficha, que es cosa juzgada, quedó desactualizada frente a la pantalla real → editar esa línea de FICHA-ARTE.md para retirar ese ejemplo y dejar constancia del cambio aprobado.
