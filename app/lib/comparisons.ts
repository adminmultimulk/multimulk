/**
 * Programme comparisons.
 *
 * The table body is *computed* from `programmes.ts`, not written. Only the
 * introduction and the verdict are prose. Two consequences, both the point:
 * adding a comparable field once shows up on every comparison page in every
 * language, and it is structurally impossible for one page to quote a
 * threshold the next page contradicts.
 *
 * Cells are numbers, booleans and money — never translated strings — so a
 * ten-row table costs nothing to render in a seventh language. Only the row
 * labels are translated, and there are ten of them.
 */

import {
  cheapestOfferedRoute,
  getProgramme,
  UNKNOWN,
  type Known,
  type Money,
  type MonthRange,
  type Programme,
  type ProgrammeCategory,
} from "./programmes";
import { DEFAULT_REVIEW_DAYS, type LegalReview } from "./review";

/**
 * A cell.
 *
 * The absent cases are separate kinds rather than a shared `null`, because
 * "no requirement" and "no such route" are opposites and a single null makes
 * them render identically. An unlimited dependent age is the best possible
 * answer; no path to citizenship is the worst; both were `null` in the first
 * cut of this type, and both were being ranked as zero.
 */
export type ComparisonValue =
  | { kind: "money"; value: Money }
  | { kind: "months"; value: MonthRange }
  | { kind: "count"; value: number }
  | { kind: "years"; value: number }
  | { kind: "days"; value: number }
  | { kind: "boolean"; value: boolean }
  /** No requirement at all — zero days in country, no holding period. */
  | { kind: "none" }
  /** No upper bound — dependants of any age. */
  | { kind: "unlimited" }
  /** Granted directly, so no waiting period applies. */
  | { kind: "immediate" }
  /** The programme offers no such route. Not a good outcome, not a neutral one. */
  | { kind: "notAvailable" }
  | { kind: "unknown" };

export type ComparisonRow = {
  /** Key into `dictionary.compare.rows`. */
  key: string;
  /**
   * Which direction is better, for highlighting. `none` where there is no
   * better — whether a country taxes worldwide income is a fact about fit,
   * not a score.
   */
  better: "lower" | "higher" | "none";
  read: (programme: Programme) => ComparisonValue;
};

const unknown = (): ComparisonValue => ({ kind: "unknown" });

function known<T>(value: Known<T>, map: (v: T) => ComparisonValue): ComparisonValue {
  return value === UNKNOWN ? unknown() : map(value as T);
}

/**
 * The rows, in reading order.
 *
 * Deliberately the same set the legacy site's own comparison articles use —
 * minimum investment, processing time, visa-free travel, Schengen access,
 * dual citizenship, residency requirement, family inclusion, and which routes
 * exist. That set is already proven against the questions readers ask.
 */
export const comparisonRows: readonly ComparisonRow[] = [
  {
    key: "minimumInvestment",
    better: "lower",
    read: (p) => {
      const route = cheapestOfferedRoute(p) ?? p.routes[0];
      return route ? { kind: "money", value: route.minimum } : unknown();
    },
  },
  {
    key: "holdingPeriod",
    better: "lower",
    read: (p) => {
      const route = cheapestOfferedRoute(p) ?? p.routes[0];
      if (!route) return unknown();
      return route.holdingYears === 0
        ? { kind: "none" }
        : { kind: "years", value: route.holdingYears };
    },
  },
  {
    key: "processingTime",
    better: "lower",
    read: (p) => known(p.processingMonths, (v) => ({ kind: "months", value: v })),
  },
  {
    key: "visaFree",
    better: "higher",
    read: (p) => known(p.visaFreeCount, (v) => ({ kind: "count", value: v })),
  },
  {
    key: "schengen",
    better: "none",
    read: (p) => known(p.schengenAccess, (v) => ({ kind: "boolean", value: v })),
  },
  {
    key: "dualCitizenship",
    better: "none",
    read: (p) =>
      known(p.dualCitizenshipAllowed, (v) => ({ kind: "boolean", value: v })),
  },
  {
    key: "residencyRequired",
    better: "lower",
    read: (p) =>
      known(p.residencyRequirementDays, (v) =>
        v === null ? { kind: "none" } : { kind: "days", value: v },
      ),
  },
  {
    key: "physicalVisit",
    better: "none",
    read: (p) =>
      known(p.physicalVisitRequired, (v) => ({ kind: "boolean", value: v })),
  },
  {
    key: "dependentChildren",
    better: "higher",
    read: (p) =>
      known(p.dependentChildMaxAge, (v) =>
        // No age limit is the most generous answer there is, not the least.
        v === null ? { kind: "unlimited" } : { kind: "years", value: v },
      ),
  },
  {
    key: "parentsIncluded",
    better: "none",
    read: (p) =>
      known(p.includesParents, (v) => ({ kind: "boolean", value: v.allowed })),
  },
  {
    key: "citizenshipAfter",
    better: "lower",
    read: (p) =>
      // The same `null` means opposite things by category: a citizenship
      // programme grants it outright, a residence permit that leads nowhere
      // offers no route at all.
      known(p.citizenshipAfterYears, (v) => {
        if (v !== null) return { kind: "years", value: v };
        return p.category === "citizenship"
          ? { kind: "immediate" }
          : { kind: "notAvailable" };
      }),
  },
  {
    key: "worldwideTax",
    better: "none",
    read: (p) =>
      known(p.taxOnWorldwideIncome, (v) => ({ kind: "boolean", value: v })),
  },
];

export type Comparison = {
  /** URL segment: /compare/<slug>. */
  slug: string;
  /** Which programmes, as `[category, slug]` pairs. At least two. */
  programmes: readonly (readonly [ProgrammeCategory, string])[];
  /** Key into `dictionary.compare.copy` — the introduction and the verdict. */
  copyKey: string;
  review: LegalReview;
};

/**
 * An explicit allowlist, not every pair.
 *
 * Nine programmes would give thirty-six pairs, and thirty-six near-identical
 * tables across seven languages is two hundred and fifty URLs of the kind
 * Google calls a doorway. A comparison earns a page when someone actually
 * searches for it and we have something to say about the choice.
 */
export const comparisons: readonly Comparison[] = [
  {
    slug: "turkiye-vs-caribbean",
    programmes: [
      ["citizenship", "turkiye"],
      ["citizenship", "grenada"],
    ],
    copyKey: "turkiye-vs-caribbean",
    review: {
      reviewedOn: "2026-09-02",
      reviewedBy: "advisory-team",
      sources: [],
      reviewEveryDays: DEFAULT_REVIEW_DAYS,
    },
  },
  {
    slug: "turkiye-citizenship-vs-residency",
    programmes: [
      ["citizenship", "turkiye"],
      ["residency", "turkiye"],
    ],
    copyKey: "turkiye-citizenship-vs-residency",
    review: {
      reviewedOn: "2026-09-02",
      reviewedBy: "advisory-team",
      sources: [],
      reviewEveryDays: DEFAULT_REVIEW_DAYS,
    },
  },
  {
    slug: "turkiye-vs-uae",
    programmes: [
      ["citizenship", "turkiye"],
      ["residency", "uae"],
    ],
    copyKey: "turkiye-vs-uae",
    review: {
      reviewedOn: "2026-09-02",
      reviewedBy: "advisory-team",
      sources: [],
      reviewEveryDays: DEFAULT_REVIEW_DAYS,
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function comparisonProgrammes(comparison: Comparison): Programme[] {
  return comparison.programmes
    .map(([category, slug]) => getProgramme(category, slug))
    .filter((p): p is Programme => p !== undefined);
}

export type ComparisonCell = {
  programme: Programme;
  value: ComparisonValue;
  /** Whether this cell wins its row. Never true when the row is `none`. */
  best: boolean;
};

/** Where a cell sits on its row's scale; `undefined` means incomparable. */
function rank(value: ComparisonValue): number | undefined {
  switch (value.kind) {
    case "money":
      // Only comparable within one currency; mixed rows are left unranked.
      return value.value.amount;
    case "months":
      return value.value.min;
    case "count":
    case "years":
    case "days":
      return value.value;
    case "none":
    case "immediate":
      return 0;
    case "unlimited":
      return Number.POSITIVE_INFINITY;
    default:
      // `notAvailable` and `unknown` cannot be placed on the scale, and a row
      // containing either is left unhighlighted rather than guessed at.
      return undefined;
  }
}

/**
 * One rendered row.
 *
 * Carries the row's key and direction, not the `ComparisonRow` itself: the
 * table is a Client Component, and `read` is a function, which cannot cross
 * that boundary. It is also not something the table needs — the reading has
 * already happened by the time this exists.
 */
export type ComparisonTableRow = {
  key: string;
  better: ComparisonRow["better"];
  cells: readonly ComparisonCell[];
};

/**
 * The table, row by row.
 *
 * A row is only highlighted when every cell in it is comparable — all ranked,
 * and for money all in one currency. Marking dirhams as "better" than dollars
 * would be arithmetic dressed up as advice.
 */
export function comparisonTable(
  comparison: Comparison,
): readonly ComparisonTableRow[] {
  const programmes = comparisonProgrammes(comparison);

  return comparisonRows.map((row) => {
    const values = programmes.map((programme) => ({
      programme,
      value: row.read(programme),
    }));

    const ranks = values.map((v) => rank(v.value));
    const currencies = new Set(
      values.flatMap((v) =>
        v.value.kind === "money" ? [v.value.value.currency] : [],
      ),
    );

    // Every cell has to sit on the same scale before one can be called better:
    // all ranked, and — for money — all in one currency. Calling two million
    // dirhams "worse" than four hundred thousand dollars would be arithmetic
    // presented as advice.
    const comparable =
      row.better !== "none" &&
      ranks.every((r) => r !== undefined) &&
      currencies.size <= 1;

    let bestRank: number | undefined;
    if (comparable) {
      const numbers = ranks as number[];
      bestRank =
        row.better === "lower" ? Math.min(...numbers) : Math.max(...numbers);
    }

    return {
      key: row.key,
      better: row.better,
      cells: values.map((entry) => ({
        ...entry,
        best: comparable && rank(entry.value) === bestRank,
      })),
    };
  });
}
