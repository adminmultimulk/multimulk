"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { articles, articlesSection, formatArticleDate } from "@/app/lib/content";
import { Diamond } from "./icons";

export function Articles() {
  const [category, setCategory] = useState("All");
  const visible =
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <section className="bg-white py-[72px] lg:py-[100px]">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_660px] lg:gap-10">
          <h2 className="font-display text-[32px] leading-[52px] text-ink sm:text-[40px]">
            <AnimatedTitle variant="section">
              {articlesSection.heading}
            </AnimatedTitle>
          </h2>
          <p className="max-w-[660px] self-center text-[12.5px] leading-[21px] text-ink">
            {articlesSection.body}
          </p>
        </div>

        <div className="my-10 flex justify-center lg:my-8">
          <Diamond className="w-3 text-ink/45" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[176px_1fr] lg:gap-[52px]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gold">
              Articles Category
            </p>
            <div className="mt-[14px] flex flex-wrap gap-3.5 lg:flex-col">
              {articlesSection.categories.map((name) => {
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
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/media-centre/${article.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[255/211] w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 255px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-[10.5px] text-ink/65">
                    {article.category} &nbsp;|&nbsp; {formatArticleDate(article.date, "short")}
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
