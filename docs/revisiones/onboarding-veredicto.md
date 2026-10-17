# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-375-b.png, onboarding-375-c.png)
Usabilidad: 28/40
Craft: 10/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [.onb-stage, los 3 screenshots] El "efecto de pozo" (inset shadow agregado en esta ronda) es imperceptible en el render — no hay ninguna superficie elevada/hundida visible; sigue siendo un fill plano con radiales casi invisibles → dar a .onb-stage un color de superficie propio distinto del body (no el mismo #fffaf0) para que la sombra tenga contra qué contrastar, o reemplazar el enfoque por una textura/patrón de fondo real.
2. [Pasos 1 y 4, pregunta+chips] Vacío muerto estructural: la pregunta y los 3-4 chips ocupan ~35% del alto de pantalla; el otro 65% (arriba y abajo) no tiene ningún elemento visual — ni ilustración, ni ícono, ni bloque de color → anclar un elemento visual propio a cada pregunta (ilustración/ícono temático, no solo texto+chips) para llenar el espacio, no otro ajuste de sombra.
3. [Identidad visual, toda la app] FICHA-ARTE promete bloques "grandes, llamativos y coloridos" estilo Duolingo (amarillo+verde+azul+rojo); el onboarding renderizado solo muestra amarillo (chip seleccionado) y verde (botón) sobre blanco con borde negro — se lee como formulario neo-brutalista monocromo, no como el kit multicolor aprobado en el tour → usar azul/rojo en al menos un elemento real de cada paso (p. ej. ícono del paso activo, fondo del bloque de reconocimiento).
4. [Header, botón de salir] La única forma de cancelar es tocar el logo; no hay ícono "X" ni texto "Salir" visibles — un usuario no lo descubre sin tantear, aunque el modal de confirmación sí existe en el código → agregar un botón "X" explícito junto al logo que abra el mismo modal.
5. [Paso 2, "¿Cuál es tu reto más urgente hoy?"] 5 chips de igual peso visual (gate de carga cognitiva pide ≤4 opciones por decisión); "Otra cosa" compite visualmente con los 4 dolores reales → bajar "Otra cosa" a un link de texto secundario debajo de los 4 chips en vez de un 5º chip idéntico.
