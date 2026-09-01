/**
 * Google Analytics 4.
 *
 * The "Multi Mulk" property, whose web stream is registered to
 * https://multimulk.com/. It is a fresh property, so its reports cover this
 * site only and are not mixed with the PHP site this one replaces.
 *
 * That older site reports to a separate property, `G-LGSZXW6R4B`, reached
 * through the Google tag `GT-PJRRXFW2`; its Google Ads tag `AW-18069897933`
 * sits in the GTM container `GTM-TVKT5RV2`. None of those are loaded here, so
 * anything still needed from them — Ads conversions in particular — has to be
 * carried over separately rather than arriving with this tag.
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
