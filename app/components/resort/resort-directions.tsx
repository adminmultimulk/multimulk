import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { Mail, MapPin, Phone } from "../icons";

/**
 * How to reach the resort: the address as a card, with the desk to call
 * about it, beside a map.
 *
 * The email and the phone are Multi Mulk's rather than the hotel's front
 * desk. A reader on this page is an investor, and the number an investor
 * needs is the adviser's — the resort's own reservations line is a search
 * away and would route the enquiry past the firm.
 *
 * The map is an embed centred on a place name, at a zoom that shows the bay
 * and the town: this is a hotel, and where it stands is public — the reason
 * the district map on a listing avoids a rooftop does not apply.
 */
export function ResortDirections({
  heading,
  addressLabel,
  address,
  email,
  phone,
  mapQuery,
  mapTitle,
  mapLink,
  locale,
}: {
  heading: string;
  addressLabel: string;
  address: string;
  email: string;
  phone: string;
  mapQuery: string;
  mapTitle: string;
  mapLink: string;
  locale: string;
}) {
  const query = encodeURIComponent(mapQuery);
  const directions = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <h2 className="max-w-[460px] font-display text-[34px] leading-[1.12] text-ink sm:text-[48px]">
              <AnimatedTitle variant="section">{heading}</AnimatedTitle>
            </h2>

            <div className="mt-12 max-w-[420px] border border-ink/10 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[15px] text-ink">{addressLabel}</h3>
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={mapLink}
                  className="text-ink/60 transition-colors hover:text-gold"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    stroke="currentColor"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 rtl:-scale-x-100"
                  >
                    <path d="M3 13L13 3M5 3h8v8" />
                  </svg>
                </a>
              </div>

              <ul className="mt-5 flex flex-col gap-3.5 text-[13.5px] leading-[21px] text-ink">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 w-3.5 shrink-0 text-ink/60" />
                  <span dir="ltr" className="text-start">
                    {address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-3.5 shrink-0 text-ink/60" />
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-gold"
                  >
                    {email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-3.5 shrink-0 text-ink/60" />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    dir="ltr"
                    className="transition-colors hover:text-gold"
                  >
                    {phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="aspect-[4/3] w-full overflow-hidden border border-ink/10 bg-mist sm:aspect-[16/10] lg:aspect-[4/3]">
              <iframe
                src={`https://www.google.com/maps?q=${query}&hl=${locale}&z=13&output=embed`}
                title={mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[11.5px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-gold"
            >
              {mapLink}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
