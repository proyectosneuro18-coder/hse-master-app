# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA primario, paywall.html L112-115 `.pw-boton{background:var(--verde)}` dentro de `.pw-panel{background:var(--surface)}` L77] El contraste MEDIDO del relleno verde (#1bcc02) contra el blanco inmediato del panel es ~2.17:1 (fórmula de luminancia relativa WCAG), por debajo del mínimo 3:1 exigido al CTA héroe — persiste de la ronda anterior: el `box-shadow` verde difuso agregado (L115) decora el borde pero no sube el contraste del relleno con su fondo → oscurecer el verde de fondo del botón (ej. ~#149600) o envolverlo en una superficie/tinte propio que eleve el contraste medido del relleno, no solo depender del borde de 3px.
2. [Garantía, paywall.html L193 `<p class="pw-garantia-txt">...te ayudamos sin costo</p>`] "te ayudamos sin costo" no especifica QUÉ ayuda recibe el cliente (¿llamada?, ¿extensión de prueba?, ¿reembolso?) — debilita la claridad de la oferta justo junto al CTA de conversión → nombrar la acción concreta (ej. "te llamamos en 24h y activamos tu cuadrilla en vivo, sin costo").
3. [Selector de plan, paywall.html L166 `role="radiogroup" aria-label="Elige el plan que se sugerirá al terminar tu prueba"`] la aclaración de que elegir un plan AHORA es solo una sugerencia para después del día 14 (no un cobro inmediato) vive SOLO en el `aria-label`, invisible para cualquier usuario vidente — quien ve la pantalla puede leerlo como que está comprometiendo un plan de pago ya mismo → agregar un micro-texto visible bajo "SI DECIDES SEGUIR..." (L165) tipo "Puedes cambiarlo después — hoy no se cobra nada".
4. [Tipografía, paywall.html L48 `.pw-headline{font-size:28px}`, L71 `.pw-linea .titulo{font-size:14px}`, L82 `.pw-dias-tit{font-size:12px}`, L97 `.pw-plan .precio{font-size:19px}`, L99 `.pw-plan .nota{font-size:13px}`, L121 `.pw-garantia-txt{font-size:13px}`] conviven 6+ tamaños de fuente distintos (28/19/14/13/12/11px) en una sola pantalla, por encima del máximo de 3 niveles de jerarquía (display/title/body/label) — al entrecerrar los ojos no se leen 4 niveles nítidos sino un degradé continuo de tamaños → consolidar nota/total/garantía-txt/trust en un único tamaño secundario de 13px.
5. [Consistencia del botón primario, paywall.html L113 `.pw-boton{...font-size:14px...}` vs onboarding.html L120 `.onb-boton{...font-size:15px...}`] el mismo componente (botón primario verde, pressable, mismo rol de "avanzar") usa un tamaño de fuente distinto entre pantallas de la misma app → unificar a un solo valor (15px) en ambos archivos.
