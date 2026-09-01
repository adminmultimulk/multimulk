/**
 * Formatting primitives shared by server and client code. Nothing here loads a
 * dictionary, so it is safe to import from a Client Component.
 */

import { intlLocale, type Locale } from "./config";

/**
 * A translatable phrase whose wording depends on a count.
 *
 * `one` and `other` are the two forms English needs and are therefore
 * required; the rest are the remaining CLDR categories, filled in only by the
 * languages that use them — Russian needs `few` and `many`, Arabic needs
 * `zero`, `two`, `few` and `many`. `selectPlural` falls back through to
 * `other`, so a language may supply as few or as many as it actually
 * distinguishes.
 */
export type Plural = {
  one: string;
  other: string;
  zero?: string;
  two?: string;
  few?: string;
  many?: string;
};

/** Identity, but it widens a literal to `Plural` so translations can add forms. */
export const plural = (forms: Plural): Plural => forms;

/** Replaces every `{name}` in `template` with `vars.name`. */
export function interpolate(
  template: string,
  vars: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Picks the CLDR plural form for `count` and interpolates `{count}` into it. */
export function selectPlural(
  locale: Locale,
  forms: Plural,
  count: number,
  vars: Record<string, string | number> = {},
): string {
  const category = new Intl.PluralRules(intlLocale[locale]).select(count);
  const form =
    (forms as Record<string, string | undefined>)[category] ?? forms.other;
  return interpolate(form, { count: formatNumber(locale, count), ...vars });
}

/**
 * Prices and counts stay in Western digits in every language. Arabic and Urdu
 * default to Arabic-Indic numerals under `Intl`, which is correct for prose but
 * not for how these markets quote property prices — buyers, brochures and the
 * portals they compare against all use `400,000`.
 */
export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    numberingSystem: "latn",
  }).format(value);
}

/** Article dates. `short` is the card meta line; `long` is the article header. */
export function formatDate(
  locale: Locale,
  iso: string,
  style: "long" | "short" = "long",
): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(intlLocale[locale], {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    numberingSystem: "latn",
    calendar: "gregory",
  });
}

/**
 * Returns `translated` when it holds something, and the English `source`
 * otherwise. This is what lets long-form copy — article bodies, project
 * descriptions — ship untranslated behind keys that are already wired: fill the
 * key in and the page picks it up with no component change.
 */
export function pick(translated: string | undefined, source: string): string {
  return translated && translated.trim() ? translated : source;
}

/**
 * Looks a value up in a translation map keyed by its English text, falling back
 * to that English text when the language has not overridden it. Used for the
 * small closed vocabularies — property types, views, amenity names.
 */
export function lookup(
  map: Record<string, string> | undefined,
  key: string,
): string {
  return pick(map?.[key], key);
}

/**
 * Long-form copy that is keyed but not yet translated.
 *
 * Article bodies and the prose on development pages are staged: the plumbing
 * reads them from the dictionary, and each language ships whichever entries it
 * has. Anything absent falls back to the English in `media.ts` / `projects.ts`
 * through `pick()`, so a page is never half-blank and a translation can be
 * dropped in later without touching a component.
 */
export type ArticleCopy = { title?: string; body?: readonly string[] };

export type ProjectCopy = {
  description?: string;
  overviewBody?: string;
  amenitiesBody?: string;
  /** Keyed by the highlight's English title. */
  highlights?: Record<string, string>;
};

/** Identity, but it keeps the map's keys open so languages can fill in any subset. */
export const staged = <T,>(map: Record<string, T>): Record<string, T> => map;

/** `pick()` for a whole paragraph list. Copied, so the caller owns the array. */
export function pickAll(
  translated: readonly string[] | undefined,
  source: string[],
): string[] {
  return translated && translated.length ? [...translated] : source;
}
