"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { filters, protectionImages } from "@/app/lib/due-diligence";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The three filters, as cards.
 *
 * Same treatment as the principles on /about — photography low in the frame,
 * a wash to hold the heading, and cards that rise in sequence — because the
 * two sections do the same job: three claims the reader is meant to weigh one
 * after another. The numbering carries the argument here, so it stays.
 */
export function ProtectionFilters() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const copy = t.protection;

  return (
    <section className="relative overflow-hidden bg-mist py-[72px] lg:py-[104px]">
      <div className="absolute inset-x-0 bottom-0 h-[62%]">
        <Image
          src={protectionImages.filters}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mist via-mist/25 to-forest-deep/25" />
      </div>

      <Container className="relative">
        <h2 className="text-center font-display text-[30px] leading-[1.25] text-ink sm:text-[40px]">
          <AnimatedTitle align="center" variant="section">
            {copy.filtersHeading}
          </AnimatedTitle>
        </h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-7">
          {filters.map((filter, i) => (
            <motion.li
              key={filter.key}
              className="bg-white p-7 shadow-[0_18px_50px_-30px_rgba(7,31,19,0.55)] lg:p-8"
              initial={reduced ? false : { opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex items-start justify-between gap-5 border-b border-ink/12 pb-4">
                <span className="num font-display text-[40px] leading-none text-ink/75">
                  {filter.number}
                </span>
                <h3 className="max-w-[190px] pt-2 text-end text-[10.5px] font-medium uppercase leading-[15px] tracking-[0.1em] text-gold">
                  {copy.filters[filter.key].heading}
                </h3>
              </div>
              <p className="mt-5 text-[12.5px] leading-[21px] text-ink/80">
                {copy.filters[filter.key].body}
              </p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
