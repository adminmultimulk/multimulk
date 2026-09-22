"use client";

import { useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Chevron } from "./icons";
import type { ServiceFaq as Item } from "@/app/lib/service-pages";

/**
 * The accordion on an advisory landing page.
 *
 * The programme page's `CitizenshipFaq` with the copy handed in as props
 * rather than read from the dictionary — the answers here live in
 * `service-pages.ts`. Same rule as there: one panel open at a time, and the
 * answers stay in the DOM when collapsed so a crawler reads the whole page.
 */
export function ServiceFaq({
  heading,
  items,
}: {
  heading: string;
  items: readonly Item[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-[72px] bg-mist py-[72px] lg:py-[104px]"
    >
      <Container>
        <h2 className="text-center font-display text-[30px] leading-[1.24] text-ink sm:text-[40px]">
          <AnimatedTitle align="center" variant="section">
            {heading}
          </AnimatedTitle>
        </h2>

        <ul className="mx-auto mt-12 max-w-[880px] lg:mt-14">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <li key={item.question} className="border-b border-ink/12">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`service-faq-${index}`}
                    onClick={() => setOpen(expanded ? null : index)}
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
                  id={`service-faq-${index}`}
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
