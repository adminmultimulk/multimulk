import Image from "next/image";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { aboutMap } from "@/app/lib/about";
import { MapPin } from "./icons";

export function AboutMap() {
  return (
    <section className="bg-white pb-[72px] lg:pb-[110px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[533px_1fr] lg:gap-[130px]">
          <div>
            <h2 className="font-display text-[28px] leading-[1.28] text-ink sm:text-[38px] sm:leading-[52px]">
              <AnimatedTitle variant="section">{aboutMap.heading}</AnimatedTitle>
            </h2>
            <p className="mt-7 max-w-[568px] text-[12.5px] leading-[21px] text-ink/80">
              {aboutMap.body}
            </p>

            <ul className="mt-9 flex flex-col gap-4">
              {aboutMap.places.map((place) => (
                <li
                  key={place.name}
                  className="flex flex-wrap items-center gap-x-2.5 gap-y-1"
                >
                  <MapPin className="w-2.5 shrink-0 text-gold/70" />
                  <span className="text-[13px] text-ink">{place.name}</span>
                  <span className="text-[11px] text-ink/50">
                    {place.region}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[778/620] w-full overflow-hidden lg:aspect-[778/700]">
            <Image
              src={aboutMap.image}
              alt={aboutMap.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 778px"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
