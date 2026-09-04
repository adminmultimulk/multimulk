import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { comparisons, comparisonProgrammes } from "@/app/lib/comparisons";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { buildPath } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.compare.heading,
    description: t.compare.intro,
    alternates: await alternatesFor("/compare"),
  };
}

export default async function CompareIndexPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "compareIndex",
            name: t.compare.heading,
            description: t.compare.intro,
            itemUrls: comparisons.map((comparison) =>
              routeUrl(locale, "comparison", { slug: comparison.slug }),
            ),
          }),
          breadcrumbs({ locale, id: "compareIndex", labels: t.routes }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[104px] lg:py-[128px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {t.compare.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[820px] font-display text-[36px] leading-[1.16] text-cream sm:text-[48px]">
              <AnimatedTitle variant="banner">{t.compare.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[640px] text-[15px] leading-[25px] text-cream/75">
              {t.compare.intro}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <ul className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
              {comparisons.map((comparison) => (
                <li key={comparison.slug} className="bg-white">
                  <Link
                    href={buildPath("comparison", { slug: comparison.slug })}
                    className="group block h-full p-8 transition-colors hover:bg-mist"
                  >
                    <h2 className="font-display text-[22px] leading-[1.3] text-ink">
                      {comparisonProgrammes(comparison)
                        .map((programme) => programme.officialName)
                        .join(" · ")}
                    </h2>
                    <span className="mt-6 block text-[12.5px] text-gold group-hover:underline">
                      {t.common.learnMore}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
