"use client";

import Image from "next/image";
import type { Currency, Unit } from "@/app/lib/properties";
import { projects } from "@/app/lib/projects";
import { useI18n } from "@/app/lib/i18n/context";
import { placeLabel, unitSpecs, unitTitle } from "@/app/lib/i18n/units";
import { Link } from "./link";
import { Area, Bath, Bed, Building, MapPin, Stairs, ViewIcon } from "./icons";

const SPEC_ICONS = [Building, Bath, Bed, Area, Stairs, ViewIcon];

export function UnitCard({
  unit,
  currency,
}: {
  unit: Unit;
  currency: Currency;
}) {
  const { t, locale, num } = useI18n();
  const price = unit.prices[currency];
  const project = projects.find((p) => p.name === unit.project);
  const title = unitTitle(locale, t, unit);
  const specs = unitSpecs(locale, t, unit)
    .map((value, i) => ({ Icon: SPEC_ICONS[i], value }))
    .filter((spec) => spec.value);

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[448/300] w-full overflow-hidden bg-mist">
        <Image
          src={unit.image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 440px"
          className="object-cover"
        />
        {unit.cbiEligible && !unit.soldOut ? (
          <span className="absolute start-4 top-4 rounded-full bg-gold/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] text-white">
            {t.unit.citizenshipEligible}
          </span>
        ) : null}
        {unit.soldOut ? (
          <span className="absolute end-4 top-4 rounded-full bg-forest-deep/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-cream">
            {t.unit.soldOut}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 pt-4">
        <MapPin className="w-3 shrink-0 text-gold" />
        <p className="text-[12.5px] text-ink">
          {placeLabel(t, unit.location)},{" "}
          <span className="text-ink/70">{placeLabel(t, unit.country)}</span>
        </p>
      </div>

      <div className="mt-3 flex items-start justify-between gap-6">
        <h3 className="max-w-[290px] font-display text-[22px] leading-[30px] text-ink">
          {project ? (
            <Link
              href={`/properties/${project.slug}`}
              className="transition-colors hover:text-gold"
            >
              <bdi>{title}</bdi>
            </Link>
          ) : (
            <bdi>{title}</bdi>
          )}
        </h3>
        <div className="shrink-0 text-end">
          <p className="text-[11px] text-ink/60">{t.common.startingFrom}</p>
          <p className="num mt-1 whitespace-nowrap text-[17px] text-gold">
            <span className="text-ink/70">{currency}</span> {num(price)}
          </p>
        </div>
      </div>

      <dl className="mb-6 mt-5 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">
        {specs.map(({ Icon, value }) => (
          <div key={value} className="flex items-start gap-2">
            <Icon className="mt-0.5 w-4 shrink-0 text-gold" />
            <dd className="text-[11.5px] leading-[16px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/contact-us"
        className="mt-auto inline-block self-start rounded-full bg-forest px-8 py-3 text-[13px] text-cream transition-colors hover:bg-forest-deep"
      >
        {t.common.enquireNow}
      </Link>
    </article>
  );
}
