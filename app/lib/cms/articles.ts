import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/app/lib/db";
import { allArticles, type AnyArticle } from "@/app/lib/knowledge";
import { isTopic, type Topic } from "@/app/lib/topics";
import {
  isArticleCategory,
  sectionOf,
  type ArticleCategory,
} from "@/app/lib/sections";
import { ARTICLES_TAG } from "./tags";

/**
 * News & Insights, with everything written in the dashboard merged in.
 *
 * The static lists in `media.ts` and `knowledge.ts` stay exactly as they were:
 * they are the archive, they are what the legacy redirects point at, and they
 * are what the site renders when the database is unreachable. Rows from
 * `articles` are a third source layered on top, and the merge happens here so
 * every page that lists or resolves an article agrees on the result.
 */

/** ISO day, which is the shape `AnyArticle.date` is documented as. */
function day(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/**
 * Reads the published rows and normalises them onto `AnyArticle`.
 *
 * Cached rather than queried per render: the index, every article page and
 * each page's related rail all want the same list, and without this a single
 * article page opens four connections to Atlas to build one sidebar. The tag
 * is invalidated by the dashboard the moment anything is published, so the
 * five-minute ceiling is a backstop and not the update path.
 */
const load = unstable_cache(
  async (): Promise<AnyArticle[]> => {
    const rows = await prisma.article.findMany({
      // A publication date in the future is how a piece is scheduled: the
      // dashboard marks it published, and it is withheld here until the date
      // arrives. The five-minute ceiling below is what releases it, so a
      // scheduled piece appears within five minutes of its time rather than
      // exactly on it — which is the right trade for a Knowledge Centre.
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
    });

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      date: day(row.publishedAt ?? row.createdAt),
      modified: day(row.updatedAt),
      excerpt: row.excerpt,
      image: row.image ?? undefined,
      hero: row.hero ?? undefined,
      body: row.body,
      topics: row.topics.filter(isTopic) as Topic[],
      source: row.source ?? undefined,
      // A row written before a category existed, or one carrying a value that
      // has since been retired, reads as a blog post — which is where the
      // Articles section lists it, rather than nowhere.
      category: (isArticleCategory(row.category)
        ? row.category
        : "Blog") as ArticleCategory,
      readMore: row.readMore ?? undefined,
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
      canonical: row.canonicalUrl ?? undefined,
      noindex: row.noindex,
      origin: "cms" as const,
    }));
  },
  ["cms-articles"],
  { tags: [ARTICLES_TAG], revalidate: 300 },
);

/**
 * Just the dashboard's articles.
 *
 * A database that is down must not take the Knowledge Centre with it — the
 * static archive is the bulk of the site and answers perfectly well on its
 * own — so a failure here is logged and read as "nothing published yet".
 */
export async function cmsArticles(): Promise<AnyArticle[]> {
  try {
    return await load();
  } catch (error) {
    console.error("Could not load published articles:", error);
    return [];
  }
}

/**
 * Everything the Knowledge Centre lists, newest first.
 *
 * Slug collisions cannot happen — the dashboard refuses a slug the static
 * lists already use — but the static entry wins here anyway, because a URL
 * that has been indexed for months should not change what it answers because
 * of a row inserted by hand.
 */
export async function mergedArticles(): Promise<AnyArticle[]> {
  const fromDb = await cmsArticles();
  const taken = new Set(allArticles.map((a) => a.slug));
  return [...allArticles, ...fromDb.filter((a) => !taken.has(a.slug))].sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export async function findMergedArticle(
  slug: string,
): Promise<AnyArticle | undefined> {
  return (await mergedArticles()).find((article) => article.slug === slug);
}

/**
 * The rail beside an article: the reader's own section first, a shared topic
 * next, then the newest of whatever is left, so it is never short.
 *
 * `related` in `knowledge.ts` is the synchronous version of this, over the
 * static archive alone, and stays where it is — the pages that do not touch
 * the database still use it.
 *
 * Section outranks topic. Somebody reading a market
 * insight is reading the market, and a rail that answers with three blog posts
 * because they happen to share the "turkiye" topic sends them out of the
 * section they came for. The whole corpus is still the fallback, so the rail
 * is never short in a section holding fewer than three pieces.
 */
export async function relatedMerged(
  slug: string,
  count = 3,
): Promise<AnyArticle[]> {
  const all = await mergedArticles();
  const current = all.find((a) => a.slug === slug);
  const others = all.filter((a) => a.slug !== slug);
  if (!current) return others.slice(0, count);

  const section = sectionOf(current.category);
  /** Same section outranks a shared topic; both beat neither. */
  const score = (a: AnyArticle) =>
    (sectionOf(a.category) === section ? 2 : 0) +
    (a.topics.some((topic) => current.topics.includes(topic)) ? 1 : 0);

  // `sort` is stable, so the list stays newest-first inside each band.
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, count);
}
