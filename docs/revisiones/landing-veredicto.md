# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [H2 de Agitación + título inline del carrusel "La app por dentro"] El fix de consolidación de h2 (ronda 44) quedó incompleto en el código: `.agitacion h2` (CSS ~línea 138) y el `<h2>` inline del carrusel (línea ~499, "Así se ve el Pase de los 3 Minutos por dentro") NO tienen el `@media (min-width:700px)` que sube a 32px — quedan fijos en 26px mientras los otros 5 h2 de sección sí escalan. Invisible a 375px (todo cae bajo el breakpoint), pero contradice la afirmación de que "los 7 h2 quedaron iguales" → agregar el media query faltante a esos dos y migrar el h2 inline del carrusel a la clase compartida.
2. [Tinte de profundidad — Agitación/Oferta/CTA final] Subido correctamente en código a 30%/30%/34% (verificado), pero sigue siendo un radial-gradient de 480×300px pegado a UNA esquina con fade a transparente al 70% — el centro y la esquina opuesta de cada sección siguen leyendo plano. Mejora real vs. ronda 44, no resuelve "base con tinte en toda la superficie" → sumar un segundo radial más grande y más tenue (≈800-900px, 8-10%) centrado en la sección para unificar el tinte en todo el bloque, no solo en la esquina.
3. [Componente `.badge` — chips "PARA GERENTES DE HSE" y "VISTA PREVIA"] El único estilo de badge usa siempre `color`/`border: var(--rojo-sombra)` (rojo = alerta/urgencia según la propia ficha), pero se reutiliza para chips puramente informativos (audiencia, vista previa) que no son una alerta → crear una variante neutra (borde/texto en ink o azul) y reservar el rojo solo para urgencia real ("2 MESES GRATIS").
4. [`.plan .precio` en Oferta, ej. "US$6.67/usuario/mes"] El número grande (Baloo 2, 30px) y el sufijo "/usuario/mes" (DM Sans, 13px) van inline sin ajuste de alineación vertical — riesgo de desencaje óptico entre el centro del número grande y el texto chico pegado al lado. → envolver el sufijo en un span con `vertical-align` ajustado o `align-items: baseline` explícito para centrarlo contra el cap-height del número.
5. [Jerarquía tipográfica global] Casi todo el cuerpo de texto de la página usa peso 600-700 (ningún párrafo en 400 regular), así que pese a tener 4 tamaños bien diferenciados, el peso uniforme aplana el contraste real entre niveles — todo "grita" a volumen similar. Es decisión de marca documentada (tono enérgico), pero es el techo real del eje de jerarquía mientras no se introduzca al menos un peso más liviano en los párrafos de apoyo (no en titulares).
