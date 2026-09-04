/**
 * Every URL the legacy site publishes must have somewhere to go.
 *
 * The cutover replaces multimulk.com in place, so any legacy path without a
 * redirect or an explicit 410 becomes a 404 the day it happens — losing
 * whatever ranking it had, silently. This reads the legacy sitemap and checks
 * each entry against the map.
 *
 *   node scripts/check-redirects.mjs           report
 *   node scripts/check-redirects.mjs --check   fail on any uncovered URL
 *   node scripts/check-redirects.mjs --live    also resolve each one locally
 */

import { registerHooks } from "node:module";
import { hooks } from "./ts-loader.mjs";

registerHooks(hooks);

const { legacyRedirects, legacyGone } = await import(
  new URL("../app/lib/legacy-redirects.ts", import.meta.url).href
);

const SITEMAP = "https://multimulk.com/sitemap.xml";
const LOCAL = process.env.LOCAL_ORIGIN ?? "http://localhost:3000";

const strip = (path) => path.replace(/\/$/, "") || "/";

/** WordPress publishes a sitemap index; follow it one level. */
async function sitemapUrls(url, seen = new Set()) {
  const xml = await (await fetch(url)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (/<sitemapindex/.test(xml)) {
    for (const child of locs) {
      if (seen.has(child)) continue;
      seen.add(child);
      await sitemapUrls(child, seen);
    }
    return [...seen].filter((u) => !u.endsWith(".xml"));
  }
  for (const loc of locs) seen.add(loc);
  return [...seen].filter((u) => !u.endsWith(".xml"));
}

console.log("Reading the legacy sitemap…");
const urls = await sitemapUrls(SITEMAP);
const paths = [...new Set(urls.map((u) => strip(new URL(u).pathname)))];
console.log(`  ${paths.length} distinct paths.\n`);

const redirected = new Map(legacyRedirects.map((r) => [strip(r.from), r.to]));
const gone = new Set(legacyGone.map(strip));

const uncovered = [];
for (const path of paths) {
  if (path === "/") continue; // the home page is replaced, not redirected
  if (redirected.has(path) || gone.has(path)) continue;
  uncovered.push(path);
}

console.log(
  `covered: ${paths.length - uncovered.length - 1}  ` +
    `(${redirected.size} redirects, ${gone.size} gone)`,
);

if (uncovered.length) {
  console.log(`\n${uncovered.length} legacy URL(s) with nowhere to go:`);
  for (const path of uncovered) console.log(`  ${path}`);
}

if (process.argv.includes("--live")) {
  console.log("\nResolving against the local build…");
  let wrong = 0;
  for (const path of paths.slice(0, 400)) {
    const response = await fetch(`${LOCAL}${path}`, { redirect: "manual" });
    const ok =
      response.status === 308 ||
      response.status === 410 ||
      (path === "/" && response.status === 307);
    if (!ok) {
      wrong++;
      console.log(`  ${String(response.status).padEnd(4)} ${path}`);
    }
  }
  console.log(wrong === 0 ? "  every path answered." : `  ${wrong} unexpected.`);
  if (wrong > 0) process.exitCode = 1;
}

if (process.argv.includes("--check") && uncovered.length > 0) {
  console.error("\nEvery legacy URL needs a redirect or an explicit 410.");
  process.exit(1);
}
