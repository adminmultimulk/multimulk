import { JsonLd } from "./json-ld";
import { MediaArticles } from "./media-articles";
import { MediaNewsletter } from "./media-newsletter";
import { PageHero } from "./page-hero";
import { SiteFooter } from "./site-footer";
import { mergedArticles } from "@/app/lib/cms/articles";
import { getDictionary, getLocale } from "@/app/lib/i18n";
import { inSection, sectionRoute, type SectionId } from "@/app/lib/sections";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

/**
 * One of the three News & Insights sections beneath /knowledge —
 * Publications, Market Insights or Events.
 *
 * All three are the same page over a different slice of one corpus, so they
 * share this and differ only in the `section` their route passes down. The
 * Articles section is not built from here: /knowledge opens on the featured
 * rotation rather than a banner, and that difference is the whole reason it is
 * still its own file.
 *
 * `PageHero` carries the heading and the standfirst, so the index below it is
 * asked for the grid alone.
 */
export async function InsightsSection({ section }: { section: SectionId }) {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const id = sectionRoute[section];
  const copy = t.insights.sections[section];
  const articles = inSection(await mergedArticles(), section);

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id,
            name: copy.heading,
            description: copy.body,
            itemUrls: articles.map((item) =>
              routeUrl(locale, "article", { slug: item.slug }),
            ),
          }),
          breadcrumbs({ locale, id, labels: t.routes }),
        ]}
      />

      <PageHero
        eyebrow={t.insights.menuHeading}
        heading={copy.heading}
        body={copy.body}
      />

      <main className="flex-1">
        <MediaArticles
          articles={articles}
          section={section}
          showHeading={false}
        />
        <MediaNewsletter />
      </main>

      <SiteFooter />
    </>
  );
}
