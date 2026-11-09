# CLAIMS-LEDGER.md — HSE Master App

Auditoría: 2026-11-02 · commit `b013d3a` · auditor: agente (Gate 61, Gate 3)

| Claim exacto | Superficie | Capacidad/ruta | Plan y límite | Prueba | Estado |
|---|---|---|---|---|---|
| "Prueba gratis de 14 días, sin tarjeta" | landing, paywall, `/legal/reembolsos` | `lib/activar-organizacion.ts` activa `trial_ends_at = now()+14d` sin pedir pago | trial, hasta 1 cuadrilla de 20 trabajadores | Leído en código; NO probado end-to-end contra Hotmart real en esta auditoría (ver PAYMENT-CERTIFICATION.md) | PARCIAL — código correcto, matriz de pago sin correr completa |
| "Tu información está segura" / RLS por organización | landing (sección de confianza, si existe) | RLS en `organizations`/`crews`/`workers`/`attempts`/`streaks` vía `private.is_org_admin`/`is_org_member` | todos los planes | Revisado el código de las 9 políticas RLS — consistente y sin agujero visible en esta pasada | real (revisión de código; falta prueba IDOR en vivo usuario A vs B) |
| "Reembolso" (plazo real) | `/legal/reembolsos` (NO en landing/paywall — se quitó en ronda 23) | 21 días, configurado en el panel de Hotmart el 2026-11-02 | todos los planes pagos | Verificado en el panel real de Hotmart (captura del usuario, "21 días") | real |
| "US$8/usuario/mes · US$80/año" | paywall | Checkout real `pay.hotmart.com/D108216311I`, precio mostrado en COP equivalente | mensual/anual | Verificado abriendo el checkout real a 375px (Sesión 9) | real |
| "El Pase" (pase QR de competencia) | landing (promesa central de venta, FICHA-MODELO.md/validación Sesión 1) | Real desde 2026-11-02: `pase_token` por trabajador, QR real en `/app/perfil`, verificación pública sin login en `/pase/[token]` vía RPC `verificar_pase` (migración 0010) | todos | Verificado en navegador 375px (QA, borrado después): QR genera, verificación muestra datos reales, token inválido maneja el error | real |
| "Vidas" (cascos, mecánica visible y predecible) | app interna (chip Hoy) | Real desde 2026-11-02: 3 vidas por intento del día, nunca bloquea | todos | Verificado en navegador (QA, borrado después) | real |
| "Ranking entre cuadrillas de tu empresa" | app interna | Real desde 2026-11-02: RPC `obtener_ranking_cuadrillas` | todos | Verificado en navegador (QA, borrado después) | real |
| "Racha de seguridad" / streaks | app interna | Real, RPC `registrar_intento` transaccional | todos | Verificado en sesiones anteriores (migración 0006) | real |
| Checkbox de consentimiento legal en el registro | `/login` | Real, bloquea el envío sin marcar | todos | Verificado en navegador 375px (Sesión 9) | real |

## RESUELTO — "El Pase" (2026-11-02)

La promesa central de venta documentada en `FICHA-MODELO.md` §7 ("un pase digital QR que
convierte la racha en algo que el jefe de turno puede verificar antes de dejarte entrar al
pozo") ya tiene implementación real. El dueño eligió construirla en vez de suavizar el copy.
Diseño: `workers.pase_token` (UUID opaco, no el user_id real) codifica un QR real (librería
`qrcode`) en `/app/perfil`; un supervisor sin cuenta lo escanea y llega a `/pase/[token]`
(página pública, sin login), que llama al RPC `verificar_pase` (SECURITY DEFINER, habilitado
para `anon`) y muestra solo nombre, cuadrilla, vigencia (racha activa hoy/ayer), racha y
competencias (módulos aprobados) — nunca email, PIN ni el historial de intentos del trabajador.
"El Pase" (insight narrativo de patrones en `app/app/page.tsx`) sigue siendo ilustrativo y
separado de esta promesa — no se vende como capacidad propia, es un botón de ayuda explicativo.

## Pendiente de completar (no bloqueante, documentado)

- No se hizo un barrido manual pantalla por pantalla de TODO el copy de venta (landing completa,
  los 9 pasos de onboarding, emails transaccionales) — se revisaron los claims de mayor peso
  (precio, prueba, reembolso, mecánica de hábito). Un barrido completo queda para antes del
  piloto cerrado (Gate 10).

## Re-auditoría 2026-11-09 (commit `dae6ef6`)

| Claim | Estado nuevo | Motivo |
|---|---|---|
| "El Pase" — competencias verificables por el supervisor | **PARCIAL** | Desde 0012 nadie puede insertar intentos directo, pero `registrar_intento` todavía recibe `p_passed` del celular: alguien con conocimientos técnicos puede marcar lecciones aprobadas sin responderlas. Hasta calificar en el servidor, el Pase prueba "hizo su reto diario", no "domina las 9 reglas". |
| "Racha de seguridad" | real | 0011 corrida de verdad en Principal (2026-11-08); antes los retos no se guardaban en producción. |
| Medición/analítica | real | PostHog activo en producción (2026-11-09). |
| "El Pase" — competencias (actualización 2026-11-09, `728ce74`) | **real** | Calificación en servidor + orden + 1 por día (0013). El Pase certifica "completó en orden N retos diarios respondidos bien". |
