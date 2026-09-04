/**
 * How much of each language is actually written.
 *
 * English is the schema, so coverage is the share of its key paths that a
 * language supplies. Published languages are exhaustive by type and should
 * always read 100%; the number that matters is the one for a `preview`
 * language, which is what says whether it is ready to be advertised.
 *
 * Also reports arrays whose length differs from English. The `Dictionary` type
 * cannot catch that — it widens arrays without constraining length — and it is
 * how a translated page quietly loses a section.
 *
 *   node scripts/i18n-coverage.mjs           report
 *   node scripts/i18n-coverage.mjs --check   also fail if a published
 *                                            language is incomplete
 */

import { registerHooks } from "node:module";
import { hooks } from "./ts-loader.mjs";

registerHooks(hooks);

const dir = new URL("../app/lib/i18n/dictionaries/", import.meta.url);
const { locales, localeStatus } = await import(
  new URL("../app/lib/i18n/config.ts", import.meta.url).href
);

const load = async (locale) =>
  (await import(new URL(`${locale}.ts`, dir).href)).default;

const english = await load("en");

/**
 * Every leaf path in the English dictionary, as arrays of keys.
 *
 * Arrays rather than dotted strings because dictionary keys contain dots of
 * their own — `places["St. Kitts & Nevis"]`, and the size ranges under
 * `property.statValues` — and splitting on "." walks straight past them.
 */
function paths(node, prefix = [], out = []) {
  for (const [key, value] of Object.entries(node)) {
    const path = [...prefix, key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      // A plural table is one translatable unit, not five.
      if ("one" in value && "other" in value) out.push(path);
      else paths(value, path, out);
    } else {
      out.push(path);
    }
  }
  return out;
}

function at(node, path) {
  return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), node);
}

const show = (path) => path.join(" › ");

const englishPaths = paths(english);
let failed = false;
const strict = process.argv.includes("--check");

console.log(`English defines ${englishPaths.length} keys.\n`);

for (const locale of locales) {
  if (locale === "en") continue;
  const dict = await load(locale);
  const present = englishPaths.filter((p) => at(dict, p) !== undefined);
  const pct = Math.round((present.length / englishPaths.length) * 100);
  const status = localeStatus[locale];

  const lengths = [];
  for (const path of englishPaths) {
    const source = at(english, path);
    const target = at(dict, path);
    if (Array.isArray(source) && Array.isArray(target) && source.length !== target.length) {
      lengths.push(`${show(path)} (en ${source.length} vs ${locale} ${target.length})`);
    }
  }

  console.log(
    `${locale}  ${String(pct).padStart(3)}%  ${present.length}/${englishPaths.length}  [${status}]`,
  );
  for (const mismatch of lengths) console.log(`      array length: ${mismatch}`);

  if (status === "published" && present.length < englishPaths.length) {
    const missing = englishPaths.filter((p) => at(dict, p) === undefined);
    for (const path of missing) console.log(`      missing: ${show(path)}`);
    failed = true;
  }
  if (lengths.length > 0) failed = true;
}

if (strict && failed) {
  console.error("\nA published language is incomplete, or an array is the wrong length.");
  process.exit(1);
}
