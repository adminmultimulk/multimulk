import { SiteNavBar } from "./site-nav-bar";
import { developments } from "@/app/lib/cms/developments";
import type { MenuCard } from "@/app/lib/content";
import { buildPath } from "@/app/lib/routes";

/** As many as the menu's six-column grid holds without wrapping. */
const MAX_CARDS = 6;

/**
 * The navigation bar, with the Real Estate menu read from the inventory.
 *
 * A server component wrapping the client bar, so that publishing a listing is
 * all it takes for its development to appear in the menu on every page. The
 * cards used to be a hand-written list in `content.ts` beside the developments
 * themselves, which meant the menu described the site as it stood the day
 * somebody last edited that file.
 *
 * The listings are read through the same cached, tagged reader the search page
 * uses, so this costs a map lookup per page rather than a query.
 */
export async function SiteNav() {
  const portfolio: MenuCard[] = (await developments())
    .slice(0, MAX_CARDS)
    .map((development) => ({
      // "TÜRKIYE / KARTAL" — both halves resolved through `dictionary.places`
      // when the site knows the name, and shown as written when it does not.
      eyebrow: [[development.country], [development.location]],
      title: development.name,
      href: buildPath("development", { slug: development.slug }),
      image: development.image,
      units: development.units.length,
    }));

  return <SiteNavBar portfolio={portfolio} />;
}
