/**
 * Every number the site states about a programme, in one place.
 *
 * The site currently asserts "$400K", "3–6" and "110+" as bare strings split
 * across `content.ts` and the dictionaries, with the label "Months to
 * Passport" beside them. Read plainly, that is a promise about how long a
 * government will take — which nobody can make. The legacy site's own
 * programme pages say as much, disclaiming "eligibility, approval, processing
 * timelines, or outcomes" outright, while its articles quote hard numbers; the
 * two have been contradicting each other for some time.
 *
 * So a figure is not a string here. It is a value, a unit, a qualifier saying
 * what kind of claim it is, a source, and a review date. `<Figure>` renders
 * all of that together, which means the qualifier cannot be dropped in the
 * layout and the number cannot drift between two pages that quote it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EVERY ENTRY BELOW IS UNVERIFIED. The values are carried over from existing
 * placeholder content and from the legacy site's articles; the `source` URLs
 * are the official instruments they *should* be checked against, not proof
 * that they were. Nothing here may go public until Multi Mulk has confirmed
 * each figure against the instrument and set a real `reviewedBy`.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { DEFAULT_REVIEW_DAYS, type LegalReview } from "./review";

export type FigureUnit =
  | "usd"
  | "eur"
  | "aed"
  | "months"
  | "years"
  | "days"
  | "count"
  | "percent";

/**
 * What kind of claim a number is. This is the field that does the work.
 *
 * - `statutory`  — written in law. A threshold or a holding period.
 * - `estimated`  — observed, not promised. Processing times live here.
 * - `indicative` — a typical figure that varies by case. Fees, costs.
 * - `market`     — a market observation with no official source at all.
 */
export type Qualifier = "statutory" | "estimated" | "indicative" | "market";

export type Figure = {
  id: FigureId;
  value: number;
  /** Set for a range; renders as "3–6". */
  max?: number;
  unit: FigureUnit;
  /** Renders as "110+" — a floor rather than an exact count. */
  atLeast?: boolean;
  qualifier: Qualifier;
  review: LegalReview;
};

/** The reviewer to replace once Multi Mulk assigns real sign-off. */
const unreviewed = (
  sources: LegalReview["sources"],
  reviewedOn = "2026-09-02",
): LegalReview => ({
  reviewedOn,
  reviewedBy: "advisory-team",
  sources,
  reviewEveryDays: DEFAULT_REVIEW_DAYS,
});

const TR_CITIZENSHIP_REG = {
  label: "Türkiye Citizenship Regulation, Article 20",
  url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=201017463&MevzuatTur=21&MevzuatTertip=5",
  retrievedOn: "2026-09-02",
};

export const figures = {
  "tr.cbi.minimum-property": {
    id: "tr.cbi.minimum-property",
    value: 400_000,
    unit: "usd",
    qualifier: "statutory",
    review: unreviewed([TR_CITIZENSHIP_REG]),
  },
  "tr.cbi.holding-period": {
    id: "tr.cbi.holding-period",
    value: 3,
    unit: "years",
    qualifier: "statutory",
    review: unreviewed([TR_CITIZENSHIP_REG]),
  },
  /**
   * The figure the brief singled out. It was rendered as "3–6" under the label
   * "Months to Passport", which reads as a commitment; as an `estimated`
   * figure it renders with the qualifier attached and cannot lose it.
   */
  "tr.cbi.processing": {
    id: "tr.cbi.processing",
    value: 3,
    max: 6,
    unit: "months",
    qualifier: "estimated",
    review: unreviewed([TR_CITIZENSHIP_REG]),
  },
  "tr.cbi.visa-free": {
    id: "tr.cbi.visa-free",
    value: 110,
    unit: "count",
    atLeast: true,
    qualifier: "indicative",
    review: unreviewed([
      {
        label: "Henley Passport Index",
        url: "https://www.henleyglobal.com/passport-index",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  "tr.residency.minimum-property": {
    id: "tr.residency.minimum-property",
    value: 200_000,
    unit: "usd",
    qualifier: "statutory",
    review: unreviewed([TR_CITIZENSHIP_REG]),
  },
  "caribbean.cbi.minimum-property": {
    id: "caribbean.cbi.minimum-property",
    value: 200_000,
    unit: "usd",
    qualifier: "statutory",
    review: unreviewed([
      {
        label: "Programme legislation, per island",
        url: "https://www.multimulk.com/caribbean/citizenship-by-investment/",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  "caribbean.cbi.holding-period": {
    id: "caribbean.cbi.holding-period",
    value: 5,
    unit: "years",
    qualifier: "statutory",
    review: unreviewed([
      {
        label: "Programme legislation, per island",
        url: "https://www.multimulk.com/caribbean/citizenship-by-investment/",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  "caribbean.cbi.processing": {
    id: "caribbean.cbi.processing",
    value: 3,
    max: 6,
    unit: "months",
    qualifier: "estimated",
    review: unreviewed([
      {
        label: "Programme legislation, per island",
        url: "https://www.multimulk.com/caribbean/citizenship-by-investment/",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  "caribbean.cbi.visa-free": {
    id: "caribbean.cbi.visa-free",
    value: 140,
    unit: "count",
    atLeast: true,
    qualifier: "indicative",
    review: unreviewed([
      {
        label: "Henley Passport Index",
        url: "https://www.henleyglobal.com/passport-index",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  "uae.golden-visa.minimum-property": {
    id: "uae.golden-visa.minimum-property",
    value: 2_000_000,
    // Quoted in dirhams by the ICP, so quoted in dirhams here. Converting it
    // to dollars would be a figure no official source states.
    unit: "aed",
    qualifier: "statutory",
    review: unreviewed([
      {
        label: "ICP Golden Residence guidance",
        url: "https://icp.gov.ae/en/services/golden-residence/",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
  "uae.golden-visa.duration": {
    id: "uae.golden-visa.duration",
    value: 10,
    unit: "years",
    qualifier: "statutory",
    review: unreviewed([
      {
        label: "ICP Golden Residence guidance",
        url: "https://icp.gov.ae/en/services/golden-residence/",
        retrievedOn: "2026-09-02",
      },
    ]),
  },
} as const satisfies Record<string, Omit<Figure, "id"> & { id: string }>;

export type FigureId = keyof typeof figures;

export function getFigure(id: FigureId): Figure {
  return figures[id] as Figure;
}

export const figureIds = Object.keys(figures) as FigureId[];
