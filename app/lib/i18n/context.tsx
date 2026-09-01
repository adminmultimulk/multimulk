"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  dirFor,
  localeHref,
  type Direction,
  type Locale,
} from "./config";
import type { Dictionary } from "./index";
import {
  formatDate,
  formatNumber,
  interpolate,
  selectPlural,
  type Plural,
} from "./format";

type I18n = {
  locale: Locale;
  dir: Direction;
  t: Dictionary;
  /** Prefixes an in-app path with the active locale. */
  href: (path: string) => string;
  /** `interpolate` bound to nothing — here so callers need one import. */
  fill: (template: string, vars?: Record<string, string | number>) => string;
  plural: (
    forms: Plural,
    count: number,
    vars?: Record<string, string | number>,
  ) => string;
  num: (value: number) => string;
  date: (iso: string, style?: "long" | "short") => string;
};

const I18nContext = createContext<I18n | null>(null);

/**
 * Mounted once, in the root layout, wrapping the whole tree. Server Components
 * below it still read translations directly through `getDictionary()`; this
 * exists so the Client Components nested among them — the nav, the hero, the
 * search filters — can reach the same dictionary without prop drilling.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  const value: I18n = {
    locale,
    dir: dirFor(locale),
    t: dict,
    href: (path) => localeHref(locale, path),
    fill: (template, vars) => interpolate(template, vars),
    plural: (forms, count, vars) => selectPlural(locale, forms, count, vars),
    num: (value) => formatNumber(locale, value),
    date: (iso, style) => formatDate(locale, iso, style),
  };

  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return value;
}
