// Convierte una pantalla HTML aprobada (landing.html, onboarding.html, etc.) en los
// insumos para una pagina de Next.js, preservando el CSS/markup EXACTO que ya paso
// por el revisor-visual (evita reescribir a mano y arriesgar una regresion visual):
//   1. Extrae el <style> y le antepone un prefijo de clase a cada selector de alto
//      nivel (para que no choque con el CSS de otras pantallas una vez que todas
//      viven en la misma app).
//   2. Extrae el <body> (sin <script>) tal cual, para inyectarlo via dangerouslySetInnerHTML.
//   3. Extrae el contenido de los <script> inline para portarlos a mano a useEffect.
//
// Uso: node scripts/migrate-screen.mjs <archivo.html> <prefijo-sin-punto>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, dirname } from "node:path";

const [, , htmlPath, prefix] = process.argv;
if (!htmlPath || !prefix) {
  console.error("Uso: node scripts/migrate-screen.mjs <archivo.html> <prefijo>");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : "";

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let body = bodyMatch ? bodyMatch[1] : "";

// Saca los <script>...</script> del body (se portan a mano) y los junta aparte.
const scripts = [];
body = body.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (_, code) => {
  scripts.push(code.trim());
  return "";
});

// Prefija cada selector de alto nivel de una lista de reglas CSS planas (sin anidar
// mas que @media/@keyframes, que es lo unico que usan estas pantallas).
function prefixCss(cssText, cls) {
  const out = [];
  let i = 0;
  while (i < cssText.length) {
    // Saltar espacios en blanco entre reglas (si no, "@" nunca cae justo en cssText[i]).
    while (i < cssText.length && /\s/.test(cssText[i])) i++;
    if (i >= cssText.length) break;
    // Saltar comentarios /* ... */
    if (cssText.startsWith("/*", i)) {
      const end = cssText.indexOf("*/", i + 2);
      out.push(cssText.slice(i, end + 2));
      i = end + 2;
      continue;
    }
    // @media / @keyframes / @font-face: copiar el encabezado, procesar el bloque interno recursivamente.
    if (cssText[i] === "@") {
      const braceOpen = cssText.indexOf("{", i);
      const header = cssText.slice(i, braceOpen).trim();
      let depth = 1;
      let j = braceOpen + 1;
      while (depth > 0 && j < cssText.length) {
        if (cssText[j] === "{") depth++;
        if (cssText[j] === "}") depth--;
        j++;
      }
      const inner = cssText.slice(braceOpen + 1, j - 1);
      if (header.startsWith("@keyframes") || header.startsWith("@font-face")) {
        out.push(`${header} {${inner}}`);
      } else {
        out.push(`${header} {\n${prefixCss(inner, cls)}\n}`);
      }
      i = j;
      continue;
    }
    // Regla normal: selector { declaraciones }
    const braceOpen = cssText.indexOf("{", i);
    if (braceOpen === -1) { out.push(cssText.slice(i)); break; }
    const selectorRaw = cssText.slice(i, braceOpen).trim();
    const braceClose = cssText.indexOf("}", braceOpen);
    const decls = cssText.slice(braceOpen + 1, braceClose);
    if (!selectorRaw) { i = braceClose + 1; continue; }
    const selectors = selectorRaw.split(",").map((s) => {
      s = s.trim();
      // :root no se puede anidar bajo .cls (nunca matchea) -> las variables se definen
      // directo en el elemento wrapper, que es donde queremos que vivan (scoped a la pagina).
      if (s === ":root") return `.${cls}`;
      // html/body sueltos (scroll-behavior, overflow-x) son comportamiento de documento:
      // no hay forma de "scopearlos" a un wrapper (el wrapper esta DENTRO de <body>, nunca
      // al reves) -> se dejan tal cual, es inofensivo que varias paginas repitan la misma regla.
      if (s === "html" || s === "body") return s;
      // .js-reveal / .js-motion: en el original se agregaba a <html> (ancestro). Aqui se
      // agrega al MISMO elemento wrapper -> la clase va PEGADA (sin espacio), no anidada.
      if (s === ".js-reveal" || s.startsWith(".js-reveal ") || s.startsWith(".js-reveal.")) {
        return `.${cls}.js-reveal${s.slice(".js-reveal".length)}`;
      }
      if (s === ".js-motion" || s.startsWith(".js-motion ") || s.startsWith(".js-motion.")) {
        return `.${cls}.js-motion${s.slice(".js-motion".length)}`;
      }
      return `.${cls} ${s}`;
    });
    out.push(`${selectors.join(",\n")} {${decls}}`);
    i = braceClose + 1;
  }
  return out.join("\n");
}

const scopedCss = prefixCss(css, prefix);

const outDir = dirname(htmlPath);
writeFileSync(`_migrated-${prefix}.css`, scopedCss.trim() + "\n");
writeFileSync(`_migrated-${prefix}.body.html`, body.trim() + "\n");
writeFileSync(`_migrated-${prefix}.scripts.js`, scripts.join("\n\n// ---\n\n"));
console.log(`OK: _migrated-${prefix}.css / .body.html / .scripts.js`);
