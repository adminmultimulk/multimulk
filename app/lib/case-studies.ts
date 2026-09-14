/**
 * Client outcomes, anonymised.
 *
 * These are the hardest thing on the site for a competitor or a language model
 * to reproduce, because they are the only content here that comes from having
 * actually done the work. That is also why the type forces the specifics: a
 * case study that says "we helped a client obtain citizenship" is a sentence,
 * not a case study.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * The four below are *representative* engagements — composed from the shape
 * of files the advisory team handles, with no individual client's details —
 * and they are published labelled as such (`representative: true`), on the
 * index and on every page. A real one needs written client consent before
 * publishing, even anonymised: nationality plus budget plus year plus city is
 * often enough to identify someone in a small market. When one arrives with
 * consent, it goes in with `consentOnFile: true` and the representative ones
 * can come out.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { DEFAULT_REVIEW_DAYS, type LegalReview } from "./review";
import type { AuthorId } from "./authors";
import type { CountryCode, Money } from "./programmes";

export type CaseStudy = {
  slug: string;
  /** The banner name — "A Pakistani Family in İstanbul". Never a client's. */
  title: string;
  /** The programme record it ran under. */
  programme: string;
  /** Which pillar, for the index filter. */
  category: "citizenship" | "residency";
  profile: {
    /** Where the client held citizenship. Never a name. */
    nationality: CountryCode | string;
    /** "Husband, wife, two children under 18" — a shape, not an identity. */
    family: string;
    /** What they were actually solving for, in their words where possible. */
    objective: string;
  };
  outcome: {
    year: number;
    investment: Money;
    /** Months from first conversation to passport or permit in hand. */
    timelineMonths: number;
    /** What the asset is doing now. */
    afterwards: string;
  };
  /** Why this development, and what was rejected on the way. */
  reasoning: string[];
  /** What went wrong or nearly did. A case study without one is a brochure. */
  complication: string;
  /**
   * The page's photography: the place the family bought into, the asset,
   * the passport, the paperwork — pictures of the engagement rather than of
   * a country. `collage` is the pair beside the outcome, `slides` the
   * full-bleed frames behind the reasoning, one per point where possible.
   */
  images: {
    hero: string;
    slides: string[];
    collage: [string, string];
    cta: string;
  };
  authorId: AuthorId;
  review: LegalReview;
  /** Whether the client has consented in writing. Gates publication. */
  consentOnFile: boolean;
  /**
   * A composed engagement rather than one client's, and said so on the page.
   * Also gates publication, since nobody's consent is needed for it.
   */
  representative?: boolean;
};

const review: LegalReview = {
  reviewedOn: "2026-09-02",
  reviewedBy: "advisory-team",
  sources: [],
  reviewEveryDays: DEFAULT_REVIEW_DAYS,
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pakistani-family-istanbul",
    title: "A Pakistani Family in İstanbul",
    programme: "turkiye",
    category: "citizenship",
    profile: {
      nationality: "pk",
      family: "Husband, wife, two children under 18",
      objective:
        "A second citizenship that did not require relocating, alongside an asset that would earn while it was held.",
    },
    outcome: {
      year: 2025,
      investment: { amount: 450_000, currency: "USD" },
      timelineMonths: 7,
      afterwards:
        "Let on a twelve-month tenancy since handover; the family visits twice a year.",
    },
    reasoning: [
      "The budget cleared the threshold with room to spare, which mattered more than it sounds: a valuation a few percent under USD 400,000 fails the application outright, and pricing to the threshold exactly leaves nothing for that.",
      "A two-bedroom in a completed building was chosen over a larger off-plan unit. Off-plan would have bought more space for the money, but delivery risk sits on the application as well as on the asset.",
      "Two smaller units were considered and rejected — two valuations, two sets of transfer costs, and two units competing with each other on resale in the same building.",
    ],
    complication:
      "One birth certificate was apostilled but not translated by a sworn translator, which was returned and cost about three weeks. It is the single commonest reason a file stalls, and it has nothing to do with money.",
    images: {
      // Multi Mulk's own İstanbul photography: the city from the air, a
      // terrace over it, the kind of apartment the file was about, and the
      // people around the table. Nothing here appears on the programme pages.
      hero: "/images/case-studies/istanbul-aerial-dusk.webp",
      slides: [
        "/images/case-studies/istanbul-terrace-city.webp",
        "/images/case-studies/istanbul-apartment-interior.webp",
        "/images/case-studies/advisers-reviewing-figures.webp",
      ],
      collage: [
        "/images/case-studies/istanbul-residence-terrace.webp",
        "/images/case-studies/couple-with-passports.webp",
      ],
      cta: "/images/case-studies/istanbul-tower-bosphorus.webp",
    },
    authorId: "advisory-team",
    review,
    consentOnFile: false,
    representative: true,
  },
  {
    slug: "gcc-resident-grenada",
    title: "A Gulf Resident in Grenada",
    programme: "grenada",
    category: "citizenship",
    profile: {
      nationality: "in",
      family: "Single applicant, parents added later",
      objective:
        "Visa-free travel breadth and eligibility for the United States E-2 treaty investor visa.",
    },
    outcome: {
      year: 2025,
      investment: { amount: 270_000, currency: "USD" },
      timelineMonths: 5,
      afterwards:
        "Held as a share in an approved resort development; E-2 application filed the following year.",
    },
    reasoning: [
      "Grenada rather than a cheaper island because it is the only Caribbean programme with a US E-2 treaty, and the E-2 was the actual objective — the passport was the means.",
      "The real estate route rather than the donation route, despite costing more, because the donation leaves nothing behind and the client wanted the capital to remain recoverable.",
    ],
    complication:
      "The parents were added after the main application was approved rather than alongside it, which cost more in fees than including them from the start would have.",
    images: {
      // Grand Anse and St. George's — Creative Commons photographs credited
      // on /legal/image-credits — with the treaty and the capital as the two
      // things the reasoning is about.
      hero: "/images/case-studies/grenada-grand-anse-aerial.webp",
      slides: [
        "/images/case-studies/grenada-grand-anse-palms.webp",
        "/images/case-studies/flags-at-the-table.webp",
      ],
      collage: [
        "/images/case-studies/grenada-grand-anse-beach.webp",
        "/images/case-studies/world-map-and-capital.webp",
      ],
      cta: "/images/case-studies/grenada-grand-anse-sunset.webp",
    },
    authorId: "advisory-team",
    review,
    consentOnFile: false,
    representative: true,
  },
  {
    slug: "uae-golden-residence",
    title: "A British Couple in Dubai",
    programme: "uae",
    category: "residency",
    profile: {
      nationality: "gb",
      family: "Couple, no dependants",
      objective:
        "A base in Dubai without an employer sponsor, and a tax position reviewed with their own advisers.",
    },
    outcome: {
      year: 2026,
      investment: { amount: 2_200_000, currency: "AED" },
      timelineMonths: 3,
      afterwards: "Owner-occupied for part of the year, short-let the remainder.",
    },
    reasoning: [
      "A ready property rather than off-plan, because the Golden Residence application needs a title deed and off-plan delays the permit as well as the handover.",
      "Priced above the AED 2,000,000 threshold deliberately, for the same reason the İstanbul case was: valuation movement should not be able to put the application under the line.",
    ],
    complication:
      "A mortgage on the property required a bank no-objection certificate that took longer to obtain than the permit itself.",
    images: {
      // Multi Mulk's UAE portfolio photography: the tower, a ready villa, the
      // couple planning it, and the coming and going the permit allows.
      hero: "/images/case-studies/dubai-tower.webp",
      slides: [
        "/images/case-studies/uae-villa.webp",
        "/images/case-studies/couple-planning-globe.webp",
      ],
      collage: [
        "/images/case-studies/dubai-towers-night.webp",
        "/images/case-studies/travellers-with-luggage.webp",
      ],
      cta: "/images/case-studies/uae-beach-towers.webp",
    },
    authorId: "advisory-team",
    review,
    consentOnFile: false,
    representative: true,
  },
  {
    slug: "egyptian-family-dominica",
    title: "An Egyptian Family in Dominica",
    programme: "dominica",
    category: "citizenship",
    profile: {
      nationality: "eg",
      family: "Husband, wife, three children under 18",
      objective:
        "The lowest-cost second passport that still left an asset behind, for a family with no plans to relocate.",
    },
    outcome: {
      year: 2025,
      investment: { amount: 200_000, currency: "USD" },
      timelineMonths: 6,
      afterwards:
        "Held as a share in an approved resort on the island’s north-west coast, let by the operator and earning while it is held.",
    },
    reasoning: [
      "Dominica’s real-estate route rather than a donation elsewhere: at the same outlay as a donation, the share is still the family’s when the holding period ends, and a donation is not.",
      "A share in a branded, government-approved resort rather than a standalone villa — the operator lets it, the family never manages anything on an island they do not live on, and an approved project has already been through the government’s own due diligence.",
      "All three children were included in the original application. Adding a dependant later costs more than including them from the start, which is the lesson another file taught us.",
    ],
    complication:
      "The source-of-funds file took longer to assemble than the application itself. A property sale in Cairo six years earlier had to be documented end to end, with bank statements the family no longer held and had to request. The paperwork, not the money, is what sets the timeline.",
    images: {
      // The Cabrits headland the resort stands under, the Nature Island, the
      // fort on the point — Creative Commons and CC0 photographs credited on
      // /legal/image-credits — and the family and the paperwork.
      hero: "/images/case-studies/dominica-cabrits.webp",
      slides: [
        "/images/case-studies/dominica-trafalgar-falls.webp",
        "/images/case-studies/dominica-soufriere-coast.webp",
        "/images/case-studies/family-at-the-agency.webp",
      ],
      collage: [
        "/images/case-studies/dominica-fort-shirley.webp",
        "/images/case-studies/paperwork-on-laptop.webp",
      ],
      cta: "/images/case-studies/dominica-cabrits.webp",
    },
    authorId: "advisory-team",
    review,
    consentOnFile: false,
    representative: true,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/**
 * Only studies with consent on file — or composed ones that need none — are
 * published.
 *
 * Enforced here rather than left to whoever adds the next one, because the
 * cost of getting this wrong falls on a client rather than on us.
 */
export function isPublished(study: CaseStudy): boolean {
  return study.consentOnFile || study.representative === true;
}

export const publishedCaseStudies = caseStudies.filter(isPublished);
