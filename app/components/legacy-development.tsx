import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { ArticleBody } from "./article-body";
import { Container } from "./container";
import { JsonLd } from "./json-ld";
import { Link } from "./link";
import { PropertyEnquire } from "./property-enquire";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import { interpolate } from "@/app/lib/i18n/format";
import type { LegacyDevelopment } from "@/app/lib/legacy-developments";
import { breadcrumbs, routeUrl } from "@/app/lib/seo/jsonld";
import { searchPath } from "@/app/lib/routes";
import { absoluteUrl } from "@/app/lib/site";

/**
 * A development carried over from the site this one replaces.
 *
 * Deliberately plainer than `/properties/[slug]`'s flagship layout. The legacy
 * records hold a name, a description and a body — there is no unit inventory,
 * no amenity list and no gallery behind most of them — and dressing that up in
 * a template built for four fully specified developments would mean inventing
 * the parts that are missing.
 */
export async function LegacyDevelopmentPage({
  development,
}: {
  development: LegacyDevelopment;
}) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const url = routeUrl(locale, "development", { slug: development.slug });

  return (
    <>
      <JsonLd
        graph={[
          {
            "@type": "ApartmentComplex",
            "@id": `${url}#development`,
            name: development.name,
            description: development.description,
            url,
            ...(development.image
              ? { image: absoluteUrl(development.image) }
              : {}),
          },
          breadcrumbs({
            locale,
            id: "development",
            values: { slug: development.slug },
            labels: t.routes,
            leafLabel: development.name,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        {development.image ? (
          <section className="relative flex min-h-[420px] items-end overflow-hidden bg-forest lg:min-h-[560px]">
            <Image
              src={development.image}
              alt={development.name}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-forest-deep/50" />
            <Container className="relative pb-14 lg:pb-20">
              <h1 className="max-w-[900px] font-display text-[34px] leading-[1.2] text-cream sm:text-[46px] lg:text-[56px]">
                <AnimatedTitle variant="banner">{development.name}</AnimatedTitle>
              </h1>
            </Container>
          </section>
        ) : (
          <section className="bg-forest py-[104px]">
            <Container>
              <h1 className="max-w-[900px] font-display text-[34px] leading-[1.2] text-cream sm:text-[46px]">
                <AnimatedTitle variant="banner">{development.name}</AnimatedTitle>
              </h1>
            </Container>
          </section>
        )}
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <div className="max-w-[842px]">
              {development.description ? (
                <p className="text-[16px] leading-[26px] text-ink">
                  {development.description}
                </p>
              ) : null}

              <ArticleBody body={development.body} />

              <Link
                href={searchPath({ currency: "USD" })}
                className="mt-10 inline-block rounded-full border border-ink/25 px-8 py-3.5 text-[13px] text-ink transition-colors hover:border-ink"
              >
                {t.common.searchProperties}
              </Link>
            </div>
          </Container>
        </section>

        {/* These records carry no inventory to link at, so the enquiry is the
            page's one way on. The type stays general: the legacy set spans
            markets this site does not otherwise sell. */}
        <PropertyEnquire
          className="bg-white pb-[72px] lg:pb-[104px]"
          eyebrow={t.property.enquireEyebrow}
          heading={interpolate(t.property.enquireHeading, {
            project: development.name,
          })}
          body={t.property.enquireBody}
          subject={interpolate(t.property.enquireSubject, {
            project: development.name,
          })}
          enquiryType="general"
        />
      </main>

      <SiteFooter />
    </>
  );
}
