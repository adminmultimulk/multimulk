import { Container } from "./container";
import { LastReviewed } from "./figure";
import type { Dictionary } from "@/app/lib/i18n";
import type { Locale } from "@/app/lib/i18n/config";
import { interpolate } from "@/app/lib/i18n/format";
import { programmeFacts } from "@/app/lib/programme-pages";
import type { Programme } from "@/app/lib/programmes";

/**
 * A programme's answer, stated before its story.
 *
 * The question a reader — or an answer engine quoting one — brings to a
 * programme page is "what does it cost, how long does it take, whom does it
 * cover". The banner carries three of those figures as decoration; this is
 * the whole set as a plain list, near the top, with the date it was checked.
 * Read from the same record as the comparison tables, so it cannot drift.
 */
export function KeyFacts({
  locale,
  t,
  programme,
}: {
  locale: Locale;
  t: Dictionary;
  programme: Programme;
}) {
  const facts = programmeFacts(locale, t, programme);
  if (!facts.length) return null;

  return (
    <section
      aria-labelledby="key-facts"
      className="bg-white pt-16 lg:pt-24"
    >
      <Container>
        <h2
          id="key-facts"
          className="font-display text-[28px] leading-[1.2] text-ink sm:text-[36px]"
        >
          {interpolate(t.programmes.keyFactsHeading, {
            name: programme.shortName,
          })}
        </h2>
        <p className="mt-4 max-w-[640px] text-[13.5px] leading-[23px] text-ink/75">
          {t.programmes.keyFactsBody}
        </p>

        <dl className="mt-9 grid border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.key}
              className="border-b border-ink/12 py-5 sm:pe-8"
            >
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/50">
                {fact.label}
              </dt>
              <dd className="num mt-2 text-[16px] leading-[24px] text-ink">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <LastReviewed review={programme.review} className="mt-8" />
      </Container>
    </section>
  );
}

/**
 * The same facts as one question and its answer — for the pillar hub's
 * questions and the `FAQPage` node beside them.
 */
export function programmeQuestion(
  locale: Locale,
  t: Dictionary,
  programme: Programme,
): { question: string; answer: string } | null {
  const facts = programmeFacts(locale, t, programme);
  if (!facts.length) return null;
  return {
    question: interpolate(t.programmes.hubFaqQuestion, {
      name: programme.officialName,
    }),
    answer: facts.map((fact) => `${fact.label}: ${fact.value}.`).join(" "),
  };
}
