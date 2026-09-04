import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleBody } from "@/app/components/article-body";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { getCaseStudy, publishedCaseStudies } from "@/app/lib/case-studies";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    publishedCaseStudies.map((study) => ({ lang, slug: study.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.profile.objective,
    alternates: await alternatesFor(`/case-studies/${slug}`),
    // Belt and braces alongside the enumeration: a study without written
    // consent must not be indexed even if it becomes reachable.
    ...(study.consentOnFile ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = t.caseStudies;

  const money = new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
    style: "currency",
    currency: study.outcome.investment.currency,
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(study.outcome.investment.amount);

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({
            locale,
            id: "caseStudy",
            values: { slug },
            labels: t.routes,
            leafLabel: study.profile.objective,
          }),
        ]}
      />

      <PageHero eyebrow={copy.eyebrow} heading={study.profile.objective} />

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[96px]">
          <Container>
            <div className="max-w-[820px]">
              <dl className="grid gap-x-10 gap-y-6 border-y border-ink/15 py-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [copy.family, study.profile.family],
                  [copy.invested, money],
                  [
                    copy.timeline,
                    `${study.outcome.timelineMonths} ${t.figures.units.months}`,
                  ],
                  [copy.afterwards, study.outcome.afterwards],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[10.5px] uppercase tracking-[0.1em] text-ink/50">
                      {label}
                    </dt>
                    <dd className="mt-2 text-[13.5px] leading-[21px] text-ink">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-12 font-display text-[24px] leading-[1.28] text-ink">
                {copy.reasoning}
              </h2>
              <ArticleBody body={study.reasoning} />

              <h2 className="mt-12 font-display text-[24px] leading-[1.28] text-ink">
                {copy.complication}
              </h2>
              <p className="mt-4 border-s-2 border-gold ps-6 text-[14.5px] leading-[24px] text-ink/85">
                {study.complication}
              </p>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
