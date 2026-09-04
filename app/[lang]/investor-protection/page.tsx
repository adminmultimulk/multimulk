import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { dueDiligence, scoreWeights } from "@/app/lib/due-diligence";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.pillars.protection.heading,
    description: t.pillars.protection.body,
    alternates: await alternatesFor("/investor-protection"),
  };
}

export default async function InvestorProtectionPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = t.protection;

  return (
    <>
      <JsonLd
        graph={[breadcrumbs({ locale, id: "investorProtection", labels: t.routes })]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[104px] lg:py-[136px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {t.pillars.protection.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[880px] font-display text-[36px] leading-[1.16] text-cream sm:text-[48px] lg:text-[56px]">
              <AnimatedTitle variant="banner">
                {t.pillars.protection.heading}
              </AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[640px] text-[15px] leading-[25px] text-cream/75">
              {t.pillars.protection.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* The three filters. A property has to clear all three; the ordering
            is the argument — eligibility is necessary and nowhere near
            sufficient. */}
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <h2 className="font-display text-[28px] leading-[1.22] text-ink sm:text-[34px]">
              {copy.filtersHeading}
            </h2>
            <ol className="mt-10 grid gap-px border border-ink/12 bg-ink/12 lg:grid-cols-3">
              {(["eligible", "sensible", "exitReady"] as const).map((key, index) => (
                <li key={key} className="bg-white p-8">
                  <span className="num font-display text-[34px] leading-none text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-[21px] leading-[1.3] text-ink">
                    {copy.filters[key].heading}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[21px] text-ink/70">
                    {copy.filters[key].body}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* The checklist. Stated as questions with answers we hold, not as a
            list of reassuring nouns. */}
        <section className="bg-mist py-[72px] lg:py-[104px]">
          <Container>
            <h2 className="font-display text-[28px] leading-[1.22] text-ink sm:text-[34px]">
              {copy.checksHeading}
            </h2>
            <p className="mt-4 max-w-[680px] text-[14px] leading-[23px] text-ink/70">
              {copy.checksIntro}
            </p>
            <ul className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {dueDiligence.map((check) => (
                <li
                  key={check.key}
                  className="flex gap-3 border-t border-ink/12 pt-4 text-[13.5px] leading-[21px] text-ink"
                >
                  <span className="num shrink-0 text-[11px] text-gold">
                    {check.number}
                  </span>
                  <span>{copy.checks[check.key]}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* The scoring model. Published in full — a score nobody can inspect
            is a number, not an assessment. */}
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <h2 className="font-display text-[28px] leading-[1.22] text-ink sm:text-[34px]">
              {copy.scoreHeading}
            </h2>
            <p className="mt-4 max-w-[680px] text-[14px] leading-[23px] text-ink/70">
              {copy.scoreIntro}
            </p>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b border-ink/25">
                    <th
                      scope="col"
                      className="py-3 text-start text-[11px] font-normal uppercase tracking-[0.1em] text-ink/55"
                    >
                      {copy.factorLabel}
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-end text-[11px] font-normal uppercase tracking-[0.1em] text-ink/55"
                    >
                      {copy.weightLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(scoreWeights).map(([factor, weight]) => (
                    <tr key={factor} className="border-b border-ink/10">
                      <td className="py-3 text-ink">
                        {copy.factors[factor as keyof typeof copy.factors]}
                      </td>
                      <td className="num py-3 text-end text-ink">{weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 max-w-[680px] text-[12px] leading-[19px] text-ink/55">
              {copy.scoreCaveat}
            </p>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
