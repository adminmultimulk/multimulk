/**
 * All-in cost arithmetic for the citizenship calculator.
 *
 * Shared by `/tools` and the gated `/calculator-result` landing so the two
 * cannot quote different fees for the same family size. Every rate is a
 * stated assumption rendered beside the total, not a constant buried only in
 * the arithmetic.
 */

/** Transaction assumptions, shown to the reader and applied to the total. */
export const costAssumptions = {
  /** Title transfer tax, as a share of the declared value. */
  transferTaxRate: 0.04,
  /** Legal and advisory fees, flat. */
  legalFees: 3_500,
  /** Valuation, translation, apostille and notary, flat. */
  documentation: 1_500,
  /** Government application fee, per person included. */
  governmentFeePerPerson: 800,
} as const;

export type CostLineKey =
  | "investment"
  | "transferTax"
  | "legal"
  | "documentation"
  | "government";

export type CostLine = { key: CostLineKey; value: number };

export function costLines(
  investment: number,
  people: number,
): readonly CostLine[] {
  return [
    { key: "investment", value: investment },
    {
      key: "transferTax",
      value: investment * costAssumptions.transferTaxRate,
    },
    { key: "legal", value: costAssumptions.legalFees },
    { key: "documentation", value: costAssumptions.documentation },
    {
      key: "government",
      value: costAssumptions.governmentFeePerPerson * people,
    },
  ];
}

export function costTotal(lines: readonly CostLine[]): number {
  return lines.reduce((sum, line) => sum + line.value, 0);
}
