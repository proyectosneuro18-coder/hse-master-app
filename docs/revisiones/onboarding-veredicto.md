# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pasos 1, 3 y 5 — pantalla completa] `.onb-paso` centra el contenido con `justify-content: center` (onboarding.html línea 57-60) sobre bloques de poco alto (icono+2 líneas en el paso 1; icono 72px+2 líneas en el paso 3; anillo+4 líneas en el paso 5), dejando ~35-50% de la pantalla como aire muerto arriba y abajo — visible de inmediato en docs/revisiones/onboarding-375.png, onboarding-375-b.png y onboarding-375-c.png. Contradice el núcleo de cierre ("CERO vacío muerto", doctrina 32 "la app nunca se enseña vacía"). Fix: anclar el bloque en el tercio superior (`justify-content: flex-start` + padding-top fijo) y sumar un elemento que ocupe el espacio sobrante (ilustración más grande, dato de contexto o apoyo visual), en vez de dejarlo flotando centrado en una pantalla vacía.
2. [Paso 4, encabezado — onboarding.html línea 258] `.onb-encabezado verde` se usa para "¿A qué hora es la charla antes del turno?", una pregunta puramente informativa/de horario. FICHA-ARTE.md líneas 24-26 reserva el verde específicamente para "logro/acción principal" (el CTA de avanzar, los checks de competencias vigentes) y el azul para "navegación/información" — exactamente la categoría a la que pertenece esta pregunta (como el paso 1, que sí usa azul). Fix: cambiar `.onb-encabezado verde`/`.onb-icono verde` por `azul` en el paso 4, y dejar el verde únicamente en botones de acción y celebraciones reales.
3. [Paso 5 — loading, onboarding.html líneas 150-158] Las 4 líneas de progreso distinguen "pendiente" (gris), "activa" (azul con pulso) y "completa" (verde) solo por el color de la marca circular, sin un glifo distinto dentro del círculo para el estado "completa" (ej. un check) — hoy el círculo completo es un relleno sólido igual de plano que el activo, y la única diferencia entre esos dos estados es el matiz exacto de color. Fix: agregar un ícono de check SVG dentro de `.marca` cuando `.completa`, para no depender solo del matiz.
