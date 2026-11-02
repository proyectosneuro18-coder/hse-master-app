import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Material de referencia del SO, nunca importado por la app real (no es parte del build
    // de producción): el kit de plantillas que se copia a mano a otros proyectos, y los
    // scripts de mantenimiento interno del propio SO.
    "plantillas-codigo/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
