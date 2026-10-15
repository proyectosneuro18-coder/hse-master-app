# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sección 4 "Antes/Después", tarjeta verde "Después"] Texto blanco sobre fondo #58CC02 mide ~2:1 de contraste (falla AA 4.5:1) → cambiar el texto a var(--ink) o oscurecer el verde de fondo.
2. [Sección 6 "Oferta", botones "Empezar prueba gratis" de ambos planes] href="#" literal: el clic en la acción principal de conversión salta al tope de la página en vez de ir a signup/checkout, rompiendo la única acción primaria del embudo → apuntar a la URL real de checkout o, mientras no exista, a "#oferta" como el resto de los CTA del archivo.
3. [Badges rojos "PARA GERENTES DE HSE" y "2 MESES GRATIS"] Texto blanco sobre #FF4B4B mide ~3.3:1, bajo el mínimo AA de 4.5:1 para texto pequeño en negrita → usar var(--rojo-sombra) #D93838 de fondo o texto var(--ink).
4. [Sección 5 "La app por dentro", carrusel y dots] Sin control de teclado ni botones prev/next; los puntos de paginación son decorativos y no clicables → agregar controles accesibles (flechas, dots clicables, manejo de foco).
5. [Hero, botón "Probar gratis 14 días"] El relleno verde contra el fondo crema (#FFFAF0) mide ~2:1 de contraste medido (el borde negro de 3px mitiga mas no cumple el ancla ≥3:1 del relleno) → oscurecer el verde de fondo o aumentar el contraste del relleno.
