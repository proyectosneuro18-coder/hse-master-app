# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 15:40
Screenshot: docs/revisiones/onboarding-375.png (+ onboarding-375-b.png paso 3, onboarding-375-c.png paso 5)
Usabilidad: 33/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [onboarding.html L295 + L567-576, paso 5 "loading"] El contenedor `.onb-loading` lleva `aria-live="polite"` y envuelve el número de porcentaje (`.onb-aroPct .num`) que se reescribe en CADA frame de `requestAnimationFrame` (hasta ~30 mutaciones por tramo, 4 tramos) → un lector de pantalla intenta anunciar cada cambio y produce spam/tartamudeo en vez de un progreso legible → mueve el `aria-live="polite"` solo al contenedor `#onbLineas` (los 4 hitos reales) y pon el anillo/porcentaje con `aria-hidden="true"` o un `aria-live="off"` propio.
2. [onboarding.html L119-122, botón `.onb-boton` verde] Contraste medido del relleno `#1bcc02` contra el fondo inmediato `#fffaf0`/blanco ≈ 2.17:1 — por debajo del ancla "≥3:1 CTA vs fondo" (el borde negro de 3px compensa visualmente pero el relleno por sí solo no pasa el umbral medido) → oscurecer el verde del CTA ~8-10% o usar `--verde-sombra` como relleno y el verde actual solo como borde-sombra.
3. [onboarding.html L71, L85-86, L125] Varios `margin`/`padding` usan 20px y 28px (`.onb-encabezado` padding 20px; `.onb-chips` margin-top 28px; `.onb-nota-cuadrilla` margin-top 20px; `.onb-boton-abajo` margin-top 28px), fuera de la escala mecánica obligatoria 4·8·12·16·24·32·48·64 → ajusta cada uno al valor de escala más cercano (20→24, 28→24 o 32) para que el ritmo vertical sea uniforme en toda la app.
4. [onboarding.html L425-428, selección de chip] Tras tocar un chip, `grupo.style.pointerEvents='none'` bloquea el grupo por 320ms sin ningún indicador visual de esa espera (solo el cambio de color del chip elegido) — un usuario que toca un segundo chip en ese lapso no recibe ninguna señal de por qué no respondió → añade un `cursor: wait` o una opacidad leve (0.7) al resto de chips del grupo durante el bloqueo.
