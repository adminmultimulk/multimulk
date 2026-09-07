import type { NextConfig } from "next";
import { legacyRedirects } from "./app/lib/legacy-redirects";

/** The language the legacy site was written in; see `legacy-redirects.ts`. */
const LEGACY_LOCALE = "en";

const nextConfig: NextConfig = {
  images: {
    /*
     * Photography uploaded through the dashboard lives on Cloudinary; the
     * imagery that ships with the site is under `public/`. Nothing else is
     * allow-listed on purpose — `next/image` refuses a host it has not been
     * told about, and a listing pointing anywhere else is rendered as a plain
     * tag instead. See `app/components/listing-image.tsx`.
     */
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },

  async redirects() {
    return [
      ...legacyRedirects.map(({ from, to }) => ({
        source: from,
        destination: `/${LEGACY_LOCALE}${to}`,
        permanent: true,
      })),

      /*
       * The Media Centre became the Knowledge Centre.
       *
       * Pattern rules rather than a listed path, because these have to catch
       * the locale-prefixed forms too: the rename happened after the site was
       * already being browsed, so `/en/media-centre/<slug>` is a link people
       * hold, not just an unprefixed legacy URL.
       */
      {
        source: "/:lang(en|ar|ru|fr|ur|tr|zh)/media-centre/:slug*",
        destination: "/:lang/knowledge/:slug*",
        permanent: true,
      },
      {
        source: "/media-centre/:slug+",
        destination: `/${LEGACY_LOCALE}/knowledge/:slug+`,
        permanent: true,
      },
    ];
  },

  // The retired legacy paths are answered 410 by `proxy.ts`, which runs before
  // rewrites and would otherwise give each of them a locale prefix.
};

export default nextConfig;
