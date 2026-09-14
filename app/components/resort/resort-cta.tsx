import Image from "next/image";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { Link } from "../link";

/**
 * The closing band: the resort's name once more over a photograph, one
 * sentence, and the two ways forward — the enquiry form up the page, and the
 * programme it qualifies under.
 *
 * Inset from the page edges rather than full-bleed, so that it reads as the
 * last frame of the page and not as the start of the footer under it.
 */
export function ResortCta({
  heading,
  body,
  image,
  primary,
  secondary,
}: {
  heading: string;
  body: string;
  image: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="bg-white pb-16 pt-4 lg:pb-24">
      <Container>
        <div className="relative overflow-hidden bg-forest py-[86px] lg:py-[130px]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 1440px) 100vw, 1296px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep/65" />

          <div className="relative mx-auto flex max-w-[860px] flex-col items-center px-6 text-center">
            <h2 className="font-display text-[34px] leading-[1.15] text-cream sm:text-[52px]">
              <AnimatedTitle align="center" variant="section">
                {heading}
              </AnimatedTitle>
            </h2>
            <p
              dir="auto"
              className="mt-6 max-w-[640px] text-[13.5px] leading-[23px] text-cream/85"
            >
              {body}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href={primary.href}
                className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
              >
                {primary.label}
              </Link>
              {secondary ? (
                <Link
                  href={secondary.href}
                  className="rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-forest"
                >
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
