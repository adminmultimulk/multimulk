import type { Metadata } from "next";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { PageHero } from "@/app/components/page-hero";
import { SiteFooter } from "@/app/components/site-footer";
import { publishedCaseStudies } from "@/app/lib/case-studies";
import { getProgramme } from "@/app/lib/programmes";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.caseStudies.heading,
    description: t.caseStudies.body,
    alternates: await alternatesFor("/case-studies"),
  };
}

export default async function CaseStudiesPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "caseStudies",
            name: t.caseStudies.heading,
            description: t.caseStudies.body,
            itemUrls: publishedCaseStudies.map((study) =>
              routeUrl(locale, "caseStudy", { slug: study.slug }),
            ),
          }),
          breadcrumbs({ locale, id: "caseStudies", labels: t.routes }),
        ]}
      />

      <PageHero
        eyebrow={t.caseStudies.eyebrow}
        heading={t.caseStudies.heading}
        body={t.caseStudies.body}
      />

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            {publishedCaseStudies.length ? (
              <>
                {publishedCaseStudies.some((study) => study.representative) ? (
                  <p className="mb-8 max-w-[680px] text-[13px] leading-[21px] text-ink/70">
                    {t.caseStudies.representativeNote}
                  </p>
                ) : null}
                <ul className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
                  {publishedCaseStudies.map((study) => (
                    <li
                      key={study.slug}
                      // An odd last card takes the whole row rather than
                      // leaving a grey cell beside it.
                      className="bg-white sm:last:odd:col-span-2"
                    >
                      <Link
                        href={buildPath("caseStudy", { slug: study.slug })}
                        className="group block h-full p-8 transition-colors hover:bg-mist"
                      >
                        <p className="text-[11px] uppercase tracking-[0.1em] text-ink/50">
                          {getProgramme(study.category, study.programme)
                            ?.officialName ?? study.programme}{" "}
                          · {study.outcome.year}
                        </p>
                        <h2 className="mt-3 font-display text-[22px] leading-[1.28] text-ink">
                          {study.title}
                        </h2>
                        <p className="mt-3 text-[13px] leading-[21px] text-ink/70">
                          {study.profile.objective}
                        </p>
                        <span className="mt-6 block text-[12.5px] text-gold group-hover:underline">
                          {t.common.readMore}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              /* Said plainly rather than hidden. An empty page with no
                 explanation reads as broken; this reads as a standard we
                 have not met yet. */
              <p className="max-w-[680px] border border-ink/12 bg-mist p-8 text-[14px] leading-[23px] text-ink/75">
                {t.caseStudies.consentPending}
              </p>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
