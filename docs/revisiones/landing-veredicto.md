# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 28/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Hero "racha" vs carrusel slide 1] el mismo chip "9/12 MÓDULOS" tiene barra de progreso animada en el hero (línea 365, #barraModulos) pero el mockup casi idéntico del carrusel "Tu racha de seguridad, de un vistazo" (línea 480) no la tiene → agregar la misma barra-mini al chip del carrusel.
2. [Solución, nota-iogp, línea 466] pese a declararse resuelta, la nota sigue repitiendo casi literal "las 9 Reglas que Salvan Vidas... la IOGP" ya dicho en el hero (línea 353) → reescribir sin repetir esa cláusula completa.
3. [Oferta trial-strip línea 594 y FAQ línea 655] la frase "decides... la adopción real de tu cuadrilla" se repite palabra por palabra en 2 secciones → variar una de las dos redacciones.
4. [Botones de plan, script líneas 780-785] "Abriendo tu correo…" se muestra siempre tras el click aunque el cliente de correo no haya abierto de verdad (desktop sin app de correo configurada) → cambiar a un texto que no afirme un éxito no confirmado.
5. [CSS línea 117] regla `.float-chip.b` quedó huérfana (sin HTML) tras quitar el chip del QR del hero esta ronda → eliminar la regla muerta.
