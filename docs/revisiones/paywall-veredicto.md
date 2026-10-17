# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [paywall.html línea 127] El botón "volver" (chevron) apunta siempre a `href="onboarding.html"` sin leer ni pasar en qué paso se quedó el usuario, pese a que la propia pantalla SÍ sabe leer `sessionStorage.hseOnboarding` (línea 204) — riesgo real de que "volver" reinicie todo el recorrido de bienvenida en vez de regresar un paso → fix: usar `history.back()` o, si onboarding.html soporta reanudar, pasar el último paso guardado en la URL/sessionStorage.
2. [paywall.html líneas 93, 166, 175, 219-220] Los números héroe de precio (`US$6.67`, `US$8`) y los totales calculados dinámicamente (`pwAnualTotal`/`pwMensualTotal`) se insertan con `textContent` estático, sin el conteo animado de 0 al valor final que exige la baseline de movimiento del sistema (DESIGN-CORE) → fix: animar estos valores con un count-up de ~500-600ms al revelarse el panel, respetando `prefers-reduced-motion` (ya detectado en línea 195).
3. [paywall.html líneas 50, 69, 92, 95, 110, 113, 118] Siete piezas de texto con roles distintos (subtexto emocional, título de cada ítem del timeline, nombre de plan, nota de plan, label del CTA, texto de reversibilidad, línea de confianza) comparten el mismo `font-size: 14px` y solo se diferencian por peso/color — contradice la regla propia del sistema "jerarquía por TAMAÑO, no por peso" y aplana el nivel "cuerpo" de la pantalla → fix: bajar notas secundarias (reversibilidad, nota de plan, trust) a 12-13px para recuperar un escalón de tamaño distinto.
4. [paywall.html líneas 138, 144, 150] El primer nodo del timeline ("Hoy") lleva un ícono rico de casco dentro de un círculo de 24px, mientras los nodos "Día 12" y "Día 14" son círculos vacíos de 14px sin ícono — el mismo componente (nodo de línea de tiempo) cambia de tratamiento visual entre sus 3 estados sin un sistema de iconografía coherente → fix: dar a los 3 nodos el mismo lenguaje (ej. ícono outline en gris para los futuros) en vez de pasar de ícono a punto vacío.
5. [paywall.html líneas 204-221] Si `sessionStorage.hseOnboarding` no existe o la clave `cuadrilla` no calza exactamente con los dos mapas (`ETIQUETAS_CUADRILLA`/`PERSONAS_ESTIMADAS`), la personalización se pierde en silencio: el titular cae a "tu cuadrilla" genérico y las líneas `≈ US$.../mes en total para tus N trabajadores` quedan vacías (ocultas por `.total:empty`) sin aviso — el usuario pierde el dato más persuasivo del paywall (el costo real para SU equipo) sin saber por qué → fix: agregar un fallback con un número de equipo por defecto razonable en vez de omitir la línea completa.
