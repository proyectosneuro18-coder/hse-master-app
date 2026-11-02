# FICHA DE MERCADO — HSE Master App

## Alcance de esta ficha
- Nicho/categoría exacta: software B2B de microaprendizaje gamificado diario para capacitación y retención de normas HSE/IOGP, vendido a Gerentes de HSE de contratistas/operadoras petroleras.
- País(es) donde se va a vender: Hispanoamérica — **sin país único definido todavía** (decisión del dueño, no del agente). Moneda de cobro: USD.
- Fecha de investigación: 2026-11-01 · **Vence el:** 2027-05-01 (6 meses)
- Pasarela/plataforma de venta elegida: Hotmart.

## 1. PRECIO — contra qué se compara el tuyo
- Mediana de precio de la categoría (mensual): US$6-10/usuario/mes para microaprendizaje gamificado tipo Duolingo B2B · fuente: investigación de validación de la Sesión 1 ("RESUMEN FINAL — IDEA VALIDADA PARA CONSTRUIR", aportada por el usuario) · fecha: 2026-10-15.
- Referencias del mismo documento: apps de inspecciones desde US$24/usuario/mes · software EHS enterprise completo US$50-200/usuario/mes.
- Rango de los 3-5 líderes (Duolingo como app modelo, ver FICHA-MODELO.md): no se investigó precio B2B específico de Duolingo (su modelo es B2C) — NO ENCONTRADO un comparable directo B2B de microaprendizaje HSE; se usa el rango de arriba como mejor referencia disponible.
- **Precio elegido para esta app:** US$8/usuario/mes (US$80/año) · **Desvío respecto a la mediana (US$8):** 0% — cae en el centro del rango validado.
- Precio por país/moneda: NO DECIDIDO — se cobra en USD a toda Hispanoamérica por ahora; revisar price parity (`39-INTERNACIONALIZACION.md`) cuando haya tracción real por país.

## 2. CICLO DE DECISIÓN — cuándo se puede juzgar una campaña
- ¿Se compra el mismo día o se piensa? NO ENCONTRADO con fuente pública — el canal de venta decidido en Sesión 1 es venta directa B2B en LinkedIn (no autoservicio puro), lo que típicamente implica un ciclo de decisión de varios días a semanas en compras B2B de software, pero esto es una inferencia razonada, no un dato medido.
- **Ventana mínima antes de declarar que una campaña fracasó:** se revisa con datos propios cuando exista tráfico pagado real (ver `34-ADQUISICION-Y-TRAFICO.md`) — no se fija un número sin datos propios.

## 3. CÓMO PAGA ESTE MERCADO (verificado, no supuesto)
- **Medios de pago en el checkout real — VERIFICADO:** se abrió `https://pay.hotmart.com/D108216311I` a 375px (celular) el 2026-11-02, producto ya "Aprobado" por Hotmart. Hotmart detectó el país del comprador como Colombia y mostró el precio en pesos colombianos ($26.707 COP/mes, equivalente a los US$8/mes definidos). Métodos de pago ofrecidos: **Débito/Crédito, Efecty (pago en efectivo) y PayPal**. El checkbox "Quiero un periodo gratis" con 14 días apareció correctamente, coincidiendo con la prueba ya decidida.
- No se vio ningún aviso de garantía/devolución en la página de pago — es esperable, ese plazo se configura en el panel de Hotmart y no siempre se renderiza en el checkout.
- Hotmart gestiona tarjeta de crédito en toda la región y medios locales (boleto/PIX en Brasil, Efecty en Colombia, etc.) — se confirma por país al abrir el link real.
- **Consecuencia para el producto:** el checkout real ya funciona end-to-end con el modelo de precio y prueba definidos. Sigue pendiente solo confirmar el plazo de garantía configurado en el panel (ver sección 4).

## 4. PRUEBA Y GARANTÍA (plazos que la pasarela permite DE VERDAD)
- Plazos de garantía que Hotmart permite configurar por producto: **7, 15, 21 o 30 días** (el productor elige en el panel) · si se vende a compradores en Europa, mínimo 15 días · "servicios de consultoría online" quedan fijos en 7 días · fuente: Central de Ayuda de Hotmart, "Cómo ajustar el plazo de garantía de productos" (help.hotmart.com) + Términos Generales de Compra de Hotmart (hotmart.com/legal/termos-de-compra) · fecha de consulta: 2026-11-01.
- El plazo de reembolso cuenta **desde que se completa la compra** (fuente: Términos Generales de Compra de Hotmart). El reembolso ya aprobado tarda hasta 30 días (transferencia) o hasta 90 días (tarjeta de crédito) en reflejarse.
- **Prueba elegida: 14 días** (ya decidido, Sesión 1 — no pasa por Hotmart, la activa la propia app sin pedir tarjeta).
- **Garantía elegida: 21 días — VERIFICADO en el panel de Hotmart** (sección "Fijación de precios" → "Plazo para solicitar el reembolso"), confirmado por el dueño el 2026-11-02. Originalmente estaba en 7 días (el valor por defecto de Hotmart); se detectó que violaba la regla dura de abajo y se corrigió a 21 en el propio panel.
- ⚠️ **REGLA DURA (`18`): la garantía tiene que durar MÁS que la prueba.** Comprobación: garantía (21) > prueba (14) → **CUMPLE.** `/legal/reembolsos` puede citar 21 días como plazo real de garantía (antes solo citaba el mínimo legal de 7 días).

## 5. CONVERSIÓN ESPERABLE — para saber si un número es malo o normal
- Conversión típica visita→registro / prueba→pago del nicho: NO ENCONTRADO — es un nicho B2B muy específico (HSE/IOGP, oil & gas, LATAM) sin benchmarks públicos confiables. Se mide con datos propios desde el primer tráfico real (`36-ANALITICA-Y-EVENTOS.md`, `60-OPERACION-DE-CONVERSION.md`).

## 6. ESTACIONALIDAD Y CONTEXTO
- ¿Picos de demanda? NO ENCONTRADO con fuente dura. Hipótesis razonada (sin verificar): las compras B2B de este tipo pueden seguir el ciclo de presupuesto anual de la empresa cliente, no una estacionalidad de consumo masivo — se confirma o se descarta con datos propios.
- Regulación que afecte la venta: ninguna de menores/salud/finanzas — el producto es para personal adulto (18+) de empresas petroleras, ver `/legal/privacidad`.
