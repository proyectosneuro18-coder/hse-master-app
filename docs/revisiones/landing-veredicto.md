# VEREDICTO revisor-visual — landing
Fecha: 2026-10-15 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Sección Oferta, h2 "14 días gratis de El Pase de los 3 Minutos…"] y [CTA final, h2 "Imagina abrir tu panel mañana a las 5 AM…"] — ambos titulares de las dos secciones de mayor peso de conversión están en texto plano, sin ninguna palabra clave resaltada en color de acento (a diferencia del Hero y la Solución, que sí usan `<em>`/`<span class="mec">`) → envolver "El Pase de los 3 Minutos"/"14 días gratis" y "5 AM"/"10 segundos" en el mismo tratamiento de énfasis azul que ya usan Hero y Solución.
2. [Botones mailto "Quiero mi prueba gratis" / "Elegir el plan mensual", sección Oferta y CTA final] — el CTA principal de conversión abre el cliente de correo del sistema sin ninguna señal en el instante del clic; si el cliente de correo tarda o no está configurado, el usuario no sabe si pasó algo (la línea de respaldo existe pero está fuera del momento del clic) → agregar micro-feedback inmediato (ej. texto del botón cambia a "Abriendo tu correo…" por 1-2s tras el clic).
3. [Hero, chip con check verde antes del texto "Basado en las 9 Reglas…"] — `.prueba-industria .chip` usa `border-radius: 8px` mientras el resto de chips del kit (`.float-chip`, `.mini-chip`) usan 14px → unificar a 14px.
4. [Barra fija inferior "Quiero mi prueba gratis" que aparece al hacer scroll] — no tiene forma de cerrarse/descartarse; queda fija el resto del recorrido sin control del usuario → agregar botón "x" para descartarla.
5. [Footer legal, 3 enlaces] — "Política de Privacidad / Términos / Reembolso" muestran "(pendiente)" visible a cualquier visitante real de una app de cumplimiento de seguridad, lo cual es un punto de fricción de credibilidad aunque esté aceptado como limitación de esta fase → completar antes de tráfico pagado real (Sesión Legal).
