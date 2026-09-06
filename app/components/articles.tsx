"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import { articleCategories } from "@/app/lib/media";
import { localise, type AnyArticle } from "@/app/lib/article-shape";
import { useI18n } from "@/app/lib/i18n/context";
import { buildPath } from "@/app/lib/routes";
import { Diamond } from "./icons";

export function Articles({ articles }: { articles: AnyArticle[] }) {
  const { t, date } = useI18n();
  const [category, setCategory] = useState<string>("All");

  const visible = (
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category)
  ).map((article) => localise(article, t.articles.copy[article.slug]));

  return (
    <section className="bg-white py-[72px] lg:py-[100px]">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_660px] lg:gap-10">
          <h2 className="font-display text-[32px] leading-[52px] text-ink sm:text-[40px]">
            <AnimatedTitle variant="section">
              {t.articlesSection.heading}
            </AnimatedTitle>
          </h2>
          <p className="max-w-[660px] self-center text-[12.5px] leading-[21px] text-ink">
            {t.articlesSection.body}
          </p>
        </div>

        <div className="my-10 flex justify-center lg:my-8">
          <Diamond className="w-3 text-ink/45" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[176px_1fr] lg:gap-[52px]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gold">
              {t.articlesSection.categoryLabel}
            </p>
            <div className="mt-[14px] flex flex-wrap gap-3.5 lg:flex-col">
              {articleCategories.map((name) => {
                const isActive = name === category;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setCategory(name)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-6 py-2.5 text-[12.5px] transition-colors lg:w-[176px] ${
                      isActive
                        ? "border-ink bg-ink font-medium text-white"
                        : "border-ink/30 text-ink hover:border-ink"
                    }`}
                  >
                    {t.articles.categories[name]}
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((article) => (
              <li key={article.slug}>
                <Link
                  href={buildPath("article", { slug: article.slug })}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={article.image ?? "/images/region-turkiye.avif"}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 255px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-[10.5px] text-ink/65">
                    {t.articles.categories[article.category ?? "Blog"]} &nbsp;|&nbsp;{" "}
                    <span className="num">{date(article.date, "short")}</span>
                  </p>
                  <h3 className="mt-4 text-[13px] leading-[21px] text-ink">
                    {article.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
