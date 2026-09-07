import "server-only";
import { cmsUnits, type Listing } from "./properties";
import { slugify } from "../admin/slug";
import type { Project } from "../projects";

/**
 * Developments, assembled out of the listings that belong to them.
 *
 * The site used to carry four hand-written developments in `projects.ts` and
 * a matching set of menu cards in `content.ts`, which meant a lister who put a
 * unit up in a new scheme could not make that scheme appear anywhere: not in
 * the Real Estate menu, not on the hub, not on the About page. Every one of
 * those surfaces reads this instead, so entering a listing is the whole act of
 * publishing a development.
 *
 * A development is not a row of its own. It is the set of published listings
 * sharing a `project` name — which is what a lister already types — with the
 * page-level facts taken from the fullest listing in the set. Nothing here is
 * written by hand, so nothing here can drift from what is actually for sale.
 */
export type Development = Project & {
  /** The published units in it, cheapest first. */
  units: Listing[];
};

/**
 * `Peron İstanbul` → `peron-istanbul`.
 *
 * The same shaping the dashboard applies to a listing's own slug, so a
 * development answers at a URL of the same shape as the units inside it.
 */
export function developmentSlug(project: string): string {
  return slugify(project);
}

/**
 * The listing a development's page is written from.
 *
 * The one carrying prose, if any does — a lister filling in a development's
 * story usually does it once, on the first unit they enter, and leaves the
 * rest as specs. Falling back to the cheapest keeps a development that has no
 * prose anywhere from losing its photograph as well.
 */
function lead(units: Listing[]): Listing {
  return units.find((unit) => unit.description) ?? units[0];
}

/** Stats for the overview panel, omitting any the listings cannot answer. */
function statsFor(units: Listing[], from: Listing): Project["stats"] {
  const layouts = [...new Set(units.map((unit) => unit.bedroom))];
  const stats: Project["stats"] = [
    {
      label: "Quantity",
      value: `${units.length} ${units.length === 1 ? "residence" : "residences"}`,
    },
  ];

  if (layouts.length) stats.push({ label: "Apartments", value: layouts.join(", ") });

  // "TBC" and the like are what a lister types before the developer's sheet
  // arrives; a size that is not a measurement is not a statistic.
  const sizes = [...new Set(units.map((unit) => unit.size))].filter((size) =>
    /\d/.test(size),
  );
  if (sizes.length)
    stats.push({
      label: "Room Sizes",
      value: sizes.length > 1 ? `${sizes[0]} - ${sizes[sizes.length - 1]}` : sizes[0],
    });

  if (from.handover) stats.push({ label: "Handover", value: from.handover });

  return stats;
}

/**
 * One development, out of the listings in it.
 *
 * Shaped as a `Project` so the development page, the menu and the hub render
 * a CMS development exactly as they rendered a hand-written one. What a
 * listing cannot supply is left empty rather than invented — `tagline` and the
 * overview prose have no equivalent in the dashboard, and every surface that
 * reads them omits its section when they are blank.
 */
function assemble(name: string, units: Listing[]): Development {
  const sorted = [...units].sort((a, b) => a.prices.USD - b.prices.USD);
  const from = lead(sorted);

  return {
    slug: developmentSlug(name),
    name,
    tagline: "",
    description: from.description ?? "",
    location: from.location,
    country: from.country,
    image: from.image,
    brochure: from.brochure,
    highlights: from.highlights,
    overview: { heading: "", body: "" },
    stats: statsFor(sorted, from),
    amenities: {
      body: "",
      // The union rather than the lead's own: an amenity is the development's,
      // and a lister who lists the pool on one layout and the hammam on
      // another has described one building between them.
      items: [...new Set(sorted.flatMap((unit) => unit.amenities))],
    },
    units: sorted,
  };
}

/**
 * Every development with something published in it.
 *
 * Ordered by how recently the development was added to — the Real Estate menu
 * and the hub both read this in order, so the newest scheme leads.
 */
export async function developments(): Promise<Development[]> {
  const listings = await cmsUnits();

  // `cmsUnits` is already ordered by publication date, newest first, so the
  // insertion order of this map is the order the developments were last
  // published into.
  const grouped = new Map<string, Listing[]>();
  for (const listing of listings) {
    const bucket = grouped.get(listing.project);
    if (bucket) bucket.push(listing);
    else grouped.set(listing.project, [listing]);
  }

  return [...grouped].map(([name, units]) => assemble(name, units));
}

export async function getDevelopment(slug: string): Promise<Development | null> {
  const all = await developments();
  return all.find((development) => development.slug === slug) ?? null;
}
