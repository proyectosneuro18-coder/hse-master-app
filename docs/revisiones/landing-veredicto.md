# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Seccion Solucion, tras antes/despues] El argumento del codigo QR se repite 3 veces seguidas en el mismo scroll: paso 3 ("su codigo QR queda vigente"), tarjeta "Despues" ("Un codigo QR que cualquier supervisor escanea...") y el chip final ("Pase Digital QR: tu prueba diaria de competencia, no un checklist") -> fusiona el chip dentro de la tarjeta "Despues" o eliminalo, no repitas el mismo dato 3 veces en una sola seccion.
2. [Chip del Hero + parrafo final de Solucion] La sigla "IOGP" se explica dos veces casi textual en la misma pagina ("el estandar internacional de la industria petrolera" en el hero y "la asociacion internacional de productores de petroleo y gas" al cierre de Solucion) -> explica la sigla una sola vez (hero) y en la segunda mencion usa solo "IOGP" sin re-explicarla.
3. [Oferta, pie de los 2 planes] El texto de respaldo "¿No se abrio tu correo? Escribenos a ventas@hsemasterapp.com" aparece identico y seguido debajo de CADA plan (Anual y Mensual) -> consolidar en una sola nota compartida bajo ambos planes en vez de duplicarla por tarjeta.
4. [Checkmarks repetidos: badge del hero, float-chip, .stack .check, nodo del carrusel] El mismo icono de check se dibuja con stroke-width distinto en cada aparicion (2.6 / 3 / 3.2 / 3.4) -> estandarizar a un solo stroke-width (ej. 3) para que el simbolo se vea igual de grueso en toda la pantalla.
5. [Carrusel "La app por dentro", .dots] El indicador activo cambia de ancho y color de forma instantanea (sin transition) mientras el resto de controles del carrusel (flechas, boton) si animan 120-200ms -> agregar transition: background 150ms ease, width 150ms ease a .dots button.
