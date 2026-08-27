import Image from "next/image";
import { aboutPlaces } from "@/app/lib/about";

/** Each tile is dropped by this much on desktop, so the strip reads as a drift. */
const OFFSETS = ["lg:mt-0", "lg:mt-[105px]", "lg:mt-[52px]", "lg:mt-[100px]"];

export function AboutPlaces() {
  return (
    <section className="overflow-hidden bg-white pb-[72px] lg:pb-[100px]">
      <ul className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-6 sm:px-10 lg:grid-cols-4 lg:gap-[42px] lg:px-[72px]">
        {aboutPlaces.map((place, i) => (
          <li key={place.title} className={OFFSETS[i % OFFSETS.length]}>
            <div className="relative aspect-[255/172] w-full overflow-hidden">
              <Image
                src={place.image}
                alt={place.title}
                fill
                sizes="(max-width: 1024px) 45vw, 255px"
                className="object-cover"
              />
            </div>
            <h3 className="mt-4 text-[11.5px] uppercase tracking-[0.1em] text-gold">
              {place.title}
            </h3>
            <p className="mt-1.5 text-[12.5px] text-ink/75">{place.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
