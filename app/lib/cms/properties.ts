import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/app/lib/db";
import { units, type Unit } from "@/app/lib/properties";
import { PROPERTIES_TAG } from "./tags";

/**
 * The listings shown on /search-property, with everything a lister has
 * published merged into the static inventory in `properties.ts`.
 *
 * Same arrangement as the articles: the file stays the fallback, the database
 * is layered on top, and a static slug wins a collision.
 */

/**
 * A listing as its own page needs it.
 *
 * `Unit` is the card: the fields every residence on the search page has. A
 * listing created in the dashboard can carry a great deal more — prose,
 * amenities, floor plans, what the payment plan is — and all of it is
 * optional, because a lister putting a unit up at short notice should not have
 * to write a brochure to do it. Every section of the page is omitted rather
 * than empty when its field is absent.
 */
export type Listing = Unit & {
  description: string | null;
  highlights: { title: string; text: string }[];
  amenities: string[];
  floorPlans: string[];
  paymentPlan: string | null;
  handover: string | null;
  serviceCharge: string | null;
  titleDeed: string | null;
  videoUrl: string | null;
  mapLat: number | null;
  mapLng: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  noindex: boolean;
  gallery: string[];
};

const load = unstable_cache(
  async (): Promise<Listing[]> => {
    const rows = await prisma.property.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      project: row.project,
      location: row.location,
      country: row.country,
      prices: { USD: row.priceUSD, EUR: row.priceEUR, TRY: row.priceTRY },
      type: row.type,
      bathrooms: row.bathrooms,
      bedroom: row.bedroom,
      size: row.size,
      level: row.level,
      view: row.view,
      soldOut: row.soldOut,
      cbiEligible: row.cbiEligible,
      image: row.image,
      brochure: row.brochure ?? undefined,
      // Every published listing answers at its own URL; see
      // `app/[lang]/properties/[slug]/page.tsx`.
      hasPage: true,
      gallery: row.gallery,
      description: row.description,
      highlights: row.highlights.map((highlight) => ({
        title: highlight.title,
        text: highlight.text,
      })),
      amenities: row.amenities,
      floorPlans: row.floorPlans,
      paymentPlan: row.paymentPlan,
      handover: row.handover,
      serviceCharge: row.serviceCharge,
      titleDeed: row.titleDeed,
      videoUrl: row.videoUrl,
      mapLat: row.mapLat,
      mapLng: row.mapLng,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      noindex: row.noindex,
    }));
  },
  ["cms-properties"],
  { tags: [PROPERTIES_TAG], revalidate: 300 },
);

export async function cmsUnits(): Promise<Listing[]> {
  try {
    return await load();
  } catch (error) {
    console.error("Could not load published properties:", error);
    return [];
  }
}

export async function mergedUnits(): Promise<Unit[]> {
  const fromDb = await cmsUnits();
  const taken = new Set(units.map((u) => u.slug));
  return [...units, ...fromDb.filter((u) => !taken.has(u.slug))];
}

/**
 * One published listing, for the page it answers at.
 *
 * Read out of the same cached list rather than queried on its own: the list is
 * already in memory for the search page, it is invalidated by the same tag
 * when a lister publishes, and a listing is not a large object. A slug that
 * belongs to a development or to the static inventory is not one of these, and
 * the caller falls through to whatever else answers at that URL.
 */
export async function getListing(slug: string): Promise<Listing | null> {
  const listings = await cmsUnits();
  return listings.find((listing) => listing.slug === slug) ?? null;
}

/**
 * The filter menus on the search page and the hero.
 *
 * `properties.ts` publishes fixed lists, which is right for the places and
 * types Multi Mulk actually sells in — but a lister who adds a unit in a new
 * city needs it to be selectable, so anything the database introduces is
 * appended to the static list rather than replacing it.
 */
export async function mergedLocations(base: string[]): Promise<string[]> {
  const fromDb = await cmsUnits();
  const extra = new Set<string>();
  for (const unit of fromDb) {
    if (!base.includes(unit.country)) extra.add(unit.country);
    if (!base.includes(unit.location)) extra.add(unit.location);
  }
  return [...base, ...[...extra].sort()];
}
