import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/app/lib/db";
import type { Locale } from "@/app/lib/i18n/config";
import { TRANSLATIONS_TAG } from "./tags";

/**
 * Content translated out of English, read from `content_translations`.
 *
 * Two reads, because the store is too big for one. Every list on the site —
 * the Knowledge Centre, the home page, the rail beside an article — needs the
 * headline and standfirst of every piece in the reader's language, and the
 * article page needs one body. Caching the bodies alongside the index would
 * put the whole translated corpus, several megabytes of it, into a single
 * cache entry, which `unstable_cache` refuses past 2 MB. So the index carries
 * the short fields only, and a body is fetched, and cached, one at a time.
 *
 * Rows are written by `scripts/translations.ts`, never by hand.
 */

export type TranslationKind = "article";

/** What a list needs to show a translated card. */
export type TranslationSummary = {
  kind: TranslationKind;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
};

/** The whole translation of one piece. */
export type Translation = TranslationSummary & {
  body: string[];
  tables?: string[][][];
};

const loadIndex = unstable_cache(
  async (): Promise<TranslationSummary[]> => {
    const rows = await prisma.contentTranslation.findMany({
      select: {
        kind: true,
        slug: true,
        locale: true,
        title: true,
        excerpt: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
    return rows.map((row) => ({
      kind: row.kind as TranslationKind,
      slug: row.slug,
      locale: row.locale as Locale,
      title: row.title,
      excerpt: row.excerpt,
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
    }));
  },
  ["translation-index"],
  { tags: [TRANSLATIONS_TAG], revalidate: 300 },
);

/**
 * Every translation's short fields.
 *
 * A database that is down reads as "nothing translated", which degrades every
 * page to English with its canonical on the English URL — the state the site
 * was in before this store existed, and a correct one.
 */
export async function translationIndex(): Promise<TranslationSummary[]> {
  try {
    return await loadIndex();
  } catch (error) {
    console.error("Could not load translations:", error);
    return [];
  }
}

/** The languages one piece has been translated into. */
export async function translatedLocales(
  kind: TranslationKind,
  slug: string,
): Promise<Locale[]> {
  return (await translationIndex())
    .filter((row) => row.kind === kind && row.slug === slug)
    .map((row) => row.locale);
}

/** One language's short fields, keyed by slug, for overlaying a list. */
export async function translationSummaries(
  kind: TranslationKind,
  locale: Locale,
): Promise<Map<string, TranslationSummary>> {
  return new Map(
    (await translationIndex())
      .filter((row) => row.kind === kind && row.locale === locale)
      .map((row) => [row.slug, row]),
  );
}

const loadOne = unstable_cache(
  async (
    kind: TranslationKind,
    slug: string,
    locale: Locale,
  ): Promise<Translation | null> => {
    const row = await prisma.contentTranslation.findUnique({
      where: { kind_slug_locale: { kind, slug, locale } },
    });
    if (!row) return null;
    return {
      kind,
      slug,
      locale,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      tables: (row.tables as string[][][] | null) ?? undefined,
      seoTitle: row.seoTitle ?? undefined,
      seoDescription: row.seoDescription ?? undefined,
    };
  },
  ["translation"],
  { tags: [TRANSLATIONS_TAG], revalidate: 300 },
);

/** One piece in one language, or nothing if it has not been translated. */
export async function findTranslation(
  kind: TranslationKind,
  slug: string,
  locale: Locale,
): Promise<Translation | null> {
  try {
    return await loadOne(kind, slug, locale);
  } catch (error) {
    console.error(`Could not load the ${locale} translation of ${slug}:`, error);
    return null;
  }
}
