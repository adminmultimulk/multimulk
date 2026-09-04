import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { JsonLd } from "./json-ld";
import { LastReviewed } from "./figure";
import { ProgrammeRoutes } from "./programme-table";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import type { Programme } from "@/app/lib/programmes";
import type { RouteId } from "@/app/lib/routes";
import { breadcrumbs, service } from "@/app/lib/seo/jsonld";

/**
 * One programme, described by its own record.
 *
 * The prose slot is deliberately thin. What this page is for is the data —
 * the routes, their thresholds, what the programme grants and what it asks —
 * stated in the same fields as every other programme, so a reader can carry a
 * comparison from one page to the next without re-learning the vocabulary.
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
  const copy = t.programmes;

  return (
    <>
      <JsonLd
        graph={[
          service({
            locale,
            slug: programme.slug,
            name: programme.officialName,
            description: programme.officialName,
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
        <section className="bg-forest py-[104px] lg:py-[128px]">
          <Container>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {programme.category === "citizenship"
                ? t.pillars.citizenship.eyebrow
                : t.pillars.goldenVisa.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[880px] font-display text-[34px] leading-[1.18] text-cream sm:text-[46px] lg:text-[54px]">
              <AnimatedTitle variant="banner">
                {programme.officialName}
              </AnimatedTitle>
            </h1>
            <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-4 text-cream/80">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.1em] text-cream/55">
                  {copy.statusHeading}
                </dt>
                <dd className="mt-1 text-[14px]">
                  {copy.status[programme.status]}
                </dd>
              </div>
              {programme.since !== "unknown" ? (
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.1em] text-cream/55">
                    {copy.sinceLabel}
                  </dt>
                  <dd className="num mt-1 text-[14px]">{programme.since}</dd>
                </div>
              ) : null}
            </dl>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        <section className="bg-white py-[72px] lg:py-[96px]">
          <Container>
            {/* Said before anything else on the page, not after it: these
                figures have not cleared review, and a reader deserves to know
                that before they read them, not once they have. */}
            {programme.dataStatus === "pending" ? (
              <p
                role="note"
                className="mb-10 border-s-2 border-gold bg-gold/5 px-6 py-4 text-[13px] leading-[21px] text-ink/80"
              >
                {copy.unreviewed}
              </p>
            ) : null}

            <h2 className="font-display text-[26px] leading-[1.25] text-ink sm:text-[32px]">
              {copy.routesHeading}
            </h2>
            <div className="mt-7">
              <ProgrammeRoutes programme={programme} />
            </div>

            <LastReviewed review={programme.review} className="mt-12" />
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
