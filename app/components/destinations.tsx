"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatedTitle } from "./animated-title";
import { Container } from "./container";
import { Figure } from "./figure";
import { destinations, type DestinationKey } from "@/app/lib/content";
import { useI18n } from "@/app/lib/i18n/context";
import { interpolate } from "@/app/lib/i18n/format";
import { placeLine } from "@/app/lib/i18n/units";
import { MapPin } from "./icons";

export function Destinations() {
  const { t } = useI18n();
  const [region, setRegion] = useState<DestinationKey>("turkiye");
  const data = destinations[region];
  const copy = t.destinations[region];
  /* Türkiye lists places, which are translated; the Caribbean lists
     development names, which are not. */
  const lines =
    region === "turkiye"
      ? destinations.turkiye.places.map((place) => placeLine(t, place))
      : destinations.caribbean.names;

  return (
    <section className="bg-mist py-[72px] lg:py-[100px]">
      <Container>
        <div className="mb-10 flex flex-wrap justify-center gap-3 lg:justify-end">
          {(Object.keys(destinations) as DestinationKey[]).map((key) => {
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
                {t.destinations[key].label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-12 lg:grid-cols-[470px_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[28px] leading-[1.35] text-ink sm:text-[34px] sm:leading-[46px]">
              <AnimatedTitle key={copy.heading} variant="section">
                {copy.heading}
              </AnimatedTitle>
            </h2>
            <p className="mt-[30px] max-w-[450px] text-[12.5px] leading-[21px] text-ink">
              {copy.body}
            </p>

            <ul className="mt-[30px] flex flex-col gap-3">
              {lines.map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <MapPin className="w-2.5 shrink-0 text-gold/70" />
                  <span className="text-[13px] text-ink">{line}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-[30px] grid items-start sm:grid-cols-3">
              {data.stats.map((stat, i) => (
                <div
                  key={stat.key}
                  className={`flex min-w-0 flex-col items-center px-2 text-center ${
                    i === 0
                      ? "sm:ps-0"
                      : "mt-6 border-t border-ink/20 pt-6 sm:mt-0 sm:border-s sm:border-t-0 sm:pt-0"
                  }`}
                >
                  {"figure" in stat ? (
                    <Figure
                      id={stat.figure}
                      label={(copy.stats as Record<string, string>)[stat.key]}
                      size="sm"
                    />
                  ) : (
                    <>
                      <dt className="num whitespace-nowrap font-display text-[22px] leading-none text-ink">
                        {stat.value}
                      </dt>
                      <dd className="mt-3 max-w-[150px] text-[11.5px] leading-[17px] text-ink">
                        {(copy.stats as Record<string, string>)[stat.key]}
                      </dd>
                    </>
                  )}
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            {/* Cutout artwork on transparency, not a photograph, so the frame
                contains it on the section's ground rather than cropping to
                fill — a cover crop would cut the passport out of the collage.
                Square on mobile because the artwork is portrait-ish and a
                landscape frame would letterbox it heavily. */}
            <div className="relative aspect-square w-full lg:aspect-[700/710]">
              <Image
                src={data.passport.src}
                alt={interpolate(t.destinations.passportAlt, {
                  region: copy.label,
                })}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                style={{ objectPosition: data.passport.position }}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
