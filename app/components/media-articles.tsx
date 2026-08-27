"use client";

import { useMemo, useState } from "react";
import {
  ARTICLES_PER_PAGE,
  articleCategories,
  mediaArticles,
  mediaIndex,
  sortOptions,
  type ArticleFilter,
  type SortOption,
} from "@/app/lib/media";
import { AnimatedTitle } from "./animated-title";
import { ArticleCard } from "./article-card";
import { Container } from "./container";
import { SelectMenu } from "./select-menu";

export function MediaArticles() {
  const [filter, setFilter] = useState<ArticleFilter>("All");
  const [sort, setSort] = useState<SortOption>("Newest");
  const [page, setPage] = useState(1);

  const matches = useMemo(() => {
    const list =
      filter === "All"
        ? mediaArticles
        : mediaArticles.filter((a) => a.category === filter);
    // mediaArticles is already newest-first, so oldest is just the reverse.
    return sort === "Newest" ? list : [...list].reverse();
  }, [filter, sort]);

  const shown = matches.slice(0, page * ARTICLES_PER_PAGE);
  const hasMore = shown.length < matches.length;

  /** Any change to what is being listed sends the reader back to the first page. */
  function apply(next: { filter?: ArticleFilter; sort?: SortOption }) {
    if (next.filter) setFilter(next.filter);
    if (next.sort) setSort(next.sort);
    setPage(1);
  }

  return (
    <section className="bg-white py-[72px] lg:py-[144px]">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-[64px]">
          <h1 className="font-display text-[34px] leading-[1.36] text-ink sm:text-[42px] lg:text-[48px]">
            <AnimatedTitle variant="banner">{mediaIndex.heading}</AnimatedTitle>
          </h1>
          <p className="max-w-[713px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink lg:text-right">
            {mediaIndex.body}
          </p>
        </div>

        <span className="mt-[43.2px] block h-px w-full bg-ink/50" />

        <div className="mt-[43.2px] flex flex-col gap-6 pb-[15px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-[14.4px]">
            {articleCategories.map((name) => {
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
                  {name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center self-start rounded-full border border-ink py-[7.2px] pl-[21.6px] pr-[14.4px] sm:self-auto">
            <span className="border-r border-ink pr-[14.4px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink">
              Sort by
            </span>
            <SelectMenu
              label="Sort articles"
              value={sort}
              onChange={(v) => apply({ sort: v as SortOption })}
              options={sortOptions}
              className="pl-[8.64px]"
              triggerClassName="pr-[9px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink"
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
            Nothing filed under {filter} yet.
          </p>
        )}

        {hasMore ? (
          <div className="mt-[28.8px] flex justify-center">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full bg-ink px-[28.8px] py-[13px] text-[13.8px] text-white transition-colors hover:bg-forest"
            >
              {mediaIndex.loadMore}
            </button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
