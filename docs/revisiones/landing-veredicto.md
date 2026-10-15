# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 32/40
Craft: 17/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Oferta, plan "Mensual", botón "Empezar prueba gratis"] Contraste medido (luminancia relativa real) del fill `--amarillo-sombra` (#E0A500) contra el fondo de su propia tarjeta `--bg` (#FFFAF0) es 2.11:1 — por debajo del mínimo 3:1 exigido para un CTA. Es el botón de pago real más barato y el que menos se percibe. Fix: oscurecer el amarillo del botón (no el de badges) o darle un tratamiento de fondo distinto para que el fill por sí solo supere 3:1.
2. [Footer legal, enlace "soporte@hsemasterapp.com"] El único enlace funcional del footer comparte exactamente color (#CFCFCF), tipografía y ausencia de subrayado con los 3 `<span>` "(pendiente)" vecinos; la única pista de que es clickeable es la AUSENCIA de la etiqueta "(pendiente)" — invisible en touch, donde no hay cursor que lo delate (verificado en computed styles: mismo `color`, mismo `text-decoration: none`, solo difiere `cursor: pointer` vs `auto`). Fix: dar al `mailto` un tratamiento visual propio (subrayado o acento) en vez de depender de inferencia por eliminación.
3. [Oferta, tarjeta "Anual" vs "Mensual"] Ambas tarjetas ejecutan la MISMA acción ("empezar prueba") pero usan botones de distinto nivel semántico de color — verde (acción principal, según FICHA-ARTE) en el plan recomendado y amarillo (secundaria, según la misma ficha) en el Mensual — lo que además agrava el defecto #1 al concentrar el contraste más débil justo en la única acción de pago que queda sin resaltar. Fix: unificar a verde los dos botones de "empezar prueba" y reservar el amarillo para otro tipo de acción.
4. [Sección "¿Te suena familiar?" (5 tarjetas) y FAQ (6 ítems)] Ambas listas superan el límite de 4-5 ítems "antes de pedir scroll o agrupar" del gate de carga cognitiva; el patrón (grid/accordion) es razonable pero no ofrece ninguna agrupación o jerarquía adicional dentro de la lista larga. Fix: si la lista crece, agrupar por tema o colapsar las últimas bajo un "ver más".
5. [Header / navegación general] No existe un control explícito de "volver arriba" aparte de tocar el logo sin etiqueta ni ícono dedicado, en una landing de 10 secciones largas a 375px donde ya existe una sticky-cta inferior que demuestra que el patrón de controles flotantes es viable. Fix: agregar un botón flotante de "subir" visible tras cierto scroll, simétrico a la sticky-cta ya implementada.
