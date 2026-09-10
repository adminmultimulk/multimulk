import { Container } from "./container";
import { PinnedMap, mapAvailable } from "./pinned-map";
import { districtCentre } from "@/app/lib/districts";

/**
 * Where a development sits, at the resolution of its district.
 *
 * The map on a unit's page used to be a street-level pin on the exact
 * coordinates the lister typed in, which answered a question nobody on this
 * site wants answered: a reader with the building centred at z=15 has the
 * development's name a moment later, and the introduction Multi Mulk is paid
 * for has already happened without it. Watermarking the photography while
 * leaving that pin in place would have been guarding the window and not the
 * door.
 *
 * What it draws instead is a fixed picture of the whole city with one pin on
 * it — see `pinned-map.tsx`. Every listing gets the same İstanbul at the same
 * scale, so the district is read by where the pin falls rather than by a frame
 * that moves under it; and a picture cannot be opened up into a rooftop, which
 * is the part an embed can never promise.
 *
 * The embed below is the fallback, for a place the picture does not cover — a
 * Caribbean listing, or a district outside the rectangle. There it is asked
 * for a *place name* rather than a latitude and longitude, which matters more
 * than the zoom does: an embed centred on coordinates stays centred on them
 * however far out it opens, and two turns of the wheel is the roof.
 *
 * `mapLat`/`mapLng` stay on the model. They are still the right thing for a
 * lister to record, and nothing here stops a future private view from using
 * them; they are simply not what the public page draws.
 */
export function DistrictMap({
  area,
  country,
  heading,
  mapTitle,
  linkLabel,
  locale,
  district,
  lat,
  lng,
  inline = false,
}: {
  /** The district as written on the listing — "Kartal, Istanbul". */
  area: string;
  country: string;
  heading: string;
  /** Already interpolated; used as the iframe's accessible name. */
  mapTitle: string;
  linkLabel: string;
  locale: string;
  /**
   * The district chosen in the dashboard, when one was. It outranks whatever
   * `location` happens to say — a lister who picks Kartal has answered the
   * question that parsing a free-text field only guesses at.
   */
  district?: string | null;
  /**
   * The listing's own coordinates, used only when `area` names a district the
   * table in `app/lib/districts.ts` does not carry. The district centre is
   * preferred: it is available far more often — these two are optional and
   * usually empty — and it describes an area rather than a building.
   */
  lat?: number | null;
  lng?: number | null;
  /**
   * Render as a plain block rather than a full-width band.
   *
   * The development page puts this in the column beside the overview, directly
   * under the photography — which is where a reader looking at the buildings
   * asks where they are, and which is also the only thing long enough to fill
   * the space that column's photographs leave under them.
   */
  inline?: boolean;
}) {
  // "Kartal, Istanbul" plus a country reads as one place to Google; repeating
  // a name the area already carries does not, so the country is only added
  // when it is genuinely absent.
  const place = area.toLowerCase().includes(country.toLowerCase())
    ? area
    : `${area}, ${country}`;
  const query = encodeURIComponent(place);
  // The label on the pin is the district alone: the frame is already all of
  // İstanbul, so repeating the city on the marker says nothing.
  const label = district?.trim() || area.split(",")[0].trim() || area;

  // The district's own centre first, and the listing's coordinates only if the
  // name is one the table does not carry. The centre is both the more
  // available answer — `mapLat`/`mapLng` are optional and usually empty — and
  // the safer one, since it describes an area rather than a building.
  //
  // The picture is preferred wherever it can answer at all: it frames the whole
  // city identically on every listing and cannot be zoomed into the building,
  // which an embed can. `PinnedMap` returns null for a point outside İstanbul,
  // so a Caribbean listing falls through to the embed on its own.
  // What the lister chose in the dashboard wins, then whatever `location`
  // names, then the listing's own coordinates.
  const centre =
    (district ? districtCentre(district) : null) ??
    districtCentre(area) ??
    (typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null);

  const pinned =
    mapAvailable && centre ? (
      <PinnedMap
        lat={centre.lat}
        lng={centre.lng}
        label={label}
        className="mt-6"
      />
    ) : null;

  const body = (
    <>
      <h2 className="font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
        {heading}
      </h2>

      {pinned ?? (
        /* In the column the frame is tall — it is half the page wide, and a
           21:9 slot that narrow is a letterbox with no city in it. Given its
           own band it can be as wide as the section. */
        <div
          className={`mt-6 w-full overflow-hidden border border-ink/10 bg-white ${
            inline
              ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3]"
              : "mt-8 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
          }`}
        >
          <iframe
            src={`https://www.google.com/maps?q=${query}&hl=${locale}&z=11&output=embed`}
            title={mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      )}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-[11.5px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-gold"
      >
        {linkLabel}
      </a>
    </>
  );

  if (inline) return <div>{body}</div>;

  return (
    <section className="bg-mist py-16 lg:py-20">
      <Container>{body}</Container>
    </section>
  );
}
