/**
 * The five languages the site ships in, and everything derivable from a locale
 * that does not require loading a dictionary.
 *
 * Kept free of `server-only` and of any dictionary import on purpose: the
 * language switcher, the `<html dir>` attribute and the proxy all need this,
 * and they run in three different environments.
 */

export const locales = ["en", "ar", "ru", "fr", "ur"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Arabic and Urdu are written right to left; the other three are not. */
const rtl = new Set<Locale>(["ar", "ur"]);

export type Direction = "ltr" | "rtl";

export function dirFor(locale: Locale): Direction {
  return rtl.has(locale) ? "rtl" : "ltr";
}

export function isRtl(locale: Locale): boolean {
  return rtl.has(locale);
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * How each language names itself. The switcher lists `native` — a reader
 * looking for their own language recognises it in their own script — with
 * `short` as the compact label the closed nav control shows.
 */
export const localeNames: Record<Locale, { native: string; short: string; english: string }> = {
  en: { native: "English", short: "EN", english: "English" },
  ar: { native: "العربية", short: "AR", english: "Arabic" },
  ru: { native: "Русский", short: "RU", english: "Russian" },
  fr: { native: "Français", short: "FR", english: "French" },
  ur: { native: "اردو", short: "UR", english: "Urdu" },
};

/**
 * BCP 47 tags for `Intl` formatting. These differ from the routing segment on
 * purpose — `ar-AE` and `ur-PK` match the regions Multi Mulk actually serves,
 * and they order dates the way readers there expect.
 */
export const intlLocale: Record<Locale, string> = {
  en: "en-GB",
  ar: "ar-AE",
  ru: "ru-RU",
  fr: "fr-FR",
  ur: "ur-PK",
};

/**
 * Strips a leading locale segment from a pathname, returning the rest with its
 * leading slash. `/ar/about` -> `/about`; `/ar` -> `/`; `/about` -> `/about`.
 */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first)) return `/${rest.join("/")}`;
  return pathname || "/";
}

/**
 * Prefixes an in-app href with a locale, leaving anything that is not an
 * app-relative path (absolute URLs, `#anchors`, `mailto:`, `tel:`) untouched.
 * Already-prefixed paths are returned as-is so double prefixing is impossible.
 */
export function localeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href;
  const [, first] = href.split("/");
  if (first && isLocale(first)) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}
