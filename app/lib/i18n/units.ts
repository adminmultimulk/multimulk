/**
 * Turns a `Unit`'s English spec strings into the reader's language.
 *
 * The specs in `properties.ts` are written in English and act as their own
 * translation keys, which keeps one list of inventory rather than five. Every
 * lookup here falls back to that English, so a language that has not named,
 * say, a particular view still renders a sensible card instead of a blank.
 *
 * Pure and dictionary-driven, so it runs unchanged in Server and Client
 * Components.
 */

import type { Locale } from "./config";
import { interpolate, lookup, selectPlural } from "./format";
import type { Dictionary } from "./index";
import type { Unit } from "../properties";

/** "2 Bedroom" -> 2; "Studio" and anything unparsed -> null. */
function leadingCount(value: string): number | null {
  const match = /^(\d+)\s/.exec(value);
  return match ? Number(match[1]) : null;
}

/** "Studio" or "3 Bedroom" -> the localised layout name. */
export function bedroomLabel(
  locale: Locale,
  t: Dictionary,
  bedroom: string,
): string {
  if (/^studio$/i.test(bedroom.trim())) return t.unit.studio;
  const count = leadingCount(bedroom);
  return count === null
    ? bedroom
    : selectPlural(locale, t.unit.bedrooms, count);
}

/**
 * The bedroom *filter* options are bare — "Studio", "1", "2" — rather than the
 * "2 Bedroom" a unit carries. Same vocabulary, one less word.
 */
export function bedroomOptionLabel(
  locale: Locale,
  t: Dictionary,
  option: string,
): string {
  if (/^studio$/i.test(option.trim())) return t.unit.studio;
  const count = Number(option);
  return Number.isNaN(count) ? option : selectPlural(locale, t.unit.bedrooms, count);
}

/** "3 Bathroom" -> the localised count. */
export function bathroomLabel(
  locale: Locale,
  t: Dictionary,
  bathrooms: string,
): string {
  const count = leadingCount(bathrooms);
  return count === null
    ? bathrooms
    : selectPlural(locale, t.unit.bathrooms, count);
}

/**
 * "1,501.93 - 2,203.30 sq. ft." -> the same figures with a localised unit.
 * The numbers are left exactly as written: they are a range with its own
 * separator, and re-formatting it per locale would only risk mangling it.
 */
export function sizeLabel(t: Dictionary, size: string): string {
  return size.replace(/sq\.\s*ft\./i, t.unit.sqft);
}

/** "Level 1-15" -> a localised pattern; named blocks -> a lookup. */
export function levelLabel(t: Dictionary, level: string): string {
  const match = /^Level\s+(.+)$/i.exec(level.trim());
  if (match) return interpolate(t.unit.level, { range: match[1] });
  return lookup(t.unit.levels, level);
}

export function viewLabel(t: Dictionary, view: string): string {
  return lookup(t.unit.views, view);
}

export function typeLabel(t: Dictionary, type: string): string {
  return lookup(t.unit.types, type);
}

export function placeLabel(t: Dictionary, place: string): string {
  return lookup(t.places, place);
}

/** Joins a run of place-name tokens the way the design writes them. */
export function placeLine(t: Dictionary, places: readonly string[]): string {
  return places.map((place) => placeLabel(t, place)).join(" · ");
}

/**
 * A unit title is its development's name followed by a layout — "Levent
 * Residences 3 Bedroom Townhouse + Maid". The name half is never translated;
 * the layout half is, including its suffix.
 */
export function unitTitle(locale: Locale, t: Dictionary, unit: Unit): string {
  const layout = unit.title.startsWith(unit.project)
    ? unit.title.slice(unit.project.length).trim()
    : "";
  if (!layout) return unit.title;

  const suffix = /^(Studio|\d+\s+Bedroom)\s*(.*)$/i.exec(layout);
  if (!suffix) return unit.title;

  const [, bedroom, rest] = suffix;
  const parts = [unit.project, bedroomLabel(locale, t, bedroom)];
  if (rest) parts.push(lookup(t.unit.layouts, rest));
  return parts.join(" ");
}

/** Everything the unit card lists, in order, already localised. */
export function unitSpecs(
  locale: Locale,
  t: Dictionary,
  unit: Unit,
): string[] {
  return [
    typeLabel(t, unit.type),
    bathroomLabel(locale, t, unit.bathrooms),
    bedroomLabel(locale, t, unit.bedroom),
    sizeLabel(t, unit.size),
    levelLabel(t, unit.level),
    viewLabel(t, unit.view),
  ];
}
