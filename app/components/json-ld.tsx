import type { Thing, WithContext } from "schema-dts";

/**
 * The page's structured data, as one `@graph`.
 *
 * One script tag per page rather than several: nodes carry `@id`s and refer to
 * each other — an article points at its publisher, a breadcrumb at its page —
 * and a single graph states those relationships outright instead of leaving a
 * parser to infer them across sibling tags.
 *
 * Every payload on the site goes through here, which is the point. Article
 * bodies, FAQ answers and programme prose all end up inside JSON-LD, and
 * translations arrive through the staged-copy channel from outside the repo,
 * so the escaping below has to be somewhere it cannot be forgotten rather than
 * repeated at each call site.
 */
export function JsonLd({ graph }: { graph: readonly Thing[] }) {
  if (graph.length === 0) return null;

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // `JSON.stringify` does not escape HTML, so a `</script>` inside any
      // string would close this tag early. Replacing `<` with its unicode
      // escape makes that unrepresentable; the JSON parses identically.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload, omitEmpty).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Drops keys with nothing behind them, so an optional field that happens to be
 * absent — an article with no `source`, a project with no amenities — leaves no
 * trace rather than emitting `null` for a validator to complain about.
 */
function omitEmpty(_key: string, value: unknown): unknown {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  if (Array.isArray(value) && value.length === 0) return undefined;
  return value;
}

export type { WithContext };
