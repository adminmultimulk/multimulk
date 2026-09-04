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
 * PLACEHOLDER. The three below are illustrative structures, not real
 * engagements — they carry no client's details because Multi Mulk has not
 * supplied any. Real ones need written client consent before publishing,
 * even anonymised: nationality plus budget plus year plus city is often
 * enough to identify someone in a small market.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { DEFAULT_REVIEW_DAYS, type LegalReview } from "./review";
import type { AuthorId } from "./authors";
import type { CountryCode, Money } from "./programmes";

export type CaseStudy = {
  slug: string;
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
  image?: string;
  authorId: AuthorId;
  review: LegalReview;
  /** Whether the client has consented in writing. Gates publication. */
  consentOnFile: boolean;
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
    authorId: "advisory-team",
    review,
    consentOnFile: false,
  },
  {
    slug: "gcc-resident-grenada",
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
    authorId: "advisory-team",
    review,
    consentOnFile: false,
  },
  {
    slug: "uae-golden-residence",
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
    authorId: "advisory-team",
    review,
    consentOnFile: false,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/**
 * Only studies with consent on file are published.
 *
 * Enforced here rather than left to whoever adds the next one, because the
 * cost of getting this wrong falls on a client rather than on us.
 */
export const publishedCaseStudies = caseStudies.filter(
  (study) => study.consentOnFile,
);
