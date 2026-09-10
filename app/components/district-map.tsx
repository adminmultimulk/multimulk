import { Container } from "./container";

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
 * So the query is a *place name* rather than a latitude and longitude. That
 * distinction is the whole point and is easy to lose: an embed centred on
 * exact coordinates is still centred on them at whatever zoom it opens at, and
 * a reader who scrolls the wheel twice is looking at the roof. Asking Google
 * for "Kartal, İstanbul" instead means zooming in reaches the middle of a
 * district of half a million people — which is what a buyer needs to judge the
 * address, and no more.
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

  const body = (
    <>
      <h2 className="font-display text-[26px] leading-[1.28] text-ink sm:text-[32px]">
        {heading}
      </h2>
      {/* In the column the frame is tall — it is half the page wide, and a
          21:9 slot that narrow is a letterbox with no city in it. Given its
          own band it can be as wide as the section. */}
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
