/**
 * Google Analytics 4.
 *
 * The "Multi Mulk" property, whose web stream is registered to
 * https://multimulk.com/. It is a fresh property, so its reports cover this
 * site only and are not mixed with the PHP site this one replaces.
 *
 * That older site reports to a separate property, `G-LGSZXW6R4B`, reached
 * through the Google tag `GT-PJRRXFW2`, in the GTM container `GTM-TVKT5RV2`.
 * Neither is loaded here. The Google Ads account that container also carried
 * is configured directly instead; see `adsId` below.
 *
 * The measurement ID is a public identifier — gtag.js carries it in the page
 * source on every request — so it sits in the repo rather than in an env var,
 * which this project does not otherwise use. `NEXT_PUBLIC_GA_ID` overrides it
 * if a second property is ever needed for staging.
 */
export const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-3S661QGTBG";

/**
 * Google Ads, configured on the same gtag.js load as GA4 so a click from an ad
 * is attributed wherever on the site the visitor goes next.
 */
export const adsId = "AW-18069897933";

/**
 * Conversion labels, from Google Ads → Goals → Conversions → the action →
 * Tag setup → "Use Google tag" — the part after the slash in
 * `send_to: 'AW-18069897933/<label>'`.
 *
 * Empty means "not created yet": the conversion is skipped, and the GA4
 * `generate_lead` event that fires beside it can be imported into Ads as the
 * conversion in the meantime.
 */
export const adsConversions = {
  /** A registration for the November 2026 Pakistan roadshow. */
  roadshowRegistration: "",
} as const;

export type AdsConversion = keyof typeof adsConversions;

/**
 * Development page views would land in the same reports as real traffic, with
 * a `localhost` hostname and no meaningful referrer, so the tag is only
 * rendered in production builds. To exercise it locally, run `npm run build`
 * followed by `npm run start`.
 */
export const analyticsEnabled =
  process.env.NODE_ENV === "production" && Boolean(gaId);

/**
 * A typed wrapper over GA4 events.
 *
 * Only page views were being collected, so nothing downstream of a visit — an
 * enquiry, a WhatsApp tap, a language change — was measurable. The event names
 * below are the site's whole vocabulary; adding one means adding it here, so
 * the reports never fill up with near-duplicate spellings of the same action.
 */
export type AnalyticsEvent =
  /** GA4 reserves this name for lead generation; keep it. */
  | "generate_lead"
  | "form_start"
  | "form_error"
  /** A brochure requested by email, which is a lead of its own kind. */
  | "brochure_request"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "language_switch"
  | "search_filter_applied"
  | "programme_enquiry";

/**
 * Fires an event, if the tag is loaded. Safe to call from anywhere on the
 * client: outside production `gtag` is absent and this is a no-op, so callers
 * never need to guard.
 */
export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (!gtag) return;
  gtag("event", name, params ?? {});
}

/**
 * Reports a Google Ads conversion, if the tag is loaded and the action has a
 * label. Same no-op rules as `trackEvent`.
 */
export function trackAdsConversion(
  name: AdsConversion,
  params?: Record<string, string | number>,
): void {
  const label = adsConversions[name];
  if (typeof window === "undefined" || !label) return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (!gtag) return;
  gtag("event", "conversion", { send_to: `${adsId}/${label}`, ...params });
}
