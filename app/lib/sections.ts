/**
 * News & Insights: the four sections, and the filing category behind each.
 *
 * The site used to publish one stream — press coverage and our own blog posts,
 * side by side at /knowledge. It now publishes four, and they are one corpus
 * filed four ways rather than four content types: a publication and a market
 * insight are written, edited, translated, indexed and rendered exactly like a
 * blog post, so they are `Article` rows with a different `category` rather
 * than tables of their own.
 *
 * Its own module, below everything, for the same reason `topics.ts` is: the
 * category type is needed by `media.ts`, by the article shape, by the reader in
 * `cms/articles.ts` and by the dashboard, and any of those importing another
 * to get it would close a cycle.
 *
 * The keys are a public contract. `articles` answers at /knowledge, which is
 * where every legacy redirect points and where seventy-odd migrated pieces are
 * already indexed; the other three answer at /knowledge/<slug of the section>,
 * so renaming one is a URL change and not a rename.
 */

/**
 * How a piece is filed.
 *
 * "Press Media" and "Blog" are the original two and are stored in exactly the
 * words they always were — there are rows in the database and entries in the
 * static archive carrying them, and a rename here would silently unfile every
 * one of them.
 */
export type ArticleCategory =
  | "Press Media"
  | "Blog"
  | "Publication"
  | "Market Insight"
  | "Event";

/** Every category, in the order the dashboard offers them. */
export const categories: ArticleCategory[] = [
  "Blog",
  "Press Media",
  "Publication",
  "Market Insight",
  "Event",
];

export function isArticleCategory(value: string): value is ArticleCategory {
  return (categories as string[]).includes(value);
}

/** The four sections, in the order the menu and the section nav list them. */
export type SectionId = "articles" | "publications" | "marketInsights" | "events";

export const sections: SectionId[] = [
  "articles",
  "publications",
  "marketInsights",
  "events",
];

export function isSection(value: string): value is SectionId {
  return (sections as string[]).includes(value);
}

/**
 * What each section lists.
 *
 * Articles is the only one that takes two categories: "news and blogs" is one
 * reading experience with two provenances, and the card already says which by
 * naming the publication a press piece ran in.
 */
export const sectionCategories: Record<SectionId, ArticleCategory[]> = {
  articles: ["Blog", "Press Media"],
  publications: ["Publication"],
  marketInsights: ["Market Insight"],
  events: ["Event"],
};

/**
 * How each section is named in the `?type=` parameter on /knowledge.
 *
 * All four are listed on the one page now; the parameter is what the menu, the
 * tabs and the filter panel set, and what a shared or bookmarked link carries.
 * The values are the slugs the sections used to answer on beneath /knowledge,
 * so the redirects from those URLs in `next.config.ts` map one to one.
 */
export const sectionParam: Record<SectionId, string> = {
  articles: "articles",
  publications: "publications",
  marketInsights: "market-insights",
  events: "events",
};

/** The section a `?type=` value names; anything else is Articles. */
export function sectionFromParam(value: string | null): SectionId {
  return sections.find((id) => sectionParam[id] === value) ?? "articles";
}

/**
 * Where a section is listed. Articles is the page's default, so it keeps the
 * bare /knowledge that every legacy redirect already points at.
 */
export function sectionHref(id: SectionId): string {
  return id === "articles"
    ? "/knowledge"
    : `/knowledge?type=${sectionParam[id]}`;
}

/**
 * Which section a piece belongs to.
 *
 * An unfiled piece reads as an article, which is what the whole static archive
 * is: those entries predate the split and carry either "Blog", "Press Media" or
 * nothing at all.
 */
export function sectionOf(category: string | undefined): SectionId {
  switch (category) {
    case "Publication":
      return "publications";
    case "Market Insight":
      return "marketInsights";
    case "Event":
      return "events";
    default:
      return "articles";
  }
}

/** Filters a list to one section. */
export function inSection<T extends { category?: string }>(
  items: T[],
  section: SectionId,
): T[] {
  return items.filter((item) => sectionOf(item.category) === section);
}

/**
 * A list as the index cards need it: everything but the bodies and tables,
 * which a card never shows and which are most of the archive's weight. The
 * index is handed every section at once so it can switch between them in
 * place, and this is what keeps that from shipping the whole corpus's prose.
 */
export function forCards<T extends { body: string[]; tables?: unknown }>(
  items: T[],
): T[] {
  return items.map((item) => ({ ...item, body: [], tables: undefined }));
}
