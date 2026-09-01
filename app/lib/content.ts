/**
 * Landing-page structure and asset references.
 *
 * Since the site went multilingual this file holds only what is the same in
 * every language: images, hrefs, figures, and the proper nouns that are never
 * translated — development names, resort operators, award bodies. Every string
 * a reader reads in their own language lives in `app/lib/i18n/dictionaries`,
 * reached through the `key` on each entry here.
 *
 * NOTE: project names, photography and award badges are still placeholders
 * carried over from the reference site. The photography in particular shows
 * UAE developments and is NOT Türkiye — replace every asset and figure with
 * Multi Mulk's own before this goes anywhere public.
 */

import { mediaArticles } from "./media";

export { type Article } from "./media";

export const company = {
  name: "Multi Mulk",
};

/** Keys into `dictionary.nav`; the language control is not one of these. */
export type NavKey = "about" | "turkiye" | "caribbean" | "cbi" | "media";

export type NavLink = {
  key: NavKey;
  hasMenu: boolean;
  /** Only meaningful for links without a menu; unset ones are not built yet. */
  href?: string;
};

export const navLinks: NavLink[] = [
  { key: "about", hasMenu: true },
  { key: "turkiye", hasMenu: true },
  { key: "caribbean", hasMenu: true },
  { key: "cbi", hasMenu: true },
  { key: "media", hasMenu: false, href: "/media-centre" },
];

export type MenuCard = {
  /**
   * Small uppercase lines above the title. Each line is a list of place names
   * looked up in `dictionary.places` and joined with a middot, so a card reads
   * "Türkiye / İstanbul · Beyoğlu" in English and its equivalent elsewhere.
   */
  eyebrow?: string[][];
  /** A development or resort name — rendered as written, in every language. */
  title: string;
  /** Key into `dictionary.menus.detail` for the line under the title. */
  detailKey?: string;
  image: string;
  href?: string;
};

export type MegaMenu =
  | {
      kind: "feature";
      cards: { key: "ourStory" | "ourTeam"; image: string; href?: string }[];
    }
  | {
      kind: "portfolio";
      viewAllHref: string;
      cards: MenuCard[];
    }
  | {
      kind: "programmes";
      cards: {
        key: "turkiye" | "caribbean";
        image: string;
        /** The programme page the card opens — /citizenship/[programme]. */
        href: string;
        /** Caribbean lists development names; Türkiye lists translated routes. */
        projects?: string[];
      }[];
    };

/** Keyed by the nav key the menu hangs from. */
export const menus: Partial<Record<NavKey, MegaMenu>> = {
  about: {
    kind: "feature",
    cards: [
      { key: "ourStory", href: "/about", image: "/images/about-our-story.webp" },
      { key: "ourTeam", image: "/images/region-turkiye.avif" },
    ],
  },

  turkiye: {
    kind: "portfolio",
    viewAllHref: "/search-property?currency=USD&location=T%C3%BCrkiye",
    cards: [
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Beyoğlu"]],
        title: "Bosphorus Heights",
        href: "/properties/bosphorus-heights",
        detailKey: "bosphorus-heights",
        image: "/images/bosphorus-heights.webp",
      },
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Beylikdüzü"]],
        title: "Marmara Vista",
        href: "/properties/marmara-vista",
        detailKey: "marmara-vista",
        image: "/images/marmara-vista.webp",
      },
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Şişli"]],
        title: "Levent Residences",
        href: "/properties/levent-residences",
        detailKey: "levent-residences",
        image: "/images/levent-residences.webp",
      },
      {
        eyebrow: [["Türkiye"], ["Muğla", "Bodrum"]],
        title: "Aegean Bay Residences",
        href: "/properties/aegean-bay-residences",
        detailKey: "aegean-bay-residences",
        image: "/images/aegean-bay.webp",
      },
      {
        eyebrow: [["Türkiye"], ["Antalya", "Konyaaltı"]],
        title: "Antalya Coast",
        detailKey: "antalya-coast",
        image: "/images/antalya-coast.webp",
      },
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Sarıyer"]],
        title: "Anatolian Villas",
        detailKey: "anatolian-villas",
        image: "/images/anatolian-villas.webp",
      },
    ],
  },

  caribbean: {
    kind: "portfolio",
    viewAllHref: "/search-property?currency=USD&location=Caribbean",
    cards: [
      {
        eyebrow: [["Grenada"], ["La Sagesse Bay"]],
        title: "The La Sagesse Collection Residences",
        detailKey: "la-sagesse-collection",
        image: "/images/cb-la-sagesse-residences.webp",
      },
      {
        eyebrow: [["Grenada"], ["La Sagesse Bay"]],
        title: "InterContinental Grenada - La Sagesse",
        detailKey: "intercontinental-grenada",
        image: "/images/caribbean-grenada.webp",
      },
      {
        eyebrow: [["Grenada"], ["La Sagesse Bay"]],
        title: "Six Senses La Sagesse",
        detailKey: "six-senses-la-sagesse",
        image: "/images/hero-six-senses.webp",
      },
      {
        eyebrow: [["Dominica"], ["Cabrits National Park"]],
        title: "InterContinental Dominica Cabrits Resort & Spa",
        detailKey: "intercontinental-dominica",
        image: "/images/cb-ic-dominica.webp",
      },
      {
        eyebrow: [["St. Kitts & Nevis"], ["Christophe Harbour"]],
        title: "Park Hyatt St. Kitts",
        detailKey: "park-hyatt-st-kitts",
        image: "/images/cb-park-hyatt.webp",
      },
      {
        eyebrow: [["Dominica"], ["Portsmouth"]],
        title: "Port Cabrits Marina",
        detailKey: "port-cabrits-marina",
        image: "/images/cb-port-cabrits.png",
      },
    ],
  },

  cbi: {
    kind: "programmes",
    cards: [
      {
        key: "turkiye",
        image: "/images/bosphorus-heights.webp",
        href: "/citizenship/turkiye",
      },
      {
        key: "caribbean",
        image: "/images/hero-la-sagesse.webp",
        href: "/citizenship/caribbean",
        projects: [
          "The La Sagesse Collection Residences",
          "InterContinental Grenada - La Sagesse",
          "Six Senses La Sagesse",
          "InterContinental Dominica Cabrits Resort & Spa",
          "Port Cabrits Marina",
          "Park Hyatt St. Kitts",
        ],
      },
    ],
  },
};

export type HeroSlide = {
  /** Key into `dictionary.hero.slides`. */
  key: string;
  /** A development name, and the place it stands in, if the design shows one. */
  name: string;
  place?: string;
  image: string;
};

export const heroSlides: HeroSlide[] = [
  { key: "six-senses", name: "Six Senses La Sagesse", image: "/images/hero-six-senses.webp" },
  {
    key: "marmara-vista",
    name: "Marmara Vista",
    place: "İstanbul",
    image: "/images/hero-beach-vista.webp",
  },
  {
    key: "levent-residences",
    name: "Levent Residences",
    place: "İstanbul",
    image: "/images/hero-beach-residences.webp",
  },
  {
    key: "aegean-bay",
    name: "Aegean Bay Residences",
    place: "Bodrum",
    image: "/images/hero-beach-house.webp",
  },
  {
    key: "la-sagesse",
    name: "The La Sagesse Collection Residences",
    image: "/images/hero-la-sagesse.webp",
  },
];

export const regions = [
  {
    key: "turkiye" as const,
    /** The caption is a run of place names, joined with a middot. */
    places: ["İstanbul", "Bodrum", "Antalya"],
    image: "/images/region-turkiye.avif",
  },
  {
    key: "caribbean" as const,
    places: ["Caribbean"],
    image: "/images/region-caribbean.avif",
  },
];

export type Property = {
  /** Key into `dictionary.turkiyeSection.descriptions`. */
  key: string;
  name: string;
  image: string;
};

export const turkiyeProperties: Property[] = [
  { key: "bosphorus-heights", name: "Bosphorus Heights", image: "/images/bosphorus-heights.webp" },
  { key: "marmara-vista", name: "Marmara Vista", image: "/images/marmara-vista.webp" },
  { key: "levent-residences", name: "Levent Residences", image: "/images/levent-residences.webp" },
  { key: "aegean-bay-residences", name: "Aegean Bay Residences", image: "/images/aegean-bay.webp" },
  { key: "antalya-coast", name: "Antalya Coast", image: "/images/antalya-coast.webp" },
  { key: "anatolian-villas", name: "Anatolian Villas", image: "/images/anatolian-villas.webp" },
];

/** Award badges. `key` selects the caption from `dictionary.awards.captions`. */
export const awardItems = [
  { key: "beachfront" as const, logo: "/logos/award-uae-realty.svg", height: 46 },
  { key: "michelin" as const, logo: "/logos/award-michelin.webp", height: 43 },
  { key: "eco" as const, logo: "/logos/award-conde-badge.webp", height: 43 },
  { key: "travel" as const, logo: "/logos/award-conde-badge.webp", height: 43 },
  { key: "newHotels" as const, logo: "/logos/award-conde-traveler.svg", height: 34 },
  { key: "luxuryHotels" as const, logo: "/logos/award-people.svg", height: 34 },
];

export type Resort = {
  /** Key into `dictionary.caribbeanSection.descriptions`. */
  key: string;
  name: string;
  logo?: string;
  /** Photography of this resort, revealed alongside it in the retreats list. */
  images?: string[];
};

export const caribbeanResorts: Resort[] = [
  {
    key: "park-hyatt-st-kitts",
    name: "Park Hyatt St. Kitts",
    images: ["/images/cb-park-hyatt.webp"],
  },
  {
    key: "intercontinental-grenada",
    name: "InterContinental Grenada - La Sagesse",
    images: ["/images/caribbean-grenada.webp"],
  },
  {
    key: "intercontinental-dominica",
    name: "InterContinental Dominica Cabrits Resort & Spa",
    images: ["/images/cb-ic-dominica.webp"],
  },
  {
    key: "six-senses-la-sagesse",
    name: "Six Senses La Sagesse",
    images: ["/images/hero-six-senses.webp", "/images/article-six-senses.avif"],
  },
  {
    key: "la-sagesse-collection",
    name: "The La Sagesse Collection Residences",
    images: [
      "/images/cb-la-sagesse-residences.webp",
      "/images/hero-la-sagesse.webp",
    ],
  },
  {
    key: "port-cabrits-marina",
    name: "Port Cabrits Marina",
    images: ["/images/cb-port-cabrits.png"],
    logo: "/logos/port-cabrits.svg",
  },
];

/**
 * The two destination panels. Place lists and stat *values* live here; their
 * headings, prose and stat labels come from `dictionary.destinations`.
 */
export const destinations = {
  turkiye: {
    /** Each entry is a run of place names joined with a middot. */
    places: [
      ["İstanbul", "Beyoğlu"],
      ["İstanbul", "Şişli"],
      ["İstanbul", "Beylikdüzü"],
      ["İstanbul", "Sarıyer"],
      ["Bodrum", "Muğla"],
      ["Antalya", "Konyaaltı"],
    ],
    stats: [
      { key: "threshold" as const, value: "$400K" },
      { key: "months" as const, value: "3–6" },
      { key: "visaFree" as const, value: "110+" },
    ],
    map: "/images/region-turkiye.avif",
  },
  caribbean: {
    /** Development names, so they are listed rather than looked up. */
    names: [
      "The La Sagesse Collection Residences",
      "InterContinental Grenada - La Sagesse",
      "Six Senses La Sagesse",
      "InterContinental Dominica Cabrits Resort & Spa",
      "Park Hyatt St. Kitts",
      "Port Cabrits Marina",
    ],
    stats: [
      { key: "years" as const, value: "15" },
      { key: "jobs" as const, value: "5,500+" },
      { key: "assisted" as const, value: "15,000" },
    ],
    map: "/images/caribbean-grenada.webp",
  },
};

export type DestinationKey = keyof typeof destinations;

/**
 * The home page shows the four most recent pieces; the full index and its
 * filters live at /media-centre, backed by the same list.
 */
export const articles = mediaArticles.slice(0, 4);

/**
 * Footer link columns. The two portfolio columns list development names, which
 * read the same in every language; the About column is keyed into
 * `dictionary.footer.aboutItems`.
 */
export const footerColumns = [
  {
    key: "turkiye" as const,
    names: [
      "Bosphorus Heights",
      "Marmara Vista",
      "Levent Residences",
      "Aegean Bay Residences",
      "Antalya Coast",
      "Anatolian Villas",
    ],
  },
  {
    key: "caribbean" as const,
    names: [
      "The La Sagesse Collection Residences",
      "InterContinental Grenada - La Sagesse",
      "Six Senses La Sagesse",
      "InterContinental Dominica Cabrits Resort & Spa",
      "Park Hyatt St. Kitts",
      "Port Cabrits Marina",
    ],
  },
];

/** The About column, keyed; `href` is unset for pages that do not exist yet. */
export const footerAboutItems = [
  { key: "ourStory" as const, href: "/about" },
  { key: "ourTeam" as const },
  { key: "turkishCitizenship" as const, href: "/citizenship/turkiye" },
  { key: "caribbeanCbi" as const, href: "/citizenship/caribbean" },
  { key: "mediaCentre" as const, href: "/media-centre" },
  { key: "construction" as const },
  { key: "terms" as const },
  { key: "privacy" as const },
];

export const contact = {
  email: "info@multimulk.com",
  phones: [
    { key: "UAE" as const, number: "+971 50 169 4283" },
    { key: "Türkiye" as const, number: "+90 543 337 7899" },
    { key: "Pakistan" as const, number: "+92 300 847 8644" },
  ],
  /** The Beykent office as Google Maps resolves it, for the embed and the link out. */
  mapQuery: "Burc Plaza, Gökevler Mah. 2312 Sk. No:18J, Beykent, Esenyurt/İstanbul",
};

/** The office on Google Maps: the keyless embed for the frame, `href` to open it. */
export function officeMap(locale: string) {
  const q = encodeURIComponent(contact.mapQuery);
  return {
    embed: `https://www.google.com/maps?q=${q}&hl=${locale}&z=15&output=embed`,
    href: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}

export const entities = ["Multi Mulk"];

/** The live company profiles, in the order the footer renders their icons. */
export const socialLinks = [
  { key: "linkedin" as const, name: "LinkedIn", href: "https://www.linkedin.com/company/multimulk/" },
  { key: "instagram" as const, name: "Instagram", href: "https://www.instagram.com/multimulk" },
  { key: "facebook" as const, name: "Facebook", href: "https://www.facebook.com/share/1BdLzoe5ki/" },
  { key: "youtube" as const, name: "YouTube", href: "https://youtube.com/@multimulk" },
  { key: "x" as const, name: "X", href: "https://x.com/multimulk" },
  { key: "tiktok" as const, name: "TikTok", href: "https://www.tiktok.com/@multimulkrealty" },
];

/** Footer names whose page exists are routed here; the rest render inert. */
export const footerLinks: Record<string, string> = {
  "Bosphorus Heights": "/properties/bosphorus-heights",
  "Marmara Vista": "/properties/marmara-vista",
  "Levent Residences": "/properties/levent-residences",
  "Aegean Bay Residences": "/properties/aegean-bay-residences",
};

export const whatsapp = {
  /** The UAE line doubles as the WhatsApp business number. */
  number: "+971 50 169 4283",
};
