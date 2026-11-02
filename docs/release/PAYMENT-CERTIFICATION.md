# PAYMENT-CERTIFICATION.md — HSE Master App

Auditoría: 2026-11-02 · commit `b013d3a` · producto Hotmart ID 8821424 (Aprobado)

## Arquitectura (revisión de código, real)

- Ledger: `payment_transactions` (economía) + `webhook_log` (técnico, dedupe por `event_id`) +
  `organizations.subscription_status` (acceso) — tres capas separadas, como pide el Gate 2.
- `apply_hotmart_event` (SECURITY DEFINER, `supabase/migrations/0003_hotmart_webhook.sql`):
  aplica el evento de forma atómica, máquina de estados monotónica (`statusForEvent` en
  `lib/membership-fsm.ts`), nunca invocable por `anon`/`authenticated` (revocado explícitamente).
- hottok verificado en tiempo constante (`lib/hotmart-verify.ts`, `crypto.timingSafeEqual`),
  fail-closed si falta la variable de entorno.
- Anti-replay: ventana de 5 minutos sobre `creation_date`/`approved_date`.
- Idempotencia: `event_id` es `payload.id ?? payload.event_id ?? transaction ?? compuesto
  determinista` — nunca `Date.now()`.

## ✅ RESUELTO — allowlist de catálogo activa (2026-11-02)

`EXPECTED_PRODUCT_ID = process.env.HOTMART_PRODUCT_ID` en `app/api/webhooks/hotmart/route.ts`
estaba sin configurar en Vercel. El dueño agregó `HOTMART_PRODUCT_ID = 8821424` en Production y
redesplegó (commit `b013d3a`, confirmado como despliegue activo en Vercel). El webhook ya rechaza
eventos de cualquier producto de la cuenta Hotmart distinto de HSE Master App.

## Matriz de certificación real (Gate 2)

| Prueba | Estado |
|---|---|
| Trial mensual: día 0 → acceso → aviso pre-cobro → primer cobro | NO VERIFICADO — requiere esperar el ciclo real o una compra de prueba |
| Trial anual: día 0 → acceso → aviso pre-cobro → primer cobro | NO VERIFICADO (mismo motivo) |
| Cancelación durante trial → no cobro futuro | NO VERIFICADO |
| Cancelación mensual/anual pagada → acceso hasta fin de periodo | Revisado en código (`cancel_at_period_end`/`access_until` en el FSM) — NO probado contra Hotmart real |
| Pago rechazado → past_due → gracia (5 días, `GRACE_DAYS`) → recuperación | Revisado en código — NO probado |
| Reenvío del mismo `event_id` → sin doble efecto | Revisado en código (`webhook_log` + `apply_hotmart_event` idempotente) — NO probado con un reenvío real |
| APPROVED + COMPLETE de una transacción → un solo ingreso | Revisado en código (`economic_kind` + `transaction_id` únicos) — NO probado |
| Producto/oferta/importe ajenos → rechazados | RESUELTO (2026-11-02) — allowlist activa, ver arriba |
| Fallo después del webhook → retry completa acceso | NO VERIFICADO |
| Reembolso y contracargo → acceso/ledger correctos | Test de Hotmart dio 400 en estos 2 eventos por fecha vieja del payload de ejemplo (causa identificada, ver ESTADO.md `webhook-hotmart-400-fecha-vieja-test`) — pendiente confirmar con un evento real |
| Compra con email distinto → reconciliación sin cuenta huérfana | El botón "Suscribirme ahora" ya precarga `?email=` del dueño de la cuenta para mitigar el desajuste — NO probado con un email deliberadamente distinto |
| Reconciliación de entitlements (job semanal) | **NO EXISTE** — no hay job que compare Hotmart vs. estado interno |

## Veredicto de este artefacto

**NO APTO.** El código del ledger y el webhook están bien construidos (hottok, replay,
idempotencia, FSM), pero:
1. La allowlist de producto está apagada (bloqueante, corrección de 2 minutos).
2. Ninguna fila de la matriz de pago real se probó de punta a punta contra el Hotmart en
   producción — probarlas cuesta una compra de prueba real (dinero), así que requiere
   autorización explícita del dueño antes de ejecutarse.
3. Falta el job de reconciliación semanal.

No se ejecuta ninguna compra real sin que el dueño lo autorice primero.
