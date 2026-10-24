# VEREDICTO revisor-visual — ranking
Fecha: 2026-10-23 00:00
Screenshot: docs/revisiones/ranking-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [ranking-375-b.png — botón "Empezar mi reto", ranking.html líneas 110-114 `.ap-estado button`] El CSS SÍ define el botón presionable mandado por FICHA-ARTE (`background: var(--verde-sombra)` + `border-bottom: 4px solid ...`), pero en el screenshot del estado vacío el botón se ve blanco/crema con borde fino uniforme — visualmente idéntico al botón plano de la ronda 2 que se había reportado corregido. Es el mismo defecto #2 de `ranking-veredicto.md` anterior, sin resolver en lo que el screenshot deja ver → recapturar con caché limpia/hard reload antes de declarar el fix verificado; si una captura fresca sigue sin mostrar el fondo verde, revisar por qué el navegador no aplica esa regla (orden de cascada, selector, archivo CSS no recargado).
2. [Toda la pantalla — heurística 7, flexibilidad/eficiencia] Sigue sin ningún atajo ni mecanismo de eficiencia para el usuario frecuente más allá del default "Esta semana" activo; igual que en la ronda 2, es el eje más débil de la rúbrica junto al defecto 1 — no bloqueante por sí solo.
3. [Eje 3 craft — identidad "Casco de Oro"] La discrepancia del defecto 1 rompe la coherencia del lenguaje "comic/juego de mesa" (bordes gruesos + botón presionable) en el primer contacto de un usuario sin puntos (el estado vacío): el CTA no transmite el tratamiento visual que sí usan paywall/onboarding → mismo fix que el defecto 1 resuelve esto.
4. [rk-fila .delta, ranking.html línea 84, `width: 34px` fijo] No se validó con datos extremos: un delta de 2 dígitos (ej. "▲10") en un contenedor de 34px de ancho fijo puede recortarse o pegarse al número de puntos → probar con datos semilla de 2 dígitos o usar `min-width` en vez de `width` fijo.
5. [Tab bar inferior, líneas 122-126] El `:active{scale(.95)}` nuevo en `.ap-tab` es solo feedback de tap; no hay transición de color/fondo al activarse la pestaña (el cambio de "Ranking" a activa es instantáneo, sin suavizado) — mejora menor, no bloqueante.

Verificación de los 3 cambios reportados de la ronda 3:
- Botón presionable en "Empezar mi reto"/"Reintentar" → CSS correcto en código (líneas 110-116), pero el screenshot del estado vacío NO refleja el cambio (ver defecto 1) — no se puede dar por confirmado visualmente.
- `:active{scale(.95)}` en los 4 tabs → confirmado en código (línea 126), no observable en un screenshot estático pero correctamente implementado.
- `sr-only` "1°" en la fila del 1er lugar → confirmado en código (línea 176), resuelto.
