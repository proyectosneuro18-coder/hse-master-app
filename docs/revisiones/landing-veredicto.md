# VEREDICTO revisor-visual — landing
Fecha: 2026-10-16 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sistema global de botones/tarjetas, todas las secciones] el mecanismo visual dominante (borde grueso + border-bottom de 6px que se "hunde" al tocar + tarjeta redondeada con sombra) sigue siendo IDÉNTICO al patrón de interacción de Duolingo; la cinta de peligro, el casco y el QR suman color de marca propio pero no cambian la GRAMÁTICA de forma que un ojo entrenado reconoce de inmediato → diseñar 1 forma de tarjeta/botón propia del mundo HSE (ej. ficha de permiso con borde perforado/"tear-off", o un mecanismo de presión distinto al de Duolingo) para que la identidad no dependa solo de color e íconos.
2. [Hero, mockup del teléfono, botón "Empezar mi reto"] dentro de lo que se lee como una captura real de la app hay un botón visiblemente atenuado al 55% de opacidad — a simple vista parece un control roto/deshabilitado, aunque esté marcado aria-hidden en el código → quitar el botón del mockup o mostrarlo a opacidad completa con una etiqueta visible "vista previa" encima del teléfono.
3. [Código completo, ninguna sección] de las 7 animaciones baseline del eje de movimiento, 2 están totalmente ausentes: no existe NINGÚN modal/diálogo en toda la página (el FAQ usa <details>, no un modal) y no hay ninguna celebración de hito real → agregar al menos un modal suave (ej. "ver demo" abre un diálogo con fade+scale) o documentar en ESTADO.md por qué esta pantalla no necesita modal/celebración.
4. [Toda la página] conviven al mismo tiempo cinta de peligro, bordes punteados, hairlines degradé, bordes gruesos de cómic, sombras de botón "presionable", chips flotantes y checks en círculo — son muchos dispositivos decorativos corriendo a la vez y diluyen cuál es EL sello propio de la marca → quedarse con 1-2 dispositivos protagonistas (cinta de peligro + sello QR) y bajar el resto a un uso más discreto.
5. [Sección Oferta, tarjeta "Mensual"] el CTA del plan mensual es solo texto subrayado ("Quiero el plan mensual") apilado entre precio, nota y el texto de respaldo del correo — cuatro líneas de texto pequeño seguidas sin un botón real, lo que hace que el plan secundario se sienta un control muerto más que una acción → darle al CTA mensual un trato de botón secundario (contorno) en vez de un link de texto plano.
