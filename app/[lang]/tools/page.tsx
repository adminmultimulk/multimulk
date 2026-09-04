import type { Metadata } from "next";
import { Container } from "@/app/components/container";
import { CostCalculator } from "@/app/components/cost-calculator";
import { JsonLd } from "@/app/components/json-ld";
import { PageHero } from "@/app/components/page-hero";
import { ProgrammeTable } from "@/app/components/programme-table";
import { SiteFooter } from "@/app/components/site-footer";
import { comparisonTable, comparisons } from "@/app/lib/comparisons";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { isPublishable, programmes } from "@/app/lib/programmes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.tools.heading,
    description: t.tools.body,
    alternates: await alternatesFor("/tools"),
  };
}

export default async function ToolsPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  const offered = programmes.filter(
    (programme) =>
      isPublishable(programme) &&
      programme.routes.some((route) => route.offered),
  );

  // The flagship comparison, rendered here as a working example of the table
  // rather than a link to it.
  const featured = comparisons[0];

  return (
    <>
      <JsonLd graph={[breadcrumbs({ locale, id: "tools", labels: t.routes })]} />

      <PageHero
        eyebrow={t.tools.eyebrow}
        heading={t.tools.heading}
        body={t.tools.body}
      />

      <main className="flex-1">
        <section className="bg-mist py-[72px] lg:py-[96px]">
          <Container>
            <CostCalculator programmes={offered} />
          </Container>
        </section>

        {featured ? (
          <section className="bg-white py-[72px] lg:py-[96px]">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.25] text-ink sm:text-[32px]">
                {t.compare.heading}
              </h2>
              <p className="mt-4 max-w-[680px] text-[14px] leading-[23px] text-ink/70">
                {t.compare.intro}
              </p>
              <div className="mt-9">
                <ProgrammeTable rows={comparisonTable(featured)} />
              </div>
            </Container>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
