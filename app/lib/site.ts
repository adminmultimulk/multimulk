/**
 * The site's own origin.
 *
 * Everything canonical, every `hreflang` and every sitemap entry has to be an
 * absolute URL — Google ignores relative alternates — and none of them can ask
 * the request for its host, because `sitemap.ts` and `robots.ts` are built
 * without one. So the origin is configuration, not inference.
 */

/** Set this to override everything below; useful outside Vercel. */
const explicit = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * Vercel's own signals, which need no configuring.
 *
 * `VERCEL_ENV` is "production" only for a production deployment — a preview
 * build of the same branch reports "preview". Relying on that rather than on
 * someone remembering to set a variable per environment is the point: the
 * failure being guarded against is a preview deployment serving the whole
 * seven-language site to crawlers as a duplicate of the real one, and that
 * happens precisely when configuration was forgotten.
 */
const vercelEnv = process.env.VERCEL_ENV;
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelDeploymentHost = process.env.VERCEL_URL;

/** The canonical home of the site, wherever this build happens to run. */
export const productionOrigin = new URL(
  explicit ??
    (vercelProductionHost
      ? `https://${vercelProductionHost}`
      : "https://multimulk.com"),
);

function currentOrigin(): URL {
  if (explicit) return new URL(explicit);
  if (vercelEnv && vercelEnv !== "production" && vercelDeploymentHost) {
    return new URL(`https://${vercelDeploymentHost}`);
  }
  return productionOrigin;
}

export const siteUrl = currentOrigin();

/**
 * Whether this build may be indexed.
 *
 * False on every preview and branch deployment, which is what closes
 * `robots.txt` and keeps a second copy of the site out of the index. Off
 * Vercel, an explicit `NEXT_PUBLIC_SITE_URL` matching the production origin is
 * taken as production.
 */
export const isProductionHost =
  vercelEnv === "production" ||
  (!vercelEnv && siteUrl.href === productionOrigin.href);

/** `/en/about` -> `https://multimulk.com/en/about`. Absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
