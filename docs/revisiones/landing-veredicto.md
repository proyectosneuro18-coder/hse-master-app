# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Maqueta del teléfono en hero + carrusel "La app por dentro"] Los controles decorativos (botón "Empezar mi reto", las 3 opciones "Menos de 10 / Entre 10 y 20 / Más de 20") comparten borde grueso y sombra 3D idénticos a los CTA reales pero son pointer-events:none → el usuario que toca la maqueta no obtiene respuesta, rompiendo la regla "todo elemento con apariencia interactiva hace algo". Fix: dar a los controles de maqueta un tratamiento visual distinto (opacidad reducida o marca "ejemplo") para que no se confundan con botones reales.
2. [Sistema de botón "presionable" + bloque Racha del hero + carrusel "MUNDO 1 DE 3"] El mecanismo (border-bottom que colapsa al tocar) + contador de racha con casco + lenguaje de progreso "mundo" siguen leyéndose como Duolingo repintado de otro color pese a la rotación de hue ya documentada en FICHA-ARTE — limita el techo de identidad ownable (EJE 3). Fix: extender el motivo propio de cinta de peligro industrial (ya en el header) al lenguaje de botón/tarjeta para diferenciar más allá del color.
3. [Carrusel "La app por dentro"] La navegación por teclado (← →) solo existe en el aria-label, invisible para un usuario vidente que haga foco con Tab — no hay pista visual de que el carrusel acepta flechas. Fix: agregar un texto breve visible ("usa ← →") junto a los controles cuando el carrusel tiene foco.
4. [Oferta — tarjeta "Anual" recomendada, borde superior] El hairline degradé `.plan.rec::after` mezcla 3 acentos sin relación (rojo→verde→azul) en una sola línea de 2px, mientras el resto de hairlines de la página (ej. `.stack::after`) usan solo 2 tonos análogos — se siente menos disciplinado que el resto del kit. Fix: reducir a 2 tonos análogos (amarillo→verde) para igualar el criterio de hairlines del resto de la pantalla.
5. [Oferta — precios "US$6.67" y "US$8"] El tamaño de fuente del precio (30px) queda muy cerca del tamaño de los títulos de sección (26-28px), sumando un quinto nivel a la escalera tipográfica de la pantalla completa. Fix: bajar el precio a 26-28px o separar claramente los títulos de sección para volver a 4 niveles nítidos.
