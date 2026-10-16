# ESTADO — HSE Master App
Última actualización: 2026-10-16 | Sesión actual: 3

⏸️ CHECKPOINT — Sesión 3, ronda 40 de revisión por lanzar. Ronda 39 dio NO LISTA (usabilidad 28/40, craft 17/20 — se mantiene sobre el umbral por 2ª ronda seguida, copy 19/20). 5 defectos, los 5 corregidos: los botones de mailto solo cambiaban de texto 2s sin confirmar nada → ahora llevan un ícono de sobre antes del clic y, tras el clic, un mensaje persistente ("tu correo debería haberse abierto... si no, escríbenos a...") que ya no se revierte; el badge "2 MESES GRATIS" estaba en verde pero FICHA-ARTE.md lo asigna textualmente al rojo → repintado a rojo (contraste con texto ink verificado, 5.26:1); no había navegación interna en ~12 pantallas de scroll → el sticky-CTA ahora muestra accesos "Precios"/"Preguntas" una vez pasada la sección Oferta (vía un sentinel + IntersectionObserver); la Garantía prometía más de lo que protege (la prueba ya es gratis/sin tarjeta) → se renombró a "El Compromiso del Primer Pase" y el copy aclara que no hay nada que devolver, solo ayuda personal; el slide 4 del carrusel rompía el patrón de uso diario con una pregunta de configuración inicial → se reemplazó por un mini-mockup del "Reto del día" (pregunta + respuesta correcta marcada), coherente con los otros 3 slides. Screenshot regenerado (360×8637, verificado), se relanza la ronda 40 de revisión independiente.
veredicto:landing — 24 rondas de revisión independiente corregidas con mejora real y medible (usabilidad 27→30, craft 12-14 oscilando). Sigue NO LISTA. Las correcciones restantes que el revisor pide (bajar de 4 a 2 acentos de color en toda la pantalla, variar el gesto de botón, rotar el amarillo más allá de lo que preserva "gold") chocan con decisiones ya aprobadas por el usuario (FICHA-ARTE.md, cosa juzgada) — documentadas abajo como razonadas, no pendientes sueltas. El único camino para subir más el puntaje de craft/identidad es que el USUARIO decida si quiere tocar esas decisiones aprobadas, no que el agente seguro siga iterando solo. defecto "cero estados de error en el funnel" sigue DELIBERADAMENTE sin resolver: no hay backend/checkout real todavía (Sesión 6, cualquier error sería fabricado). El footer legal ya NO dice "(pendiente)" con jerga interna (corregido en ronda 19 → "(próximamente)", lenguaje de cliente) pero las 3 páginas legales siguen sin redactarse de verdad — eso se resuelve en la sesión aparte de este sistema (47-LEGAL-FISCAL-Y-PRIVACIDAD.md). La promesa de "reembolso de 7 días" se QUITÓ de la landing (ronda 23) hasta que exista FICHA-MERCADO.md con el plazo real verificado contra Hotmart — ninguno bloquea esta pantalla puntual.

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

## Dirección de Arte (Sesión 2 — NO cambiar sin justificación)
> La ficha COMPLETA vive en `FICHA-ARTE.md` en la raíz.
- FICHA-ARTE.md: existe y APROBADA por el usuario (2026-10-15)
- ¿Hubo referencia visual del usuario?: SÍ (parcial) — captura de un hero de landing propio en ámbar, con pedido explícito de pasar a amarillo + bloques grandes multicolor estilo Duolingo
- Resumen: dirección "Casco de Oro" · fondo #FFFAF0 · acento #FFC800 + verde #58CC02 + azul #1CB0F6 + rojo #FF4B4B · Display "Baloo 2" · Body "DM Sans" · radio 20px cards / 16px botones · bordes gruesos 3px · botones "presionables"
- Personalidad: enérgica · competitiva · directa (compilada en la ficha)
- REGISTRO ANTI-REPETICIÓN (29/54): paleta amarillo+multicolor sobre blanco cálido y par Baloo 2+DM Sans vetados para el próximo proyecto del SO. También vetadas las 6 direcciones descartadas en rondas 1 y 2 (ver FICHA-ARTE.md).
- Mapa de rutas: `/` → `/onboarding` → `/paywall` → `/login` → `/app`

## Gamificación y retención (se documenta en Sesión 4, se construye en Sesión 5)
- Mecánicas ya definidas por el usuario: rachas diarias, vidas (cascos de seguridad), tabla de posiciones por cuadrilla/empresa, Pasaporte Digital QR.
- Primera victoria (<5 min): completar el primer micro-módulo de 3 min (LOTO), responder la trivia, ganar la primera racha, ver a su cuadrilla subir en el ranking.

## Secuencia maestra de construcción (NO saltar)
- Estado de la secuencia: Sesión 1 y 2 cerradas. Sesión 3 (landing) en curso, esperando veredicto del revisor independiente.
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida (landing.html, raíz del proyecto) · 10 secciones canónicas · Big Idea + mecanismo "El Pase de los 3 Minutos" · copy en docs/copy/landing.md trazado a FICHA-AVATAR.md · carrusel con mini-demos reales (nivel 2 de fidelidad, app interna aún no construida) · footer legal con enlaces marcados "(próximamente)" a propósito (47 no corrido aún) · EN REVISIÓN (docs/revisiones/landing-veredicto.md)
- Onboarding: pendiente
- Paywall: pendiente
- Login/Auth: pendiente — método a decidir (ver Decisiones técnicas)
- App interna: pendiente — secciones candidatas: Pantalla principal = reto/módulo del día (no el mapa) · Mapa de ruta de aprendizaje (mundos IOGP, estilo Duolingo) como sección SECUNDARIA aparte, no la home · Racha/Ranking de cuadrilla · Pasaporte QR · (Dashboard HSE es vista de ADMIN, no del trabajador)
- Servicios externos: pendiente — GitHub/Supabase/Vercel/Resend/Hotmart/dominio

## Puertas de etapa (aprobación antes de avanzar)
- Landing: construida, no aprobada — evidencia: landing.html + docs/revisiones/landing-375.png + docs/revisiones/landing-veredicto.md (en curso) + preview local verificado (static-preview, puerto 4173)
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
- Sesión 2 — Identidad visual: dirección final "Casco de Oro" (amarillo + multicolor estilo Duolingo, bloques grandes con borde grueso, botones presionables, mapa de módulos como sección Progreso) aprobada tras 3 rondas de iteración · FICHA-ARTE.md aprobada — cerrada 2026-10-15.

## Sesión en progreso 🔧
(ninguna — lista para arrancar Sesión 3)

## Próximas sesiones 📋
- Sesión 3: Página de ventas.
- Sesión 4: Onboarding, paywall y login.

## Problemas conocidos ⚠️
- FICHA-MODELO (Duolingo): ángulos de venta pagada (§6, Meta Ads Library) quedaron NO ENCONTRADO — no aplica, nuestro canal es venta directa B2B en LinkedIn (campo 15 del documento validado), no ads. Documentado, no bloqueante.
- veredicto:landing — 39 rondas de revisión independiente corregidas; la última entregada (ronda 39) dio NO LISTA, craft se mantuvo en 17/20 (2ª ronda seguida sobre el umbral) — falta solo usabilidad (28/40, necesita ≥36/40). Se corrigieron sus 5 defectos (confirmación persistente en los botones de mailto, badge "2 meses gratis" repintado a rojo para cumplir FICHA-ARTE, accesos "Precios"/"Preguntas" agregados al sticky-CTA tras la Oferta, Garantía renombrada a "Compromiso" con copy honesto, slide 4 del carrusel reemplazado por el mockup del Reto del día) y se relanzó una CUADRAGÉSIMA revisión independiente (en curso, agente en segundo plano). docs/revisiones/landing-veredicto.md en disco sigue siendo el de la ronda 39 (NO LISTA) hasta que esta ronda 40 lo sobrescriba. La landing NO se declara LISTA hasta leer ese veredicto nuevo. Investigando/en curso, no pospuesto — el gate de cierre ahora solo depende de usabilidad.
- forma-boton-duolingo — la ronda 28 fue más específica que las anteriores sobre identidad: no es solo el color ni el gesto de tap, es la FORMA misma (tarjeta redondeada + borde grueso + botón con border-bottom que colapsa) la que un ojo entrenado reconoce como la gramática visual de Duolingo, más allá de los 2 dispositivos ownable ya agregados (casco, QR, cinta de peligro). Decisión razonada: NO se rediseña la forma base de tarjetas/botones en esta ronda — es la MISMA cosa juzgada que `gesto-boton-duolingo` (abajo), solo que esta vez el revisor la nombra como "forma" en vez de "gesto". Cambiar la forma base de TODOS los componentes a esta altura (28 rondas, un solo componente CSS reutilizado en las 10 secciones) es un rediseño estructural completo, no un ajuste — key decisión para el usuario, no algo que el agente deba decidir solo en una ronda más de pulido.
- sin-modal-ni-celebracion — la ronda 28 marcó que faltan 2 de las "7 animaciones baseline" del sistema: ningún modal/diálogo (el FAQ usa `<details>`, no modal) y ninguna celebración de hito. Decisión razonada: una landing de ventas no tiene "hitos" que celebrar (no hay sesión de usuario, racha ni progreso real — esos conceptos pertenecen a la APP INTERNA, Sesión 5) y agregar un modal (p. ej. "ver demo") sin un demo real que mostrar sería agregar una pieza vacía solo para marcar una casilla — contra la regla de "cero medias pantallas/elementos sin contenido real". Se resuelve naturalmente cuando la app interna (con su propio ritual diario y celebraciones, archivo 56) se construya en su sesión correspondiente.
- gesto-boton-duolingo — la ronda 22 marcó que el botón "presionable" (relleno + border-bottom que colapsa al tocar) sigue siendo el fingerprint de interacción más icónico de Duolingo, intacto pese al cambio de color/íconos. Decisión razonada: NO se rediseña el gesto, porque FICHA-ARTE.md ya documenta este patrón como una réplica CONSCIENTE y aprobada ("Botón presionable... imitando el mecanismo 3D de Duolingo") — es cosa juzgada, no un descuido. La Regla de Oro 1 permite replicar PATRONES de una app-referencia con mandato del usuario; solo prohíbe clonar assets/copy/marca, y un micro-gesto de interacción (no exclusivo ni patentado de Duolingo, es un patrón "skeuomórfico" general) no es un activo de marca. Rediseñar la interacción central de CTA en la ronda 23 de un proceso de refinamiento visual es, además, un riesgo de regresión alto para un beneficio incierto.
- multicolor-60-30-10 — la ronda 21 marcó que 4 acentos saturados (amarillo/verde/azul/rojo) compiten en casi toda la pantalla, contra la heurística genérica 60-30-10 / máx 1-2 colores de marca. Decisión razonada: NO se reduce la paleta multicolor en sí, porque es un MANDATO EXPLÍCITO del usuario ("quiero bloques grandes, llamativos y coloridos... inspírate en Duolingo"), ya aprobado y documentado como cosa juzgada en FICHA-ARTE.md tras 3 rondas de iteración — la ficha define 4 acentos de apoyo "cada uno con su propio uso fijo, nunca intercambiables" por diseño. La regla 16-DIRECCION-DE-ARTE.md es explícita: una referencia/mandato del usuario MANDA sobre la capa anti-IA y sus heurísticas genéricas. Mitigación aplicada sin tocar la paleta: en el hero (primera impresión, donde más pesa) se bajó de 4 a 3 acentos simultáneos al convertir el chip azul en un sello neutro (ronda 22).
- cantidad-items-problema-faq — la ronda 6 marcó que las 5 tarjetas de "¿Te suena familiar?" y las 6 preguntas del FAQ superan el límite genérico de ≤4-5 ítems del gate de carga cognitiva. Decisión razonada: NO se reducen, porque están dentro de los rangos CANÓNICOS que el propio sistema fija en `19-PAGINA-DE-VENTAS.md` (sección 2: "3 a 5 preguntas"; sección 8 FAQ: "4-6 preguntas") — bajar de 5 o 6 violaría una regla más específica y de mayor jerarquía que la heurística genérica de Nielsen. Mitigación aplicada: el FAQ ahora es un acordeón exclusivo dentro de cada uno de los 2 bloques agrupados (ronda 17), para bajar la carga visual sin tocar la cantidad de preguntas.
- sin-testimonios-oferta — la ronda 18 marcó falta de prueba social en Oferta como su 5º defecto (menor impacto). Sigue DELIBERADAMENTE sin resolver: no hay 3 testimonios reales de este producto todavía, y las frases VoC de FICHA-AVATAR.md son dolores del mercado (de la investigación previa), no reseñas de alguien que haya usado la app — insertarlas como si fueran reseñas sería fabricar prueba social, prohibido por el propio sistema. Se resuelve cuando existan clientes reales (Sesión 8/Lanzamiento).
- identidad-visual-duolingo — superado por `gesto-boton-duolingo` y `multicolor-60-30-10` arriba (mismo tema, ya desglosado en sus 2 causas concretas tras la ronda 22). El eje "identidad" de craft subió de 1 a 2/20 en la ronda 22 gracias al sello QR del hero; las 2 causas que quedan (gesto de botón, densidad de color) están documentadas como decisiones razonadas, no pendientes sueltas.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguna por ahora — el usuario ya decidió el color amarillo (Opción B, 2026-10-16); todo lo demás de esta sesión lo resuelve el agente.

## Notas para la próxima sesión
- El comprador (Gerente de HSE) y el usuario final (trabajador de campo) son personas DISTINTAS con necesidades de UX opuestas: el dashboard del gerente puede ser denso/informativo; la app del trabajador debe ser ultra simple, táctil, sin texto largo — nunca mezclar ambas UX en la misma pantalla.
- El offline-first NO es un detalle técnico menor: es una objeción de compra explícita (campo 7 del documento) y debe probarse de verdad (modo avión) antes de declarar cualquier pantalla de la app del trabajador como lista.
