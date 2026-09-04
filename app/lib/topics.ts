/**
 * The Knowledge Centre's pillars, and the axis its index filters on.
 *
 * Its own module because both article collections need it. `knowledge.ts`
 * merges `media.ts` into one list, so the type cannot live in either of them
 * without the two importing each other — it has to sit below both.
 *
 * The keys are also a public contract: `legacy-redirects.ts` sends every
 * legacy blog category to `/knowledge?topic=<key>`, so renaming one breaks a
 * redirect that is already indexed.
 */

export type Topic = "citizenship" | "residency" | "real-estate" | "turkiye" | "news";

/** Display order of the index's filter pills. */
export const topics: Topic[] = [
  "citizenship",
  "residency",
  "real-estate",
  "turkiye",
  "news",
];

export function isTopic(value: string): value is Topic {
  return (topics as string[]).includes(value);
}
