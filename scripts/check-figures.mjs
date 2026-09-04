/**
 * Keeps stated figures inside the registry.
 *
 * A threshold or a processing time written as a bare string in a dictionary or
 * a content module has no source, no review date and no qualifier attached to
 * it, and it will drift away from whatever the same number says on the next
 * page. `app/lib/figures.ts` is where those live; this fails the build if one
 * appears anywhere else.
 *
 *   node scripts/check-figures.mjs
 */

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const searched = [
  "app/lib/i18n/dictionaries/*.ts",
  "app/lib/content.ts",
  "app/lib/citizenship.ts",
  "app/lib/about.ts",
  "app/lib/programmes.ts",
];

/** Shapes that are claims about money, time, or passport strength. */
const patterns = [
  { name: "currency threshold", re: /(?:USD|EUR|AED|\$)\s?\d[\d,.]*\s?(?:K\b|,000|million)/gi },
  { name: "month range", re: /\b\d\s?[–-]\s?\d\s?months?\b/gi },
  { name: "visa-free count", re: /\b\d{2,3}\+?\s?visa[- ]free\b/gi },
  { name: "holding period", re: /\b\d\s?[- ]year holding\b/gi },
];

/**
 * Prose that explains a programme legitimately mentions its threshold, and
 * rewriting every article body into component calls would be worse than the
 * problem. The rule is aimed at *structural* figures — stats, labels, menu
 * copy — so long-form staged prose is exempt and flagged for review instead.
 */
const proseKeys = new Set([
  "body",
  "answer",
  "description",
  "overviewBody",
  "amenitiesBody",
  "text",
  "leadBody",
  "intro",
  "paragraphs",
  "question",
  "stale",
  "estimated",
  "indicative",
  "market",
  "statutory",
]);

/**
 * The key a line belongs to.
 *
 * Long strings wrap, so the line carrying the figure is often a continuation
 * with no key on it at all. Tracking the last key seen is what lets a wrapped
 * `description:` still be recognised as prose.
 */
function keyTracker() {
  let current = "";
  return (line) => {
    const match = line.match(/^\s*"?([A-Za-z][\w-]*)"?\s*:/);
    if (match) current = match[1];
    // A bare string entry in an array carries no key; it belongs to the array.
    return current;
  };
}

let failures = 0;
let advisories = 0;

for (const pattern of searched) {
  for (const file of globSync(pattern)) {
    const lines = readFileSync(file, "utf8").split("\n");
    const keyOf = keyTracker();
    lines.forEach((line, index) => {
      const key = keyOf(line);
      if (line.trimStart().startsWith("*") || line.trimStart().startsWith("//")) return;
      for (const { name, re } of patterns) {
        re.lastIndex = 0;
        const found = line.match(re);
        if (!found) continue;
        const exempt = proseKeys.has(key);
        const where = `${file}:${index + 1}`;
        if (exempt) {
          advisories++;
          console.log(`  note  ${where}  (${key}) ${name}: ${found.join(", ")}`);
        } else {
          failures++;
          console.error(`ERROR   ${where}  (${key}) ${name}: ${found.join(", ")}`);
        }
      }
    });
  }
}

console.log(
  `\n${failures} figure(s) outside the registry, ${advisories} inside prose (review these, they are not blocking).`,
);

if (failures > 0) {
  console.error(
    "\nMove these into app/lib/figures.ts and render them with <Figure>, so each\n" +
      "carries a source, a review date and a qualifier.",
  );
  process.exit(1);
}
