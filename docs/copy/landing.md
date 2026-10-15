# Copy de la página de ventas — HSE Master App

> Todo el copy de abajo se traza a `FICHA-AVATAR.md`. Cada sección indica de qué campo sale.

## Big Idea (guardar también en ESTADO.md)
"Carlos no pierde el sueño por falta de reglas de seguridad — las pierde porque nadie puede
probar que su gente las entendió de verdad antes de tocar una herramienta. **El Pase de los
3 Minutos** cierra esa brecha: convierte la firma de trámite en una prueba real, diaria, con
un código QR que cualquiera puede verificar."

## Mecanismo bautizado: "El Pase de los 3 Minutos"
- Paso 1: cada trabajador recibe un reto de 3 minutos (foto real del pozo, peligro a identificar) antes del turno.
- Paso 2: responde aunque no haya señal; se sincroniza solo cuando el teléfono detecta red.
- Paso 3: si acierta, su Pase Digital (código QR) se actualiza al instante — vigente solo para ese día.
- Test de falsabilidad: SafetyCulture/iAuditor no emite un pase diario verificable; los e-learnings no prueban comprensión real, solo "visto". El Pase SÍ es específico de esta app (FICHA-MODELO.md §5).

## 1. HERO (campo: deseo #1 + nivel de consciencia)
- Titular: "Capacita a tu cuadrilla en 3 minutos al día — y pruébalo con un código QR"
- Subtitular: "El Pase de los 3 Minutos convierte las 9 Reglas que Salvan Vidas de la IOGP en un hábito diario. Sin aulas, sin PDFs de 50 páginas, sin señal en el pozo."
- CTA: "Quiero mi prueba gratis de 14 días"
- Franja bajo CTA (sin inventar prueba social — jerarquía día-1): referencia a evidencia de industria verificable (campo 18 del documento validado): "Basado en las 9 Reglas que Salvan Vidas, el estándar de la IOGP adoptado por las principales petroleras del mundo."

## 2. PROBLEMA (campo: Dolores)
1. "¿Tus muchachos firman la charla de seguridad en la mañana y a los 10 minutos ya están metiendo la mano en la línea de fuego?"
2. "¿Tienes contratistas entrando a la planta con certificaciones que son carpetas de papel que nadie alcanza a verificar de verdad?"
3. "¿No tienes forma de saber si tu gente entendió realmente las reglas o solo adivinó en el examen teórico?"
4. "¿Cuando llega el auditor de sorpresa, te pasas días reuniendo papeles para demostrar que la cuadrilla estaba capacitada?"
5. "¿Sientes que, si mañana pasa algo en el pozo por un error tonto, la responsabilidad te cae a ti?"

## 3. AGITACIÓN (campo: costo de la inacción)
"Cada mes que sigue igual no es solo papeleo acumulado: es la posibilidad real de una fatalidad
que cierra la operación, destruye tu carrera y te lleva a responder legalmente. Si nada cambia,
en 6 meses vas a seguir haciendo inducciones repetitivas por la rotación de contratistas, sin
saber QUÉ NO SABEN tus trabajadores — hasta que un near miss te lo diga de la peor forma. Ya
intentaste PowerPoint, e-learnings y talleres presenciales: fallan porque solo miden
'asistencia', no comprensión — la gente le da 'siguiente, siguiente' sin leer un párrafo."

## 4. SOLUCIÓN (Big Idea + mecanismo)
Big Idea completa (arriba) + los 3 pasos del Pase de los 3 Minutos + contraste:
"Antes: planillas firmadas que nadie revisa de verdad. Después: un código QR que cualquier
supervisor escanea y confirma, en segundos, quién está realmente listo para entrar al pozo hoy."

## 5. LA APP POR DENTRO (mini-demos reales del mecanismo, Sesión 2 — Casco de Oro)
Carrusel con las vistas ya construidas y aprobadas en FICHA-ARTE.md (mini-demo HTML real del
mecanismo, no placeholder ni stock — jerarquía de fidelidad nivel 2):
1. "Tu racha de seguridad, de un vistazo" (pantalla Hoy)
2. "Las 9 Reglas, convertidas en ruta" (mapa de módulos)
3. "Tu Pase Digital, listo para el auditor" (QR)
4. "Así empieza tu cuadrilla" (onboarding)
Sin testimonios (no hay 3 reales todavía — se omiten, no se inventan).

## 6. OFERTA (campo: deseos + objeción de precio)
- Trial: 14 días gratis, SIN tarjeta, para 1 cuadrilla (hasta 20 trabajadores), con dashboard completo del Gerente de HSE.
- Mensual: US$8/usuario/mes.
- Anual (recomendado): US$80/usuario/año → mostrado como US$6.67/usuario/mes, "se cobra US$80/usuario/año" en chico. Ahorro: 12 − (80/8) = 2 → "2 MESES GRATIS".
- Stack de valor (SIN cifras $ inventadas — FICHA-MERCADO.md con benchmarks reales LATAM queda pendiente; los bonos se presentan por resultado, no por precio ficticio):
  1. Dashboard completo del Gerente de HSE desde el día 1 → mata objeción "ya pagamos un EHS, no van a comprar otro" (se posiciona como capa de adopción, no reemplazo).
  2. Plantilla de inducción para contratistas nuevos → mata "me paso la mitad del mes haciendo inducciones repetitivas".
  3. Configuración guiada de tu primera cuadrilla en minutos → mata "no tengo tiempo para implementar software complejo".

## 7. GARANTÍA (reencuadrada — Hotmart aún no configurado, ver nota abajo)
"La Garantía del Primer Pase": si tu cuadrilla no completa su primer Pase de 3 Minutos en el
primer día de la prueba, te ayudamos personalmente a configurarlo — sin costo, sin compromiso.
Como el trial es gratis y sin tarjeta, no hay riesgo de dinero que devolver todavía.
⚠️ Pendiente (ver ESTADO.md "Problemas conocidos" → "garantía"): cuando se configure Hotmart
(Sesión 6) se agrega la garantía formal de reembolso de 7 días como piso legal.

## 8. FAQ (campo: Objeciones, en orden de fuerza)
1. "¿Mi gente de campo realmente va a usar esto?" → No es un juego infantil: son retos de 3 min con fotos reales del pozo.
2. "¿Funciona sin señal en el pozo o la plataforma?" → Sí, 100% offline-first; sincroniza al detectar red.
3. "¿Esto reemplaza nuestro software EHS actual?" → No, es la capa de adopción móvil diaria que alimenta esos sistemas.
4. "¿Se puede usar donde no se permiten celulares?" → Se usa en la charla pre-turno, el comedor o dispositivos industriales autorizados.
5. "¿Qué pasa si no tengo presupuesto este trimestre?" → El trial es gratis 14 días, sin tarjeta — decides viendo la adopción real.
6. "¿Los supervisores mayores se van a complicar con la tecnología?" → Interfaz de un solo toque, sin tecnicismos, pensada para el trabajador de 50 años.

## 9. CTA FINAL EMOCIONAL (campo: deseo identidad)
Future pacing: "Imagina abrir tu panel mañana a las 5 AM y ver, en 10 segundos, que toda tu
cuadrilla completó su reto de hoy." Identidad: "el líder que modernizó la cultura de seguridad
de su empresa — no el que frena el trabajo." Recap oferta + garantía + CTA repetido + PS.
Sin urgencia de fundadores (no hay oferta/cupo real activo todavía — se agrega en Sesión 8/35
cuando exista un lanzamiento real, no se inventa cupo ni countdown).

## 10. FOOTER LEGAL
⚠️ PENDIENTE — Política de Privacidad, Términos, Política de reembolso y Disclaimer se
redactan en la sesión de Legal/Fiscal/Privacidad (47) ANTES de poder enlazarlos de verdad.
La landing de esta sesión muestra los enlaces como placeholder visible, NO como link roto a
una página que no existe — anotado en ESTADO.md para no declarar la landing 100% cerrada
hasta que 47 se corra.
