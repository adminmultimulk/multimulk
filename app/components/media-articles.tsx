"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ARTICLES_PER_PAGE, sortOptions, type SortOption } from "@/app/lib/media";
import type { AnyArticle } from "@/app/lib/article-shape";
import { isTopic, topics, type Topic } from "@/app/lib/topics";
import { useI18n } from "@/app/lib/i18n/context";
import { interpolate } from "@/app/lib/i18n/format";
import { AnimatedTitle } from "./animated-title";
import { ArticleCard } from "./article-card";
import { Container } from "./container";
import { SelectMenu } from "./select-menu";

type Filter = Topic | "all";

const readQuery = () => window.location.search;

/** Back and forward change the query without remounting this. */
function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

/**
 * The Knowledge Centre index: every article, all three collections, filterable
 * by pillar.
 *
 * The list is a prop rather than an import. The archive in `knowledge.ts` is
 * close to a megabyte of prose, and importing it here shipped every word of it
 * to the browser to render eight cards; passing it in from the server page
 * keeps it server-side, and is also what lets the dashboard's own articles be
 * merged in before it arrives.
 *
 * The filter is a topic rather than a category because that is what the
 * migrated corpus is organised by, and because `legacy-redirects.ts` already
 * sends each legacy blog category to `/knowledge?topic=<key>` — those URLs are
 * indexed, so the parameter is honoured here rather than dropping the reader
 * on an unfiltered page.
 *
 * It reads that parameter off `window.location` rather than through
 * `useSearchParams`, which is not a stylistic choice. The hook opts the
 * component into dynamic rendering and forces a Suspense boundary around it,
 * and the boundary's fallback is what gets prerendered — the grid leaves the
 * static HTML entirely, taking its article links with it. On the one page
 * whose job is to be the crawlable index of the corpus, that is the wrong
 * trade. Prerendering unfiltered and narrowing on hydration keeps the links in
 * the HTML and costs a reader arriving on a category redirect one frame.
 */
export function MediaArticles({ articles }: { articles: AnyArticle[] }) {
  const { t } = useI18n();

  // The server snapshot is an empty query, so the prerender is the full list.
  const query = useSyncExternalStore(subscribeToHistory, readQuery, () => "");
  const fromUrl = useMemo<Filter>(() => {
    const requested = new URLSearchParams(query).get("topic");
    return requested && isTopic(requested) ? requested : "all";
  }, [query]);

  /** A pill the reader pressed, which outranks the URL until they go back. */
  const [chosen, setChosen] = useState<Filter | null>(null);
  const filter = chosen ?? fromUrl;

  const [sort, setSort] = useState<SortOption>("Newest");
  const [page, setPage] = useState(1);

  const matches = useMemo(() => {
    const list =
      filter === "all"
        ? articles
        : articles.filter((a) => a.topics.includes(filter));
    // The list arrives newest-first, so oldest is just the reverse.
    return sort === "Newest" ? list : [...list].reverse();
  }, [articles, filter, sort]);

  const shown = matches.slice(0, page * ARTICLES_PER_PAGE);
  const hasMore = shown.length < matches.length;

  /** Any change to what is being listed sends the reader back to the first page. */
  function apply(next: { filter?: Filter; sort?: SortOption }) {
    if (next.filter) setChosen(next.filter);
    if (next.sort) setSort(next.sort);
    setPage(1);
  }

  return (
    <section className="bg-white py-[72px] lg:py-[144px]">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-[64px]">
          <h1 className="font-display text-[34px] leading-[1.36] text-ink sm:text-[42px] lg:text-[48px]">
            <AnimatedTitle variant="banner">
              {t.media.indexHeading}
            </AnimatedTitle>
          </h1>
          <p className="max-w-[713px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink lg:text-end">
            {t.media.indexBody}
          </p>
        </div>

        <span className="mt-[43.2px] block h-px w-full bg-ink/50" />

        <div className="mt-[43.2px] flex flex-col gap-6 pb-[15px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-[14.4px]">
            {(["all", ...topics] as Filter[]).map((name) => {
              const isActive = name === filter;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => apply({ filter: name })}
                  aria-pressed={isActive}
                  className={`rounded-full border border-ink px-[28.8px] py-[7.2px] text-[14.4px] leading-[21.6px] tracking-[0.02em] transition-colors ${
                    isActive
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-ink/[0.06]"
                  }`}
                >
                  {name === "all" ? t.common.viewAll : t.articles.topics[name]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center self-start rounded-full border border-ink py-[7.2px] ps-[21.6px] pe-[14.4px] sm:self-auto">
            <span className="border-e border-ink pe-[14.4px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink">
              {t.common.sortBy}
            </span>
            <SelectMenu
              label={t.articles.sortLabel}
              value={sort}
              onChange={(v) => apply({ sort: v as SortOption })}
              options={sortOptions}
              format={(v) => t.articles.sort[v as SortOption]}
              className="ps-[8.64px]"
              triggerClassName="pe-[9px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink"
              chevronClassName="text-ink"
              panelClassName="w-[max(100%,180px)]"
            />
          </div>
        </div>

        {shown.length ? (
          <ul className="grid items-start gap-[28.8px] sm:grid-cols-2 xl:grid-cols-4">
            {shown.map((article) => (
              <li key={article.slug}>
                <ArticleCard
                  article={article}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 303px"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center text-[14.4px] text-ink/70">
            {interpolate(t.articles.empty, {
              filter: filter === "all" ? t.common.viewAll : t.articles.topics[filter],
            })}
          </p>
        )}

        {hasMore ? (
          <div className="mt-[28.8px] flex justify-center">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full bg-ink px-[28.8px] py-[13px] text-[13.8px] text-white transition-colors hover:bg-forest"
            >
              {t.common.loadMore}
            </button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
