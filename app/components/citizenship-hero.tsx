"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Link } from "./link";
import type { Programme } from "@/app/lib/citizenship";
import { useI18n } from "@/app/lib/i18n/context";
import { interpolate } from "@/app/lib/i18n/format";

const ROTATE_MS = 6500;

/**
 * The page banner, rotating through the programme's photography.
 *
 * Same crossfade and same rule-style indicators as the home page hero, so the
 * two read as one device; the difference is that this one carries a heading
 * and the calls to action rather than the property search.
 */
export function CitizenshipHero({ programme }: { programme: Programme }) {
  const { t } = useI18n();
  const shots = programme.images.hero;
  const [active, setActive] = useState(0);
  const copy = t.citizenship[programme.key];

  useEffect(() => {
    if (shots.length < 2) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % shots.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [shots.length]);

  return (
    <section className="relative flex min-h-[620px] items-end overflow-hidden bg-forest lg:min-h-[780px]">
      {shots.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1200ms] ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/70 to-transparent" />

      <Container className="relative pb-16 lg:pb-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
          {t.citizenship.eyebrow}
        </p>
        <h1 className="mt-5 max-w-[760px] font-display text-[38px] leading-[1.12] text-white sm:text-[56px]">
          <AnimatedTitle>{copy.hero.heading}</AnimatedTitle>
        </h1>
        <p className="mt-6 max-w-[620px] text-[13px] leading-[22px] text-cream/85">
          {copy.hero.body}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#enquire"
            className="rounded-full bg-cream px-8 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
          >
            {t.citizenship.cta.button}
          </a>
          <Link
            href={programme.searchHref}
            className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
          >
            {t.citizenship.browseAll}
          </Link>
        </div>

        {shots.length > 1 ? (
          <div className="mt-10 flex items-center gap-3">
            {shots.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={interpolate(t.hero.showSlide, {
                  name: `${i + 1}`,
                })}
                aria-current={i === active}
                className="cursor-pointer py-2"
              >
                <span
                  className={`block h-0.5 w-8 transition-colors sm:w-10 ${
                    i === active ? "bg-white" : "bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
