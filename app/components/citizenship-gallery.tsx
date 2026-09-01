import Image from "next/image";
import { Container, SectionIntro } from "./container";
import type { Programme } from "@/app/lib/citizenship";
import { getDictionary } from "@/app/lib/i18n";

/**
 * The photography, as a strip that scrolls sideways.
 *
 * Deliberately not a JavaScript carousel: scroll-snap gives a touch device the
 * behaviour it already expects, a trackpad the behaviour it already expects,
 * and a keyboard a scrollable region — with nothing to hydrate. The strip
 * follows the page's direction, so it runs right to left in Arabic and Urdu.
 */
export async function CitizenshipGallery({
  programme,
}: {
  programme: Programme;
}) {
  const t = await getDictionary();
  const copy = t.citizenship[programme.key].gallery;

  return (
    <section
      id="gallery"
      className="scroll-mt-[72px] bg-white py-[72px] lg:py-[104px]"
    >
      <Container>
        <SectionIntro
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
        />
      </Container>

      {/* Full-bleed past the container, so the strip runs to both edges. */}
      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:px-10 lg:mt-16 lg:px-[72px] [&::-webkit-scrollbar]:hidden">
        {programme.gallery.map((shot, i) => (
          <figure
            key={`${shot.image}-${i}`}
            className="relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden sm:w-[42vw] lg:aspect-[3/4] lg:w-[26vw]"
          >
            <Image
              src={shot.image}
              alt=""
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 26vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-deep/85 to-transparent" />
            {/* The development name is the same in every language. */}
            <figcaption className="absolute inset-x-5 bottom-5 font-display text-[17px] leading-[1.3] text-cream">
              {shot.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
