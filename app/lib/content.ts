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

import { buildPath, routes, searchPath } from "./routes";

export { type Article } from "./media";

export const company = {
  name: "Multi Mulk",
};

/**
 * The card a link to this site unfurls into — in WhatsApp, iMessage, Slack,
 * LinkedIn, X. Every page falls back to it; the ones with a photograph worth
 * showing, an article or a residence, override it with their own hero.
 *
 * A branded card rather than a rendered one. The obvious alternative is
 * `next/og`, drawing each page's title onto the image at request time, and it
 * is the wrong tool *here* specifically: the site publishes in seven
 * languages, and Satori needs a font file covering every glyph it draws. Only
 * TheSeasons is bundled locally and it is Latin-only, so Arabic, Urdu, Chinese
 * and Russian titles would render as boxes — a worse card than no title at all,
 * and broken in exactly the markets the Gulf and Türkiye pages are written for.
 *
 * Dimensions are stated because Facebook and LinkedIn lay the card out before
 * the image finishes downloading; without them the first person to share a
 * page often sees a small square thumbnail instead of the wide banner.
 */
export const ogImage = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Multi Mulk — Global Solutions for Global Citizens",
};

/**
 * The top-level navigation, keyed into `dictionary.nav`.
 *
 * Organised by what Multi Mulk does rather than by where it operates. The
 * previous arrangement led with Türkiye and the Caribbean, which described the
 * portfolio accurately and the business badly: someone searching for a second
 * citizenship does not begin by choosing a region, and a first-time visitor
 * could read the whole menu without learning that citizenship advisory is the
 * practice. Regions are still reachable — under Real Estate, and through the
 * country hubs — but they are no longer the first question the site asks.
 */
export type NavKey =
  | "citizenship"
  | "goldenVisa"
  | "realEstate"
  | "protection"
  | "knowledge"
  | "about";

export type NavLink = {
  key: NavKey;
  hasMenu: boolean;
  /** The page the label itself opens. A menu may still hang beneath it. */
  href?: string;
};

export const navLinks: NavLink[] = [
  {
    key: "citizenship",
    hasMenu: true,
    href: routes.citizenshipHub.pattern,
  },
  { key: "goldenVisa", hasMenu: false, href: routes.goldenVisaHub.pattern },
  { key: "realEstate", hasMenu: true, href: routes.realEstateHub.pattern },
  {
    key: "protection",
    hasMenu: false,
    href: routes.investorProtection.pattern,
  },
  { key: "knowledge", hasMenu: false, href: routes.knowledge.pattern },
  { key: "about", hasMenu: true, href: routes.about.pattern },
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
        /**
         * The flags of the countries the card covers, filling it as a strip.
         * Türkiye is one; the Caribbean card stands for five programmes and
         * carries all five, since the region has no flag of its own.
         */
        flags: string[];
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
      {
        key: "ourStory",
        href: routes.about.pattern,
        image: "/images/about-our-story.webp",
      },
      {
        key: "ourTeam",
        href: routes.team.pattern,
        image: "/images/cbi/cbi-advisory.jpg",
      },
    ],
  },

  // Hangs from Real Estate. The Caribbean resorts that used to have a menu of
  // their own had no pages behind any of their cards, so they are reached
  // through the Caribbean programme hub and the search instead of a menu that
  // could not be clicked.
  realEstate: {
    kind: "portfolio",
    viewAllHref: searchPath({ currency: "USD", location: "Türkiye" }),
    cards: [
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Beyoğlu"]],
        title: "Bosphorus Heights",
        href: buildPath("development", { slug: "bosphorus-heights" }),
        detailKey: "bosphorus-heights",
        image: "/images/bosphorus-heights.webp",
      },
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Beylikdüzü"]],
        title: "Marmara Vista",
        href: buildPath("development", { slug: "marmara-vista" }),
        detailKey: "marmara-vista",
        image: "/images/marmara-vista.webp",
      },
      {
        eyebrow: [["Türkiye"], ["İstanbul", "Şişli"]],
        title: "Levent Residences",
        href: buildPath("development", { slug: "levent-residences" }),
        detailKey: "levent-residences",
        image: "/images/levent-residences.webp",
      },
      {
        eyebrow: [["Türkiye"], ["Muğla", "Bodrum"]],
        title: "Aegean Bay Residences",
        href: buildPath("development", { slug: "aegean-bay-residences" }),
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

  citizenship: {
    kind: "programmes",
    cards: [
      {
        key: "turkiye",
        flags: ["/images/flags/tr-waving.jpg"],
        href: buildPath("citizenshipProgramme", { programme: "turkiye" }),
      },
      {
        key: "caribbean",
        // In the order the programmes are listed in `programmes.ts`.
        flags: [
          "/images/flags/gd.svg",
          "/images/flags/dm.svg",
          "/images/flags/kn.svg",
          "/images/flags/lc.svg",
          "/images/flags/ag.svg",
        ],
        href: buildPath("citizenshipProgramme", { programme: "caribbean" }),
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

/**
 * The three things a reader can be on this site to do, in the order the
 * business ranks them. Rendered under the homepage headline so the choice is
 * the first thing offered rather than something to be found in the menu.
 */
export const heroPaths = [
  { key: "citizenship" as const, href: routes.citizenshipHub.pattern },
  { key: "residency" as const, href: routes.goldenVisaHub.pattern },
  { key: "property" as const, href: routes.realEstateHub.pattern },
];

export type HeroSlide = {
  /** Key into `dictionary.hero.slides`. */
  key: string;
  /**
   * A place name, and the country it sits in, for the pin in the corner.
   * Empty on the slides that show a document or a person rather than a
   * location — a passport photographed on a desk has no map reference, and a
   * pin under it would be inventing one.
   */
  name: string;
  place?: string;
  image: string;
  /**
   * Set on frames that are lit brightly enough that the standard wash is not
   * enough to hold white type. The hero doubles its flat scrim for these.
   */
  bright?: boolean;
};

export const heroSlides: HeroSlide[] = [
  /*
   * Dark, and deliberately so.
   *
   * The headline, the standfirst and the three paths are all set in white over
   * these, so a bright photograph does not just look wrong — it makes the copy
   * unreadable. Every frame here measures under 75 average luminance across
   * the band the text occupies; the flat-lit stock that preceded them measured
   * 126 to 178 and the buttons disappeared into it.
   *
   * The subjects are the places a second citizenship actually opens up, shot
   * at dusk and at night, plus one frame of the work itself.
   */
  {
    key: "istanbul-dusk",
    name: "İstanbul",
    place: "Türkiye",
    image: "/images/cbi/hero-istanbul-dusk.jpg",
  },
  // The one daylight frame. It measures 131 average luminance across the band
  // the headline occupies — well above the 75 the others sit under — so it
  // carries the heavier scrim rather than losing the white type into the sky.
  {
    key: "island",
    name: "",
    image: "/images/cbi/hero-island-lagoon.webp",
    bright: true,
  },
  {
    key: "dubai",
    name: "Dubai",
    place: "UAE",
    image: "/images/cbi/hero-dubai-night.jpg",
  },
  { key: "advisory", name: "", image: "/images/cbi/cbi-documents.jpg" },
];

export const regions = [
  {
    key: "turkiye" as const,
    /** The caption is a run of place names, joined with a middot. */
    places: ["İstanbul", "Bodrum", "Antalya"],
    image: "/images/cbi/cbi-istanbul-strait.jpg",
  },
  {
    key: "caribbean" as const,
    places: ["Caribbean"],
    image: "/images/cbi/cbi-caribbean-bay.webp",
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
/**
 * Awards.
 *
 * Empty, and deliberately so. The six badges that were here — a Michelin Key,
 * Condé Nast designations, "Best Beachfront Property of the Year" — were
 * carried over with the design from the reference site and belong to that
 * company's resorts. Multi Mulk's own site lists no awards, and displaying
 * someone else's is not a placeholder problem but a false claim.
 *
 * The Awards section renders nothing while this is empty. Add entries when
 * Multi Mulk has awards of its own to show.
 */
export const awardItems: { key: string; logo: string; height: number }[] = [];

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
    // Programme facts, so they come from the figures registry with their
    // sources and qualifiers attached rather than as bare strings.
    stats: [
      { key: "threshold" as const, figure: "tr.cbi.minimum-property" as const },
      { key: "months" as const, figure: "tr.cbi.processing" as const },
      { key: "visaFree" as const, figure: "tr.cbi.visa-free" as const },
    ],
    /**
     * Client-supplied artwork rather than a photograph: the Türkiye passport
     * held over the Galata Tower and a residence, which is the programme in
     * one frame — the property purchase and the document it buys. It is a
     * cutout on transparency, so the panel runs it `object-contain` on the
     * section's mist ground rather than cropping it.
     */
    passport: {
      src: "/images/cbi/cbi-passport-turkiye-collage.webp",
      position: "center",
    },
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
    // Multi Mulk's own record, taken from multimulk.com. These replaced
    // "15 Years / 5,500+ Jobs Created / 15,000 Individuals Assisted", which
    // were carried over from the reference site this design came from and
    // described a different company entirely.
    stats: [
      { key: "years" as const, value: "10+" },
      { key: "clients" as const, value: "160+" },
      { key: "properties" as const, value: "500+" },
    ],
    /**
     * The Türkiye panel's counterpart, in the same client-supplied style: an
     * Antigua and Barbuda cover — a CARICOM member, so "CARIBBEAN COMMUNITY"
     * above the arms carries the region a panel covering several islands
     * needs. Also a cutout on transparency; see the note above.
     */
    passport: {
      src: "/images/cbi/cbi-passport-caribbean-collage.webp",
      position: "center",
    },
  },
};

export type DestinationKey = keyof typeof destinations;

/**
 * How many pieces the home page's "Latest Articles" strip shows.
 *
 * The full index and its filters live at /knowledge, backed by the same list —
 * drawn from every collection, or the strip would headline "The Latest
 * Articles" over press items several months older than what the Knowledge
 * Centre is carrying.
 *
 * A count rather than the list itself: the strip now draws on the merged list,
 * which includes whatever has been published from the dashboard and so cannot
 * be resolved at module scope. The home page does the slicing.
 */
export const LATEST_ARTICLES = 4;

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
  { key: "ourStory" as const, href: routes.about.pattern },
  { key: "ourTeam" as const, href: routes.team.pattern },
  { key: "turkishCitizenship" as const, href: buildPath("citizenshipProgramme", { programme: "turkiye" }) },
  { key: "caribbeanCbi" as const, href: buildPath("citizenshipProgramme", { programme: "caribbean" }) },
  { key: "mediaCentre" as const, href: routes.knowledge.pattern },
  { key: "construction" as const },
  { key: "terms" as const },
  { key: "privacy" as const },
  // The one item here that is not waiting for copy: two Creative Commons
  // images on the site are only licensed while this link is reachable.
  { key: "imageCredits" as const, href: buildPath("legal", { slug: "image-credits" }) },
];

export const contact = {
  email: "info@multimulk.com",
  /** Dubai first: it is the head office, and the order is read as a hierarchy. */
  phones: [
    { key: "UAE" as const, number: "+971 50 169 4283" },
    { key: "Türkiye" as const, number: "+90 543 337 7899" },
    { key: "Pakistan" as const, number: "+92 300 847 8644" },
  ],
  offices: [
    {
      key: "UAE" as const,
      headOffice: true,
      address:
        "Grosvenor Business Tower, Office 1909, Al Thanyah First, Barsha Heights, Dubai",
      phone: "+971 50 169 4283",
    },
    {
      key: "Türkiye" as const,
      headOffice: false,
      address:
        "Burc Plaza, Gökevler Mah. 2312 Sk. Blok No:18J, Kat:5, Ofis No:48-49, Beykent / İstanbul",
      phone: "+90 543 337 7899",
    },
    {
      key: "Pakistan" as const,
      headOffice: false,
      address: "13 Sher Shah Block, Garden Town, Lahore, Pakistan",
      phone: "+92 300 847 8644",
    },
  ],
  /** The head office as Google Maps resolves it, for the embed and the link out. */
  mapQuery:
    "Grosvenor Business Tower, Barsha Heights, Dubai",
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
  "Bosphorus Heights": buildPath("development", { slug: "bosphorus-heights" }),
  "Marmara Vista": buildPath("development", { slug: "marmara-vista" }),
  "Levent Residences": buildPath("development", { slug: "levent-residences" }),
  "Aegean Bay Residences": buildPath("development", { slug: "aegean-bay-residences" }),
};

export const whatsapp = {
  /** The UAE line doubles as the WhatsApp business number. */
  number: "+971 50 169 4283",
};
