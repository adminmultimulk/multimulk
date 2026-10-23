import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { Calendar, WhatsApp } from "@/app/components/icons";
import { Link } from "@/app/components/link";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { whatsapp } from "@/app/lib/content";
import { interpolate } from "@/app/lib/i18n/format";
import { getI18n } from "@/app/lib/i18n";
import {
  formatRoadshowDate,
  googleCalendarUrl,
  icsDataUri,
  isRoadshowCity,
  isRoadshowSlot,
  isolateLtr,
  slotRange,
} from "@/app/lib/roadshow";
import { buildPath, routes, searchPath } from "@/app/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  const { title, description } = t.roadshow.thanks.meta;
  // No `alternates`: a thank-you page has nothing to offer a crawler in any
  // language, and is reached only from the form.
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
  };
}

type SearchParams = Promise<{ city?: string; slot?: string }>;

/**
 * Where the roadshow form lands. The booking arrives in the query string; one
 * that does not parse — a shared or hand-typed URL — still gets the thanks,
 * just without the summary and the calendar links.
 */
export default async function RoadshowThanksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, t } = await getI18n();
  const copy = t.roadshow;
  const { city, slot } = await searchParams;
  const booking =
    isRoadshowCity(city) && isRoadshowSlot(slot) ? { city, slot } : null;

  const cityName = booking ? copy.cities[booking.city].name : "";
  const entry = booking && {
    title: interpolate(copy.thanks.calendarTitle, { city: cityName }),
    details: copy.thanks.calendarDetails,
    location: `${cityName}, Pakistan`,
    ...booking,
  };

  const whatsappHref = `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(
    booking
      ? interpolate(copy.thanks.whatsappMessage, { city: cityName })
      : t.whatsapp.message,
  )}`;

  const explore = [
    {
      label: copy.thanks.exploreCitizenship,
      href: buildPath("citizenshipProgramme", { programme: "turkiye" }),
    },
    {
      label: copy.thanks.exploreProperties,
      href: searchPath({ currency: "USD", location: "İstanbul", cbiOnly: true }),
    },
    { label: copy.thanks.exploreGuide, href: routes.freeGuide.pattern },
  ];

  return (
    <>
      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[460px] items-end overflow-hidden bg-forest-deep pb-14 pt-36 lg:min-h-[520px] lg:pb-16">
          <Image
            src="/images/cbi/hero-istanbul-dusk.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/50" />
          <Container className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {copy.thanks.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[780px] font-display text-[38px] leading-[1.1] text-white sm:text-[54px]">
              <AnimatedTitle>{copy.thanks.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[600px] text-[15px] leading-[25px] text-white/85">
              {copy.thanks.body}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1 py-16 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-mist p-8 sm:p-12">
              {booking && entry ? (
                <>
                  <h2 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">
                    {copy.summary.heading}
                  </h2>
                  <dl className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
                    {[
                      { label: copy.summary.city, value: cityName },
                      { label: copy.summary.date, value: formatRoadshowDate(locale, booking.city) },
                      {
                        label: copy.summary.time,
                        value: `${copy.form.slots[booking.slot]} · ${isolateLtr(slotRange(booking.slot))}`,
                      },
                      { label: copy.summary.venue, value: copy.venueTbc },
                    ].map((row) => (
                      <div key={row.label} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-4">
                        <dt className="text-[12.5px] text-ink/60">{row.label}</dt>
                        <dd className="num text-[14px] text-ink">{row.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                    <Calendar className="w-4" />
                    {copy.thanks.addToCalendar}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={googleCalendarUrl(entry)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-forest px-6 py-2.5 text-[12.5px] text-forest transition-colors hover:bg-forest hover:text-cream"
                    >
                      {copy.thanks.googleCalendar}
                    </a>
                    <a
                      href={icsDataUri(entry)}
                      download={`multimulk-roadshow-${booking.city}.ics`}
                      className="inline-flex items-center justify-center rounded-full border border-forest px-6 py-2.5 text-[12.5px] text-forest transition-colors hover:bg-forest hover:text-cream"
                    >
                      {copy.thanks.icsCalendar}
                    </a>
                  </div>
                </>
              ) : (
                <h2 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">
                  {copy.thanks.heading}
                </h2>
              )}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center justify-center gap-2.5 rounded-full bg-forest px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep"
              >
                <WhatsApp className="w-[18px]" />
                {copy.thanks.whatsapp}
              </a>
            </div>

            <aside className="border border-ink/10 p-8 sm:p-12">
              <h2 className="font-display text-[24px] leading-tight text-ink">
                {copy.thanks.exploreHeading}
              </h2>
              <ul className="mt-6 divide-y divide-ink/10">
                {explore.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-4 py-4 text-[14px] text-ink transition-colors hover:text-gold"
                    >
                      {item.label}
                      <span aria-hidden className="text-gold rtl:-scale-x-100">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={routes.roadshow.pattern}
                className="mt-8 inline-block text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
              >
                {copy.thanks.back}
              </Link>
            </aside>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
