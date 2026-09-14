/**
 * Rendering a `Figure` as words.
 *
 * Separate from `figures.ts` so a Client Component can format one without
 * pulling the whole registry, and separate from the component so the strings
 * can be tested directly.
 */

import type { ComparisonValue } from "./comparisons";
import type { Figure } from "./figures";
import type { Dictionary } from "./i18n";
import { intlLocale, type Locale } from "./i18n/config";
import { formatNumber, interpolate } from "./i18n/format";

const currencyFor: Partial<Record<Figure["unit"], string>> = {
  usd: "USD",
  eur: "EUR",
  aed: "AED",
};

/**
 * The number alone — "$400,000", "3–6", "110+".
 *
 * Currencies keep their symbol and no decimals: these are thresholds, and
 * "$400,000.00" reads like an invoice. Digits stay Latin in every language,
 * matching `formatNumber`, because that is how these markets quote prices.
 */
export function figureValue(locale: Locale, figure: Figure): string {
  const currency = currencyFor[figure.unit];

  const format = (value: number) =>
    currency
      ? new Intl.NumberFormat(intlLocale[locale], {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
          numberingSystem: "latn",
        }).format(value)
      : new Intl.NumberFormat(intlLocale[locale], {
          numberingSystem: "latn",
        }).format(value);

  // An en dash, not a hyphen: this is a range, and the site already sets it
  // that way in the copy it replaces.
  if (figure.max !== undefined) return `${format(figure.value)}–${format(figure.max)}`;
  if (figure.atLeast) return `${format(figure.value)}+`;
  return format(figure.value);
}

/**
 * A comparison cell as words — "US$270,000", "4–6 months", "None required".
 *
 * Shared by the comparison table, which is a Client Component, and by the
 * programme and comparison pages, which build the numbered points of their
 * highlight sliders from the same cells on the server. One formatter, so a
 * figure cannot read one way in the table and another in the sentence beside
 * it.
 *
 * The absent cases each get their own wording. "None required" and "no route"
 * were the same `null` in an earlier cut of the data model, and rendering them
 * identically told readers that a programme with no path to citizenship simply
 * had no waiting period.
 */
export function comparisonValueText(
  locale: Locale,
  t: Pick<Dictionary, "compare" | "figures">,
  value: ComparisonValue,
): string {
  const num = (n: number) => formatNumber(locale, n);

  switch (value.kind) {
    case "money":
      return new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
        style: "currency",
        currency: value.value.currency,
        maximumFractionDigits: 0,
        numberingSystem: "latn",
      }).format(value.value.amount);
    case "months": {
      const range =
        value.value.max !== undefined
          ? `${num(value.value.min)}–${num(value.value.max)}`
          : num(value.value.min);
      return `${range} ${t.figures.units.months}`;
    }
    case "count":
      return num(value.value);
    case "percent": {
      const range =
        value.value.max !== undefined
          ? `${num(value.value.min)}–${num(value.value.max)}`
          : num(value.value.min);
      return `${range}${t.figures.units.percent}`;
    }
    case "resale":
      return t.compare.resale[value.value];
    case "return": {
      const money = (amount: number) =>
        new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
          style: "currency",
          currency: value.value.money.currency,
          maximumFractionDigits: 0,
          numberingSystem: "latn",
        }).format(amount);
      if (!value.value.retained) {
        return interpolate(t.compare.returnLost, {
          money: money(value.value.money.amount),
        });
      }
      const { percent } = value.value;
      const band =
        percent.max !== undefined
          ? `+${num(percent.min)}–${num(percent.max)}${t.figures.units.percent}`
          : `+${num(percent.min)}${t.figures.units.percent}`;
      const income =
        value.value.moneyMax !== undefined
          ? `${money(value.value.money.amount)}–${money(value.value.moneyMax)}`
          : money(value.value.money.amount);
      return interpolate(t.compare.returnRetained, { percent: band, money: income });
    }
    case "years":
      return `${num(value.value)} ${t.figures.units.years}`;
    case "days":
      return `${num(value.value)} ${t.figures.units.days}`;
    case "boolean":
      return value.value ? t.compare.yes : t.compare.no;
    case "none":
      return t.compare.noneRequired;
    case "unlimited":
      return t.compare.noAgeLimit;
    case "immediate":
      return t.compare.grantedDirectly;
    case "notAvailable":
      return t.compare.noRoute;
    default:
      return t.compare.unknownLabel;
  }
}
