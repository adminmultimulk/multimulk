import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { BrochureButton } from "@/app/components/brochure-button";
import { Container, SectionIntro } from "@/app/components/container";
import { MapPin } from "@/app/components/icons";
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
import { JsonLd } from "@/app/components/json-ld";
import { apartmentComplex, breadcrumbs } from "@/app/lib/seo/jsonld";
import { lookup, pick, selectPlural } from "@/app/lib/i18n/format";
import { placeLine, unitTitle } from "@/app/lib/i18n/units";
import { getProject, projects, type Project } from "@/app/lib/projects";
import { getListing, mergedUnits } from "@/app/lib/cms/properties";

export function generateStaticParams() {
  const slugs = [
    ...projects.map((project) => project.slug),
    ...legacyDevelopments.map((development) => development.slug),
  ];
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
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
  const project = getProject(slug);
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
        listing.description ||
        `${listing.title} — ${listing.location}, ${listing.country}.`,
      alternates,
      // A listing kept out of search results still has a readable URL, for a
      // campaign that links straight at it.
      ...(listing.noindex ? { robots: { index: false, follow: true } } : {}),
    };
  }

  return {
    title: `${project.name}`,
    description: localise(t, project).tagline,
    alternates,
  };
}

export default async function PropertyPage({
  params,
}: PageProps<"/[lang]/properties/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

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

  const residences = (await mergedUnits()).filter(
    (unit) => unit.project === project.name,
  );
  const gallery = [...new Set(residences.map((unit) => unit.image))].slice(0, 3);

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
            src={project.image}
            alt={project.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent rtl:bg-gradient-to-l" />
          <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/70 to-transparent" />

          <Container className="relative pb-16">
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
            <p className="mt-4 max-w-[620px] font-display text-[20px] leading-[1.35] text-gold-light sm:text-[24px]">
              <AnimatedTitle delay={0.25}>{copy.tagline}</AnimatedTitle>
            </p>
            <p className="mt-6 max-w-[620px] text-[13px] leading-[22px] text-cream/85">
              {copy.description}
            </p>
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
                  <h2 className="font-display text-[21px] leading-[1.3] text-ink">
                    {highlight.title}
                  </h2>
                  <span className="mt-4 block h-px w-7 bg-gold" />
                  <p className="mt-4 text-[13px] leading-[21px] text-ink/80">
                    {highlight.text}
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
                <h2 className="max-w-[460px] font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                  {copy.overviewHeading}
                </h2>
                <p className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink">
                  {copy.overviewBody}
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
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

              {gallery.length ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative col-span-2 aspect-[16/9] overflow-hidden">
                    <Image
                      src={gallery[0]}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover"
                    />
                  </div>
                  {gallery.slice(1, 3).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 300px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Container>
        </section>

        {/* Residences */}
        <section id="residences" className="scroll-mt-24 bg-mist py-16 lg:py-24">
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

        {/* Amenities */}
        <section className="bg-white py-16 lg:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div>
                <h2 className="font-display text-[30px] leading-[1.28] text-ink sm:text-[38px]">
                  {t.property.amenities}
                </h2>
                <p className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink">
                  {copy.amenitiesBody}
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-4 self-center">
                {project.amenities.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-ink/10 pb-3 text-[13.5px] text-ink"
                  >
                    {lookup(t.property.amenityItems, item)}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Other developments */}
        <section className="bg-forest py-16 lg:py-20">
          <Container>
            <h2 className="font-display text-[26px] text-cream sm:text-[32px]">
              {t.property.otherDevelopments}
            </h2>
            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {projects
                .filter((p) => p.slug !== project.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/properties/${other.slug}`}
                      className="group relative block aspect-[430/280] overflow-hidden"
                    >
                      <Image
                        src={other.image}
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
      </main>

      <SiteFooter />
    </>
  );
}
