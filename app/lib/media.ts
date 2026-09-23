/**
 * The Knowledge Centre's featured hero rotation, the newsletter band that
 * closes it, and the pieces written for this site.
 *
 * The articles below are the English source. Headlines and bodies are staged
 * for translation: a language supplies whatever it has under
 * `dictionary.articles.copy[slug]` and anything missing falls back to the text
 * here — see `resolveArticle`. That is what separates them from the migrated
 * pieces in `knowledge.ts`, which are English-only; the index at /knowledge
 * lists both, merged by `allArticles` there.
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
import type { ArticleCategory } from "./sections";
import type { Topic } from "./topics";

/**
 * Press, blog, publication, market insight or event — defined in
 * `sections.ts`, which is where the four News & Insights sections map onto it,
 * and re-exported here because this is where everything that files an article
 * already imports from.
 */
export type { ArticleCategory };

export type Article = {
  /** Also the URL: /knowledge/<slug>. */
  slug: string;
  category: ArticleCategory;
  /**
   * Pillars this sits under, which is what the Knowledge Centre index filters
   * on, and what its related rail matches against. Category — press or our own
   * writing — answers a different question, and is what the home page's
   * "Latest Articles" strip still files on.
   */
  topics: Topic[];
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

/**
 * The home page strip's filter, which is the two article categories and not
 * the whole filing axis: the strip is headlined "Latest Articles", and a
 * publication or a market insight is read in its own section.
 */
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
    topics: ["turkiye", "real-estate"],
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
    topics: ["citizenship", "turkiye"],
    date: "2026-04-02",
    title: "A Guide to Turkish Citizenship by Investment in 2026",
    image: "/images/bosphorus-heights.webp",
    hero: "/images/cbi/cbi-istanbul-strait.jpg",
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
    topics: ["turkiye", "real-estate"],
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
    slug: "caribbean-routes-for-gulf-investors",
    category: "Press Media",
    topics: ["citizenship"],
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
    topics: ["turkiye", "real-estate"],
    date: "2025-06-26",
    title: "Five Things to Know Before Buying Property in İstanbul",
    image: "/images/anatolian-villas.webp",
    hero: "/images/cbi/cbi-advisory.jpg",
    body: [
      "İstanbul rewards buyers who do their homework and punishes those who treat it as a single market. Five points come up in nearly every transaction we handle.",
      "First, the city is not one market but dozens. A price per square metre in Şişli tells you nothing about Beykoz, and the European and Asian sides move on different cycles. Second, the official valuation report — not the asking price — governs both the citizenship threshold and the transfer tax, so obtain it early.",
      "Third, check the iskan, the occupancy permit. A building without one cannot be legally occupied and can be difficult to resell regardless of how finished it looks. Fourth, budget for the costs around the price: transfer tax, notary and translation fees, and the compulsory earthquake insurance policy.",
      "Fifth, and least glamorous: read the management agreement. Service charges on towers with extensive amenity floors vary widely, and they are the running cost that most often surprises overseas owners in the second year.",
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
    { slug: "caribbean-routes-for-gulf-investors", image: "/images/caribbean-backdrop.webp" },
  ] satisfies MediaHeroSlide[],
};

export const mediaNewsletter = {
  href: "/contact-us",
  image: "/images/hero-la-sagesse.webp",
};
