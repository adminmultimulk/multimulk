/**
 * Server-side entry point for translations.
 *
 * `lang` is a *root* parameter — every route lives under `app/[lang]` — so any
 * Server Component can ask for the current locale without it being threaded
 * down as a prop. Client Components cannot read root params; they take the
 * locale and dictionary from `I18nProvider` instead.
 */

import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import {
  defaultLocale,
  hreflangFor,
  isLocale,
  publishedLocales,
  type Locale,
} from "./config";
import { absoluteUrl } from "../site";
import type en from "./dictionaries/en";
import type { Plural } from "./format";

/**
 * The shape every language file must satisfy. Derived from the English file so
 * a key that is added, renamed or dropped there is a compile error in the other
 * four. String literals are widened to `string`; arrays stay `readonly`, which
 * a plain array literal satisfies, so translations read as ordinary objects.
 */
export type Dictionary = Translation<typeof en>;

type Translation<T> = T extends string
  ? string
  : T extends Plural
    ? Plural
    : T extends readonly (infer U)[]
      ? readonly Translation<U>[]
      : T extends object
        ? { [K in keyof T]: Translation<T[K]> }
        : T;

/**
 * A language still being filled in: the same shape as `Dictionary`, with every
 * key optional at every depth.
 *
 * A published language stays exhaustive — `Dictionary` is what guarantees a
 * renamed key breaks the build rather than blanking a button in five
 * languages. But that guarantee also means a new language cannot ship until
 * every one of ~950 keys exists, which in practice means it never ships. So a
 * language starts here, resolved against English, and graduates to
 * `Dictionary` when it is complete. See `localeStatus` in `./config`.
 */
export type PartialDictionary = DeepPartial<Dictionary>;

type DeepPartial<T> = T extends string
  ? T
  : T extends Plural
    ? Plural
    : T extends readonly (infer U)[]
      ? readonly DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

/**
 * True for a plural table — an object of nothing but CLDR category strings.
 *
 * These are merged whole rather than key by key: taking `one` from Turkish and
 * `other` from English would produce a sentence in two languages, which is
 * worse than one honestly untranslated string.
 */
function isPluralTable(value: object): boolean {
  const entries = Object.entries(value);
  return (
    entries.length > 0 &&
    entries.every(([, v]) => typeof v === "string") &&
    "one" in value &&
    "other" in value
  );
}

/**
 * Lays a partial translation over the English dictionary.
 *
 * Objects merge key by key, so a language can translate one section and leave
 * the rest. Arrays replace wholesale: they are ordered editorial units — the
 * five hero slides, the steps of a process — and interleaving two languages
 * inside one would read as an error rather than as a gap.
 */
function resolveDictionary<T>(base: T, overlay: unknown): T {
  if (overlay === undefined || overlay === null) return base;

  if (
    typeof base !== "object" ||
    base === null ||
    Array.isArray(base) ||
    typeof overlay !== "object" ||
    Array.isArray(overlay)
  ) {
    return overlay as T;
  }

  if (isPluralTable(base as object)) return overlay as T;

  const merged: Record<string, unknown> = { ...(base as object) };
  for (const [key, value] of Object.entries(overlay)) {
    merged[key] = resolveDictionary(
      (base as Record<string, unknown>)[key],
      value,
    );
  }
  return merged as T;
}

/** English, which every partial language is resolved against. */
const english = () =>
  import("./dictionaries/en").then((m) => m.default as Dictionary);

async function overlaid(
  load: () => Promise<PartialDictionary>,
): Promise<Dictionary> {
  const [base, overlay] = await Promise.all([english(), load()]);
  return resolveDictionary(base, overlay);
}

/**
 * One dynamic import per language, so a request only ever loads the dictionary
 * it renders with. These run on the server; the dictionary reaches the browser
 * once, serialised through `I18nProvider`.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: english,
  ar: () => import("./dictionaries/ar").then((m) => m.default),
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  ur: () => import("./dictionaries/ur").then((m) => m.default),
  // Still filling in; English shows through wherever they are silent.
  tr: () => overlaid(() => import("./dictionaries/tr").then((m) => m.default)),
  zh: () => overlaid(() => import("./dictionaries/zh").then((m) => m.default)),
};

/**
 * The locale for the current request. An unknown segment 404s rather than
 * silently falling back, so `/de/about` is a missing page and not an English
 * one wearing a German URL.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!value || !isLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}

/** The pair almost every page needs, in one await. */
export async function getI18n(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, t: await getDictionary(locale) };
}

/**
 * The `hreflang` cluster for one route, as absolute URLs.
 *
 * Pure on purpose. `app/sitemap.ts` and `app/robots.ts` are Route Handlers,
 * and `next/root-params` is unavailable there, so anything they need cannot go
 * through `getLocale()`.
 *
 * `path` is the route *without* its locale segment — "/about", or "/" for the
 * home page — so each page advertises its own translations rather than the
 * home pages. Only published languages appear: advertising a half-translated
 * one invites Google to index it.
 *
 * `x-default` points at the English URL rather than the bare path. The bare
 * path is a 307 from the proxy that varies on `Accept-Language` and a cookie,
 * and a conditional redirect is a poor thing to nominate as the default.
 */
export function hreflangCluster(path: string): Record<string, string> {
  const suffix = path === "/" ? "" : path;
  const cluster: Record<string, string> = {};
  for (const locale of publishedLocales) {
    cluster[hreflangFor[locale]] = absoluteUrl(`/${locale}${suffix}`);
  }
  cluster["x-default"] = absoluteUrl(`/${defaultLocale}${suffix}`);
  return cluster;
}

/**
 * The `alternates` block for one route. Declared per route because a layout
 * cannot know which of its children is rendering.
 *
 * The canonical is the current locale's own URL, and it is included in the
 * cluster above — Google requires every page in a set to reference itself.
 */
export async function alternatesFor(path: string) {
  const locale = await getLocale();
  const suffix = path === "/" ? "" : path;
  return {
    canonical: absoluteUrl(`/${locale}${suffix}`),
    languages: hreflangCluster(path),
  };
}
