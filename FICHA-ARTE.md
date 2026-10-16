# FICHA DE DIRECCIÓN DE ARTE — HSE Master App

## Referencia del usuario (CONTRATO — ver 16)
- ¿Hay imagen(es) de referencia del usuario?: SÍ (parcial) — captura de la tarjeta "hero de landing" ámbar de la ronda 2 ("Alerta Segura"), con instrucción explícita: cambiar a amarillo, bloques grandes/llamativos/coloridos, inspirado en Duolingo y las apps top del nicho. Es un ajuste de estilo, no una réplica de layout ajeno.
- Prohibiciones anti-IA que la referencia levanta: ninguna — el pedido es justamente ir MÁS lejos en lenguaje gamificado (lo opuesto a "ai slop" minimalista).

## Historial de direcciones (3 rondas — cosa juzgada solo la última)
- RONDA 1 (azul, mandato del usuario): A "Casco Azul" · B "Turno Nocturno" (elegida, luego descartada al ver el tour) · C "Bitácora de Pozo".
- RONDA 2 (color abierto): A "Alerta Segura" (grafito+ámbar) · B "Racha Verde" · C "Violeta Operativo" (elegida y aprobada tras ver el tour).
- RONDA 3 (ajuste sobre lo aprobado, a pedido del usuario con referencia parcial): se reemplaza "Violeta Operativo" por **"Casco de Oro"** — amarillo protagonista + paleta multicolor de apoyo tomada directo de Duolingo (verde de logro, azul de navegación, rojo de alerta), bloques grandes de color con borde grueso oscuro y botones "presionables" (sombra sólida inferior, sin blur). Fusiona el mecanismo ya documentado en FICHA-MODELO.md (Duolingo) con el pedido explícito de "bloques grandes, llamativos y coloridos".
- Combinación tipográfica: Baloo 2 (display, chunky/redondeada — la familia tipográfica más cercana al lenguaje visual de Duolingo sin clonar su fuente propietaria) + DM Sans (body, limpia y neutra para no competir con los bloques de color).
- Arquetipo: el Bufón/Compañero de juego — energético, competitivo, directo — con el rojo reservado para alertas y el verde para logro, igual que en apps de hábito líderes.

## Personalidad compilada
- 3 adjetivos: enérgica, competitiva, directa.
- Compilación: spring marcado (el "salto" al completar un reto SÍ se nota — es el motor de enganche) · duración base ~260ms · exclamaciones máx. 1-2/pantalla (aquí se permite más que en las rondas anteriores: el tono ya no es institucional sino de juego) · celebración nivel alto · radio tendencial 16-20px (bloques bien redondeados, "gorditos").

## Brand kit final (dirección elegida: "Casco de Oro")
- Fondo: #FFFAF0 (blanco cálido) · Superficie: #FFFFFF · Texto 1º/2º: #1A1A1A / #6B6B6B
- Acento primario: #FFC800 (amarillo — CTA secundarias, bloque héroe de la racha, plan recomendado del paywall, fondo del QR)
- Acentos de apoyo (multicolor, cada uno con su propio uso fijo, nunca intercambiables):
  - Verde #1BCC02 (sombra #1B9F03): logro/acción principal — el botón CTA de avanzar, los checks de competencias vigentes.
  - Azul #3E7EF7 (sombra #0A4299): navegación/información — tab activo, palabras clave destacadas en headlines.
  - Rojo #FF4E0E (sombra #C75126): alerta/urgencia — badges ("2 meses gratis", "Para Gerentes de HSE").
  - ⚠️ AJUSTE (Sesión 3, ronda 18 de revisión de landing): el revisor-visual independiente marcó que los 3 acentos originales (#58CC02/#1CB0F6/#FF4B4B) eran los HEX EXACTOS de marca de Duolingo, no un tono "inspirado" — un riesgo de identidad real, y además lo que la Regla de Oro 1 prohíbe explícitamente al citar una app como referencia ("se replica... sin clonar... marca"). Se rotó el matiz de los 3 (+18°/+20°/+16° aprox., verde→más puro, azul→más índigo/cobalto, rojo→más anaranjado tipo señalética de peligro industrial) preservando su función semántica y re-verificando contraste WCAG contra cada fondo/texto real donde se usan (botones, badges, chips, íconos) con la fórmula de luminancia relativa. NO es una redecisión de paleta (amarillo cálido + multicolor + blanco cálido se mantienen intactos, cosa juzgada) — es la corrección de un desvío puntual que la ficha original no había detectado.
- Borde: 2.5-3px sólido en #1A1A1A en TODOS los bloques y botones — es la firma del estilo (look "comic/juego de mesa"), nunca hairline sutil.
- Botón "presionable": sin sombra difusa — `border-bottom: 4px solid [tono más oscuro del mismo color]`, imitando el mecanismo 3D de Duolingo.
- Display: Baloo 2 (pesos 500-800) · Body: DM Sans (pesos 400-800) · Escala: display ~23-26px / title ~20-23px / body ~12.5-14px / label ~9-11px, mayúsculas en labels de chips y botones.
- Radio: 20px cards / 16px botones / 14px chips — todo "gordo", cero esquinas afiladas.
- Dispositivo ownable: el bloque-héroe de racha (amarillo, borde grueso, emoji de fuego + número grande) como dato principal de la pantalla de cada día.
- Motion signature: a definir en Sesión 5 — el botón debe "hundirse" (perder el border-bottom) al tocar, como Duolingo.

## Trazabilidad y vetos
- Ruta de diseño: ronda 1 propuesta propia con mandato de color (azul) → ronda 2 propuesta propia con color abierto (eligió violeta, lo aprobó) → ronda 3 AJUSTE sobre lo aprobado, a partir de una captura parcial del usuario + instrucción explícita de ir más "Duolingo"/multicolor. Este historial completo queda en el repo como evidencia de decisión.
- Protocolo A/B/C: direcciones descartadas en las 3 rondas: "Casco Azul", "Turno Nocturno" (aprobada y luego revertida), "Bitácora de Pozo", "Alerta Segura", "Racha Verde", "Violeta Operativo" (aprobada y luego revertida a pedido del usuario). Páginas comparativas archivadas en `docs/revisiones/` (direcciones-abc.html, direcciones-abc-ronda2.html).
- Tour de la app: `docs/revisiones/vista-previa-app.html` (versión "Casco de Oro") · vistas incluidas: pantalla principal (M0), **ruta de aprendizaje / mapa de módulos** (sección "Progreso" — secundaria, NO la home, a pedido explícito del usuario tras ver que Duolingo usa ese patrón), onboarding, paywall, hero de landing (réplica fiel a la captura del usuario en el nuevo color) y pase digital QR · aprobado por el usuario: SÍ (2026-10-15).
- Paleta derivada de: Duolingo (líder del nicho, ya documentado en FICHA-MODELO.md) + la instrucción directa del usuario de ir a bloques grandes/multicolor.
- Registro anti-repetición: amarillo+verde+azul+rojo sobre blanco cálido y par Baloo 2+DM Sans quedan vetados para el próximo proyecto del SO, junto con las 5 direcciones descartadas en rondas anteriores.
- Modo: claro, derivado por elección directa del usuario (los bloques de color necesitan fondo claro para destacar, como en Duolingo).

## Idioma UI: español latino neutro · Fecha de cierre de la ficha: 2026-10-15 · Aprobada por el usuario: SÍ
