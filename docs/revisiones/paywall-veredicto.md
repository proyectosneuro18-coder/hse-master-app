# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Selector de plan — div.pw-plan "Anual"/"Mensual"] No es operable por teclado: no tiene role, tabindex ni manejador de tecla (solo `addEventListener('click', ...)` en código); un usuario de teclado o lector de pantalla no puede cambiar al plan Mensual → agregar `role="radio"` + `tabindex="0"` + manejo de Enter/Espacio al grupo de planes.
2. [Precio y confianza — `.pw-plan .nota` 12px, `.pw-trust` 12px] El texto que informa el cobro futuro ("Se cobra US$80/usuario/año") y la privacidad de datos va a 12px, por debajo del mínimo de 14px para texto de lectura que el propio sistema exige (ya corregido 2 veces antes en la landing por el mismo motivo) → subir estos dos textos a 13-14px mínimo.
3. [Encabezado — botón "X" superior derecho] El ícono es una X universal de "cerrar/salir" pero el `aria-label="Volver"` y el destino es `onboarding.html` (retroceder un paso, no cerrar el flujo) — mezcla dos semánticas distintas → usar flecha de "volver" si el destino es retroceder, o aclarar que es "cerrar y volver al inicio" si el destino cambia a `landing.html`.
4. [Toda la pantalla — copy] No retoma ninguna escena de dolor concreta de FICHA-AVATAR.md (firmas por compromiso, miedo a la auditoría, miedo a la fatalidad) — es 100% mecánico/transaccional (fechas, precios, condiciones), lo que deja el eje de Emoción del copy en 2/4 (por debajo del piso de la rúbrica) → sumar 1 línea de reconexión emocional antes del timeline, p. ej. "Para que nunca más firmen la charla por compromiso."
5. [Radios de tarjeta — `.pw-plan` 18px vs `.pw-bloque` 20px] Dos tipos de tarjeta en la misma pantalla usan radios distintos, contra FICHA-ARTE.md que fija 20px para cards → unificar `.pw-plan` a 20px.
