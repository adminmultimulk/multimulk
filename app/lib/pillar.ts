/**
 * Photography and flags for the citizenship and residency hub cards.
 *
 * The programme records stay figure-only so a comparison table can be
 * generated from them. These frames are editorial: the same shots the
 * programme pages and the home regions already use, keyed here so the hub
 * can show a place rather than a blank cell.
 */

import type { CountryCode, Programme, ProgrammeCategory } from "./programmes";

export type PillarVisual = {
  image: string;
  flag?: string;
};

const flags: Partial<Record<CountryCode, string>> = {
  tr: "/images/flags/tr.svg",
  gd: "/images/flags/gd.svg",
  dm: "/images/flags/dm.svg",
  kn: "/images/flags/kn.svg",
  lc: "/images/flags/lc.svg",
  ag: "/images/flags/ag.svg",
};

/**
 * Place-name tokens that exist in `dictionary.places`. Countries without a
 * translation yet are omitted and the card leads with the official name.
 */
export const pillarPlace: Partial<Record<CountryCode, string>> = {
  tr: "Türkiye",
  gd: "Grenada",
  dm: "Dominica",
  kn: "St. Kitts & Nevis",
  lc: "St. Lucia",
  ag: "Antigua & Barbuda",
};

const cardImage: Record<string, string> = {
  "citizenship:turkiye": "/images/cbi/hero-istanbul-dusk.jpg",
  "citizenship:grenada": "/images/caribbean-grenada.webp",
  "citizenship:dominica": "/images/cbi/hero-caribbean.jpg",
  "citizenship:st-kitts-and-nevis": "/images/cb-park-hyatt.webp",
  "citizenship:st-lucia": "/images/cbi/hero-st-lucia-soufriere.jpg",
  "citizenship:antigua-and-barbuda": "/images/cbi/cbi-island.jpg",
  "citizenship:malta": "/images/cbi/cbi-documents.jpg",
  "residency:turkiye": "/images/cbi/hero-istanbul.jpg",
  "residency:uae": "/images/cbi/hero-dubai-night.jpg",
  "residency:portugal": "/images/cbi/cbi-advisory.jpg",
  "residency:greece": "/images/cbi/cbi-documents.jpg",
};

export const pillarHero: Record<ProgrammeCategory, string> = {
  citizenship: "/images/cbi/hero-passports.jpg",
  residency: "/images/cbi/hero-dubai-night.jpg",
};

export const pillarCta: Record<ProgrammeCategory, string> = {
  citizenship: "/images/cbi/hero-istanbul-dusk.jpg",
  residency: "/images/cbi/hero-dubai-night.jpg",
};

export function pillarVisual(programme: Programme): PillarVisual {
  return {
    image:
      cardImage[`${programme.category}:${programme.slug}`] ??
      pillarHero[programme.category],
    flag: flags[programme.country],
  };
}
