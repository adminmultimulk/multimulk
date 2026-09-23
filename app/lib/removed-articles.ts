/**
 * Articles taken off the site, whose URLs now redirect to /knowledge.
 *
 * They were live and may be indexed or linked, so each answers with a
 * permanent redirect to the News & Insights index rather than a 404 — see
 * `next.config.ts`. The dashboard refuses these slugs for the same reason it
 * refuses the section names: redirects run ahead of routing, so a new piece
 * published under one would be unreachable.
 *
 * Its own module, with no imports, because `next.config.ts` reads it.
 */
export const removedArticleSlugs = [
  // The placeholder originals, removed in September 2026.
  "marmara-vista-launch",
  "marmara-vista-presentation-istanbul",
  "six-senses-la-sagesse-michelin-key",
  "istanbul-portfolio-expansion",
  "christophe-harbour-rising",
  "port-cabrits-marina",
  "bodrum-or-antalya",
];
