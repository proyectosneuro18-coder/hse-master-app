# PRIVACY-DATA-MAP.md — HSE Master App

Auditoría: 2026-11-02. Política pública en `/legal/privacidad` (Ley 1581 de 2012, Colombia).

## Datos recopilados

| Dato | De quién | Finalidad | Base/consentimiento | Retención | Acceso | Borrado |
|---|---|---|---|---|---|---|
| Email | Gerente de HSE | Login (magic link/Google), facturación | Checkbox en `/login` (2026-11-02) | Mientras la cuenta exista | Solo el dueño de la fila + admin de su org (RLS) | Autoservicio en `/panel` → "Tus datos" (2026-11-07): descargar + eliminar cuenta |
| Nombre completo | Trabajador | Identificarlo en su cuadrilla y en el ranking | Lo da de alta su Gerente de HSE (consentimiento del empleador, no auto-registro) | Mientras esté activo en la cuadrilla | Su propio registro + admin de su org (RLS) | El Gerente lo elimina desde `/panel` (editar trabajador → Eliminar definitivamente); el trabajador lo pide a su Gerente o a soporte |
| PIN (hash bcrypt) | Trabajador | Autenticarlo sin contraseña visible | Asignado por el Gerente de HSE | Mientras la cuenta exista | Nunca legible, solo hash comparado server-side | Se borra al borrar el usuario |
| Intentos de lección (`attempts`) | Trabajador | Calcular racha, módulos aprobados y ranking de cuadrilla | Parte del servicio contratado | Indefinida mientras la cuenta exista | Propio + admin de su org (RLS); el RPC de ranking agrega sin exponer el intento individual a otros trabajadores | Se borra en cascada al eliminar al trabajador o la cuenta |
| Dirección IP / logs de red | Todos los visitantes | Seguridad (anti-abuso), operación | Vercel (proveedor de hosting) | Según política de retención de Vercel (no configurada explícitamente por el dueño) | Vercel + el dueño del proyecto | No aplica borrado por ticket individual |
| Pago (tarjeta, Efecty, PayPal) | Quien paga | Cobrar la suscripción | Lo procesa Hotmart directamente | Según política de Hotmart | **Nunca llega a la base de datos propia** — solo el resultado del webhook (monto, moneda, estado) | No aplica (no se guarda el dato de pago) |

## Terceros con acceso a datos personales

Supabase (base de datos), Vercel (hosting), Resend (emails transaccionales), Hotmart (pago) — los
4 ya están nombrados en `/legal/privacidad` con su función.

## ⚠️ Hallazgos — Gate 4

1. ~~Sin botón de autoservicio para exportar/eliminar datos.~~ **RESUELTO (2026-11-07).** En
   `/panel` → "Tus datos": "Descargar mis datos" (`GET /api/admin/datos`, archivo JSON con
   empresa, cuadrillas, trabajadores y retos — sin PIN ni token del Pase, leído con la sesión del
   gerente bajo RLS) y "Eliminar mi cuenta y todos los datos" (`DELETE /api/admin/datos`: solo el
   dueño, confirmación "ELIMINAR", bloqueado si hay cobro vigente en Hotmart; borra cuentas de
   trabajadores → retos/rachas/Pases en cascada, empresa → cuadrillas/membresías, y la cuenta del
   dueño). Más "Eliminar definitivamente" por trabajador (`DELETE /api/admin/workers`, exige rol
   owner/admin + que el trabajador sea de su empresa). Probado E2E contra la base de desarrollo
   con 2 empresas de prueba: export sin datos de la otra empresa ni PIN; borrar trabajador de
   OTRA empresa → 404; eliminar cuenta con cobro activo → 409; tras eliminar, todo en 0 y la otra
   empresa intacta. Se conserva `payment_transactions` (sin datos personales, obligación
   contable) y `webhook_log` (sin datos personales). Política `/legal/privacidad` §6 actualizada.
2. **No hay separación de buckets de Storage** porque la app todavía no sube archivos (fotos,
   documentos) — N/A por ahora; si se agrega esa función, debe nacer con buckets privados + RLS
   por carpeta desde el día uno (regla dura del Gate 4).
3. **No hay ledger de consentimiento versionado** (quién aceptó qué versión del texto legal y
   cuándo) — el checkbox de `/login` (2026-11-02) registra la aceptación en el momento del login
   (implícito en la creación de la cuenta vía Supabase Auth), pero no hay una tabla que guarde
   "aceptó la versión X de los Términos el día Y". Para el volumen actual (pre-lanzamiento) no es
   bloqueante; se vuelve obligatorio antes de escalar a cientos de usuarios.
4. **Retención de IP/logs de Vercel no está documentada explícitamente** en la política de
   privacidad — ajuste menor de copy, no técnico.
5. **Sin age gate.** El producto es B2B para personal adulto de empresas petroleras — bajo
   riesgo de menores, pero no hay una declaración activa de "soy mayor de edad" en el registro
   (solo en el checkout de Hotmart, que sí la exige). Aceptable para este nicho, documentado.

## Veredicto de este artefacto

**PARCIAL.** La arquitectura de datos (RLS, qué llega a quién) es correcta y verificable en
código. Falta el autoservicio de exportación/borrado y el ledger de consentimiento versionado
para una certificación plena — ninguno de los dos requiere tocar dinero, así que quedan como
mejora técnica pendiente, no bloqueante para seguir operando a bajo volumen.

## Actualización 2026-11-09 (re-auditoría, commit `dae6ef6`)

- **Exportar/borrar**: RESUELTO desde la Sesión 12 (punto 1 arriba). El veredicto de este
  artefacto ya no depende de eso.
- **Medición de producto (PostHog, US Cloud)**: activa en producción desde 2026-11-09. Finalidad:
  embudo y activación. Sin nombre, correo ni PIN en ninguna petición (verificado en Sesión 13 con
  clave falsa interceptando peticiones). Sin grabación de sesiones, sin mapas de calor, sin
  autocaptura (desactivados en el código y en el panel de PostHog). Persistencia en el navegador
  solo si el visitante acepta el aviso de cookies; si no, en memoria. `person_profiles:
  identified_only`. Retención: la del plan Free de PostHog (1 año).
- **Intentos de PIN fallidos**: nueva tabla `worker_login_failures` (0012) — solo id del
  trabajador, contador y hasta cuándo está bloqueado; sin PIN ni IP. Se borra al entrar bien, al
  cambiar el PIN y en cascada al borrar al trabajador. Solo la lee el servidor.
- Siguen abiertos: ledger de consentimiento versionado (punto 3) y retención de logs de Vercel en
  la política (punto 4) — no bloqueantes a bajo volumen.

**Veredicto actualizado: PARCIAL (aceptable para piloto cerrado).**
