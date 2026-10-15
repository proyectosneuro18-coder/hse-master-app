# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Hero, H1 "3 minutos al día" en azul; sección Solución, .big-idea .mec "El Pase de los 3 Minutos"] El color --azul (#1CB0F6) usado como texto de énfasis sobre fondos claros (#FFFAF0 y #FFFFFF) mide ~2.35:1 y ~2.44:1 de contraste (luminancia relativa calculada), por debajo del mínimo AA para texto grande (3:1). Es justo la palabra clave que debe "resaltar" en el titular y el nombre del mecanismo repetido en toda la página → usar --azul-sombra (#0D96D4, ~3.3:1) o un tono más oscuro para texto sobre fondo claro.
2. [Hero: botón "Empezar mi reto" dentro del phone-mini; Carrusel slide 4: opciones "Menos de 10 / Entre 10 y 20 / Más de 20"] Elementos decorativos dentro de mockups de teléfono usan las mismas clases/estilo que los CTAs y controles reales de la página (mismo .boton.boton-verde, misma apariencia de opción seleccionable), por lo que parecen interactivos sin serlo → aplicar un tratamiento visual distinto (opacidad reducida, sin clase .boton compartida) a todo contenido que sea solo demo del mecanismo interno.
3. [Hero, phone-mini] La grilla 2x2 de métricas y el botón añadidos para llenar el espacio vacío del mockup quedan casi completamente fuera del viewport visible a 375px: el screenshot corta justo después de la fila "9/12 MÓDULOS / 2° RANKING", antes del botón "Empezar mi reto" y del chip "Pase vigente hoy" → reducir la altura del phone-mini o recolocar el contenido para que sea visible sin scroll en el hero.
4. [Hero, .float-chip.a "✓ LOTO completado"] Usa un carácter Unicode "✓" suelto en el texto en vez de un SVG, mientras todos los demás checks del sistema (.stack .check, chip de prueba-industria) usan el mismo ícono como SVG trazado → reemplazar por el mismo SVG de check para mantener consistencia del sistema de íconos.
5. [Sección 5, controles del carrusel #carruselPrev/#carruselNext] Las flechas no muestran estado deshabilitado en los extremos; al hacer clic en "anterior" en la primera slide (o "siguiente" en la última) no hay ninguna señal de que no ocurrió nada → agregar atributo disabled + estilo de opacidad reducida cuando el índice actual es el primero/último.
