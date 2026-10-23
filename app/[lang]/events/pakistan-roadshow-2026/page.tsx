import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { ContactForm } from "@/app/components/contact-form";
import { MapPin } from "@/app/components/icons";
import { JsonLd } from "@/app/components/json-ld";
import { RoadshowForm } from "@/app/components/roadshow-form";
import { ServiceFaq } from "@/app/components/service-faq";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { company, ogImage } from "@/app/lib/content";
import { formatMoney } from "@/app/lib/format-figure";
import { intlLocale } from "@/app/lib/i18n/config";
import { formatDate, formatNumber, interpolate } from "@/app/lib/i18n/format";
import { alternatesFor, getI18n } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import {
  cheapestOfferedRoute,
  getProgramme,
  UNKNOWN,
} from "@/app/lib/programmes";
import {
  cityOpen,
  formatRoadshowDate,
  isolateLtr,
  roadshowCities,
  slotHours,
} from "@/app/lib/roadshow";
import { routes } from "@/app/lib/routes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

/**
 * Regenerated every five minutes, so a city drops out of the form once its day
 * is over and the page turns itself into the "ended" version after Karachi —
 * without a deploy, and without rendering per request for ad traffic. It also
 * keeps the form token well inside its two-hour life.
 */
export const revalidate = 300;

const HERO = "/images/cbi/hero-istanbul-dusk.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const { title, description } = t.roadshow.meta;
  return {
    title: { absolute: title },
    description,
    // A paid landing page with a three-week life: reachable, never ranked.
    robots: { index: false, follow: true },
    alternates: await alternatesFor(routes.roadshow.pattern),
    openGraph: {
      title,
      description,
      siteName: company.name,
      locale: intlLocale[locale],
      type: "website",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RoadshowPage() {
  const { locale, t } = await getI18n();
  const copy = t.roadshow;
  const open = roadshowCities.filter((city) => cityOpen(city));
  const ended = open.length === 0;

  // Every figure on the page is read from the reviewed programme record, so
  // the roadshow cannot quote a threshold the programme page has since revised.
  const programme = getProgramme("citizenship", "turkiye")!;
  const route = cheapestOfferedRoute(programme)!;
  const months = programme.processingMonths === UNKNOWN ? undefined : programme.processingMonths;
  const age = programme.dependentChildMaxAge === UNKNOWN ? null : programme.dependentChildMaxAge;
  const figures = {
    minimum: formatMoney(locale, route.minimum),
    years: route.holdingYears,
    min: months?.min ?? "",
    max: months?.max ?? months?.min ?? "",
    age: age ?? "",
    date: formatDate(locale, programme.review.reviewedOn),
  };

  const facts = [
    { label: copy.facts.minimum, value: figures.minimum },
    months && {
      label: copy.facts.processing,
      value: interpolate(copy.facts.processingValue, figures),
    },
    programme.visaFreeCount !== UNKNOWN && {
      label: copy.facts.visaFree,
      value: formatNumber(locale, programme.visaFreeCount),
    },
    age !== null && {
      label: copy.facts.family,
      value: interpolate(copy.facts.familyValue, figures),
    },
    programme.residencyRequirementDays === null && {
      label: copy.facts.residence,
      value: copy.facts.residenceValue,
    },
  ].filter((fact) => !!fact);

  const hours = interpolate(copy.hours, {
    range: isolateLtr(`${slotHours.morning.start}–${slotHours.evening.end}`),
  });

  return (
    <>
      <JsonLd graph={[breadcrumbs({ locale, id: "roadshow", labels: t.routes })]} />

      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[600px] items-end overflow-hidden bg-forest-deep pb-14 pt-36 lg:min-h-[700px] lg:pb-20">
          <Image src={HERO} alt="" fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/45" />

          <Container className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[820px] font-display text-[40px] leading-[1.1] text-white sm:text-[58px]">
              <AnimatedTitle>{ended ? copy.ended.heading : copy.heading}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[600px] text-[15px] leading-[25px] text-white/85">
              {ended ? copy.ended.body : copy.body}
            </p>

            {ended ? null : (
              <>
                <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] uppercase tracking-[0.12em] text-gold-light">
                  {copy.pillars.map((pillar, index) => (
                    <li key={pillar} className="flex items-center gap-4">
                      {index > 0 ? (
                        <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                      ) : null}
                      {pillar}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-6">
                  <ul className="flex divide-x divide-white/20 rtl:divide-x-reverse">
                    {roadshowCities.map((city) => (
                      <li
                        key={city}
                        className={`px-5 first:ps-0 last:pe-0 ${open.includes(city) ? "" : "opacity-45"}`}
                      >
                        <span className="block font-display text-[22px] leading-tight text-white">
                          {copy.cities[city].name}
                        </span>
                        <span className="mt-1 block text-[12px] text-white/70">
                          {formatRoadshowDate(locale, city, { day: "numeric", month: "short" })}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#register"
                    className="inline-flex items-center justify-center rounded-full bg-gold px-9 py-3.5 text-[13px] text-white transition-colors hover:bg-gold-light"
                  >
                    {copy.cta}
                  </a>
                </div>
              </>
            )}
          </Container>
        </section>
      </div>

      {ended ? (
        <main className="flex-1 py-16 lg:py-20">
          <Container>
            <div className="bg-mist p-8 sm:p-12 lg:p-16">
              <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  <h2 className="max-w-[420px] font-display text-[30px] leading-[1.24] text-ink sm:text-[38px]">
                    {copy.ended.formHeading}
                  </h2>
                  <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                    {copy.ended.formBody}
                  </p>
                </div>
                <ContactForm defaultEnquiry="turkishCitizenship" token={mintFormToken()} />
              </div>
            </div>
          </Container>
        </main>
      ) : (
        <main className="flex-1">
          <section className="py-16 lg:py-24">
            <Container>
              <h2 className="font-display text-[30px] leading-[1.24] text-ink sm:text-[40px]">
                <AnimatedTitle variant="section">{copy.citiesHeading}</AnimatedTitle>
              </h2>
              <p className="mt-5 max-w-[640px] text-[13.5px] leading-[23px] text-ink/80">
                {copy.citiesBody}
              </p>

              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {roadshowCities.map((city) => {
                  const available = open.includes(city);
                  return (
                    <li
                      key={city}
                      className={`flex flex-col border border-ink/10 bg-cream p-7 ${available ? "" : "opacity-60"}`}
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                        {formatRoadshowDate(locale, city)}
                      </p>
                      <h3 className="mt-3 font-display text-[32px] leading-tight text-ink">
                        {copy.cities[city].name}
                      </h3>
                      <p className="num mt-4 text-[13px] text-ink/75">
                        {hours}
                      </p>
                      <p className="mt-2 flex items-start gap-2 text-[13px] text-ink/75">
                        <MapPin className="mt-0.5 w-3.5 shrink-0 text-gold" />
                        {copy.venueTbc}
                      </p>
                      <div className="mt-7 pt-1">
                        {available ? (
                          <a
                            href={`#register-${city}`}
                            className="inline-flex items-center justify-center rounded-full border border-forest px-7 py-3 text-[12.5px] text-forest transition-colors hover:bg-forest hover:text-cream"
                          >
                            {interpolate(copy.bookCity, { city: copy.cities[city].name })}
                          </a>
                        ) : (
                          <span className="text-[12.5px] text-ink/60">{copy.cityClosed}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Container>
          </section>

          <section id="register" className="scroll-mt-[72px] pb-16 lg:pb-24">
            {/* The city cards link to `#register-<city>`; the form reads the
                city from the hash, and this keeps the scroll target. */}
            {roadshowCities.map((city) => (
              <span key={city} id={`register-${city}`} className="block scroll-mt-[72px]" />
            ))}
            <Container>
              <div className="bg-mist p-8 sm:p-12 lg:p-16">
                <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                  <div>
                    <h2 className="max-w-[420px] font-display text-[30px] leading-[1.24] text-ink sm:text-[38px]">
                      {copy.formHeading}
                    </h2>
                    <p className="mt-6 max-w-[440px] text-[13.5px] leading-[23px] text-ink/80">
                      {copy.formBody}
                    </p>

                    <h3 className="mt-10 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                      {copy.stepsHeading}
                    </h3>
                    <ol className="mt-5 space-y-6">
                      {copy.steps.map((step, index) => (
                        <li key={step.title} className="flex gap-4">
                          <span className="num flex size-8 shrink-0 items-center justify-center rounded-full bg-forest text-[13px] text-cream">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-display text-[19px] leading-tight text-ink">
                              {step.title}
                            </p>
                            <p className="mt-1.5 max-w-[380px] text-[13px] leading-[21px] text-ink/75">
                              {step.body}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <RoadshowForm token={mintFormToken()} open={open} />
                </div>
              </div>
            </Container>
          </section>

          <section className="bg-cream py-16 lg:py-24">
            <Container>
              <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                    {copy.agendaEyebrow}
                  </p>
                  <h2 className="mt-4 font-display text-[30px] leading-[1.24] text-ink sm:text-[40px]">
                    <AnimatedTitle variant="section">{copy.agendaHeading}</AnimatedTitle>
                  </h2>
                  <ul className="mt-10 grid gap-8 sm:grid-cols-2">
                    {copy.agenda.map((item) => (
                      <li key={item.title} className="border-t border-gold/40 pt-5">
                        <h3 className="font-display text-[21px] leading-tight text-ink">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-[13px] leading-[22px] text-ink/75">
                          {interpolate(item.body, figures)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="self-start bg-forest p-8 text-cream sm:p-10">
                  <h2 className="font-display text-[24px] leading-tight">{copy.factsHeading}</h2>
                  <dl className="mt-7 divide-y divide-cream/15">
                    {facts.map((fact) => (
                      <div key={fact.label} className="flex items-baseline justify-between gap-6 py-4">
                        <dt className="text-[12.5px] text-cream/70">{fact.label}</dt>
                        <dd className="num text-end font-display text-[19px] text-gold-light">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 text-[11px] leading-[17px] text-cream/60">
                    {interpolate(copy.factsNote, figures)}
                  </p>
                </aside>
              </div>
            </Container>
          </section>

          <ServiceFaq
            heading={copy.faqHeading}
            items={copy.faqs.map((faq) => ({
              question: faq.question,
              answer: interpolate(faq.answer, figures),
            }))}
          />

          <section className="bg-forest-deep py-16 text-center lg:py-20">
            <Container>
              <h2 className="font-display text-[30px] leading-[1.24] text-white sm:text-[40px]">
                {copy.formHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-[520px] text-[13.5px] leading-[23px] text-white/75">
                {copy.formBody}
              </p>
              <a
                href="#register"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-9 py-3.5 text-[13px] text-white transition-colors hover:bg-gold-light"
              >
                {copy.cta}
              </a>
            </Container>
          </section>
        </main>
      )}

      <SiteFooter />
    </>
  );
}
