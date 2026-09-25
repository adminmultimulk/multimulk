import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container } from "@/app/components/container";
import { Mail, MapPin, Phone } from "@/app/components/icons";
import { JsonLd } from "@/app/components/json-ld";
import { PartnerForm } from "@/app/components/partner-form";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { contact } from "@/app/lib/content";
import { alternatesFor, getDictionary, getI18n } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import { partnerTracks, type PartnerTrack } from "@/app/lib/partners";
import { routes } from "@/app/lib/routes";
import { breadcrumbs } from "@/app/lib/seo/jsonld";

/** The line illustration over each track. */
const trackArt: Record<PartnerTrack, { src: string; width: number; height: number }> = {
  turkiye: { src: "/images/partners/track-istanbul.svg", width: 173, height: 150 },
  caribbean: { src: "/images/partners/track-bay.svg", width: 191, height: 120 },
};

const REGISTER = "register";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    ...t.partners.meta,
    alternates: await alternatesFor(routes.partners.pattern),
  };
}

export default async function PartnerPage() {
  const { locale, t } = await getI18n();
  const copy = t.partners;
  const office = contact.offices[0];
  const phone = contact.phones[0];

  return (
    <>
      <JsonLd
        graph={[breadcrumbs({ locale, id: "partners", labels: t.routes })]}
      />

      {/* Hero: the photograph full bleed, the title low on the left and the
          standfirst opposite it. */}
      <div className="relative">
        <SiteNav />
        <section className="relative flex h-[640px] items-end overflow-hidden bg-forest-deep pb-14 sm:h-[760px] lg:h-[100svh] lg:max-h-[900px] lg:min-h-[680px] lg:pb-20">
          <Image
            src="/images/partners/hero.avif"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35" />

          <Container className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="font-display text-[46px] leading-[1.1] text-white sm:text-[68px]">
                <AnimatedTitle>{copy.heading}</AnimatedTitle>
              </h1>
              <p className="max-w-[460px] text-[14.5px] leading-[23px] text-white/90">
                {copy.body}
              </p>
            </div>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* The offer, and the two tracks beside it. */}
        <section className="bg-white py-[72px] lg:py-[120px]">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <h2 className="max-w-[520px] font-display text-[36px] leading-[1.14] text-ink sm:text-[56px]">
                  <AnimatedTitle variant="section">
                    {copy.introHeading}
                  </AnimatedTitle>
                </h2>
                <p className="mt-7 max-w-[530px] text-[15px] leading-[24px] text-ink/85">
                  {copy.introBody}
                </p>
                <a
                  href={`#${REGISTER}`}
                  className="mt-8 inline-block rounded-full bg-forest-deep px-8 py-3.5 font-display text-[15px] text-cream transition-colors hover:bg-forest"
                >
                  {copy.register}
                </a>
              </div>

              <div>
                <p className="text-[15px] text-forest">{copy.tracksLabel}</p>
                <ul className="mt-7 grid gap-12 sm:grid-cols-[1fr_auto_1fr] sm:gap-10">
                  {partnerTracks.map((key, i) => {
                    const track = copy.tracks[key];
                    const art = trackArt[key];
                    return (
                      <li key={key} className="contents">
                        {i > 0 ? (
                          <span
                            aria-hidden
                            className="relative hidden w-px bg-ink/15 sm:block"
                          >
                            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-ink/25 bg-white" />
                          </span>
                        ) : null}
                        <div>
                          <div className="flex h-[112px] items-end">
                            <Image
                              src={art.src}
                              alt=""
                              width={art.width}
                              height={art.height}
                              unoptimized
                              className="h-full w-auto"
                            />
                          </div>
                          <h3 className="mt-9 text-[15px] font-medium uppercase tracking-[0.02em] text-ink">
                            {track.title}
                          </h3>
                          <p className="mt-4 text-[14.5px] leading-[23px] text-ink/80">
                            {track.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Registration: the form on the left, a photograph and the contact
            details on the right. */}
        <section
          id={REGISTER}
          className="scroll-mt-20 border-t border-ink/10 bg-gradient-to-b from-mist to-white pt-[72px] lg:pt-[120px]"
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-[70px]">
              <div className="flex flex-col">
                <h2 className="font-display text-[36px] leading-[1.14] text-ink sm:text-[56px]">
                  <AnimatedTitle variant="section">
                    {copy.formHeading}
                  </AnimatedTitle>
                </h2>
                <p className="mt-6 max-w-[680px] text-[15px] leading-[24px] text-ink/85">
                  {copy.formBody}
                </p>
                <div className="mt-12 flex-1 bg-mist px-6 py-10 sm:px-12 sm:py-14">
                  <PartnerForm token={mintFormToken()} />
                </div>
              </div>

              <div className="pb-[72px] lg:pb-[120px]">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="/images/partners/register.webp"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
                  <div>
                    <h3 className="font-display text-[22px] text-ink">
                      {copy.generalHeading}
                    </h3>
                    <p className="mt-4 flex items-start gap-3 text-[14px] leading-[22px] text-ink">
                      <MapPin className="mt-1 w-3.5 shrink-0 text-ink/60" />
                      {t.footer.addresses[office.key]}
                    </p>
                    <a
                      href={`tel:${phone.number.replace(/\s/g, "")}`}
                      className="mt-4 flex items-start gap-3 text-[14px] text-ink transition-colors hover:text-gold"
                    >
                      <Phone className="mt-0.5 w-4 shrink-0 text-ink/60" />
                      <span className="num">{phone.number}</span>
                    </a>
                  </div>
                  <span aria-hidden className="hidden w-px bg-ink/15 sm:block" />
                  <div>
                    <h3 className="font-display text-[22px] text-ink">
                      {copy.getInTouchHeading}
                    </h3>
                    <p className="mt-4 text-[14px] leading-[22px] text-ink/85">
                      {copy.getInTouchBody}
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-4 flex items-start gap-3 text-[14px] text-ink transition-colors hover:text-gold"
                    >
                      <Mail className="mt-0.5 w-4 shrink-0 text-ink/60" />
                      <span className="num">{contact.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* What each track involves, one open at a time. `name` groups the
            two <details> so opening one closes the other, without script. */}
        <section className="bg-white py-[72px] lg:py-[120px]">
          <Container>
            <h2 className="font-display text-[36px] leading-[1.14] text-ink sm:text-[56px]">
              <AnimatedTitle variant="section">{copy.expectHeading}</AnimatedTitle>
            </h2>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.12fr] lg:gap-12">
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src="/images/partners/expect.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="self-start border-b border-ink/15">
                {partnerTracks.map((key, i) => {
                  const item = copy.expect[key];
                  return (
                    <details
                      key={key}
                      name="partner-expect"
                      open={i === 0}
                      className="group border-t border-ink/15"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-4 py-5 [&::-webkit-details-marker]:hidden">
                        <span className="font-display text-[26px] leading-[1.2] text-ink sm:text-[34px]">
                          {item.title}
                        </span>
                        <span
                          aria-hidden
                          className="relative size-10 shrink-0 rounded-full bg-forest text-cream"
                        >
                          <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-current" />
                          <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-current transition-transform group-open:scale-y-0" />
                        </span>
                      </summary>
                      <div className="px-4 pb-8 text-[15px] leading-[24px] text-ink/85">
                        <p className="max-w-[620px]">{item.body}</p>
                        {item.includes.length ? (
                          <>
                            <p className="mt-6">{copy.includesLabel}</p>
                            <ul>
                              {item.includes.map((line) => (
                                <li key={line}>- {line}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
