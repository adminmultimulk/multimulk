"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container, SectionIntro } from "./container";
import type { Programme } from "@/app/lib/citizenship";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * What the programme is actually worth, as four numbered cards on a dark
 * ground. The photography is held well back behind a near-solid wash — it is
 * atmosphere for a block of reading, not the subject of the section.
 */
export function CitizenshipBenefits({ programme }: { programme: Programme }) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const copy = t.citizenship[programme.key].benefits;

  return (
    <section
      id="benefits"
      className="relative scroll-mt-[72px] overflow-hidden bg-forest-deep py-[72px] lg:py-[104px]"
    >
      <Image
        src={programme.images.benefits}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/88" />

      <Container className="relative">
        <SectionIntro
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
          tone="dark"
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:gap-6">
          {programme.benefits.map((benefit, i) => {
            const item = copy.items[benefit.key];
            return (
              <motion.li
                key={benefit.key}
                className="border border-cream/15 bg-forest/45 p-7 backdrop-blur-sm lg:p-9"
                initial={reduced ? false : { opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.7,
                  delay: (i % 2) * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-baseline gap-5">
                  <span className="num font-display text-[30px] leading-none text-gold-light">
                    {benefit.number}
                  </span>
                  <h3 className="font-display text-[21px] leading-[1.28] text-cream sm:text-[24px]">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-5 text-[13px] leading-[22px] text-cream/80">
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
