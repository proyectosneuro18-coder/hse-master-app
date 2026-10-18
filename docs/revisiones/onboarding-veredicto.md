# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 38/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Top defectos:
1. [Craft eje 3 — identidad, toda la pantalla] Bordes gruesos de 3px en negro, botones "presionables" con border-bottom y la paleta amarillo/verde/azul/rojo sobre fondo claro se leen de inmediato como el lenguaje visual de Duolingo (la propia FICHA-ARTE documenta que la paleta y la mecánica del botón se tomaron de ahí, con rotación de hue como única diferenciación) — el kit sigue siendo intercambiable con un clon de esa app → sumar al menos 1 dispositivo gráfico exclusivo de HSE Master App visible en ESTA pantalla (no solo reservado para la pantalla principal/racha), ej. un motivo de casco o QR recurrente en los íconos de encabezado.
2. [onboarding.html línea 131, `.onb-reco .ic`] El ícono circular del paso 3 (reconocimiento) usa `border-radius: 22px` sobre una caja de 72px — no pertenece a ninguna de las familias de radio de la ficha (20px cards / 16px botones+chips / 8px badge) ni está documentado como excepción → bajarlo a 20px para que coincida con la familia "cards" y el radio se sienta idéntico en toda la pantalla.
3. [onboarding.html línea 215, ícono del encabezado del paso 1] El ícono de 3 círculos conectados (tipo "red/compartir") no comunica "cuadrilla de trabajadores" — un usuario no lo asocia de un vistazo con el tema de la pregunta, a diferencia de los íconos de los pasos 2 (alerta) y 4 (reloj) que sí mapean bien a su pregunta → reemplazar por un ícono de personas/grupo (ej. Lucide "users").
4. [Heurística 7, flexibilidad — código completo] El único atajo es navegar el radiogroup con flechas y Enter para confirmar el texto libre; no existe forma de reutilizar los datos de una cuadrilla ya configurada para un supervisor que repite el flujo con una segunda cuadrilla → agregar un acceso opcional "usar los mismos datos de tu última cuadrilla" cuando se detecta progreso previo en `sessionStorage`.
5. [onboarding.html línea 333, `const PROGRESO`] El salto de 8% (paso 1) a 32% (paso 2) es desproporcionadamente chico frente a los saltos posteriores (~22-26pp cada uno) — da la sensación de que responder la primera pregunta "no avanzó nada" → redistribuir a tramos más parejos, ej. 10/32/56/80/100.
