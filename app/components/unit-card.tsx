"use client";

import Image from "next/image";
import type { Currency, Unit } from "@/app/lib/properties";
import { getProjectByName } from "@/app/lib/projects";
import { useI18n } from "@/app/lib/i18n/context";
import { interpolate } from "@/app/lib/i18n/format";
import { placeLabel, unitSpecs, unitTitle } from "@/app/lib/i18n/units";
import { BrochureButton } from "./brochure-button";
import { useEnquiry } from "./enquiry";
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
  const openEnquiry = useEnquiry();
  const price = unit.prices[currency];
  const project = getProjectByName(unit.project);
  const title = unitTitle(locale, t, unit);
  // A listing from the dashboard has a page of its own; a unit that ships with
  // the site is shown on its development's page instead.
  const href = unit.hasPage
    ? `/properties/${unit.slug}`
    : project
      ? `/properties/${project.slug}`
      : null;
  // Likewise the brochure: the listing's own, or the development's.
  const brochure = unit.brochure
    ? { slug: unit.slug, name: unit.project, file: unit.brochure }
    : project?.brochure
      ? { slug: project.slug, name: project.name, file: project.brochure }
      : null;
  const place = placeLabel(t, unit.location);
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
          {href ? (
            <Link
              href={href}
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

      {/* Still a link to /contact-us underneath: that is where a middle-click,
          a crawler and a reader without JavaScript all need it to go. The
          click is intercepted only once the dialog is there to intercept it
          with, which keeps the reader on the grid they were browsing. */}
      <div className="mt-auto flex flex-wrap items-center gap-3">
        <Link
          href="/contact-us"
          onClick={
            openEnquiry
              ? (event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  openEnquiry({
                    eyebrow: `${title} · ${place}`,
                    subject: interpolate(t.unit.enquirySubject, {
                      unit: title,
                      place,
                    }),
                    enquiryType:
                      unit.country === "Caribbean"
                        ? "caribbeanCbi"
                        : "turkiyeProperty",
                  });
                }
              : undefined
          }
          className="inline-block rounded-full bg-forest px-7 py-3 text-[13px] text-cream transition-colors hover:bg-forest-deep"
        >
          {t.common.enquireNow}
        </Link>

        {/* Only where there is a brochure to send. */}
        {brochure ? (
          <BrochureButton
            slug={brochure.slug}
            project={brochure.name}
            brochure={brochure.file}
            eyebrow={`${title} · ${place}`}
            className="inline-flex items-center gap-2 rounded-full border border-forest/30 px-6 py-3 text-[13px] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-cream"
          />
        ) : null}
      </div>
    </article>
  );
}
