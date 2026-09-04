/**
 * The checks run on a property before it reaches a client, and the model used
 * to score it.
 *
 * This is the part of the site that is genuinely ours rather than a
 * restatement of programme rules — which is exactly why the weights are
 * published rather than kept behind the number. A score whose workings nobody
 * can inspect is a marketing device; one whose weights are on the page is an
 * argument a reader can disagree with.
 *
 * The keys below are looked up in `dictionary.protection`, so the questions
 * translate while the structure stays fixed.
 */

export type CheckKey =
  | "developerRecord"
  | "developerFinances"
  | "titleDeed"
  | "ownershipHistory"
  | "citizenshipEligibility"
  | "gyoStatus"
  | "valuation"
  | "sellerEligibility"
  | "buildingPermits"
  | "constructionStage"
  | "comparablePrices"
  | "pricePerSqm"
  | "rentalDemand"
  | "rentalYield"
  | "resaleLiquidity"
  | "exitStrategy"
  | "hiddenCosts"
  | "vatPosition"
  | "titleDeedCosts"
  | "deliveryRisk";

export type Check = { key: CheckKey; number: string };

export const dueDiligence: readonly Check[] = (
  [
    "developerRecord",
    "developerFinances",
    "titleDeed",
    "ownershipHistory",
    "citizenshipEligibility",
    "gyoStatus",
    "valuation",
    "sellerEligibility",
    "buildingPermits",
    "constructionStage",
    "comparablePrices",
    "pricePerSqm",
    "rentalDemand",
    "rentalYield",
    "resaleLiquidity",
    "exitStrategy",
    "hiddenCosts",
    "vatPosition",
    "titleDeedCosts",
    "deliveryRisk",
  ] as const
).map((key, index) => ({ key, number: String(index + 1).padStart(2, "0") }));

export type ScoreFactor =
  | "citizenshipSafety"
  | "developerStrength"
  | "location"
  | "priceVsMarket"
  | "rentalPotential"
  | "resaleLiquidity"
  | "capitalAppreciation"
  | "deliveryRisk";

/**
 * How much each factor counts, out of a hundred.
 *
 * Citizenship safety carries the most weight because it is the only factor
 * that can make the rest irrelevant: a property that fails eligibility has not
 * scored badly, it has failed outright.
 */
export const scoreWeights: Record<ScoreFactor, number> = {
  citizenshipSafety: 20,
  developerStrength: 15,
  location: 15,
  priceVsMarket: 15,
  rentalPotential: 10,
  resaleLiquidity: 10,
  capitalAppreciation: 10,
  deliveryRisk: 5,
};

/** Guards the one invariant the model has: the weights are a percentage. */
export const SCORE_TOTAL = Object.values(scoreWeights).reduce((a, b) => a + b, 0);

export type PropertyScore = {
  /** Each factor rated 0–100, before weighting. */
  factors: Record<ScoreFactor, number>;
  /** ISO day the assessment was made. */
  assessedOn: string;
  /** Who made it. A score has to be attributable to be worth anything. */
  assessedBy: string;
  /** What the assessment turned on, in the assessor's own words. */
  notes: string;
};

/** The weighted total, 0–100. */
export function totalScore(score: PropertyScore): number {
  const weighted = (Object.keys(scoreWeights) as ScoreFactor[]).reduce(
    (sum, factor) => sum + score.factors[factor] * scoreWeights[factor],
    0,
  );
  return Math.round(weighted / SCORE_TOTAL);
}
