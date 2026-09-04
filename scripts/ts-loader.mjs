/**
 * Lets the coverage script import the dictionaries directly.
 *
 * They are TypeScript, and they import `type`-only symbols from `../index`,
 * which pulls in `next/root-params` — not something a plain Node script can
 * load. Stripping types is enough: the runtime value of every dictionary is a
 * plain object literal.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const hooks = {
  resolve(specifier, context, next) {
    if (specifier.startsWith(".") && !specifier.endsWith(".ts")) {
      try {
        return next(`${specifier}.ts`, context);
      } catch {
        /* fall through to the default resolution below */
      }
    }
    return next(specifier, context);
  },

  load(url, context, next) {
    if (!url.endsWith(".ts")) return next(url, context);
    const source = readFileSync(fileURLToPath(url), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    });
    return { format: "module", shortCircuit: true, source: outputText };
  },
};
