# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Botón flotante "volver arriba", `.subir-arriba` CSS líneas ~351-362 y JS líneas ~811-813 de landing.html] Su visibilidad y su `bottom` fijo (90px en mobile) solo dependen de `heroBtnOutOfView`; nunca se recalculan según `stickyDescartado` ni `footerVisible`. Resultado: en cuanto el usuario cierra la barra fija (X) o llega al pie (donde la barra se auto-oculta por el fix de esta ronda), el botón circular queda flotando con ~90px de vacío muerto debajo, sin nada que lo ancle. Como el cierre de la barra ahora persiste en localStorage, este estado roto se vuelve el default permanente de la sesión para cualquiera que la cierre una vez → Fix: en `actualizarSticky()`, alternar una clase (p.ej. `.sin-sticky`) sobre `subirArriba` que lleve `bottom` a 24px cuando `!sticky.classList.contains('show')`.
2. [Texto de lectura por debajo de 14px — `.stack .item p` (oferta, línea ~244) y `.prueba-industria` (hero, línea ~94) de landing.html] Son oraciones completas de explicación ("No reemplaza tu software EHS...", "Basado en las 9 Reglas que Salvan Vidas, publicadas por la IOGP..."), no labels/captions, pero están a 12px — por debajo del propio mínimo de 14px que el sistema de diseño exige para texto de lectura (12-13px solo permitido en labels/captions). Afecta directamente al avatar real (gerente de 46 años leyendo en un celular de 375px) → Fix: subir ambas reglas a `font-size: 14px`.
3. [Enlaces "Precios"/"Preguntas" dentro de la barra fija inferior, `.sticky-nav a`, línea ~340] Son enlaces de texto a 11px sin padding ni min-height — el área táctil real es la caja del texto (~14-16px de alto), muy por debajo de los 44px mínimos. Severidad menor (son navegación secundaria, no el CTA) → Fix: envolver cada enlace en un padding vertical que garantice min-height 44px, o aceptar explícitamente la excepción y documentarla.

Nota de verificación de la ronda 47: los 3 fixes reportados (ocultar la barra fija al llegar al footer, el botón "cópialo" ya no finge éxito cuando falla, el cierre de la barra persiste entre recargas) están correctamente implementados en el código y se confirman resueltos — pero el fix #1 (persistencia del cierre) es precisamente lo que vuelve permanente el defecto #1 de esta ronda, antes latente y ahora con mucha más exposición.
