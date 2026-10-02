/**
 * The partnership types a broker or adviser can register for on
 * /partner-with-us.
 *
 * The keys double as the `?type=` value a card on the page links with, so
 * "Register as a real estate partner" opens the form with that type already
 * chosen — which is why they are URL-shaped rather than camelCase. The wording
 * lives under `dictionary.partners.form.types`; this module holds only the
 * keys the form submits.
 *
 * Imports nothing, and in particular not `routes.ts`: the registration form is
 * a Client Component, and the route table pulls every article on the site in
 * behind it. The Server Action validates against the same list.
 */

export const partnerTypes = [
  "real-estate",
  "citizenship-referral",
  "citizenship-residency",
  "developer",
  "strategic",
  "referral",
  "not-sure",
] as const;

export type PartnerType = (typeof partnerTypes)[number];

export function isPartnerType(value: unknown): value is PartnerType {
  return (partnerTypes as readonly unknown[]).includes(value);
}

/** The four partnership models the page sets out, in the order it shows them. */
export const partnerModels = [
  "real-estate",
  "citizenship-referral",
  "citizenship-residency",
  "strategic",
] as const satisfies readonly PartnerType[];

export type PartnerModel = (typeof partnerModels)[number];
