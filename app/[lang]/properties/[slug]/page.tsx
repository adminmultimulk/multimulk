import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AmenityIcon } from "@/app/components/amenity-icon";
import { AnimatedTitle } from "@/app/components/animated-title";
import { ArticleBody, RichLine } from "@/app/components/article-body";
import { BrochureButton } from "@/app/components/brochure-button";
import { Container, SectionIntro } from "@/app/components/container";
import { DistrictMap } from "@/app/components/district-map";
import { MapPin } from "@/app/components/icons";
import { watermarked } from "@/app/lib/watermark";
import { Link } from "@/app/components/link";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { UnitCard } from "@/app/components/unit-card";
import {
  alternatesFor,
  getDictionary,
  getLocale,
  type Dictionary,
} from "@/app/lib/i18n";
import { locales } from "@/app/lib/i18n/config";
import {
  getLegacyDevelopment,
  legacyDevelopments,
} from "@/app/lib/legacy-developments";
import { LegacyDevelopmentPage } from "@/app/components/legacy-development";
import { ListingPage } from "@/app/components/listing-page";
import { PropertyGallery } from "@/app/components/property-gallery";
import { JsonLd } from "@/app/components/json-ld";
import { apartmentComplex, breadcrumbs } from "@/app/lib/seo/jsonld";
import { interpolate, lookup, pick, selectPlural } from "@/app/lib/i18n/format";
import { placeLine, unitTitle } from "@/app/lib/i18n/units";
import type { Project } from "@/app/lib/projects";
import { developments, getDevelopment } from "@/app/lib/cms/developments";
import { getListing } from "@/app/lib/cms/properties";
import { plainText, toBlocks } from "@/app/lib/rich-text";

/*
 * The ninety-four developments carried over from the legacy site, and those
 * alone. A development or a listing published in the dashboard is not
 * enumerated here — it would mean a database read at build time for a set that
 * changes between builds — and renders on demand instead.
 */
export function generateStaticParams() {
  const slugs = legacyDevelopments.map((development) => development.slug);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

/**
 * The opening of a development's prose, for the hero.
 *
 * A development written by hand carries a tagline and a couple of sentences.
 * One assembled from listings carries whatever its lister wrote about the
 * scheme — several hundred words, in the body grammar. All of it belongs on
 * the page, and it is below under `about`; none of it belongs stacked in the
 * hero, where it outgrows the banner, climbs behind the nav and buries the
 * name it sits under.
 */
function excerpt(text: string, limit = 260): string {
  // The prose without its markup: a banner line is a sentence, not the grammar
  // it was written in.
  const flat = plainText(toBlocks(text)).join(" ").trim();
  if (flat.length <= limit) return flat;

  const cut = flat.slice(0, limit);
  const sentence = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? "),
  );
  // Cut on the last full sentence, unless that would throw most of the
  // allowance away — then cut on a word and mark the ellipsis.
  if (sentence > limit / 2) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trimEnd()}…`;
}

/**
 * The short strings on a development page are translated; the long prose is
 * staged, so it falls back to the English in `projects.ts` until a translation
 * is filled in under `dictionary.property.copy`.
 */
function localise(t: Dictionary, project: Project) {
  const short =
    t.property.projects[project.slug as keyof typeof t.property.projects];
  const long = t.property.copy[project.slug];

  return {
    tagline: pick(short?.tagline, project.tagline),
    description: pick(long?.description, project.description),
    overviewHeading: pick(short?.overviewHeading, project.overview.heading),
    overviewBody: pick(long?.overviewBody, project.overview.body),
    amenitiesBody: pick(long?.amenitiesBody, project.amenities.body),
    highlights: project.highlights.map((highlight) => ({
      title: lookup(t.property.highlights, highlight.title),
      text: pick(long?.highlights?.[highlight.title], highlight.text),
    })),
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getDictionary();
  const project = await getDevelopment(slug);
  const alternates = await alternatesFor(`/properties/${slug}`);

  if (!project) {
    // One of the ninety-four developments carried over from the legacy site.
    const legacy = getLegacyDevelopment(slug);
    if (legacy) {
      return {
        title: legacy.name,
        description: legacy.description,
        alternates,
      };
    }

    // Or a unit a lister published, which has a page of its own.
    const listing = await getListing(slug);
    if (!listing) return { title: t.meta.propertyFallback };

    const locale = await getLocale();
    return {
      title: listing.seoTitle || unitTitle(locale, t, listing),
      description:
        listing.seoDescription ||
        // The prose without its markup: a result snippet should read as a
        // sentence, not as the grammar it was written in.
        (listing.description
          ? plainText(toBlocks(listing.description)).join(" ")
          : "") ||
        `${listing.title} — ${listing.location}, ${listing.country}.`,
      alternates,
      // A listing kept out of search results still has a readable URL, for a
      // campaign that links straight at it.
      ...(listing.noindex ? { robots: { index: false, follow: true } } : {}),
    };
  }

  const copy = localise(t, project);
  return {
    title: `${project.name}`,
    // A development assembled from listings has no tagline of its own; its
    // description is the prose its lister wrote.
    description: copy.tagline || copy.description,
    alternates,
  };
}

export default async function PropertyPage({
  params,
}: PageProps<"/[lang]/properties/[slug]">) {
  const { slug } = await params;
  const project = await getDevelopment(slug);

  if (!project) {
    // The legacy developments have a name, a description and a body, and no
    // unit inventory behind them — so they get a page shaped to what is
    // actually known rather than this one's galleries and floorplans.
    const legacy = getLegacyDevelopment(slug);
    if (legacy) return <LegacyDevelopmentPage development={legacy} />;

    // A unit published from the dashboard. Last, so that a slug which somehow
    // matches a development still resolves to the development — the same
    // precedence the search page merges with.
    const listing = await getListing(slug);
    if (!listing) notFound();
    return <ListingPage listing={listing} />;
  }

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = localise(t, project);

  // The prose the banner only opens with, where a development has no overview
  // of its own to put in its place.
  const about = copy.overviewBody ? "" : copy.description;

  const residences = project.units;
  // The card image of each residence, then whatever else was uploaded with
  // them. Three are shown beside the overview; the rest are behind them in the
  // lightbox, which is where the photography of a development actually lives
  // now that every unit in it carries its own.
  const gallery = [
    ...new Set(residences.flatMap((unit) => [unit.image, ...unit.gallery])),
  ];
  // A development's own `location` is the city — "İstanbul" — while the units
  // inside it carry the district, "Kartal, Istanbul". The district is the one
  // worth drawing a map of, so the first unit that names something more
  // specific than the development wins, and the city is the fallback.
  const area =
    residences.find(
      (unit) => unit.location && unit.location !== project.location,
    )?.location ?? project.location;
  // Where the pin goes. A development has no coordinates of its own, so the
  // first residence that carries a pair stands for the scheme — they are all
  // in the same place, and the pin is blunted to about a kilometre before it
  // is drawn anyway.
  const pin = residences.find(
    (unit) => unit.mapLat !== null && unit.mapLng !== null,
  );
  // The district a lister picked on any of the scheme's units. They are one
  // development, so the first that names one speaks for all of them.
  const district =
    residences.find((unit) => unit.mapDistrict)?.mapDistrict ?? null;
  const others = (await developments()).filter(
    (other) => other.slug !== project.slug,
  );

  return (
    <>
      <JsonLd
        graph={[
          // Only the description is swapped for this language; `copy` also
          // carries a differently-shaped `highlights`, which this node does
          // not use and must not inherit.
          apartmentComplex(
            locale,
            { ...project, description: copy.description },
            residences.length,
          ),
          breadcrumbs({
            locale,
            id: "development",
            values: { slug },
            labels: t.routes,
            leafLabel: project.name,
          }),
        ]}
      />
      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[620px] items-end overflow-hidden bg-forest lg:min-h-[760px]">
          <Image
            src={watermarked(project.image)}
            alt={project.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/70 to-transparent" />

          {/* The nav above is absolutely positioned, so the banner leaves it
              room: a development whose copy runs long grows upward off the
              bottom of the section and would otherwise run underneath it. */}
          <Container className="relative pb-16 pt-28 lg:pt-32">
            <div className="flex items-center gap-2 text-cream/85">
              <MapPin className="w-3" />
              {/* "Şişli, İstanbul, Türkiye" — each part looked up on its own,
                  since `country` carries the city as well as the country. */}
              <span className="text-[11px] uppercase tracking-[0.11em]">
                {[project.location, ...project.country.split(",")]
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .map((part) => placeLine(t, [part]))
                  .join(", ")}
              </span>
            </div>
            {/* The development name is the same in every language. */}
            <h1 className="mt-5 max-w-[760px] font-display text-[38px] leading-[1.14] text-white sm:text-[52px]">
              <AnimatedTitle>{project.name}</AnimatedTitle>
            </h1>
            {copy.tagline ? (
              <p className="mt-4 max-w-[620px] font-display text-[20px] leading-[1.35] text-gold-light sm:text-[24px]">
                <AnimatedTitle delay={0.25}>{copy.tagline}</AnimatedTitle>
              </p>
            ) : null}
            {copy.description ? (
              <p className="mt-6 max-w-[620px] text-[13px] leading-[22px] text-cream/85">
                {excerpt(copy.description)}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#residences"
                className="rounded-full bg-cream px-8 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
              >
                {t.property.viewResidences}
              </a>
              {/* Only where the development has a brochure to send; see
                  `Project.brochure`. */}
              {project.brochure ? (
                <BrochureButton
                  slug={project.slug}
                  project={project.name}
                  brochure={project.brochure}
                  eyebrow={project.name}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
                />
              ) : null}
              <a
                href="#"
                className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
              >
                {t.property.viewProgress}
              </a>
            </div>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* Highlights */}
        <section className="bg-mist py-16 lg:py-20">
          <Container>
            <ul className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              {copy.highlights.map((highlight) => (
                <li key={highlight.title}>
                  <h2 className="font-display text-[25px] font-bold leading-[1.25] text-ink sm:text-[28px]">
                    {highlight.title}
                  </h2>
                  <span className="mt-4 block h-px w-7 bg-gold" />
                  {/* The same grammar a listing's highlight is written in, so
                      a lister who bolds a word here sees it bolded. */}
                  <p className="mt-4 text-[14.5px] leading-[24px] text-ink/80">
                    <RichLine text={highlight.text} />
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Overview + stats */}
        <section className="bg-white py-16 lg:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div>
                {/* A development assembled from listings has no overview of its
                    own — the dashboard has no field for one — so what its
                    lister wrote about the scheme reads here instead, in full
                    and in the body grammar it was written in. The banner above
                    carries only its opening. */}
                {copy.overviewHeading ? (
                  <h2 className="max-w-[460px] font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                    {copy.overviewHeading}
                  </h2>
                ) : about ? (
                  <h2 className="max-w-[460px] font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                    {t.property.about}
                  </h2>
                ) : null}
                {copy.overviewBody ? (
                  <p className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink">
                    {copy.overviewBody}
                  </p>
                ) : about ? (
                  <div className="mt-6 max-w-[500px]">
                    <ArticleBody body={toBlocks(about)} />
                  </div>
                ) : null}

                <dl
                  className={`grid grid-cols-2 gap-x-8 gap-y-7 ${
                    copy.overviewHeading || copy.overviewBody || about
                      ? "mt-10"
                      : ""
                  }`}
                >
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                        {lookup(t.property.stats, stat.label)}
                      </dt>
                      <dd className="mt-2 font-display text-[19px] leading-[26px] text-ink">
                        {lookup(t.property.statValues, stat.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* The photography, then where it is. Both in the column beside
                  the overview, because "where is this?" is the question the
                  renders raise — and because the prose is far longer than the
                  photographs, so without the map under them the column ends
                  in most of a screen of white. */}
              <div className="flex flex-col gap-12">
                {gallery.length ? (
                  <PropertyGallery
                    images={gallery}
                    label={project.name}
                    variant="collage"
                  />
                ) : null}

                <DistrictMap
                  inline
                  area={area}
                  district={district}
                  lat={pin?.mapLat}
                  lng={pin?.mapLng}
                  country={project.country}
                  heading={t.listing.location}
                  mapTitle={interpolate(t.listing.mapTitle, {
                    title: project.name,
                  })}
                  linkLabel={t.contact.mapLink}
                  locale={locale}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Amenities */}
        {project.amenities.items.length ? (
        <section className="bg-mist py-16 lg:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div>
                <h2 className="font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                  {t.property.amenities}
                </h2>
                {copy.amenitiesBody ? (
                  <p className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink">
                    {copy.amenitiesBody}
                  </p>
                ) : null}
              </div>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-4 self-center">
                {project.amenities.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-ink/10 pb-3 text-[13.5px] text-ink"
                  >
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

        {/* Residences */}
        <section id="residences" className="scroll-mt-24 bg-white py-16 lg:py-24">
          <Container>
            <SectionIntro
              eyebrow={t.property.residencesEyebrow}
              heading={t.property.residencesHeading}
              body={selectPlural(locale, t.property.residencesBody, residences.length, {
                project: project.name,
              })}
            />

            {residences.length ? (
              <div className="mt-14 grid gap-x-[43px] gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {residences.map((unit) => (
                  <UnitCard key={unit.slug} unit={unit} currency="USD" />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-[13.5px] text-ink/70">
                {t.property.residencesEmpty.replace("{project}", project.name)}
              </p>
            )}

            <div className="mt-14 text-center">
              <Link
                href={`/search-property?currency=USD&q=${encodeURIComponent(project.name)}`}
                className="inline-block rounded-full border border-ink/25 px-8 py-3.5 text-[13px] text-ink transition-colors hover:border-ink"
              >
                {t.property.browseAll}
              </Link>
            </div>
          </Container>
        </section>

        {/* Other developments */}
        {others.length ? (
        <section className="bg-forest py-16 lg:py-20">
          <Container>
            <h2 className="font-display text-[26px] text-cream sm:text-[32px]">
              {t.property.otherDevelopments}
            </h2>
            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {others
                .slice(0, 3)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/properties/${other.slug}`}
                      className="group relative block aspect-[430/280] overflow-hidden"
                    >
                      <Image
                        src={watermarked(other.image)}
                        alt={other.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 430px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
                      <span className="absolute inset-x-5 bottom-5 font-display text-[20px] text-cream">
                        {other.name}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </Container>
        </section>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
