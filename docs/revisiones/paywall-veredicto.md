# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-22 00:00
Screenshot: docs/revisiones/paywall-375.png (+ docs/revisiones/paywall-375-b.png, mitad inferior)
Usabilidad: 36/40
Craft: 14/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Código — contador de precio, `<p class="precio" aria-live="polite">` en ambos planes] El `aria-live="polite"` se puso directo sobre el nodo que `contarNumero()` reescribe en CADA `requestAnimationFrame` durante 550ms (~30+ mutaciones de texto por contador). Un lector de pantalla en cola "polite" va a anunciar fragmentos del conteo en lugar de un precio limpio ("6", "6.1", "6.3"... hasta "6.67") — ruido, no claridad. Fix: saca el `aria-live` del nodo que anima cuadro a cuadro; expón el valor a accesibilidad en un paso aparte (ej. solo fijar/anunciar el texto final cuando `tick` termina, o usar un segundo `<span>` visualmente oculto con `aria-live` que se actualiza una sola vez al resolver la animación). No afecta a usuarios con `prefers-reduced-motion` (ahí el texto se fija una sola vez, sin este problema).

Nota de techo de ronda: fuera de este punto, no se encontraron defectos nuevos y genuinos — el resto de observaciones posibles (seis tamaños tipográficos en vez de un máximo teórico de tres, la identidad visual tipo "Duolingo con otro color") son o bien matices subjetivos dentro de un sistema ya consistente y documentado, o bien la misma limitación de identidad (eje 3 de craft) que la Sesión 4 ya dejó registrada como decisión deliberada del usuario en FICHA-ARTE.md (ronda 23) — repetirla como "defecto" violaría la instrucción explícita de no repetir lo ya decidido. La usabilidad llegó al umbral (36/40); el craft (14/20) tiene su techo real en el eje de identidad (2/4): esa pieza específica no se resuelve con más código de esta ronda, sino con una conversación de dirección de arte con el usuario (una nueva variante visual que se distancie más de Duolingo) si se quiere subir el puntaje de craft. Hasta entonces, esta pantalla probablemente ya alcanzó su techo de pulido razonable para iteración autónoma.
