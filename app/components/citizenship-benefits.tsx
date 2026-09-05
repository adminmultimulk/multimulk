"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container, SectionIntro } from "./container";
import type { Programme } from "@/app/lib/citizenship";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * What the programme is actually worth — the same white numbered cards as
 * the About principles row, over the same full-bleed place photograph.
 */
export function CitizenshipBenefits({ programme }: { programme: Programme }) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const copy = t.citizenship[programme.key].benefits;

  return (
    <section
      id="benefits"
      className="relative scroll-mt-[72px] overflow-hidden bg-mist py-[72px] lg:py-[104px]"
    >
      <div className="absolute inset-0">
        <Image
          src={programme.images.benefits}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mist from-10% via-mist/70 via-35% to-mist/20" />
      </div>

      <Container className="relative">
        <SectionIntro
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-7">
          {programme.benefits.map((benefit, i) => {
            const item = copy.items[benefit.key];
            return (
              <motion.li
                key={benefit.key}
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
                    {benefit.number}
                  </span>
                  <h3 className="max-w-[190px] pt-2 text-end text-[10.5px] font-medium uppercase leading-[15px] tracking-[0.1em] text-gold">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-5 text-[12.5px] leading-[21px] text-ink/80">
                  {item.body}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
