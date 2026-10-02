import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedTitle } from "@/app/components/animated-title";
import { Container, SectionIntro } from "@/app/components/container";
import {
  Building,
  Calendar,
  Chat,
  ChartBar,
  ChartUp,
  Chevron,
  Clipboard,
  Compass,
  Eye,
  FormPen,
  Globe,
  Graduation,
  Headset,
  Hourglass,
  Key,
  LinkChain,
  Mail,
  Network,
  Passport,
  Presentation,
  PriceTag,
  Question,
  Route,
  Scales,
  Send,
  Shield,
  UserPlus,
  Users,
  WhatsApp,
} from "@/app/components/icons";
import { JsonLd } from "@/app/components/json-ld";
import { Link } from "@/app/components/link";
import { LinkedCopy } from "@/app/components/linked-copy";
import { PartnerForm } from "@/app/components/partner-form";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteNav } from "@/app/components/site-nav";
import { company, contact, ogImage, whatsapp } from "@/app/lib/content";
import { intlLocale } from "@/app/lib/i18n/config";
import { alternatesFor, getI18n } from "@/app/lib/i18n";
import { mintFormToken } from "@/app/lib/leads/token";
import { partnerModels, type PartnerModel } from "@/app/lib/partners";
import { buildPath, routes, searchPath } from "@/app/lib/routes";
import { breadcrumbs, faqPage, routeUrl } from "@/app/lib/seo/jsonld";

const REGISTER = "register";
const FORM_HREF = `#${REGISTER}`;

/**
 * Where each `[anchor](key)` in `dictionary.partners` points. Keys rather than
 * paths in the copy, so a translation never carries a URL.
 */
const links = {
  protection: buildPath("investorProtection"),
  team: buildPath("team"),
  contact: buildPath("contact"),
  realEstate: buildPath("realEstateHub"),
  search: searchPath({ currency: "USD", location: "Türkiye" }),
  citizenshipGuide: buildPath("article", {
    slug: "turkish-citizenship-by-property-investment-2026",
  }),
  turkiye: buildPath("citizenshipProgramme", { programme: "turkiye" }),
  caribbean: buildPath("citizenshipProgramme", { programme: "caribbean" }),
  goldenVisa: buildPath("goldenVisaHub"),
  privacy: buildPath("legal", { slug: "privacy-policy" }),
};

type Icon = (props: { className?: string }) => React.JSX.Element;

/**
 * The icon over each item, in the order the copy lists them. Positional
 * because the copy is a list in every language; a reordered list in
 * `dictionary.partners` has to be reordered here too.
 */
const whyIcons: readonly Icon[] = [Shield, Clipboard, Passport, Headset, Route, Globe];
const whoIcons: readonly Icon[] = [
  Building,
  Globe,
  Passport,
  ChartUp,
  Scales,
  Graduation,
  Network,
  UserPlus,
];
const providesIcons: readonly Icon[] = [Key, PriceTag, Presentation, ChartBar, Passport, Calendar];
const processIcons: readonly Icon[] = [FormPen, Chat, Send, Users];
const principleIcons: readonly Icon[] = [Compass, Globe, LinkChain, Eye, Chat, Hourglass];

/**
 * Section photography. Editorial frames from `public/images/cbi` (Pexels; see
 * its CREDITS.md) and one İstanbul development, each chosen for what the
 * section is about rather than as decoration.
 */
const photos = {
  why: "/images/cbi/cbi-advisory.jpg",
  who: "/images/cbi/cbi-istanbul-strait.jpg",
  provides: "/images/cbi/hero-istanbul-dusk.jpg",
  process: "/images/cbi/cbi-documents.jpg",
  cta: "/images/cbi/hero-istanbul.jpg",
};

const modelArt: Record<PartnerModel, { photo: string; icon: Icon }> = {
  "real-estate": { photo: "/images/levent-residences.webp", icon: Building },
  "citizenship-referral": { photo: "/images/cbi/cbi-passport-turkiye.jpg", icon: Passport },
  "citizenship-residency": { photo: "/images/cbi/cbi-caribbean-aerial.jpg", icon: Globe },
  strategic: { photo: "/images/cbi/hero-dubai-night.jpg", icon: Network },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const { title, description } = t.partners.meta;
  return {
    // The marketing title already names the company, so the layout's
    // "| Multi Mulk" suffix would say it twice.
    title: { absolute: title },
    description,
    alternates: await alternatesFor(routes.partners.pattern),
    // Setting `openGraph` replaces the layout's block wholesale, so the site
    // name, locale and card come along explicitly.
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

export default async function PartnerPage() {
  const { locale, t } = await getI18n();
  const copy = t.partners;

  // The partnerships team has no line of its own yet; until it does, the
  // site's WhatsApp number takes these, opened on a partnership message.
  const contactHref = `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(
    copy.whatsappMessage,
  )}`;

  return (
    <>
      <JsonLd
        graph={[
          breadcrumbs({ locale, id: "partners", labels: t.routes }),
          faqPage(`${routeUrl(locale, "partners")}#faq`, copy.faq.items),
        ]}
      />

      {/* Hero: the photograph full bleed, the offer and both ways in. */}
      <div className="relative">
        <SiteNav />
        <section className="relative flex min-h-[720px] items-end overflow-hidden bg-forest-deep pb-14 pt-36 lg:min-h-[100svh] lg:pb-20">
          <Image
            src="/images/partners/hero.avif"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/50" />

          <Container className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-light">
              {copy.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[860px] font-display text-[40px] leading-[1.1] text-white sm:text-[62px]">
              <AnimatedTitle>{copy.hero.heading}</AnimatedTitle>
            </h1>
            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-16">
              <p className="max-w-[560px] text-[16px] leading-[26px] text-white">
                {copy.hero.subheading}
              </p>
              <p className="max-w-[560px] text-[14px] leading-[23px] text-white/80">
                {copy.hero.body}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={FORM_HREF}
                className="rounded-full bg-cream px-8 py-3.5 font-display text-[15px] text-forest transition-colors hover:bg-white"
              >
                {copy.hero.primary}
              </a>
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/60 px-7 py-3.5 font-display text-[15px] text-white transition-colors hover:bg-white hover:text-forest"
              >
                <WhatsApp className="w-4" />
                {copy.hero.secondary}
              </a>
            </div>
            <p className="mt-6 flex max-w-[640px] items-start gap-3 text-[12.5px] leading-[20px] text-white/70">
              <Users className="mt-0.5 w-4 shrink-0 text-gold-light" />
              {copy.hero.audience}
            </p>
          </Container>
        </section>
      </div>

      <main className="flex-1">
        {/* Why partner: the case beside a photograph, then six benefits,
            three by two, each under its icon. */}
        <section className="bg-white py-[72px] lg:py-[110px]">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <div>
                <h2 className="font-display text-[34px] leading-[1.15] text-ink sm:text-[48px]">
                  <AnimatedTitle variant="section">{copy.why.heading}</AnimatedTitle>
                </h2>
                <span className="mt-6 block h-px w-9 bg-ink/50" />
                <p className="mt-6 max-w-[540px] text-[14.5px] leading-[24px] text-ink/85">
                  {copy.why.intro}
                </p>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={photos.why}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <ul className="mt-14 grid gap-x-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {copy.why.items.map((item, i) => {
                const Icon = whyIcons[i];
                return (
                  <li key={item.title} className="border-t border-ink/12 py-9">
                    <div className="flex items-center justify-between">
                      <IconBadge icon={Icon} />
                      <span className="num font-display text-[15px] text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-[22px] leading-[1.3] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[13.5px] leading-[22px] text-ink/80">
                      <LinkedCopy text={item.body} links={links} />
                    </p>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>

        {/* Who can partner: eight audiences, four by two, over the İstanbul
            skyline faded into the section ground. */}
        <section className="relative overflow-hidden bg-mist py-[72px] lg:py-[110px]">
          <div className="absolute inset-0">
            <Image
              src={photos.who}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-mist from-15% via-mist/85 via-50% to-mist/55" />
          </div>

          <Container className="relative">
            <SectionIntro heading={copy.who.heading} body={copy.who.intro} />
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {copy.who.items.map((item, i) => {
                const Icon = whoIcons[i];
                return (
                  <li
                    key={item.title}
                    className="bg-white p-7 shadow-[0_18px_50px_-30px_rgba(7,31,19,0.45)]"
                  >
                    <span className="flex size-12 items-center justify-center bg-mist text-forest">
                      <Icon className="w-6" />
                    </span>
                    <h3 className="mt-6 border-b border-ink/12 pb-4 text-[11px] font-medium uppercase leading-[17px] tracking-[0.1em] text-gold">
                      {item.title}
                    </h3>
                    <p className="mt-5 text-[13px] leading-[21px] text-ink/80">
                      {item.body}
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className="mx-auto mt-10 max-w-[800px] bg-white/85 px-6 py-4 text-center text-[12px] leading-[19px] text-ink/75 backdrop-blur-sm">
              {copy.who.note}
            </p>
          </Container>
        </section>

        {/* The four partnership models, each under a photograph of what it
            covers, linking to the form with its type chosen. */}
        <section className="bg-white py-[72px] lg:py-[110px]">
          <Container>
            <SectionIntro
              eyebrow={copy.models.eyebrow}
              heading={copy.models.heading}
              body={copy.models.intro}
            />
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16">
              {partnerModels.map((key) => {
                const item = copy.models.items[key];
                const { photo, icon: Icon } = modelArt[key];
                return (
                  <li key={key} className="flex flex-col border border-ink/12">
                    {/* The badge hangs half over the photograph's edge, so it
                        sits outside the box that crops the image. */}
                    <div className="relative">
                      <div className="relative aspect-[16/8] w-full overflow-hidden">
                        <Image
                          src={photo}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 45vw, 100vw"
                          className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                        />
                      </div>
                      <span className="absolute bottom-0 start-7 flex size-14 translate-y-1/2 items-center justify-center rounded-full bg-forest-deep text-gold-light ring-4 ring-white sm:start-10">
                        <Icon className="w-6" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-7 pb-7 pt-12 sm:px-10 sm:pb-10">
                      <h3 className="font-display text-[24px] leading-[1.25] text-ink sm:text-[28px]">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-[12.5px] leading-[20px] text-forest">
                        <span className="font-semibold">
                          {copy.models.bestForLabel}
                        </span>{" "}
                        {item.bestFor}
                      </p>
                      <div className="mt-6 flex-1 border-t border-ink/12 pt-6 text-[13.5px] leading-[22px] text-ink/80">
                        <p>
                          <LinkedCopy text={item.body} links={links} />
                        </p>
                        {item.points.length ? (
                          <ul className="mt-4 space-y-2.5">
                            {item.points.map((point) => (
                              <li key={point} className="flex gap-3">
                                <span
                                  aria-hidden
                                  className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-gold"
                                />
                                <span>
                                  <LinkedCopy text={point} links={links} />
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {item.after ? <p className="mt-4">{item.after}</p> : null}
                      </div>
                      <Link
                        href={`${routes.partners.pattern}?type=${key}${FORM_HREF}`}
                        className="group mt-8 inline-flex items-center gap-2.5 self-start text-[13.5px] font-medium text-forest"
                      >
                        <span className="underline decoration-forest/30 underline-offset-4 transition-colors group-hover:decoration-forest">
                          {item.link}
                        </span>
                        <Chevron className="w-2.5 -rotate-90 rtl:rotate-90" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mx-auto mt-10 max-w-[760px] text-center text-[12px] leading-[19px] text-ink/60">
              {copy.models.note}
            </p>
          </Container>
        </section>

        {/* What partners receive: six cards over İstanbul at dusk, then the
            one contact. */}
        <section className="relative overflow-hidden bg-forest-deep py-[72px] lg:py-[110px]">
          <Image
            src={photos.provides}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep/75" />

          <Container className="relative">
            <SectionIntro
              tone="dark"
              eyebrow={copy.provides.eyebrow}
              heading={copy.provides.heading}
              body={copy.provides.intro}
            />
            <ul className="mt-12 grid gap-px bg-cream/12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {copy.provides.items.map((item, i) => {
                const Icon = providesIcons[i];
                return (
                  <li
                    key={item.title}
                    className="bg-forest-deep/70 p-8 backdrop-blur-sm lg:p-10"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full border border-gold-light/40 text-gold-light">
                      <Icon className="w-6" />
                    </span>
                    <h3 className="mt-6 font-display text-[21px] leading-[1.3] text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[13px] leading-[22px] text-cream/75">
                      {item.body}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 grid gap-6 bg-cream px-8 py-9 lg:grid-cols-[auto_1fr_1.4fr] lg:items-center lg:gap-10 lg:px-12">
              <span className="flex size-16 items-center justify-center rounded-full bg-forest text-cream">
                <Users className="w-8" />
              </span>
              <h3 className="font-display text-[24px] leading-[1.25] text-forest sm:text-[28px]">
                {copy.provides.strip.title}
              </h3>
              <p className="text-[13.5px] leading-[22px] text-ink/80">
                {copy.provides.strip.body}
              </p>
            </div>
          </Container>
        </section>

        {/* How it works: a photograph band, then four steps in a row, each
            under its icon. */}
        <section className="bg-white py-[72px] lg:py-[110px]">
          <Container>
            <SectionIntro
              heading={copy.process.heading}
              body={copy.process.intro}
            />
            <div className="relative mt-12 aspect-[16/7] w-full overflow-hidden sm:aspect-[21/6] lg:mt-16">
              <Image
                src={photos.process}
                alt=""
                fill
                sizes="(max-width: 1440px) 100vw, 1296px"
                className="object-cover"
              />
            </div>
            <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-8">
              {copy.process.steps.map((step, i) => {
                const Icon = processIcons[i];
                return (
                  <li key={step.title}>
                    <div className="flex items-center gap-4">
                      <span className="relative flex size-[58px] shrink-0 items-center justify-center rounded-full border border-gold/45 text-gold">
                        <Icon className="w-6" />
                        <span className="num absolute -end-1 -top-1 flex size-6 items-center justify-center rounded-full bg-forest-deep text-[11px] text-cream">
                          {i + 1}
                        </span>
                      </span>
                      <span aria-hidden className="h-px flex-1 bg-ink/12" />
                    </div>
                    <h3 className="mt-6 font-display text-[21px] leading-[1.3] text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-[22px] text-ink/80">
                      {step.body}
                    </p>
                  </li>
                );
              })}
            </ol>
            <div className="mt-12 flex justify-center">
              <a
                href={FORM_HREF}
                className="inline-flex items-center gap-2.5 rounded-full bg-forest-deep px-8 py-3.5 font-display text-[15px] text-cream transition-colors hover:bg-forest"
              >
                <FormPen className="w-4" />
                {copy.process.cta}
              </a>
            </div>
          </Container>
        </section>

        {/* Why Multi Mulk: the stance, and six principles beside a
            photograph. */}
        <section className="bg-mist py-[72px] lg:py-[110px]">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <h2 className="font-display text-[34px] leading-[1.15] text-ink sm:text-[48px]">
                  <AnimatedTitle variant="section">
                    {copy.whyUs.heading}
                  </AnimatedTitle>
                </h2>
                <p className="mt-4 font-display text-[22px] italic text-forest">
                  {copy.whyUs.subheading}
                </p>
                <p className="mt-6 max-w-[520px] text-[14px] leading-[23px] text-ink/85">
                  {copy.whyUs.body}
                </p>
                <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src="/images/partners/expect.webp"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="self-center">
                <ul className="grid gap-x-10 sm:grid-cols-2">
                  {copy.whyUs.principles.map((item, i) => {
                    const Icon = principleIcons[i];
                    return (
                      <li
                        key={item.lead}
                        className="border-t border-ink/15 py-6 text-[13.5px] leading-[22px] text-ink/80"
                      >
                        <Icon className="mb-3 w-6 text-gold" />
                        <strong className="font-semibold text-ink">
                          {item.lead}
                        </strong>{" "}
                        {item.body}
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href={links.protection}
                  className="group mt-6 inline-flex items-center gap-2.5 text-[13.5px] font-medium text-forest"
                >
                  <Shield className="w-4" />
                  <span className="underline decoration-forest/30 underline-offset-4 transition-colors group-hover:decoration-forest">
                    {copy.whyUs.link}
                  </span>
                  <Chevron className="w-2.5 -rotate-90 rtl:rotate-90" />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Registration: the form beside a photograph. The id is the anchor
            every "Become a Partner" link on the site lands on. */}
        <section
          id={REGISTER}
          className="scroll-mt-20 border-t border-ink/10 bg-gradient-to-b from-mist to-white py-[72px] lg:py-[110px]"
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-[70px]">
              <div className="flex flex-col">
                <h2 className="font-display text-[34px] leading-[1.15] text-ink sm:text-[48px]">
                  <AnimatedTitle variant="section">
                    {copy.form.heading}
                  </AnimatedTitle>
                </h2>
                <p className="mt-6 max-w-[620px] text-[14px] leading-[23px] text-ink/85">
                  {copy.form.body}
                </p>
                <div className="mt-10 flex-1 bg-mist px-6 py-10 sm:px-12 sm:py-12">
                  <PartnerForm
                    token={mintFormToken()}
                    privacy={<LinkedCopy text={copy.form.privacy} links={links} />}
                  />
                </div>
              </div>

              {/* The photograph, with the four steps that follow a submission
                  laid over its foot as a reminder of what happens next. */}
              <div className="relative hidden min-h-[560px] overflow-hidden lg:block">
                <Image
                  src="/images/partners/register.webp"
                  alt=""
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                <ol className="absolute inset-x-6 bottom-6 grid grid-cols-2 gap-px bg-white/25 backdrop-blur-md">
                  {copy.process.steps.map((step, i) => {
                    const Icon = processIcons[i];
                    return (
                      <li
                        key={step.title}
                        className="flex items-center gap-3 bg-forest-deep/70 px-5 py-4 text-[12.5px] leading-[18px] text-cream"
                      >
                        <Icon className="w-5 shrink-0 text-gold-light" />
                        {step.title}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </Container>
        </section>

        {/* The closing invitation, inset so it does not run into the footer. */}
        <section className="bg-white pt-[72px] lg:pt-[110px]">
          <Container>
            <div className="relative isolate overflow-hidden px-6 py-[80px] lg:px-10 lg:py-[100px]">
              <Image
                src={photos.cta}
                alt=""
                fill
                sizes="(max-width: 1440px) 100vw, 1296px"
                className="-z-10 object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-forest-deep/80" />
              <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-full border border-cream/40 text-cream">
                  <Globe className="w-7" />
                </span>
                <h2 className="mt-7 font-display text-[30px] leading-[1.2] text-cream sm:text-[42px]">
                  <AnimatedTitle align="center" variant="section">
                    {copy.cta.heading}
                  </AnimatedTitle>
                </h2>
                <span className="mt-6 block h-px w-9 bg-cream/60" />
                <p className="mt-6 text-[14px] leading-[23px] text-cream/85">
                  {copy.cta.body}
                </p>
                <a
                  href={contactHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-cream px-9 py-3.5 font-display text-[15px] text-forest transition-colors hover:bg-white"
                >
                  <WhatsApp className="w-4" />
                  {copy.cta.button}
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ beside a way to ask anything the list does not answer. Answers
            stay in the DOM when a question is closed, so a crawler reads what
            the FAQPage markup above claims. */}
        <section id="faq" className="scroll-mt-20 bg-white py-[72px] lg:py-[110px]">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="flex size-14 items-center justify-center rounded-full bg-mist text-forest">
                  <Question className="w-7" />
                </span>
                <h2 className="mt-7 font-display text-[34px] leading-[1.15] text-ink sm:text-[44px]">
                  <AnimatedTitle variant="section">{copy.faq.heading}</AnimatedTitle>
                </h2>
                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href={contactHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 border border-ink/12 px-5 py-4 text-[13.5px] text-ink transition-colors hover:border-forest"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest text-cream">
                      <WhatsApp className="w-4" />
                    </span>
                    {copy.hero.secondary}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-4 border border-ink/12 px-5 py-4 text-[13.5px] text-ink transition-colors hover:border-forest"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-forest">
                      <Mail className="w-4" />
                    </span>
                    <span className="num">{contact.email}</span>
                  </a>
                </div>
              </div>

              <div className="border-b border-ink/15">
                {copy.faq.items.map((item, i) => (
                  <details
                    key={item.question}
                    name="partner-faq"
                    open={i === 0}
                    className="group border-t border-ink/15"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-display text-[19px] leading-[1.35] text-ink sm:text-[22px]">
                        {item.question}
                      </h3>
                      <Chevron className="mt-2 w-3 shrink-0 text-gold transition-transform duration-300 group-open:-scale-y-100" />
                    </summary>
                    <p className="max-w-[760px] pb-7 text-[14px] leading-[23px] text-ink/80">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/** An icon in a ringed circle, the badge every benefit sits under. */
function IconBadge({ icon: Icon }: { icon: Icon }) {
  return (
    <span className="flex size-12 items-center justify-center rounded-full border border-gold/40 text-gold">
      <Icon className="w-6" />
    </span>
  );
}
