"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "./container";
import { Link } from "./link";
import { aboutRegions, type AboutRegion } from "@/app/lib/about";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The region wordmarks sit on a loose baseline rather than a straight one —
 * each letter is nudged by this repeating pattern (in em, so it scales with the
 * type) and drops into place as the panel scrolls in.
 */
const LETTER_OFFSETS = [0, 0.26, -0.1, -0.17, 0.22, 0.26, -0.1, 0.22, -0.12];

function ScatteredWord({ word }: { word: string }) {
  const reduced = useReducedMotion();
  // Split on graphemes, not code units: Arabic and Urdu carry combining marks
  // that must stay attached to the letter they sit on.
  const letters = Array.from(word);

  return (
    <span className="flex" aria-hidden="true">
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          className="inline-block"
          style={{ marginTop: `${LETTER_OFFSETS[i % LETTER_OFFSETS.length]}em` }}
          initial={reduced ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

function RegionPanel({ region }: { region: AboutRegion }) {
  const { t, locale } = useI18n();
  const copy = t.about.regions[region.key];
  // Arabic and Urdu are cursive: pulling a word apart letter by letter breaks
  // the joins, so those two render the wordmark whole.
  const scatter = locale !== "ar" && locale !== "ur";
  const word = region.word[locale] ?? region.word.en;

  return (
    <section className="relative flex min-h-[520px] items-start overflow-hidden bg-forest-deep py-[88px] lg:h-[900px] lg:py-[104px]">
      <Image
        src={region.image}
        alt={copy.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/20 to-forest-deep/45" />

      <Container className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h2 className="font-display text-[46px] leading-[1.05] tracking-[0.22em] text-white sm:text-[64px] lg:text-[80px]">
            <span className="sr-only">{copy.label}</span>
            {scatter ? (
              <ScatteredWord word={word} />
            ) : (
              <span aria-hidden="true">{word}</span>
            )}
          </h2>

          <div className="max-w-[420px] lg:pt-1.5 lg:text-end">
            <p className="text-[13px] leading-[21px] text-white/90">
              {copy.body}
            </p>
            <Link
              href={region.href}
              className="mt-6 inline-flex items-center rounded-full bg-forest-deep/85 px-7 py-3 text-[12.5px] text-white backdrop-blur-sm transition-colors hover:bg-forest"
            >
              {t.common.learnMore}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function AboutRegions() {
  return (
    <>
      {aboutRegions.map((region) => (
        <RegionPanel key={region.key} region={region} />
      ))}
    </>
  );
}
