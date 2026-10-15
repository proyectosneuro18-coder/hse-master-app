# ESTADO — HSE Master App
Última actualización: 2026-10-15 | Sesión actual: 1

⏸️ CHECKPOINT — Sesión 2 en curso: direcciones-abc.html creado (3 direcciones, todas en azul por pedido del usuario, gamificación incluida) y verificado con screenshot / Siguiente acción exacta: esperar que el usuario elija A, B, C, combine o pida ajustes; luego fijar FICHA-ARTE.md.

## Qué es esta app (3 líneas máximo)
Plataforma móvil B2B de microaprendizaje gamificado (estilo Duolingo) para capacitar, evaluar y certificar diariamente al personal de campo y contratistas en seguridad industrial (HSE/IOGP) en la industria petrolera. El trabajador usa la app en el celular 3 min/día; el Gerente de HSE paga la suscripción y ve un dashboard de adopción y riesgo por cuadrilla.

## Promesa central
"Esta app ayuda a Gerentes de HSE en petroleras a garantizar retención real de las normas IOGP y la meta de Cero Accidentes, sin detener la producción ni usar aulas aburridas, mediante retos interactivos de 3 minutos al día con pase digital QR de competencia."

## Reporte de validación (Sesión 1)
- Fuente: RESUMEN FINAL — IDEA VALIDADA PARA CONSTRUIR (investigación previa del usuario, con competencia y evidencia) — NO se re-valida, es cosa dada.
- Veredicto: Excelente oportunidad — alta consciencia del problema en el nicho, baja saturación de gamificación móvil tipo Duolingo en español para oil & gas.
- Competidores: Pixaera (VR, no escala a miles en celular) · SafetyCulture/iAuditor (checklists, no microaprendizaje diario) · Cority/EHS Insight/Enablon (enterprise, denso, baja adopción de campo).
- Hueco: plataforma móvil ultraliviana, 100% offline-first, gamificación diaria, sin curva de aprendizaje para el trabajador de 50 años.
- Precio de referencia del mercado: US$6-10/usuario/mes (US$60-90/año) — benchmark: inspecciones desde US$24/usuario/mes, EHS enterprise US$50-200/usuario/mes.

## Avatar y venta (Sesión 1 — NO cambiar sin validar)
- FICHA-AVATAR.md: APROBADA por el usuario (2026-10-15).
- Resumen: Carlos Mendoza, 46, Gerente de HSE en contratista/operadora petrolera mediana · dolor #1: "los muchachos firman la charla y a los 10 minutos están en la línea de fuego" (firman por trámite, no retienen) · deseo #1: "ver en mi pantalla en 10 segundos quién está capacitado hoy y quién es un peligro" · nivel de consciencia: Consciente del Problema y de la Solución (ya probó PowerPoint/e-learning/talleres y los odia).
- Usuario final (quien usa la app a diario): técnico/operador/contratista de campo 25-45 años, resistente a la tecnología, celular gama media, sin señal en el pozo.

## Estrategia de monetización (Sesión 1 — NO cambiar sin validar)
- Modelo: B2B SaaS por asiento, con trial-first. Decisión mía: trial de 14 días SIN tarjeta para 1 cuadrilla (hasta 20 trabajadores) con dashboard completo del Gerente de HSE — así vive el "aha" (ver adopción real) antes de pagar. Al vencer el trial o querer sumar más cuadrillas, aparece el paywall con los planes.
  Por qué: el dato ya estaba validado en la investigación del usuario (campo 14 del documento) y es el estándar del nicho B2B EHS — no hace falta la matriz A-F desde cero.
- Pricing propuesto: US$8/usuario/mes (mensual) · US$80/usuario/año (~2 meses gratis). Punto medio del benchmark validado; ajustable cuando se corra el gate de Unit Economics (40) con el costo real de IA/infra por usuario.
- Canal de venta: NO autoservicio puro — venta directa B2B en LinkedIn a Gerentes de HSE (campo 15 del documento). La landing vende y captura el lead/trial; el cierre de planes grandes puede requerir contacto humano. Esto se documenta para que Sesión 3 (landing) y Sesión 8 (adquisición) no asuman un checkout 100% self-service.
- Pasarela: Hotmart (default del SO) para cobrar la suscripción recurrente; a validar en Sesión 6 si maneja bien "N asientos por cuadrilla" o si hace falta una capa propia de facturación por asientos sobre Hotmart.

## Gamificación y retención (se documenta en Sesión 4, se construye en Sesión 5)
- Mecánicas ya definidas por el usuario: rachas diarias, vidas (cascos de seguridad), tabla de posiciones por cuadrilla/empresa, Pasaporte Digital QR.
- Primera victoria (<5 min): completar el primer micro-módulo de 3 min (LOTO), responder la trivia, ganar la primera racha, ver a su cuadrilla subir en el ranking.

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Avatar en borrador → falta Sesión 1 completa (arquitectura/auth/BD) antes de Sesión 2 (diseño).
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: pendiente
- Onboarding: pendiente
- Paywall: pendiente
- Login/Auth: pendiente — método a decidir (ver Decisiones técnicas)
- App interna: pendiente — secciones candidatas: Ruta de aprendizaje (mundos IOGP) · Racha/Ranking de cuadrilla · Pasaporte QR · (Dashboard HSE es vista de ADMIN, no del trabajador)
- Servicios externos: pendiente — GitHub/Supabase/Vercel/Resend/Hotmart/dominio

## Puertas de etapa (aprobación antes de avanzar)
- Landing: no iniciada
- Onboarding: no iniciada
- Paywall: no iniciada
- Login/Auth: no iniciada
- App interna: no iniciada
- Servicios externos: bloqueados

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js (coherente con las plantillas de landing del SO en `plantillas-codigo/landing/*.tsx` y con el soporte PWA que necesita el modo offline-first).
- Offline-first: service worker + cola de sincronización local (IndexedDB) — el trabajador completa el reto sin señal y sincroniza al detectar red. Se diseña en detalle en Sesión 1 técnica / Sesión 6.
- Auth (decidido, según jerarquía de `26-AUTH-MODERNO.md`): (a) Gerente de HSE / admin: magic link + código de 6 dígitos al email (jerarquía #3 — sin contraseña, es quien paga y ve el dashboard, su dato sí amerita ese nivel). (b) Trabajador de campo: código de cuadrilla (identifica a la empresa/equipo, no es secreto) + PIN numérico personal de 4 dígitos (identifica al individuo). Es un nivel de seguridad menor a passkey/OAuth, decidido A PROPÓSITO: el dato que protege (progreso de capacitación, no dinero ni datos personales sensibles) no justifica pedirle email a un contratista con alta rotación — pedirlo mataría la adopción (dolor #1 del avatar). Cada PIN se valida contra un usuario ya pre-cargado por su empresa (el admin sube la lista de su cuadrilla), nunca auto-registro libre.
- Modelo de datos (patrón multi-tenant de `25-BASE-DE-DATOS.md`): `organizations` (empresa) · `memberships` (user_id + org_id + role: owner/admin/worker) · `crews` (cuadrilla, pertenece a una org) · `modules`/`lessons` (contenido curado, global, no por org) · `attempts`/`progress` (por worker) · `streaks` · `qr_passes`. RLS: toda tabla con datos de una empresa lleva `org_id` + política `using (org_id in (select org_id from memberships where user_id = auth.uid()))` — un Gerente de HSE jamás ve datos de otra empresa. Los workers autentican vía un usuario Supabase sintético (no email real) emitido por el servidor al validar código+PIN, nunca con auto-registro.
- Gate de Unit Economics (`40-UNIT-ECONOMICS.md`): PASA. El MVP no usa IA generativa (contenido curado) → el COGS variable por usuario es solo infra (Supabase + hosting + email), muy por debajo del 20% que el gate exige para IA. A US$8/usuario/mes el margen bruto esperado es >80% (el estándar "sano" de SaaS), incluso antes de aplicar CAC. Se recalcula con datos reales en Sesión 6/8 cuando haya costos de infra medidos.
- Modelo de IA: ninguno en el MVP (contenido de los módulos es curado, no generado). Revisar si una sesión futura quiere IA para personalizar dificultad — no bloquea el lanzamiento.

## Sesiones completadas ✅
- Sesión 1 — Validación recibida · Avatar aprobado · App modelo (Duolingo) aprobada · Monetización/pricing/auth/BD/unit economics decididos — cerrada 2026-10-15.

## Sesión en progreso 🔧
- Sesión 2 — Identidad visual: comparativa `direcciones-abc.html` creada con 3 direcciones, todas en azul (pedido explícito del usuario) e incluyendo gamificación (racha, vidas/cascos, ranking) en los 3 mockups. Opción A "Casco Azul" (claro, Space Grotesk/Public Sans) · Opción B "Turno Nocturno" (oscuro, Lexend/Manrope) · Opción C "Bitácora de Pozo" (editorial/institucional, Fraunces/IBM Plex Sans). Pendiente: elección del usuario.

## Próximas sesiones 📋
- Sesión 2: Identidad visual — dirección de arte, paleta, tipografía (16/29/54).
- Sesión 3: Página de ventas.

## Problemas conocidos ⚠️
- FICHA-MODELO (Duolingo): ángulos de venta pagada (§6, Meta Ads Library) quedaron NO ENCONTRADO — no aplica, nuestro canal es venta directa B2B en LinkedIn (campo 15 del documento validado), no ads. Documentado, no bloqueante.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguna por ahora — todo lo de esta sesión lo resuelve el agente.

## Notas para la próxima sesión
- El comprador (Gerente de HSE) y el usuario final (trabajador de campo) son personas DISTINTAS con necesidades de UX opuestas: el dashboard del gerente puede ser denso/informativo; la app del trabajador debe ser ultra simple, táctil, sin texto largo — nunca mezclar ambas UX en la misma pantalla.
- El offline-first NO es un detalle técnico menor: es una objeción de compra explícita (campo 7 del documento) y debe probarse de verdad (modo avión) antes de declarar cualquier pantalla de la app del trabajador como lista.
