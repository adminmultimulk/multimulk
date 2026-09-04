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
import { CitizenshipProjects } from "./citizenship-projects";
import { CitizenshipSignature } from "./citizenship-signature";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import {
  programmeReview,
  programmes,
  type ProgrammeKey,
} from "@/app/lib/citizenship";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import type { RouteId } from "@/app/lib/routes";
import { breadcrumbs, faqPage, routeUrl, service } from "@/app/lib/seo/jsonld";

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
        <CitizenshipAnchors />
        <CitizenshipIntro programme={programme} />
        {/* The site-wide recognition row, in the place the reference gives it. */}
        <Awards />
        <CitizenshipBenefits programme={programme} />
        <CitizenshipGallery programme={programme} />
        <CitizenshipSignature programme={programme} />
        <CitizenshipProjects programme={programme} />
        <CitizenshipProcess programme={programme} />
        <CitizenshipIndustry programme={programme} />
        <CitizenshipAbout programme={programme} />
        <CitizenshipFaq programme={programme} />
        <CitizenshipEnquire programme={programme} />
        <CitizenshipCta programme={programme} />
      </main>

      <SiteFooter />
    </>
  );
}
