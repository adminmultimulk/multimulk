import Image from "next/image";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";
import { Link } from "../link";

/**
 * The hand-off to the programme: what an investment in the resort buys
 * beyond the resort.
 *
 * A photograph on the leading side and a dark panel that overlaps it from
 * the trailing side, sitting a little lower — the overlap is what makes the
 * two read as one object rather than as a picture next to a box. On a phone
 * the panel drops under the photograph and the overlap goes with it.
 */
export function ResortCbi({
  eyebrow,
  heading,
  body,
  button,
  href,
  image,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  button: string;
  href: string;
  image: string;
}) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="relative lg:grid lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[16/10] overflow-hidden bg-mist lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:aspect-[4/3]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>

          {/* Positioned, so it paints over the photograph: the frame beside
              it is positioned for `fill`, and without this the overlap ran
              the other way and the photo covered the first word of every
              line. */}
          <div className="relative z-10 bg-ink px-8 py-10 text-cream sm:px-12 sm:py-14 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mt-24 lg:px-16 lg:py-16">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-sand">
              {eyebrow}
            </p>
            <h2 className="mt-5 font-display text-[30px] leading-[1.2] text-cream sm:text-[38px]">
              <AnimatedTitle variant="section">{heading}</AnimatedTitle>
            </h2>
            <p
              dir="auto"
              className="mt-6 max-w-[620px] text-[13.5px] leading-[23px] text-cream/85"
            >
              {body}
            </p>
            <Link
              href={href}
              className="mt-9 inline-block rounded-full border border-cream/70 px-8 py-3.5 text-[13px] text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              {button}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
