# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 37/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Paso 1, debajo de los 3 chips "cuadrilla"] Queda ~230px de vacío muerto (≈30% del alto de pantalla) sin contenido ni textura perceptible hasta el fondo — onboarding.html líneas 57-59 (`.onb-paso{justify-content:flex-start}`) + solo 3 chips de 60px en el grupo (líneas 211-221); el degradé radial de fondo (líneas 28-31, mezcla 12-20%) es demasiado sutil para rescatar la zona en el screenshot real → fix: agregar un elemento ownable (ilustración/micro-dato/mascota) que llene esa zona cuando el paso tiene menos de 4 opciones, sin tocar el anclaje superior compartido con los demás pasos.
2. [Código — reduced motion] `animarChipsDelPaso()` (onboarding.html líneas 373-386) revela los chips con `setTimeout` escalonado sin comprobar `sinMovimiento`; un usuario con `prefers-reduced-motion` igual ve los chips aparecer uno por uno en secuencia (solo sin la transición suave) → fix: si `sinMovimiento` es true, añadir la clase `in` a todos los chips de una vez, sin el `setTimeout` escalonado.
3. [Craft — profundidad, paso 1] Fuera del header y la sombra de las chips, la mitad inferior de la pantalla cae plana — no se perciben los 3 niveles base/elevada/hundida que pide el eje 2 de craft → fix: subir el alcance/opacidad del degradé radial existente (líneas 28-31) o introducir una superficie hundida sutil detrás del grupo de chips.
4. [Header, paso 1] El botón "atrás" oculto (`visibility:hidden`, línea 48) reserva ~68px de espacio invisible entre el logo y la barra de progreso, generando un hueco asimétrico notorio en el primer paso, donde el botón nunca puede aparecer → fix: en el paso 1, dejar que la barra de progreso ocupe ese espacio en vez de reservarlo vacío.
5. [Craft — identidad ownable] Ninguna de las 3 capturas muestra el dispositivo ownable documentado en FICHA-ARTE.md (línea 40, bloque-héroe de racha) ni otro detalle gráfico firmado más allá de bordes gruesos + Baloo 2 → fix: sumar un micro-detalle gráfico propio (ej. patrón de puntos del logo, silueta de casco) en el header o el fondo de las preguntas para anclar identidad incluso en pantallas sueltas de onboarding.
