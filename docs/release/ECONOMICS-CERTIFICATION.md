# ECONOMICS-CERTIFICATION.md — HSE Master App

Auditoría: 2026-11-02. La app NO usa IA en tiempo de ejecución (el contenido de las 9 lecciones
es estático, escrito una vez — ver `supabase/migrations/0005_contenido_modulos.sql`), así que el
Gate 6 (consumo/caché de IA) es **N/A** en esta versión. El costo variable real es infraestructura
+ pasarela, no inferencia.

## Precio y plan

- US$8/usuario/mes · US$80/usuario/año (~US$6.67/mes efectivo) — fuente: FICHA-MERCADO.md,
  verificado en el checkout real de Hotmart el 2026-11-02.

## Costo variable estimado por usuario/mes (NO verificado con factura real — estimación)

| Rubro | Estimado | Fuente |
|---|---|---|
| Comisión Hotmart | ~9.9% + tarifa fija (varía por método de pago/país) | Hotmart Central de Ayuda — **fecha de consulta pendiente**, no se verificó en esta auditoría |
| Supabase | Plan gratuito actual (hasta 500MB BD / 50K MAU) — US$0 mientras no se exceda | panel de Supabase del usuario |
| Vercel | Plan gratuito/Hobby actual — US$0 mientras no se exceda | panel de Vercel del usuario |
| Resend (emails transaccionales) | Plan gratuito (3,000 emails/mes) — US$0 mientras no se exceda | cuenta Resend del usuario |
| IA | US$0 — no se usa IA en runtime | — |

## ⚠️ NO VERIFICADO — margen real por plan/cohorte

Este artefacto requiere, para pasar de BORRADOR a certificado:
1. El % y tarifa fija REAL que Hotmart cobra en la cuenta del dueño (varía por tarjeta/Efecty/
   PayPal — ya se vio que el checkout ofrece los 3) — se consulta en el panel de Hotmart
   ("Comisiones" o similar), con fecha.
2. Un escenario p95: cuántos usuarios simultáneos soporta el plan gratuito de Supabase/Vercel
   antes de pasar a un plan pago, y a qué costo — hoy NO hay tráfico real para medir esto.
3. El costo del plan pago de Resend si se supera el límite gratuito de emails.

Sin estos 3 datos reales, no se puede certificar el margen de contribución por plan — **se marca
NO VERIFICADO / NO APTO** en vez de inventar un número. Con cero usuarios de pago todavía, el
riesgo de un margen negativo HOY es bajo (todos los servicios están en plan gratuito), pero esto
debe recalcularse antes de abrir tráfico pagado (Gate 10), cuando el volumen real pueda acercarse
a los límites gratuitos.
