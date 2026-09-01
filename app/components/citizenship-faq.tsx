"use client";

import { useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Chevron } from "./icons";
import type { FaqKey, Programme } from "@/app/lib/citizenship";
import { useI18n } from "@/app/lib/i18n/context";

/**
 * The questions people actually ask, as an accordion.
 *
 * One panel at a time, and the answers are in the DOM whether or not they are
 * open — collapsed by a `grid-rows` transition rather than unmounted — so the
 * page still answers the question for a crawler or a reader who searches it.
 */
export function CitizenshipFaq({ programme }: { programme: Programme }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<FaqKey | null>(programme.faq[0] ?? null);
  const copy = t.citizenship[programme.key].faq;

  return (
    <section
      id="faq"
      className="scroll-mt-[72px] bg-mist py-[72px] lg:py-[104px]"
    >
      <Container>
        <h2 className="text-center font-display text-[30px] leading-[1.24] text-ink sm:text-[40px]">
          <AnimatedTitle align="center" variant="section">
            {copy.heading}
          </AnimatedTitle>
        </h2>

        <ul className="mx-auto mt-12 max-w-[880px] lg:mt-14">
          {programme.faq.map((key) => {
            const item = copy.items[key];
            const expanded = open === key;
            return (
              <li key={key} className="border-b border-ink/12">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-${key}`}
                    onClick={() => setOpen(expanded ? null : key)}
                    className="flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-start"
                  >
                    <span className="font-display text-[18px] leading-[1.4] text-ink sm:text-[21px]">
                      {item.question}
                    </span>
                    <Chevron
                      className={`mt-2 w-3 shrink-0 text-gold transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-${key}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[720px] pb-7 text-[13px] leading-[23px] text-ink/80">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
