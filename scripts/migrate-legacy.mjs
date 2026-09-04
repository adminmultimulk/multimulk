/**
 * Pulls the legacy WordPress site into this codebase's content modules.
 *
 * `multimulk.com` still holds what the business actually knows: seventy-odd
 * articles that answer the questions people search for, and ninety-odd project
 * pages. The rebuild shipped with placeholder copy instead, so the queries the
 * legacy site ranks for have nothing to land on here.
 *
 * Run once, then review the output before committing it:
 *
 *   node scripts/migrate-legacy.mjs --out .migration
 *   node scripts/migrate-legacy.mjs --out .migration --images
 *
 * Nothing is written into `app/` automatically. Migrated prose asserts
 * thresholds and processing times, and every one of those has to be checked
 * against `app/lib/figures.ts` before it goes near a page — which is what the
 * figures report at the end of the run is for.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";

const SITE = "https://multimulk.com";
const API = `${SITE}/wp-json/wp/v2`;

const args = process.argv.slice(2);
const outDir = args[args.indexOf("--out") + 1] ?? ".migration";
const withImages = args.includes("--images");

/** Paged fetch; WordPress caps `per_page` at 100. */
async function fetchAll(type, fields) {
  const out = [];
  for (let page = 1; ; page++) {
    const url = `${API}/${type}?per_page=100&page=${page}&_fields=${fields}`;
    const response = await fetch(url);
    if (response.status === 400) break; // past the last page
    if (!response.ok) throw new Error(`${url} -> ${response.status}`);
    const batch = await response.json();
    if (batch.length === 0) break;
    out.push(...batch);
    const total = Number(response.headers.get("x-wp-totalpages") ?? 1);
    if (page >= total) break;
  }
  return out;
}

const decode = (s = "") =>
  s
    .replace(/&#8217;|&#039;|&#39;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

const strip = (html = "") => decode(html.replace(/<[^>]+>/g, "")).trim();

/**
 * Turns a WordPress body into the paragraph array `Article.body` expects,
 * keeping headings as their own entries so structure is not lost.
 */
function paragraphs(html = "") {
  const blocks = [];
  const re = /<(h[2-4]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = re.exec(html))) {
    const text = strip(match[2]);
    if (!text) continue;
    blocks.push(/^h/i.test(match[1]) ? `## ${text}` : text);
  }
  return blocks;
}

/** Tables carry the comparison data; they are extracted rather than flattened. */
function tables(html = "") {
  const found = [];
  const tableRe = /<table\b[\s\S]*?<\/table>/gi;
  let table;
  while ((table = tableRe.exec(html))) {
    const rows = [];
    const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    let row;
    while ((row = rowRe.exec(table[0]))) {
      const cells = [...row[1].matchAll(/<(t[dh])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(
        (cell) => strip(cell[2]),
      );
      if (cells.length) rows.push(cells);
    }
    // Layout tables — a single cell used for a callout box — are not data.
    const widths = new Set(rows.map((r) => r.length));
    const isData = rows.length > 1 && !(widths.size === 1 && widths.has(1));
    if (isData) found.push(rows);
  }
  return found;
}

const categoryToPillar = {
  blog: "turkiye",
  cbi: "citizenship",
  "caribbean-citizenship": "citizenship",
  "eu-residency-programs": "residency",
  "global-mobility-residency": "residency",
  "uae-real-estate-golden-visa": "residency",
  realestate: "real-estate",
  news: "news",
};

console.log("Reading the legacy site…");

const [posts, projects, categories, media] = await Promise.all([
  fetchAll("posts", "id,slug,title,date,modified,categories,link,excerpt,content,featured_media"),
  fetchAll("project", "id,slug,title,date,modified,link,excerpt,content,featured_media"),
  fetchAll("categories", "id,slug,name"),
  withImages ? fetchAll("media", "id,source_url,alt_text,mime_type") : Promise.resolve([]),
]);

const categoryById = new Map(categories.map((c) => [c.id, c]));
const mediaById = new Map(media.map((m) => [m.id, m]));

console.log(`  ${posts.length} posts, ${projects.length} projects, ${categories.length} categories.`);

await mkdir(outDir, { recursive: true });

// ── Articles ────────────────────────────────────────────────────────────────

const articles = posts.map((post) => {
  const slugs = post.categories.map((id) => categoryById.get(id)?.slug).filter(Boolean);
  const body = paragraphs(post.content?.rendered);
  return {
    slug: post.slug,
    title: strip(post.title?.rendered),
    /** `Article.category` is a two-value union here; press has an outside source. */
    category: "Blog",
    date: post.date.slice(0, 10),
    modified: post.modified.slice(0, 10),
    pillars: [...new Set(slugs.map((s) => categoryToPillar[s]).filter(Boolean))],
    legacyCategories: slugs,
    excerpt: strip(post.excerpt?.rendered),
    body,
    tables: tables(post.content?.rendered),
    legacyUrl: post.link,
    image: mediaById.get(post.featured_media)?.source_url ?? null,
  };
});

await writeFile(join(outDir, "articles.json"), JSON.stringify(articles, null, 2));

// ── Projects ────────────────────────────────────────────────────────────────

const developments = projects.map((project) => ({
  slug: project.slug,
  name: strip(project.title?.rendered),
  description: strip(project.excerpt?.rendered),
  body: paragraphs(project.content?.rendered),
  legacyUrl: project.link,
  image: mediaById.get(project.featured_media)?.source_url ?? null,
}));

await writeFile(join(outDir, "projects.json"), JSON.stringify(developments, null, 2));

// ── Redirect map ────────────────────────────────────────────────────────────

const path = (url) => new URL(url).pathname.replace(/\/$/, "") || "/";

const redirects = [
  ...articles.map((a) => ({ from: path(a.legacyUrl), to: `/knowledge/${a.slug}` })),
  ...developments.map((d) => ({ from: path(d.legacyUrl), to: `/properties/${d.slug}` })),
];

await writeFile(join(outDir, "redirects.json"), JSON.stringify(redirects, null, 2));

// ── Figures asserted in migrated prose ──────────────────────────────────────

const claim = /(?:USD|EUR|AED|\$)\s?\d[\d,.]*(?:\s?(?:K\b|million))?|\b\d\s?[–-]\s?\d\s?months?\b|\b\d{2,3}\+?\s?visa[- ]free\b/gi;

const claims = [];
for (const article of articles) {
  const found = new Set();
  for (const line of [article.excerpt, ...article.body]) {
    for (const hit of line.match(claim) ?? []) found.add(hit.trim());
  }
  if (found.size) claims.push({ slug: article.slug, figures: [...found] });
}

await writeFile(join(outDir, "figures-to-verify.json"), JSON.stringify(claims, null, 2));

// ── Contradictions between articles ─────────────────────────────────────────
//
// The reason this report exists: the legacy articles do not agree with each
// other. Türkiye's citizenship threshold rose to USD 400,000 in 2022, and
// several pieces still quote the figure it replaced — on the very pages that
// rank for "how much does Turkish citizenship cost". A migration that copies
// them across without reconciling would publish both answers on one site.

const amount = /(?:USD\s?|\$)\s?([\d][\d,]{2,})(?:\s?(K|million))?/gi;

function normalise(digits, suffix) {
  let value = Number(digits.replace(/,/g, ""));
  if (/^k$/i.test(suffix ?? "")) value *= 1_000;
  if (/^million$/i.test(suffix ?? "")) value *= 1_000_000;
  return value;
}

const asserted = new Map();
for (const article of articles) {
  const blob = [
    article.title,
    article.excerpt,
    ...article.body,
    ...article.tables.flatMap((t) => t.map((r) => r.join(" "))),
  ].join("\n");

  for (const sentence of blob.split(/(?<=[.!?])\s+|\n/)) {
    if (!/turk|türk/i.test(sentence)) continue;
    if (!/citizenship|CBI|passport/i.test(sentence)) continue;
    amount.lastIndex = 0;
    let hit;
    while ((hit = amount.exec(sentence))) {
      const value = normalise(hit[1], hit[2]);
      if (value < 100_000 || value > 2_000_000) continue;
      if (!asserted.has(value)) asserted.set(value, new Set());
      asserted.get(value).add(article.slug);
    }
  }
}

const thresholds = [...asserted.entries()]
  .map(([value, slugs]) => ({ value, articles: [...slugs].sort() }))
  .sort((a, b) => b.articles.length - a.articles.length);

await writeFile(
  join(outDir, "threshold-conflicts.json"),
  JSON.stringify(thresholds, null, 2),
);

// ── Images ──────────────────────────────────────────────────────────────────

if (withImages) {
  const imageDir = join(outDir, "images");
  await mkdir(imageDir, { recursive: true });
  const urls = [...new Set([...articles, ...developments].map((i) => i.image).filter(Boolean))];
  console.log(`Downloading ${urls.length} images…`);
  let done = 0;
  for (const url of urls) {
    const name = decodeURIComponent(new URL(url).pathname.split("/").pop());
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  skipped ${name} (${response.status})`);
      continue;
    }
    await pipeline(response.body, createWriteStream(join(imageDir, name)));
    done++;
  }
  console.log(`  ${done} downloaded.`);
}

// ── Report ──────────────────────────────────────────────────────────────────

const withTables = articles.filter((a) => a.tables.length).length;
const words = articles.reduce((n, a) => n + a.body.join(" ").split(/\s+/).length, 0);

console.log(`
Written to ${outDir}/

  articles.json           ${articles.length} articles, ~${Math.round(words / 1000)}k words
                          ${withTables} carry comparison tables
  projects.json           ${developments.length} developments
  redirects.json          ${redirects.length} legacy paths
  figures-to-verify.json  ${claims.length} articles assert a figure
  threshold-conflicts.json ${thresholds.length} distinct Türkiye thresholds asserted

Next, and not optional: every figure in figures-to-verify.json has to be
checked against app/lib/figures.ts before any of this is published.
`);

const majority = thresholds[0];
const dissenting = thresholds.filter((t) => t.value !== majority?.value);

if (dissenting.length) {
  console.log(
    `The legacy articles do not agree on Türkiye's citizenship threshold.\n` +
      `  ${dissenting.reduce((n, t) => n + t.articles.length, 0)} article(s) quote something other than $${majority.value.toLocaleString()}:\n` +
      dissenting
        .slice(0, 6)
        .map(
          (t) =>
            `    $${t.value.toLocaleString().padEnd(9)} ${t.articles.slice(0, 3).join(", ")}` +
            (t.articles.length > 3 ? ` +${t.articles.length - 3} more` : ""),
        )
        .join("\n") +
      `\n  See threshold-conflicts.json. These are live pages today.\n`,
  );
}
