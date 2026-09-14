/**
 * The shape of a resort page — hero, setting, highlights, gallery, directions
 * — kept as a page design. No Caribbean resort has a page any more; see the
 * note on `resorts` below.
 *
 * A resort is not a development in the `Project` sense: there is no unit
 * inventory behind it and nobody buys a floorplan. What is sold is a share in
 * a branded hotel that carries a citizenship application, so the page is
 * built around the resort itself — where it stands, what it offers, the press
 * it has had, how to reach it — and hands off to the programme page for the
 * investment terms.
 *
 * Held to the same discipline as the other leaf content modules: no import of
 * `routes.ts` or `content.ts`, because both of those import this file to
 * enumerate the pages and link to them.
 *
 * Long prose is English here and staged for translation under
 * `dictionary.resort.copy[slug]`; short UI labels live in `dictionary.resort`.
 * The resort names, the operator names and the addresses are never translated.
 */

/** One numbered point under a highlight group — "01 Wellness Rooted in Nature". */
export type ResortHighlight = {
  /** Rendered as an eyebrow over the heading — "Resort Highlights". */
  eyebrow?: string;
  heading: string;
  body: string;
  /**
   * The line illustration beside the numbered points. An SVG in `public/`,
   * drawn in a single colour so it can be tinted to the section.
   */
  illustration?: string;
  points: string[];
  /** Photographs of this aspect of the resort, shown as a carousel beside it. */
  images: string[];
};

/** A press mention. The logo is optional; the outlet name is the fallback. */
export type PressMention = {
  outlet: string;
  /** The headline as it ran, kept in its own capitalisation. */
  title: string;
  logo?: string;
  href?: string;
};

export type ResortStat = {
  value: string;
  label: string;
};

export type Resort = {
  slug: string;
  /** Key into `caribbeanResorts` in `content.ts` and the dictionaries — the resort's short id. */
  key: string;
  /** Never translated — the name a buyer searches for, in every language. */
  name: string;
  /** The island, as a `dictionary.places` token. */
  island: string;
  /** The nearest town, for the eyebrow and the map search. */
  town: string;
  /** The operator's mark, shown in the hero. */
  brandLogo?: string;
  brandName?: string;
  hero: {
    image: string;
    tagline: string;
    intro: string;
    /** Two or three of the resort's headline figures — rooms, sea views. */
    stats: ResortStat[];
  };
  about: {
    heading: string;
    paragraphs: string[];
    /** The line over the press mentions. */
    pressHeading: string;
    press: PressMention[];
    image: string;
  };
  setting: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    /** The panorama under the statement, full-bleed. */
    image: string;
  };
  highlights: ResortHighlight[];
  presence: {
    heading: string;
    body: string;
  };
  gallery: {
    exterior: string[];
    interior: string[];
    /** A YouTube or Vimeo embed URL, when there is a film. */
    video?: string;
  };
  location: {
    /** The postal address as written, one line. */
    address: string;
    /** What Google is asked for; the address is usually too specific to resolve. */
    mapQuery: string;
    lat: number;
    lng: number;
  };
  cbi: {
    heading: string;
    body: string;
    image: string;
    /** The programme this resort qualifies under; see `programmeSlugs`. */
    programme: "caribbean";
  };
  cta: {
    image: string;
    body: string;
  };
};

/**
 * The Caribbean pages were retired in September 2026: the six resorts are
 * still named on the programme page and the home page, but none has a page
 * of its own and nothing links to one. The types above and the components
 * under `app/components/resort/` are kept as the page design, to be given to
 * the Türkiye developments.
 */
export const resorts: Resort[] = [];

export function getResort(slug: string): Resort | undefined {
  return resorts.find((resort) => resort.slug === slug);
}

/** The page for a resort named elsewhere — the footer, the programme cards — if it has one. */
export function resortSlugFor(name: string): string | undefined {
  return resorts.find((resort) => resort.name === name)?.slug;
}

/**
 * Where each of the represented resorts stands, for the map on every resort
 * page.
 *
 * The map is drawn at a scale where a whole island is a thumbnail, so these
 * are placements rather than coordinates: three resorts on the same bay would
 * land on one pixel, and each is nudged along its coast far enough to be read.
 * A pin says "Grenada, south coast", not a street. `side` is which way the
 * label runs from the pin, so labels on neighbouring pins do not cross.
 */
export type CaribbeanPin = {
  name: string;
  /** A `dictionary.places` token. */
  island: string;
  lat: number;
  lng: number;
  side: "start" | "end";
};

export const caribbeanPins: CaribbeanPin[] = [
  {
    name: "Park Hyatt St. Kitts",
    island: "St. Kitts & Nevis",
    lat: 17.24,
    lng: -62.63,
    side: "end",
  },
  {
    name: "InterContinental Dominica Cabrits Resort & Spa",
    island: "Dominica",
    lat: 15.58,
    lng: -61.46,
    side: "start",
  },
  {
    name: "Port Cabrits Marina",
    island: "Dominica",
    lat: 15.5,
    lng: -61.45,
    side: "end",
  },
  {
    name: "The La Sagesse Collection Residences",
    island: "Grenada",
    lat: 12.12,
    lng: -61.61,
    side: "end",
  },
  {
    name: "InterContinental Grenada - La Sagesse",
    island: "Grenada",
    lat: 12.05,
    lng: -61.66,
    side: "start",
  },
  {
    name: "Six Senses La Sagesse",
    island: "Grenada",
    lat: 11.99,
    lng: -61.7,
    side: "end",
  },
];
