import Image from "next/image";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { EnquireButton } from "../enquire-button";
import type { EnquiryContext } from "../enquiry";
import { Link } from "../link";

/**
 * The sections of a case-study page, in the register of a development page:
 * the photograph first and the words set over it, a centred statement on
 * white, a collage, a row of cards, and a closing band. Server components,
 * all of them; only the slideshow between them needs the client.
 */

/** The banner: the photograph nearly to the fold, the name at its foot. */
export function CaseHero({
  image,
  eyebrow,
  title,
}: {
  image: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="relative flex min-h-[600px] items-end overflow-hidden bg-forest lg:min-h-[88svh]">
      <Image
        src={image}
        alt={title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <Container className="relative pb-14 pt-32 lg:pb-[72px]">
        <p className="text-[11px] uppercase tracking-[0.14em] text-cream/85">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-[900px] font-display text-[42px] leading-[1.05] text-white sm:text-[62px] lg:text-[80px]">
          <AnimatedTitle>{title}</AnimatedTitle>
        </h1>
      </Container>
    </section>
  );
}

/**
 * The statement: a centred heading over a hairline, the paragraph under it,
 * and the engagement's figures in a row — what a reader wants to know before
 * the story, set the way the development page sets "About".
 */
export function CaseAbout({
  heading,
  paragraphs,
  facts,
  link,
}: {
  heading: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
  link: { label: string; href: string };
}) {
  return (
    <section className="bg-white py-[88px] lg:py-[128px]">
      <Container>
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h2 className="font-display text-[34px] leading-[1.15] text-ink sm:text-[48px] lg:text-[56px]">
            <AnimatedTitle align="center" variant="section">
              {heading}
            </AnimatedTitle>
          </h2>
          <span className="mt-8 block h-px w-[280px] max-w-full bg-ink/15" />
          <div className="mt-8 flex flex-col gap-4">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                dir="auto"
                className="text-[14px] leading-[24px] text-ink/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <dl className="mx-auto mt-14 grid max-w-[1000px] gap-x-8 gap-y-8 border-y border-ink/10 py-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[10.5px] uppercase tracking-[0.12em] text-ink/50">
                {fact.label}
              </dt>
              <dd className="mt-3 font-display text-[22px] leading-[1.3] text-ink">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 text-center">
          <Link
            href={link.href}
            className="inline-block border-b border-ink pb-1 text-[12.5px] font-medium text-ink"
          >
            {link.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}

/**
 * Two photographs stepped over one another, the second running off the
 * leading edge of the page, and the words beside them: what the asset is
 * doing now, and what went wrong on the way.
 */
export function CaseCollage({
  images,
  name,
  heading,
  body,
  aside,
}: {
  images: [string, string];
  name: string;
  heading: string;
  body: string;
  aside: { heading: string; body: string };
}) {
  return (
    <section className="overflow-hidden bg-white py-[88px] lg:py-[128px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="relative">
            <div className="relative ms-auto aspect-[4/3] w-[62%] overflow-hidden bg-mist">
              <Image
                src={images[0]}
                alt={name}
                fill
                sizes="(max-width: 1024px) 62vw, 400px"
                className="object-cover"
              />
            </div>
            {/* Stepped up over the first and out past the gutter, so the pair
                read as laid on the page rather than pinned inside it. */}
            <div className="relative -ms-6 -mt-[14%] aspect-[16/10] w-[78%] overflow-hidden bg-mist sm:-ms-10 lg:-ms-[72px]">
              <Image
                src={images[1]}
                alt={name}
                fill
                sizes="(max-width: 1024px) 78vw, 500px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-[34px] leading-[1.12] text-ink sm:text-[46px] lg:text-[54px]">
              <AnimatedTitle variant="section">{heading}</AnimatedTitle>
            </h2>
            <p
              dir="auto"
              className="mt-8 max-w-[520px] text-[14px] leading-[24px] text-ink/80"
            >
              {body}
            </p>

            <h3 className="mt-12 font-display text-[24px] leading-[1.25] text-ink">
              {aside.heading}
            </h3>
            <p
              dir="auto"
              className="mt-4 max-w-[520px] border-s-2 border-gold ps-6 text-[14px] leading-[24px] text-ink/85"
            >
              {aside.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The other engagements: a heading and a line, a rule, and a row of cards. */
export function CaseOthers({
  heading,
  body,
  items,
}: {
  heading: string;
  body: string;
  items: { name: string; description: string; image: string; href: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="bg-white pb-[88px] lg:pb-[128px]">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="font-display text-[36px] leading-[1.1] text-ink sm:text-[52px]">
            <AnimatedTitle variant="section">{heading}</AnimatedTitle>
          </h2>
          <p className="max-w-[440px] text-[13.5px] leading-[22px] text-ink/70">
            {body}
          </p>
        </div>
        <span className="mt-8 block h-px w-full bg-ink/10" />

        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block">
                <div className="relative aspect-[430/310] overflow-hidden bg-mist">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-6 text-center font-display text-[24px] leading-[1.25] text-ink">
                  {item.name}
                </h3>
                <p
                  dir="auto"
                  className="mx-auto mt-3 max-w-[400px] text-center text-[13px] leading-[21px] text-ink/75"
                >
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * The closing band: the photograph full-bleed and, inset within it, the same
 * frame again carrying the invitation — a picture set in its own picture,
 * which is how the reference page closes and what keeps this from reading as
 * the start of the footer.
 */
export function CaseCta({
  image,
  heading,
  body,
  enquiry,
}: {
  image: string;
  heading: string;
  body: string;
  enquiry: EnquiryContext;
}) {
  return (
    <section className="relative overflow-hidden bg-forest py-16 lg:py-24">
      {/* The backdrop is the same frame, softened and darkened, so the inset
          reads as the picture and the surround as its mount. */}
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="scale-105 object-cover blur-sm"
      />
      <div className="absolute inset-0 bg-forest-deep/65" />

      <Container className="relative">
        <div className="relative overflow-hidden py-[96px] lg:py-[150px]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 1440px) 100vw, 1296px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative mx-auto flex max-w-[860px] flex-col items-center px-6 text-center">
            <h2 className="font-display text-[36px] leading-[1.12] text-cream sm:text-[56px]">
              <AnimatedTitle align="center" variant="section">
                {heading}
              </AnimatedTitle>
            </h2>
            <p
              dir="auto"
              className="mt-6 max-w-[620px] text-[14px] leading-[23px] text-cream/90"
            >
              {body}
            </p>
            <EnquireButton
              context={enquiry}
              className="mt-9 rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
