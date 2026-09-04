import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { LastReviewed } from "@/app/components/figure";
import { ProgrammeTable } from "@/app/components/programme-table";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import {
  comparisons,
  comparisonProgrammes,
  comparisonTable,
  getComparison,
} from "@/app/lib/comparisons";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    comparisons.map((comparison) => ({ lang, slug: comparison.slug })),
  );
}

function heading(slug: string): string {
  const comparison = getComparison(slug);
  if (!comparison) return "";
  return comparisonProgrammes(comparison)
    .map((programme) => programme.officialName)
    .join(" vs ");
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getDictionary();
  if (!getComparison(slug)) return {};

  return {
    title: heading(slug),
    description: t.compare.intro,
    alternates: await alternatesFor(`/compare/${slug}`),
  };
}

export default async function ComparisonPage({
  params,
}: PageProps<"/[lang]/compare/[slug]">) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const rows = comparisonTable(comparison);
  const title = heading(slug);

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({
            locale,
            id: "comparison",
            values: { slug },
            labels: t.routes,
            leafLabel: title,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[96px] lg:py-[120px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {t.compare.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[900px] font-display text-[32px] leading-[1.2] text-cream sm:text-[42px]">
              <AnimatedTitle variant="banner">{title}</AnimatedTitle>
            </h1>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[96px]">
          <Container>
            <p className="max-w-[720px] text-[15px] leading-[26px] text-ink/80">
              {t.compare.intro}
            </p>
            <div className="mt-10">
              <ProgrammeTable rows={rows} />
            </div>
            <LastReviewed review={comparison.review} className="mt-10" />
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
