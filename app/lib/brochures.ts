/**
 * What a "Download Brochure" click actually resolves to.
 *
 * A brochure hangs off two different things. A development has one for the
 * whole scheme — taken from the listing in it that carries one — and a single
 * listing has its own. Both are addressed by slug from the same button, so the
 * lookup belongs in one place rather than in the Server Action.
 *
 * Resolved here and never taken from the form: the slug arrives over the wire,
 * and a request must not be able to name a file the site does not publish.
 */

import "server-only";
import { getListing } from "./cms/properties";
import { getDevelopment } from "./cms/developments";
import { absoluteUrl } from "./site";

export type BrochureSource = {
  /** The name to put in the email — a development, or the unit itself. */
  name: string;
  /** Absolute, because it goes into an email. */
  url: string;
  /** Where the thing is, for the enquiry the sales team reads. */
  place: string;
  country: string;
};

export async function resolveBrochure(
  slug: string,
): Promise<BrochureSource | null> {
  if (!slug) return null;

  // A development wins a slug collision, as everywhere else the two resolve
  // against each other.
  const project = await getDevelopment(slug);
  if (project?.brochure) {
    return {
      name: project.name,
      // Handles both a path under `/public` and a Cloudinary URL: an absolute
      // URL resolves to itself.
      url: absoluteUrl(project.brochure),
      place: project.location,
      country: project.country,
    };
  }

  const listing = await getListing(slug);
  if (listing?.brochure) {
    return {
      name: listing.title,
      url: absoluteUrl(listing.brochure),
      place: listing.location,
      country: listing.country,
    };
  }

  return null;
}
