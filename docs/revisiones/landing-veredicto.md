# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Header (sticky, visible en las 10 secciones): el enlace `<a class="logo">` (landing.html l.240) no define `color` ni `text-decoration`, así que el navegador le aplica su estilo por defecto — azul y subrayado — rompiendo la ficha de arte (ink #1a1a1a + Baloo 2) y el sistema de botones/enlaces del resto de la pantalla. Verificado renderizando landing.html en vivo a 375px (no se aprecia en la captura estática provista, que parece de una revisión anterior del archivo). Fix: añadir `color: var(--ink); text-decoration: none;` a `.logo`.
2. "Entrar" (header, arriba a la derecha) y los 3 links legales del footer no dan ningún feedback al tocar en móvil — son placeholders sin acción real, con solo un `title` que no se dispara por touch. Fix: reemplazar el `title` por un estado visible al tap (texto "Disponible pronto" o similar) mientras no existan esas páginas.
3. Chip flotante "✓ LOTO completado" (hero, esquina superior izquierda del teléfono) queda a ~6px del borde izquierdo del viewport a 375px (`.float-chip.a { left:-14px }` relativo a `.hero-visual`, que a este ancho mide ~335px), dando un aspecto apretado/casi cortado contra el borde de pantalla. Fix: en un media query ≤400px reducir el offset a algo como `left:-4px`.
4. Contraste insuficiente en `.plan .nota` ("Se cobra US$80/usuario/año", plan Anual recomendado): `--ink-2` (#6b6b6b) sobre fondo `--amarillo` (#ffc800) mide ≈3.43:1 — por debajo de 4.5:1 AA para texto normal de 12px. Fix: usar `var(--ink)` en vez de `--ink-2` para `.plan.rec .nota`.
5. Sistema de profundidad incompleto y sin micro-movimiento en los datos héroe: solo hay 2 de los 3 niveles pedidos (base con tinte + superficies elevadas con borde/sombra), sin ninguna área "hundida"; y los números del mockup ("12 días", "9/12") son estáticos, sin conteo animado, pese a que la ficha señala el bloque de racha como "dispositivo ownable" principal. Fix: sumar un elemento con sombra interior (ej. track del carrusel) y un count-up breve a esos números.
