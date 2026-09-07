import type { MetadataRoute } from "next";
import { publishedLocales } from "./lib/i18n/config";
import { hreflangCluster } from "./lib/i18n";
import { buildPath, routes, allRoutePaths } from "./lib/routes";
import { cmsArticles } from "./lib/cms/articles";
import { developments } from "./lib/cms/developments";
import { cmsUnits } from "./lib/cms/properties";
import { absoluteUrl } from "./lib/site";

/**
 * Every page, in every published language.
 *
 * Note what this cannot do: `next/root-params` is unavailable in a Route
 * Handler, so nothing here may call `getLocale()` or `alternatesFor()`. The
 * locales are iterated explicitly and the cluster comes from the pure
 * `hreflangCluster`, which is why that function exists separately.
 *
 * Each locale gets its own entry carrying the *whole* cluster. That is the
 * part hand-written sitemaps usually get wrong: a set of alternates is only
 * valid if every URL in it points back at every other, itself included.
 *
 * `allRoutePaths()` enumerates what ships with the site. Articles published
 * from the dashboard are appended afterwards rather than folded into the route
 * registry, because that registry is synchronous and read by `next.config.ts`
 * and the proxy — both of which run where a database call cannot.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildDate = new Date().toISOString().slice(0, 10);
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, def, instance } of allRoutePaths()) {
    if (!def.sitemap.include) continue;
    if (instance?.indexable === false) continue;

    // Computed once and shared by the seven rows below it.
    const languages = hreflangCluster(path);

    for (const locale of publishedLocales) {
      entries.push({
        url: absoluteUrl(path === "/" ? `/${locale}` : `/${locale}${path}`),
        lastModified: instance?.lastModified ?? buildDate,
        changeFrequency: def.sitemap.changeFrequency,
        priority: instance?.priority ?? def.sitemap.priority,
        alternates: { languages },
      });
    }
  }

  for (const article of await cmsArticles()) {
    const path = buildPath("article", { slug: article.slug });
    const languages = hreflangCluster(path);

    for (const locale of publishedLocales) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: article.modified,
        changeFrequency: routes.article.sitemap.changeFrequency,
        priority: routes.article.sitemap.priority,
        alternates: { languages },
      });
    }
  }

  /*
   * The developments assembled from published listings, and the listings
   * themselves. Both answer under /properties/, and neither can come from the
   * route registry for the same reason the articles cannot: that registry is
   * synchronous and read where a database call is impossible.
   */
  const pages = [
    ...(await developments()).map((development) => development.slug),
    ...(await cmsUnits())
      .filter((listing) => !listing.noindex)
      .map((listing) => listing.slug),
  ];

  for (const slug of pages) {
    const path = buildPath("development", { slug });
    const languages = hreflangCluster(path);

    for (const locale of publishedLocales) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        lastModified: buildDate,
        changeFrequency: routes.development.sitemap.changeFrequency,
        priority: routes.development.sitemap.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
