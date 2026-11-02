# CERTIFICADO DE PUBLICACION — HSE Master App

> Evidencia operativa sin secretos. Estado permitido: `PASS`, `BLOCKED`, `NOT_APPLICABLE`,
> `NOT_VERIFIED` (el agente no tiene acceso directo al panel de Vercel/Supabase y no debe inferir
> esto desde un ZIP o una captura vieja — ver 61-INTEGRIDAD-DE-LANZAMIENTO.md Gate 9).

## Identidad

| Campo | Valor no sensible | Estado | Evidencia |
|---|---|---|---|
| Local root | `D:\Downloads\Claude\HSE MasterApp` | PASS | — |
| GitHub owner/repo | `proyectosneuro18-coder/hse-master-app` | PASS | `git remote -v`, Sesión 7 |
| Git remote origin | `https://github.com/proyectosneuro18-coder/hse-master-app.git` | PASS | `git remote -v` |
| Default branch | `master` | PASS | `git status` |
| Vercel scope/project | "hse-master-app", importado del repo de arriba | PASS (documentado en ESTADO.md Sesión 6) | ESTADO.md línea 157 |
| Vercel connected repository | mismo repo de arriba (Connected Git Repository) | PASS (documentado) | ESTADO.md Sesión 6 |
| Vercel production branch | `master` (asumido, no re-verificado en esta auditoría) | NOT_VERIFIED | — |
| Vercel root directory | raíz del repo (asumido) | NOT_VERIFIED | — |
| Supabase Production project-ref | único proyecto "Principal" | PARCIAL — existe un solo proyecto, usado también como dev (ver abajo) | ESTADO.md línea 144 |
| Supabase Preview/Dev project-ref | **NO EXISTE** — mismo proyecto que producción | BLOCKED | ESTADO.md línea 144: "este único proyecto Supabase... se está usando también como entorno de desarrollo" |
| Production domain | `hse-master-app.com` (propio, propagado) + `hse-master-app.vercel.app` | PASS (documentado) | ESTADO.md Sesión 6, punto 9 |

## Cadena de publicación (P0-P8, ver `62-PUBLICACION-SEGURA-Y-CONTINUA.md`)

| Gate | Estado | Evidencia |
|---|---|---|
| P0 inventario coincide | NOT_VERIFIED | no se re-corrió en esta auditoría |
| P1 preflight/GitHub | PASS | repo conectado y usado activamente (18 commits de esta sesión, todos vía `git push` real) |
| P2 GitHub -> Vercel persistente | PASS (documentado) | auto-deploy confirmado en Sesión 6 |
| P3 Supabase target + dry-run + history | NOT_VERIFIED | el agente no corre `supabase db push --dry-run` directo — las migraciones se corren manualmente por el dueño en el SQL Editor (patrón establecido, ver ESTADO.md) |
| P4 variables aisladas por ambiente | **BLOCKED** | un solo proyecto Supabase para dev y producción — variables de Vercel sí parecen estar solo en Production (no re-verificado) |
| P5 Preview automático desde Git | NOT_VERIFIED | no se probó un PR/branch de Preview en esta auditoría |
| P6 dominio/Auth/callbacks | PASS (documentado) | Site URL/Redirect URLs de Supabase Auth corregidas a producción en Sesión 6 |
| P7 Production automático + SHA | PASS | el dueño confirmó en Vercel (captura 2026-11-02): el deployment `B013D3A` está marcado "Actualidad" en Producción — coincide exactamente con `git_sha` de RELEASE-MANIFEST.json |
| P8 segunda publicación + reversión automáticas | NOT_VERIFIED | no se hizo un commit canario de prueba en esta auditoría |

## Evidencia de commits

```text
production_git_sha: b013d3a4f4cb26512c23851a66317b39d26fd07c (confirmado en Vercel, captura 2026-11-02)
vercel_git_sha: b013d3a (coincide)
api_version_sha: no existe un endpoint /api/version todavía (recomendado, Gate 9)
production_deployment_id: 8455ipjz7
preview_canary_sha: NO_PROBADO
production_canary_sha: NO_PROBADO
revert_canary_sha: NO_PROBADO
automatic_updates_verified: true — confirmado que `git push` dispara el deploy automático (lista completa de despliegues en Vercel, cada commit reciente tiene su propio deployment)
production_sha_match: true
```

## Variables por ambiente

No se listan valores. Nombres conocidos por `.env.example` y por lo documentado en ESTADO.md:

| Nombre | Pública/secreta | Development | Preview | Production | Redeploy verificado |
|---|---|---:|---:|---:|---:|
| `NEXT_PUBLIC_SUPABASE_URL` | pública | sí (local `.env.local`) | NOT_VERIFIED | sí (documentado) | NOT_VERIFIED |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | pública | sí | NOT_VERIFIED | sí | NOT_VERIFIED |
| `SUPABASE_URL` | secreta (uso server) | sí | NOT_VERIFIED | sí | NOT_VERIFIED |
| `SUPABASE_SECRET_KEY` | secreta | sí | NOT_VERIFIED | sí | NOT_VERIFIED |
| `RESEND_API_KEY` | secreta | NOT_VERIFIED | NOT_VERIFIED | sí (documentado) | NOT_VERIFIED |
| `EMAIL_FROM` | pública | NOT_VERIFIED | NOT_VERIFIED | sí | — |
| `HOTMART_HOTTOK` | secreta | NOT_VERIFIED | NOT_VERIFIED | sí (documentado, probado con test real de Hotmart) | sí (Sesión 6) |
| `HOTMART_PRODUCT_ID` | pública | NOT_VERIFIED | NOT_VERIFIED | sí (agregada 2026-11-02, valor `8821424`) | sí — redesplegada y confirmada como "Actualidad" en Vercel (commit `b013d3a`) |

```text
secrets_shared_in_chat: false
production_secrets_in_preview: NOT_VERIFIED (no hay ambiente Preview separado de Production en Supabase)
secret_scan_local: PASS — no se encontraron secretos en el código fuente auditado (solo nombres de variables)
secret_scan_ci_or_provider: NOT_APPLICABLE — no existe CI configurado todavía
rotation_required: false
```

## Dependencias de URL

| Sistema | Configuración | URL/patrón no sensible | Prueba |
|---|---|---|---|
| Vercel | dominio/SSL/canonical | `hse-master-app.com` | NOT_VERIFIED en esta auditoría (documentado como propagado, Sesión 6) |
| App | site/base URL | `https://hse-master-app.com` | NOT_VERIFIED |
| Supabase Auth | Site URL | corregida a producción (Sesión 6) | PASS (documentado) |
| Supabase Auth | redirect allowlist | corregida a producción (Sesión 6) | PASS (documentado) |
| OAuth | callback/origin (Google) | NOT_VERIFIED en esta auditoría | — |
| Resend | dominio/enlaces | `hse-master-app.com`, DKIM/DMARC verificados (Sesión 6) | PASS (documentado) |
| Pagos | return/cancel URL (Hotmart) | checkout real abierto y probado (Sesión 9) | PASS |
| Webhooks | endpoint | `https://hse-master-app.vercel.app/api/webhooks/hotmart` | PASS — 6/8 eventos de test dieron 200 (Sesión 6); 2 dieron 400 por fecha vieja del payload de ejemplo, causa identificada y no bloqueante |
| Analytics | dominio/origen | **NO EXISTE analítica instalada todavía** (Gate 10) | BLOCKED |

## Supabase

```text
supabase_target_verified: PARCIAL — un solo proyecto, sin separar dev/producción (ver Identidad arriba)
migration_list_match: NOT_VERIFIED — el dueño corre las migraciones manualmente, no hay verificación automática de que 0001-0009 estén todas aplicadas
db_push_dry_run_reviewed: false — no existe supabase CLI conectado en este flujo de trabajo
production_remote_reset_used: false
production_seed_used: false — correcto, nunca se sembró producción; todo seed de prueba se hizo con cuentas QA temporales y se borró después
rls_idor_test: PASS (revisión de código) / NOT_VERIFIED (prueba en vivo usuario A vs usuario B)
advisors: NOT_VERIFIED — no se revisó el panel de "Advisors" de Supabase en esta auditoría
```

## Pruebas en URL final (producción real)

| Flujo | Estado | Evidencia |
|---|---|---|
| Landing/onboarding/paywall | NOT_VERIFIED en producción esta sesión | probado en `localhost` durante construcción, no re-verificado en `hse-master-app.com` |
| Registro/login/logout/reset | PASS (parcial) | magic link verificado en producción real en Sesión 6; el checkbox de consentimiento (2026-11-02) solo se probó en local |
| Acción core (reto diario) | NOT_VERIFIED en producción esta sesión | probado en local con cuentas QA |
| Pago/webhook/entitlement | PARCIAL | webhook probado con eventos de TEST de Hotmart (Sesión 6); checkout real abierto sin completar una compra (Sesión 9) |
| Email transaccional | NOT_VERIFIED en esta auditoría | configurado y con dominio verificado; no se confirmó un envío real en esta pasada |
| Analytics/backoffice | N/A | no existe analítica instalada todavía |
| Error/rollback | NOT_VERIFIED | no se probó un rollback real |

## Rollback y operación

```text
last_known_good_deployment: PENDIENTE — confirmar en Vercel
code_rollback_tested: false
db_expand_contract_compatible: PARCIAL — las migraciones 0001-0009 son todas aditivas (nunca DROP destructivo sobre datos reales), pero no se probó un rollback real
owner_runbook_location: NO EXISTE todavía (Gate 9 lo exige)
recertification_triggers_documented: false
```

## Veredicto

```text
VEREDICTO: NO APTO

Bloqueantes:
1. Un solo proyecto Supabase para desarrollo y producción (sin aislar ambientes).
2. Matriz de pago real (Gate 2) sin probar de punta a punta contra Hotmart en producción.
3. Sin job de reconciliación de entitlements, sin autoservicio de exportación/borrado de datos,
   sin analítica instalada, sin piloto cerrado con compradores reales.

Resuelto durante esta auditoría (2026-11-02): allowlist de producto Hotmart (HOTMART_PRODUCT_ID)
activa en Production; confirmado que el deployment en Vercel coincide con el commit del repo;
"El Pase" construido de verdad (QR real + verificación pública, ver CLAIMS-LEDGER.md); CI real
en `.github/workflows/ci.yml` (lint + typecheck + build + npm audit en cada push/PR), que de
paso destapó y corrigió 11 errores reales de lint preexistentes en el código.

Riesgos residuales (no bloqueantes, aceptables para seguir operando a bajo volumen):
- Reconciliación manual de pagos y de consentimiento (aceptable mientras el volumen sea bajo).
- Sin runbook de incidentes escrito.

Responsable: dueño del producto (Henry Montañez) para las acciones que cuestan dinero, tocan
cuentas reales o son decisiones de negocio (ej. qué hacer con "El Pase"); el agente ya corrigió lo
que pudo sin tocar dinero (el endurecimiento de `search_path` en `registrar_intento`,
migración 0009).
Fecha UTC: 2026-11-02
```
