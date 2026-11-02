# PRIVACY-DATA-MAP.md — HSE Master App

Auditoría: 2026-11-02. Política pública en `/legal/privacidad` (Ley 1581 de 2012, Colombia).

## Datos recopilados

| Dato | De quién | Finalidad | Base/consentimiento | Retención | Acceso | Borrado |
|---|---|---|---|---|---|---|
| Email | Gerente de HSE | Login (magic link/Google), facturación | Checkbox en `/login` (2026-11-02) | Mientras la cuenta exista | Solo el dueño de la fila + admin de su org (RLS) | Manual por correo, 15 días hábiles — **sin botón de autoservicio** |
| Nombre completo | Trabajador | Identificarlo en su cuadrilla y en el ranking | Lo da de alta su Gerente de HSE (consentimiento del empleador, no auto-registro) | Mientras esté activo en la cuadrilla | Su propio registro + admin de su org (RLS) | Manual, mismo proceso |
| PIN (hash bcrypt) | Trabajador | Autenticarlo sin contraseña visible | Asignado por el Gerente de HSE | Mientras la cuenta exista | Nunca legible, solo hash comparado server-side | Se borra al borrar el usuario |
| Intentos de lección (`attempts`) | Trabajador | Calcular racha, módulos aprobados y ranking de cuadrilla | Parte del servicio contratado | Indefinida mientras la cuenta exista | Propio + admin de su org (RLS); el RPC de ranking agrega sin exponer el intento individual a otros trabajadores | Manual |
| Dirección IP / logs de red | Todos los visitantes | Seguridad (anti-abuso), operación | Vercel (proveedor de hosting) | Según política de retención de Vercel (no configurada explícitamente por el dueño) | Vercel + el dueño del proyecto | No aplica borrado por ticket individual |
| Pago (tarjeta, Efecty, PayPal) | Quien paga | Cobrar la suscripción | Lo procesa Hotmart directamente | Según política de Hotmart | **Nunca llega a la base de datos propia** — solo el resultado del webhook (monto, moneda, estado) | No aplica (no se guarda el dato de pago) |

## Terceros con acceso a datos personales

Supabase (base de datos), Vercel (hosting), Resend (emails transaccionales), Hotmart (pago) — los
4 ya están nombrados en `/legal/privacidad` con su función.

## ⚠️ Hallazgos — Gate 4

1. **Sin botón de autoservicio para exportar/eliminar datos.** El proceso es 100% manual (correo
   a soporte, 15 días hábiles) — el Gate 9/10 exige que exportación/borrado se prueben E2E desde
   la app; hoy no existe ese flujo en la app, solo la promesa en texto legal. **BLOQUEANTE para
   certificación plena**, aunque es un mínimo legal aceptable para operar con pocos usuarios.
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
