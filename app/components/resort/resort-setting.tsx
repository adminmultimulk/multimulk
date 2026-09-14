import Image from "next/image";
import { AnimatedTitle } from "../animated-title";
import { Container } from "../container";

/**
 * Where the resort stands, as a centred statement, and then the panorama
 * that proves it.
 *
 * The panorama is full-bleed and fades in from white at its top edge — it
 * follows a block of centred text on white, and a hard top edge under a
 * paragraph reads as a picture dropped into the page. Fading it lets the
 * statement run down into the view.
 */
export function ResortSetting({
  heading,
  subheading,
  paragraphs,
  image,
  name,
}: {
  heading: string;
  subheading: string;
  paragraphs: string[];
  image: string;
  name: string;
}) {
  return (
    <section className="bg-white pt-16 lg:pt-24">
      <Container>
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <h2 className="font-display text-[32px] leading-[1.18] text-ink sm:text-[48px]">
            <AnimatedTitle align="center" variant="section">
              {heading}
            </AnimatedTitle>
          </h2>
          <p className="mt-6 text-[19px] leading-[1.35] text-ink sm:text-[24px]">
            {subheading}
          </p>
          <div className="mt-6 flex max-w-[760px] flex-col gap-4">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                dir="auto"
                className="text-[13.5px] leading-[23px] text-ink/85"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>

      <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-mist sm:aspect-[21/9] lg:mt-16 lg:aspect-[2.6/1]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
