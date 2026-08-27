"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mediaHero } from "@/app/lib/media";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";

const ROTATE_MS = 7000;

/**
 * The featured press item, on rotation. Each slide's progress bar fills over
 * the dwell time, so the bar doubles as the pager and the countdown.
 */
export function MediaHero() {
  const [active, setActive] = useState(0);
  const { slides } = mediaHero;

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section className="relative flex min-h-[640px] w-full flex-col justify-end overflow-hidden bg-forest lg:h-svh lg:min-h-[720px]">
      {slides.map((s, i) => (
        <Image
          key={s.slug}
          src={s.image}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1200ms] ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Nav scrim above, reading scrim below — the design runs transparent to
          70% black across the lower half. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(260px,34svh)] bg-gradient-to-b from-forest-deep/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

      <Container className="relative pb-16 pt-40 lg:pb-[72px] lg:pt-48">
        <p className="text-[13px] uppercase leading-[26px] tracking-[0.16em] text-white sm:text-[15px] lg:text-[17px] lg:tracking-[0.02em]">
          {mediaHero.eyebrow}
        </p>

        <h1 className="mt-3.5 max-w-[790px] font-display text-[30px] leading-[1.25] text-cream sm:text-[36px] lg:text-[43px]">
          <AnimatedTitle key={slide.slug}>{slide.title}</AnimatedTitle>
        </h1>

        <div className="mt-9 flex flex-wrap items-end justify-between gap-8">
          <Link
            href={`/media-centre/${slide.slug}`}
            className="inline-block rounded-full border border-cream/80 px-[28.8px] py-3 text-[13.8px] text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            {mediaHero.cta}
          </Link>

          <div className="flex items-center gap-[7.2px]">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show “${s.title}”`}
                aria-current={i === active}
                className="py-2"
              >
                <span className="block h-[3px] w-[64px] overflow-hidden rounded-full bg-white/30 sm:w-[91px]">
                  {i === active ? (
                    <span
                      key={active}
                      className="animate-hero-progress block h-full w-full origin-left rounded-full bg-white"
                      style={{ animationDuration: `${ROTATE_MS}ms` }}
                    />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
