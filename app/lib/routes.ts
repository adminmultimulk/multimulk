/**
 * Every page on the site, in one place.
 *
 * Paths were previously written out wherever they were needed — the same
 * development URL appears in the mega menu, the footer and the portfolio list —
 * so a renamed slug broke links silently. Here a path is built from a route id
 * and its parameters, which makes a typo a compile error, and it gives the
 * sitemap, the breadcrumbs and the structured data one list to walk instead of
 * three hand-maintained ones.
 *
 * Held to the same discipline as `./i18n/config`: no `server-only`, no
 * dictionary import, no React. It has to run in a metadata Route Handler
 * (which cannot read root params), in a Server Component and in the client
 * navigation, and those are three different environments.
 *
 * Import direction is one way. This module imports the leaf content modules;
 * `content.ts` imports this one. Never the reverse — that is a cycle.
 */

import { authors } from "./authors";
import { publishedCaseStudies } from "./case-studies";
import { comparisons } from "./comparisons";
import { answeredInFull } from "./faqs";
import { knowledgeArticles } from "./knowledge";
import { legacyDevelopments } from "./legacy-developments";
import { mediaArticles } from "./media";
import { isPublishable, programmes } from "./programmes";
import { projects } from "./projects";

/**
 * The citizenship programmes that have a page.
 *
 * Owned here rather than in `citizenship.ts` so the dependency runs one way:
 * this module is what decides which URLs exist, and the content module takes
 * its keys from that. The reverse would be a cycle, since the route table
 * needs the list in order to enumerate itself.
 */
export const programmeSlugs = ["turkiye", "caribbean"] as const;

export type ProgrammeSlug = (typeof programmeSlugs)[number];

export function isProgrammeSlug(value: string): value is ProgrammeSlug {
  return (programmeSlugs as readonly string[]).includes(value);
}

export type RouteId =
  | "home"
  | "about"
  | "contact"
  | "search"
  | "knowledge"
  | "article"
  | "development"
  | "citizenshipHub"
  | "citizenshipProgramme"
  | "goldenVisaHub"
  | "goldenVisaProgramme"
  | "realEstateHub"
  | "country"
  | "compareIndex"
  | "comparison"
  | "investorProtection"
  | "faqIndex"
  | "faq"
  | "caseStudies"
  | "caseStudy"
  | "tools"
  | "authors"
  | "author"
  | "legal";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

/** Which structured-data recipes a route emits, in document order. */
export type SchemaKind =
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage"
  | "Article"
  | "FAQPage"
  | "Service"
  | "ApartmentComplex"
  | "Person"
  | "ProfilePage";

/**
 * One live instance of a dynamic pattern.
 *
 * Locale-independent by design: a slug reads the same in all seven languages,
 * which is what lets a single instance fan out into seven sitemap rows sharing
 * one `hreflang` cluster.
 */
export type RouteInstance = {
  /** Parameter name to value, e.g. `{ slug: "bodrum-or-antalya" }`. */
  values: Record<string, string>;
  /** ISO day. Feeds the sitemap's `lastModified` and schema's `dateModified`. */
  lastModified?: string;
  /** Overrides the pattern default, so a pillar can outrank a card. */
  priority?: number;
  /** Keeps a page live but out of the sitemap — thin, expired or superseded. */
  indexable?: boolean;
};

export type RouteDef = {
  id: RouteId;
  /** The path without its locale segment. `:name` marks a dynamic segment. */
  pattern: string;
  /** Breadcrumb and navigation ancestry; `home` is the implicit root. */
  parent?: RouteId;
  /** Key into `dictionary.routes`, used for the breadcrumb label. */
  labelKey: string;
  /** Enumerates the live instances. Absent for static patterns. */
  enumerate?: () => readonly RouteInstance[];
  sitemap: {
    include: boolean;
    priority: number;
    changeFrequency: ChangeFrequency;
  };
  /**
   * The page states legal or financial facts, so it must carry a visible
   * "last reviewed" line and a reviewed source for every figure on it.
   */
  regulated?: boolean;
  schema: readonly SchemaKind[];
};

export const routes: Readonly<Record<RouteId, RouteDef>> = {
  home: {
    id: "home",
    pattern: "/",
    labelKey: "home",
    sitemap: { include: true, priority: 1, changeFrequency: "weekly" },
    schema: [],
  },
  about: {
    id: "about",
    pattern: "/about",
    parent: "home",
    labelKey: "about",
    sitemap: { include: true, priority: 0.6, changeFrequency: "yearly" },
    schema: ["AboutPage"],
  },
  contact: {
    id: "contact",
    pattern: "/contact-us",
    parent: "home",
    labelKey: "contact",
    sitemap: { include: true, priority: 0.6, changeFrequency: "yearly" },
    schema: ["ContactPage"],
  },
  search: {
    id: "search",
    pattern: "/search-property",
    parent: "home",
    labelKey: "search",
    // The bare page is worth indexing; its filtered variants are not, and they
    // are excluded by `robots` on the page itself rather than from here.
    sitemap: { include: true, priority: 0.7, changeFrequency: "weekly" },
    schema: ["CollectionPage"],
  },
  knowledge: {
    id: "knowledge",
    pattern: "/knowledge",
    parent: "home",
    labelKey: "knowledge",
    sitemap: { include: true, priority: 0.8, changeFrequency: "weekly" },
    schema: ["CollectionPage"],
  },
  article: {
    id: "article",
    pattern: "/knowledge/:slug",
    parent: "knowledge",
    labelKey: "article",
    // Both sets: the pieces written for this site, and the seventy-three
    // migrated from the site it replaces. Their slugs cannot collide, because
    // a legacy slug is what its redirect points at.
    enumerate: () => [
      ...knowledgeArticles.map((article) => ({
        values: { slug: article.slug },
        lastModified: article.modified,
      })),
      ...mediaArticles.map((article) => ({
        values: { slug: article.slug },
        lastModified: article.date,
      })),
    ],
    sitemap: { include: true, priority: 0.6, changeFrequency: "monthly" },
    schema: ["Article"],
  },
  development: {
    id: "development",
    pattern: "/properties/:slug",
    parent: "search",
    labelKey: "development",
    enumerate: () => [
      ...projects.map((project) => ({ values: { slug: project.slug } })),
      ...legacyDevelopments.map((development) => ({
        values: { slug: development.slug },
      })),
    ],
    sitemap: { include: true, priority: 0.8, changeFrequency: "monthly" },
    schema: ["ApartmentComplex"],
  },

  // ── The four pillars ──────────────────────────────────────────────────

  citizenshipHub: {
    id: "citizenshipHub",
    pattern: "/citizenship-by-investment",
    parent: "home",
    labelKey: "citizenshipHub",
    sitemap: { include: true, priority: 0.95, changeFrequency: "monthly" },
    regulated: true,
    schema: ["CollectionPage"],
  },
  citizenshipProgramme: {
    id: "citizenshipProgramme",
    pattern: "/citizenship-by-investment/:programme",
    parent: "citizenshipHub",
    labelKey: "citizenshipProgramme",
    // Only signed-off programmes are enumerated, so an unreviewed one is
    // reachable for internal review but never listed or indexed — the same
    // arrangement as a `preview` locale.
    enumerate: () =>
      programmes
        .filter((p) => p.category === "citizenship" && isPublishable(p))
        .map((p) => ({
          values: { programme: p.slug },
          lastModified: p.review.reviewedOn,
        })),
    sitemap: { include: true, priority: 0.9, changeFrequency: "monthly" },
    regulated: true,
    schema: ["Service", "FAQPage"],
  },
  goldenVisaHub: {
    id: "goldenVisaHub",
    pattern: "/golden-visa",
    parent: "home",
    labelKey: "goldenVisaHub",
    sitemap: { include: true, priority: 0.95, changeFrequency: "monthly" },
    regulated: true,
    schema: ["CollectionPage"],
  },
  goldenVisaProgramme: {
    id: "goldenVisaProgramme",
    pattern: "/golden-visa/:programme",
    parent: "goldenVisaHub",
    labelKey: "goldenVisaProgramme",
    enumerate: () =>
      programmes
        .filter((p) => p.category === "residency" && isPublishable(p))
        .map((p) => ({
          values: { programme: p.slug },
          lastModified: p.review.reviewedOn,
        })),
    sitemap: { include: true, priority: 0.9, changeFrequency: "monthly" },
    regulated: true,
    schema: ["Service", "FAQPage"],
  },
  realEstateHub: {
    id: "realEstateHub",
    pattern: "/real-estate",
    parent: "home",
    labelKey: "realEstateHub",
    sitemap: { include: true, priority: 0.9, changeFrequency: "weekly" },
    schema: ["CollectionPage"],
  },
  country: {
    id: "country",
    pattern: "/countries/:country",
    parent: "home",
    labelKey: "country",
    enumerate: () =>
      [...new Set(programmes.map((p) => p.country))].map((country) => ({
        values: { country },
      })),
    sitemap: { include: true, priority: 0.7, changeFrequency: "monthly" },
    schema: ["CollectionPage"],
  },

  // ── Comparisons and the investor-protection framework ─────────────────

  compareIndex: {
    id: "compareIndex",
    pattern: "/compare",
    parent: "home",
    labelKey: "compareIndex",
    sitemap: { include: true, priority: 0.8, changeFrequency: "monthly" },
    schema: ["CollectionPage"],
  },
  comparison: {
    id: "comparison",
    pattern: "/compare/:slug",
    parent: "compareIndex",
    labelKey: "comparison",
    enumerate: () =>
      comparisons.map((comparison) => ({
        values: { slug: comparison.slug },
        lastModified: comparison.review.reviewedOn,
      })),
    sitemap: { include: true, priority: 0.85, changeFrequency: "monthly" },
    regulated: true,
    schema: ["CollectionPage"],
  },
  investorProtection: {
    id: "investorProtection",
    pattern: "/investor-protection",
    parent: "home",
    labelKey: "investorProtection",
    sitemap: { include: true, priority: 0.85, changeFrequency: "yearly" },
    schema: ["CollectionPage"],
  },
  faqIndex: {
    id: "faqIndex",
    pattern: "/faq",
    parent: "home",
    labelKey: "faqIndex",
    sitemap: { include: true, priority: 0.85, changeFrequency: "monthly" },
    regulated: true,
    schema: ["FAQPage"],
  },
  faq: {
    id: "faq",
    pattern: "/faq/:slug",
    parent: "faqIndex",
    labelKey: "faq",
    enumerate: () =>
      answeredInFull.map((entry) => ({
        values: { slug: entry.slug! },
        lastModified: entry.review?.reviewedOn,
      })),
    sitemap: { include: true, priority: 0.75, changeFrequency: "monthly" },
    regulated: true,
    schema: ["FAQPage"],
  },
  caseStudies: {
    id: "caseStudies",
    pattern: "/case-studies",
    parent: "home",
    labelKey: "caseStudies",
    sitemap: { include: true, priority: 0.8, changeFrequency: "monthly" },
    schema: ["CollectionPage"],
  },
  caseStudy: {
    id: "caseStudy",
    pattern: "/case-studies/:slug",
    parent: "caseStudies",
    labelKey: "caseStudy",
    // Only studies with written client consent are enumerated. An unconsented
    // one is unreachable rather than merely unlisted.
    enumerate: () =>
      publishedCaseStudies.map((study) => ({ values: { slug: study.slug } })),
    sitemap: { include: true, priority: 0.7, changeFrequency: "yearly" },
    schema: ["Article"],
  },
  tools: {
    id: "tools",
    pattern: "/tools",
    parent: "home",
    labelKey: "tools",
    sitemap: { include: true, priority: 0.8, changeFrequency: "monthly" },
    schema: ["CollectionPage"],
  },
  authors: {
    id: "authors",
    pattern: "/authors",
    parent: "about",
    labelKey: "authors",
    sitemap: { include: true, priority: 0.5, changeFrequency: "yearly" },
    schema: ["CollectionPage"],
  },
  author: {
    id: "author",
    pattern: "/authors/:slug",
    parent: "authors",
    labelKey: "author",
    enumerate: () =>
      Object.values(authors).map((author) => ({ values: { slug: author.slug } })),
    sitemap: { include: true, priority: 0.6, changeFrequency: "yearly" },
    schema: ["Person"],
  },
  legal: {
    id: "legal",
    pattern: "/legal/:slug",
    parent: "home",
    labelKey: "legal",
    enumerate: () =>
      ["privacy-policy", "terms"].map((slug) => ({ values: { slug } })),
    // Reachable and linked, but there is nothing to rank for here.
    sitemap: { include: false, priority: 0.1, changeFrequency: "yearly" },
    schema: [],
  },
};

/**
 * Fills a pattern's parameters. Throws on a missing one rather than emitting a
 * path with a literal `:slug` in it — a crash at build beats a 404 in
 * production.
 */
export function buildPath(
  id: RouteId,
  values: Record<string, string> = {},
): string {
  const { pattern } = routes[id];
  return pattern.replace(/:(\w+)/g, (_, key: string) => {
    const value = values[key];
    if (!value) {
      throw new Error(`Route "${id}" needs a "${key}" (pattern "${pattern}").`);
    }
    return value;
  });
}

/**
 * A link into the property search with its filters already applied.
 *
 * These were previously hand-written, percent-encoding and all — `T%C3%BCrkiye`
 * appears verbatim in three files — which is both easy to mistype and easy to
 * leave behind when a parameter name changes.
 */
export function searchPath(
  filters: {
    location?: string;
    currency?: string;
    type?: string;
    cbiOnly?: boolean;
  } = {},
): string {
  const params = new URLSearchParams();
  if (filters.currency) params.set("currency", filters.currency);
  if (filters.location) params.set("location", filters.location);
  if (filters.type) params.set("type", filters.type);
  if (filters.cbiOnly) params.set("cbi", "1");
  const query = params.toString();
  return query ? `${routes.search.pattern}?${query}` : routes.search.pattern;
}

export type ResolvedRoute = {
  id: RouteId;
  /** Locale-free path, e.g. "/media-centre/bodrum-or-antalya". */
  path: string;
  def: RouteDef;
  instance?: RouteInstance;
};

/**
 * Every live path on the site, static patterns and dynamic instances alike.
 * The sitemap walks this; so does anything that needs to reason about the
 * whole tree.
 */
export function allRoutePaths(): readonly ResolvedRoute[] {
  const resolved: ResolvedRoute[] = [];
  for (const def of Object.values(routes)) {
    if (!def.enumerate) {
      resolved.push({ id: def.id, path: def.pattern, def });
      continue;
    }
    for (const instance of def.enumerate()) {
      resolved.push({
        id: def.id,
        path: buildPath(def.id, instance.values),
        def,
        instance,
      });
    }
  }
  return resolved;
}

/**
 * The trail from the home page down to `id`, inclusive of both ends. Drives
 * the breadcrumb list and its structured data.
 */
export function ancestry(id: RouteId): readonly RouteId[] {
  const trail: RouteId[] = [];
  let current: RouteId | undefined = id;
  while (current) {
    // A malformed `parent` chain would otherwise spin forever.
    if (trail.includes(current)) break;
    trail.unshift(current);
    current = routes[current].parent;
  }
  return trail;
}
