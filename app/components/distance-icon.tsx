/**
 * The mark beside a group in a development's distances table.
 *
 * Matched on what the group's name says rather than on the exact string: a
 * lister writes "Hospital", "Hospitals" or "Healthcare" and means the same
 * column, and an icon map keyed on spelling would leave two of the three
 * with the fallback marker. The patterns are English because the group names
 * are entered in English and translated on the way out — see
 * `dictionary.property.distanceGroups` — so the glyph survives translation
 * the same way an amenity's does.
 *
 * No `"use client"`: static SVGs, served to the property page and the
 * dashboard's preview alike.
 */

import {
  Briefcase,
  Graduation,
  Hospital,
  Landmark,
  MapPin,
  Plane,
  ShoppingBag,
  Train,
} from "./icons";

type Glyph = (props: { className?: string }) => React.ReactElement;

const glyphs: [RegExp, Glyph][] = [
  [/airport|flight/i, Plane],
  [/hospital|health|medical|clinic/i, Hospital],
  [/business|office|finance|commercial|work/i, Briefcase],
  [/transport|transit|metro|bus|highway|bridge|station/i, Train],
  [/education|school|universit|college|campus/i, Graduation],
  [/shop|mall|retail|market|bazaar/i, ShoppingBag],
  [/cultur|landmark|sight|attraction|museum|heritage|leisure/i, Landmark],
];

export function DistanceIcon({
  group,
  className,
}: {
  /** The English name of the group, not the translated one. */
  group: string;
  className?: string;
}) {
  const Glyph = glyphs.find(([pattern]) => pattern.test(group))?.[1] ?? MapPin;
  return <Glyph className={className} />;
}
