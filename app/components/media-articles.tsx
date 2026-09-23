"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { ARTICLES_PER_PAGE, sortOptions, type SortOption } from "@/app/lib/media";
import type { AnyArticle } from "@/app/lib/article-shape";
import {
  sectionFromParam,
  sectionOf,
  sectionParam,
  sections,
  type SectionId,
} from "@/app/lib/sections";
import { isTopic, topics, type Topic } from "@/app/lib/topics";
import { useI18n } from "@/app/lib/i18n/context";
import { interpolate } from "@/app/lib/i18n/format";
import { AnimatedTitle } from "./animated-title";
import { ArticleCard } from "./article-card";
import { Container } from "./container";
import { Chevron, Close, Search } from "./icons";
import { SelectMenu } from "./select-menu";

type Filter = Topic | "all";

/**
 * Reports the query string to the index whenever it changes — on arrival, on
 * back and forward, and when the menu or the index itself sets it.
 *
 * Its own component, behind its own Suspense boundary, because
 * `useSearchParams` bails the nearest boundary out of the prerender: here that
 * is this, which renders nothing, rather than the grid and its article links.
 */
function QueryWatcher({ onChange }: { onChange: (query: string) => void }) {
  const params = useSearchParams();
  const query = params.toString();
  useEffect(() => onChange(query), [query, onChange]);
  return null;
}

/**
 * Case- and accent-insensitive, so "turkiye" finds Türkiye on a keyboard
 * with no ü.
 */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/**
 * The page numbers to show: always the first and the last, the current one
 * and its neighbours, and a gap wherever that skips something.
 */
function pageList(current: number, total: number): (number | "gap")[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const out: (number | "gap")[] = [];
  let last = 0;
  for (let n = 1; n <= total; n++) {
    if (!wanted.has(n)) continue;
    if (n - last > 1) out.push("gap");
    out.push(n);
    last = n;
  }
  return out;
}

/**
 * The News & Insights index — Articles, Publications, Market Insights and
 * Events on one page — searchable, filterable by section and pillar, sorted
 * and paged.
 *
 * The section and the pillar live in the URL, as `?type=` and `?topic=`, so
 * the menu can open the page on a section, a link can be shared, and back and
 * forward step through what the reader looked at. Changing either from the
 * filter panel rewrites the query with `history.pushState`, which
 * Next folds into its router: the list narrows in place, nothing is fetched.
 * `?topic=` is also where `legacy-redirects.ts` sends each legacy blog
 * category, and those URLs are indexed.
 *
 * The list is a prop rather than an import. The archive in `knowledge.ts` is
 * close to a megabyte of prose, and importing it here shipped every word of it
 * to the browser to render eight cards; the page passes it in with the bodies
 * already stripped, since a card never shows one.
 *
 * The prerender has no query, so it is the Articles list, unfiltered — which
 * keeps its links in the static HTML — and a reader arriving on `?type=`
 * sees their section one frame after hydration.
 */
export function MediaArticles({
  articles,
}: {
  /** The whole corpus, newest first; this narrows it to a section itself. */
  articles: AnyArticle[];
}) {
  const { t } = useI18n();

  const [query, setQuery] = useState("");
  const params = useMemo(() => new URLSearchParams(query), [query]);
  const section = sectionFromParam(params.get("type"));
  const topic = params.get("topic");
  const filter: Filter = topic && isTopic(topic) ? topic : "all";
  const copy = t.insights.sections[section];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("Newest");
  /** The page, and the listing it is a page of; any other listing starts at one. */
  const [paging, setPaging] = useState({ of: "", n: 1 });
  const listing = `${query}|${search}|${sort}`;
  const page = paging.of === listing ? paging.n : 1;

  const top = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const needle = fold(search.trim());
    const list = articles.filter(
      (a) =>
        sectionOf(a.category) === section &&
        (filter === "all" || a.topics.includes(filter)) &&
        (!needle ||
          fold(`${a.title} ${a.excerpt} ${a.source ?? ""}`).includes(needle)),
    );
    // The list arrives newest-first, so oldest is just the reverse.
    return sort === "Newest" ? list : list.reverse();
  }, [articles, section, filter, search, sort]);

  const pageCount = Math.max(1, Math.ceil(matches.length / ARTICLES_PER_PAGE));
  const current = Math.min(page, pageCount);
  const shown = matches.slice(
    (current - 1) * ARTICLES_PER_PAGE,
    current * ARTICLES_PER_PAGE,
  );

  /** Section and pillar go into the URL; the watcher brings them back. */
  function navigate(next: { section?: SectionId; filter?: Filter }) {
    const url = new URL(window.location.href);
    const nextSection = next.section ?? section;
    const nextFilter = next.filter ?? filter;
    if (nextSection === "articles") url.searchParams.delete("type");
    else url.searchParams.set("type", sectionParam[nextSection]);
    if (nextFilter === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", nextFilter);
    window.history.pushState(null, "", url);
  }

  function goTo(n: number) {
    setPaging({ of: listing, n });
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="bg-white py-[72px] lg:py-[144px]">
      <Suspense fallback={null}>
        <QueryWatcher onChange={setQuery} />
      </Suspense>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-[64px]">
          <h1 className="font-display text-[34px] leading-[1.36] text-ink sm:text-[42px] lg:text-[48px]">
            <AnimatedTitle key={section} variant="banner">
              {copy.heading}
            </AnimatedTitle>
          </h1>
          <p className="max-w-[713px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink lg:text-end">
            {copy.body}
          </p>
        </div>

        <span className="mt-[43.2px] block h-px w-full bg-ink/50" />

        <div
          ref={top}
          className="mt-[43.2px] flex scroll-mt-[120px] flex-col gap-[14.4px] pb-[15px] sm:flex-row sm:items-center sm:justify-between"
        >
          <label className="flex w-full items-center gap-[10px] rounded-full border border-ink px-[21.6px] py-[7.2px] sm:max-w-[420px]">
            <Search className="w-[18px] shrink-0 text-ink" />
            <span className="sr-only">{t.articles.searchLabel}</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.articles.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink outline-none placeholder:text-ink/45 [&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={t.articles.clearSearch}
                className="shrink-0 text-ink/60 transition-colors hover:text-ink"
              >
                <Close className="w-[12px]" />
              </button>
            ) : null}
          </label>

          <div className="flex flex-wrap items-center gap-[14.4px] self-start sm:self-auto">
            <FilterMenu
              section={section}
              filter={filter}
              onSection={(id) => navigate({ section: id })}
              onFilter={(name) => navigate({ filter: name })}
            />

            <div className="flex items-center rounded-full border border-ink py-[7.2px] ps-[21.6px] pe-[14.4px]">
              <span className="border-e border-ink pe-[14.4px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink">
                {t.common.sortBy}
              </span>
              <SelectMenu
                label={t.articles.sortLabel}
                value={sort}
                onChange={(v) => setSort(v as SortOption)}
                options={sortOptions}
                format={(v) => t.articles.sort[v as SortOption]}
                className="ps-[8.64px]"
                triggerClassName="pe-[9px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink"
                chevronClassName="text-ink"
                panelClassName="w-[max(100%,180px)]"
              />
            </div>
          </div>
        </div>

        {shown.length ? (
          <ul className="mt-[14.4px] grid items-start gap-[28.8px] sm:grid-cols-2 xl:grid-cols-4">
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
            {/* "Nothing filed under View All yet" is what naming the filter
                produces when there is no filter, and a section with nothing in
                it is the common case for the three new ones. */}
            {search.trim()
              ? interpolate(t.articles.noMatch, { query: search.trim() })
              : filter === "all"
                ? t.articles.emptyHere
                : interpolate(t.articles.empty, {
                    filter: t.articles.topics[filter],
                  })}
          </p>
        )}

        {pageCount > 1 ? (
          <Pagination current={current} total={pageCount} onPage={goTo} />
        ) : null}
      </Container>
    </section>
  );
}

/**
 * The button beside the sort control, and the panel it opens: which section
 * to list, and which pillar within it.
 */
function FilterMenu({
  section,
  filter,
  onSection,
  onFilter,
}: {
  section: SectionId;
  filter: Filter;
  onSection: (id: SectionId) => void;
  onFilter: (name: Filter) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const chip = (active: boolean) =>
    `rounded-full border border-ink px-[18px] py-[5px] text-[13.5px] leading-[20px] tracking-[0.02em] transition-colors ${
      active ? "bg-ink text-white" : "text-ink hover:bg-ink/[0.06]"
    }`;

  return (
    <div ref={wrapper} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[10px] rounded-full border border-ink px-[21.6px] py-[7.2px] text-[14.4px] leading-[21.6px] tracking-[0.02em] text-ink transition-colors hover:bg-ink/[0.06]"
      >
        <span>{t.articles.filter}</span>
        {filter !== "all" ? (
          <span className="rounded-full bg-ink px-[8px] text-[11px] leading-[18px] text-white">
            {t.articles.topics[filter]}
          </span>
        ) : null}
        <Chevron
          className={`w-2 shrink-0 transition-transform duration-300 ${
            open ? "-scale-y-100" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={t.articles.filterLabel}
          className="absolute end-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-32px))] origin-top bg-cream p-6 text-start shadow-[0_18px_44px_-14px_rgba(34,42,44,0.45)] animate-select-open"
        >
          <fieldset>
            <legend className="mb-3 text-[12px] uppercase tracking-[0.12em] text-ink/60">
              {t.articles.filterType}
            </legend>
            <div className="flex flex-wrap gap-2">
              {sections.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={id === section}
                  onClick={() => onSection(id)}
                  className={chip(id === section)}
                >
                  {t.insights.sections[id].label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="mb-3 text-[12px] uppercase tracking-[0.12em] text-ink/60">
              {t.articles.filterTopic}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(["all", ...topics] as Filter[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={name === filter}
                  onClick={() => onFilter(name)}
                  className={chip(name === filter)}
                >
                  {name === "all" ? t.common.viewAll : t.articles.topics[name]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}

function Pagination({
  current,
  total,
  onPage,
}: {
  current: number;
  total: number;
  onPage: (n: number) => void;
}) {
  const { t } = useI18n();
  const step =
    "flex h-[40px] min-w-[40px] items-center justify-center rounded-full border border-ink px-3 text-[14.4px] text-ink transition-colors hover:bg-ink/[0.06] disabled:pointer-events-none disabled:opacity-30";

  return (
    <nav aria-label={t.articles.pagination} className="mt-[43.2px]">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button
            type="button"
            onClick={() => onPage(current - 1)}
            disabled={current === 1}
            aria-label={t.articles.previousPage}
            className={step}
          >
            <Chevron className="w-2 rotate-90 rtl:-rotate-90" />
          </button>
        </li>
        {pageList(current, total).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-ink/50">
              …
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                onClick={() => onPage(n)}
                aria-current={n === current ? "page" : undefined}
                aria-label={interpolate(t.articles.pageN, { n: String(n) })}
                className={`${step} ${
                  n === current ? "bg-ink text-white hover:bg-ink" : ""
                }`}
              >
                {n}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            onClick={() => onPage(current + 1)}
            disabled={current === total}
            aria-label={t.articles.nextPage}
            className={step}
          >
            <Chevron className="w-2 -rotate-90 rtl:rotate-90" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
