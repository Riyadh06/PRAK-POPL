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
  ]),
  {
    // Project-level rule overrides
    rules: {
      // Disabled: our hooks intentionally initialize state from service on mount.
      // This is the correct pattern for loading client-side data (localStorage)
      // without triggering SSR issues.
      "react-hooks/set-state-in-effect": "off",

      // Allow underscore-prefixed params (used in State Pattern method signatures
      // where parameters must match the interface but are unused in some states).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
