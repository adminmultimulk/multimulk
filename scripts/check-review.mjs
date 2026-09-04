/**
 * Reports content whose legal review has lapsed, or is about to.
 *
 * Programme thresholds and processing times are legislation, so a page stating
 * them has a shelf life. Rather than unpublish stale content — which breaks
 * links and loses the page — a lapsed review drops the page from the sitemap
 * and shows a notice on it. This is what tells anyone that has happened.
 *
 *   node scripts/check-review.mjs           report
 *   node scripts/check-review.mjs --check   exit non-zero if anything is stale
 */

import { registerHooks } from "node:module";
import { hooks } from "./ts-loader.mjs";

registerHooks(hooks);

const base = new URL("../app/lib/", import.meta.url);
const { figures } = await import(new URL("figures.ts", base).href);
const { daysUntilDue, dueDate, isStale } = await import(
  new URL("review.ts", base).href
);

const rows = Object.values(figures).map((figure) => ({
  id: figure.id,
  review: figure.review,
  days: daysUntilDue(figure.review),
}));

rows.sort((a, b) => a.days - b.days);

let stale = 0;
const SOON = 30;

for (const row of rows) {
  const state = isStale(row.review)
    ? "LAPSED"
    : row.days <= SOON
      ? "due soon"
      : "ok";
  if (state === "LAPSED") stale++;
  console.log(
    `${state.padEnd(8)} ${row.id.padEnd(34)} due ${dueDate(row.review)} (${row.days}d)`,
  );
}

const unassigned = rows.filter(
  (row) => row.review.reviewedBy === "advisory-team",
).length;

console.log(`\n${rows.length} figure(s); ${stale} lapsed.`);
if (unassigned > 0) {
  console.log(
    `${unassigned} still signed off by the generic advisory team — a named\n` +
      `reviewer is required before these figures are published.`,
  );
}

if (process.argv.includes("--check") && stale > 0) {
  console.error("\nLapsed reviews must be re-checked against current legislation.");
  process.exit(1);
}
