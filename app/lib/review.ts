/**
 * When a page's facts were last checked, and against what.
 *
 * Programme thresholds, holding periods and processing times are legislation.
 * They change, and a page that quietly keeps quoting last year's figure is
 * worse than one that says nothing. Every module in this codebase carries a
 * comment warning that its figures are unverified; a comment is not something
 * anyone deploys against, so this makes the same point in the type system.
 *
 * `LegalReview` is required — not optional — on programmes, comparisons, case
 * studies and any claim-bearing question. A new programme page cannot compile
 * without a review date, which is the only version of this rule that survives
 * a growing content team.
 */

import type { AuthorId } from "./authors";

export type ReviewSource = {
  /** How the instrument is cited on the page. */
  label: string;
  url: string;
  /** ISO day the URL was last read. Sources move; this dates the reading. */
  retrievedOn: string;
};

export type LegalReview = {
  /** ISO day the figures were checked against current legislation. */
  reviewedOn: string;
  /** Who signed it off. Rendered as a name, linked to their page. */
  reviewedBy: AuthorId;
  /**
   * The instruments the figures come from. Rendered, not merely stored — a
   * reader deciding where to put four hundred thousand dollars is entitled to
   * see where the number came from.
   */
  sources: readonly ReviewSource[];
  /** How often it must be re-checked. Programme rules move; 180 days default. */
  reviewEveryDays: number;
};

export const DEFAULT_REVIEW_DAYS = 180;

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

/** ISO day the review lapses. */
export function dueDate(review: LegalReview): string {
  const due = parseDay(review.reviewedOn) + review.reviewEveryDays * DAY_MS;
  return new Date(due).toISOString().slice(0, 10);
}

export function isStale(review: LegalReview, now: Date = new Date()): boolean {
  return now.getTime() > parseDay(dueDate(review));
}

/**
 * How many days until the review lapses; negative once it has.
 * Used by the reporting script to sort by urgency.
 */
export function daysUntilDue(
  review: LegalReview,
  now: Date = new Date(),
): number {
  return Math.round((parseDay(dueDate(review)) - now.getTime()) / DAY_MS);
}
