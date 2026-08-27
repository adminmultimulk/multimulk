/**
 * Copy and asset references for /about, kept out of the section components the
 * same way `content.ts` does it for the landing page.
 *
 * NOTE: figures, photography and the leadership roster are placeholders in the
 * same sense as the rest of the site (see the note at the top of content.ts).
 * The design this page follows is Multi Mulk's; the facts still need Multi
 * Mulk's own numbers, portraits and names before launch — no individuals are
 * named here on purpose.
 */

export const aboutHero = {
  heading: "Crafting a Legacy of Unrivaled Distinction",
  body: "Our work begins with the people we act for. Multi Mulk brings together property specialists, citizenship advisors and legal counsel so that a purchase in İstanbul or on a Caribbean bay is handled as one considered decision — not a series of loose ends.",
  image: "/images/caribbean-backdrop.webp",
};

export const aboutIntro = {
  heading: "Redefining Luxury, One Destination at a Time",
  paragraphs: [
    "Multi Mulk is an international property and citizenship advisory working across two of the most compelling markets open to global citizens. In Türkiye we represent landmark residences on both shores of İstanbul and along the Aegean and Mediterranean coasts, every one of them measured against the USD 400,000 threshold that opens the Turkish citizenship-by-investment programme.",
    "In the Caribbean we work with government-approved developments in Grenada, Dominica and St. Kitts & Nevis — among them Six Senses La Sagesse, InterContinental Grenada – La Sagesse and Park Hyatt St. Kitts — where a single investment carries both a residence and a second passport. Offices in Türkiye, the UAE and Pakistan keep our clients close to the desk handling their file.",
  ],
  stats: [
    { value: "12+", label: "Developments represented" },
    { value: "15+", label: "Years of experience" },
    { value: "3", label: "Offices across two continents" },
  ],
  image: "/images/footer-aerial.png",
  imageAlt: "Waterfront residences in the Multi Mulk portfolio",
};

export type AboutRegion = {
  /** Rendered letter by letter, so keep it a single word. */
  word: string;
  label: string;
  body: string;
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
};

export const aboutRegions: AboutRegion[] = [
  {
    word: "TÜRKİYE",
    label: "Türkiye",
    body: "A country where two continents meet and a coastline runs from the Bosphorus to the Mediterranean. Our Türkiye developments pair central city addresses with quiet coastal bays — and a direct, government-backed route to citizenship.",
    cta: {
      label: "Learn More",
      href: "/search-property?currency=USD&location=T%C3%BCrkiye",
    },
    image: "/images/bosphorus-heights.webp",
    imageAlt: "İstanbul residences overlooking the Bosphorus",
  },
  {
    word: "CARIBBEAN",
    label: "Caribbean",
    body: "A world of calm waters, soft horizons, and unhurried beauty. Our Caribbean destinations embrace the essence of island life, crafting considered retreats where nature, architecture, and well-being exist in perfect balance.",
    cta: {
      label: "Learn More",
      href: "/search-property?currency=USD&location=Caribbean",
    },
    image: "/images/region-caribbean.avif",
    imageAlt: "A Caribbean resort above the bay at dusk",
  },
];

export const aboutPrinciples = {
  heading: "The Principles Behind Everything We Build",
  image: "/images/hero-la-sagesse.webp",
  items: [
    {
      number: "01",
      title: "Craftsmanship That Defines Luxury",
      body: "The residences we represent are held to the precision and artistry found in the world’s most exclusive real estate. From bespoke interiors to immersive outdoor spaces, we look for an uncompromising level of detail — the kind that still reads as considered a decade after handover.",
    },
    {
      number: "02",
      title: "Advice Before Inventory",
      body: "A second citizenship is a legal undertaking before it is a purchase. We set out the thresholds, the holding periods and the timelines in plain terms, and we say when a project is the wrong fit. Clients are guided through selection, purchase and the application itself by one team.",
    },
    {
      number: "03",
      title: "Lifestyle-Centric Experiences",
      body: "Beyond properties, we look for lifestyle destinations — from İstanbul’s connected districts to serene waterfront enclaves and elevated wellness retreats, chosen around how people aspire to live. Connection, privacy and well-being are what hold value long after the paperwork closes.",
    },
  ],
};

export const aboutDevelopments = {
  heading: "Our Latest Developments",
  body: "Explore our newest residential and hospitality developments across Türkiye and the Caribbean, crafted to deliver refined living, long-term value, and exceptional lifestyle experiences.",
  cards: [
    {
      title: "Bosphorus Heights",
      body: "165 residences in Beyoğlu framing the strait and the historic peninsula beyond.",
      image: "/images/bosphorus-heights.webp",
      href: "/properties/bosphorus-heights",
    },
    {
      title: "Aegean Bay Residences",
      body: "A haven above a quiet Bodrum bay, offering 88 studio, 1- and 2-bedroom residences.",
      image: "/images/aegean-bay.webp",
      href: "/properties/aegean-bay-residences",
    },
    {
      title: "The La Sagesse Collection Residences",
      body: "A limited selection of 94 premier apartments at the edge of a private Grenadian beach, beside Six Senses La Sagesse.",
      image: "/images/cb-la-sagesse-residences.webp",
      href: "/search-property?currency=USD&location=Caribbean",
    },
  ],
  actions: [
    {
      label: "Explore Türkiye Properties",
      href: "/search-property?currency=USD&location=T%C3%BCrkiye",
    },
    {
      label: "Explore Caribbean Properties",
      href: "/search-property?currency=USD&location=Caribbean",
    },
  ],
};

export const aboutLeadership = {
  heading: "Leading with Expertise & Vision",
  body: "At the core of our work is a team of property specialists, citizenship advisors and legal counsel spread across three offices. Each file is led end to end by the desk closest to the client, so the person who answers the first question is the person who sees the application through.",
  cta: { label: "Get in Touch", href: "/contact-us" },
  people: [
    {
      name: "Sajid Ali Haydar",
      title: "Chief Executive Officer",
      image: "/images/team/sajid-ali-haydar.webp",
    },
    {
      name: "Nader Djebbi",
      title: "Chief Growth Officer",
      image: "/images/team/nader-djebbi.webp",
    },
  ],
};

export const aboutMap = {
  heading:
    "From coastlines to islands, our work centres on environments that support a calmer, more connected lifestyle.",
  body: "Across Türkiye and the Caribbean we focus on places shaped by their surroundings — designed with clarity, comfort, and a sense of belonging. Each development we represent reflects the same commitment to thoughtful architecture, natural settings, and a lifestyle that feels effortless and genuine.",
  places: [
    { name: "Bosphorus Heights", region: "İstanbul · Beyoğlu" },
    { name: "Levent Residences", region: "İstanbul · Şişli" },
    { name: "Marmara Vista", region: "İstanbul · Beylikdüzü" },
    { name: "Aegean Bay Residences", region: "Muğla · Bodrum" },
    { name: "Antalya Coast", region: "Antalya · Konyaaltı" },
    { name: "The La Sagesse Collection", region: "Grenada · La Sagesse Bay" },
  ],
  image: "/images/region-caribbean.avif",
  imageAlt: "Aerial view of a Multi Mulk destination",
};

export const aboutPlaces = [
  {
    title: "İstanbul",
    caption: "Where two continents meet",
    image: "/images/bosphorus-heights.webp",
  },
  {
    title: "Bodrum",
    caption: "The Aegean coast",
    image: "/images/aegean-bay.webp",
  },
  {
    title: "Antalya",
    caption: "The turquoise coast",
    image: "/images/antalya-coast.webp",
  },
  {
    title: "Grenada",
    caption: "La Sagesse Bay",
    image: "/images/caribbean-grenada.webp",
  },
];
