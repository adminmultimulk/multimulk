/**
 * Placing a pin on a flat map picture.
 *
 * The location section draws a fixed photograph of İstanbul and puts the
 * marker on it ourselves, rather than asking a map provider to frame itself.
 * That is what makes the framing identical on every listing — a provider
 * centres on whatever you asked it about, so Kartal and Beylikdüzü would come
 * back as two different cities — and it is also why the frame cannot be zoomed
 * into the building the way an interactive embed can.
 *
 * Doing that needs one piece of arithmetic: where a latitude and longitude
 * fall inside the rectangle the picture covers. Web Mercator is what every
 * street map is drawn in, and its longitude axis is linear while its latitude
 * axis is not — so a pin placed by interpolating latitude directly drifts,
 * about a kilometre north at İstanbul's latitude over a box this size. Hence
 * the projection rather than a straight percentage.
 */

/** A rectangle of the world, in degrees. */
export type Box = {
  west: number;
  south: number;
  east: number;
  north: number;
};

/**
 * The rectangle `public/images/maps/istanbul.webp` covers.
 *
 * These numbers and that image are one artefact: the picture is rendered to
 * this box, and changing either without the other slides every pin off the
 * city. Wide enough to hold the districts Multi Mulk actually lists in —
 * Beylikdüzü and Büyükçekmece in the west, Kartal, Pendik and Tuzla in the
 * east, Sarıyer at the top of the Bosphorus. Silivri and Şile fall outside it
 * and fall back to the embed; see `app/lib/districts.ts`.
 */
export const ISTANBUL: Box = {
  west: 28.4,
  south: 40.75,
  east: 29.6,
  north: 41.35,
};

/** Web Mercator's vertical axis, normalised to 0 at the north pole. */
function mercatorY(lat: number): number {
  const radians = (lat * Math.PI) / 180;
  return (
    1 -
    Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI
  ) / 2;
}

/** Where the point sits in the box, as CSS percentages from its top-left. */
export type Placement = { left: number; top: number };

/**
 * Projects a point into a box, or returns null when it falls outside it.
 *
 * Null is the useful answer rather than a clamped edge: a Bodrum listing
 * pinned to the corner of a map of İstanbul is worse than no map, so the
 * caller shows something else instead.
 */
export function place(
  lat: number,
  lng: number,
  box: Box = ISTANBUL,
): Placement | null {
  if (lat > box.north || lat < box.south) return null;
  if (lng < box.west || lng > box.east) return null;

  const left = ((lng - box.west) / (box.east - box.west)) * 100;

  const top = box.north === box.south
    ? 0
    : ((mercatorY(lat) - mercatorY(box.north)) /
        (mercatorY(box.south) - mercatorY(box.north))) *
      100;

  return { left, top };
}

/**
 * The box's own proportions, for sizing the frame the picture sits in.
 *
 * A box is taller in Mercator than its degree span suggests, and a frame cut
 * to the wrong ratio stretches the coastline.
 */
export function aspectRatio(box: Box = ISTANBUL): number {
  const width = box.east - box.west;
  const height = mercatorY(box.south) - mercatorY(box.north);
  // Mercator's units are whole-world fractions; longitude spans 360 degrees
  // across the same unit square, so the width is scaled to match.
  return width / 360 / height;
}

/**
 * A pin's coordinates, blunted to roughly a kilometre.
 *
 * The picture cannot be zoomed, but a pin drawn from exact coordinates can
 * still be measured off it and turned back into a position. Two decimal places
 * keeps the marker inside the right district while making that measurement
 * worth nothing — and at this scale it moves the pin by well under a pixel.
 */
export function blunt(value: number): number {
  return Math.round(value * 100) / 100;
}
