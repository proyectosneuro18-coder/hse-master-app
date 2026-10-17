# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 35/40
Craft: 12/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Subtítulo + línea emocional, bajo el H1] La única línea con conexión emocional real ("Desde hoy vas a ver en 10 segundos quién... está listo para el pozo — y quién todavía no") queda aislada entre dos bloques mecánicos (el H1 habla del "panel", el subtítulo habla de "4 respuestas, sin tarjeta") y no agita ninguna escena de dolor de FICHA-AVATAR.md (firmas por compromiso, miedo a la auditoría/fatalidad) antes de resolver — solo declara el beneficio ya resuelto. Esto deja el eje Emoción del copy en 2/4, bajo el piso de la rúbrica aunque el total llegue a 16/20 → reescribir el subtítulo para agitar brevemente ("Se acabó firmar la charla por compromiso sin saber si de verdad entendieron") antes de que la línea de deseo resuelva.
2. [Tarjetas de plan — `.pw-plan` Anual/Mensual] Cambiar de tarjeta no tiene transición alguna (ni el fondo blanco→amarillo, ni la aparición del check) — es un salto instantáneo, pese a que el resto de la pantalla sí usa motion (stagger de entrada, botón "presionable"). Es la baseline obligatoria de "transición entre tabs/segmentos" ausente en código → agregar `transition: background 150ms ease, border-color 150ms ease` bajo `.js-motion .pw-plan` y una transición de opacity al check.
3. [Badge "2 MESES GRATIS" sobre la tarjeta Anual, línea 77] `border-radius: 999px` (píldora) contradice FICHA-ARTE.md, que fija 14px para chips — es un desvío real y verificable contra la ficha, no una opinión → cambiar a `border-radius: 14px`.
4. [Botón "volver", esquina superior derecha, línea 40] `border: 2px solid var(--ink)` cuando FICHA-ARTE.md fija 2.5-3px sólido como firma de estilo "en TODOS los bloques y botones" — el botón de volver queda con un trazo visiblemente más fino que las tarjetas y el CTA de la misma pantalla → subir a `border: 3px solid var(--ink)`.
5. [Reversibilidad bajo el CTA, línea 96, y detalle del timeline, línea 65] "Hoy no pagas nada · Cancela cuando quieras · Sin tarjeta" y el texto bajo cada paso del timeline siguen en 13px — el mismo problema que ya se corrigió en `.pw-plan .nota` y `.pw-trust` quedó sin resolver en estos dos lugares, y ninguna de las frases de garantía tiene nombre propio cerca del CTA → subir ambos a 14px y nombrar la garantía explícitamente (ej. "Garantía Sin Sorpresas: cancela antes del día 14, sin cobro").
