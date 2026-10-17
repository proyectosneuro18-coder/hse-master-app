# VEREDICTO revisor-visual — landing
Fecha: 2026-10-17 12:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sección Garantía, párrafo único "El Compromiso del Primer Pase"] Repite el mismo patrón que ya se corrigió en Oferta: mezcla 2 mensajes sin relación (por qué no hay reembolso + la promesa de soporte personal) en una sola oración larga con guion largo → separarlo en 2 oraciones/párrafos cortos, igual que se hizo con el párrafo de precios.
2. [Craft — profundidad global: Problema, Agitación, Solución, carrusel "La app por dentro", Garantía, FAQ] Al dejar el tinte radial solo en Hero/Oferta/CTA-final, esas 6 secciones dependen únicamente de alternar blanco/crema + borde de 3px para separarse entre sí — correcto para quitar el ruido de la ronda anterior, pero deja el tramo medio de la página visiblemente más plano/menos ownable que las 3 secciones tintadas → anclar ese tramo con un tercer uso del motivo de franja de peligro (ya repetido 2 veces) en vez de dejarlo solo en blanco/crema liso.
3. [Oferta, plan Mensual, botón "Escríbenos por este plan"] El estilo `.link-secundario` (borde-inferior en gris `--ink-2`) sigue leyéndose más como enlace de salida que como botón de conversión secundaria — un usuario que decide el mensual puede dudar un instante si es tan clickeable como el verde del anual → subir su peso visual (borde-inferior en `--ink` o un acento propio) sin igualar al botón recomendado.
4. [Carrusel "La app por dentro", script líneas ~917-921] Los dots y flechas se recalculan en cada evento nativo `scroll` sin debounce/rAF → en el celular de gama media del operador de campo (avatar secundario) esto puede sentirse tosco al arrastrar con el dedo; envolver el cálculo en `requestAnimationFrame`.
5. [Método de verificación] El PNG oficial (360×8711, visualizado muy reescalado) no permite confirmar a ojo el encaje fino (centrado óptico de números, simetría exacta de padding por card) con la misma certeza que el resto de la auditoría de código → para la próxima ronda, adjuntar también recortes a resolución nativa de Hero, Oferta y Garantía junto al PNG de página completa.
