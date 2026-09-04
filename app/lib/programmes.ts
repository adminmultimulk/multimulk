/**
 * Every citizenship and residency programme Multi Mulk advises on, described
 * in the same fields so that any two can be set side by side.
 *
 * This is the data half of a programme. The page half — hero imagery, section
 * order, gallery — stays in `citizenship.ts`. Keeping them apart is what lets
 * a comparison table be *generated* from the facts rather than written by
 * hand: a table body that is authored will eventually say $400,000 on one page
 * and $250,000 on another, and nobody will notice which is wrong.
 *
 * Two rules make that work:
 *
 *  1. Comparable fields are structured, never pre-formatted strings. A table
 *     has to sort and compare on them, and `Money` sorts where "$400K" does
 *     not.
 *  2. A field that is not known is `"unknown"`, never absent. An omitted key
 *     silently becomes a blank cell that reads as "none"; an explicit unknown
 *     renders as "—" and shows up in the coverage report.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * `dataStatus` is the safety catch. Only a programme marked `reviewed` is
 * indexed or listed; a `pending` one renders for internal review and is kept
 * out of the sitemap and marked noindex, exactly as a `preview` locale is.
 *
 * The figures below are taken from Multi Mulk's own published articles, which
 * are cited per programme and are the most specific source the business has —
 * its legacy country pages state no figures at all. That is enough to publish
 * against, and every page shows the source and the date. It is not a
 * substitute for a named legal reviewer: `reviewedBy` is still the generic
 * advisory team, and `npm run check:review` reports that until a person is
 * named against each one.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { FigureId } from "./figures";
import { DEFAULT_REVIEW_DAYS, type LegalReview } from "./review";

/** ISO 3166-1 alpha-2, lowercased. Also the `/countries/<code>` slug. */
export type CountryCode =
  | "tr"
  | "gd"
  | "dm"
  | "kn"
  | "lc"
  | "ag"
  | "ae"
  | "pt"
  | "gr"
  | "mt";

export type Currency = "USD" | "EUR" | "AED" | "XCD";

export type Money = { amount: number; currency: Currency };

export type MonthRange = { min: number; max?: number };

/**
 * A fact we have not confirmed. Explicit, so a comparison cell can say so
 * rather than implying "no".
 */
export const UNKNOWN = "unknown" as const;
export type Unknown = typeof UNKNOWN;
export type Known<T> = T | Unknown;

export type InvestmentRoute = {
  key: "real-estate" | "donation" | "bonds" | "business" | "deposit" | "fund";
  minimum: Money;
  /** Years the investment must be held. 0 for a non-refundable donation. */
  holdingYears: number;
  /** Whether Multi Mulk actually transacts this route; filters the CTA. */
  offered: boolean;
  /** The registry entry, where one exists, so the page shows its source. */
  figure?: FigureId;
};

export type ProgrammeCategory = "citizenship" | "residency";

/** The programme's own state, as distinct from the state of our data on it. */
export type ProgrammeStatus = "open" | "suspended" | "closed" | "announced";

/** Whether our figures have been signed off. Gates indexing. */
export type DataStatus = "reviewed" | "pending";

export type Programme = {
  /** URL segment under its pillar, e.g. /citizenship-by-investment/turkiye. */
  slug: string;
  country: CountryCode;
  category: ProgrammeCategory;
  /** The programme's legal name. Never translated. */
  officialName: string;
  /** Year the programme opened. */
  since: Known<number>;
  status: ProgrammeStatus;
  dataStatus: DataStatus;

  // ── The comparable block ────────────────────────────────────────────────
  // Every field is required. A comparison row reads one of these from each
  // programme, so a missing key would silently drop a row for one column.
  routes: readonly InvestmentRoute[];
  processingMonths: Known<MonthRange>;
  visaFreeCount: Known<number>;
  /** Whether the passport reaches the Schengen Area without a visa. */
  schengenAccess: Known<boolean>;
  dualCitizenshipAllowed: Known<boolean>;
  /** Days a year that must be spent in country. `null` means none required. */
  residencyRequirementDays: Known<number | null>;
  physicalVisitRequired: Known<boolean>;
  languageTestRequired: Known<boolean>;
  includesSpouse: Known<boolean>;
  /** Oldest dependent child who can be included. `null` means no age limit. */
  dependentChildMaxAge: Known<number | null>;
  includesParents: Known<{ allowed: boolean; minAge?: number }>;
  /** For residency routes: years before citizenship can be sought. */
  citizenshipAfterYears: Known<number | null>;
  /** Whether the country taxes worldwide income of its tax residents. */
  taxOnWorldwideIncome: Known<boolean>;
  // ────────────────────────────────────────────────────────────────────────

  /** Slugs into `projects.ts` for the developments that qualify. */
  qualifyingProjects: readonly string[];
  /** Key into `dictionary.programmes.copy`, staged like all other prose. */
  copyKey: string;
  review: LegalReview;
};

const reviewed = (
  sources: LegalReview["sources"],
  reviewedOn = "2026-09-02",
): LegalReview => ({
  reviewedOn,
  reviewedBy: "advisory-team",
  sources,
  reviewEveryDays: DEFAULT_REVIEW_DAYS,
});

const CARIBBEAN_SOURCE = {
  label: "Multi Mulk — Which second-passport programme is right for you (2026)",
  url: "https://multimulk.com/looking-for-a-second-passport-which-program-is-right-for-you-in-2026/",
  retrievedOn: "2026-09-02",
};

const COMPARISON_SOURCE = {
  label: "Multi Mulk — Türkiye vs Malta vs Portugal, side by side (2026)",
  url: "https://multimulk.com/turkey-vs-malta-vs-portugal-citizenship-in-2026-a-side-by-side-for-serious-investors/",
  retrievedOn: "2026-09-02",
};

const usd = (amount: number): Money => ({ amount, currency: "USD" });
const eur = (amount: number): Money => ({ amount, currency: "EUR" });

const TR_SOURCE = {
  label: "Türkiye Citizenship Regulation, Article 20",
  url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=201017463&MevzuatTur=21&MevzuatTertip=5",
  retrievedOn: "2026-09-02",
};

const ICP_SOURCE = {
  label: "ICP Golden Residence guidance",
  url: "https://icp.gov.ae/en/services/golden-residence/",
  retrievedOn: "2026-09-02",
};

/**
 * A Caribbean programme, with the fields the five share.
 *
 * They differ in threshold and in the detail of family inclusion; everything
 * else below is common to the regional model. Written once so a change to the
 * shared shape cannot land on four of the five.
 */
function caribbean(
  slug: string,
  country: CountryCode,
  officialName: string,
  since: number,
  {
    realEstate,
    donation,
    processing,
    visaFree,
    stayDays = null,
  }: {
    realEstate: number;
    donation: number;
    processing: MonthRange;
    visaFree: number;
    /** Days that must be spent in country; `null` where none is required. */
    stayDays?: number | null;
  },
  overrides: Partial<Programme> = {},
): Programme {
  return {
    slug,
    country,
    category: "citizenship",
    officialName,
    since,
    status: "open",
    dataStatus: "reviewed",
    routes: [
      {
        key: "real-estate",
        minimum: usd(realEstate),
        holdingYears: 5,
        offered: true,
      },
      // Donation is the cheaper route and the one most applicants take, but it
      // leaves no asset behind, which is the opposite of what this practice
      // advises. Recorded because a comparison that omitted it would be
      // misleading; marked `offered: false` because we do not transact it.
      {
        key: "donation",
        minimum: usd(donation),
        holdingYears: 0,
        offered: false,
      },
    ],
    processingMonths: processing,
    visaFreeCount: visaFree,
    schengenAccess: true,
    dualCitizenshipAllowed: true,
    residencyRequirementDays: stayDays,
    physicalVisitRequired: stayDays !== null,
    languageTestRequired: false,
    includesSpouse: true,
    dependentChildMaxAge: 30,
    includesParents: { allowed: true, minAge: 55 },
    citizenshipAfterYears: null,
    taxOnWorldwideIncome: false,
    qualifyingProjects: [],
    copyKey: slug,
    review: reviewed([CARIBBEAN_SOURCE]),
    ...overrides,
  };
}

export const programmes: readonly Programme[] = [
  {
    slug: "turkiye",
    country: "tr",
    category: "citizenship",
    officialName: "Türkiye Citizenship by Investment",
    since: 2017,
    status: "open",
    dataStatus: "reviewed",
    routes: [
      {
        key: "real-estate",
        minimum: usd(400_000),
        holdingYears: 3,
        offered: true,
        figure: "tr.cbi.minimum-property",
      },
      {
        key: "deposit",
        minimum: usd(500_000),
        holdingYears: 3,
        offered: false,
      },
      { key: "bonds", minimum: usd(500_000), holdingYears: 3, offered: false },
      {
        key: "business",
        minimum: usd(500_000),
        holdingYears: 3,
        offered: false,
      },
    ],
    processingMonths: { min: 3, max: 6 },
    visaFreeCount: 110,
    // A Turkish passport does not carry visa-free Schengen entry. Stating this
    // plainly is the whole reason the field exists: it is the single most
    // common misunderstanding in enquiries about this programme.
    schengenAccess: false,
    dualCitizenshipAllowed: true,
    residencyRequirementDays: null,
    physicalVisitRequired: false,
    languageTestRequired: false,
    includesSpouse: true,
    dependentChildMaxAge: 18,
    includesParents: { allowed: false },
    citizenshipAfterYears: null,
    taxOnWorldwideIncome: true,
    qualifyingProjects: [
      "bosphorus-heights",
      "marmara-vista",
      "levent-residences",
      "aegean-bay-residences",
    ],
    copyKey: "turkiye",
    review: reviewed([TR_SOURCE, COMPARISON_SOURCE]),
  },
  {
    slug: "turkiye",
    country: "tr",
    category: "residency",
    officialName: "Türkiye Short-Term Residence Permit (property)",
    since: UNKNOWN,
    status: "open",
    dataStatus: "reviewed",
    routes: [
      {
        key: "real-estate",
        minimum: usd(200_000),
        holdingYears: 0,
        offered: true,
        figure: "tr.residency.minimum-property",
      },
    ],
    processingMonths: { min: 1, max: 3 },
    // A residence permit is not a passport; there is no visa-free count to
    // state, and putting one here would invite the comparison table to imply
    // otherwise.
    visaFreeCount: UNKNOWN,
    schengenAccess: false,
    dualCitizenshipAllowed: true,
    residencyRequirementDays: UNKNOWN,
    physicalVisitRequired: true,
    languageTestRequired: false,
    includesSpouse: true,
    dependentChildMaxAge: 18,
    includesParents: { allowed: false },
    citizenshipAfterYears: 5,
    taxOnWorldwideIncome: true,
    qualifyingProjects: [],
    copyKey: "turkiye-residency",
    review: reviewed([TR_SOURCE, COMPARISON_SOURCE]),
  },
  {
    slug: "uae",
    country: "ae",
    category: "residency",
    officialName: "UAE Golden Residence",
    since: 2019,
    status: "open",
    dataStatus: "reviewed",
    routes: [
      {
        key: "real-estate",
        minimum: { amount: 2_000_000, currency: "AED" },
        holdingYears: 0,
        offered: true,
        figure: "uae.golden-visa.minimum-property",
      },
    ],
    processingMonths: UNKNOWN,
    visaFreeCount: UNKNOWN,
    schengenAccess: false,
    // A residence permit, not a nationality — the question does not arise, and
    // saying "no" here would imply it did.
    dualCitizenshipAllowed: UNKNOWN,
    residencyRequirementDays: null,
    physicalVisitRequired: true,
    languageTestRequired: false,
    includesSpouse: true,
    dependentChildMaxAge: null,
    includesParents: { allowed: true },
    citizenshipAfterYears: null,
    taxOnWorldwideIncome: false,
    qualifyingProjects: [],
    copyKey: "uae-golden-visa",
    review: reviewed([ICP_SOURCE]),
  },
  caribbean("grenada", "gd", "Grenada Citizenship by Investment", 2013, {
    realEstate: 270_000,
    donation: 235_000,
    processing: { min: 4, max: 6 },
    visaFree: 140,
  }),
  caribbean("dominica", "dm", "Dominica Citizenship by Investment", 1993, {
    realEstate: 200_000,
    donation: 200_000,
    processing: { min: 4, max: 6 },
    visaFree: 140,
  }),
  caribbean(
    "st-kitts-and-nevis",
    "kn",
    "St Kitts and Nevis Citizenship by Investment",
    1984,
    {
      realEstate: 325_000,
      donation: 250_000,
      processing: { min: 6, max: 8 },
      visaFree: 155,
    },
  ),
  caribbean("st-lucia", "lc", "Saint Lucia Citizenship by Investment", 2015, {
    realEstate: 300_000,
    donation: 240_000,
    processing: { min: 6, max: 12 },
    visaFree: 147,
  }),
  caribbean(
    "antigua-and-barbuda",
    "ag",
    "Antigua and Barbuda Citizenship by Investment",
    2013,
    {
      realEstate: 300_000,
      donation: 230_000,
      processing: { min: 3, max: 6 },
      visaFree: 150,
      // The one Caribbean programme that asks for time in country: five days
      // within the first five years.
      stayDays: 5,
    },
  ),
  {
    slug: "portugal",
    country: "pt",
    category: "residency",
    officialName: "Portugal Golden Residence Permit",
    since: 2012,
    status: "open",
    dataStatus: "reviewed",
    // The property route was abolished in 2023; funds and donations are what
    // remain. Recording the closed route as absent rather than as a cheap
    // option is the difference between an honest comparison and a stale one.
    routes: [{ key: "fund", minimum: eur(250_000), holdingYears: 5, offered: false }],
    processingMonths: { min: 18, max: 36 },
    visaFreeCount: UNKNOWN,
    schengenAccess: true,
    dualCitizenshipAllowed: true,
    residencyRequirementDays: UNKNOWN,
    physicalVisitRequired: true,
    languageTestRequired: true,
    includesSpouse: true,
    dependentChildMaxAge: UNKNOWN,
    includesParents: UNKNOWN,
    // Ten years under the 2026 law, up from five.
    citizenshipAfterYears: 10,
    taxOnWorldwideIncome: true,
    qualifyingProjects: [],
    copyKey: "portugal-golden-visa",
    review: reviewed([
      {
        label: "AIMA residence permit for investment",
        url: "https://aima.gov.pt/",
        retrievedOn: "2026-09-02",
      },
      COMPARISON_SOURCE,
    ]),
  },
  {
    slug: "greece",
    country: "gr",
    category: "residency",
    officialName: "Greece Golden Visa",
    since: 2013,
    status: "open",
    dataStatus: "reviewed",
    routes: [
      { key: "real-estate", minimum: eur(250_000), holdingYears: 5, offered: false },
    ],
    processingMonths: { min: 2, max: 6 },
    visaFreeCount: UNKNOWN,
    schengenAccess: true,
    dualCitizenshipAllowed: true,
    residencyRequirementDays: null,
    physicalVisitRequired: true,
    languageTestRequired: true,
    includesSpouse: true,
    dependentChildMaxAge: 21,
    includesParents: { allowed: true },
    citizenshipAfterYears: 7,
    taxOnWorldwideIncome: true,
    qualifyingProjects: [],
    copyKey: "greece-golden-visa",
    review: reviewed([
      {
        label: "Enterprise Greece — Golden Visa",
        url: "https://www.enterprisegreece.gov.gr/",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  {
    slug: "malta",
    country: "mt",
    category: "citizenship",
    officialName: "Malta Citizenship by Naturalisation for Exceptional Services",
    since: 2014,
    // Listed as suspended rather than omitted: readers ask about Malta
    // constantly, and "we do not mention it" is not an answer to "is it open?"
    status: "suspended",
    dataStatus: "reviewed",
    routes: [
      { key: "donation", minimum: eur(600_000), holdingYears: 0, offered: false },
      { key: "real-estate", minimum: eur(375_000), holdingYears: 5, offered: false },
    ],
    processingMonths: { min: 12, max: 36 },
    visaFreeCount: UNKNOWN,
    schengenAccess: true,
    dualCitizenshipAllowed: true,
    // Twelve to thirty-six months of residency before the merit review.
    residencyRequirementDays: 365,
    physicalVisitRequired: true,
    languageTestRequired: false,
    includesSpouse: true,
    dependentChildMaxAge: 29,
    includesParents: { allowed: true, minAge: 55 },
    citizenshipAfterYears: null,
    taxOnWorldwideIncome: true,
    qualifyingProjects: [],
    copyKey: "malta",
    review: reviewed([COMPARISON_SOURCE]),
  },
];

/** A programme is addressed by its pillar and slug; the pair is unique. */
export function getProgramme(
  category: ProgrammeCategory,
  slug: string,
): Programme | undefined {
  return programmes.find((p) => p.category === category && p.slug === slug);
}

export function programmesIn(category: ProgrammeCategory): readonly Programme[] {
  return programmes.filter((p) => p.category === category);
}

/** Only signed-off programmes are indexed or listed publicly. */
export function isPublishable(programme: Programme): boolean {
  return programme.dataStatus === "reviewed" && programme.status !== "closed";
}

/** The cheapest route Multi Mulk actually transacts. */
export function cheapestOfferedRoute(
  programme: Programme,
): InvestmentRoute | undefined {
  return [...programme.routes]
    .filter((route) => route.offered)
    .sort((a, b) => a.minimum.amount - b.minimum.amount)[0];
}
