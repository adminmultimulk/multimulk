/**
 * Structure and asset references for /citizenship/[programme]. Copy lives in
 * `app/lib/i18n/dictionaries` under `citizenship`, reached through the keys
 * here — same split as `content.ts` and `about.ts`.
 *
 * Both programmes deliberately use the same item keys for their stats,
 * benefits, steps and questions. That is what lets one set of components and
 * one dictionary shape serve both pages; a key that only makes sense for one
 * country belongs in that country's prose, not in a new key.
 *
 * NOTE: every figure below — thresholds, holding periods, processing times,
 * visa-free counts — is a placeholder in the same sense as the rest of the site
 * (see the note at the top of content.ts). These are legal and financial claims
 * and must be confirmed against the current programme legislation, and signed
 * off by Multi Mulk, before this page goes anywhere public.
 */

import { getFigure, type FigureId } from "./figures";
import type { LegalReview, ReviewSource } from "./review";
import {
  isProgrammeSlug,
  programmeSlugs,
  searchPath,
  type ProgrammeSlug,
} from "./routes";

/**
 * Which programmes exist is a routing fact, so the list lives in `routes.ts`
 * and is re-exported here under the names this module's readers already use.
 */
export type ProgrammeKey = ProgrammeSlug;

export const programmeKeys: readonly ProgrammeKey[] = programmeSlugs;

export const isProgrammeKey = isProgrammeSlug;

/** The four headline figures, in the order they are read across the row. */
export type StatKey = "investment" | "timeline" | "visaFree" | "holding";

/** The four reasons the programme is worth taking, as numbered cards. */
export type BenefitKey = "citizenship" | "mobility" | "assets" | "process";

/** The route from first conversation to passport in hand. */
export type StepKey =
  | "consultation"
  | "selection"
  | "purchase"
  | "application"
  | "passport";

export type FaqKey =
  | "what"
  | "options"
  | "timeline"
  | "family"
  | "residency"
  | "benefits"
  | "dueDiligence"
  | "resale";

/** The sections the anchor rail jumps between; also their DOM ids. */
export const sections = [
  "introduction",
  "benefits",
  "gallery",
  "projects",
  "process",
  "industry",
  "about",
  "faq",
] as const;

export type SectionId = (typeof sections)[number];

/**
 * A qualifying development written into this file — a Caribbean resort.
 * `href` is unset where there is no page behind the card, which is every one
 * of them now, and the card then renders as a card rather than as a link to
 * nowhere.
 *
 * The Türkiye developments are not written here at all: they are whatever the
 * dashboard has published, read at request time by the programme page, so a
 * listing entered this morning is on the page by lunch and a scheme that has
 * sold out is not on it at all.
 */
export type ProgrammeProject = {
  /** A development or resort name — rendered as written, in every language. */
  name: string;
  /** Place-name tokens, looked up in `dictionary.places` and joined. */
  eyebrow: string[];
  /** Key into `dictionary.menus.detail` for the unit count under the name. */
  detailKey: string;
  image: string;
  href?: string;
};

/** One frame of the hero carousel. `name` is a development, never translated. */
export type GalleryShot = {
  image: string;
  name: string;
};

export type Programme = {
  key: ProgrammeKey;
  /**
   * Which published developments belong on this page, matched against the
   * country a lister typed on the listing — the same test the footer and the
   * home page apply.
   */
  region: "Türkiye" | "Caribbean";
  images: {
    /** The hero rotates through these; the first is the LCP image. */
    hero: string[];
    intro: string;
    benefits: string;
    signature: string;
    cta: string;
    /** Three developments shown beside the "who we are" block. */
    about: string[];
  };
  /**
   * The gallery strip between the benefits and the projects. The published
   * developments' photography follows whatever is written here; Türkiye
   * writes nothing and shows the portfolio alone.
   */
  gallery: GalleryShot[];
  /**
   * The four headline figures. Each names an entry in `app/lib/figures.ts`
   * rather than carrying a value, so the number, its source, its review date
   * and the qualifier that has to be shown beside it all travel together.
   */
  stats: { key: StatKey; figure: FigureId }[];
  benefits: { key: BenefitKey; number: string }[];
  steps: { key: StepKey; number: string }[];
  projects: ProgrammeProject[];
  faq: FaqKey[];
  /** Pre-filtered search, so the CTA lands on qualifying stock only. */
  searchHref: string;
};

const benefits: Programme["benefits"] = [
  { key: "citizenship", number: "01" },
  { key: "mobility", number: "02" },
  { key: "assets", number: "03" },
  { key: "process", number: "04" },
];

const steps: Programme["steps"] = [
  { key: "consultation", number: "01" },
  { key: "selection", number: "02" },
  { key: "purchase", number: "03" },
  { key: "application", number: "04" },
  { key: "passport", number: "05" },
];

const faq: FaqKey[] = [
  "what",
  "options",
  "timeline",
  "family",
  "residency",
  "benefits",
  "dueDiligence",
  "resale",
];

/**
 * The investment-migration industry, as a timeline of programme launches.
 *
 * Shared by both pages rather than split per programme: it is the industry's
 * history, and the point of showing it is that this particular programme sits
 * inside a forty-year-old market. `programmes` marks the entries a given page
 * highlights — its own country's — and every other entry renders as context.
 *
 * `place` is a token looked up in `dictionary.places`; the years are digits and
 * read the same everywhere.
 */
export type IndustryEntry = {
  year: string;
  place: string;
  programmes: ProgrammeKey[];
};

export const industryTimeline: IndustryEntry[] = [
  { year: "1984", place: "St. Kitts & Nevis", programmes: ["caribbean"] },
  { year: "1993", place: "Dominica", programmes: ["caribbean"] },
  { year: "2013", place: "Antigua & Barbuda", programmes: ["caribbean"] },
  { year: "2013", place: "Grenada", programmes: ["caribbean"] },
  { year: "2015", place: "St. Lucia", programmes: ["caribbean"] },
  { year: "2017", place: "Türkiye", programmes: ["turkiye"] },
];

/**
 * The two headline figures on the industry section. Placeholders in the same
 * sense as every other number in this file — an industry estimate that has to
 * be sourced and dated before it is published as a claim.
 */
export const industryMarket = {
  size: "$21.4B",
  growth: "23%",
};

export const programmes: Record<ProgrammeKey, Programme> = {
  turkiye: {
    key: "turkiye",
    region: "Türkiye",
    images: {
      // Editorial slots carry the programme, not the portfolio: the passport,
      // the city, the paperwork. Development photography stays on the
      // development cards further down the page, where it belongs.
      // The hero frames carry white type, so they are the dark ones. The
      // brighter passport and document shots sit further down, in sections
      // that set their own ground.
      hero: [
        "/images/cbi/hero-istanbul-dusk.jpg",
        "/images/cbi/hero-istanbul.jpg",
        "/images/cbi/cbi-documents.jpg",
      ],
      intro: "/images/cbi/cbi-istanbul-strait.jpg",
      // Behind the principles-style cards, so a place rather than the
      // passport close-up that only worked under an 88% wash.
      benefits: "/images/cbi/hero-istanbul.jpg",
      signature: "/images/cbi/cbi-documents.jpg",
      cta: "/images/cbi/hero-istanbul-dusk.jpg",
      // The city, until the published developments supply their own: the
      // page swaps these for the portfolio's photography where it has any.
      // The renders that used to sit here were of developments that do not
      // exist, which is a worse thing to show beside "who we are" than a
      // skyline.
      about: [
        "/images/cbi/hero-istanbul.jpg",
        "/images/cbi/cbi-istanbul-strait.jpg",
        "/images/cbi/hero-istanbul-dusk.jpg",
      ],
    },
    // Filled from the published developments; see `region`.
    gallery: [],
    stats: [
      { key: "investment", figure: "tr.cbi.minimum-property" },
      { key: "timeline", figure: "tr.cbi.processing" },
      { key: "visaFree", figure: "tr.cbi.visa-free" },
      { key: "holding", figure: "tr.cbi.holding-period" },
    ],
    benefits,
    steps,
    // Filled from the published developments; see `region`.
    projects: [],
    faq,
    searchHref: searchPath({ currency: "USD", location: "Türkiye", cbiOnly: true }),
  },

  caribbean: {
    key: "caribbean",
    region: "Caribbean",
    images: {
      // As with Türkiye: the editorial slots carry the programme. The gallery
      // below still shows the approved developments, which is where showing
      // buildings is the point.
      hero: [
        "/images/cbi/hero-st-lucia-soufriere.jpg",
        "/images/cbi/hero-caribbean.jpg",
        "/images/cbi/cbi-island.jpg",
        "/images/cbi/cbi-documents.jpg",
      ],
      intro: "/images/cbi/cbi-caribbean-aerial.jpg",
      // Same slot as Türkiye: a place behind the cards, not the passport.
      benefits: "/images/cbi/hero-caribbean.jpg",
      signature: "/images/cbi/hero-caribbean.jpg",
      cta: "/images/cbi/hero-island-dusk.jpg",
      about: [
        "/images/cb-la-sagesse-residences.webp",
        "/images/caribbean-grenada.webp",
        "/images/hero-six-senses.webp",
      ],
    },
    gallery: [
      { image: "/images/hero-six-senses.webp", name: "Six Senses La Sagesse" },
      {
        image: "/images/cb-la-sagesse-residences.webp",
        name: "The La Sagesse Collection Residences",
      },
      {
        image: "/images/caribbean-grenada.webp",
        name: "InterContinental Grenada - La Sagesse",
      },
      {
        image: "/images/cb-ic-dominica.webp",
        name: "InterContinental Dominica Cabrits Resort & Spa",
      },
      { image: "/images/cb-park-hyatt.webp", name: "Park Hyatt St. Kitts" },
      { image: "/images/article-six-senses.avif", name: "Six Senses La Sagesse" },
    ],
    stats: [
      { key: "investment", figure: "caribbean.cbi.minimum-property" },
      { key: "timeline", figure: "caribbean.cbi.processing" },
      { key: "visaFree", figure: "caribbean.cbi.visa-free" },
      { key: "holding", figure: "caribbean.cbi.holding-period" },
    ],
    benefits,
    steps,
    projects: [
      {
        name: "The La Sagesse Collection Residences",
        eyebrow: ["Grenada", "La Sagesse Bay"],
        detailKey: "la-sagesse-collection",
        image: "/images/cb-la-sagesse-residences.webp",
      },
      {
        name: "InterContinental Grenada - La Sagesse",
        eyebrow: ["Grenada", "La Sagesse Bay"],
        detailKey: "intercontinental-grenada",
        image: "/images/caribbean-grenada.webp",
      },
      {
        name: "Six Senses La Sagesse",
        eyebrow: ["Grenada", "La Sagesse Bay"],
        detailKey: "six-senses-la-sagesse",
        image: "/images/hero-six-senses.webp",
      },
      {
        name: "InterContinental Dominica Cabrits Resort & Spa",
        eyebrow: ["Dominica", "Cabrits National Park"],
        detailKey: "intercontinental-dominica",
        image: "/images/cb-ic-dominica.webp",
      },
      {
        name: "Port Cabrits Marina",
        eyebrow: ["Dominica", "Portsmouth"],
        detailKey: "port-cabrits-marina",
        image: "/images/cb-port-cabrits.png",
      },
      {
        name: "Park Hyatt St. Kitts",
        eyebrow: ["St. Kitts & Nevis", "Christophe Harbour"],
        detailKey: "park-hyatt-st-kitts",
        image: "/images/cb-park-hyatt.webp",
      },
    ],
    faq,
    // The qualifying developments are the resort shares above, not units in
    // the search — which answers "Caribbean" with nothing — so "browse" lands
    // on them. The projects section drops its own button for that reason.
    searchHref: "#projects",
  },
};

/**
 * The review covering a programme page.
 *
 * A page states several figures, each with its own review date; the page is
 * only as current as the oldest of them, so that is the one shown. The sources
 * are the union of theirs, deduplicated by URL.
 */
export function programmeReview(programme: Programme): LegalReview {
  const reviews = programme.stats.map((stat) => getFigure(stat.figure).review);
  const oldest = reviews.reduce((a, b) =>
    a.reviewedOn <= b.reviewedOn ? a : b,
  );

  const sources = new Map<string, ReviewSource>();
  for (const review of reviews) {
    for (const source of review.sources) sources.set(source.url, source);
  }

  return { ...oldest, sources: [...sources.values()] };
}
