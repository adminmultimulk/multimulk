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
import { isLocale, locales, type Locale } from "./config";
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
 * One dynamic import per language, so a request only ever loads the dictionary
 * it renders with. These run on the server; the dictionary reaches the browser
 * once, serialised through `I18nProvider`.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default as Dictionary),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  ur: () => import("./dictionaries/ur").then((m) => m.default),
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
 * The `hreflang` block for one route, in every language.
 *
 * `path` is the route *without* its locale segment — "/about", or "/" for the
 * home page — so each page advertises its own translations rather than the
 * five home pages. Declared per route because a layout cannot know which of
 * its children is rendering.
 */
export async function alternatesFor(path: string) {
  const locale = await getLocale();
  const suffix = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${suffix}`,
    languages: Object.fromEntries(
      locales.map((l) => [l, `/${l}${suffix}`]),
    ),
  };
}
