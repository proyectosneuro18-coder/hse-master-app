# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 11:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 34/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [onboarding.html línea 258-468, `<p id="onbRetoHint">` en el paso 2] El mensaje de error "Escribe tu reto antes de continuar." no tiene `role="alert"` ni `aria-live`, así que un lector de pantalla no lo anuncia cuando aparece (la app sí usa `aria-live="polite"` en el contador de pasos y en el loading, pero no aquí) → agregar `role="alert"` (o `aria-live="assertive"`) al elemento `#onbRetoHint`.
2. [onboarding.html líneas 318-327 (HTML) y 532-544 (JS), modal de confirmación de salida] El `.onb-modal` no tiene `role="dialog"`/`aria-modal="true"`, no mueve el foco al abrirse (queda en el botón que disparó el modal) ni lo devuelve al cerrarse, y no hay listener de `Escape` para cerrarlo con teclado → añadir los atributos ARIA, foco inicial en "Seguir aquí", retorno de foco al disparador, y `keydown` de Escape equivalente a "Seguir aquí".
3. [onboarding.html líneas 606-614, restauración de `sessionStorage`] Solo se restaura el progreso guardado si las TRES respuestas (cuadrilla, reto, horario) están completas (`if (guardado.cuadrilla && guardado.reto && guardado.horario)`); si el usuario cerró a mitad de camino con solo 1 o 2 respondidas, esos datos quedan guardados pero se ignoran por completo y debe responder todo de nuevo desde el paso 1 → restaurar también el progreso parcial, marcar los chips ya elegidos y aterrizar en el primer paso sin responder (heurística 6, "reconocer y no recordar" — hoy el sistema le pide al usuario recordar y repetir lo que ya había dicho).
4. [onboarding.html línea 230, `.onb-nota-cuadrilla { text-align: center }` en el paso 1] La nota "Puedes sumar más cuadrillas más adelante…" queda centrada mientras el encabezado, los 3 chips y (en el paso 2) el link "Es otra cosa" están alineados a la izquierda en toda la pantalla → alinear el texto a la izquierda para que el bloque completo comparta un solo eje.
5. [Heurística 7, flexibilidad — todo el archivo] Más allá de las flechas de teclado en el radiogroup y Enter en el input de texto libre, no hay ningún atajo para el usuario que repite el flujo (ej. un supervisor que da de alta varias cuadrillas seguidas no puede reutilizar ni pre-cargar los valores de la cuadrilla anterior) → evaluar un acceso directo tipo "usar los mismos datos de la última cuadrilla" cuando se detecta una sesión repetida.
