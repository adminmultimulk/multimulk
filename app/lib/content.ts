/**
 * All landing-page copy and asset references. Keeping it here leaves the
 * section components purely presentational.
 *
 * NOTE: project names, photography and award badges are still placeholders
 * carried over from the reference site. The photography in particular shows
 * UAE developments and is NOT Türkiye — replace every asset and figure with
 * Multi Mulk's own before this goes anywhere public.
 */

import { mediaArticles } from "./media";

export { formatArticleDate, type Article } from "./media";

export const company = {
  name: "Multi Mulk",
  tagline: "Global Solutions for Global Citizens",
};

export type NavLink = {
  label: string;
  hasMenu: boolean;
  /** Only meaningful for links without a menu; unset ones are not built yet. */
  href?: string;
};

export const nav = {
  links: [
    { label: "About", hasMenu: true },
    { label: "Türkiye", hasMenu: true },
    { label: "Caribbean", hasMenu: true },
    { label: "Citizenship by Investment", hasMenu: true },
    { label: "Media Centre", hasMenu: false, href: "/media-centre" },
    { label: "EN", hasMenu: true },
  ] satisfies NavLink[],
  actions: ["Get in Touch"],
};

export type MenuCard = {
  /** Small uppercase lines above the title, e.g. country then locality. */
  eyebrow?: string[];
  title: string;
  detail?: string;
  image: string;
  href?: string;
};

export type MegaMenu =
  | { kind: "feature"; heading: string; body: string; cards: MenuCard[] }
  | {
      kind: "portfolio";
      heading: string;
      body: string;
      viewAll: string;
      viewAllHref: string;
      cards: MenuCard[];
    }
  | {
      kind: "programmes";
      label: string;
      cards: { country: string; image: string; projects: string[] }[];
    }
  | { kind: "languages"; items: string[] };

/** Keyed by the nav link label they hang from. */
export const menus: Record<string, MegaMenu> = {
  About: {
    kind: "feature",
    heading: "About Us",
    body: "Multi Mulk is an international property and citizenship advisory, specialising in Turkish citizenship by investment and connecting global citizens with landmark residences across Türkiye and the Caribbean.",
    cards: [
      {
        title: "Our Story",
        href: "/about",
        image: "/images/about-our-story.webp",
      },
      { title: "Our Team", image: "/images/region-turkiye.avif" },
    ],
  },

  Türkiye: {
    kind: "portfolio",
    heading: "Türkiye",
    body: "From İstanbul’s two shores to the Aegean and Mediterranean coasts, Türkiye offers a setting where continents, culture and coastline converge — and a direct route to citizenship.",
    viewAll: "View All",
    viewAllHref: "/search-property?currency=USD&location=T%C3%BCrkiye",
    cards: [
      {
        eyebrow: ["Türkiye", "İstanbul · Beyoğlu"],
        title: "Bosphorus Heights",
        href: "/properties/bosphorus-heights",
        detail: "165 Apartments",
        image: "/images/bosphorus-heights.webp",
      },
      {
        eyebrow: ["Türkiye", "İstanbul · Beylikdüzü"],
        title: "Marmara Vista",
        href: "/properties/marmara-vista",
        detail: "151 Apartments",
        image: "/images/marmara-vista.webp",
      },
      {
        eyebrow: ["Türkiye", "İstanbul · Şişli"],
        title: "Levent Residences",
        href: "/properties/levent-residences",
        detail: "420 Apartments + 11 Townhouses",
        image: "/images/levent-residences.webp",
      },
      {
        eyebrow: ["Türkiye", "Muğla · Bodrum"],
        title: "Aegean Bay Residences",
        href: "/properties/aegean-bay-residences",
        detail: "88 Apartments",
        image: "/images/aegean-bay.webp",
      },
      {
        eyebrow: ["Türkiye", "Antalya · Konyaaltı"],
        title: "Antalya Coast",
        detail: "1,023 Apartments in 3 Buildings",
        image: "/images/antalya-coast.webp",
      },
      {
        eyebrow: ["Türkiye", "İstanbul · Sarıyer"],
        title: "Anatolian Villas",
        detail: "Private villas in exclusive neighbourhoods",
        image: "/images/anatolian-villas.webp",
      },
    ],
  },

  Caribbean: {
    kind: "portfolio",
    heading: "Caribbean",
    body: "Our Caribbean destinations embrace the essence of island life, crafting considered retreats where nature, architecture, and well-being exist in perfect balance.",
    viewAll: "View All",
    viewAllHref: "/search-property?currency=USD&location=Caribbean",
    cards: [
      {
        eyebrow: ["Grenada", "La Sagesse Bay"],
        title: "The La Sagesse Collection Residences",
        detail: "94 premier Apartments",
        image: "/images/cb-la-sagesse-residences.webp",
      },
      {
        eyebrow: ["Grenada", "La Sagesse Bay"],
        title: "InterContinental Grenada - La Sagesse",
        detail: "120 rooms including 30 private suites",
        image: "/images/caribbean-grenada.webp",
      },
      {
        eyebrow: ["Grenada", "La Sagesse Bay"],
        title: "Six Senses La Sagesse",
        detail: "56 pool suites with 15 pool villas",
        image: "/images/hero-six-senses.webp",
      },
      {
        eyebrow: ["Dominica", "Cabrits National Park"],
        title: "InterContinental Dominica Cabrits Resort & Spa",
        detail: "151 Guest Rooms & 10 Private Suites",
        image: "/images/cb-ic-dominica.webp",
      },
      {
        eyebrow: ["St. Kitts & Nevis", "Christophe Harbour"],
        title: "Park Hyatt St. Kitts",
        detail: "126 rooms and an exclusive yacht marina",
        image: "/images/cb-park-hyatt.webp",
      },
      {
        eyebrow: ["Dominica", "Portsmouth"],
        title: "Port Cabrits Marina",
        detail: "150-berth superyacht facility",
        image: "/images/cb-port-cabrits.png",
      },
    ],
  },

  "Citizenship by Investment": {
    kind: "programmes",
    label: "Citizenship by Investment",
    cards: [
      {
        country: "Türkiye",
        image: "/images/bosphorus-heights.webp",
        projects: [
          "USD 400,000 property route",
          "3-year holding period",
          "Spouse and children under 18 included",
        ],
      },
      {
        country: "Caribbean",
        image: "/images/hero-la-sagesse.webp",
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

  EN: {
    kind: "languages",
    items: ["EN", "AR", "RU", "FR", "ES"],
  },
};

export type HeroSlide = {
  title: string;
  location: string;
  image: string;
};

export const heroSlides: HeroSlide[] = [
  {
    title: "A Sanctuary Shaped by Sea & Forests",
    location: "Six Senses La Sagesse",
    image: "/images/hero-six-senses.webp",
  },
  {
    title: "Escape to the Centre of It All",
    location: "Marmara Vista, İstanbul",
    image: "/images/hero-beach-vista.webp",
  },
  {
    title: "A Landmark Address in İstanbul",
    location: "Levent Residences, İstanbul",
    image: "/images/hero-beach-residences.webp",
  },
  {
    title: "Wake Up to the Aegean",
    location: "Aegean Bay Residences, Bodrum",
    image: "/images/hero-beach-house.webp",
  },
  {
    title: "Beachfront Living Next to Two Iconic Resorts",
    location: "The La Sagesse Collection Residences",
    image: "/images/hero-la-sagesse.webp",
  },
];

export const welcome = {
  eyebrow: "Welcome to Multi Mulk",
  heading: "Global Solutions for Global Citizens",
  body: "Multi Mulk helps internationally minded families and investors put down roots in the world’s most desirable places. Turkish citizenship by investment is at the centre of what we do — from landmark İstanbul addresses to the Aegean coast — alongside select Caribbean programmes. We guide every step: property selection, purchase, and the citizenship application itself, with offices across Türkiye, the UAE and Pakistan.",
};

export const regions = [
  {
    label: "Türkiye",
    caption: "İstanbul · Bodrum · Antalya",
    image: "/images/region-turkiye.avif",
  },
  {
    label: "Caribbean",
    caption: "Caribbean",
    image: "/images/region-caribbean.avif",
  },
];

export type Property = {
  name: string;
  description: string;
  image: string;
};

export const turkiyeSection = {
  heading: "Turkish Citizenship Living",
  body: "Discover our portfolio of Türkiye properties, featuring contemporary architecture, prime İstanbul and coastal settings, and residences that qualify for citizenship by investment.",
  eyebrow: "Türkiye Property",
};

export const turkiyeProperties: Property[] = [
  {
    name: "Bosphorus Heights",
    description:
      "In Beyoğlu, moments from Galata and the ferry piers, Bosphorus Heights offers 165 residences framing the strait and the historic peninsula beyond.",
    image: "/images/bosphorus-heights.webp",
  },
  {
    name: "Marmara Vista",
    description:
      "Marmara Vista offers 151 exquisite studio, 1- and 2-bedroom residences on İstanbul’s western shore, with serene, panoramic views across the Marmara Sea.",
    image: "/images/marmara-vista.webp",
  },
  {
    name: "Levent Residences",
    description:
      "A landmark Şişli address minutes from the Levent financial district, with 420 apartments and 11 exclusive townhouses.",
    image: "/images/levent-residences.webp",
  },
  {
    name: "Aegean Bay Residences",
    description:
      "A haven above a quiet Bodrum bay, offering 88 luxurious studio, 1-bedroom, and 2-bedroom residences.",
    image: "/images/aegean-bay.webp",
  },
  {
    name: "Antalya Coast",
    description:
      "On the Konyaaltı shoreline, Antalya Coast offers 1,023 residences across three signature buildings, blending apartments, penthouses, and amenities.",
    image: "/images/antalya-coast.webp",
  },
  {
    name: "Anatolian Villas",
    description:
      "Discover our four villa types in Sarıyer, designed for residents seeking privacy, elegance, and a tailored approach to modern luxury.",
    image: "/images/anatolian-villas.webp",
  },
];

export const awards = {
  eyebrow: "Awards & Achievements",
  heading: "Recognized for Excellence",
  items: [
    {
      logo: "/logos/award-uae-realty.svg",
      caption: "Best Beachfront Property of the Year",
      height: 46,
    },
    {
      logo: "/logos/award-michelin.webp",
      caption: "One Michelin Key - A Very Special Stay",
      height: 43,
    },
    {
      logo: "/logos/award-conde-badge.webp",
      caption: "The Best Eco-Friendly Resort of the Year - 2025",
      height: 43,
    },
    {
      logo: "/logos/award-conde-badge.webp",
      caption: "The Best in Travel 2025",
      height: 43,
    },
    {
      logo: "/logos/award-conde-traveler.svg",
      caption: "The Best New Hotels in North America & the Caribbean",
      height: 34,
    },
    {
      logo: "/logos/award-people.svg",
      caption: "31 Incredible Luxury Hotels Opening Around the World This Year",
      height: 34,
    },
  ],
};

export type Resort = {
  name: string;
  description: string;
  logo?: string;
  /** Photography of this resort, revealed alongside it in the retreats list. */
  images?: string[];
};

export const caribbeanSection = {
  heading: "Caribbean Island Retreats",
  body: "Discover our expanding portfolio across the Caribbean—beachfront resorts and iconic branded developments that offer long-term value, immersive experiences and global appeal, with select government-approved projects also providing an approved pathway to Citizenship by Investment.",
};

export const caribbeanResorts: Resort[] = [
  {
    name: "Park Hyatt St. Kitts",
    description:
      "Park Hyatt St. Kitts, opened in 2017, presents 126 luxurious rooms and suites with island-inspired design, expansive ocean views, and access to Christophe Harbour’s marina.",
    images: ["/images/cb-park-hyatt.webp"],
  },
  {
    name: "InterContinental Grenada - La Sagesse",
    description:
      "Opening in 2026, the resort presents 120 rooms, 30+ luxury suites, exceptional dining, spa experiences, and stunning Caribbean-inspired design and architecture.",
    images: ["/images/caribbean-grenada.webp"],
  },
  {
    name: "InterContinental Dominica Cabrits Resort & Spa",
    description:
      "A luxurious retreat on Dominica’s white-sand beaches, embracing rainforest and sea, with elegant design, stunning Caribbean views, and adventure at your doorstep.",
    images: ["/images/cb-ic-dominica.webp"],
  },
  {
    name: "Six Senses La Sagesse",
    description:
      "A sanctuary of wellness and luxury, Six Senses La Sagesse offers low-rise villas, ocean vistas, and an intimate, culturally rich Grenada experience.",
    images: ["/images/hero-six-senses.webp", "/images/article-six-senses.avif"],
  },
  {
    name: "The La Sagesse Collection Residences",
    description:
      "Experience 96 exclusive residences on La Sagesse Bay, where natural beauty meets luxury, with crystal waters, sun-kissed sands, and neighbours Six Senses La Sagesse and InterContinental Grenada La Sagesse.",
    images: [
      "/images/cb-la-sagesse-residences.webp",
      "/images/hero-la-sagesse.webp",
    ],
  },
  {
    name: "Port Cabrits Marina",
    description:
      "In Bell Hall near Portsmouth, this premier waterfront destination blends seclusion, natural beauty, and world-class hospitality with superyacht berths, luxury dining, and boutique retail.",
    images: ["/images/cb-port-cabrits.png"],
    logo: "/logos/port-cabrits.svg",
  },
];

export type DestinationMarker = {
  name: string;
  /** Percentage position within the map illustration. */
  x: number;
  y: number;
  side: "left" | "right" | "below";
};

export const destinations = {
  turkiye: {
    label: "Türkiye",
    eyebrow: "İstanbul, Türkiye",
    heading: "Where Two Continents Meet",
    body: "Türkiye pairs one of the world’s great cities with a coastline that runs from the Aegean to the Mediterranean. İstanbul alone spans two continents, and the citizenship-by-investment programme makes a property purchase here a route to a second passport — a combination no other market offers at this scale.",
    places: [
      "İstanbul · Beyoğlu",
      "İstanbul · Şişli",
      "İstanbul · Beylikdüzü",
      "İstanbul · Sarıyer",
      "Bodrum · Muğla",
      "Antalya · Konyaaltı",
    ],
    stats: [
      { value: "$400K", label: "Citizenship Threshold" },
      { value: "3–6", label: "Months to Passport" },
      { value: "110+", label: "Visa-Free Destinations" },
    ],
    map: "/images/region-turkiye.avif",
  },
  caribbean: {
    label: "Caribbean",
    eyebrow: "Caribbean",
    heading: "Home to the Caribbean’s Most Iconic Destinations",
    body: "The Caribbean is home to a growing collection of the residences and resort developments we represent, spread across several island destinations — many of them tied to government-approved citizenship-by-investment routes.",
    places: [
      "The La Sagesse Collection Residences",
      "InterContinental Grenada - La Sagesse",
      "Six Senses La Sagesse",
      "InterContinental Dominica Cabrits Resort & Spa",
      "Park Hyatt St. Kitts",
      "Port Cabrits Marina",
    ],
    stats: [
      { value: "15", label: "Years" },
      { value: "5,500+", label: "Jobs Created" },
      { value: "15,000", label: "Individuals Assisted in Second Citizenship" },
    ],
    map: "/images/caribbean-grenada.webp",
  },
};

export const articlesSection = {
  heading: "The Latest Articles",
  body: "Discover all the latest updates, insights, and valuable resources right here. This hub provides blog posts, press releases, and detailed guides to keep you up to date on our projects.",
  categories: ["All", "Press Media", "Blog"],
};


/**
 * The home page shows the four most recent pieces; the full index and its
 * filters live at /media-centre, backed by the same list.
 */
export const articles = mediaArticles.slice(0, 4);

export const footer = {
  columns: [
    {
      title: "Türkiye",
      items: [
        "Bosphorus Heights",
        "Marmara Vista",
        "Levent Residences",
        "Aegean Bay Residences",
        "Antalya Coast",
        "Anatolian Villas",
      ],
    },
    {
      title: "Caribbean",
      items: [
        "The La Sagesse Collection Residences",
        "InterContinental Grenada - La Sagesse",
        "Six Senses La Sagesse",
        "InterContinental Dominica Cabrits Resort & Spa",
        "Park Hyatt St. Kitts",
        "Port Cabrits Marina",
      ],
    },
    {
      title: "About Us",
      items: [
        "Our Story",
        "Our Team",
        "Media Centre",
        "Construction Updates",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
  ],
  contact: {
    title: "Contact Us",
    address:
      "Burc Plaza, Gökevler Mah. 2312 Sk. Blok No:18J, Kat:5, Ofis No:48-49, Beykent / Istanbul",
    email: "info@multimulk.com",
    phones: [
      { label: "UAE", number: "+971 50 169 4283" },
      { label: "Türkiye", number: "+90 543 337 7899" },
      { label: "Pakistan", number: "+92 300 847 8644" },
    ],
  },
  entities: ["Multi Mulk"],
  copyright: "© 2026 Multi Mulk. All Rights Reserved.",
};

/**
 * Footer items are plain labels; the ones whose page exists are routed here.
 * Anything unlisted still renders, inert, until its page lands.
 */
export const footerLinks: Record<string, string> = {
  "Our Story": "/about",
  "Media Centre": "/media-centre",
};

export const whatsapp = {
  /** The UAE line doubles as the WhatsApp business number. */
  number: "+971 50 169 4283",
  label: "Hello!",
  message: "Hello Multi Mulk, I'd like to know more about your properties.",
};
