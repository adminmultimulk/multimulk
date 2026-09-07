import { Container, SectionIntro } from "./container";
import { AmenityIcon } from "./amenity-icon";
import { AnimatedTitle } from "./animated-title";
import { BrochureButton } from "./brochure-button";
import { EnquireButton } from "./enquire-button";
import { JsonLd } from "./json-ld";
import { Link } from "./link";
import { ListingImage } from "./listing-image";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { UnitCard } from "./unit-card";
import {
  Area,
  Bath,
  Bed,
  Building,
  MapPin,
  Stairs,
  ViewIcon,
} from "./icons";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import { formatNumber, interpolate, lookup } from "@/app/lib/i18n/format";
import { placeLabel, unitSpecs, unitTitle } from "@/app/lib/i18n/units";
import { mergedUnits, type Listing } from "@/app/lib/cms/properties";
import { getProjectByName } from "@/app/lib/projects";
import { breadcrumbs, residence, routeUrl } from "@/app/lib/seo/jsonld";

/**
 * The page a listing gets when a lister publishes it.
 *
 * The four developments that ship with the site have a page written for them —
 * a tagline, an overview, stats, a gallery, a phased release of residences.
 * A listing is a single unit and everything past its specs is optional, so
 * this page is built the other way round: every section below is omitted
 * rather than empty when the field behind it was left blank. A lister who
 * fills in nothing but the required fields still gets a page that reads as
 * finished — specs, price, and the two things a reader came to do.
 *
 * `/properties/<slug>`, the same namespace the developments use. A unit and
 * the scheme it sits in are the same kind of thing to a buyer, and two URL
 * shapes for them would only be a fact about our database.
 */
export async function ListingPage({ listing }: { listing: Listing }) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = t.listing;

  const title = unitTitle(locale, t, listing);
  const place = placeLabel(t, listing.location);
  const country = placeLabel(t, listing.country);
  const url = routeUrl(locale, "development", { slug: listing.slug });

  const specs = unitSpecs(locale, t, listing)
    .map((value, index) => ({ Icon: SPEC_ICONS[index], value }))
    .filter((spec) => spec.value);

  // The development this unit sits in, where the site knows it as one — a
  // listing names its scheme in free text, and only the four in `projects.ts`
  // have a page to send anyone to.
  const project = getProjectByName(listing.project);

  // Everything else released in the same scheme. Drawn from the merged
  // inventory, so a listing sits alongside the units that ship with the site.
  const siblings = (await mergedUnits())
    .filter((unit) => unit.project === listing.project && unit.slug !== listing.slug)
    .slice(0, 3);

  const enquiry = {
    eyebrow: `${title} · ${place}`,
    subject: interpolate(t.unit.enquirySubject, { unit: title, place }),
    enquiryType:
      listing.country === "Caribbean"
        ? ("caribbeanCbi" as const)
        : ("turkiyeProperty" as const),
  };

  const terms = [
    { label: copy.paymentPlan, value: listing.paymentPlan },
    { label: copy.handover, value: listing.handover },
    { label: copy.serviceCharge, value: listing.serviceCharge },
    { label: copy.titleDeed, value: listing.titleDeed },
  ].filter((term): term is { label: string; value: string } =>
    Boolean(term.value),
  );

  return (
    <>
      <JsonLd
        graph={[
          residence(locale, listing, title, url),
          breadcrumbs({
            locale,
            id: "development",
            values: { slug: listing.slug },
            labels: t.routes,
            leafLabel: title,
          }),
        ]}
      />

      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[560px] items-end overflow-hidden bg-forest lg:min-h-[680px]">
          <ListingImage
            src={listing.image}
            alt={title}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pb-16">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-cream/85">
                <MapPin className="w-3" />
                <span className="text-[11px] uppercase tracking-[0.11em]">
                  {place} · {country}
                </span>
              </span>
              {listing.cbiEligible && !listing.soldOut ? (
                <span className="rounded-full bg-gold/95 px-3 py-1 text-[10px] uppercase tracking-[0.08em] text-white">
                  {t.unit.citizenshipEligible}
                </span>
              ) : null}
              {listing.soldOut ? (
                <span className="rounded-full bg-forest-deep/85 px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-cream">
                  {t.unit.soldOut}
                </span>
              ) : null}
            </div>

            {/* The unit's name carries its development's, which is the same in
                every language; only the layout half is translated. */}
            <h1 className="mt-5 max-w-[760px] font-display text-[34px] leading-[1.14] text-white sm:text-[48px]">
              <AnimatedTitle>{title}</AnimatedTitle>
            </h1>

            <p className="mt-4 text-[13px] uppercase tracking-[0.1em] text-cream/70">
              {t.common.startingFrom}{" "}
              <span className="num text-[19px] normal-case tracking-normal text-gold-light">
                USD {formatNumber(locale, listing.prices.USD)}
              </span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <EnquireButton
                context={enquiry}
                className="rounded-full bg-cream px-8 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
              />
              {listing.brochure ? (
                <BrochureButton
                  slug={listing.slug}
                  project={listing.project}
                  brochure={listing.brochure}
                  eyebrow={`${title} · ${place}`}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
                />
              ) : null}
              {project ? (
                <Link
                  href={`/properties/${project.slug}`}
                  className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
                >
                  {copy.viewDevelopment}
                </Link>
              ) : null}
            </div>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* Specs. The one section that is always here: every listing has them,
            and they are what a reader scrolled down for. */}
        <section className="bg-mist py-12 lg:py-16">
          <Container>
            <h2 className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
              {copy.specs}
            </h2>
            <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
              {specs.map(({ Icon, value }) => (
                <div key={value} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 w-4 shrink-0 text-gold" />
                  <dd className="text-[13px] leading-[19px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {listing.description || listing.highlights.length ? (
          <section className="bg-white py-16 lg:py-24">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
                {listing.description ? (
                  <div>
                    <h2 className="max-w-[460px] font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                      {copy.about}
                    </h2>
                    {/* One paragraph per blank line, as the lister typed it. */}
                    {listing.description
                      .split(/\n{2,}/)
                      .map((paragraph) => paragraph.trim())
                      .filter(Boolean)
                      .map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                ) : null}

                {listing.highlights.length ? (
                  <ul className="grid gap-8 self-start">
                    {listing.highlights.map((highlight) => (
                      <li key={highlight.title}>
                        <h3 className="font-display text-[21px] leading-[1.3] text-ink">
                          {lookup(t.property.highlights, highlight.title)}
                        </h3>
                        <span className="mt-3 block h-px w-7 bg-gold" />
                        <p className="mt-3 text-[13px] leading-[21px] text-ink/80">
                          {highlight.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Container>
          </section>
        ) : null}

        {listing.gallery.length ? (
          <section className="bg-mist py-16 lg:py-20">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
                {copy.gallery}
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {listing.gallery.map((src, index) => (
                  <div
                    key={src}
                    className={`relative overflow-hidden ${
                      index === 0
                        ? "aspect-[16/10] sm:col-span-2 lg:col-span-2 lg:row-span-2"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <ListingImage
                      src={src}
                      alt=""
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    />
                  </div>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {listing.floorPlans.length ? (
          <section className="bg-white py-16 lg:py-20">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
                {copy.floorPlans}
              </h2>
              {/* On white, uncropped: a plan cut to fill a box is a plan with
                  a room missing. */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {listing.floorPlans.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden border border-ink/10 bg-white"
                  >
                    <ListingImage
                      src={src}
                      alt={copy.floorPlans}
                      sizes="(max-width: 640px) 100vw, 500px"
                      className="object-contain p-4"
                    />
                  </div>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {listing.amenities.length ? (
          <section className="bg-mist py-16 lg:py-20">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
                <h2 className="font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                  {t.property.amenities}
                </h2>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-4 self-center">
                  {listing.amenities.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-ink/10 pb-3 text-[13.5px] text-ink"
                    >
                      {/* Keyed by the English name, so the glyph survives
                          translation. */}
                      <AmenityIcon
                        name={item}
                        className="w-[18px] shrink-0 text-gold"
                      />
                      <span>{lookup(t.property.amenityItems, item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        ) : null}

        {terms.length || listing.videoUrl ? (
          <section className="bg-white py-16 lg:py-20">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
                {copy.terms}
              </h2>

              {terms.length ? (
                <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                  {terms.map((term) => (
                    <div key={term.label}>
                      <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                        {term.label}
                      </dt>
                      <dd className="mt-2 text-[13.5px] leading-[22px] text-ink">
                        {term.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* A link rather than an embed: the tour is on somebody else's
                  player, and mounting it would put their cookies on this page
                  for every reader who never presses play. */}
              {listing.videoUrl ? (
                <a
                  href={listing.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-block rounded-full border border-ink/25 px-8 py-3 text-[13px] text-ink transition-colors hover:border-ink"
                >
                  {copy.watchTour}
                </a>
              ) : null}
            </Container>
          </section>
        ) : null}

        {listing.mapLat !== null && listing.mapLng !== null ? (
          <section className="bg-mist py-16 lg:py-20">
            <Container>
              <h2 className="font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
                {copy.location}
              </h2>
              <div className="mt-8 aspect-[16/9] w-full overflow-hidden border border-ink/10 bg-white">
                <iframe
                  src={`https://www.google.com/maps?q=${listing.mapLat},${listing.mapLng}&hl=${locale}&z=15&output=embed`}
                  title={interpolate(copy.mapTitle, { title })}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${listing.mapLat},${listing.mapLng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[11.5px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-gold"
              >
                {t.contact.mapLink}
              </a>
            </Container>
          </section>
        ) : null}

        {siblings.length ? (
          <section className="bg-white py-16 lg:py-24">
            <Container>
              <SectionIntro
                eyebrow={t.property.residencesEyebrow}
                heading={interpolate(copy.moreAt, { project: listing.project })}
              />
              <div className="mt-14 grid gap-x-[43px] gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {siblings.map((unit) => (
                  <UnitCard key={unit.slug} unit={unit} currency="USD" />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {/* The ask, once, at the end — the reader who scrolled this far did
            not come for another gallery. */}
        <section className="bg-forest py-16 lg:py-20">
          <Container>
            <div className="flex flex-col items-center text-center">
              <h2 className="max-w-[560px] font-display text-[28px] leading-[1.25] text-cream sm:text-[34px]">
                {copy.ctaHeading}
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <EnquireButton
                  context={enquiry}
                  className="rounded-full bg-cream px-8 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
                />
                {listing.brochure ? (
                  <BrochureButton
                    slug={listing.slug}
                    project={listing.project}
                    brochure={listing.brochure}
                    eyebrow={`${title} · ${place}`}
                    className="inline-flex items-center gap-2 rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
                  />
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

const SPEC_ICONS = [Building, Bath, Bed, Area, Stairs, ViewIcon];
