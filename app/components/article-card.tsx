"use client";

import Image from "next/image";
import { Link } from "./link";
import { localise, type AnyArticle } from "@/app/lib/article-shape";
import { buildPath } from "@/app/lib/routes";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The article card: thumbnail, meta line, headline. Shared by the Knowledge
 * Centre grid and the rail beside an article page, which are the same card at
 * two widths — keep them here so the two cannot drift apart.
 *
 * It takes `AnyArticle` because the index lists both collections and a reader
 * should not be able to tell which side of the WordPress migration a piece
 * came from. `localise` is a no-op on a migrated one, which has no staged
 * translation to swap in.
 */
export function ArticleCard({
  article,
  sizes,
  /**
   * 16/9, because that is what the featured images are: all but a dozen of
   * the migrated pieces carry a banner with the headline set into the
   * artwork, and the 3:2 frame the design started from cropped the first and
   * last word of it off. The dozen 3:2 photographs lose a little top and
   * bottom instead, which costs nothing.
   */
  aspect = "16/9",
  headingLevel = 2,
}: {
  article: AnyArticle;
  sizes: string;
  aspect?: string;
  headingLevel?: 2 | 3;
}) {
  const { t, date } = useI18n();
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const copy = localise(article, t.articles.copy[article.slug]);

  return (
    <Link
      href={buildPath("article", { slug: article.slug })}
      className="group flex flex-col gap-[14.4px]"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: aspect }}
      >
        <Image
          // A migrated piece that arrived without a featured image still needs
          // a card the same height as the ones beside it.
          src={article.image ?? "/images/region-turkiye.avif"}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <p className="flex flex-wrap items-center gap-x-[7.2px] text-[11.5px] leading-[17.28px] tracking-[0.02em] text-ink">
        {article.topics[0] ? (
          <>
            <span>{t.articles.topics[article.topics[0]]}</span>
            <span aria-hidden>|</span>
          </>
        ) : null}
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
