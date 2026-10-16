# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 15:40
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sección Oferta — botones "Quiero el plan anual/mensual"] El único mecanismo de conversión real es un enlace mailto que depende de que el dispositivo tenga un cliente de correo configurado (frecuente que no lo tenga en equipos corporativos/desktop) y no deja ningún registro verificable de la intención de compra → construir un formulario o checkout real que capture el lead en servidor, en vez de depender 100% de que se abra el correo del usuario.
2. [Craft — profundidad, body completo] El tinte radial de fondo (amarillo/azul/verde) definido en <body> solo se alcanza a ver en el hero; las otras 9 secciones son bloques de superficie llena (surface/bg) con borde de 3px que lo tapan por completo durante el resto del scroll → dejar un margen de fondo visible entre secciones o quitar el fondo sólido en 2-3 secciones para que los 3 niveles de profundidad se perciban en toda la pantalla, no solo arriba.
3. [Craft — ritmo compositivo de Problema/Agitación/Solución/Oferta/FAQ] Las 5 secciones de contenido repiten la misma fórmula visual (h2 centrado + grid de tarjetas con el mismo borde negro de 3px y la misma sombra) sin variación de composición entre ellas → romper el patrón en 1-2 secciones (la de Garantía ya lo hace con el escudo centrado sin grid) para que la página no se lea como una plantilla de tarjetas repetida.
4. [Hero y carrusel "La app por dentro"] Los elementos dentro de los marcos de teléfono (botón "Empezar mi reto", las opciones del reto en la última vista del carrusel) usan exactamente el mismo estilo que los controles reales de la página — mismo borde, misma tipografía — e invitan a tocarlos en móvil aunque no hacen nada (pointer-events:none solo bloquea el hover de mouse, no el toque táctil) → dar a los elementos de maqueta un tratamiento visual distinto (capa semitransparente o etiqueta "ejemplo" más visible) para que no se confundan con controles reales.
5. [Oferta — botón "cópialo" del correo] Si fallan tanto navigator.clipboard.writeText como el execCommand('copy') de respaldo, el botón igual muestra "¡Copiado!" sin haber copiado nada — es una confirmación falsa en ese caso borde → envolver el fallback en su propio try/catch y, si ambos fallan, resaltar visualmente el correo en vez de mostrar el mensaje de éxito.
