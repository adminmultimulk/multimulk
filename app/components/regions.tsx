import Image from "next/image";
import { regions } from "@/app/lib/content";
import { AnimatedTitle } from "./animated-title";
import { MapPin } from "./icons";

export function Regions() {
  return (
    <section className="grid md:grid-cols-2">
      {regions.map((region) => (
        <a
          key={region.label}
          href="#"
          className="group relative block h-[520px] overflow-hidden lg:h-[900px]"
        >
          <Image
            src={region.image}
            alt={region.label}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/35 via-transparent to-forest/35" />

          <h2 className="absolute inset-x-6 top-[104px] font-display text-[22px] uppercase tracking-[0.11em] text-white sm:text-[31px] lg:top-[144px]">
            <AnimatedTitle align="center" variant="section">
              {region.label}
            </AnimatedTitle>
          </h2>

          <div className="absolute inset-x-0 bottom-12 flex items-center justify-center gap-2 text-white">
            <MapPin className="w-3" />
            <span className="text-[12px]">{region.caption}</span>
          </div>
        </a>
      ))}
    </section>
  );
}
