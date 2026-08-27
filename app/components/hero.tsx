"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { heroSlides } from "@/app/lib/content";
import {
  bedroomOptions,
  currencies,
  locations,
  priceCeilings,
  propertyTypes,
  type Currency,
} from "@/app/lib/properties";
import { AnimatedTitle } from "./animated-title";
import { MapPin } from "./icons";
import { SelectMenu } from "./select-menu";

const ROTATE_MS = 6500;

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % heroSlides.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  const slide = heroSlides[active];

  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden bg-forest">
      {heroSlides.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1200ms] ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Scrims keep the nav and search bar legible over any slide. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(260px,34svh)] bg-gradient-to-b from-forest/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(340px,45svh)] bg-gradient-to-t from-forest/70 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 sm:px-10 lg:px-[72px]">
        <h1 className="mx-auto mt-[clamp(112px,17svh,150px)] max-w-[1160px] font-display text-[length:clamp(26px,5svh,34px)] leading-[1.18] text-white sm:text-[length:clamp(32px,6svh,46px)] lg:mt-[clamp(128px,18svh,190px)] lg:text-[length:min(64px,7svh)]">
          <AnimatedTitle key={slide.title} align="center">
            {slide.title}
          </AnimatedTitle>
        </h1>

        <div className="mt-auto pt-[clamp(2rem,7svh,4rem)]">
          <div className="flex items-center justify-center gap-3">
            {heroSlides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${s.location}`}
                aria-current={i === active}
                className="py-2"
              >
                <span
                  className={`block h-0.5 w-8 transition-colors sm:w-10 ${
                    i === active ? "bg-white" : "bg-white/35"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 text-white lg:justify-end">
            <MapPin className="w-3" />
            <span className="text-[11px] uppercase tracking-[0.11em]">
              {slide.location}
            </span>
          </div>
        </div>

        <div className="pt-[clamp(1rem,3svh,2rem)] pb-[clamp(1rem,3svh,2.5rem)]">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  const router = useRouter();
  const [type, setType] = useState("Any");
  const [bedroom, setBedroom] = useState("Any");
  const [location, setLocation] = useState("Any");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [max, setMax] = useState("Any");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ currency });
    if (type !== "Any") params.set("type", type);
    if (bedroom !== "Any") params.set("bedroom", bedroom);
    if (location !== "Any") params.set("location", location);
    if (max !== "Any") params.set("max", max);
    router.push(`/search-property?${params}`);
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-full flex-col gap-5 rounded-md border border-white/20 bg-forest/55 px-6 py-5 backdrop-blur-sm lg:flex-row lg:items-center lg:gap-8 lg:px-8"
    >
      <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
        <HeroSelect
          label="Property Type"
          value={type}
          onChange={setType}
          options={["Any", ...propertyTypes]}
        />
        <HeroSelect
          label="Bedroom"
          value={bedroom}
          onChange={setBedroom}
          options={["Any", ...bedroomOptions]}
        />
        <HeroSelect
          label="Country"
          value={location}
          onChange={setLocation}
          options={["Any", ...locations]}
        />
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] tracking-[0.02em] text-white/70">
            Starting From
          </span>
          <div className="flex items-end gap-4">
            <BareSelect
              label="Currency"
              value={currency}
              onChange={(v) => {
                setCurrency(v as Currency);
                setMax("Any");
              }}
              options={currencies}
              className="w-[68px] shrink-0"
            />
            <BareSelect
              label="Maximum price"
              value={max}
              onChange={setMax}
              options={["Any", ...priceCeilings[currency].map(String)]}
              format={(v) =>
                v === "Any" ? "Any" : Number(v).toLocaleString("en-US")
              }
              className="flex-1"
            />
          </div>
          <span className="block h-px w-full bg-white/30" />
        </div>
      </div>

      <button
        type="submit"
        className="shrink-0 rounded-full border border-white/85 bg-white/10 px-8 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
      >
        Search Properties
      </button>
    </form>
  );
}

function HeroSelect(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[11px] tracking-[0.02em] text-white/70">
        {props.label}
      </span>
      <BareSelect {...props} />
      <span className="block h-px w-full bg-white/30" />
    </div>
  );
}

/** The design's inline text control: a bare value with a chevron. */
function BareSelect({
  className = "",
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  format?: (value: string) => string;
  className?: string;
}) {
  return (
    <SelectMenu
      {...props}
      className={className}
      triggerClassName="pr-1 text-[13.5px] text-white"
      chevronClassName="text-white/80"
      panelClassName="w-[max(100%,190px)]"
    />
  );
}
