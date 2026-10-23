/**
 * Article translations, between the English and `content_translations`.
 *
 *   npm run translations -- export              write every English source to
 *                                               .translations/source/article/
 *   npm run translations -- status              coverage per language, stale
 *                                               rows included
 *   npm run translations -- import              validate and store every file in
 *                                               .translations/<locale>/article/
 *   npm run translations -- import --locale fa  one language
 *   npm run translations -- import --dry-run    validate, store nothing
 *
 * A translation file is the source file's shape in another language:
 *
 *   { "slug", "sourceHash", "title", "excerpt", "body": [...],
 *     "tables"?: [...], "seoTitle"?, "seoDescription"? }
 *
 * `sourceHash` is copied from the source file as it was when the translation
 * was made, so a later change to the English shows up as stale rather than
 * being silently stamped as current.
 *
 * The import refuses a file whose structure differs from its English: block
 * for block the same kind (heading, list, table, figure…), the same number of
 * list items and table rows, the same links, image paths and citation marks,
 * and every figure the English states. A dropped paragraph or a mistyped
 * threshold is the failure that matters on a page about six-figure
 * investments, and it is the one a reader of the translation cannot see.
 *
 * `.translations/` is git-ignored: the database is the record, and these files
 * are working copies.
 */

import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/app/lib/db";
import { allArticles } from "@/app/lib/knowledge";
import { defaultLocale, locales, type Locale } from "@/app/lib/i18n/config";

const ROOT = ".translations";
const KIND = "article";

type Source = {
  slug: string;
  origin: "migrated" | "original" | "cms";
  sourceHash: string;
  title: string;
  excerpt: string;
  body: string[];
  tables?: string[][][];
  seoTitle?: string;
  seoDescription?: string;
};

type TranslationFile = Omit<Source, "origin">;

const targets = locales.filter((l) => l !== defaultLocale) as Exclude<Locale, "en">[];

function hash(source: Omit<Source, "sourceHash" | "origin" | "slug">): string {
  return createHash("sha256")
    .update(
      JSON.stringify([
        source.title,
        source.excerpt,
        source.body,
        source.tables ?? null,
        source.seoTitle ?? null,
        source.seoDescription ?? null,
      ]),
    )
    .digest("hex")
    .slice(0, 16);
}

/** Every article in English: the static archive and the dashboard's published rows. */
async function sources(): Promise<Source[]> {
  const out: Source[] = allArticles.map((a) => {
    const fields = {
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      tables: a.tables,
      seoTitle: a.seoTitle,
      seoDescription: a.seoDescription,
    };
    return { slug: a.slug, origin: a.origin, sourceHash: hash(fields), ...fields };
  });
  const taken = new Set(out.map((s) => s.slug));
  const rows = await prisma.article.findMany({ where: { status: "PUBLISHED" } });
  for (const row of rows) {
    if (taken.has(row.slug)) continue;
    const fields = {
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
    };
    out.push({ slug: row.slug, origin: "cms", sourceHash: hash(fields), ...fields });
  }
  return out;
}

/**
 * Whether a language still needs a translation of this piece in the store.
 * The five originals carry Arabic, Russian, French and Urdu in the dictionaries
 * already; those stay where they are.
 */
async function staged(source: Source, locale: Locale): Promise<boolean> {
  if (source.origin !== "original") return false;
  const dictionary = (await import(`@/app/lib/i18n/dictionaries/${locale}`)).default;
  return Boolean(dictionary.articles?.copy?.[source.slug]?.body);
}

// --- validation -----------------------------------------------------------

/** The kind of block an entry is, by how it starts — the grammar in `rich-text.ts`. */
function blockKind(block: string): string {
  if (block.startsWith("### ")) return "h3";
  if (block.startsWith("## ")) return "h2";
  if (block.startsWith("![")) return "figure";
  if (block.startsWith("|")) return "table";
  if (block.startsWith(":::")) return `callout:${block.slice(3).split(/\s/)[0]}`;
  if (block.trim() === "---") return "rule";
  if (block.startsWith("> ")) return "quote";
  if (/^- /.test(block)) return "list";
  if (/^\d+\. /.test(block)) return "ordered";
  return "paragraph";
}

const lines = (block: string) => block.split("\n").length;
const links = (s: string) => [...s.matchAll(/\]\(([^)\s]+)/g)].map((m) => m[1]).sort();
const citations = (s: string) => (s.match(/\[\d+\](?!\()/g) ?? []).sort();

const localDigits: Record<string, string> = {};
"۰۱۲۳۴۵۶۷۸۹".split("").forEach((d, i) => (localDigits[d] = String(i)));
"٠١٢٣٤٥٦٧٨٩".split("").forEach((d, i) => (localDigits[d] = String(i)));
const ascii = (s: string) => s.replace(/[۰-۹٠-٩]/g, (d) => localDigits[d]);

/** Numbers as bare digit strings, separators dropped: "400,000" and "400.000" are both "400000". */
function numbers(s: string, joinSpaces: boolean): string[] {
  const sep = joinSpaces ? "[,.\\u00A0\\u202F\\u066B\\u066C' ]" : "[,.\\u066B\\u066C']";
  const re = new RegExp(`\\d(?:${sep}?\\d)*`, "g");
  return (ascii(s).match(re) ?? []).map((n) => n.replace(/\D/g, ""));
}

/** Every number the English states must appear in the translation. */
function missingNumbers(english: string, translated: string): string[] {
  const have = new Set([...numbers(translated, false), ...numbers(translated, true)]);
  return [...new Set(numbers(english, false))].filter((n) => !have.has(n));
}

function sameMultiset(a: string[], b: string[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function validate(source: Source, file: TranslationFile): string[] {
  const errors: string[] = [];
  if (file.slug !== source.slug) errors.push(`slug is ${file.slug}`);
  if (!file.sourceHash) errors.push("no sourceHash");
  if (!file.title?.trim()) errors.push("empty title");
  if (source.excerpt.trim() && !file.excerpt?.trim()) errors.push("empty excerpt");
  if (!Array.isArray(file.body)) return [...errors, "body is not a list"];
  if (file.body.length !== source.body.length) {
    return [...errors, `body has ${file.body.length} blocks, English has ${source.body.length}`];
  }

  const check = (where: string, en: string, tr: string) => {
    if (en.trim() && !tr?.trim()) return errors.push(`${where}: empty`);
    if (!sameMultiset(links(en), links(tr))) errors.push(`${where}: links differ`);
    if (!sameMultiset(citations(en), citations(tr))) errors.push(`${where}: citation marks differ`);
    const missing = missingNumbers(en, tr);
    if (missing.length) errors.push(`${where}: missing figures ${missing.join(", ")}`);
  };

  check("title", source.title, file.title);
  check("excerpt", source.excerpt, file.excerpt);
  if (source.seoTitle) check("seoTitle", source.seoTitle, file.seoTitle ?? "");
  if (source.seoDescription) check("seoDescription", source.seoDescription, file.seoDescription ?? "");

  source.body.forEach((en, i) => {
    const tr = file.body[i] ?? "";
    const kind = blockKind(en);
    if (blockKind(tr) !== kind) errors.push(`block ${i}: ${blockKind(tr)}, English is ${kind}`);
    if (["list", "ordered", "table", "quote"].includes(kind) && lines(en) !== lines(tr)) {
      errors.push(`block ${i}: ${lines(tr)} lines, English has ${lines(en)}`);
    }
    check(`block ${i}`, en, tr);
  });

  const enTables = source.tables ?? [];
  const trTables = file.tables ?? [];
  if (enTables.length !== trTables.length) {
    errors.push(`${trTables.length} tables, English has ${enTables.length}`);
  } else {
    enTables.forEach((table, t) => {
      const shape = (x: string[][]) => x.map((row) => row.length).join(",");
      if (shape(table) !== shape(trTables[t] ?? [])) {
        errors.push(`table ${t}: shape differs`);
        return;
      }
      table.forEach((row, r) =>
        row.forEach((cell, c) => check(`table ${t} [${r},${c}]`, cell, trTables[t][r][c])),
      );
    });
  }
  return errors;
}

// --- commands ---------------------------------------------------------------

async function exportSources() {
  const dir = join(ROOT, "source", KIND);
  mkdirSync(dir, { recursive: true });
  const all = await sources();
  for (const source of all) {
    writeFileSync(join(dir, `${source.slug}.json`), JSON.stringify(source, null, 2) + "\n");
  }
  const words = all.reduce((n, s) => n + JSON.stringify([s.title, s.excerpt, s.body, s.tables ?? []]).split(/\s+/).length, 0);
  console.log(`${all.length} articles written to ${dir} (~${words.toLocaleString()} words)`);
}

async function status(verbose: boolean) {
  const all = await sources();
  const rows = await prisma.contentTranslation.findMany({
    where: { kind: KIND },
    select: { slug: true, locale: true, sourceHash: true, reviewedAt: true },
  });
  const bySlug = new Map(all.map((s) => [s.slug, s]));
  console.log("locale  stored  needed  stale  reviewed  files-not-imported");
  for (const locale of targets) {
    const mine = rows.filter((r) => r.locale === locale);
    const storedSlugs = new Set(mine.map((r) => r.slug));
    const needed: Source[] = [];
    for (const s of all) if (!storedSlugs.has(s.slug) && !(await staged(s, locale))) needed.push(s);
    const stale = mine.filter((r) => bySlug.get(r.slug) && bySlug.get(r.slug)!.sourceHash !== r.sourceHash);
    const dir = join(ROOT, locale, KIND);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)) : [];
    const pending = files.filter((f) => !storedSlugs.has(f));
    console.log(
      `${locale.padEnd(6)}  ${String(mine.length).padStart(6)}  ${String(needed.length).padStart(6)}  ${String(stale.length).padStart(5)}  ${String(mine.filter((r) => r.reviewedAt).length).padStart(8)}  ${String(pending.length).padStart(18)}`,
    );
    if (verbose) {
      for (const s of needed) console.log(`        needs ${s.slug}`);
      for (const r of stale) console.log(`        stale ${r.slug}`);
    }
  }
}

async function importFiles(only: Locale | undefined, dryRun: boolean) {
  const bySlug = new Map((await sources()).map((s) => [s.slug, s]));
  let stored = 0;
  let failed = 0;
  for (const locale of targets) {
    if (only && locale !== only) continue;
    const dir = join(ROOT, locale, KIND);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const where = `${locale}/${name}`;
      let file: TranslationFile;
      try {
        file = JSON.parse(readFileSync(join(dir, name), "utf8"));
      } catch (error) {
        console.log(`✗ ${where}: not JSON — ${(error as Error).message}`);
        failed++;
        continue;
      }
      const source = bySlug.get(name.slice(0, -5));
      if (!source) {
        console.log(`✗ ${where}: no English article with this slug`);
        failed++;
        continue;
      }
      const errors = validate(source, file);
      if (errors.length) {
        console.log(`✗ ${where}\n    ${errors.slice(0, 12).join("\n    ")}${errors.length > 12 ? `\n    …and ${errors.length - 12} more` : ""}`);
        failed++;
        continue;
      }
      if (!dryRun) {
        const data = {
          title: file.title.trim(),
          excerpt: file.excerpt?.trim() ?? "",
          body: file.body,
          tables: file.tables ?? undefined,
          seoTitle: file.seoTitle?.trim() || null,
          seoDescription: file.seoDescription?.trim() || null,
          sourceHash: file.sourceHash,
        };
        await prisma.contentTranslation.upsert({
          where: { kind_slug_locale: { kind: KIND, slug: source.slug, locale } },
          create: { kind: KIND, slug: source.slug, locale, ...data },
          update: data,
        });
      }
      stored++;
    }
  }
  console.log(`\n${dryRun ? "valid" : "stored"}: ${stored}   refused: ${failed}`);
  if (!dryRun && stored) {
    console.log("Live within five minutes (the translation cache's ceiling).");
  }
  if (failed) process.exitCode = 1;
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const flag = (name: string) => rest.includes(name);
  const value = (name: string) => {
    const i = rest.indexOf(name);
    return i >= 0 ? rest[i + 1] : undefined;
  };
  switch (command) {
    case "export":
      return exportSources();
    case "status":
      return status(flag("--verbose"));
    case "import": {
      const locale = value("--locale");
      if (locale && !targets.includes(locale as (typeof targets)[number])) {
        throw new Error(`--locale must be one of ${targets.join(", ")}`);
      }
      return importFiles(locale as Locale | undefined, flag("--dry-run"));
    }
    default:
      console.log("usage: npm run translations -- export | status [--verbose] | import [--locale xx] [--dry-run]");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
