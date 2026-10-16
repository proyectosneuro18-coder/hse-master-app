# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Hero: 4 acentos saturados (badge rojo, palabra azul en el h1, bloque racha amarillo, chip flotante verde) compiten por el ojo en los primeros 3s, sin un héroe visual claro → bajar peso del badge rojo y del chip flotante para que solo amarillo+verde dominen el primer encuadre. 2) Chip del hero usa la sigla "IOGP" sin traducir en su primer uso (la explicación solo llega 2 secciones después) → añadir "(el estándar internacional de la industria petrolera)" en el propio chip. 3) Sección Garantía: la nota-piso remite a "se detalla antes de confirmar" sin dar plazo ni condición, debilitando la única sección que debía dar certeza → reemplazar por el dato real de reembolso (plazo y condición) o quitar la oración. 4) `.boton-amarillo` está definido en CSS pero nunca se usa en el HTML — código muerto que contradice la ficha de que el amarillo también es CTA secundaria. 5) El tag "2 MESES GRATIS" en el plan anual usa el rojo reservado para alerta/urgencia sobre un beneficio positivo — desvío semántico menor, debería ser verde (logro).
