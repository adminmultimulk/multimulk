import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { JsonLd } from "./json-ld";
import { Link } from "./link";
import { LastReviewed } from "./figure";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import type { Dictionary } from "@/app/lib/i18n";
import { intlLocale, type Locale } from "@/app/lib/i18n/config";
import { formatNumber, lookup } from "@/app/lib/i18n/format";
import {
  cheapestOfferedRoute,
  type Money,
  type Programme,
} from "@/app/lib/programmes";
import { pillarCta, pillarHero, pillarPlace, pillarVisual } from "@/app/lib/pillar";
import { buildPath, type RouteId } from "@/app/lib/routes";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";
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
  const category = programmes[0]?.category ?? "citizenship";
  const featured = programmes.find(
    (programme) =>
      programme.category === "citizenship" && programme.slug === "turkiye",
  );
  const grid = featured
    ? programmes.filter((programme) => programme !== featured)
    : programmes;

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
        <section className="relative flex min-h-[620px] items-end overflow-hidden bg-forest lg:min-h-[780px]">
          <Image
            src={pillarHero[category]}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pb-16 lg:pb-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[760px] font-display text-[38px] leading-[1.12] text-white sm:text-[56px]">
              <AnimatedTitle>{copy.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[620px] text-[13px] leading-[22px] text-cream/85">
              {copy.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={buildPath("contact")}
                className="rounded-full bg-cream px-8 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
              >
                {t.common.getInTouch}
              </Link>
              <Link
                href={buildPath("compareIndex")}
                className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
              >
                {t.routes.compareIndex}
              </Link>
            </div>
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
              <div className="mt-12 space-y-3">
                {featured ? (
                  <ProgrammeCard
                    programme={featured}
                    href={buildPath(programmeRouteId, {
                      programme: featured.slug,
                    })}
                    locale={locale}
                    t={t}
                    featured
                  />
                ) : null}

                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {grid.map((programme) => (
                    <li key={`${programme.category}-${programme.slug}`}>
                      <ProgrammeCard
                        programme={programme}
                        href={buildPath(programmeRouteId, {
                          programme: programme.slug,
                        })}
                        locale={locale}
                        t={t}
                      />
                    </li>
                  ))}
                </ul>
              </div>
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

        <section className="relative overflow-hidden bg-forest py-[86px] lg:py-[120px]">
          <Image
            src={pillarCta[category]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep/80" />

          <Container className="relative">
            <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
              <h2 className="font-display text-[32px] leading-[1.2] text-cream sm:text-[42px]">
                <AnimatedTitle align="center" variant="section">
                  {t.citizenship.cta.heading}
                </AnimatedTitle>
              </h2>
              <span className="mt-6 block h-px w-9 bg-cream/60" />
              <p className="mt-6 text-[13.5px] leading-[23px] text-cream/85">
                {t.citizenship.cta.body}
              </p>
              <Link
                href={buildPath("contact")}
                className="mt-9 rounded-full bg-cream px-9 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
              >
                {t.citizenship.cta.button}
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function ProgrammeCard({
  programme,
  href,
  locale,
  t,
  featured = false,
}: {
  programme: Programme;
  href: string;
  locale: Locale;
  t: Dictionary;
  featured?: boolean;
}) {
  const { image, flag } = pillarVisual(programme);
  const placeKey = pillarPlace[programme.country];
  const place = placeKey ? lookup(t.places, placeKey) : null;
  const starting =
    cheapestOfferedRoute(programme) ??
    [...programme.routes].sort((a, b) => a.minimum.amount - b.minimum.amount)[0];
  const suspended = programme.status === "suspended";

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden ${
        featured
          ? "min-h-[380px] lg:min-h-[520px]"
          : "aspect-[660/400]"
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes={featured ? "100vw" : "(max-width: 1024px) 50vw, 33vw"}
        className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
          suspended ? "grayscale" : ""
        }`}
      />
      {/*
       * On a grid card the text block runs almost the full height, so the
       * scrim has to carry cream type over a photograph that is pale from
       * top to bottom — Grenada, Saint Lucia and Antigua all are — and not
       * merely over the dark foot of one. The featured card is twice the
       * height for the same block of text, so it keeps the lighter wash.
       */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-forest-deep to-transparent ${
          featured ? "via-forest-deep/35" : "via-forest-deep/80 via-55%"
        }`}
      />
      <div
        className={`absolute inset-x-0 top-0 bg-gradient-to-b to-transparent ${
          featured ? "h-1/3 from-black/35" : "h-3/5 from-black/70"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <div className="flex items-center gap-2.5">
          {flag ? (
            <Image
              src={flag}
              alt=""
              width={22}
              height={16}
              unoptimized={flag.endsWith(".svg")}
              className="h-4 w-[22px] object-cover"
            />
          ) : null}
          {place ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-sand">
              {place}
            </p>
          ) : null}
        </div>

        <h2
          className={`mt-3 font-display leading-[1.2] text-cream ${
            featured
              ? "text-[28px] sm:text-[36px] lg:text-[42px]"
              : "text-[22px] sm:text-[24px]"
          }`}
        >
          {programme.officialName}
        </h2>

        <p
          className={`mt-2 text-[11.5px] uppercase tracking-[0.1em] ${
            suspended ? "text-gold-light" : "text-cream/65"
          }`}
        >
          {t.programmes.status[programme.status]}
        </p>

        {starting ? (
          <p className="mt-4 text-[13px] text-cream/90">
            <span className="text-cream/60">{t.common.startingFrom}</span>{" "}
            <span className="num">{formatMoney(locale, starting.minimum)}</span>
          </p>
        ) : null}

        {programme.visaFreeCount !== "unknown" ? (
          <p className="mt-1 text-[12.5px] text-cream/70">
            <span className="num">
              {formatNumber(locale, programme.visaFreeCount)}
            </span>{" "}
            {t.figures.units.count}
          </p>
        ) : null}

        <span className="mt-5 inline-block text-[12.5px] text-gold group-hover:underline">
          {t.common.learnMore}
        </span>
      </div>
    </Link>
  );
}

function formatMoney(
  locale: Parameters<typeof formatNumber>[0],
  money: Money,
): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(money.amount);
}
