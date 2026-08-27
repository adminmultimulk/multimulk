"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { destinations } from "@/app/lib/content";
import { MapPin } from "./icons";

type RegionKey = keyof typeof destinations;

export function Destinations() {
  const [region, setRegion] = useState<RegionKey>("turkiye");
  const data = destinations[region];

  return (
    <section className="bg-mist py-[72px] lg:py-[100px]">
      <Container>
        <div className="mb-10 flex flex-wrap justify-center gap-3 lg:justify-end">
          {(Object.keys(destinations) as RegionKey[]).map((key) => {
            const isActive = key === region;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRegion(key)}
                aria-pressed={isActive}
                className={`rounded-full border px-6 py-3 text-[12.5px] transition-colors ${
                  isActive
                    ? "border-ink bg-ink font-medium text-white"
                    : "border-ink/35 text-ink hover:border-ink"
                }`}
              >
                {destinations[key].label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-12 lg:grid-cols-[470px_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[28px] leading-[1.35] text-ink sm:text-[34px] sm:leading-[46px]">
              <AnimatedTitle key={data.heading} variant="section">
                {data.heading}
              </AnimatedTitle>
            </h2>
            <p className="mt-[30px] max-w-[450px] text-[12.5px] leading-[21px] text-ink">
              {data.body}
            </p>

            <ul className="mt-[30px] flex flex-col gap-3">
              {data.places.map((place) => (
                <li key={place} className="flex items-center gap-2.5">
                  <MapPin className="w-2.5 shrink-0 text-gold/70" />
                  <span className="text-[13px] text-ink">{place}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-[30px] flex items-start">
              {data.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center px-4 text-center sm:px-5 ${
                    i === 0 ? "pl-0" : "border-l border-ink/20"
                  }`}
                >
                  <dt className="whitespace-nowrap font-display text-[30px] leading-[50px] text-ink sm:text-[40px]">
                    {stat.value}
                  </dt>
                  <dd className="max-w-[150px] text-[11.5px] leading-[17px] text-ink">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[700/560] w-full overflow-hidden lg:aspect-[700/710]">
              <Image
                src={data.map}
                alt={`Multi Mulk destinations in ${data.label}`}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
