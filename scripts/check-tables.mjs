/**
 * Checks migrated comparison tables against the figures registry.
 *
 * The tables are where the migrated articles state their numbers most baldly —
 * a cell has no sentence around it to date or qualify it, so an outdated
 * figure in one reads as current fact. One row genuinely was: a Türkiye
 * "Minimum Investment" cell still carried $250,000, the figure superseded in
 * June 2022, on the page that ranks for exactly that comparison.
 *
 * Prose is deliberately not checked. An article saying "raised from $250,000
 * in June 2022" is correct, and a rule that cannot tell history from a claim
 * would either flag all of it or none.
 *
 *   node scripts/check-tables.mjs
 */

import { registerHooks } from "node:module";
import { hooks } from "./ts-loader.mjs";

registerHooks(hooks);

const base = new URL("../app/lib/", import.meta.url);
const { figures } = await import(new URL("figures.ts", base).href);
const { knowledgeArticles } = await import(new URL("knowledge.ts", base).href);

/** Row label patterns, and the registry entry each should agree with. */
const expectations = [
  {
    label: /minimum\s+(?:real\s+estate\s+)?invest/i,
    country: /turk|türk/i,
    figure: "tr.cbi.minimum-property",
  },
  {
    label: /holding\s+period/i,
    country: /turk|türk/i,
    figure: "tr.cbi.holding-period",
  },
];

const money = /(?:USD\s?|\$)\s?([\d][\d,]*)/;

let problems = 0;

for (const article of knowledgeArticles) {
  for (const table of article.tables ?? []) {
    const header = table[0] ?? [];
    // Which column is about Türkiye?
    const columns = header
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => /turk|türk/i.test(cell));
    if (columns.length === 0) continue;

    for (const row of table.slice(1)) {
      const label = row[0] ?? "";
      for (const expectation of expectations) {
        if (!expectation.label.test(label)) continue;
        const expected = figures[expectation.figure];
        if (!expected) continue;

        for (const { index } of columns) {
          const cell = row[index];
          if (!cell) continue;
          const found = cell.match(money);
          if (!found) continue;
          const value = Number(found[1].replace(/,/g, ""));
          if (value !== expected.value) {
            problems++;
            console.error(
              `ERROR  ${article.slug}\n` +
                `       "${label}" says ${found[0]} for ${header[index]};\n` +
                `       ${expectation.figure} is ${expected.value.toLocaleString()}.`,
            );
          }
        }
      }
    }
  }
}

console.log(
  problems === 0
    ? "Comparison tables agree with the figures registry."
    : `\n${problems} table cell(s) contradict the registry.`,
);

if (problems > 0) process.exit(1);
