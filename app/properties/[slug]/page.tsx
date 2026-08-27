import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container, SectionIntro } from "@/app/components/container";
import { MapPin } from "@/app/components/icons";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { UnitCard } from "@/app/components/unit-card";
import { getProject, projects } from "@/app/lib/projects";
import { units } from "@/app/lib/properties";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Property | Multi Mulk" };
  return {
    title: `${project.name} | Multi Mulk`,
    description: project.tagline,
  };
}

export default async function PropertyPage({
  params,
}: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const residences = units.filter((unit) => unit.project === project.name);
  const gallery = [...new Set(residences.map((unit) => unit.image))].slice(0, 3);

  return (
    <>
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
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/90 via-forest-deep/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-forest-deep/70 to-transparent" />

          <Container className="relative pb-16">
            <div className="flex items-center gap-2 text-cream/85">
              <MapPin className="w-3" />
              <span className="text-[11px] uppercase tracking-[0.11em]">
                {project.location}, {project.country}
              </span>
            </div>
            <h1 className="mt-5 max-w-[760px] font-display text-[38px] leading-[1.14] text-white sm:text-[52px]">
              <AnimatedTitle>{project.name}</AnimatedTitle>
            </h1>
            <p className="mt-4 max-w-[620px] font-display text-[20px] leading-[1.35] text-gold-light sm:text-[24px]">
              <AnimatedTitle delay={0.25}>{project.tagline}</AnimatedTitle>
            </p>
            <p className="mt-6 max-w-[620px] text-[13px] leading-[22px] text-cream/85">
              {project.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#residences"
                className="rounded-full bg-cream px-8 py-3.5 text-[13px] text-forest transition-colors hover:bg-white"
              >
                View Residences
              </a>
              <a
                href="#"
                className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
              >
                View Construction Progress
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
              {project.highlights.map((highlight) => (
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
                  {project.overview.heading}
                </h2>
                <p className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink">
                  {project.overview.body}
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-[10.5px] uppercase tracking-[0.12em] text-gold">
                        {stat.label}
                      </dt>
                      <dd className="mt-2 font-display text-[19px] leading-[26px] text-ink">
                        {stat.value}
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
              eyebrow="Find Your Dream Home"
              heading="Available Residences"
              body={`Explore the ${residences.length} ${
                residences.length === 1 ? "residence" : "residences"
              } currently released at ${project.name}.`}
            />

            {residences.length ? (
              <div className="mt-14 grid gap-x-[43px] gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {residences.map((unit) => (
                  <UnitCard key={unit.slug} unit={unit} currency="USD" />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-[13.5px] text-ink/70">
                Residences at {project.name} are released in phases — enquire for
                current availability.
              </p>
            )}

            <div className="mt-14 text-center">
              <Link
                href={`/search-property?currency=USD&q=${encodeURIComponent(project.name)}`}
                className="inline-block rounded-full border border-ink/25 px-8 py-3.5 text-[13px] text-ink transition-colors hover:border-ink"
              >
                Browse all residences
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
                  Amenities
                </h2>
                <p className="mt-6 max-w-[500px] text-[13.5px] leading-[23px] text-ink">
                  {project.amenities.body}
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-4 self-center">
                {project.amenities.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-ink/10 pb-3 text-[13.5px] text-ink"
                  >
                    {item}
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
              Other Developments
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
