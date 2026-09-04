/**
 * Reads a WordPress export (WXR) and reports what it holds against
 * `app/lib/knowledge.ts`, emitting entries for anything missing.
 *
 * `migrate-legacy.mjs` pulls from the legacy site's REST API, which only ever
 * returns published posts and only for as long as that site stays up. An
 * export file is the offline record: it carries drafts too, and it keeps
 * working once multimulk.com is switched off. The conversion rules here are
 * deliberately identical to the REST migration's, so an entry produced by
 * either is indistinguishable in `knowledge.ts`.
 *
 *   node scripts/import-wxr.mjs <export.xml>
 *   node scripts/import-wxr.mjs <export.xml> --emit <slug>[,<slug>…]
 *   node scripts/import-wxr.mjs <export.xml> --emit <slug> --images public/images/legacy
 *
 * Nothing is written into `app/`. Migrated prose asserts thresholds and
 * processing times, and every one of those has to be checked against
 * `app/lib/figures.ts` before it goes near a page.
 */

import { readFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { join, basename } from "node:path";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const emit = args.includes("--emit") ? args[args.indexOf("--emit") + 1].split(",") : [];
const imageDir = args.includes("--images") ? args[args.indexOf("--images") + 1] : null;

if (!file) {
  console.error(
    "Usage: node scripts/import-wxr.mjs <export.xml> [--emit <slug,…>] [--images <dir>]",
  );
  process.exit(1);
}

// ── WXR parsing ─────────────────────────────────────────────────────────────
//
// An export is RSS with a WordPress namespace bolted on, and every field of
// interest is a CDATA section. That is regular enough to read without a parser
// and saves the dependency; the one thing to be careful of is that `<item>`
// never nests, which is what makes the split below safe.

const xml = await readFile(file, "utf8");
const items = xml.split("<item>").slice(1).map((s) => s.split("</item>")[0]);

const tag = (item, name) => {
  const match = item.match(
    new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`),
  );
  return match ? match[1] : "";
};

/** Post meta is a repeated key/value pair rather than a named element. */
function meta(item, key) {
  const re =
    /<wp:postmeta>\s*<wp:meta_key><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g;
  let match;
  while ((match = re.exec(item))) if (match[1] === key) return match[2];
  return null;
}

const categoriesOf = (item) =>
  [...item.matchAll(/<category domain="category" nicename="([^"]+)"/g)].map((m) => m[1]);

// ── Conversion. Kept in step with migrate-legacy.mjs ────────────────────────

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

/**
 * What WordPress does to post content on the way out, which an export skips.
 *
 * `content:encoded` is the raw editor content; the REST API returns it after
 * `wptexturize` and paragraph rendering, and the seventy-one entries already
 * in `knowledge.ts` came through that path. Without this, the same post
 * imported from an export would differ from its REST-migrated neighbours on
 * every apostrophe — straight where the rest of the file is curly.
 *
 * Deliberately a subset: the quote, dash and whitespace rules are the ones
 * that actually show up in this corpus. Verified by re-emitting all seventy-one
 * carried posts from the export and diffing against the file.
 */
function texturize(text) {
  return text
    // A no-break space and a block's own newlines both reach a rendered
    // paragraph as one ordinary space.
    .replace(/[ \s]+/g, " ")
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/(^|[\s([{])'/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/(^|[\s([{])"/g, "$1“")
    .replace(/"/g, "”")
    // A spaced hyphen is an en dash; a doubled one an em dash.
    .replace(/ -- /g, " — ")
    .replace(/ - /g, " – ")
    .trim();
}

/** Numeric character references, which `decode`'s named list cannot cover. */
const numeric = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const strip = (html = "") => texturize(numeric(decode(html.replace(/<[^>]+>/g, ""))));

/** Turns a body into the paragraph array `KnowledgeArticle.body` expects. */
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
      const cells = [...row[1].matchAll(/<(t[dh])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((cell) =>
        strip(cell[2]),
      );
      if (cells.length) rows.push(cells);
    }
    // Layout tables — a single cell used for a callout box — are not data.
    const widths = new Set(rows.map((r) => r.length));
    if (rows.length > 1 && !(widths.size === 1 && widths.has(1))) found.push(rows);
  }
  return found;
}

/**
 * WordPress's own auto-excerpt: the first 55 words of the stripped body with
 * an ellipsis appended. The REST migration received this pre-rendered, so it
 * has to be reproduced here or the two sources would disagree on every post
 * that never had a hand-written excerpt.
 */
function autoExcerpt(html) {
  const words = strip(html).split(/\s+/).filter(Boolean);
  if (words.length <= 55) return words.join(" ");
  return `${words.slice(0, 55).join(" ")} […]`;
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

// ── Read the export ─────────────────────────────────────────────────────────

const attachments = new Map(
  items
    .filter((item) => tag(item, "wp:post_type") === "attachment")
    .map((item) => [tag(item, "wp:post_id"), tag(item, "wp:attachment_url")]),
);

const posts = items
  .filter((item) => tag(item, "wp:post_type") === "post")
  .map((item) => {
    const html = tag(item, "content:encoded");
    const excerpt = strip(tag(item, "excerpt:encoded"));
    return {
      slug: tag(item, "wp:post_name"),
      status: tag(item, "wp:status"),
      title: strip(tag(item, "title")),
      date: tag(item, "wp:post_date").slice(0, 10),
      modified: tag(item, "wp:post_modified").slice(0, 10),
      topics: [
        ...new Set(categoriesOf(item).map((c) => categoryToPillar[c]).filter(Boolean)),
      ],
      excerpt: excerpt || autoExcerpt(html),
      body: paragraphs(html),
      tables: tables(html),
      image: attachments.get(meta(item, "_thumbnail_id")) ?? null,
    };
  });

// ── What is already carried ─────────────────────────────────────────────────

const knowledge = await readFile(new URL("../app/lib/knowledge.ts", import.meta.url), "utf8");
const carried = new Set([...knowledge.matchAll(/^ {4}slug: "(.+?)",$/gm)].map((m) => m[1]));

const empty = posts.filter((p) => p.body.length === 0);
const missing = posts.filter((p) => !carried.has(p.slug) && p.body.length > 0);

console.log(
  `${posts.length} post(s) in ${basename(file)} — ${carried.size} already in knowledge.ts.\n`,
);

for (const post of missing) console.log(`  missing  ${post.status.padEnd(8)} ${post.slug}`);
for (const post of empty) {
  console.log(`  empty    ${post.status.padEnd(8)} ${post.slug || "(no slug)"} — ${post.title}`);
}
if (!missing.length && !empty.length) console.log("  Nothing outstanding.");

// ── Emit ────────────────────────────────────────────────────────────────────

/** knowledge.ts is ASCII, so anything above it is escaped rather than literal. */
const literal = (value) =>
  JSON.stringify(value).replace(/[^\x20-\x7e]/g, (c) =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );

function entry(post, indent = "  ") {
  const i = indent;
  const lines = [
    `${i}{`,
    `${i}  slug: ${literal(post.slug)},`,
    `${i}  title: ${literal(post.title)},`,
    `${i}  date: ${literal(post.date)},`,
    `${i}  modified: ${literal(post.modified)},`,
    `${i}  topics: [${post.topics.map(literal).join(", ")}],`,
    `${i}  excerpt: ${literal(post.excerpt)},`,
  ];
  if (post.image) {
    lines.push(
      `${i}  image: ${literal(`/images/legacy/${basename(new URL(post.image).pathname)}`)},`,
    );
  }
  lines.push(`${i}  body: [`);
  for (const block of post.body) lines.push(`${i}    ${literal(block)},`);
  lines.push(`${i}  ],`);
  if (post.tables.length) {
    lines.push(`${i}  tables: [`);
    for (const table of post.tables) {
      lines.push(`${i}    [`);
      for (const row of table) lines.push(`${i}      [${row.map(literal).join(", ")}],`);
      lines.push(`${i}    ],`);
    }
    lines.push(`${i}  ],`);
  }
  lines.push(`${i}},`);
  return lines.join("\n");
}

if (emit.length) {
  const chosen = emit.map((slug) => {
    const post = posts.find((p) => p.slug === slug);
    if (!post) throw new Error(`No post in the export with slug "${slug}"`);
    return post;
  });

  if (imageDir) {
    await mkdir(imageDir, { recursive: true });
    for (const post of chosen.filter((p) => p.image)) {
      const name = decodeURIComponent(basename(new URL(post.image).pathname));
      const response = await fetch(post.image);
      if (!response.ok) {
        console.warn(`\n  skipped ${name} (${response.status})`);
        continue;
      }
      await pipeline(response.body, createWriteStream(join(imageDir, name)));
      console.log(`\n  downloaded ${name}`);
    }
  }

  console.log(`\n${"─".repeat(72)}\n`);
  console.log(chosen.map((post) => entry(post)).join("\n"));
}
