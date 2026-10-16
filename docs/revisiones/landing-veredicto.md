# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Identidad visual de toda la pantalla] El sistema de bloques con borde grueso negro + botón "presionable" con sombra sólida + paleta arcoíris rotada sigue leyéndose como un reskin de Duolingo (mecanismo, tipografía chunky y composición calcados, solo cambia el hue) pese al ownable del casco → sumar un segundo dispositivo ownable propio del nicho industrial (textura de placa/advertencia, franjas de seguridad) para que no sea intercambiable con "Duolingo pintado de otro color".
2. [Hero, caption bajo el CTA + nota bajo antes/después en Solución] Inglés crudo sin traducir repetido 2 veces: "International Association of Oil & Gas Producers" → traducir el paréntesis o dejar solo la sigla "IOGP".
3. [Toda la pantalla, profundidad] Los 3 niveles de profundidad declarados en FICHA-ARTE dependen casi solo del borde grueso negro; los radiales de fondo (10-16% opacidad) son casi imperceptibles y el único hundido real es el inset-shadow del teléfono del hero → subir la opacidad de los radiales o dar sombra suave real a al menos una card elevada por sección.
4. [Sección Oferta, ambas tarjetas de plan] "Protegido por la Garantía del Primer Pase" se repite idéntica en Anual y Mensual, debajo de cada CTA, compitiendo con el botón → consolidar en una sola línea compartida (similar al trial-strip ya existente).
5. [Mockup del hero, float-chip "LOTO completado"] El parche `@media (max-width:400px){.float-chip.a{left:-4px}}` indica que el posicionamiento absoluto del chip no está resuelto de fondo para 375px, solo parchado → revisar el padding lateral real del chip en el breakpoint de prueba en vez de depender del ajuste puntual.
