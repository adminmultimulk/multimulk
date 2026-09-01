import Image from "next/image";
import { regions } from "@/app/lib/content";
import { getDictionary } from "@/app/lib/i18n";
import { placeLine } from "@/app/lib/i18n/units";
import { AnimatedTitle } from "./animated-title";
import { MapPin } from "./icons";

export async function Regions() {
  const t = await getDictionary();

  return (
    <section className="grid md:grid-cols-2">
      {regions.map((region) => {
        const label = t.regions[region.key].label;
        return (
          <a
            key={region.key}
            href="#"
            className="group relative block h-[520px] overflow-hidden lg:h-[900px]"
          >
            <Image
              src={region.image}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-forest/35 via-transparent to-forest/35" />

            <h2 className="absolute inset-x-6 top-[104px] font-display text-[22px] uppercase tracking-[0.11em] text-white sm:text-[31px] lg:top-[144px]">
              <AnimatedTitle align="center" variant="section">
                {label}
              </AnimatedTitle>
            </h2>

            <div className="absolute inset-x-0 bottom-12 flex items-center justify-center gap-2 text-white">
              <MapPin className="w-3" />
              <span className="text-[12px]">{placeLine(t, region.places)}</span>
            </div>
          </a>
        );
      })}
    </section>
  );
}
