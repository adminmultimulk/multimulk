/**
 * The partnership tracks offered on /partner-with-us.
 *
 * One per market Multi Mulk sells, so a broker registers against the part of
 * the portfolio their clients actually buy. The wording lives under
 * `dictionary.partners.tracks`; this module holds only the keys the form
 * submits.
 *
 * Imports nothing, and in particular not `routes.ts`: the registration form is
 * a Client Component, and the route table pulls every article on the site in
 * behind it. The Server Action validates against the same list.
 */

export const partnerTracks = ["turkiye", "caribbean"] as const;

export type PartnerTrack = (typeof partnerTracks)[number];

export function isPartnerTrack(value: unknown): value is PartnerTrack {
  return (partnerTracks as readonly unknown[]).includes(value);
}
