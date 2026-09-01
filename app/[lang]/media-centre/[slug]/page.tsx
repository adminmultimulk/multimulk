import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { ArticleCard } from "@/app/components/article-card";
import { Container } from "@/app/components/container";
import { MediaNewsletter } from "@/app/components/media-newsletter";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { formatDate } from "@/app/lib/i18n/format";
import {
  getArticle,
  mediaArticles,
  relatedArticles,
  resolveArticle,
} from "@/app/lib/media";
import { locales } from "@/app/lib/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    mediaArticles.map((article) => ({ lang, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/media-centre/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getDictionary();
  const source = getArticle(slug);
  if (!source) return { title: t.meta.articleFallback };

  const article = resolveArticle(source, t.articles.copy[slug]);
  return {
    title: `${article.title} | Multi Mulk`,
    description: article.body[0],
    alternates: await alternatesFor(`/media-centre/${slug}`),
    openGraph: {
      title: article.title,
      description: article.body[0],
      type: "article",
      publishedTime: article.date,
      images: [article.hero ?? article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[lang]/media-centre/[slug]">) {
  const { slug } = await params;
  const source = getArticle(slug);
  if (!source) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const article = resolveArticle(source, t.articles.copy[slug]);
  const related = relatedArticles(slug);

  return (
    <>
      {/* Banner. The design carries no type over it — the headline sits in the
          white band below — so this is the photograph and the nav alone. */}
      <div className="relative">
        <SiteNav />
        <div className="relative min-h-[380px] w-full overflow-hidden bg-forest lg:aspect-[8/3] lg:min-h-0">
          <Image
            src={article.hero ?? article.image}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          {/* Scrim under the nav, which runs light over whatever is loaded. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-forest-deep/60 to-transparent" />
        </div>
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
                    {t.media.article.categoryLabel}
                  </span>
                  <span>{t.articles.categories[article.category]}</span>
                  <span className="text-ink/60">
                    {t.media.article.publishedLabel}
                  </span>
                  <time className="num" dateTime={article.date}>
                    {formatDate(locale, article.date)}
                  </time>
                  {article.source ? (
                    <>
                      <span className="text-ink/60">
                        {t.media.article.sourceLabel}
                      </span>
                      <span>{article.source}</span>
                    </>
                  ) : null}
                </p>

                <div className="mt-[7.2px] flex flex-col gap-[21.6px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink">
                  {article.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>

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
                          aspect="324/202"
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
