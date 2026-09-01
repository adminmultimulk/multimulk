"use client";

import Image from "next/image";
import { Link } from "./link";
import { resolveArticle, type Article } from "@/app/lib/media";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The article card: thumbnail, meta line, headline. Shared by the Media Centre
 * grid and the rail beside an article page, which are the same card at two
 * widths — keep them here so the two cannot drift apart.
 */
export function ArticleCard({
  article,
  sizes,
  /** Design uses 302/202 in the grid and 324/202 in the rail. */
  aspect = "302/202",
  headingLevel = 2,
}: {
  article: Article;
  sizes: string;
  aspect?: string;
  headingLevel?: 2 | 3;
}) {
  const { t, date } = useI18n();
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const copy = resolveArticle(article, t.articles.copy[article.slug]);

  return (
    <Link
      href={`/media-centre/${article.slug}`}
      className="group flex flex-col gap-[14.4px]"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={article.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <p className="flex flex-wrap items-center gap-x-[7.2px] text-[11.5px] leading-[17.28px] tracking-[0.02em] text-ink">
        <span>{t.articles.categories[article.category]}</span>
        <span aria-hidden>|</span>
        <span className="num">{date(article.date)}</span>
        {article.source ? (
          <>
            <span aria-hidden>|</span>
            <span>{article.source}</span>
          </>
        ) : null}
      </p>

      <Heading className="text-[15.8px] leading-[23.76px] tracking-[0.02em] text-ink transition-colors group-hover:text-forest">
        {copy.title}
      </Heading>
    </Link>
  );
}
