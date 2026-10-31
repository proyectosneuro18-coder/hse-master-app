# VEREDICTO revisor-visual — panel
Fecha: 2026-10-31 00:00
Screenshot: docs/revisiones/panel-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Toast "Deshacer", onClick] Dispara `toast.deshacer()` sin `await`/`try-catch` y oculta el toast al instante — si el PATCH de reversión falla, el usuario no se entera y cree que deshizo el cambio → await + captura de error + toast de fallo si la reversión no se completa.
2. [Tarjetas de cuadrilla] No existe forma de eliminar/archivar una cuadrilla creada por error (solo renombrar); los trabajadores sí se pueden desactivar pero las cuadrillas no → agregar "Archivar cuadrilla" (soft-delete) para cuadrillas vacías o sin uso.
3. [Fondo de toda la pantalla — Eje 2 Profundidad] El degradado radial de base es casi imperceptible a 375px (se lee plano) y no hay ningún elemento "hundido" real (inputs, tracks) — solo base y elevado → oscurecer/ampliar el degradé de fondo y dar a inputs/selects un tratamiento visualmente hundido (sombra interior sutil).
4. [Toast, código] El `motion.div` del toast usa `exit={...}` sin estar envuelto en `<AnimatePresence>`, así que la animación de salida nunca corre (desaparece de golpe, no se desliza) → envolver `{toast && <motion.div>}` en `<AnimatePresence>`.
5. [Modal "Agregar trabajador" / flujo general — h7 Flexibilidad] Cero atajos para el usuario repetitivo (agregar varios trabajadores seguidos sin cerrar y reabrir el modal, Enter para confirmar) → agregar botón "Guardar y agregar otro" tras el éxito.
