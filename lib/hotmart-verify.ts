import crypto from "node:crypto";

// Verificación del hottok (el secreto único de la cuenta de Hotmart que confirma que la
// petición viene de verdad de Hotmart). Patrón canónico: docs/sistema/18-VENTA-HOTMART.md.
//
// Fail-closed deliberado: si falta HOTMART_HOTTOK en el entorno, verifyHotmart() SIEMPRE
// devuelve false (nunca acepta un webhook) en vez de tirar abajo toda la app — otras rutas
// (login, app interna) no dependen de esta variable y no deben romperse mientras el usuario
// todavía no conectó Hotmart.
const HOTTOK = process.env.HOTMART_HOTTOK;

/**
 * Compara dos strings en TIEMPO CONSTANTE (anti timing-attack). `a !== b` corta en el primer
 * byte distinto y el tiempo de respuesta delata cuántos bytes acertó un atacante.
 */
function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function verifyHotmart(opts: { hottok?: string }): boolean {
  if (!HOTTOK || !opts.hottok) return false;
  return timingSafeEqualStr(opts.hottok, HOTTOK);
}
