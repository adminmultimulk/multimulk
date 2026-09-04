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

const load = unstable_cache(
  async (): Promise<Unit[]> => {
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
    }));
  },
  ["cms-properties"],
  { tags: [PROPERTIES_TAG], revalidate: 300 },
);

export async function cmsUnits(): Promise<Unit[]> {
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
