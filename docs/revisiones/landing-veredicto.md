# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Mockup del hero + 4 slides del carrusel] El centrado vertical ya funciona como mecanismo, pero el margin-top heredado (24-32px) en el primer hijo de .scr/.in queda dentro del bloque que se centra, así que el contenido visible queda ~12-16px por debajo del centro real del marco en los 5 mockups -> eliminar esos margin-top inline, ya redundantes con justify-content:center.
2. [Chip flotante "LOTO completado", hero] Usa la sigla tecnica sin traducir mientras 2 secciones mas abajo (carrusel, "Las 9 Reglas") el mismo concepto se llama "Aislamiento de energia" -> unificar a "Aislamiento de energia (LOTO) completado" la primera vez que aparece.
3. [Hero, primer viewport] Los 4 acentos (rojo del badge, amarillo del bloque racha, verde del CTA, azul en palabras clave) aparecen todos juntos sin que ninguno domine en los primeros 3 segundos -> mantener el verde como unico acento saturado grande en el hero y bajar la presencia simultanea de rojo+amarillo+azul en ese primer tramo.
4. [Header, logo] El logo enlaza a href="#" sin accion clara de "volver al inicio" en una landing de una sola pagina -> apuntarlo a un ancla superior explicita (#top) con aria-label="Ir al inicio" o quitar el href interactivo.
5. [Accesibilidad de teclado, todo el documento] No hay skip-link antes del header sticky; un usuario de teclado debe tabular el logo antes de llegar al CTA del hero -> agregar un enlace "Saltar al contenido" oculto hasta recibir foco.
