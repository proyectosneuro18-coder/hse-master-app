# VEREDICTO revisor-visual — progreso
Fecha: 2026-10-23 00:00
Screenshot: docs/revisiones/progreso-375.png
Usabilidad: 31/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [progreso.html líneas 74-81 y 205-208, screenshot progreso-375.png] El conector punteado del camino (verde/neutro) termina en el borde del nodo "actual" y no continúa hacia la tarjeta "Se desbloquean en orden" justo debajo — el sendero se corta de golpe donde debería seguir fluyendo hacia los 6 módulos restantes, rompiendo la metáfora de "camino continuo" que la propia ficha describe como dispositivo ownable → agregar un tramo corto de conector punteado desde el nodo actual hasta el borde superior de `.pg-resto`.
2. [progreso.html línea 74 `.pg-camino{margin-top:28px}` y línea 75 `.pg-fila{margin-bottom:28px}`] Usa 28px, un valor fuera de la escala mecánica 4·8·12·16·24·32·48·64 que manda el sistema de diseño — nadie lo nota a simple vista, pero es la clase de desvío que un ojo entrenado detecta y que con el tiempo erosiona la disciplina de espaciado → cambiar a 24px o 32px.
3. [heurística 7, progreso.html líneas 338-360] Sigue sin existir ningún mecanismo de eficiencia para el usuario recurrente (atajo, salto directo, recordar el último módulo visitado) — la pantalla es 100% navegación lineal de solo lectura, igual que en la ronda 1; no es grave pero tampoco mejoró.
4. [craft eje4 — movimiento, progreso.html líneas 256-273] De las 7 animaciones baseline, 6 están cubiertas (stagger, conteo del resumen, barra que se dibuja, tap <150ms en nodos, toast, prefers-reduced-motion) pero falta la transición entre tabs: los enlaces a Hoy/Ranking/Perfil son navegación de página dura sin ninguna transición de salida/entrada → agregar un fade/cross-fade breve al cambiar de tab.
5. [progreso.html líneas 348-360, ítems de `.pg-resto-item`] Al tocar un módulo bloqueado el toast solo repite la información que el candado ya comunica ("Se desbloquea cuando termines tu reto actual") sin aportar valor nuevo (ej. requisito concreto o estimado) — feedback presente pero redundante, no accionable.

Mejoras confirmadas desde la ronda 1 (ya no son defectos):
- Los 9 nodos/ítems ahora tienen `aria-label` descriptivo con número, nombre y estado — resuelto.
- Los 6 módulos bloqueados se colapsaron en una lista condensada "Se desbloquean en orden" dentro de una tarjeta, eliminando la repetición de 6 círculos idénticos — resuelto.
- Se agregó el conector punteado entre los 3 nodos del camino (verde en tramos completados) — el sendero ahora se lee como tal (ver defecto #1 arriba sobre su alcance incompleto).
- El ícono de candado bloqueado pasó a `var(--ink-2)` #6b6b6b — contraste ya adecuado (~5.7:1 sobre blanco).
- El badge "3" del nodo actual ya no se ve cortado por el borde del círculo.
