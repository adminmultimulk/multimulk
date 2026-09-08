/**
 * Property units shown on /search-property.
 *
 * The types and the filter vocabularies. The inventory itself is entered in
 * the dashboard and read through `cms/properties.ts`; the placeholder stock
 * that used to be written out below it has been removed.
 *
 * `cbiEligible` is derived from the Türkiye Citizenship by Investment
 * property threshold (USD 400,000). Verify the current threshold before
 * relying on it commercially.
 */

export type Currency = "USD" | "EUR" | "TRY";

/**
 * A unit's specs double as their own translation keys: `type`, `bathrooms`,
 * `bedroom`, `level` and `view` are written in English here and resolved
 * through `formatUnit` against `dictionary.unit`, which falls back to the
 * English when a language has not overridden a term. `size` is a number range
 * plus a unit, so only the unit is translated.
 */
export type Unit = {
  slug: string;
  /** A development name plus its layout; the name half is never translated. */
  title: string;
  project: string;
  /** Place names, resolved through `dictionary.places`. */
  location: string;
  country: string;
  prices: Record<Currency, number>;
  type: string;
  bathrooms: string;
  bedroom: string;
  size: string;
  level: string;
  view: string;
  soldOut: boolean;
  cbiEligible: boolean;
  image: string;
  /**
   * The brochure emailed by "Download Brochure", where the unit carries its
   * own. The inventory in this file takes its development's instead — see
   * `Project.brochure` — so only listings created in the dashboard set this.
   */
  brochure?: string;
  /**
   * True for a unit with a page of its own at `/properties/<slug>`. The units
   * here are shown on their development's page and have none, so a card links
   * to the development; a listing from the dashboard links to itself.
   */
  hasPage?: boolean;
};

export const currencies: Currency[] = ["USD", "EUR", "TRY"];

/** Türkiye CBI real-estate threshold, in USD. */
export const CBI_THRESHOLD_USD = 400000;

export const propertyTypes = ["Apartment", "Townhouse", "Villa"];

/**
 * The tax rates a Turkish purchase can carry, as whole percentages.
 *
 * Fixed lists rather than free text: these are statutory rates, a lister
 * typing "%1" or "1 percent" into a box would put three spellings of the same
 * number on three listings, and a number is the only thing a buyer comparing
 * two units can actually compare. Written once here so the form's options, the
 * Server Action's validation and the page agree on what exists.
 */
export const vatRates = [0, 1, 10, 20];

export const titleDeedTaxRates = [0, 2, 4];

export const bedroomOptions = ["Studio", "1", "2", "3", "5"];

export const locations = [
  "Türkiye",
  "Caribbean",
  "İstanbul",
  "Antalya",
  "Muğla",
  "Grenada",
];

export const priceCeilings: Record<Currency, number[]> = {
  USD: [200000, 400000, 600000, 800000, 1000000, 1500000, 2000000],
  EUR: [180000, 360000, 550000, 730000, 920000, 1380000, 1840000],
  TRY: [8000000, 16000000, 24000000, 32000000, 40000000, 60000000, 80000000],
};

/**
 * The inventory the site ships with.
 *
 * Empty, and deliberately so. What stood here was placeholder stock — six
 * invented schemes with invented prices — and every unit the site shows now
 * comes from the dashboard, through `cms/properties.ts`. The array stays
 * because the merge in `mergedUnits` is what lets a future fixture, migration
 * or seed sit alongside the database rather than replacing it.
 */
export const units: Unit[] = [];
