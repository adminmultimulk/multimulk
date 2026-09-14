import { Awards } from "./awards";
import { CitizenshipAbout } from "./citizenship-about";
import { CitizenshipAnchors } from "./citizenship-anchors";
import { CitizenshipBenefits } from "./citizenship-benefits";
import { CitizenshipCta } from "./citizenship-cta";
import { CitizenshipEnquire } from "./citizenship-enquire";
import { CitizenshipFaq } from "./citizenship-faq";
import { CitizenshipGallery } from "./citizenship-gallery";
import { CitizenshipHero } from "./citizenship-hero";
import { CitizenshipIndustry } from "./citizenship-industry";
import { CitizenshipIntro } from "./citizenship-intro";
import { CitizenshipProcess } from "./citizenship-process";
import { CitizenshipProjects, type ProjectCard } from "./citizenship-projects";
import { CitizenshipSignature } from "./citizenship-signature";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import {
  programmeReview,
  programmes,
  sections,
  type GalleryShot,
  type Programme,
  type ProgrammeKey,
} from "@/app/lib/citizenship";
import { developments, type Development } from "@/app/lib/cms/developments";
import { getDictionary, getLocale, type Dictionary } from "@/app/lib/i18n";
import type { Locale } from "@/app/lib/i18n/config";
import { lookup, selectPlural } from "@/app/lib/i18n/format";
import { buildPath, type RouteId } from "@/app/lib/routes";
import { breadcrumbs, faqPage, routeUrl, service } from "@/app/lib/seo/jsonld";
import { watermarked } from "@/app/lib/watermark";

/** How many frames of one development the gallery strip carries. */
const SHOTS_PER_DEVELOPMENT = 3;

/**
 * The photography of a development: its card image, then whatever else was
 * uploaded with its units, without repeats.
 */
function photographs(development: Development): string[] {
  return [
    ...new Set([
      development.image,
      ...development.units.flatMap((unit) => [unit.image, ...unit.gallery]),
    ]),
  ].map(watermarked);
}

/**
 * What the page shows of the portfolio: the developments written into
 * `citizenship.ts` — the Caribbean resorts — followed by whatever the
 * dashboard has published in the programme's region.
 *
 * Read here, once, rather than in each section: the cards, the gallery strip
 * and the frames beside "who we are" are three views of the same inventory,
 * and a scheme published this morning should appear in all three or none.
 */
function portfolio(
  programme: Programme,
  published: Development[],
  locale: Locale,
  t: Dictionary,
) {
  const projects: ProjectCard[] = [
    ...programme.projects.map((project) => ({
      name: project.name,
      eyebrow: project.eyebrow,
      detail: lookup(t.menus.detail, project.detailKey),
      image: project.image,
      href: project.href,
    })),
    ...published.map((development) => ({
      name: development.name,
      // "TÜRKIYE / KARTAL" — both halves resolved through `dictionary.places`
      // when the site knows the name, and shown as written when it does not.
      eyebrow: [development.country, development.location],
      detail: selectPlural(
        locale,
        t.property.residencesCount,
        development.units.length,
      ),
      image: watermarked(development.image),
      href: buildPath("development", { slug: development.slug }),
    })),
  ];

  const shots: GalleryShot[] = [
    ...programme.gallery,
    ...published.flatMap((development) =>
      photographs(development)
        .slice(0, SHOTS_PER_DEVELOPMENT)
        .map((image) => ({ image, name: development.name })),
    ),
  ];

  // Three frames beside "who we are": the portfolio's own where it has that
  // many, and the programme's editorial frames making up the difference.
  const about = [
    ...new Set([
      ...published.flatMap(photographs),
      ...programme.images.about,
    ]),
  ].slice(0, 3);

  return { projects, shots, about };
}

/**
 * The full programme page: hero, benefits, gallery, qualifying developments,
 * process, FAQ and the enquiry form.
 *
 * Lifted out of the route it used to be, because the restructure moved these
 * pages from `/citizenship/[programme]` to the pillar path. It is the richest
 * page on the site, and leaving it behind at the old URL while the new one
 * showed a bare data table would have been the wrong way round.
 */
export async function CitizenshipProgrammeDetail({
  programmeKey: key,
  routeId,
}: {
  programmeKey: ProgrammeKey;
  routeId: RouteId;
}) {
  const programme = programmes[key];
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const copy = t.citizenship[key];
  const pageUrl = routeUrl(locale, routeId, { programme: key });

  const published = (await developments()).filter((development) =>
    development.country.includes(programme.region),
  );
  const { projects, shots, about } = portfolio(programme, published, locale, t);
  // A gallery with nothing in it is left out, rail entry and all.
  const rail = shots.length
    ? sections
    : sections.filter((id) => id !== "gallery");

  return (
    <>
      <JsonLd
        graph={[
          service({
            locale,
            slug: key,
            name: copy.hero.heading,
            description: copy.hero.body,
            areaServed: key === "turkiye" ? "TR" : "GD",
            review: programmeReview(programme),
          }),
          // The eight questions already on the page, restated for machines.
          faqPage(
            `${pageUrl}#faq`,
            programme.faq.map((id) => ({
              question: copy.faq.items[id].question,
              answer: copy.faq.items[id].answer,
            })),
          ),
          breadcrumbs({
            locale,
            id: routeId,
            values: { programme: key },
            labels: t.routes,
            leafLabel: copy.hero.heading,
          }),
        ]}
      />
      <div className="relative">
        <SiteNav />
        <CitizenshipHero programme={programme} />
      </div>

      <main className="flex-1">
        <CitizenshipAnchors ids={rail} />
        <CitizenshipIntro programme={programme} />
        {/* The site-wide recognition row, in the place the reference gives it. */}
        <Awards />
        <CitizenshipBenefits programme={programme} />
        {shots.length ? (
          <CitizenshipGallery programme={programme} shots={shots} />
        ) : null}
        <CitizenshipSignature programme={programme} />
        <CitizenshipProjects programme={programme} projects={projects} />
        <CitizenshipProcess programme={programme} />
        <CitizenshipIndustry programme={programme} />
        <CitizenshipAbout programme={programme} images={about} />
        <CitizenshipFaq programme={programme} />
        <CitizenshipEnquire programme={programme} />
        <CitizenshipCta programme={programme} />
      </main>

      <SiteFooter />
    </>
  );
}
