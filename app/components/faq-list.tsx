"use client";

import { useState } from "react";
import { Link } from "./link";
import { Chevron } from "./icons";
import { useI18n } from "@/app/lib/i18n/context";
import { buildPath } from "@/app/lib/routes";
import type { Faq, FaqTopic } from "@/app/lib/faqs";

/**
 * The question list, filterable by topic.
 *
 * Answers stay in the DOM when collapsed — `grid-rows` rather than
 * conditional rendering — so a crawler and a reader with the panel shut see
 * the same page. The site's existing FAQ accordion does the same; this is that
 * pattern generalised off the programme page.
 */
export function FaqList({
  faqs,
  topics,
}: {
  faqs: readonly Faq[];
  topics: readonly FaqTopic[];
}) {
  const { t } = useI18n();
  const [topic, setTopic] = useState<FaqTopic | "all">("all");
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  const shown =
    topic === "all" ? faqs : faqs.filter((faq) => faq.topics.includes(topic));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={topic === "all"}
          onClick={() => setTopic("all")}
          label={t.common.viewAll}
        />
        {topics.map((key) => (
          <FilterPill
            key={key}
            active={topic === key}
            onClick={() => setTopic(key)}
            label={t.faq.topics[key]}
          />
        ))}
      </div>

      <ul className="mt-10 border-t border-ink/15">
        {shown.map((faq) => {
          const expanded = open === faq.id;
          return (
            <li key={faq.id} className="border-b border-ink/15">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : faq.id)}
                  aria-expanded={expanded}
                  aria-controls={`faq-${faq.id}`}
                  className="flex w-full items-start justify-between gap-6 py-6 text-start"
                >
                  <span className="font-display text-[19px] leading-[1.35] text-ink sm:text-[22px]">
                    {faq.question}
                  </span>
                  <Chevron
                    className={`mt-2 w-3 shrink-0 text-gold transition-transform duration-300 ${
                      expanded ? "-scale-y-100" : ""
                    }`}
                  />
                </button>
              </h3>
              <div
                id={`faq-${faq.id}`}
                className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex max-w-[760px] flex-col gap-4 pb-7 text-[14px] leading-[23px] text-ink/80">
                    {faq.answer.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    {faq.slug ? (
                      <Link
                        href={buildPath("faq", { slug: faq.slug })}
                        className="text-[12.5px] text-gold underline underline-offset-4"
                      >
                        {t.faq.fullAnswer}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-5 py-2 text-[12px] transition-colors ${
        active
          ? "border-forest bg-forest text-cream"
          : "border-ink/20 text-ink/70 hover:border-ink/50"
      }`}
    >
      {label}
    </button>
  );
}
