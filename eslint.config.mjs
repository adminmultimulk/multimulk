import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    /**
     * Structured data is the one place on this site where content becomes
     * markup, and some of that content — translated prose — arrives from
     * outside the repo. `app/components/json-ld.tsx` escapes it; nothing else
     * should be hand-rolling a `<script>` payload, because the escaping is
     * easy to leave out and impossible to notice missing.
     */
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    ignores: ["app/components/json-ld.tsx"],
    rules: {
      "react/no-danger": "error",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
