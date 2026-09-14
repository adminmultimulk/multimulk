import Image from "next/image";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { MapPin } from "../icons";

/**
 * The banner of a resort page: the photograph, the operator's mark, the name,
 * and the two or three figures that describe the resort in a glance.
 *
 * The figures sit at the trailing end of the banner's bottom edge rather than
 * under the copy — they are the resort's, not the paragraph's, and put beside
 * the text they read as a footnote to it. On a phone they fall in under the
 * copy, where the bottom-right corner no longer exists.
 */
export function ResortHero({
  image,
  name,
  place,
  tagline,
  intro,
  stats,
  brandLogo,
  brandName,
  compact = false,
}: {
  image: string;
  name: string;
  /** A smaller title — for a comparison, whose name is three or four programmes long. */
  compact?: boolean;
  /** Already localised — "Portsmouth · Dominica". */
  place: string;
  tagline: string;
  intro: string;
  stats: { value: string; label: string }[];
  brandLogo?: string;
  brandName?: string;
}) {
  return (
    <section className="relative flex min-h-[640px] items-end overflow-hidden bg-forest lg:min-h-[780px]">
      <Image
        src={image}
        alt={name}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/* The same three scrims as the development page: shade only where type
          sits, and leave the sky and the sea at full brightness. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

      <Container className="relative pb-14 pt-28 lg:pb-16 lg:pt-32">
        {brandLogo ? (
          /* The operator's mark on a white tile, as a hotel brand presents
             itself — the mark is drawn for print and disappears against a
             photograph. */
          <div className="mb-10 inline-flex bg-white p-4">
            <Image
              src={brandLogo}
              alt={brandName ?? ""}
              width={150}
              height={90}
              className="h-[72px] w-auto object-contain"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-2 text-cream/85">
              <MapPin className="w-3" />
              <span className="text-[11px] uppercase tracking-[0.11em]">
                {place}
              </span>
            </div>
            {/* The resort name is the same in every language. */}
            <h1
              className={`mt-5 font-display leading-[1.1] text-white ${
                compact
                  ? "text-[32px] sm:text-[44px] lg:text-[52px]"
                  : "text-[40px] sm:text-[58px] lg:text-[68px]"
              }`}
            >
              <AnimatedTitle>{name}</AnimatedTitle>
            </h1>
            <p className="mt-6 max-w-[600px] text-[19px] leading-[1.4] text-cream sm:text-[22px]">
              <AnimatedTitle delay={0.25}>{tagline}</AnimatedTitle>
            </p>
            <p
              dir="auto"
              className="mt-5 max-w-[640px] text-[13.5px] leading-[23px] text-cream/85"
            >
              {intro}
            </p>
          </div>

          {stats.length ? (
            <dl className="flex shrink-0 flex-wrap gap-x-12 gap-y-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-[40px] leading-none text-white sm:text-[48px]">
                    {stat.value}
                  </dd>
                  <dt className="mt-3 text-[11px] uppercase tracking-[0.12em] text-cream/85">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
