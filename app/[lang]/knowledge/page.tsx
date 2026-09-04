import type { Metadata } from "next";
import { MediaArticles } from "@/app/components/media-articles";
import { MediaHero } from "@/app/components/media-hero";
import { MediaNewsletter } from "@/app/components/media-newsletter";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { alternatesFor, getDictionary, getLocale } from "@/app/lib/i18n";
import { mergedArticles } from "@/app/lib/cms/articles";
import { JsonLd } from "@/app/components/json-ld";
import { breadcrumbs, collectionPage, routeUrl } from "@/app/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { ...t.meta.media, alternates: await alternatesFor("/knowledge") };
}

export default async function MediaCentrePage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  // The archive plus whatever the dashboard has published, newest first.
  const articles = await mergedArticles();

  return (
    <>
      <JsonLd
        graph={[
          collectionPage({
            locale,
            id: "knowledge",
            name: t.meta.media.title,
            description: t.meta.media.description,
            itemUrls: articles.map((item) =>
              routeUrl(locale, "article", { slug: item.slug }),
            ),
          }),
          breadcrumbs({ locale, id: "knowledge", labels: t.routes }),
        ]}
      />
      <div className="relative">
        <SiteNav />
        <MediaHero />
      </div>

      <main className="flex-1">
        <MediaArticles articles={articles} />
        <MediaNewsletter />
      </main>

      <SiteFooter />
    </>
  );
}
