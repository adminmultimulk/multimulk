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

export type ProgrammeKey = "turkiye" | "caribbean";

export const programmeKeys: ProgrammeKey[] = ["turkiye", "caribbean"];

export function isProgrammeKey(value: string): value is ProgrammeKey {
  return (programmeKeys as string[]).includes(value);
}

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

/** A qualifying development. `href` is unset for the ones with no page yet. */
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
  /** The gallery strip between the benefits and the projects. */
  gallery: GalleryShot[];
  /** Figures only; their labels are keyed into `dictionary.citizenship`. */
  stats: { key: StatKey; value: string }[];
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
    images: {
      hero: [
        "/images/region-turkiye.avif",
        "/images/bosphorus-heights.webp",
        "/images/hero-beach-residences.webp",
        "/images/aegean-bay.webp",
      ],
      intro: "/images/levent-residences.webp",
      benefits: "/images/marmara-vista.webp",
      signature: "/images/antalya-coast.webp",
      cta: "/images/bosphorus-heights.webp",
      about: [
        "/images/levent-residences.webp",
        "/images/marmara-vista.webp",
        "/images/aegean-bay.webp",
      ],
    },
    gallery: [
      { image: "/images/bosphorus-heights.webp", name: "Bosphorus Heights" },
      { image: "/images/levent-residences.webp", name: "Levent Residences" },
      { image: "/images/marmara-vista.webp", name: "Marmara Vista" },
      { image: "/images/aegean-bay.webp", name: "Aegean Bay Residences" },
      { image: "/images/antalya-coast.webp", name: "Antalya Coast" },
      { image: "/images/anatolian-villas.webp", name: "Anatolian Villas" },
    ],
    stats: [
      { key: "investment", value: "$400K" },
      { key: "timeline", value: "3–6" },
      { key: "visaFree", value: "110+" },
      { key: "holding", value: "3" },
    ],
    benefits,
    steps,
    projects: [
      {
        name: "Bosphorus Heights",
        eyebrow: ["İstanbul", "Beyoğlu"],
        detailKey: "bosphorus-heights",
        image: "/images/bosphorus-heights.webp",
        href: "/properties/bosphorus-heights",
      },
      {
        name: "Levent Residences",
        eyebrow: ["İstanbul", "Şişli"],
        detailKey: "levent-residences",
        image: "/images/levent-residences.webp",
        href: "/properties/levent-residences",
      },
      {
        name: "Marmara Vista",
        eyebrow: ["İstanbul", "Beylikdüzü"],
        detailKey: "marmara-vista",
        image: "/images/marmara-vista.webp",
        href: "/properties/marmara-vista",
      },
      {
        name: "Aegean Bay Residences",
        eyebrow: ["Muğla", "Bodrum"],
        detailKey: "aegean-bay-residences",
        image: "/images/aegean-bay.webp",
        href: "/properties/aegean-bay-residences",
      },
      {
        name: "Antalya Coast",
        eyebrow: ["Antalya", "Konyaaltı"],
        detailKey: "antalya-coast",
        image: "/images/antalya-coast.webp",
      },
      {
        name: "Anatolian Villas",
        eyebrow: ["İstanbul", "Sarıyer"],
        detailKey: "anatolian-villas",
        image: "/images/anatolian-villas.webp",
      },
    ],
    faq,
    searchHref: "/search-property?currency=USD&location=T%C3%BCrkiye&cbi=1",
  },

  caribbean: {
    key: "caribbean",
    images: {
      hero: [
        "/images/caribbean-backdrop.webp",
        "/images/hero-six-senses.webp",
        "/images/cb-la-sagesse-residences.webp",
        "/images/caribbean-grenada.webp",
      ],
      intro: "/images/hero-la-sagesse.webp",
      benefits: "/images/region-caribbean.avif",
      signature: "/images/cb-ic-dominica.webp",
      cta: "/images/caribbean-grenada.webp",
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
      { key: "investment", value: "$200K" },
      { key: "timeline", value: "3–6" },
      { key: "visaFree", value: "140+" },
      { key: "holding", value: "5" },
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
    searchHref: "/search-property?currency=USD&location=Caribbean&cbi=1",
  },
};
