/**
 * Media Centre: the featured hero rotation, the article index behind
 * /media-centre, the article pages at /media-centre/<slug>, and the
 * newsletter band that closes both.
 *
 * The articles below are the English source. Headlines and bodies are staged
 * for translation: a language supplies whatever it has under
 * `dictionary.articles.copy[slug]` and anything missing falls back to the text
 * here — see `resolveArticle`.
 *
 * This is the single source of truth for articles — the home page's "Latest
 * Articles" strip takes the four most recent from here (see content.ts), and
 * every article link on the site resolves against a slug in this file.
 *
 * NOTE: placeholder content — headlines, outlets, dates, body copy and
 * photography are stand-ins pending Multi Mulk's real press archive. See the
 * note at the top of content.ts.
 */

import {
  pick,
  pickAll,
  type ArticleCopy,
} from "./i18n/format";

export type ArticleCategory = "Press Media" | "Blog";

export type Article = {
  /** Also the URL: /media-centre/<slug>. */
  slug: string;
  category: ArticleCategory;
  /** ISO day; render it through `formatArticleDate`, never directly. */
  date: string;
  /** Publication the piece ran in. Absent on Multi Mulk's own posts. */
  source?: string;
  title: string;
  /** Card thumbnail, ~3:2. */
  image: string;
  /**
   * Wide banner for the article page, ~8:3. Falls back to `image`, which
   * crops acceptably but is not framed for a full-bleed header.
   */
  hero?: string;
  /** Article body, one string per paragraph. The first is the standfirst. */
  body: string[];
  /**
   * Where "Read More" points — the original coverage for press items, a PDF
   * or a related page for our own posts. The button is omitted without it.
   */
  readMore?: string;
};

export const articleCategories = ["All", "Press Media", "Blog"] as const;
export type ArticleFilter = (typeof articleCategories)[number];

export const sortOptions = ["Newest", "Oldest"] as const;
export type SortOption = (typeof sortOptions)[number];

/** Cards shown before "Load More" reveals the next batch. */
export const ARTICLES_PER_PAGE = 8;

/**
 * Ordered newest first. Keep it that way — `content.ts` slices the head of
 * this list for the home page, and the grid's default sort assumes it.
 */
export const mediaArticles: Article[] = [
  {
    slug: "levent-residences-tops-out",
    category: "Press Media",
    date: "2026-06-18",
    source: "Daily Sabah",
    title: "Levent Residences Tops Out as Şişli’s Newest Landmark Address",
    image: "/images/levent-residences.webp",
    hero: "/images/hero-beach-residences.webp",
    body: [
      "Levent Residences has reached its full height on the Şişli skyline, marking the structural completion of Multi Mulk’s most central İstanbul development. The topping-out was observed on site by the project team, the contractor and district officials, and brings the tower into its fit-out phase ahead of handover.",
      "The building rises above the Levent financial district with direct metro access, and its upper floors take in the Bosphorus to the east and the Belgrad Forest to the north. Interiors are being delivered in three palettes, with the residents’ floor — pool, spa, screening room and a landscaped terrace — occupying the podium.",
      "Multi Mulk is releasing the remaining residences in phases. Enquiries for the current release are handled through the İstanbul sales office.",
    ],
  },
  {
    slug: "turkish-citizenship-guide-2026",
    category: "Blog",
    date: "2026-04-02",
    title: "A Guide to Turkish Citizenship by Investment in 2026",
    image: "/images/bosphorus-heights.webp",
    hero: "/images/region-turkiye.avif",
    body: [
      "Türkiye’s citizenship-by-investment route remains one of the most direct in the world: a qualifying property purchase, held for three years, opens a path to a Turkish passport for the buyer, their spouse and dependent children. This guide sets out how the programme works in practice in 2026.",
      "The property threshold stands at USD 400,000, assessed against an official valuation report rather than the contract price — a distinction that catches out buyers who budget to the threshold exactly. The valuation must be prepared by a licensed appraiser, and the title deed is annotated with the three-year holding commitment at registration.",
      "Applications run in parallel rather than in sequence: the title transfer, the residence permit and the citizenship file can all be progressed at once, which is what keeps the typical timeline to between four and eight months. The holding period is measured from the date of the annotation, not from the date of application.",
      "Multi Mulk’s İstanbul and coastal developments are all valued above the threshold and are delivered with the documentation the application requires. Our advisory team works alongside your legal counsel through to the passport interview.",
    ],
  },
  {
    slug: "aegean-bay-residences-opens",
    category: "Press Media",
    date: "2026-02-11",
    source: "Hürriyet Daily News",
    title: "Aegean Bay Residences Opens Above a Quiet Bodrum Bay",
    image: "/images/aegean-bay.webp",
    hero: "/images/hero-beach-house.webp",
    body: [
      "Aegean Bay Residences has opened on the Bodrum peninsula, on a south-facing slope above a bay that stays quiet outside the summer weeks. The development steps down the hillside in low terraces so that no residence looks onto another’s terrace, and every unit holds an uninterrupted line to the water.",
      "The scheme runs to a beach club, a jetty for tenders, two restaurants and a spa built into the rock at the shoreline. Landscaping is drawn from the existing maquis — olive, carob and lentisk — rather than imported planting, which keeps the site legible from the sea as a hillside rather than a resort.",
    ],
  },
  {
    slug: "bodrum-or-antalya",
    category: "Blog",
    date: "2025-11-20",
    title: "Bodrum or Antalya? Choosing Your Stretch of the Turkish Coast",
    image: "/images/antalya-coast.webp",
    hero: "/images/hero-beach-vista.webp",
    body: [
      "Both names come up in almost every coastal enquiry we take, and they are genuinely different propositions. The short version: Bodrum is a season, Antalya is a year.",
      "Bodrum’s peninsula is compact, sailing-led and intensely social between June and September, with a rental market concentrated in those weeks and a marina culture that sets the tone for everything around it. Prices per square metre run higher than Antalya, and the best sites — the north-facing bays with afternoon shade — are effectively finite.",
      "Antalya is the larger, steadier market. The airport carries traffic all year, the old town supports a resident population rather than a seasonal one, and the mountains behind the city keep the winters mild enough that occupancy holds through the shoulder months. For buyers weighing rental yield against personal use, that spread matters more than the headline summer rate.",
      "If the purchase is principally a holiday home you will use in August, Bodrum. If it is an asset you want working twelve months a year, Antalya.",
    ],
  },
  {
    slug: "caribbean-routes-for-gulf-investors",
    category: "Press Media",
    date: "2025-10-10",
    source: "Arabian Business",
    title: "Multi Mulk Brings Caribbean Citizenship Routes to Gulf Investors",
    image: "/images/caribbean-grenada.webp",
    hero: "/images/caribbean-backdrop.webp",
    body: [
      "Multi Mulk has opened its Caribbean portfolio to Gulf-based investors, pairing its Türkiye advisory practice with approved developments in Grenada, St Kitts and Nevis, and Dominica. The move answers steady demand from clients holding Turkish residency who want a second, visa-light travel document alongside it.",
      "The developments are government-approved projects under each island’s citizenship-by-investment programme, and include the Six Senses La Sagesse residences in Grenada and Park Hyatt St. Kitts at Christophe Harbour. Grenada’s programme carries the additional benefit of E-2 treaty access to the United States.",
      "Applications are filed through licensed local agents; Multi Mulk’s role is the property selection, the due-diligence pack and the coordination between the two.",
    ],
  },
  {
    slug: "buying-property-in-istanbul",
    category: "Blog",
    date: "2025-06-26",
    title: "Five Things to Know Before Buying Property in İstanbul",
    image: "/images/anatolian-villas.webp",
    hero: "/images/about-our-story.webp",
    body: [
      "İstanbul rewards buyers who do their homework and punishes those who treat it as a single market. Five points come up in nearly every transaction we handle.",
      "First, the city is not one market but dozens. A price per square metre in Şişli tells you nothing about Beykoz, and the European and Asian sides move on different cycles. Second, the official valuation report — not the asking price — governs both the citizenship threshold and the transfer tax, so obtain it early.",
      "Third, check the iskan, the occupancy permit. A building without one cannot be legally occupied and can be difficult to resell regardless of how finished it looks. Fourth, budget for the costs around the price: transfer tax, notary and translation fees, and the compulsory earthquake insurance policy.",
      "Fifth, and least glamorous: read the management agreement. Service charges on towers with extensive amenity floors vary widely, and they are the running cost that most often surprises overseas owners in the second year.",
    ],
  },
  {
    slug: "port-cabrits-marina",
    category: "Press Media",
    date: "2025-03-14",
    source: "Robb Report",
    title: "Port Cabrits Marina Sets a New Standard for Caribbean Yachting",
    image: "/images/cb-ic-dominica.webp",
    hero: "/images/cb-port-cabrits.png",
    body: [
      "Port Cabrits, on Dominica’s north-west coast, has been described as the most significant marina development in the eastern Caribbean in a decade. The deep-water berths take vessels up to 90 metres, and the harbour sits inside the shelter of the Cabrits headland, which keeps it workable through the winter swell.",
      "Above the waterfront, the InterContinental Dominica Cabrits Resort & Spa provides the shoreside infrastructure — a marina village, provisioning, customs clearance and crew accommodation — that the region has historically lacked outside Antigua and St Maarten.",
    ],
  },
  {
    slug: "christophe-harbour-rising",
    category: "Press Media",
    date: "2024-12-05",
    source: "Condé Nast Traveller",
    title: "Park Hyatt St. Kitts and the Rise of Christophe Harbour",
    image: "/images/cb-park-hyatt.webp",
    hero: "/images/cb-la-sagesse-residences.webp",
    body: [
      "Christophe Harbour occupies the south-east peninsula of St Kitts, a stretch of salt ponds and dry hills that was effectively empty a decade ago and now carries a superyacht marina, a beach club and the Park Hyatt St. Kitts.",
      "The hotel sits on Banana Bay with Nevis across the narrows, and its residences are among the qualifying properties under the St Kitts and Nevis citizenship programme — the oldest such programme in the world, running since 1984.",
    ],
  },
  {
    slug: "six-senses-la-sagesse-michelin-key",
    category: "Press Media",
    date: "2024-10-30",
    title:
      "Discover Paradise: Why Six Senses La Sagesse, Grenada is a One-MICHELIN-Key Luxury Escape",
    image: "/images/article-six-senses.avif",
    hero: "/images/hero-six-senses.webp",
    body: [
      "Six Senses La Sagesse has been awarded One MICHELIN Key, the guide’s distinction for hotels that offer an exceptional stay. It is the brand’s first property in the Caribbean, set across two beaches on Grenada’s south-east coast.",
      "The resort is built around the ruins of a former estate house, with 56 suites and 15 residential villas laid out along the shoreline of La Sagesse Bay and Chemin Bay. The Six Senses wellness programme runs from a spa and earth lab set back in the palms, and the kitchen sources from the island’s own growers and the fishing boats at the bay.",
      "The villas qualify under Grenada’s citizenship-by-investment programme, which carries E-2 treaty access to the United States.",
    ],
  },
  {
    slug: "marmara-vista-presentation-istanbul",
    category: "Press Media",
    date: "2024-10-17",
    source: "Russian Emirates",
    title: "В Стамбуле состоялась презентация жилого комплекса Marmara Vista",
    image: "/images/article-beach-vista-1.webp",
    hero: "/images/marmara-vista.webp",
    body: [
      "Multi Mulk presented Marmara Vista to invited guests, partners and press in İstanbul, unveiling the masterplan and the first release of residences on the Sea of Marmara shoreline.",
      "The presentation set out the development’s three phases, the amenity programme and the delivery schedule, alongside the citizenship-by-investment pathway available to overseas purchasers. Attendees were shown the show apartment and the material palette selected for the first phase.",
    ],
  },
  {
    slug: "marmara-vista-launch",
    category: "Press Media",
    date: "2024-10-16",
    source: "Arabian Business",
    title: "Introducing the prestigious launch of Marmara Vista, İstanbul",
    image: "/images/article-beach-vista-2.webp",
    hero: "/images/hero-beach-vista.webp",
    body: [
      "Marmara Vista launches on the Sea of Marmara with 240 residences arranged across three low-rise buildings, each turned to hold a sea view from the principal rooms. It is Multi Mulk’s largest İstanbul release to date.",
      "The development is delivered with a private beach, a residents’ marina berth allocation, a spa and a school within the masterplan. All residences are priced above the citizenship-by-investment threshold.",
    ],
  },
  {
    slug: "istanbul-portfolio-expansion",
    category: "Press Media",
    date: "2024-10-16",
    source: "Gulf News",
    title: "Multi Mulk expands its İstanbul portfolio",
    image: "/images/article-beach-vista-3.webp",
    hero: "/images/listing-hero.png",
    body: [
      "Multi Mulk has added three developments to its İstanbul portfolio, taking the number of live projects in the city to eight and extending its coverage from the Bosphorus corridor to the Marmara shoreline.",
      "The expansion follows sustained demand from Gulf and Central Asian buyers, for whom İstanbul continues to combine a citizenship route with a functioning domestic rental market — a pairing few programmes offer.",
    ],
  },
];

/**
 * An article with this language's headline and body swapped in where they
 * exist. Everything else — slug, date, source, photography — is the same in
 * every language, so it passes straight through.
 */
export function resolveArticle(article: Article, copy: ArticleCopy | undefined): Article {
  if (!copy) return article;
  return {
    ...article,
    title: pick(copy.title, article.title),
    body: pickAll(copy.body, article.body),
  };
}

export function getArticle(slug: string) {
  return mediaArticles.find((article) => article.slug === slug);
}

/**
 * The rail beside an article. Same-category pieces come first — a press item
 * sits next to press, a guide next to guides — and the newest of whatever is
 * left fills the remainder, so the rail is never short.
 */
export function relatedArticles(slug: string, count = 2) {
  const others = mediaArticles.filter((article) => article.slug !== slug);
  const current = getArticle(slug);
  const sameCategory = others.filter((a) => a.category === current?.category);
  return [...sameCategory, ...others.filter((a) => !sameCategory.includes(a))]
    .slice(0, count);
}

export type MediaHeroSlide = {
  /** Matches an article slug so the feature and its card stay in step. */
  slug: string;
  image: string;
};

export const mediaHero = {
  /** Titles are read from the article each slug points at, so the two cannot drift. */
  slides: [
    { slug: "levent-residences-tops-out", image: "/images/hero-beach-residences.webp" },
    { slug: "aegean-bay-residences-opens", image: "/images/hero-beach-house.webp" },
    { slug: "six-senses-la-sagesse-michelin-key", image: "/images/hero-six-senses.webp" },
  ] satisfies MediaHeroSlide[],
};

export const mediaNewsletter = {
  href: "/contact-us",
  image: "/images/hero-la-sagesse.webp",
};
