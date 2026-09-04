/**
 * The shape every article is rendered in, and the one function that resolves
 * its language.
 *
 * Split out of `knowledge.ts` so a client component can import them without
 * importing the corpus. `knowledge.ts` is the merged archive — the seventy-odd
 * migrated guides, bodies and all, near a megabyte of prose — and any card,
 * grid or rail that reached for `AnyArticle` or `localise` was pulling the
 * whole thing into the browser bundle to use a type and eight lines of code.
 * The lists themselves now arrive as props from the server, where they belong.
 *
 * `knowledge.ts` re-exports both names, so nothing that imported them from
 * there has to change.
 */

import { pick, pickAll, type ArticleCopy } from "./i18n/format";
import type { ArticleCategory } from "./media";
import type { Topic } from "./topics";

/**
 * One article, whichever source it came from.
 *
 * Three collections feed the Knowledge Centre: the pieces written for this
 * site, which carry staged translations and framed hero photography; the
 * migrated ones, which carry headings and comparison tables; and whatever has
 * been written in the dashboard since. They stay separate at source — their
 * translation stories are genuinely different — and are normalised onto this
 * shape at the point of use.
 */
export type AnyArticle = {
  slug: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  image?: string;
  hero?: string;
  body: string[];
  tables?: string[][][];
  topics: Topic[];
  /** Publication a press piece ran in; absent on our own writing. */
  source?: string;
  /** Press or our own writing. Only the originals are filed this way. */
  category?: ArticleCategory;
  readMore?: string;
  /**
   * Search metadata, set per piece in the dashboard and absent on everything
   * else — the static collections fall back to the headline and standfirst,
   * which is what they were doing before any of these existed.
   */
  seoTitle?: string;
  seoDescription?: string;
  /** The original, for a piece that also ran somewhere else. */
  canonical?: string;
  /** Readable at its URL, kept out of search results. */
  noindex?: boolean;
  /**
   * Which collection it came from, for the pieces that render differently.
   * `cms` is a row written in the dashboard — like a migrated piece it has no
   * staged translations, but it is not part of the legacy import either.
   */
  origin: "migrated" | "original" | "cms";
};

/**
 * An article with this language's headline and body swapped in.
 *
 * Only the originals carry staged translations; a migrated piece and a
 * dashboard one are returned as they stand, which is what `origin` is for.
 * `resolveArticle` does the same job for the narrower `Article`, and both are
 * thin wrappers over the same two fallbacks — the split exists because only
 * one of the three collections has anything to fall back to.
 */
export function localise(
  article: AnyArticle,
  copy: ArticleCopy | undefined,
): AnyArticle {
  if (article.origin !== "original" || !copy) return article;
  return {
    ...article,
    title: pick(copy.title, article.title),
    body: pickAll(copy.body, article.body),
  };
}
