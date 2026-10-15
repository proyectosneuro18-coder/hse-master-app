# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Hero y toda la pantalla — botones .boton-verde, ej. "PROBAR GRATIS 14 DÍAS"] Texto blanco sobre fondo #46A302 mide ≈3.2:1 (falla AA 4.5:1 para texto normal de 15px; no califica como "texto grande") → oscurecer el verde de fondo o usar texto en --ink hasta alcanzar ≥4.5:1.
2. [CSS global — .boton-verde/.boton-amarillo] El border-bottom "presionable" usa colores inventados (#357c02, #b17e00) que no existen en las variables :root de la ficha de arte, en vez de --verde/--verde-sombra y --amarillo/--amarillo-sombra ya definidas → reemplazar por las variables del brand kit aprobado.
3. [Header, esquina superior derecha, visible en todo scroll] El enlace "Entrar" y el logo apuntan a href="#" sin ninguna acción real — parecen interactivos y no hacen nada → quitarlo hasta tener login real o deshabilitarlo visualmente.
4. [Hero — mockup de teléfono bajo el bloque "Racha de seguridad"] El marco de 260×520px queda más de la mitad vacío (solo el bloque de racha ocupa la parte superior), dejando un panel muerto en el above-the-fold de 375px → acortar el mockup o rellenar el espacio con el chip "Pase vigente hoy" reubicado dentro del marco.
5. [Radios de borde en toda la pantalla: .mini-chip 12px, .faq-item 16px, .pregunta-card/.ad-card 18px, .bloque/.paso/.plan 20px] La ficha pide radio consistente por tipo de componente (20 cards/16 botones/14 chips) pero el código usa al menos 4 valores distintos → unificar a los 3 radios documentados.
