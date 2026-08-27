import Image from "next/image";
import Link from "next/link";
import type { Currency, Unit } from "@/app/lib/properties";
import { projects } from "@/app/lib/projects";
import { Area, Bath, Bed, Building, MapPin, Stairs, ViewIcon } from "./icons";

export function UnitCard({
  unit,
  currency,
}: {
  unit: Unit;
  currency: Currency;
}) {
  const price = unit.prices[currency];
  const project = projects.find((p) => p.name === unit.project);
  const specs = [
    { Icon: Building, value: unit.type },
    { Icon: Bath, value: unit.bathrooms },
    { Icon: Bed, value: unit.bedroom },
    { Icon: Area, value: unit.size },
    { Icon: Stairs, value: unit.level },
    { Icon: ViewIcon, value: unit.view },
  ].filter((s) => s.value);

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[448/300] w-full overflow-hidden bg-mist">
        <Image
          src={unit.image}
          alt={unit.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 440px"
          className="object-cover"
        />
        {unit.cbiEligible && !unit.soldOut ? (
          <span className="absolute left-4 top-4 rounded-full bg-gold/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] text-white">
            Citizenship Eligible
          </span>
        ) : null}
        {unit.soldOut ? (
          <span className="absolute right-4 top-4 rounded-full bg-forest-deep/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-cream">
            Sold Out
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 pt-4">
        <MapPin className="w-3 shrink-0 text-gold" />
        <p className="text-[12.5px] text-ink">
          {unit.location}, <span className="text-ink/70">{unit.country}</span>
        </p>
      </div>

      <div className="mt-3 flex items-start justify-between gap-6">
        <h3 className="max-w-[290px] font-display text-[22px] leading-[30px] text-ink">
          {project ? (
            <Link
              href={`/properties/${project.slug}`}
              className="transition-colors hover:text-gold"
            >
              {unit.title}
            </Link>
          ) : (
            unit.title
          )}
        </h3>
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-ink/60">Starting From</p>
          <p className="mt-1 whitespace-nowrap text-[17px] text-gold">
            <span className="text-ink/70">{currency}</span>{" "}
            {price.toLocaleString("en-US")}
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

      <a
        href="#"
        className="mt-auto inline-block self-start rounded-full bg-forest px-8 py-3 text-[13px] text-cream transition-colors hover:bg-forest-deep"
      >
        Enquire Now
      </a>
    </article>
  );
}
