import Image from "next/image";
import { Container, SectionIntro } from "./container";
import { Link } from "./link";
import type { Programme, ProgrammeProject } from "@/app/lib/citizenship";
import { getDictionary, type Dictionary } from "@/app/lib/i18n";
import { lookup } from "@/app/lib/i18n/format";
import { placeLine } from "@/app/lib/i18n/units";

/** The developments that qualify under the programme. */
export async function CitizenshipProjects({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship[programme.key].projects;

  return (
    <section
      id="projects"
      className="scroll-mt-[72px] bg-mist py-[72px] lg:py-[104px]"
    >
      <Container>
        <SectionIntro heading={copy.heading} body={copy.body} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {programme.projects.map((project) => (
            <li key={project.name}>
              <ProjectCard project={project} t={t} />
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link
            href={programme.searchHref}
            className="inline-block rounded-full border border-ink/25 px-8 py-3.5 text-[13px] text-ink transition-colors hover:border-ink"
          >
            {t.citizenship.browseAll}
          </Link>
        </div>
      </Container>
    </section>
  );
}

/**
 * A development with a page of its own is a link; the rest render as plain
 * cards rather than dead links, which is how the menus treat them too.
 */
function ProjectCard({
  project,
  t,
}: {
  project: ProgrammeProject;
  t: Dictionary;
}) {
  const body = (
    <>
      <div className="relative aspect-[430/300] overflow-hidden">
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/15 to-transparent" />
        <p className="absolute inset-x-5 bottom-5 text-[9.5px] uppercase leading-[14px] tracking-[0.1em] text-cream/85">
          {placeLine(t, project.eyebrow)}
        </p>
      </div>
      <div className="bg-white px-6 py-6">
        {/* The development name is the same in every language. */}
        <h3 className="font-display text-[20px] leading-[1.3] text-ink">
          {project.name}
        </h3>
        <p className="mt-3 text-[12px] leading-[18px] text-ink/70">
          {lookup(t.menus.detail, project.detailKey)}
        </p>
      </div>
    </>
  );

  return project.href ? (
    <Link href={project.href} className="group block h-full">
      {body}
    </Link>
  ) : (
    <div className="group h-full">{body}</div>
  );
}
