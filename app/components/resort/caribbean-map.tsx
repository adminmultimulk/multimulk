import { aspectRatio, place, type Box } from "@/app/lib/mercator";
import type { CaribbeanPin } from "@/app/lib/resorts";

/**
 * The Eastern Caribbean as a drawing, with a pin on each resort.
 *
 * Not a map tile. At the scale that holds St. Kitts and Grenada in one frame
 * — five hundred kilometres of sea between them — a rendered map is mostly
 * blue, and the islands are specks; what a reader wants from this section is
 * "which islands, and which is this one", which a chart-style illustration
 * answers better. The islands are simplified silhouettes drawn in degrees and
 * projected into the frame, so they sit where they actually are relative to
 * each other; the pins go through the same projection, so a pin placed by
 * coordinate lands on its island without anyone adjusting it by eye.
 *
 * The islands and the sea are SVG; the pins and their labels are HTML laid
 * over it, because a label is text that wraps and mirrors with the writing
 * direction, and SVG text does neither.
 */

/** The rectangle the drawing covers: St. Kitts at the top, Grenada at the bottom. */
const FRAME: Box = { west: -64.6, south: 11.4, east: -59.4, north: 18.0 };

/** The SVG's own units. 800 wide; the height follows from the projection. */
const WIDTH = 800;
const HEIGHT = Math.round(WIDTH / aspectRatio(FRAME));

/**
 * How much larger than life each island is drawn.
 *
 * At true scale Dominica is a thumbnail's width in a frame this size, and a
 * pin on it covers it. So each island is scaled up about its own centre —
 * the way a chart of an archipelago exaggerates the land — and the pins are
 * put through the same transform, so a resort still lands on the coast it
 * stands on. The islands' positions relative to each other are unchanged.
 */
const EXAGGERATION = 2.6;

/**
 * Simplified coastlines, as (lat, lng) rings. Enough points to give each
 * island its shape — Dominica tall and narrow, St. Kitts with its tail to
 * the south-east, Nevis a circle beside it — and no more.
 */
const ISLANDS: { name: string; group: string; ring: [number, number][] }[] = [
  {
    name: "St. Kitts",
    group: "St. Kitts & Nevis",
    ring: [
      [17.41, -62.86],
      [17.4, -62.76],
      [17.36, -62.7],
      [17.3, -62.66],
      [17.25, -62.64],
      [17.23, -62.6],
      [17.22, -62.57],
      [17.24, -62.63],
      [17.27, -62.7],
      [17.3, -62.76],
      [17.34, -62.84],
      [17.38, -62.88],
    ],
  },
  {
    name: "Nevis",
    group: "St. Kitts & Nevis",
    ring: [
      [17.21, -62.6],
      [17.19, -62.55],
      [17.14, -62.53],
      [17.1, -62.56],
      [17.09, -62.61],
      [17.13, -62.64],
      [17.18, -62.63],
    ],
  },
  {
    name: "Dominica",
    group: "Dominica",
    ring: [
      [15.64, -61.45],
      [15.61, -61.36],
      [15.53, -61.29],
      [15.43, -61.25],
      [15.32, -61.26],
      [15.22, -61.31],
      [15.2, -61.38],
      [15.24, -61.43],
      [15.33, -61.44],
      [15.44, -61.46],
      [15.55, -61.47],
    ],
  },
  {
    name: "Grenada",
    group: "Grenada",
    ring: [
      [12.23, -61.64],
      [12.21, -61.58],
      [12.13, -61.59],
      [12.04, -61.63],
      [11.99, -61.7],
      [12.0, -61.77],
      [12.07, -61.78],
      [12.15, -61.75],
      [12.21, -61.7],
    ],
  },
];

/**
 * The centre each group is exaggerated about. St. Kitts and Nevis share one,
 * so the pair grows together and the strait between them stays a strait.
 */
const CENTRES: Record<string, { lat: number; lng: number }> = Object.fromEntries(
  [...new Set(ISLANDS.map((island) => island.group))].map((group) => {
    const points = ISLANDS.filter((i) => i.group === group).flatMap((i) => i.ring);
    return [
      group,
      {
        lat: points.reduce((sum, [lat]) => sum + lat, 0) / points.length,
        lng: points.reduce((sum, [, lng]) => sum + lng, 0) / points.length,
      },
    ];
  }),
);

/** A point pushed out from its island's centre by the exaggeration. */
function exaggerate(lat: number, lng: number, group: string) {
  const centre = CENTRES[group];
  if (!centre) return { lat, lng };
  return {
    lat: centre.lat + (lat - centre.lat) * EXAGGERATION,
    lng: centre.lng + (lng - centre.lng) * EXAGGERATION,
  };
}

/** Where a point of an island lands in the frame, as percentages. */
function locate(lat: number, lng: number, group: string) {
  const at = exaggerate(lat, lng, group);
  return place(at.lat, at.lng, FRAME);
}

/** Projects a ring into SVG units. */
function outline(ring: [number, number][], group: string): string {
  return ring
    .map(([lat, lng]) => {
      const at = locate(lat, lng, group);
      if (!at) return "";
      return `${((at.left / 100) * WIDTH).toFixed(1)},${((at.top / 100) * HEIGHT).toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

export function CaribbeanMap({
  pins,
  current,
  seaLabel,
  islandLabels,
}: {
  pins: CaribbeanPin[];
  /** The resort whose page this is; its pin is filled. */
  current: string;
  /** "Caribbean Sea", localised. */
  seaLabel: string;
  /** Island name to its localised label. */
  islandLabels: Record<string, string>;
}) {
  // Where each island's name goes: under the silhouette's lowest point.
  const islandNames = ISLANDS.map((island) => {
    const south = island.ring.reduce((a, b) => (b[0] < a[0] ? b : a));
    const centreLng =
      island.ring.reduce((sum, [, lng]) => sum + lng, 0) / island.ring.length;
    const foot = locate(south[0], centreLng, island.group);
    return {
      name: island.name,
      at: foot ? { left: foot.left, top: foot.top + 1.2 } : null,
    };
  });

  return (
    <div
      className="relative w-full text-forest"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* The sea's engraved hatching, laid as a wide stroke around each
              island so it reads as the water off the coast. */}
          <pattern
            id="caribbean-sea"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-20)"
          >
            <line x1="0" y1="3" x2="6" y2="3" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
          <path
            id="caribbean-sea-arc"
            d={`M 60 ${HEIGHT * 0.34} Q 40 ${HEIGHT * 0.6} 130 ${HEIGHT * 0.84}`}
            fill="none"
          />
        </defs>

        {ISLANDS.map((island) => {
          const points = outline(island.ring, island.group);
          return (
            <g key={island.name}>
              {/* The shore: hatching fading out from the coast, drawn as a
                  wide stroke of the pattern under the land. */}
              <polygon
                points={points}
                fill="none"
                stroke="url(#caribbean-sea)"
                strokeWidth="26"
                strokeLinejoin="round"
                opacity="0.55"
              />
              <polygon
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinejoin="round"
                strokeDasharray="2 4"
                opacity="0.5"
                style={{ transformBox: "fill-box", transformOrigin: "center", transform: "scale(1.3)" }}
              />
              {/* The land. */}
              <polygon
                points={points}
                className="fill-mist"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {/* "Caribbean Sea", set along an arc down the western edge — the way
            a chart labels the water it is mostly made of. */}
        <text
          className="font-display"
          fontSize="26"
          letterSpacing="7"
          fill="currentColor"
          opacity="0.7"
        >
          <textPath href="#caribbean-sea-arc" startOffset="4%">
            {seaLabel.toUpperCase()}
          </textPath>
        </text>

        {/* The compass rose, top right. */}
        <g transform={`translate(${WIDTH - 130} 120)`} fill="none" stroke="currentColor">
          <circle r="54" strokeWidth="0.8" opacity="0.5" />
          <circle r="40" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
          <path d="M0 -50 L9 0 L0 50 L-9 0 Z" strokeWidth="1" />
          <path d="M-50 0 L0 9 L50 0 L0 -9 Z" strokeWidth="1" opacity="0.7" />
          <path d="M0 -50 L9 0 L0 0 Z" fill="currentColor" stroke="none" />
          <path d="M0 50 L-9 0 L0 0 Z" fill="currentColor" stroke="none" />
          <circle r="4" fill="currentColor" stroke="none" />
          <g fill="currentColor" stroke="none" fontSize="12" textAnchor="middle" className="font-sans">
            <text y="-60">N</text>
            <text y="72">S</text>
            <text x="66" y="4">E</text>
            <text x="-66" y="4">W</text>
          </g>
        </g>

        {/* A pair of small ships, for the chart's sake. */}
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6">
          <g transform={`translate(${WIDTH - 170} ${HEIGHT * 0.66})`}>
            <path d="M-14 8 H14 L10 14 H-10 Z" />
            <path d="M-2 8 V-14 M-2 -13 L12 -4 L-2 -2 M-2 -12 L-11 -2 L-2 -1" />
          </g>
          <g transform={`translate(${WIDTH * 0.2} ${HEIGHT * 0.9})`}>
            <path d="M-12 7 H12 L9 12 H-9 Z" />
            <path d="M-1 7 V-12 M-1 -11 L10 -3 L-1 -1 M-1 -10 L-9 -2 L-1 0" />
          </g>
        </g>
      </svg>

      {/* Island names, under each silhouette. */}
      {islandNames.map(({ name, at }) =>
        at ? (
          <span
            key={name}
            className="absolute -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-forest/70"
            style={{ left: `${at.left}%`, top: `${at.top}%` }}
          >
            {islandLabels[name] ?? name}
          </span>
        ) : null,
      )}

      {/* The resorts. Each pin is a disc on its coordinate with the name
          running off to one side; the resort whose page this is carries the
          solid disc, the rest an outline. The list is pinned left-to-right
          whatever the page's direction: `left` is a physical position on the
          drawing, and the names are Latin in every language. */}
      <ol dir="ltr">
        {pins.map((pin) => {
          const at = locate(pin.lat, pin.lng, pin.island);
          if (!at) return null;
          const isCurrent = pin.name === current;
          // The disc sits on the coordinate and the label runs away from it:
          // anchored by its left edge when the label runs right, by its right
          // edge when the label runs left, and pulled back by the disc's
          // radius either way so the disc's centre is the point.
          const anchor =
            pin.side === "end"
              ? { left: `${at.left}%`, transform: "translate(-13px, -50%)" }
              : { right: `${100 - at.left}%`, transform: "translate(13px, -50%)" };
          return (
            <li
              key={pin.name}
              className={`absolute flex items-center gap-2.5 ${
                pin.side === "end" ? "flex-row" : "flex-row-reverse"
              }`}
              style={{ top: `${at.top}%`, ...anchor }}
            >
              <span
                className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-forest ${
                  isCurrent ? "bg-forest" : "bg-white"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isCurrent ? "bg-cream" : "bg-forest"}`}
                />
              </span>
              <span
                className={`max-w-[150px] text-[9.5px] uppercase leading-[1.35] tracking-[0.08em] ${
                  pin.side === "end" ? "text-start" : "text-end"
                } ${isCurrent ? "font-bold text-forest" : "text-ink/75"}`}
              >
                {pin.name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
