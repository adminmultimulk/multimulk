import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionHost, siteUrl } from "./lib/site";

/**
 * Sits outside `[lang]` on purpose: it is a metadata Route Handler, it needs
 * no layout, and `proxy.ts` already excludes `robots.txt` from locale
 * prefixing.
 */
export default function robots(): MetadataRoute.Robots {
  // Preview and branch deployments serve the entire seven-language site on a
  // second hostname. Left crawlable, that is a duplicate of every page we
  // have, so anything that is not the production host is closed outright.
  if (!isProductionHost) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Faceted search is effectively unbounded and every combination is
        // thin. The bare page stays indexable; see the `robots` block in
        // `app/[lang]/search-property/page.tsx`, which is what actually keeps
        // the filtered variants out — a disallowed URL can still be indexed
        // from a link, a `noindex` one cannot.
        //
        // The dashboard is closed here as well as by the `noindex` on its own
        // layout, because there is nothing behind it a crawler should spend a
        // request on either way.
        disallow: ["/*/search-property?*", "/admin", "/admin/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl.hostname,
  };
}
