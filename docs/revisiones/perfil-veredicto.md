# VEREDICTO revisor-visual — perfil
Fecha: 2026-10-23 00:00
Screenshot: docs/revisiones/perfil-375.png
Usabilidad: 34/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [craft eje2 profundidad, pantalla completa] Sigue sin existir ninguna superficie "hundida" (inset) en toda la pantalla — solo 2 niveles reales (base con gradiente sutil en `body` + superficies elevadas con doble sombra en `.pf-chip`/`.pf-pase`/`.ap-boton`). Ni el bloque QR, ni la lista de competencias, ni el skeleton tienen tratamiento inset. → Fix: dar a la lista de competencias o al bloque QR un `box-shadow: inset` sutil para introducir el tercer nivel que exige el eje.
2. [craft eje4 movimiento, navegación entre pestañas] Sigue sin haber transición al navegar entre "Hoy" y "Perfil" — la navegación usa `<a href="app-principal.html">` (línea 214/302) sin ningún fade de salida, es una recarga de página sin animación. Falta la baseline obligatoria "transición de tabs" de DESIGN-CORE. → Fix: si el stack sigue siendo multipágina estática, animar al menos la salida con un fade corto (150-200ms) antes de navegar.
3. [usabilidad h7 flexibilidad, toda la pantalla] Fuera del Escape para cerrar el pase en pantalla completa (línea 445-447), sigue sin haber ningún atajo ni default pensado para el usuario frecuente (acceso directo al pase sin desplazarse, deep-link que lo abra automáticamente). → Fix: si el usuario llega desde un enlace "mostrar pase", abrir el pase en pantalla completa automáticamente, sin afectar al usuario novato que entra por el tab normal.
4. [craft eje5/usabilidad h4, perfil.html líneas 136-137 `.pf-pronto` vs líneas 174-177 `.ap-tab.proximo .pronto`] El badge "Pronto" ahora SÍ es visible en ambos lugares (mejora real vs ronda 2), pero son dos implementaciones distintas del mismo componente: el del tab bar usa `font-size: 7px`, `padding: 2px 4px`, `border-radius: 5px` y posición absoluta sobre el ícono; el de las filas de Ajustes usa `font-size: 9px`, `padding: 3px 7px`, `border-radius: 6px`, en flujo normal junto al texto. Mismo badge, especificaciones distintas — un ojo entrenado lo nota al comparar ambos de cerca. → Fix: unificar a una sola clase `.badge-pronto` con las mismas medidas, reutilizada en tab bar y filas de Ajustes.
5. [usabilidad h3 control y libertad, `apSalirHeader`/`apSalirFila` línea 420-426] "Cerrar sesión" no pide confirmación — un solo tap dispara el spinner y redirige a login en 450ms. Para un dispositivo de trabajo de campo que puede compartirse entre turnos, un tap accidental saca al técnico sin aviso. → Fix: agregar una confirmación breve (modal o "toca de nuevo para confirmar") antes de cerrar sesión.

Progreso verificado vs ronda 2 (los 2 cambios declarados SÍ están en código):
- `.pf-fila.proximo` ahora lleva badge visible `.pf-pronto` ("Pronto") en Notificaciones y Ayuda y soporte (líneas 276, 281) — ya no depende solo de opacidad + `sr-only` invisible. Resuelve el defecto de visibilidad de la ronda 2, aunque introduce la inconsistencia de implementación descrita en el defecto 4 de arriba.
- `.pf-pase` bajó de 20px a 18px (línea 87) y ahora calza exactamente con `.pf-avatar` (18px, línea 72) y `.pf-chip` (18px, línea 80) — las tres piezas de la familia "cards >60px" comparten un solo radio. Defecto de encaje óptico de la ronda 2 resuelto.

Gate doble (≥36/40 usabilidad Y ≥16/20 craft): no se cumple ninguno de los dos umbrales — la pantalla mejoró en craft (14→15) por el ajuste de radios, pero usabilidad se mantiene en 34/40 porque la nueva inconsistencia del badge compensó la mejora de visibilidad, y los defectos de profundidad, movimiento y flexibilidad siguen intactos. Sigue NO LISTA.
