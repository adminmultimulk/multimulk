import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { JsonLd } from "./json-ld";
import { Link } from "./link";
import { LastReviewed } from "./figure";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import { buildPath, type RouteId } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";
import type { Programme } from "@/app/lib/programmes";
import type { LegalReview } from "@/app/lib/review";

/**
 * A pillar hub: the page that lists the programmes under one of the four
 * headings the site is organised around.
 *
 * Shared between citizenship and residency because the two differ in their
 * copy and their programmes, not in their shape — and a hub that reads
 * differently from its sibling makes the pillars harder to tell apart, not
 * easier.
 */
export async function PillarHub({
  routeId,
  programmeRouteId,
  copy,
  programmes,
  review,
}: {
  routeId: RouteId;
  programmeRouteId: RouteId;
  copy: { eyebrow: string; heading: string; body: string; hubIntro: string };
  programmes: readonly Programme[];
  review?: LegalReview;
}) {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: routeId,
            name: copy.heading,
            description: copy.body,
            itemUrls: programmes.map((programme) =>
              routeUrl(locale, programmeRouteId, { programme: programme.slug }),
            ),
          }),
          breadcrumbs({ locale, id: routeId, labels: t.routes }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="bg-forest py-[104px] lg:py-[136px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[860px] font-display text-[36px] leading-[1.16] text-cream sm:text-[48px] lg:text-[58px]">
              <AnimatedTitle variant="banner">{copy.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[620px] text-[15px] leading-[25px] text-cream/75">
              {copy.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[104px]">
          <Container>
            <p className="max-w-[720px] text-[15px] leading-[26px] text-ink/80">
              {copy.hubIntro}
            </p>

            {programmes.length ? (
              <ul className="mt-12 grid gap-px border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
                {programmes.map((programme) => (
                  <li key={`${programme.category}-${programme.slug}`} className="bg-white">
                    <Link
                      href={buildPath(programmeRouteId, {
                        programme: programme.slug,
                      })}
                      className="group flex h-full flex-col justify-between p-7 transition-colors hover:bg-mist"
                    >
                      <div>
                        <h2 className="font-display text-[22px] leading-[1.25] text-ink">
                          {programme.officialName}
                        </h2>
                        <p className="mt-3 text-[12.5px] uppercase tracking-[0.1em] text-ink/50">
                          {t.programmes.status[programme.status]}
                        </p>
                      </div>
                      <span className="mt-8 text-[12.5px] text-gold group-hover:underline">
                        {t.common.learnMore}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              // The hub exists before its programmes are signed off, and says
              // so rather than showing an empty grid with no explanation.
              <p className="mt-10 border border-ink/12 bg-mist p-7 text-[13.5px] leading-[21px] text-ink/70">
                {t.programmes.unreviewed}
              </p>
            )}

            {review ? <LastReviewed review={review} className="mt-10" /> : null}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
