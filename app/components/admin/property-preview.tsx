"use client";

/**
 * The listing, as a buyer will see it, beside the form that is writing it.
 *
 * A lister fills in twenty-odd boxes and finds out what they made after
 * publishing — which is the wrong moment to discover that the card image is
 * portrait, that the description reads as one wall of text, or that the title
 * repeats the development's name twice. This renders the same fields the
 * public page renders, from the same values, as they are typed.
 *
 * It is a mock-up, not the page itself. `ListingPage` and `UnitCard` are async
 * Server Components that read a dictionary and the merged inventory, and
 * neither can run in a form. So the shapes, the type, the colours and the
 * order are mirrored here, and the two things that would silently drift are
 * imported rather than re-implemented: the prose renderer, so emphasis and
 * lists look exactly as they will, and the image component, so a photograph
 * from an odd host previews the way it will publish.
 *
 * Everything reads in English. The dashboard is in English, the fields are
 * written in English, and the site translates place names, layouts and
 * amenities on the way out — so a lister is being shown the shape of their
 * page, not a promise about how it will read in Arabic.
 */

import { useState } from "react";
import clsx from "clsx";
import { money } from "@/app/lib/admin/money";
import { CBI_THRESHOLD_USD } from "@/app/lib/properties";
import { toBlocks } from "@/app/lib/rich-text";
import { AmenityIcon } from "../amenity-icon";
import { ArticleBody, RichLine } from "../article-body";
import {
  Area,
  Bath,
  Bed,
  Building,
  MapPin,
  Stairs,
  ViewIcon,
} from "../icons";
import { ListingImage } from "../listing-image";
import type { PropertyDraft } from "./property-form";

const SPEC_ICONS = [Building, Bath, Bed, Area, Stairs, ViewIcon];

/**
 * A price as the page will print it — or nothing, where the Server Action
 * would reject what is in the box. The parser is the action's own, so the
 * preview cannot show a price that will not save, or read "450.000" as four
 * hundred and fifty while the server reads it as four hundred and fifty
 * thousand.
 */
function price(value: string): string | null {
  const parsed = money(value);
  return parsed === null ? null : new Intl.NumberFormat("en-US").format(parsed);
}

/** The highlight lines, split the way the Server Action splits them. */
function highlightsOf(value: string): { title: string; text: string }[] {
  return value
    .split("\n")
    .map((line) => {
      const at = line.indexOf("|");
      if (at === -1) return null;
      const title = line.slice(0, at).trim();
      const text = line.slice(at + 1).trim();
      return title && text ? { title, text } : null;
    })
    .filter((pair): pair is { title: string; text: string } => pair !== null);
}

/** A photograph, or the space one will take. */
function Shot({
  src,
  alt,
  className,
  label,
}: {
  src: string;
  alt: string;
  className: string;
  label?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden bg-mist", className)}>
      {src ? (
        <ListingImage src={src} alt={alt} sizes="360px" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center border border-dashed border-ink/20 text-[11px] text-ink/40">
          {label ?? "No image yet"}
        </span>
      )}
    </div>
  );
}

function Empty({ children }: { children: string }) {
  return <p className="text-[12px] text-ink/40 italic">{children}</p>;
}

export function PropertyPreview({ property }: { property: PropertyDraft }) {
  const [tab, setTab] = useState<"page" | "card">("page");

  const title = property.title.trim();
  const place = [property.location.trim(), property.country.trim()]
    .filter(Boolean)
    .join(" · ");
  const usd = price(property.priceUSD);

  // Shown the way the server derives it: above the threshold the tick is
  // implied, so the preview cannot promise a badge the page will not carry.
  const cbi =
    property.cbiEligible ||
    (money(property.priceUSD) ?? 0) >= CBI_THRESHOLD_USD;

  const specs = [
    property.type,
    property.bathrooms,
    property.bedroom,
    property.size,
    property.level,
    property.view,
  ]
    .map((value, index) => ({ Icon: SPEC_ICONS[index], value: value.trim() }))
    .filter((spec) => spec.value);

  const highlights = highlightsOf(property.highlights);
  const blocks = toBlocks(property.description);

  const terms: { label: string; value: React.ReactNode }[] = [
    { label: "Payment plan", value: property.paymentPlan },
    { label: "Handover", value: property.handover },
    { label: "Service charge", value: property.serviceCharge },
    { label: "Title deed", value: property.titleDeed },
  ]
    .filter((term) => term.value.trim())
    .map((term) => ({
      label: term.label,
      value: <RichLine text={term.value.trim()} />,
    }));

  if (property.gyo)
    terms.push({
      label: "REIT (GYO)",
      value: property.gyo === "yes" ? "Yes" : "No",
    });
  if (property.vatRate) terms.push({ label: "VAT", value: `${property.vatRate}%` });
  if (property.titleDeedTaxRate)
    terms.push({
      label: "Title deed tax",
      value: `${property.titleDeedTaxRate}%`,
    });

  const started = Boolean(
    title || property.image || property.project.trim() || usd,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-ink/10 bg-ink/[0.02] px-3 py-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50">
          Preview
        </span>
        <div className="ms-auto flex rounded-[5px] bg-ink/6 p-0.5">
          {(
            [
              ["page", "Its page"],
              ["card", "Search card"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className={clsx(
                "rounded-[3px] px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                tab === key
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink/55 hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!started ? (
        <p className="px-4 py-12 text-center text-[13px] leading-[20px] text-ink/45">
          Fill in the form and the listing builds itself here, as a buyer will
          see it.
        </p>
      ) : tab === "card" ? (
        <CardPreview
          property={property}
          title={title}
          usd={usd}
          cbi={cbi}
          specs={specs}
        />
      ) : (
        <PagePreview
          property={property}
          title={title}
          place={place}
          usd={usd}
          cbi={cbi}
          specs={specs}
          highlights={highlights}
          blocks={blocks}
          terms={terms}
        />
      )}

      <p className="border-t border-ink/10 bg-ink/[0.02] px-3 py-2 text-[11.5px] leading-[17px] text-ink/50">
        A mock-up in English, at this width. The published page is wider, and
        translates places, layouts and amenities into each language.
      </p>
    </div>
  );
}

type Spec = { Icon: (props: { className?: string }) => React.ReactElement; value: string };

/** How the unit reads in a results grid — the first thing anybody sees. */
function CardPreview({
  property,
  title,
  usd,
  cbi,
  specs,
}: {
  property: PropertyDraft;
  title: string;
  usd: string | null;
  cbi: boolean;
  specs: Spec[];
}) {
  return (
    <div className="p-4">
      <div className="relative">
        <Shot
          src={property.image}
          alt={title}
          className="aspect-[448/300] w-full"
          label="Card image"
        />
        {cbi && !property.soldOut ? (
          <span className="absolute start-3 top-3 rounded-full bg-gold/95 px-2.5 py-1 text-[9px] uppercase tracking-[0.08em] text-white">
            Citizenship Eligible
          </span>
        ) : null}
        {property.soldOut ? (
          <span className="absolute end-3 top-3 rounded-full bg-forest-deep/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] text-cream">
            Sold Out
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5 pt-3">
        <MapPin className="w-3 shrink-0 text-gold" />
        <p className="text-[12px] text-ink">
          {property.location.trim() || "City"},{" "}
          <span className="text-ink/70">
            {property.country.trim() || "Country"}
          </span>
        </p>
      </div>

      <div className="mt-2 flex items-start justify-between gap-4">
        <h3 className="font-display text-[17px] leading-[23px] text-ink">
          {title || <span className="text-ink/35">Untitled listing</span>}
        </h3>
        <div className="shrink-0 text-end">
          <p className="text-[10px] text-ink/60">Starting From</p>
          <p className="num mt-0.5 whitespace-nowrap text-[14px] text-gold">
            <span className="text-ink/70">USD</span> {usd ?? "—"}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {specs.map(({ Icon, value }) => (
          <div key={value} className="flex items-start gap-2">
            <Icon className="mt-0.5 w-3.5 shrink-0 text-gold" />
            <dd className="text-[11px] leading-[15px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-forest px-4 py-2 text-[11.5px] text-cream">
          Enquire Now
        </span>
        {property.brochure ? (
          <span className="rounded-full border border-forest/30 px-4 py-2 text-[11.5px] text-forest">
            Download Brochure
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** The whole of /properties/&lt;slug&gt;, section by section. */
function PagePreview({
  property,
  title,
  place,
  usd,
  cbi,
  specs,
  highlights,
  blocks,
  terms,
}: {
  property: PropertyDraft;
  title: string;
  place: string;
  usd: string | null;
  cbi: boolean;
  specs: Spec[];
  highlights: { title: string; text: string }[];
  blocks: string[];
  terms: { label: string; value: React.ReactNode }[];
}) {
  const gallery = property.gallery.filter(Boolean);
  const floorPlans = property.floorPlans.filter(Boolean);
  const hasMap = Boolean(property.mapLat.trim() && property.mapLng.trim());

  return (
    <div>
      {/*
       * The hero, with the same two gradients the page lays over it — and
       * without them where there is no photograph yet, because a dark wash
       * over an empty box is unreadable rather than illustrative.
       */}
      <div className="relative">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-forest">
          {property.image ? (
            <>
              <ListingImage src={property.image} alt={title} sizes="360px" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
            </>
          ) : (
            <span className="absolute inset-x-4 top-4 flex h-16 items-center justify-center rounded border border-dashed border-cream/30 text-[11px] text-cream/60">
              The card image is the hero here
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {place ? (
              <span className="flex items-center gap-1.5 text-cream/85">
                <MapPin className="w-2.5" />
                <span className="text-[9.5px] uppercase tracking-[0.11em]">
                  {place}
                </span>
              </span>
            ) : null}
            {cbi && !property.soldOut ? (
              <span className="rounded-full bg-gold/95 px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-white">
                Citizenship Eligible
              </span>
            ) : null}
            {property.soldOut ? (
              <span className="rounded-full bg-forest-deep/85 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-cream">
                Sold Out
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 font-display text-[20px] leading-[1.14] text-white">
            {title || <span className="text-white/45">Untitled listing</span>}
          </h2>

          <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-cream/70">
            Starting From{" "}
            <span className="num text-[14px] normal-case tracking-normal text-gold-light">
              USD {usd ?? "—"}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-cream px-4 py-1.5 text-[11px] text-forest">
              Enquire Now
            </span>
            {property.brochure ? (
              <span className="rounded-full border border-cream/70 px-4 py-1.5 text-[11px] text-cream">
                Download Brochure
              </span>
            ) : null}
            {property.project.trim() ? (
              <span className="rounded-full border border-cream/70 px-4 py-1.5 text-[11px] text-cream">
                View the Development
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* At a Glance. The one section every listing has. */}
      <section className="bg-mist px-4 py-4">
        <h3 className="text-[9.5px] uppercase tracking-[0.12em] text-gold">
          At a Glance
        </h3>
        {specs.length ? (
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {specs.map(({ Icon, value }) => (
              <div key={value} className="flex items-start gap-2">
                <Icon className="mt-0.5 w-3.5 shrink-0 text-gold" />
                <dd className="text-[11.5px] leading-[16px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-2">
            <Empty>The specs go here — type, beds, baths, size, level, view.</Empty>
          </div>
        )}
      </section>

      {blocks.length || highlights.length ? (
        <section className="grid gap-5 bg-white px-4 py-5">
          {blocks.length ? (
            <div>
              <h3 className="font-display text-[17px] leading-[1.28] text-ink">
                About This Residence
              </h3>
              {/* The published renderer, so bold, a list and a link look here
                  exactly as they will there. */}
              <div className="mt-2">
                <ArticleBody body={blocks} />
              </div>
            </div>
          ) : null}

          {highlights.length ? (
            <ul className="grid gap-4">
              {highlights.map((highlight) => (
                <li key={highlight.title}>
                  <h4 className="font-display text-[15px] leading-[1.3] text-ink">
                    {highlight.title}
                  </h4>
                  <span className="mt-2 block h-px w-6 bg-gold" />
                  <p className="mt-2 text-[12px] leading-[19px] text-ink/80">
                    <RichLine text={highlight.text} />
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {gallery.length ? (
        <section className="bg-mist px-4 py-4">
          <h3 className="font-display text-[15px] text-ink">Gallery</h3>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {/* The first is given the wide slot on the page, as it is here. */}
            <Shot
              src={gallery[0]}
              alt="Gallery"
              className="col-span-3 aspect-[16/9] w-full"
            />
            {gallery.slice(1, 7).map((src, index) => (
              <Shot
                key={`${src}-${index}`}
                src={src}
                alt="Gallery"
                className="aspect-square w-full"
              />
            ))}
          </div>
          {gallery.length > 7 ? (
            <p className="mt-2 text-[11px] text-ink/50">
              +{gallery.length - 7} more in the gallery
            </p>
          ) : null}
        </section>
      ) : null}

      {floorPlans.length ? (
        <section className="bg-white px-4 py-4">
          <h3 className="font-display text-[15px] text-ink">Floor Plans</h3>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {floorPlans.slice(0, 4).map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-[4/3] w-full overflow-hidden border border-ink/10 bg-white"
              >
                {/* Uncropped on white, the way plans are shown. */}
                <ListingImage
                  src={src}
                  alt="Floor plan"
                  sizes="180px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {property.amenities.length ? (
        <section className="bg-mist px-4 py-4">
          <h3 className="font-display text-[15px] text-ink">Amenities</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {property.amenities.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 border-b border-ink/10 pb-1.5 text-[11.5px] text-ink"
              >
                <AmenityIcon name={item} className="w-3.5 shrink-0 text-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {terms.length || property.videoUrl.trim() ? (
        <section className="bg-white px-4 py-4">
          <h3 className="font-display text-[15px] text-ink">Terms</h3>
          {terms.length ? (
            <dl className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {terms.map((term) => (
                <div key={term.label}>
                  <dt className="text-[9.5px] uppercase tracking-[0.12em] text-gold">
                    {term.label}
                  </dt>
                  <dd className="mt-1 text-[12px] leading-[18px] text-ink">
                    {term.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {property.videoUrl.trim() ? (
            <span className="mt-3 inline-block rounded-full border border-ink/25 px-4 py-1.5 text-[11px] text-ink">
              Watch the Tour
            </span>
          ) : null}
        </section>
      ) : null}

      {hasMap ? (
        <section className="bg-mist px-4 py-4">
          <h3 className="font-display text-[15px] text-ink">Location</h3>
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-ink/60">
            <MapPin className="w-3 shrink-0 text-gold" />
            {/* The map itself is an embed the page mounts; the pin is what
                there is to check here. */}
            <span className="num">
              {property.mapLat.trim()}, {property.mapLng.trim()}
            </span>
          </p>
        </section>
      ) : null}

      <section className="bg-forest px-4 py-5 text-center">
        <p className="font-display text-[15px] leading-[1.25] text-cream">
          Ask us anything about this residence.
        </p>
        <span className="mt-3 inline-block rounded-full bg-cream px-4 py-1.5 text-[11px] text-forest">
          Enquire Now
        </span>
      </section>
    </div>
  );
}
