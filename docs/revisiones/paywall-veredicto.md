# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-17 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 33/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Titular, palabra "listo" — paywall.html línea 49 `.pw-headline em { color: var(--azul-sombra); }` con la variable definida en línea 21 `--azul-sombra: #0a4299`] Contraste medido de #0a4299 sobre el fondo crema/blanco inmediato ≈2.2:1 — por debajo del mínimo 3:1 que exige incluso texto grande en negrita (WCAG AA), pese a que la FICHA-ARTE documenta este tono como "palabra clave destacada en headline" → fix: oscurecer/saturar el azul (ej. #063a85) y reverificar ≥3:1 contra `--bg`/`--surface` antes de reusarlo en otro headline.
2. [Estructura completa de la pantalla: timeline "Hoy / Día 12 / Día 14" + tarjetas de plan con check + badge de descuento + garantía + CTA verde] Reproduce casi punto por punto la composición del paywall de prueba gratis de Duolingo (mismo patrón de 3 hitos temporales, misma lógica de tarjetas con check, mismo tipo de badge y garantía), pese a la rotación de hue documentada en FICHA-ARTE — un usuario que ya usó el trial de Duolingo lo reconoce de inmediato como la misma plantilla → fix: diferenciar la composición (ej. timeline horizontal, o incorporar el dispositivo ownable propio de la app — el bloque-héroe de racha — en este flujo) para que el kit deje de ser intercambiable con el de Duolingo.
3. [Espaciado fuera de la escala mecánica 4·8·12·16·24·32: línea 50 `.pw-emocion { margin-top: 10px; }`, línea 94 `.pw-plan .tag { padding: 4px 10px; }`, línea 101 `.pw-plan .total { margin-top: 6px; }`] Tres valores (10px, 10px, 6px) no pertenecen a la escala que el sistema exige para todo el espaciado — un ojo entrenado los detecta como números "intermedios" no intencionales → fix: ajustar a 8px/12px de la escala en los tres casos y confirmar que no rompen el layout del badge.
4. [Mensaje de error — paywall.html línea 192, `#pwError`] "Algo falló al continuar. Reintentar" cumple qué-pasó+qué-hacer mínimamente pero no distingue causas (sin conexión vs. error del servidor) — un usuario que lo vea no sabe si debe revisar su señal o simplemente tocar de nuevo → fix: diferenciar al menos el caso de red ("Parece que no tienes señal, reintenta cuando vuelva") del genérico.
5. [CTA "Crear mi acceso y activar la prueba" — paywall.html línea 279, dentro de `activarPrueba()`] El texto "Activando…" (línea 276) y el `disabled` se fijan en el mismo tick síncrono en el que ocurre `window.location.href = 'login.html'` — el estado de carga es puramente cosmético en este prototipo porque nunca llega a percibirse; al conectar el flujo real con latencia de red, falta verificar que el estado persista durante la espera real antes de navegar.
