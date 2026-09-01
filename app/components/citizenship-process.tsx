"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container, SectionIntro } from "./container";
import type { Programme } from "@/app/lib/citizenship";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The route from first conversation to passport, as a numbered timeline.
 *
 * The rule that threads the steps together is drawn on the *inline start* edge
 * of the number column, so it runs down the right-hand side under Arabic and
 * Urdu without a second set of classes.
 */
export function CitizenshipProcess({ programme }: { programme: Programme }) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const copy = t.citizenship[programme.key].process;

  return (
    <section
      id="process"
      className="scroll-mt-[72px] bg-white py-[72px] lg:py-[104px]"
    >
      <Container>
        <SectionIntro
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
        />

        <ol className="mx-auto mt-12 max-w-[840px] lg:mt-16">
          {programme.steps.map((step, i) => {
            const item = copy.steps[step.key];
            const last = i === programme.steps.length - 1;
            return (
              <motion.li
                key={step.key}
                className="grid grid-cols-[64px_1fr] gap-6 sm:grid-cols-[92px_1fr] sm:gap-9"
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* The number sits on the rule; the rule stops at the last step. */}
                <div
                  className={`flex flex-col items-center ${last ? "" : "pb-2"}`}
                >
                  <span className="num flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-gold/45 font-display text-[18px] text-gold sm:h-[64px] sm:w-[64px] sm:text-[21px]">
                    {step.number}
                  </span>
                  {last ? null : (
                    <span className="mt-3 w-px flex-1 bg-ink/12" />
                  )}
                </div>

                <div className={last ? "pb-2" : "pb-11"}>
                  <h3 className="font-display text-[22px] leading-[1.3] text-ink sm:text-[26px]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[620px] text-[13px] leading-[22px] text-ink/80">
                    {item.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
