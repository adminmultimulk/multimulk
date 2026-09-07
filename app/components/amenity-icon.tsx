/**
 * The mark that sits beside an amenity.
 *
 * Keyed by the English name, which is the same key the dictionaries use: an
 * amenity is one string everywhere in the codebase, and both its translation
 * and its glyph hang off it. A name outside the vocabulary — anything a lister
 * typed into the "other amenities" box — falls back to the diamond the rest of
 * the site uses as a plain marker, so a custom amenity lines up with the ones
 * around it instead of leaving a hole in the column.
 *
 * Several names share a glyph on purpose. An indoor pool, an outdoor pool and
 * a pool terrace are all a pool to someone scanning a list, and drawing three
 * near-identical icons would only make the list harder to read.
 *
 * No `"use client"`: these are static SVGs, so the same component serves the
 * property page (a Server Component) and the dashboard's picker (a Client
 * Component).
 */

import {
  Bell,
  Car,
  Cinema,
  Desk,
  Diamond,
  Dining,
  Dumbbell,
  Elevator,
  Grill,
  Paw,
  Play,
  Plug,
  Pool,
  Racket,
  Rooftop,
  Sauna,
  Shield,
  SmartHome,
  Sofa,
  Spa,
  Track,
  Tree,
  Wave,
} from "./icons";

type Glyph = (props: { className?: string }) => React.ReactElement;

const glyphs: Record<string, Glyph> = {
  "Lobby & Concierge": Bell,
  Lobby: Bell,
  Concierge: Bell,
  "24/7 Security": Shield,
  "Residents’ Lounge": Sofa,
  "Rooftop Lounge": Rooftop,
  "Cinema Room": Cinema,
  "Co-working Space": Desk,
  "Private Elevator": Elevator,
  "Retail & Dining": Dining,

  "Spa & Hammam": Spa,
  Sauna: Sauna,
  "Fitness Centre": Dumbbell,
  Gym: Dumbbell,
  "Yoga Studio": Spa,

  "Indoor Pool": Pool,
  "Outdoor Pool": Pool,
  "Pool Terrace": Pool,
  "Landscaped Terrace": Tree,
  "Landscaped Gardens": Tree,
  "Children’s Play Area": Play,
  "Jogging Track": Track,
  "Tennis Court": Racket,
  "Padel Court": Racket,
  "BBQ Area": Grill,

  "Secure Parking": Car,
  "EV Charging": Plug,
  "Smart Home": SmartHome,
  "Pet Friendly": Paw,
  "Promenade Access": Wave,
  "Bay Access": Wave,
  "Beach Access": Wave,
};

export function AmenityIcon({
  name,
  className,
}: {
  /** The English name, not the translated one — the map is keyed by source. */
  name: string;
  className?: string;
}) {
  const Glyph = glyphs[name] ?? Diamond;
  return <Glyph className={className} />;
}
