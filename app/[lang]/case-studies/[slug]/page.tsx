import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CaseAbout,
  CaseCollage,
  CaseCta,
  CaseHero,
  CaseOthers,
} from "@/app/components/case-study/case-sections";
import { CaseSlides, type CaseSlide } from "@/app/components/case-study/case-slides";
import type { EnquiryContext } from "@/app/components/enquiry";
import { JsonLd } from "@/app/components/json-ld";
import { programmeRouteId } from "@/app/components/programme-page";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import {
  getCaseStudy,
  isPublished,
  publishedCaseStudies,
  type CaseStudy,
} from "@/app/lib/case-studies";
import { alternatesFor, getDictionary, getLocale, type Dictionary } from "@/app/lib/i18n";
import { locales, type Locale } from "@/app/lib/i18n/config";
import { formatNumber, interpolate } from "@/app/lib/i18n/format";
import { enquiryTypeFor } from "@/app/lib/programme-pages";
import { getProgramme, type Programme } from "@/app/lib/programmes";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    publishedCaseStudies.map((study) => ({ lang, slug: study.slug })),
  );
}

/** The programme record the engagement ran under. */
function programmeOf(study: CaseStudy): Programme {
  const programme = getProgramme(study.category, study.programme);
  if (!programme) throw new Error(`Unknown programme in case study ${study.slug}.`);
  return programme;
}

function money(locale: Locale, study: CaseStudy): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
    style: "currency",
    currency: study.outcome.investment.currency,
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(study.outcome.investment.amount);
}

function months(locale: Locale, t: Dictionary, study: CaseStudy): string {
  return `${formatNumber(locale, study.outcome.timelineMonths)} ${t.figures.units.months}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.profile.objective,
    alternates: await alternatesFor(`/case-studies/${slug}`),
    // Belt and braces alongside the enumeration: a study that is not
    // published must not be indexed even if it becomes reachable.
    ...(isPublished(study) ? {} : { robots: { index: false, follow: false } }),
  };
}

/**
 * One engagement, told the way a development page is told: the photograph
 * nearly to the fold with the name at its foot, a centred statement of what
 * the family was solving for and the figures, the reasoning as full-bleed
 * frames one point at a time, what the asset is doing now beside a collage —
 * with what went wrong under it, because a case study without a complication
 * is a brochure — the other engagements, and the invitation. Every "Enquire
 * Now" opens the dialog with the engagement already named.
 */
export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = t.caseStudies;
  const programme = programmeOf(study);
  const programmeHref = buildPath(programmeRouteId(programme), {
    programme: programme.slug,
  });

  const enquiry: EnquiryContext = {
    eyebrow: programme.officialName,
    subject: interpolate(t.property.enquireSubject, { project: study.title }),
    enquiryType: enquiryTypeFor(programme),
    programme: programme.slug,
  };

  // One frame a point of the reasoning; the photographs go round again where
  // there are more points than pictures.
  const slides: CaseSlide[] = study.reasoning.map((point, i) => ({
    image: study.images.slides[i % study.images.slides.length],
    heading: copy.reasoning,
    body: point,
  }));

  const others = publishedCaseStudies
    .filter((other) => other.slug !== study.slug)
    .map((other) => ({
      name: other.title,
      description: other.profile.objective,
      image: other.images.hero,
      href: buildPath("caseStudy", { slug: other.slug }),
    }));

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({
            locale,
            id: "caseStudy",
            values: { slug },
            labels: t.routes,
            leafLabel: study.title,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <CaseHero
          image={study.images.hero}
          eyebrow={`${copy.eyebrow} · ${programme.officialName} · ${study.outcome.year}`}
          title={study.title}
        />
      </div>

      <main className="flex-1">
        <CaseAbout
          heading={copy.aboutHeading}
          // A composed engagement says so here, before the story, not in a
          // footnote after it.
          paragraphs={[
            study.profile.objective,
            ...(study.representative ? [copy.representativeNote] : []),
          ]}
          facts={[
            { label: copy.family, value: study.profile.family },
            { label: copy.invested, value: money(locale, study) },
            { label: copy.timeline, value: months(locale, t, study) },
            { label: copy.year, value: String(study.outcome.year) },
          ]}
          link={{ label: t.programmes.viewProgramme, href: programmeHref }}
        />

        <CaseSlides slides={slides} enquiry={enquiry} name={study.title} />

        <CaseCollage
          images={study.images.collage}
          name={study.title}
          heading={copy.afterwards}
          body={study.outcome.afterwards}
          aside={{ heading: copy.complication, body: study.complication }}
        />

        <CaseOthers heading={copy.otherOutcomes} body={copy.body} items={others} />

        <CaseCta
          image={study.images.cta}
          heading={copy.ctaHeading}
          body={copy.ctaBody}
          enquiry={enquiry}
        />
      </main>

      <SiteFooter />
    </>
  );
}
