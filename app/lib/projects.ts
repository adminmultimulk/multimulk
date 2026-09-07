/**
 * The shape of a development page served at /properties/[slug].
 *
 * The type, and nothing else. There is no list here any more: the four
 * developments that used to be written out in this file were placeholder
 * schemes, and a scheme that only exists in the source cannot be entered,
 * edited or retired by the people who actually sell it. Developments are
 * assembled from the listings published in the dashboard instead — see
 * `app/lib/cms/developments.ts`, which returns this shape.
 *
 * Short strings — taglines, overview headings, highlight titles, stat labels,
 * amenity names — are still translated in the dictionaries and looked up by
 * the page, and long prose is still staged under `dictionary.property.copy`.
 * Neither has an entry for a development entered last week, which is the
 * point of `pick`: an untranslated development renders in the words its
 * lister wrote rather than not at all.
 */

export type Project = {
  slug: string;
  /** Never translated — the name a buyer searches for, in every language. */
  name: string;
  /** Empty for a development assembled from listings — the section is dropped. */
  tagline: string;
  description: string;
  location: string;
  country: string;
  image: string;
  /**
   * The development's brochure, served from `public/`. Requested by email
   * rather than downloaded outright: the reader leaves their details, the
   * brochure arrives in their inbox, and sales gets the lead.
   *
   * Optional, and the button is simply absent without it — a "Download
   * Brochure" that emails a 404 is worse than no button at all.
   */
  brochure?: string;
  highlights: { title: string; text: string }[];
  /** Heading and body may both be empty, and the panel then shows stats alone. */
  overview: { heading: string; body: string };
  stats: { label: string; value: string }[];
  amenities: { body: string; items: string[] };
};
