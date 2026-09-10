import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ISTANBUL, aspectRatio, blunt, place } from "@/app/lib/mercator";

/**
 * The picture, and the rectangle `ISTANBUL` says it covers.
 *
 * Rendered once from OpenStreetMap tiles at zoom 11 and committed — nothing is
 * fetched from a tile server when somebody opens a listing. ODbL, so the
 * credit under the frame is a licence condition and not decoration; see
 * `public/images/maps/CREDITS.md`.
 */
const MAP = "/images/maps/istanbul.webp";

/**
 * Whether the picture has been rendered yet.
 *
 * Checked once, at module load, on the server — `next/image` pointed at a file
 * that is not there is a broken frame on a live listing, and this section is
 * worth having as an interactive embed until the asset lands. See the fallback
 * in `district-map.tsx`.
 */
export const mapAvailable = existsSync(
  path.join(process.cwd(), "public", MAP),
);

/**
 * İstanbul, whole, with one pin on it.
 *
 * The frame is a fixed picture, so every listing shows the same city at the
 * same scale and the district is read by where the pin falls — which is the
 * point. A provider asked to show "Kartal" centres itself on Kartal, so the
 * two halves of the city change places between one listing and the next and a
 * reader has nothing to compare. It also cannot be zoomed, which is the
 * behaviour this section wants: the address is a district, and a picture
 * cannot be opened up into a rooftop.
 */
export function PinnedMap({
  lat,
  lng,
  label,
  className = "",
}: {
  lat: number;
  lng: number;
  /** The district, shown beside the pin. */
  label: string;
  className?: string;
}) {
  // Blunted before projecting: see the note on `blunt`.
  const at = place(blunt(lat), blunt(lng), ISTANBUL);
  if (!at) return null;

  return (
    <div
      className={`relative w-full overflow-hidden border border-ink/10 bg-mist ${className}`}
      style={{ aspectRatio: aspectRatio(ISTANBUL) }}
    >
      <Image
        src={MAP}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 640px"
        className="object-cover"
      />

      {/* The tip of the pin is the coordinate, so the marker is pulled up by
          its own height and half its width rather than being centred on it. */}
      <div
        className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
        style={{ left: `${at.left}%`, top: `${at.top}%` }}
      >
        <span className="mb-1 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] text-ink shadow-sm">
          {label}
        </span>
        <Pin />
      </div>

      {/* ODbL requires the credit to travel with the map. */}
      <span className="absolute bottom-0 end-0 bg-white/75 px-1.5 py-0.5 text-[9px] leading-none text-ink/55">
        © OpenStreetMap
      </span>
    </div>
  );
}

/** A dropped marker, drawn rather than fetched. */
function Pin() {
  return (
    <svg
      viewBox="0 0 24 32"
      aria-hidden
      className="h-8 w-6 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
    >
      <path
        d="M12 0C5.7 0 .6 5.1.6 11.4.6 19.9 12 32 12 32s11.4-12.1 11.4-20.6C23.4 5.1 18.3 0 12 0z"
        fill="#D62828"
      />
      <circle cx="12" cy="11.2" r="4.2" fill="#fff" />
    </svg>
  );
}
