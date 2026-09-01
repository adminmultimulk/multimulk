/**
 * Google Analytics 4.
 *
 * The measurement ID is a public identifier — gtag.js carries it in the page
 * source on every request — so it sits in the repo rather than in an env var,
 * which this project does not otherwise use. `NEXT_PUBLIC_GA_ID` overrides it
 * if a second property is ever needed for staging.
 */
export const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-3S661QGTBG";

/**
 * Development page views would land in the same reports as real traffic, with
 * a `localhost` hostname and no meaningful referrer, so the tag is only
 * rendered in production builds. To exercise it locally, run `npm run build`
 * followed by `npm run start`.
 */
export const analyticsEnabled =
  process.env.NODE_ENV === "production" && Boolean(gaId);
