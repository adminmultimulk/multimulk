/**
 * The amenity vocabulary a listing is built from.
 *
 * Amenities used to be free text: whatever a lister typed went into the
 * database and onto the page, which made "Indoor Pool", "indoor pool" and
 * "Swimming Pool (indoor)" three different amenities to the site — none of
 * them translatable, none of them able to carry an icon. The dashboard offers
 * this list as checkboxes instead, so the common cases arrive spelled the way
 * the dictionaries and the icon map already expect them.
 *
 * Anything outside the list is still allowed. A lister can type an amenity
 * this vocabulary does not have and it is shown as written, in English, with
 * the fallback marker for an icon — which is the same deal the free-text field
 * gave, kept for the amenity nobody anticipated.
 *
 * Each name is its own translation key: `dictionary.property.amenityItems` is
 * keyed by the English text and falls back to it, so a name added here reads
 * in English in a language that has not translated it yet rather than
 * breaking the page.
 *
 * The groups exist for the dashboard's benefit — thirty checkboxes in one run
 * is a wall — and their labels are only ever seen there, which is why they are
 * plain English and not dictionary keys.
 */

export type AmenityGroup = {
  label: string;
  items: readonly string[];
};

export const amenityGroups: readonly AmenityGroup[] = [
  {
    label: "Building & service",
    items: [
      "Lobby & Concierge",
      "Lobby",
      "Concierge",
      "24/7 Security",
      "Residents’ Lounge",
      "Rooftop Lounge",
      "Cinema Room",
      "Co-working Space",
      "Private Elevator",
      "Retail & Dining",
    ],
  },
  {
    label: "Wellness & fitness",
    items: [
      "Spa & Hammam",
      "Sauna",
      "Fitness Centre",
      "Gym",
      "Yoga Studio",
    ],
  },
  {
    label: "Pools & grounds",
    items: [
      "Indoor Pool",
      "Outdoor Pool",
      "Pool Terrace",
      "Landscaped Terrace",
      "Landscaped Gardens",
      "Children’s Play Area",
      "Jogging Track",
      "Tennis Court",
      "Padel Court",
      "BBQ Area",
    ],
  },
  {
    label: "Access & practical",
    items: [
      "Secure Parking",
      "EV Charging",
      "Smart Home",
      "Pet Friendly",
      "Promenade Access",
      "Bay Access",
      "Beach Access",
    ],
  },
];

/** Every name in the vocabulary, in the order the dashboard lists them. */
export const amenityNames: readonly string[] = amenityGroups.flatMap(
  (group) => group.items,
);

const known = new Set(amenityNames);

/** Whether a name is one the site knows how to translate and illustrate. */
export function isKnownAmenity(name: string): boolean {
  return known.has(name);
}

/**
 * Splits a saved list into the part the checkboxes own and the part the
 * free-text box does. A listing written before this vocabulary existed — or
 * imported from anywhere else — comes back with names in the second half, and
 * keeps them.
 */
export function splitAmenities(names: readonly string[]): {
  selected: string[];
  custom: string[];
} {
  return {
    selected: amenityNames.filter((name) => names.includes(name)),
    custom: names.filter((name) => !known.has(name)),
  };
}
