# CLAIMS-LEDGER.md — HSE Master App

Auditoría: 2026-11-02 · commit `b013d3a` · auditor: agente (Gate 61, Gate 3)

| Claim exacto | Superficie | Capacidad/ruta | Plan y límite | Prueba | Estado |
|---|---|---|---|---|---|
| "Prueba gratis de 14 días, sin tarjeta" | landing, paywall, `/legal/reembolsos` | `lib/activar-organizacion.ts` activa `trial_ends_at = now()+14d` sin pedir pago | trial, hasta 1 cuadrilla de 20 trabajadores | Leído en código; NO probado end-to-end contra Hotmart real en esta auditoría (ver PAYMENT-CERTIFICATION.md) | PARCIAL — código correcto, matriz de pago sin correr completa |
| "Tu información está segura" / RLS por organización | landing (sección de confianza, si existe) | RLS en `organizations`/`crews`/`workers`/`attempts`/`streaks` vía `private.is_org_admin`/`is_org_member` | todos los planes | Revisado el código de las 9 políticas RLS — consistente y sin agujero visible en esta pasada | real (revisión de código; falta prueba IDOR en vivo usuario A vs B) |
| "Reembolso" (plazo real) | `/legal/reembolsos` (NO en landing/paywall — se quitó en ronda 23) | 21 días, configurado en el panel de Hotmart el 2026-11-02 | todos los planes pagos | Verificado en el panel real de Hotmart (captura del usuario, "21 días") | real |
| "US$8/usuario/mes · US$80/año" | paywall | Checkout real `pay.hotmart.com/D108216311I`, precio mostrado en COP equivalente | mensual/anual | Verificado abriendo el checkout real a 375px (Sesión 9) | real |
| "El Pase" (pase QR de competencia) | landing (promesa central de venta, FICHA-MODELO.md/validación Sesión 1) | NO implementado — es un botón de ayuda con un texto explicativo, sin motor de detección de patrones ni QR real | — | — | **BLOQUEANTE** — se vende como diferenciador central y no existe la función real detrás (ver abajo) |
| "Vidas" (cascos, mecánica visible y predecible) | app interna (chip Hoy) | Real desde 2026-11-02: 3 vidas por intento del día, nunca bloquea | todos | Verificado en navegador (QA, borrado después) | real |
| "Ranking entre cuadrillas de tu empresa" | app interna | Real desde 2026-11-02: RPC `obtener_ranking_cuadrillas` | todos | Verificado en navegador (QA, borrado después) | real |
| "Racha de seguridad" / streaks | app interna | Real, RPC `registrar_intento` transaccional | todos | Verificado en sesiones anteriores (migración 0006) | real |
| Checkbox de consentimiento legal en el registro | `/login` | Real, bloquea el envío sin marcar | todos | Verificado en navegador 375px (Sesión 9) | real |

## Hallazgo bloqueante — "El Pase"

La promesa central de venta documentada en `FICHA-MODELO.md` §7 y el `Reporte de validación`
(ESTADO.md) es **"un pase digital QR que convierte la racha en algo que el jefe de turno puede
verificar antes de dejarte entrar al pozo"**. En el código actual, "El Pase" es solo un recuadro
de texto fijo ("Tu Pase detectó algo: tu cuadrilla repite el mismo error...") con un botón de
ayuda — no genera ningún QR, no verifica nada en un punto de control, y el "patrón detectado" es
texto estático, no un cálculo real sobre los datos de la cuadrilla.

**Por qué es bloqueante y no solo pulido:** el Gate 3 prohíbe vender una capacidad que no existe.
Si un Gerente de HSE paga esperando poder "verificar el pase en el pozo", eso no es cierto hoy.

**Antes de abrir tráfico real, dos caminos, uno de los dos:**
1. Construir una versión real mínima del Pase (p. ej. una pantalla `/app/perfil` con un QR que
   un supervisor escanea y ve nombre + estado de racha — ya existe el dato real de racha, falta
   el QR y la pantalla de verificación del supervisor), o
2. Quitar/suavizar la promesa del Pase en landing/onboarding hasta que exista, dejando solo lo
   que sí es real (racha + ranking + capacitación diaria).

Esta decisión es del dueño del negocio (cambia la propuesta de valor central) — no se decide sola
en esta auditoría.

## Pendiente de completar (no bloqueante, documentado)

- No se hizo un barrido manual pantalla por pantalla de TODO el copy de venta (landing completa,
  los 9 pasos de onboarding, emails transaccionales) — se revisaron los claims de mayor peso
  (precio, prueba, reembolso, mecánica de hábito). Un barrido completo queda para antes del
  piloto cerrado (Gate 10).
