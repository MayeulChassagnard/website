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
    // Archived Gatsby app, kept for reference until Phase 1 content parity
    // is confirmed, not part of the active codebase.
    "legacy-gatsby/**",
    // Standalone CommonJS Node script, run via `node`, not part of the app bundle.
    "bin/**",
  ]),
]);

export default eslintConfig;
