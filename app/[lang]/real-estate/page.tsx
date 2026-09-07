import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { regions } from "@/app/lib/content";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { developments } from "@/app/lib/cms/developments";
import { buildPath, searchPath } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.pillars.realEstate.heading,
    description: t.pillars.realEstate.body,
    alternates: await alternatesFor("/real-estate"),
  };
}

export default async function RealEstateHubPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  // Whatever is published, grouped into the schemes it belongs to. The hub
  // used to list four developments written into the source; a listing entered
  // this morning now puts its development here without anyone editing a file.
  const schemes = await developments();

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "realEstateHub",
            name: t.pillars.realEstate.heading,
            description: t.pillars.realEstate.body,
            itemUrls: schemes.map((scheme) =>
              routeUrl(locale, "development", { slug: scheme.slug }),
            ),
          }),
          breadcrumbs({ locale, id: "realEstateHub", labels: t.routes }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[104px] lg:py-[128px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {t.pillars.realEstate.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[860px] font-display text-[36px] leading-[1.16] text-cream sm:text-[48px]">
              <AnimatedTitle variant="banner">
                {t.pillars.realEstate.heading}
              </AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[620px] text-[15px] leading-[25px] text-cream/75">
              {t.pillars.realEstate.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <ul className="grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2">
              {regions.map((region) => (
                <li key={region.key} className="bg-white">
                  <Link
                    href={searchPath({
                      currency: "USD",
                      location: region.key === "turkiye" ? "Türkiye" : "Caribbean",
                    })}
                    className="group block h-full p-8 transition-colors hover:bg-mist"
                  >
                    <h2 className="font-display text-[24px] leading-[1.25] text-ink">
                      {t.regions[region.key].label}
                    </h2>
                    <span className="mt-6 block text-[12.5px] text-gold group-hover:underline">
                      {t.common.searchProperties}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {schemes.length ? (
              <ul className="mt-12 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
                {schemes.map((scheme) => (
                  <li key={scheme.slug} className="bg-white">
                    <Link
                      href={buildPath("development", { slug: scheme.slug })}
                      className="group block h-full p-7 transition-colors hover:bg-mist"
                    >
                      <h3 className="font-display text-[19px] leading-[1.3] text-ink">
                        {scheme.name}
                      </h3>
                      <span className="mt-5 block text-[12px] text-gold group-hover:underline">
                        {t.common.learnMore}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
