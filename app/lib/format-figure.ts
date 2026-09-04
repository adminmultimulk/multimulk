/**
 * Rendering a `Figure` as words.
 *
 * Separate from `figures.ts` so a Client Component can format one without
 * pulling the whole registry, and separate from the component so the strings
 * can be tested directly.
 */

import type { Figure } from "./figures";
import { intlLocale, type Locale } from "./i18n/config";

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
