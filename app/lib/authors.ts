/**
 * The people behind the advice.
 *
 * Immigration and investment content is judged partly on who wrote it, and
 * until now nothing on this site said. An author here is an addressable entity
 * — it has a page, a `Person` node in the structured data, and it is what a
 * `LegalReview` names when it records who checked a figure.
 *
 * NOTE: the roster is taken from `about.ts`, which is itself flagged as
 * placeholder. Credentials, licences and profile links below are empty on
 * purpose rather than invented: they are claims about real people's
 * qualifications, and Multi Mulk has to supply them.
 */

export type AuthorId = "sajid-ali-haydar" | "nader-djebbi" | "advisory-team";

export type Author = {
  id: AuthorId;
  /** The URL segment, and the `@id` the structured data references. */
  slug: string;
  /** Never translated. */
  name: string;
  /**
   * Licences and memberships, exactly as awarded — "Licensed Agent, Grenada
   * CBI Unit", not a paraphrase. Empty until confirmed; an unverified
   * credential on a page like this is worse than none.
   */
  credentials: readonly string[];
  /** Key into `dictionary.authors.roles`. */
  roleKey: string;
  image?: string;
  /** Professional profiles, for `sameAs`. */
  sameAs: readonly string[];
  /** Subject areas, for `knowsAbout`. */
  knowsAbout: readonly string[];
  /** Key into `dictionary.authors.copy`, staged like all other prose. */
  copyKey: string;
};

/**
 * Portraits are written out rather than read from `about.ts`.
 *
 * `routes.ts` enumerates the author pages, so it imports this module; `about.ts`
 * imports `routes.ts` for its hrefs. Reaching back into `about.ts` from here
 * closes that loop, and a cycle between three modules evaluated at import time
 * fails at build with an error that names none of them usefully. Two file
 * paths are a cheap price for a dependency graph that runs one way.
 */
const portrait = (slug: string) => `/images/team/${slug}.webp`;

export const authors: Readonly<Record<AuthorId, Author>> = {
  "sajid-ali-haydar": {
    id: "sajid-ali-haydar",
    slug: "sajid-ali-haydar",
    name: "Sajid Ali Haydar",
    credentials: [],
    roleKey: "founder",
    image: portrait("sajid-ali-haydar"),
    sameAs: [],
    knowsAbout: [
      "Citizenship by investment",
      "Residency by investment",
      "International real estate",
    ],
    copyKey: "sajid-ali-haydar",
  },
  "nader-djebbi": {
    id: "nader-djebbi",
    slug: "nader-djebbi",
    name: "Nader Djebbi",
    credentials: [],
    roleKey: "advisory",
    image: portrait("nader-djebbi"),
    sameAs: [],
    knowsAbout: ["Investment migration", "Property due diligence"],
    copyKey: "nader-djebbi",
  },
  /**
   * The fallback for work that is genuinely collective. Kept deliberately
   * plain: attributing a page to "the team" is honest, whereas putting a named
   * person on something they did not review is not.
   */
  "advisory-team": {
    id: "advisory-team",
    slug: "advisory-team",
    name: "Multi Mulk Advisory Team",
    credentials: [],
    roleKey: "team",
    sameAs: [],
    knowsAbout: ["Citizenship by investment", "Golden visas", "Real estate"],
    copyKey: "advisory-team",
  },
};

export function getAuthor(id: AuthorId): Author {
  return authors[id];
}
