"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  documentCategories,
  documentCover,
  documentFile,
  isDocumentCategory,
  libraryDocuments,
  type DocumentCategory,
} from "@/app/lib/documents";
import { useI18n } from "@/app/lib/i18n/context";
import { Container } from "./container";
import { Chevron, Close, Download, Search } from "./icons";

type Filter = DocumentCategory | "all";

/**
 * Reports the query string whenever it changes. Behind its own Suspense
 * boundary for the reason given in `media-articles.tsx`: `useSearchParams`
 * bails the nearest boundary out of the prerender, and that should be this,
 * which renders nothing, rather than the grid of download links.
 */
function QueryWatcher({ onChange }: { onChange: (query: string) => void }) {
  const params = useSearchParams();
  const query = params.toString();
  useEffect(() => onChange(query), [query, onChange]);
  return null;
}

/** Case- and accent-insensitive, so "turkiye" finds Türkiye. */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/**
 * The Document Library's list: searchable, and filtered by category the way
 * the News & Insights index is filtered by pillar. The category lives in the
 * URL as `?category=`, so a filtered view can be linked to and back and
 * forward step through it.
 */
export function DocumentLibrary() {
  const { t, plural, num, fill } = useI18n();
  const copy = t.documents;

  const [query, setQuery] = useState("");
  const category = new URLSearchParams(query).get("category");
  const filter: Filter =
    category && isDocumentCategory(category) ? category : "all";
  const [search, setSearch] = useState("");

  const matches = useMemo(() => {
    const needle = fold(search.trim());
    return libraryDocuments.filter((doc) => {
      if (filter !== "all" && doc.category !== filter) return false;
      if (!needle) return true;
      const item = copy.items[doc.slug as keyof typeof copy.items];
      return fold(
        `${item.title} ${item.summary} ${copy.categories[doc.category]}`,
      ).includes(needle);
    });
  }, [filter, search, copy]);

  function navigate(next: Filter) {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.pushState(null, "", url);
  }

  return (
    <section className="bg-white py-[72px] lg:py-[120px]">
      <Suspense fallback={null}>
        <QueryWatcher onChange={setQuery} />
      </Suspense>
      <Container>
        <div className="flex flex-col gap-[14.4px] pb-[15px] sm:flex-row sm:items-center sm:justify-between">
          <label className="flex w-full items-center gap-[10px] rounded-full border border-ink px-[21.6px] py-[7.2px] sm:max-w-[420px]">
            <Search className="w-[18px] shrink-0 text-ink" />
            <span className="sr-only">{copy.searchLabel}</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.searchPlaceholder}
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

          <div className="self-start sm:self-auto">
            <FilterMenu filter={filter} onFilter={navigate} />
          </div>
        </div>

        {matches.length ? (
          <ul className="mt-[28.8px] grid gap-x-[28.8px] gap-y-[48px] sm:grid-cols-2 xl:grid-cols-3">
            {matches.map((doc) => {
              const item = copy.items[doc.slug as keyof typeof copy.items];
              const href = documentFile(doc.slug);
              const size = num(Math.round(doc.bytes / 1e5) / 10);
              return (
                <li key={doc.slug} className="flex flex-col gap-[14.4px]">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={fill(copy.viewLabel, { title: item.title })}
                    className="group relative block aspect-[16/9] w-full overflow-hidden bg-mist"
                  >
                    <Image
                      src={documentCover(doc.slug)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 410px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </a>

                  <p className="flex flex-wrap items-center gap-x-[7.2px] text-[11.5px] leading-[17.28px] tracking-[0.02em] text-ink">
                    <span>{copy.categories[doc.category]}</span>
                    <span aria-hidden>|</span>
                    <span className="num">
                      {plural(copy.pages, doc.pages)}
                    </span>
                    <span aria-hidden>|</span>
                    <span className="num">{fill(copy.size, { size })}</span>
                  </p>

                  <h2 className="text-[17px] leading-[25px] tracking-[0.02em] text-ink">
                    {item.title}
                  </h2>
                  <p className="flex-1 text-[13.5px] leading-[21.6px] tracking-[0.02em] text-ink/70">
                    {item.summary}
                  </p>

                  <div className="mt-[7.2px] flex flex-wrap gap-[10px]">
                    <a
                      href={href}
                      download
                      aria-label={fill(copy.downloadLabel, {
                        title: item.title,
                        size,
                      })}
                      className="flex items-center gap-[8px] rounded-full border border-ink bg-ink px-[21.6px] py-[7.2px] text-[13.5px] leading-[21.6px] tracking-[0.02em] text-white transition-colors hover:bg-forest hover:border-forest"
                    >
                      <Download className="w-[14px] shrink-0" />
                      {copy.download}
                    </a>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      aria-label={fill(copy.viewLabel, { title: item.title })}
                      className="rounded-full border border-ink px-[21.6px] py-[7.2px] text-[13.5px] leading-[21.6px] tracking-[0.02em] text-ink transition-colors hover:bg-ink/[0.06]"
                    >
                      {copy.view}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-16 text-center text-[14.4px] text-ink/70">
            {search.trim()
              ? fill(copy.noMatch, { query: search.trim() })
              : fill(copy.empty, {
                  filter: filter === "all" ? "" : copy.categories[filter],
                })}
          </p>
        )}
      </Container>
    </section>
  );
}

/** The Filter button and its panel of categories, as on the News & Insights index. */
function FilterMenu({
  filter,
  onFilter,
}: {
  filter: Filter;
  onFilter: (name: Filter) => void;
}) {
  const { t } = useI18n();
  const copy = t.documents;
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
        <span>{copy.filter}</span>
        {filter !== "all" ? (
          <span className="rounded-full bg-ink px-[8px] text-[11px] leading-[18px] text-white">
            {copy.categories[filter]}
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
          aria-label={copy.filterLabel}
          className="absolute end-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-32px))] origin-top bg-cream p-6 text-start shadow-[0_18px_44px_-14px_rgba(34,42,44,0.45)] animate-select-open"
        >
          <fieldset>
            <legend className="mb-3 text-[12px] uppercase tracking-[0.12em] text-ink/60">
              {copy.filterCategory}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(["all", ...documentCategories] as Filter[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={name === filter}
                  onClick={() => onFilter(name)}
                  className={chip(name === filter)}
                >
                  {name === "all" ? t.common.viewAll : copy.categories[name]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}
