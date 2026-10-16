# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Carrusel "Así se ve por dentro" (slides "Permiso de trabajo/Aislamiento de energía" y "¿Cuántos trabajadores tiene tu cuadrilla?"): los controles dentro de los frames del teléfono conservan el lenguaje exacto de UI seleccionable real (nodo de ruta activo, opción resaltada en amarillo) y la única pista de que son ilustrativos es el párrafo de texto ANTES del carrusel — no hay ninguna marca dentro de cada frame en el momento en que el usuario realmente los mira al deslizar → poner una etiqueta "Vista previa" (como la del hero) dentro de cada slide, no solo en el párrafo introductorio.
2. `.carrusel-hint` ("Desliza o toca las flechas...") es 11px gris, el texto más chico de toda la pantalla, compitiendo con labels de 11-13px que son decorativos — fácil de pasar por alto como única instrucción de navegación → subirla a 12.5-13px o sumar un ícono de deslizar junto al texto.
3. Botón "Quiero el plan mensual" (`.link-secundario`) es el único botón de toda la página sin el border-bottom 3D "presionable" que define el sistema (hero, CTA final, plan anual) → se ve un componente ajeno al kit en medio de la sección de oferta → mantener el border-bottom 3D en tono neutro en vez de aplanarlo.
4. Jerarquía de cuerpo de texto: 4+ tamaños muy próximos sin razón funcional clara (13.5px tarjetas agitación/pasos, 14.5px tarjetas problema, 15px garantía, 16px sub hero/solución) → al entrecerrar los ojos se lee un degradado continuo, no 3-4 niveles nítidos → consolidar a 2 tamaños de body (ej. 14px tarjetas, 16px subtítulos de sección).
5. Label "RANKING" (hero mini-chip y carrusel slide 1) es el único anglicismo crudo de la pantalla, sin traducción, y no aparece en el léxico aprobado de FICHA-AVATAR.md ("cuadrilla", "charla de seguridad", "pozo/planta"...) → cambiar por "POSICIÓN" o "LUGAR".
