"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { heroPaths, heroSlides } from "@/app/lib/content";
import { useI18n } from "@/app/lib/i18n/context";
import { interpolate } from "@/app/lib/i18n/format";
import {
  bedroomOptionLabel,
  placeLabel,
  typeLabel,
} from "@/app/lib/i18n/units";
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
import { Link } from "./link";
import { SelectMenu } from "./select-menu";

const ROTATE_MS = 6500;

export function Hero() {
  const { t } = useI18n();
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

      {/*
        Scrims.
        
        Three, not two. The gradients cover the nav and the search bar, but the
        band between them — where the headline, the standfirst and the three
        paths sit — had nothing behind it, so legibility depended entirely on
        the photograph being dark there. The hero cycles through four, and a
        bright sky or a white paper flat-lay left white type sitting on white.
        The even wash fixes that for every slide at once, and is light enough
        that the photograph still reads as a photograph.
      */}
      <div
        className={`pointer-events-none absolute inset-0 transition-colors duration-[1200ms] ease-out ${
          slide.bright ? "bg-black/60" : "bg-black/35"
        }`}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(260px,34svh)] bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(340px,45svh)] bg-gradient-to-t from-black/70 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 sm:px-10 lg:px-[72px]">
        {/*
          The H1 is fixed and says what the business is.

          It used to be the rotating slide caption — "A Sanctuary Shaped by Sea
          & Forests" and four others, changing every 6.5 seconds. Two problems
          with that: a visitor could read the whole hero without learning that
          this is a citizenship and residency advisory, and the only heading on
          the page was written by client-side JavaScript into a different
          string each render. The captions are still here, below, doing what
          they are good at — naming the place in the photograph.
        */}
        <div className="mx-auto mt-[clamp(96px,15svh,140px)] max-w-[1160px] text-center lg:mt-[clamp(112px,16svh,172px)]">
          <h1 className="font-display text-[length:clamp(26px,5svh,34px)] leading-[1.18] text-white sm:text-[length:clamp(32px,6svh,46px)] lg:text-[length:min(60px,6.6svh)]">
            <AnimatedTitle variant="banner" align="center">
              {t.hero.heading}
            </AnimatedTitle>
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-[14px] leading-[23px] text-white/80 sm:text-[15px] sm:leading-[25px]">
            {t.hero.body}
          </p>

          {/* The three things a reader can be here to do, named in the order
              the business ranks them. */}
          <nav
            aria-label={t.hero.pathsLabel}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          >
            {heroPaths.map((path) => (
              <Link
                key={path.key}
                href={path.href}
                /*
                 * All three read as one row of equal choices.
                 *
                 * An outline in cream at 60% over white text would rely on the
                 * photograph behind it being dark, and the hero cycles through
                 * four of them, so each button carries its own translucent
                 * ground and a blur — legible over a bright sky as well as a
                 * night skyline.
                 */
                className="rounded-full border border-cream/70 bg-forest-deep/45 px-7 py-3 text-[12.5px] text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-forest"
              >
                {t.hero.paths[path.key]}
              </Link>
            ))}
          </nav>

          {/* The rotating caption keeps its job: naming what is on screen. */}
          <p
            key={slide.key}
            className="mt-8 text-[12px] uppercase tracking-[0.14em] text-white/85"
          >
            {t.hero.slides[slide.key as keyof typeof t.hero.slides]}
          </p>
        </div>

        <div className="mt-auto pt-[clamp(2rem,7svh,4rem)]">
          <div className="flex items-center justify-center gap-3">
            {heroSlides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                onClick={() => setActive(i)}
                /* The caption, not the pin: two slides have no place name,
                    and "Show " is not a label. */
                aria-label={interpolate(t.hero.showSlide, {
                  name: t.hero.slides[s.key as keyof typeof t.hero.slides],
                })}
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

          {/* Only the slides that show somewhere get a pin. A passport on a
              desk has no map reference, and captioning one with a place would
              be inventing it. The row keeps its height either way so the
              search bar below does not jump between slides. */}
          <div className="mt-2 flex h-4 items-center justify-center gap-2 text-white lg:justify-end">
            {slide.name ? (
              <>
                <MapPin className="w-3" />
                {/* "Cabrits, Dominica" — a Latin name beside a translated
                    place. `<bdi>` isolates the name so the comma stays with it
                    instead of being reordered by the bidi algorithm in Arabic. */}
                <span className="text-[11px] uppercase tracking-[0.11em]">
                  <bdi>{slide.name}</bdi>
                  {slide.place ? <>, {placeLabel(t, slide.place)}</> : null}
                </span>
              </>
            ) : null}
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
  const { t, locale, href, num } = useI18n();
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
    router.push(href(`/search-property?${params}`));
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-full flex-col gap-5 rounded-md border border-white/20 bg-forest/55 px-6 py-5 backdrop-blur-sm lg:flex-row lg:items-center lg:gap-8 lg:px-8"
    >
      <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
        <HeroSelect
          label={t.hero.propertyType}
          value={type}
          onChange={setType}
          options={["Any", ...propertyTypes]}
          format={(v) => (v === "Any" ? t.common.any : typeLabel(t, v))}
        />
        <HeroSelect
          label={t.hero.bedroom}
          value={bedroom}
          onChange={setBedroom}
          options={["Any", ...bedroomOptions]}
          format={(v) =>
            v === "Any" ? t.common.any : bedroomOptionLabel(locale, t, v)
          }
        />
        <HeroSelect
          label={t.hero.country}
          value={location}
          onChange={setLocation}
          options={["Any", ...locations]}
          format={(v) => (v === "Any" ? t.common.any : placeLabel(t, v))}
        />
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] tracking-[0.02em] text-white/70">
            {t.common.startingFrom}
          </span>
          <div className="flex items-end gap-4">
            <BareSelect
              label={t.hero.currency}
              value={currency}
              onChange={(v) => {
                setCurrency(v as Currency);
                setMax("Any");
              }}
              options={currencies}
              className="w-[68px] shrink-0"
            />
            <BareSelect
              label={t.hero.maximumPrice}
              value={max}
              onChange={setMax}
              options={["Any", ...priceCeilings[currency].map(String)]}
              format={(v) => (v === "Any" ? t.common.any : num(Number(v)))}
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
        {t.common.searchProperties}
      </button>
    </form>
  );
}

function HeroSelect(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  format?: (value: string) => string;
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
      triggerClassName="pe-1 text-[13.5px] text-white"
      chevronClassName="text-white/80"
      panelClassName="w-[max(100%,190px)]"
    />
  );
}
