# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 32/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Paso 1 y Paso 4, tercio inferior de la pantalla] Debajo de la nota "Puedes sumar más cuadrillas..." queda un bloque de fondo vacío con solo el hardhat al 8% de opacidad (onboarding.html líneas 60-64 `.onb-paso{justify-content:flex-start}` + 86-88 `.onb-marca-agua{opacity:.08}` + marcado en línea 230) — se percibe como espacio muerto, no como aire intencional, porque la marca de agua es casi invisible y no hay ningún otro elemento que lo ancle. Fix: subir la opacidad del hardhat a ~0.12-0.15 o agregar un segundo elemento decorativo (línea/chip contextual) que ocupe ese tercio, o reducir el padding-bottom del `.onb-paso` para que el bloque de opciones quede más cerca del borde inferior.
2. [Paso 1/2/4, microcopy gris dentro del encabezado de color] El texto `.onb-micro` (línea 82, `color: var(--ink-2)` = #6b6b6b, línea 18) sobre los fondos `.onb-encabezado.azul`/`.rojo` (líneas 72-73, color-mix 16%) mide ~4.37-4.44:1 de contraste — por debajo del mínimo AA 4.5:1 para texto normal de 14px. Fix: oscurecer a ~#565656 o crear un token `--ink-2-on-tint` solo para este microcopy sobre fondos de color.
3. [Header, barra de progreso — verificado en código, no visible en captura] `.onb-progress`/`.onb-progress-fill`/`.onb-pct` (líneas 52-54) son `div` planos sin `role="progressbar"` ni `aria-valuenow/min/max`, y `irAPaso()` (líneas 351-380) nunca mueve el foco ni anuncia el cambio de paso a un lector de pantalla — el único feedback de "vas en el paso X de 5" es visual. Fix: agregar `role="progressbar" aria-valuenow aria-valuemin="0" aria-valuemax="100"` a `.onb-progress` y un `aria-live="polite"` oculto que anuncie "Paso X de 5" al llamar `irAPaso`.
4. [Paso 1, jerarquía tipográfica] En una sola pantalla conviven 4 tamaños de fuente distintos: 28/30px (línea 80-81, pregunta), 16px (línea 92, texto de los chips), 14px (línea 82, microcopy) y 13px (línea 85, nota) — por encima del máximo de 3 tamaños por pantalla que exige una jerarquía nítida. Fix: unificar microcopy y nota en el mismo tamaño (13px o 14px, uno solo) para dejar exactamente 3 niveles.
5. [Chips de selección, círculo de check sin seleccionar] `.onb-chip .check` (línea 100) usa `border: 2px solid var(--ink)`, mientras que FICHA-ARTE.md línea 30 fija "2.5-3px sólido... en TODOS los bloques y botones" como la firma del estilo "comic/juego de mesa" — el círculo de radio queda con un trazo visiblemente más fino que el resto del kit (tarjetas, botones, íconos, todos en 3px). Fix: subir el borde del `.check` a 3px para igualar la firma visual.
