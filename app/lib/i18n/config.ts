/**
 * The languages the site ships in, and everything derivable from a locale
 * that does not require loading a dictionary.
 *
 * Kept free of `server-only` and of any dictionary import on purpose: the
 * language switcher, the `<html dir>` attribute, the proxy, the sitemap and
 * the route registry all need this, and they run in four different
 * environments — one of which, a metadata Route Handler, cannot read root
 * params at all.
 */

export const locales = ["en", "ar", "ru", "fr", "ur", "tr", "zh"] as const;

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
  tr: { native: "Türkçe", short: "TR", english: "Turkish" },
  zh: { native: "简体中文", short: "中文", english: "Chinese (Simplified)" },
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
  tr: "tr-TR",
  zh: "zh-Hans-CN",
};

/**
 * The tag published in `hreflang` and in `<html lang>`, which is deliberately
 * *not* always the URL segment.
 *
 * Chinese routes at `/zh` — short and typeable — but advertises `zh-Hans`,
 * because a bare `zh` says nothing about script and would mis-target readers
 * of Traditional Chinese. Keeping the two apart is what lets `zh-Hant` be
 * added later as its own locale without re-cutting every URL on the site.
 */
export const hreflangFor: Record<Locale, string> = {
  en: "en",
  ar: "ar",
  ru: "ru",
  fr: "fr",
  ur: "ur",
  tr: "tr",
  zh: "zh-Hans",
};

/**
 * How finished a language is, which controls two separate things.
 *
 * - `published` — complete. Offered to readers, and advertised to crawlers in
 *   `hreflang` and the sitemap.
 * - `partial`   — offered to readers, but not advertised. The chrome and the
 *   main pages are translated and English shows through the deeper content, so
 *   it is genuinely usable; telling Google a Turkish page exists when half of
 *   it is English is a different matter, and that waits for `published`.
 * - `preview`   — reachable by URL only, for whoever is translating it.
 *
 * The distinction between the first two is the point. A language does not go
 * from invisible to complete in one step, and forcing it to means it never
 * ships at all.
 */
export type LocaleStatus = "published" | "partial" | "preview";

export const localeStatus: Record<Locale, LocaleStatus> = {
  en: "published",
  ar: "published",
  ru: "published",
  fr: "published",
  ur: "published",
  tr: "partial",
  zh: "partial",
};

/**
 * The locales crawlers are told about — `hreflang`, the sitemap, and whether
 * a page is indexable. Never use `locales` for that.
 */
export const publishedLocales: readonly Locale[] = locales.filter(
  (locale) => localeStatus[locale] === "published",
);

/** The locales the language switcher offers. */
export const offeredLocales: readonly Locale[] = locales.filter(
  (locale) => localeStatus[locale] !== "preview",
);

export function isPublished(locale: Locale): boolean {
  return localeStatus[locale] === "published";
}

export function isOffered(locale: Locale): boolean {
  return localeStatus[locale] !== "preview";
}

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
