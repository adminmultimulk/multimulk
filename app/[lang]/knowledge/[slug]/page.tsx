import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { ArticleCard } from "@/app/components/article-card";
import { ArticleBody } from "@/app/components/article-body";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { MediaNewsletter } from "@/app/components/media-newsletter";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { formatDate, selectPlural } from "@/app/lib/i18n/format";
import { readingMinutes } from "@/app/lib/rich-text";
import { locales } from "@/app/lib/i18n/config";
import { localise, type AnyArticle } from "@/app/lib/article-shape";
import { ogImage } from "@/app/lib/content";
import { allArticles } from "@/app/lib/knowledge";
import { findMergedArticle, relatedMerged } from "@/app/lib/cms/articles";
import { article as articleSchema, breadcrumbs } from "@/app/lib/seo/jsonld";
import type { Dictionary } from "@/app/lib/i18n";

/**
 * Prerenders the static archive in every language.
 *
 * Deliberately not the dashboard's articles: `generateStaticParams` runs at
 * build time, and a piece published this afternoon has no build to be part of.
 * Those render on first request instead and are cached from then on — which is
 * what `dynamicParams` (on by default) allows, and what the publish action's
 * `revalidatePath` refreshes.
 */
export function generateStaticParams() {
  return locales.flatMap((lang) =>
    allArticles.map((article) => ({ lang, slug: article.slug })),
  );
}

/**
 * Resolves a slug against the merged list, in this language.
 *
 * `localise` swaps in staged copy for the pieces written for this site and
 * leaves a migrated or dashboard-written one as it stands — those are
 * English-only for now.
 */
async function resolve(
  slug: string,
  t: Dictionary,
): Promise<AnyArticle | undefined> {
  const article = await findMergedArticle(slug);
  return article ? localise(article, t.articles.copy[slug]) : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/knowledge/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getDictionary();
  const article = await resolve(slug, t);
  if (!article) return { title: t.meta.articleFallback };

  // A headline is written for the page and a title tag is written for a result
  // listing, so the dashboard can set the second one separately. Both fall
  // back to what the page itself says, which is every article written before
  // the fields existed and the whole static archive.
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const alternates = await alternatesFor(`/knowledge/${slug}`);

  return {
    title,
    description,
    alternates: article.canonical
      ? { ...alternates, canonical: article.canonical }
      : alternates,
    robots: article.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.modified,
      // An article without a photograph falls back to the brand card rather
      // than to nothing: an empty array here is not "no preference", it is an
      // explicit override of the site default, and it unfurls as a bare link.
      images: [article.hero ?? article.image ?? ogImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[lang]/knowledge/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const article = await resolve(slug, t);
  if (!article) notFound();

  const related = await relatedMerged(slug);

  const banner = article.hero ?? article.image;

  return (
    <>
      <JsonLd
        graph={[
          articleSchema(locale, {
            slug: article.slug,
            title: article.title,
            date: article.date,
            modified: article.modified,
            source: article.source,
            image: article.image,
            hero: article.hero,
            body: [article.excerpt, ...article.body],
          }),
          breadcrumbs({
            locale,
            id: "article",
            values: { slug },
            labels: t.routes,
            leafLabel: article.title,
          }),
        ]}
      />

      {/* Banner. The design carries no type over it — the headline sits in the
          white band below — so this is the photograph and the nav alone. */}
      <div className="relative">
        <SiteNav />
        {banner ? (
          // 16/9 on a phone: a full-bleed banner at a fixed 380px height was
          // cropping a third off each side of a headline set into the artwork.
          // The 8/3 letterbox on desktop only trims sky and foreground, which
          // the banners are built to lose.
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest lg:aspect-[8/3]">
            <Image
              src={banner}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            {/* Scrim under the nav, which runs light over whatever is loaded. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/60 to-transparent" />
          </div>
        ) : (
          // A migrated piece may have had no featured image. The nav needs a
          // dark ground to sit on regardless.
          <div className="h-[128px] bg-forest" />
        )}
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px]">
          <Container>
            {/* 1296 canvas: 842.4 article + 129.6 gutter + 324 rail. */}
            <div className="grid gap-[57.6px] lg:grid-cols-[1fr_324px] lg:gap-[129.6px]">
              <article>
                <h1 className="font-display text-[30px] leading-[1.36] text-ink sm:text-[38px] lg:text-[48px]">
                  <AnimatedTitle variant="banner">{article.title}</AnimatedTitle>
                </h1>

                {/* Meta sits tight under the headline, as one block with the
                    standfirst — the design leaves no gap between them. */}
                <p className="mt-[14.4px] flex flex-wrap items-center gap-x-[7.2px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink">
                  <span className="text-ink/60">
                    {t.media.article.publishedLabel}
                  </span>
                  <time className="num" dateTime={article.date}>
                    {formatDate(locale, article.date)}
                  </time>
                  {article.modified !== article.date ? (
                    <>
                      <span className="text-ink/60">{t.review.line.split("{")[0].trim()}</span>
                      <time className="num" dateTime={article.modified}>
                        {formatDate(locale, article.modified)}
                      </time>
                    </>
                  ) : null}
                  {article.source ? (
                    <>
                      <span className="text-ink/60">
                        {t.media.article.sourceLabel}
                      </span>
                      <span>{article.source}</span>
                    </>
                  ) : null}
                  <span className="text-ink/60">·</span>
                  <span className="text-ink/60">
                    {selectPlural(
                      locale,
                      t.media.article.readingTime,
                      readingMinutes(article.body),
                    )}
                  </span>
                </p>

                <ArticleBody body={article.body} tables={article.tables} />

                {article.readMore ? (
                  <a
                    href={article.readMore}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-[28.8px] inline-block rounded-full bg-ink px-[28.8px] py-3 text-[13.8px] text-white transition-colors hover:bg-forest"
                  >
                    {t.common.readMore}
                  </a>
                ) : null}
              </article>

              {related.length ? (
                <aside>
                  <h2 className="sr-only">{t.media.article.relatedHeading}</h2>
                  <ul className="grid gap-[28.8px] sm:grid-cols-2 lg:grid-cols-1">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <ArticleCard
                          article={item}
                          headingLevel={3}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 324px"
                        />
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </div>
          </Container>
        </section>

        <MediaNewsletter />
      </main>

      <SiteFooter />
    </>
  );
}
