/**
 * Structure and asset references for /about. Copy lives in
 * `app/lib/i18n/dictionaries` under `about`, reached through the keys here —
 * same split as `content.ts`.
 *
 * NOTE: figures, photography and the leadership roster are placeholders in the
 * same sense as the rest of the site (see the note at the top of content.ts).
 * The design this page follows is Multi Mulk's; the facts still need Multi
 * Mulk's own numbers, portraits and names before launch.
 */

import type { Locale } from "./i18n/config";
import { buildPath, routes, searchPath } from "./routes";

export const aboutHero = {
  image: "/images/cbi/about-hero-earth-night.jpg",
};

export const aboutIntro = {
  /**
   * Figures are the same in every language; their labels are keyed.
   *
   * Taken from multimulk.com. The previous set — "12+ developments, 15+ years"
   * — came over with the design from the reference site and overstated the
   * company's age by five years.
   */
  stats: [
    { key: "experience" as const, value: "10+" },
    { key: "clients" as const, value: "160+" },
    { key: "properties" as const, value: "500+" },
  ],
  image: "/images/footer-aerial.png",
};

export type AboutRegionKey = "turkiye" | "caribbean";

export type AboutRegion = {
  key: AboutRegionKey;
  /**
   * The wordmark, rendered letter by letter — so it is spelled out here rather
   * than taken from the label, and stays a single word in every language.
   *
   * Keyed by `Locale` rather than by `string`: a missing language used to fall
   * back to the Latin wordmark silently, which is exactly the kind of gap
   * nobody notices until a reader does. Adding a language now fails the build
   * until its wordmark is written.
   */
  word: Record<Locale, string>;
  href: string;
  image: string;
};

export const aboutRegions: AboutRegion[] = [
  {
    key: "turkiye",
    word: {
      en: "TÜRKİYE",
      ar: "تركيا",
      ru: "ТЮРКИЕ",
      fr: "TÜRKİYE",
      ur: "ترکیہ",
      tr: "TÜRKİYE",
      zh: "土耳其",
    },
    href: searchPath({ currency: "USD", location: "Türkiye" }),
    image: "/images/bosphorus-heights.webp",
  },
  {
    key: "caribbean",
    word: {
      en: "CARIBBEAN",
      ar: "الكاريبي",
      ru: "КАРИБЫ",
      fr: "CARAÏBES",
      ur: "کیریبیئن",
      tr: "KARAYİPLER",
      zh: "加勒比",
    },
    href: searchPath({ currency: "USD", location: "Caribbean" }),
    image: "/images/cbi/cbi-island.jpg",
  },
];

export const aboutPrinciples = {
  image: "/images/hero-la-sagesse.webp",
  items: [
    { key: "craftsmanship" as const, number: "01" },
    { key: "advice" as const, number: "02" },
    { key: "lifestyle" as const, number: "03" },
  ],
};

export const aboutDevelopments = {
  cards: [
    {
      key: "bosphorus-heights" as const,
      name: "Bosphorus Heights",
      image: "/images/bosphorus-heights.webp",
      href: buildPath("development", { slug: "bosphorus-heights" }),
    },
    {
      key: "aegean-bay-residences" as const,
      name: "Aegean Bay Residences",
      image: "/images/aegean-bay.webp",
      href: buildPath("development", { slug: "aegean-bay-residences" }),
    },
    {
      key: "la-sagesse-collection" as const,
      name: "The La Sagesse Collection Residences",
      image: "/images/cb-la-sagesse-residences.webp",
      href: searchPath({ currency: "USD", location: "Caribbean" }),
    },
  ],
  actions: [
    {
      key: "turkiye" as const,
      href: searchPath({ currency: "USD", location: "Türkiye" }),
    },
    {
      key: "caribbean" as const,
      href: searchPath({ currency: "USD", location: "Caribbean" }),
    },
  ],
};

export const aboutLeadership = {
  href: routes.contact.pattern,
  /** Names are never translated; roles are keyed by slug. */
  people: [
    {
      slug: "sajid-ali-haydar" as const,
      name: "Sajid Ali Haydar",
      image: "/images/team/sajid-ali-haydar.webp",
    },
    {
      slug: "nader-djebbi" as const,
      name: "Nader Djebbi",
      image: "/images/team/nader-djebbi.webp",
    },
  ],
};

export const aboutMap = {
  /** A development name, and the place it stands in, as place-name tokens. */
  places: [
    { name: "Bosphorus Heights", region: ["İstanbul", "Beyoğlu"] },
    { name: "Levent Residences", region: ["İstanbul", "Şişli"] },
    { name: "Marmara Vista", region: ["İstanbul", "Beylikdüzü"] },
    { name: "Aegean Bay Residences", region: ["Muğla", "Bodrum"] },
    { name: "Antalya Coast", region: ["Antalya", "Konyaaltı"] },
    { name: "The La Sagesse Collection", region: ["Grenada", "La Sagesse Bay"] },
  ],
  image: "/images/cbi/cbi-caribbean-aerial.jpg",
};

export const aboutPlaces = [
  { key: "istanbul" as const, image: "/images/bosphorus-heights.webp" },
  { key: "bodrum" as const, image: "/images/aegean-bay.webp" },
  { key: "antalya" as const, image: "/images/antalya-coast.webp" },
  { key: "grenada" as const, image: "/images/caribbean-grenada.webp" },
];
