"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { aboutPrinciples } from "@/app/lib/about";
import { useI18n } from "@/app/lib/i18n/context";

export function AboutPrinciples() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const copy = t.about.principles;

  return (
    <section className="relative overflow-hidden bg-mist py-[72px] lg:py-[104px]">
      {/* Photography sits low in the frame; the wash keeps the heading legible. */}
      <div className="absolute inset-x-0 bottom-0 h-[62%]">
        <Image
          src={aboutPrinciples.image}
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
            {copy.heading}
          </AnimatedTitle>
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-7">
          {aboutPrinciples.items.map((item, i) => (
            <motion.li
              key={item.key}
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
                  {item.number}
                </span>
                <h3 className="max-w-[190px] pt-2 text-end text-[10.5px] font-medium uppercase leading-[15px] tracking-[0.1em] text-gold">
                  {copy.items[item.key].title}
                </h3>
              </div>
              <p className="mt-5 text-[12.5px] leading-[21px] text-ink/80">
                {copy.items[item.key].body}
              </p>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
