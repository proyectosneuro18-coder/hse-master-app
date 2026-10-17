# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [CTA primario, paywall.html L110-114 vs L75 `.pw-panel { background: var(--surface) }`] El botón verde (#1bcc02) mide ~2.17:1 de contraste contra el blanco inmediato del panel (#ffffff), por debajo del mínimo 3:1 exigido al CTA héroe (solo se distingue por el borde negro de 3px, no por el relleno) → oscurecer el verde de fondo (ej. un tono ~#149600) o envolver el botón en un halo/superficie con tinte que eleve el contraste medido del relleno, sin depender solo del borde.
2. [Heurística 9 — errores con solución, paywall.html L241-243 y L264-268] No existe ningún aviso visible al usuario si falla el guardado en sessionStorage (ej. navegación privada que lo bloquea) o si la navegación a login.html no ocurre tras el click en "Crear mi acceso..."; el único manejo es un fallback silencioso de texto → agregar un mensaje breve (toast o inline) si el guardado/la navegación fallan, en vez de fallar en silencio.
3. [Heurística 2 — lenguaje del usuario, paywall.html L144 "tu cuadrilla ya corre el Pase, sin límites"] "el Pase" se usa como nombre propio sin definirlo en esta pantalla; un usuario que entra aquí directo (link compartido, retomar sesión) no sabe qué es → añadir una aclaración breve entre paréntesis en la primera mención ("el Pase, la charla+examen diario") o un tooltip.
4. [Craft Eje 1 — jerarquía, paywall.html L48 `.pw-headline{font-size:28px}` vs L95 `.pw-plan .precio{font-size:22px}`] El precio del plan (22px, misma familia display Baloo 2 bold) casi iguala el peso visual del titular (28px), diluyendo el salto de 4 niveles al entrecerrar los ojos → bajar el precio a ~18-19px o reforzar el salto headline→precio.
5. [Heurística 4 — consistencia, paywall.html L79 `.pw-planes-tit{color:var(--ink-2)}` vs L80 `.pw-dias-tit{color:var(--azul-sombra)}`] Dos etiquetas de sección del mismo tipo (eyebrow uppercase 12px) reciben tratamiento de color distinto sin razón visible en el screenshot (una gris, otra azul) → unificar el color de las etiquetas de sección o documentar la excepción en FICHA-ARTE.md si es intencional.
