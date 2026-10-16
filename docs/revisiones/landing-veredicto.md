# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Oferta, plan Anual — mensaje de confirmación tras clic] El texto "Tu correo debería haberse abierto..." usa verde #1b9f03 sobre el fondo amarillo #ffe600 del plan recomendado → contraste medido ~2.76:1 (y ~3.36:1 en el plan Mensual sobre crema), ambos muy por debajo del mínimo AA de 4.5:1 para texto normal — justo en el mensaje que debe confirmarle al usuario que su acción funcionó (heurística 1 y regla de contraste del SO). Fix: cambiar el color del texto de confirmación a var(--ink) o a un verde mucho más oscuro, verificado ≥4.5:1 sobre AMBOS fondos (amarillo y crema) donde aparece.
2. [Oferta + mensaje de confirmación — salida alterna] La única vía de rescate cuando el mailto no abre ("escríbenos a ventas@hsemasterapp.com", repetida en `.trial-strip` y en el mensaje de confirmación) nunca es un enlace `mailto:` ni tiene botón de copiar — es texto plano. Justo el usuario al que más le falló el flujo principal tiene que transcribir la dirección a mano en su teléfono. Fix: convertir ambas menciones en `<a href="mailto:ventas@hsemasterapp.com">` reales y/o agregar un botón "copiar correo".
3. [Sticky-CTA inferior — navegación interna] Los accesos "Precios"/"Preguntas" (el fix de la ronda 39) solo aparecen después de cruzar el sentinel colocado DESPUÉS de la sección Oferta — durante Problema, Agitación, Solución y el carrusel "Así se ve por dentro" (buena parte del scroll de la página) el usuario sigue sin ninguna navegación real, solo el botón "volver arriba". Fix: mover el disparador de `.past-oferta` a la salida del hero (mismo punto donde ya aparece el resto del sticky-CTA), no a la salida de Oferta.
4. [Oferta — todo el flujo de conversión] Las dos únicas acciones de compra ("Quiero el plan anual/mensual") dependen 100% de que el dispositivo tenga un cliente de correo configurado, sin validación previa ni alternativa real antes del clic — solo un aviso reactivo después de hacer clic. Para una venta B2B de alto valor esto es prevención de error insuficiente (heurística 5). Fix: sumar un formulario web real (o como mínimo un botón "copiar correo" siempre visible junto al CTA, no solo en letra chica) como vía principal de conversión.
5. [Tipografía, toda la pantalla] La escala de tamaños usa demasiados valores casi-duplicados (11 / 11.5 / 12 / 12.5 / 13 / 13.5 / 14 / 15 / 16px) en vez de 3-4 niveles discretos de verdad — un ojo entrenado nota la falta de disciplina en la escala tipográfica (eje de jerarquía). Fix: consolidar a una escala fija (ej. 12 / 14 / 16 / 20+px) y eliminar los valores intermedios sueltos.
