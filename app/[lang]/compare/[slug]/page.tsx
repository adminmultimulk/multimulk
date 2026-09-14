import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { LastReviewed } from "@/app/components/figure";
import { ProgrammeTable } from "@/app/components/programme-table";
import { programmeRouteId } from "@/app/components/programme-page";
import { PropertyEnquire } from "@/app/components/property-enquire";
import { ResortAbout } from "@/app/components/resort/resort-about";
import { ResortCbi } from "@/app/components/resort/resort-cbi";
import { ResortCta } from "@/app/components/resort/resort-cta";
import { ResortHero } from "@/app/components/resort/resort-hero";
import {
  ResortHighlights,
  type HighlightGroup,
} from "@/app/components/resort/resort-highlights";
import {
  ResortOthers,
  type OtherResort,
} from "@/app/components/resort/resort-others";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import {
  comparisons,
  comparisonProgrammes,
  comparisonTable,
  getComparison,
  type Comparison,
} from "@/app/lib/comparisons";
import { alternatesFor, getDictionary, getLocale, type Dictionary } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { formatNumber, interpolate } from "@/app/lib/i18n/format";
import {
  countryImagery,
  enquiryTypeFor,
  localiseProgramme,
  programmePoints,
} from "@/app/lib/programme-pages";
import { getProgramme, type Programme } from "@/app/lib/programmes";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    comparisons.map((comparison) => ({ lang, slug: comparison.slug })),
  );
}

function heading(comparison: Comparison, separator = " vs "): string {
  return comparisonProgrammes(comparison)
    .map((programme) => programme.officialName)
    .join(separator);
}

/** The programme the practice would advise, whose photography leads the page. */
function recommendedOf(comparison: Comparison): Programme {
  const [category, slug] = comparison.recommended;
  const programme = getProgramme(category, slug);
  if (!programme) throw new Error(`Unknown programme in ${comparison.slug}.`);
  return programme;
}

function verdictOf(t: Dictionary, comparison: Comparison): string {
  return t.compare.copy[comparison.copyKey as keyof typeof t.compare.copy]
    .verdict;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getDictionary();
  const comparison = getComparison(slug);
  if (!comparison) return {};

  return {
    title: heading(comparison),
    description: t.compare.intro,
    alternates: await alternatesFor(`/compare/${slug}`),
  };
}

/**
 * A comparison, set in the resort-page design.
 *
 * The table is still the point, and still computed: every cell is read from
 * the programme records. Around it, the design gives the page what a bare
 * table lacked — a banner led by the recommended programme's photography, the
 * verdict as prose beside a frame rather than a footnote under a grid, a
 * slider that introduces each programme in turn with three of its own figures,
 * and the hand-off to the recommended programme's page and to an adviser.
 */
export default async function ComparisonPage({
  params,
}: PageProps<"/[lang]/compare/[slug]">) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const programmes = comparisonProgrammes(comparison);
  const rows = comparisonTable(comparison);
  const recommended = recommendedOf(comparison);
  const imagery = countryImagery[recommended.country];
  const title = heading(comparison);
  const verdict = verdictOf(t, comparison);
  const illustrations = [
    "/images/resorts/illustration-snorkel.svg",
    "/images/resorts/illustration-suite.svg",
    "/images/resorts/illustration-wellness.svg",
  ];

  // One group a programme: its own prose, three of its figures, its country.
  const groups: HighlightGroup[] = programmes.map((programme, index) => ({
    eyebrow: interpolate(t.compare.programmeIndex, {
      index: formatNumber(locale, index + 1).padStart(2, "0"),
    }),
    heading: programme.officialName,
    body: localiseProgramme(t, programme).intro,
    illustration: illustrations[index % illustrations.length],
    points: programmePoints(locale, t, programme, [
      "minimumInvestment",
      "processingTime",
      "citizenshipAfter",
      "visaFree",
      "holdingPeriod",
      "residencyRequired",
      "worldwideTax",
    ]),
    images: countryImagery[programme.country].frames.slice(0, 2),
  }));

  const others: OtherResort[] = comparisons
    .filter((other) => other.slug !== comparison.slug)
    .map((other) => ({
      name: heading(other, " · "),
      description: interpolate(t.compare.recommendedHeading, {
        name: recommendedOf(other).officialName,
      }),
      image: countryImagery[recommendedOf(other).country].hero,
      href: buildPath("comparison", { slug: other.slug }),
    }));

  const recommendedHref = buildPath(programmeRouteId(recommended), {
    programme: recommended.slug,
  });

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
        <ResortHero
          image={imagery.hero}
          name={title}
          place={t.compare.eyebrow}
          tagline={t.compare.heroTagline}
          intro={t.compare.intro}
          stats={[
            {
              value: formatNumber(locale, programmes.length),
              label: t.compare.programmesLabel,
            },
            {
              value: formatNumber(locale, rows.length),
              label: t.compare.factorsLabel,
            },
          ]}
        />
      </div>

      <main className="flex-1">
        {/* The advice, before the arithmetic. A reader who counts underlines
            gets a tally, not a recommendation, and the practice has one. */}
        <ResortAbout
          eyebrow={t.compare.verdictHeading}
          heading={interpolate(t.compare.recommendedHeading, {
            name: recommended.officialName,
          })}
          paragraphs={[verdict]}
          pressHeading=""
          press={[]}
          image={imagery.about}
          name={recommended.officialName}
        />

        <section className="bg-mist py-16 lg:py-24">
          <Container>
            <h2 className="font-display text-[30px] leading-[1.2] text-ink sm:text-[40px]">
              {t.compare.tableHeading}
            </h2>
            <div className="mt-9">
              <ProgrammeTable
                rows={rows}
                recommended={comparison.recommended.join("-")}
              />
            </div>
            <LastReviewed review={comparison.review} className="mt-10" />
          </Container>
        </section>

        <ResortHighlights groups={groups} name={title} />

        <ResortCbi
          eyebrow={
            recommended.category === "citizenship"
              ? t.pillars.citizenship.eyebrow
              : t.pillars.goldenVisa.eyebrow
          }
          heading={recommended.officialName}
          body={localiseProgramme(t, recommended).intro}
          button={t.programmes.viewProgramme}
          href={recommendedHref}
          image={imagery.compare}
        />

        <PropertyEnquire
          eyebrow={t.property.enquireEyebrow}
          heading={interpolate(t.property.enquireHeading, { project: title })}
          body={t.property.enquireBody}
          subject={interpolate(t.compare.enquireSubject, {
            programmes: heading(comparison, " · "),
          })}
          enquiryType={enquiryTypeFor(recommended)}
          className="bg-white py-16 lg:py-24"
        />

        <ResortOthers
          heading={t.compare.otherComparisons}
          resorts={others}
          viewLabel={t.compare.eyebrow}
        />

        <ResortCta
          heading={t.compare.ctaHeading}
          body={t.compare.ctaBody}
          image={imagery.hero}
          primary={{ label: t.common.enquireNow, href: "#enquire" }}
          secondary={{
            label: t.compare.allComparisons,
            href: buildPath("compareIndex"),
          }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
