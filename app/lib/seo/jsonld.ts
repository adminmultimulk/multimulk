/**
 * Structured-data recipes.
 *
 * Pure builders: each takes content plus the current locale and returns nodes
 * for `<JsonLd>` to render. Nothing here reaches for the request, so a builder
 * can run in a page, in a layout, or eventually in a Route Handler.
 *
 * The `@id`s below are stable URLs, which is what lets a node on one page
 * reference a node defined on another — every article names the same publisher
 * rather than restating it, and search engines resolve them to one entity.
 */

import type {
  Article as ArticleNode,
  BreadcrumbList,
  Organization,
  Thing,
  WebSite,
} from "schema-dts";

import { contact, socialLinks } from "../content";
import type { Project } from "../projects";
import { hreflangFor, type Locale } from "../i18n/config";
import { absoluteUrl } from "../site";
import { ancestry, buildPath, routes, type RouteId } from "../routes";
import type { LegalReview } from "../review";

export const ORG_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

const localePath = (locale: Locale, path: string) =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

/** The absolute URL of a route, in one language. */
export function routeUrl(
  locale: Locale,
  id: RouteId,
  values?: Record<string, string>,
): string {
  return absoluteUrl(localePath(locale, buildPath(id, values)));
}

/**
 * Multi Mulk itself. Emitted once, from the root layout, and referenced by
 * `@id` everywhere else.
 *
 * Typed as a professional service rather than a bare organisation: that is the
 * schema.org type for an advisory practice, and it descends from
 * `LocalBusiness` and `Organization`, so the address, contact points and
 * social profiles below are all still in scope.
 */
export function organization(locale: Locale): Organization {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "Multi Mulk",
    url: absoluteUrl(`/${locale}`),
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.mapQuery,
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    // One contact point per office, so the number a reader is shown matches
    // the region they are in.
    contactPoint: contact.phones.map((phone) => ({
      "@type": "ContactPoint" as const,
      telephone: phone.number,
      contactType: "sales",
      areaServed: phone.key === "Türkiye" ? "TR" : phone.key === "UAE" ? "AE" : "PK",
      availableLanguage: ["en", "ar", "tr", "ru", "ur", "fr", "zh"],
    })),
    sameAs: socialLinks.map((link) => link.href),
    areaServed: ["AE", "TR", "PK", "GD", "DM", "KN"].map((code) => ({
      "@type": "Country" as const,
      name: code,
    })),
  };
}

/**
 * The site, and the fact that it can be searched. The `q` parameter is the one
 * `/search-property` already reads.
 */
export function webSite(locale: Locale): WebSite {
  const url = absoluteUrl(`/${locale}`);
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url,
    name: "Multi Mulk",
    inLanguage: hreflangFor[locale],
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(
          localePath(locale, routes.search.pattern),
        )}?q={search_term_string}`,
      },
      // schema.org requires this exact shape; it is not a typo.
      "query-input": "required name=search_term_string",
    } as WebSite["potentialAction"],
  };
}

/**
 * The trail to a page, built from the route registry rather than written out —
 * so it cannot drift from the parent chain the navigation uses.
 *
 * `labels` supplies the name for each step; a dynamic route's own name (an
 * article headline, a development) is passed in as `leafLabel`, because it
 * comes from content rather than from the dictionary.
 */
export function breadcrumbs({
  locale,
  id,
  values,
  labels,
  leafLabel,
}: {
  locale: Locale;
  id: RouteId;
  values?: Record<string, string>;
  labels: Record<string, string>;
  leafLabel?: string;
}): BreadcrumbList {
  const trail = ancestry(id);
  return {
    "@type": "BreadcrumbList",
    "@id": `${routeUrl(locale, id, values)}#breadcrumb`,
    itemListElement: trail.map((step, index) => {
      const isLeaf = index === trail.length - 1;
      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name:
          isLeaf && leafLabel ? leafLabel : labels[routes[step].labelKey] ?? "",
        // Only the leaf may need parameters; ancestors are static patterns.
        item: routeUrl(locale, step, isLeaf ? values : undefined),
      };
    }),
  };
}

/**
 * An article.
 *
 * Press coverage and Multi Mulk's own writing are different things — the first
 * ran somewhere else and carries a source — so they are typed differently
 * rather than flattened into one.
 */
export function article(
  locale: Locale,
  item: {
    slug: string;
    title: string;
    date: string;
    /** ISO day last changed; falls back to the publication date. */
    modified?: string;
    source?: string;
    image?: string;
    hero?: string;
    /** Paragraphs; the first is used as the description. */
    body: readonly string[];
  },
  authorName = "Multi Mulk",
): ArticleNode {
  const url = routeUrl(locale, "article", { slug: item.slug });
  const isPress = Boolean(item.source);
  const image = item.hero ?? item.image;

  return {
    "@type": isPress ? "NewsArticle" : "BlogPosting",
    "@id": `${url}#article`,
    headline: item.title,
    description: item.body[0],
    image: image ? absoluteUrl(image) : undefined,
    datePublished: item.date,
    dateModified: item.modified ?? item.date,
    inLanguage: hreflangFor[locale],
    mainEntityOfPage: url,
    publisher: { "@id": ORG_ID },
    author: isPress
      ? { "@type": "Organization", name: item.source! }
      : { "@type": "Organization", "@id": ORG_ID, name: authorName },
  };
}

/** A question-and-answer set. */
export function faqPage(
  id: string,
  entries: readonly { question: string; answer: string }[],
): Thing {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: entries.map((entry) => ({
      "@type": "Question" as const,
      name: entry.question,
      acceptedAnswer: { "@type": "Answer" as const, text: entry.answer },
    })),
  } as Thing;
}

/** A citizenship or residency programme, as a service Multi Mulk provides. */
export function service({
  locale,
  slug,
  name,
  description,
  areaServed,
  review,
}: {
  locale: Locale;
  slug: string;
  name: string;
  description: string;
  areaServed: string;
  review: LegalReview;
}): Thing {
  const url = routeUrl(locale, "citizenshipProgramme", { programme: slug });
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType: "Citizenship by investment advisory",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: areaServed },
    url,
    // The same date the page shows the reader. For content of this kind,
    // when it was last checked is part of what makes it trustworthy.
    dateModified: review.reviewedOn,
  } as Thing;
}

/** A development, with the units and amenities it is sold on. */
export function apartmentComplex(
  locale: Locale,
  project: Project,
  unitCount: number,
): Thing {
  const url = routeUrl(locale, "development", { slug: project.slug });
  return {
    "@type": "ApartmentComplex",
    "@id": `${url}#development`,
    name: project.name,
    description: project.description,
    url,
    image: absoluteUrl(project.image),
    numberOfAccommodationUnits: {
      "@type": "QuantitativeValue",
      value: unitCount,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: project.location,
      addressCountry: project.country,
    },
    amenityFeature: project.amenities.items.map((item) => ({
      "@type": "LocationFeatureSpecification" as const,
      name: item,
      value: true,
    })),
  } as Thing;
}

/**
 * One listed residence.
 *
 * `Apartment` rather than `ApartmentComplex`: this is a unit, and the offer
 * attached to it is a price somebody can act on. The development it sits in,
 * where the site knows it as one, has its own node on its own page — they are
 * two things, and conflating them would tell a search engine there is a
 * building for sale at a one-bedroom price.
 */
export function residence(
  locale: Locale,
  listing: {
    slug: string;
    project: string;
    location: string;
    country: string;
    prices: { USD: number };
    image: string;
    description: string | null;
    amenities: readonly string[];
    soldOut: boolean;
  },
  /** Already localised — the layout half of the name is translated. */
  name: string,
  url: string,
): Thing {
  return {
    "@type": "Apartment",
    "@id": `${url}#residence`,
    name,
    url,
    ...(listing.description ? { description: listing.description } : {}),
    image: absoluteUrl(listing.image),
    containedInPlace: { "@type": "Place", name: listing.project },
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.location,
      addressCountry: listing.country,
    },
    amenityFeature: listing.amenities.map((item) => ({
      "@type": "LocationFeatureSpecification" as const,
      name: item,
      value: true,
    })),
    offers: {
      "@type": "Offer",
      price: listing.prices.USD,
      priceCurrency: "USD",
      availability: listing.soldOut
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url,
    },
    inLanguage: hreflangFor[locale],
  } as Thing;
}

/**
 * An index page. Children are referenced by `@id` rather than inlined — the
 * full node lives on the page it describes, and repeating it here would be two
 * definitions of one thing.
 */
export function collectionPage({
  locale,
  id,
  values,
  name,
  description,
  itemUrls,
}: {
  locale: Locale;
  id: RouteId;
  values?: Record<string, string>;
  name: string;
  description: string;
  itemUrls: readonly string[];
}): Thing {
  const url = routeUrl(locale, id, values);
  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name,
    description,
    inLanguage: hreflangFor[locale],
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemUrls.map((item, index) => ({
        "@type": "ListItem" as const,
        position: index + 1,
        url: item,
      })),
    },
  } as Thing;
}
