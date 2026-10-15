# ESTADO — HSE Master App
Última actualización: 2026-10-15 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: Sistema instalado + idea validada recibida y leída / Siguiente acción exacta: completar FICHA-AVATAR.md (aprobación del usuario) y decidir arquitectura técnica de Sesión 1.

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
- FICHA-AVATAR.md: creada en BORRADOR (fecha 2026-10-15) — pendiente de aprobación del usuario.
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
- Auth: dos jerarquías distintas — (a) Gerente de HSE / admin: email + contraseña (o magic link), es quien paga y ve el dashboard; (b) trabajador de campo: código de cuadrilla + PIN corto, SIN email (hay alta rotación de contratistas, pedirles email es fricción que mata la adopción). A confirmar contra `26-AUTH-MODERNO.md` en la sesión técnica.
- Modelo de datos: usuarios (admin vs trabajador) · empresas/cuadrillas · módulos/lecciones · intentos/progreso · rachas · pases QR. RLS por empresa (un Gerente de HSE NUNCA ve datos de otra empresa). Detalle en `25-BASE-DE-DATOS.md`.
- Modelo de IA: ninguno por ahora (el MVP no requiere IA generativa — contenido de los módulos es curado, no generado). Revisar si Sesión 8+ quiere IA para personalizar dificultad.

## Sesiones completadas ✅
(ninguna aún)

## Sesión en progreso 🔧
- Sesión 1 — Validación recibida (no re-validada) · Avatar en borrador · Monetización y pricing decididos · Framework y arquitectura decididos · Falta: aprobación del usuario sobre el avatar + completar auth/BD/unit economics antes de cerrar Sesión 1.

## Próximas sesiones 📋
- Sesión 1 (cierre): Auth definitivo (26) + modelo de datos con RLS (25) + gate de Unit Economics (40) + FICHA-MODELO.md (Duolingo como app modelo).
- Sesión 2: Identidad visual — dirección de arte, paleta, tipografía (16/29/54).
- Sesión 3: Página de ventas.

## Problemas conocidos ⚠️
- Ninguno todavía.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguna por ahora — todo lo de esta sesión lo resuelve el agente.

## Notas para la próxima sesión
- El comprador (Gerente de HSE) y el usuario final (trabajador de campo) son personas DISTINTAS con necesidades de UX opuestas: el dashboard del gerente puede ser denso/informativo; la app del trabajador debe ser ultra simple, táctil, sin texto largo — nunca mezclar ambas UX en la misma pantalla.
- El offline-first NO es un detalle técnico menor: es una objeción de compra explícita (campo 7 del documento) y debe probarse de verdad (modo avión) antes de declarar cualquier pantalla de la app del trabajador como lista.
