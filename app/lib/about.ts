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

export const aboutHero = {
  image: "/images/caribbean-backdrop.webp",
};

export const aboutIntro = {
  /** Figures are the same in every language; their labels are keyed. */
  stats: [
    { key: "developments" as const, value: "12+" },
    { key: "experience" as const, value: "15+" },
    { key: "offices" as const, value: "3" },
  ],
  image: "/images/footer-aerial.png",
};

export type AboutRegionKey = "turkiye" | "caribbean";

export type AboutRegion = {
  key: AboutRegionKey;
  /**
   * The wordmark, rendered letter by letter — so it is spelled out here rather
   * than taken from the label, and stays a single word in every language.
   */
  word: Record<string, string>;
  href: string;
  image: string;
};

export const aboutRegions: AboutRegion[] = [
  {
    key: "turkiye",
    word: { en: "TÜRKİYE", ar: "تركيا", ru: "ТЮРКИЕ", fr: "TÜRKİYE", ur: "ترکیہ" },
    href: "/search-property?currency=USD&location=T%C3%BCrkiye",
    image: "/images/bosphorus-heights.webp",
  },
  {
    key: "caribbean",
    word: { en: "CARIBBEAN", ar: "الكاريبي", ru: "КАРИБЫ", fr: "CARAÏBES", ur: "کیریبیئن" },
    href: "/search-property?currency=USD&location=Caribbean",
    image: "/images/region-caribbean.avif",
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
      href: "/properties/bosphorus-heights",
    },
    {
      key: "aegean-bay-residences" as const,
      name: "Aegean Bay Residences",
      image: "/images/aegean-bay.webp",
      href: "/properties/aegean-bay-residences",
    },
    {
      key: "la-sagesse-collection" as const,
      name: "The La Sagesse Collection Residences",
      image: "/images/cb-la-sagesse-residences.webp",
      href: "/search-property?currency=USD&location=Caribbean",
    },
  ],
  actions: [
    {
      key: "turkiye" as const,
      href: "/search-property?currency=USD&location=T%C3%BCrkiye",
    },
    {
      key: "caribbean" as const,
      href: "/search-property?currency=USD&location=Caribbean",
    },
  ],
};

export const aboutLeadership = {
  href: "/contact-us",
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
  image: "/images/region-caribbean.avif",
};

export const aboutPlaces = [
  { key: "istanbul" as const, image: "/images/bosphorus-heights.webp" },
  { key: "bodrum" as const, image: "/images/aegean-bay.webp" },
  { key: "antalya" as const, image: "/images/antalya-coast.webp" },
  { key: "grenada" as const, image: "/images/caribbean-grenada.webp" },
];
