import { Container } from "./container";
import { JsonLd } from "./json-ld";
import { LastReviewed } from "./figure";
import { ProgrammeRoutes } from "./programme-table";
import { PropertyEnquire } from "./property-enquire";
import { ResortAbout } from "./resort/resort-about";
import { ResortCbi } from "./resort/resort-cbi";
import { ResortCta } from "./resort/resort-cta";
import { ResortHero } from "./resort/resort-hero";
import { ResortHighlights, type HighlightGroup } from "./resort/resort-highlights";
import { ResortOthers, type OtherResort } from "./resort/resort-others";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { comparisonValueText } from "@/app/lib/format-figure";
import { getDictionary, getLocale, type Dictionary } from "@/app/lib/i18n";
import type { Locale } from "@/app/lib/i18n/config";
import { formatNumber, interpolate, lookup } from "@/app/lib/i18n/format";
import {
  comparisonFor,
  countryImagery,
  countryNames,
  enquiryTypeFor,
  localiseProgramme,
  programmePoints,
} from "@/app/lib/programme-pages";
import {
  cheapestOfferedRoute,
  isPublishable,
  programmesIn,
  type Programme,
} from "@/app/lib/programmes";
import { buildPath, type RouteId } from "@/app/lib/routes";
import { breadcrumbs, service } from "@/app/lib/seo/jsonld";

/**
 * The two or three figures in the banner: the entry price, how long the
 * wait is, and how far the passport travels — whichever of them the record
 * can answer.
 */
function heroStats(locale: Locale, t: Dictionary, programme: Programme) {
  const stats: { value: string; label: string }[] = [];

  // The same route the comparison table quotes: the cheapest we transact,
  // or the programme's first where we transact none.
  const cheapest = cheapestOfferedRoute(programme) ?? programme.routes[0];
  if (cheapest) {
    stats.push({
      value: comparisonValueText(locale, t, {
        kind: "money",
        value: cheapest.minimum,
      }),
      label: t.compare.rows.minimumInvestment,
    });
  }
  if (programme.processingMonths !== "unknown") {
    stats.push({
      value: comparisonValueText(locale, t, {
        kind: "months",
        value: programme.processingMonths,
      }),
      label: t.compare.rows.processingTime,
    });
  }
  if (programme.visaFreeCount !== "unknown") {
    stats.push({
      value: formatNumber(locale, programme.visaFreeCount),
      label: t.compare.rows.visaFree,
    });
  } else if (programme.since !== "unknown") {
    stats.push({
      value: String(programme.since),
      label: t.programmes.sinceLabel,
    });
  }
  return stats.slice(0, 3);
}

/** The route id a programme's page answers on, by pillar. */
export function programmeRouteId(programme: Programme): RouteId {
  return programme.category === "citizenship"
    ? "citizenshipProgramme"
    : "goldenVisaProgramme";
}

/**
 * One programme, described by its own record.
 *
 * Set in the resort-page design: a photographed banner carrying the
 * programme's headline figures, the prose beside a tall frame, the routes
 * the programme recognises, a slider of what it grants, whom it includes and
 * what it asks — each point read from the record — and the hand-off to the
 * comparison it most often appears in. The figures are the same fields as
 * every other programme's, so a reader can carry a comparison from one page
 * to the next without re-learning the vocabulary.
 */
export async function ProgrammePage({
  programme,
  routeId,
}: {
  programme: Programme;
  routeId: RouteId;
}) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = localiseProgramme(t, programme);
  const imagery = countryImagery[programme.country];
  const pillar =
    programme.category === "citizenship"
      ? t.pillars.citizenship.eyebrow
      : t.pillars.goldenVisa.eyebrow;
  const place = `${lookup(t.places, countryNames[programme.country])} · ${pillar}`;

  // Each group's frames: the country's photography dealt round the three, so
  // the slider walks a different picture into each.
  const frames = imagery.frames;
  const dealt = (index: number) =>
    frames.filter((_, i) => i % 3 === index).length
      ? frames.filter((_, i) => i % 3 === index)
      : [frames[0]];
  const groups: HighlightGroup[] = [
    {
      eyebrow: t.programmes.highlightsEyebrow,
      heading: t.programmes.highlightHeadings.grants,
      body: copy.grants,
      illustration: "/images/resorts/illustration-snorkel.svg",
      points: programmePoints(locale, t, programme, [
        "visaFree",
        "schengen",
        "citizenshipAfter",
        "dualCitizenship",
        "worldwideTax",
        "rentalYield",
      ]),
      images: dealt(0),
    },
    {
      eyebrow: t.programmes.highlightsEyebrow,
      heading: t.programmes.highlightHeadings.family,
      body: copy.family,
      illustration: "/images/resorts/illustration-suite.svg",
      points: programmePoints(locale, t, programme, [
        "dependentChildren",
        "parentsIncluded",
        "dualCitizenship",
        "worldwideTax",
        "physicalVisit",
      ]),
      images: dealt(1),
    },
    {
      eyebrow: t.programmes.highlightsEyebrow,
      heading: t.programmes.highlightHeadings.asks,
      body: copy.asks,
      illustration: "/images/resorts/illustration-wellness.svg",
      points: programmePoints(locale, t, programme, [
        "minimumInvestment",
        "holdingPeriod",
        "residencyRequired",
        "physicalVisit",
        "processingTime",
      ]),
      images: dealt(2),
    },
  ];

  // The comparison this programme most often appears in, or the index.
  const comparison = comparisonFor(programme);
  const compareHref = comparison
    ? buildPath("comparison", { slug: comparison.slug })
    : buildPath("compareIndex");

  // The rest of the pillar, as cards — those with figures signed off.
  const others: OtherResort[] = programmesIn(programme.category)
    .filter((other) => other.slug !== programme.slug && isPublishable(other))
    .map((other) => ({
      name: other.officialName,
      description: localiseProgramme(t, other).summary,
      image: countryImagery[other.country].hero,
      href: buildPath(programmeRouteId(other), { programme: other.slug }),
    }));

  return (
    <>
      <JsonLd
        graph={[
          service({
            locale,
            slug: programme.slug,
            name: programme.officialName,
            description: copy.intro,
            areaServed: programme.country.toUpperCase(),
            review: programme.review,
          }),
          breadcrumbs({
            locale,
            id: routeId,
            values: { programme: programme.slug },
            labels: t.routes,
            leafLabel: programme.officialName,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <ResortHero
          image={imagery.hero}
          name={programme.officialName}
          place={place}
          tagline={copy.tagline}
          intro={copy.intro}
          stats={heroStats(locale, t, programme)}
        />
      </div>

      <main className="flex-1">
        {/* Said before anything else on the page, not after it: these
            figures have not cleared review, and a reader deserves to know
            that before they read them, not once they have. */}
        {programme.dataStatus === "pending" ? (
          <Container>
            <p
              role="note"
              className="mt-10 border-s-2 border-gold bg-gold/5 px-6 py-4 text-[13px] leading-[21px] text-ink/80"
            >
              {t.programmes.unreviewed}
            </p>
          </Container>
        ) : null}

        <ResortAbout
          eyebrow={t.programmes.aboutEyebrow}
          heading={copy.aboutHeading}
          paragraphs={copy.aboutParagraphs}
          pressHeading=""
          press={[]}
          image={imagery.about}
          name={programme.officialName}
        />

        {/* The routes, and the review date that covers every figure here. */}
        <section className="bg-mist py-16 lg:py-24">
          <Container>
            <div className="max-w-[640px]">
              <h2 className="font-display text-[30px] leading-[1.2] text-ink sm:text-[40px]">
                {t.programmes.routesHeading}
              </h2>
              <p className="mt-5 text-[13.5px] leading-[23px] text-ink/85">
                {t.programmes.routesBody}
              </p>
            </div>
            <div className="mt-9">
              <ProgrammeRoutes programme={programme} />
            </div>
            <LastReviewed review={programme.review} className="mt-10" />
          </Container>
        </section>

        <ResortHighlights groups={groups} name={programme.officialName} />

        <ResortCbi
          eyebrow={t.programmes.compareEyebrow}
          heading={interpolate(t.programmes.compareHeading, {
            name: programme.officialName,
          })}
          body={t.programmes.compareBody}
          button={
            comparison
              ? t.programmes.compareButton
              : t.programmes.allComparisons
          }
          href={compareHref}
          image={imagery.compare}
        />

        <PropertyEnquire
          eyebrow={t.property.enquireEyebrow}
          heading={interpolate(t.property.enquireHeading, {
            project: programme.officialName,
          })}
          body={t.property.enquireBody}
          subject={interpolate(t.property.enquireSubject, {
            project: programme.officialName,
          })}
          enquiryType={enquiryTypeFor(programme)}
          className="bg-white py-16 lg:py-24"
        />

        <ResortOthers
          heading={t.programmes.otherProgrammes}
          resorts={others}
          viewLabel={t.programmes.viewProgramme}
        />

        <ResortCta
          heading={interpolate(t.programmes.ctaHeading, {
            name: programme.officialName,
          })}
          body={t.programmes.ctaBody}
          image={imagery.hero}
          primary={{ label: t.common.enquireNow, href: "#enquire" }}
          secondary={{
            label: comparison
              ? t.programmes.compareButton
              : t.programmes.allComparisons,
            href: compareHref,
          }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
