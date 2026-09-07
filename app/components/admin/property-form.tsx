"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProperty } from "@/app/lib/admin/property-actions";
import { slugify } from "@/app/lib/admin/slug";
import {
  CBI_THRESHOLD_USD,
  bedroomOptions,
  propertyTypes,
} from "@/app/lib/properties";
import { Alert, Button, Field, Input, Select, Textarea } from "./ui";
import { UploadField, UploadList } from "./upload-field";

export type PropertyDraft = {
  id?: string;
  slug: string;
  title: string;
  project: string;
  location: string;
  country: string;
  priceUSD: string;
  priceEUR: string;
  priceTRY: string;
  type: string;
  bathrooms: string;
  bedroom: string;
  size: string;
  level: string;
  view: string;
  soldOut: boolean;
  cbiEligible: boolean;
  image: string;
  gallery: string[];
  description: string;
  /** One per line, written as "Title | The sentence under it". */
  highlights: string;
  amenities: string[];
  brochure: string;
  floorPlans: string[];
  paymentPlan: string;
  handover: string;
  serviceCharge: string;
  titleDeed: string;
  videoUrl: string;
  mapLat: string;
  mapLng: string;
  seoTitle: string;
  seoDescription: string;
  noindex: boolean;
  status: "DRAFT" | "PUBLISHED";
};

export const emptyProperty: PropertyDraft = {
  slug: "",
  title: "",
  project: "",
  location: "",
  country: "Türkiye",
  priceUSD: "",
  priceEUR: "",
  priceTRY: "",
  type: "Apartment",
  bathrooms: "",
  bedroom: "",
  size: "",
  level: "",
  view: "",
  soldOut: false,
  cbiEligible: false,
  image: "",
  gallery: [],
  description: "",
  highlights: "",
  amenities: [],
  brochure: "",
  floorPlans: [],
  paymentPlan: "",
  handover: "",
  serviceCharge: "",
  titleDeed: "",
  videoUrl: "",
  mapLat: "",
  mapLng: "",
  seoTitle: "",
  seoDescription: "",
  noindex: false,
  status: "DRAFT",
};

function SectionTitle({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <h2 className="text-[13px] font-medium text-ink">{title}</h2>
      <p className="mt-1 text-[12px] leading-[18px] text-ink/55">{note}</p>
    </div>
  );
}

export function PropertyForm({
  property,
  locations,
}: {
  property: PropertyDraft;
  locations: string[];
}) {
  const [state, action, pending] = useActionState(saveProperty, {});
  const errors = state.fieldErrors ?? {};

  const [slug, setSlug] = useState(property.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(property.slug));
  const [usd, setUsd] = useState(property.priceUSD);

  // Shown, not enforced — the server derives the same thing from the price it
  // is actually given, so a stale number on screen cannot mislabel a unit.
  const overThreshold = Number(usd.replace(/[,\s]/g, "")) >= CBI_THRESHOLD_USD;

  return (
    <form action={action} className="grid max-w-[860px] gap-6">
      {property.id ? <input type="hidden" name="id" value={property.id} /> : null}

      {state.error ? <Alert>{state.error}</Alert> : null}

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Listing title" name="title" error={errors.title} required>
            <Input
              id="title"
              name="title"
              defaultValue={property.title}
              error={errors.title}
              placeholder="Marmara Vista 2 Bedroom"
              onChange={(event) => {
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              required
            />
          </Field>

          <Field
            label="Development"
            name="project"
            error={errors.project}
            hint="The building or scheme this unit belongs to."
            required
          >
            <Input
              id="project"
              name="project"
              defaultValue={property.project}
              error={errors.project}
              placeholder="Marmara Vista"
              required
            />
          </Field>
        </div>

        <Field
          label="URL slug"
          name="slug"
          error={errors.slug}
          hint={<>Identifies the unit in search results and filters: <code>{slug || "…"}</code></>}
          required
        >
          <Input
            id="slug"
            name="slug"
            value={slug}
            error={errors.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="City or district"
            name="location"
            error={errors.location}
            hint="Shown on the card. Existing places are translated; a new one appears in English everywhere until a translation is added."
            required
          >
            <Input
              id="location"
              name="location"
              defaultValue={property.location}
              error={errors.location}
              list="known-locations"
              placeholder="Beylikdüzü"
              required
            />
          </Field>

          <Field label="Country or region" name="country" error={errors.country} required>
            <Input
              id="country"
              name="country"
              defaultValue={property.country}
              error={errors.country}
              list="known-locations"
              required
            />
          </Field>
        </div>

        <datalist id="known-locations">
          {locations.map((place) => (
            <option key={place} value={place} />
          ))}
        </datalist>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Price (USD)"
            name="priceUSD"
            error={errors.priceUSD}
            required
          >
            <Input
              id="priceUSD"
              name="priceUSD"
              inputMode="numeric"
              value={usd}
              error={errors.priceUSD}
              onChange={(event) => setUsd(event.target.value)}
              placeholder="450000"
              required
            />
          </Field>
          <Field label="Price (EUR)" name="priceEUR" error={errors.priceEUR} required>
            <Input
              id="priceEUR"
              name="priceEUR"
              inputMode="numeric"
              defaultValue={property.priceEUR}
              error={errors.priceEUR}
              placeholder="414000"
              required
            />
          </Field>
          <Field label="Price (TRY)" name="priceTRY" error={errors.priceTRY} required>
            <Input
              id="priceTRY"
              name="priceTRY"
              inputMode="numeric"
              defaultValue={property.priceTRY}
              error={errors.priceTRY}
              placeholder="18400000"
              required
            />
          </Field>
        </div>
        <p className="text-[12px] leading-[18px] text-ink/55">
          All three are shown — the search page lets a buyer pick a currency, it
          does not convert. Whole numbers, no symbols.
        </p>

        <label className="flex items-start gap-2.5 text-[13px] text-ink/80">
          <input
            type="checkbox"
            name="cbiEligible"
            defaultChecked={property.cbiEligible}
            className="mt-0.5 size-4 accent-[#12402a]"
          />
          <span>
            Qualifies for citizenship by investment
            <span className="mt-0.5 block text-[12px] text-ink/55">
              {overThreshold
                ? `Ticked automatically — the USD price is at or above the Türkiye threshold of $${CBI_THRESHOLD_USD.toLocaleString("en-US")}.`
                : `Below the Türkiye threshold of $${CBI_THRESHOLD_USD.toLocaleString("en-US")}. Tick this only for a unit that qualifies under another programme.`}
            </span>
          </span>
        </label>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type" name="type" error={errors.type} required>
            <Select
              id="type"
              name="type"
              defaultValue={property.type}
              error={errors.type}
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Bedrooms"
            name="bedroom"
            error={errors.bedroom}
            hint={`Written out. The filter matches on the leading number, so "2 Bedroom" answers the ${bedroomOptions.filter((b) => b !== "Studio").join("/")} filters.`}
            required
          >
            <Input
              id="bedroom"
              name="bedroom"
              defaultValue={property.bedroom}
              error={errors.bedroom}
              placeholder="2 Bedroom"
              required
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bathrooms" name="bathrooms" error={errors.bathrooms} required>
            <Input
              id="bathrooms"
              name="bathrooms"
              defaultValue={property.bathrooms}
              error={errors.bathrooms}
              placeholder="2 Bathroom"
              required
            />
          </Field>
          <Field label="Size" name="size" error={errors.size} required>
            <Input
              id="size"
              name="size"
              defaultValue={property.size}
              error={errors.size}
              placeholder="1,297.59 sq. ft."
              required
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Level" name="level" error={errors.level} required>
            <Input
              id="level"
              name="level"
              defaultValue={property.level}
              error={errors.level}
              placeholder="Level 1-3"
              required
            />
          </Field>
          <Field label="View" name="view" error={errors.view} required>
            <Input
              id="view"
              name="view"
              defaultValue={property.view}
              error={errors.view}
              placeholder="Sea View & Island View"
              required
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <SectionTitle
          title="Photography"
          note="Upload a file and it goes to Cloudinary; the box underneath holds the URL either way, so a path under /public still works."
        />

        <UploadField
          name="image"
          label="Card image"
          error={errors.image}
          accept="image/*"
          resourceType="image"
          defaultValue={property.image}
          placeholder="/images/units/…"
          hint="Shown on the search page and as the hero of the listing's own page. Roughly 3:2."
          required
        />

        <UploadList
          name="gallery"
          label="Gallery"
          error={errors.gallery}
          accept="image/*"
          resourceType="image"
          defaultValue={property.gallery}
          hint="Shown on the listing's page, in this order. The first is given the wide slot."
        />

        <UploadList
          name="floorPlans"
          label="Floor plans"
          error={errors.floorPlans}
          accept="image/*"
          resourceType="image"
          defaultValue={property.floorPlans}
          hint="Shown uncropped on white, so a plan is never cut off."
          rows={3}
        />

        <UploadField
          name="brochure"
          label="Brochure (PDF)"
          error={errors.brochure}
          accept="application/pdf"
          resourceType="raw"
          defaultValue={property.brochure}
          placeholder="/brochures/….pdf"
          preview={false}
          hint={
            <>
              Emailed to anyone who asks for it. Without one, the “Download
              Brochure” button is not shown on this unit at all.
            </>
          }
        />

        <label className="flex items-center gap-2.5 text-[13px] text-ink/80">
          <input
            type="checkbox"
            name="soldOut"
            defaultChecked={property.soldOut}
            className="size-4 accent-[#12402a]"
          />
          Sold out — keeps the listing on the site, marked unavailable
        </label>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <SectionTitle
          title="The listing's page"
          note="Everything here is optional. Each section is left off the page rather than shown empty, so a listing with nothing but specs still reads as finished."
        />

        <Field
          label="Description"
          name="description"
          error={errors.description}
          hint="One paragraph per blank line."
        >
          <Textarea
            id="description"
            name="description"
            defaultValue={property.description}
            error={errors.description}
            rows={6}
          />
        </Field>

        <Field
          label="Highlights"
          name="highlights"
          error={errors.highlights}
          hint='One per line, written as "Title | The sentence under it". Three is the usual number.'
        >
          <Textarea
            id="highlights"
            name="highlights"
            defaultValue={property.highlights}
            error={errors.highlights}
            rows={4}
            placeholder="Sea Views | Every room on this floor faces the Marmara."
          />
        </Field>

        <Field
          label="Amenities"
          name="amenities"
          error={errors.amenities}
          hint="One per line. Names the site already knows — Indoor Pool, Concierge — are translated automatically; anything else is shown as written."
        >
          <Textarea
            id="amenities"
            name="amenities"
            defaultValue={property.amenities.join("\n")}
            error={errors.amenities}
            rows={4}
          />
        </Field>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <SectionTitle
          title="Terms"
          note="What a buyer asks before they enquire. Shown as written, in the language they are written in — so write them in English."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Payment plan" name="paymentPlan" error={errors.paymentPlan}>
            <Input
              id="paymentPlan"
              name="paymentPlan"
              defaultValue={property.paymentPlan}
              error={errors.paymentPlan}
              placeholder="30% on signing, 70% over 24 months"
            />
          </Field>
          <Field label="Handover" name="handover" error={errors.handover}>
            <Input
              id="handover"
              name="handover"
              defaultValue={property.handover}
              error={errors.handover}
              placeholder="Q4 2027, or Ready to move in"
            />
          </Field>
          <Field label="Service charge" name="serviceCharge" error={errors.serviceCharge}>
            <Input
              id="serviceCharge"
              name="serviceCharge"
              defaultValue={property.serviceCharge}
              error={errors.serviceCharge}
              placeholder="USD 1,800 a year"
            />
          </Field>
          <Field label="Title deed" name="titleDeed" error={errors.titleDeed}>
            <Input
              id="titleDeed"
              name="titleDeed"
              defaultValue={property.titleDeed}
              error={errors.titleDeed}
              placeholder="Ready title deed (tapu)"
            />
          </Field>
        </div>

        <Field
          label="Video tour"
          name="videoUrl"
          error={errors.videoUrl}
          hint="Shown as a link. Nothing is embedded, so the player sets no cookies on a reader who never presses play."
        >
          <Input
            id="videoUrl"
            name="videoUrl"
            type="url"
            defaultValue={property.videoUrl}
            error={errors.videoUrl}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </Field>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <SectionTitle
          title="Map"
          note="Both or neither. In Google Maps, right-click the spot and the first item on the menu is the pair, in this order."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude" name="mapLat" error={errors.mapLat}>
            <Input
              id="mapLat"
              name="mapLat"
              defaultValue={property.mapLat}
              error={errors.mapLat}
              placeholder="40.9823"
            />
          </Field>
          <Field label="Longitude" name="mapLng" error={errors.mapLng}>
            <Input
              id="mapLng"
              name="mapLng"
              defaultValue={property.mapLng}
              error={errors.mapLng}
              placeholder="28.6412"
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <SectionTitle
          title="Search engines"
          note="Left empty, the page uses the listing's own title and description."
        />

        <Field label="SEO title" name="seoTitle" error={errors.seoTitle}>
          <Input
            id="seoTitle"
            name="seoTitle"
            defaultValue={property.seoTitle}
            error={errors.seoTitle}
          />
        </Field>

        <Field
          label="Meta description"
          name="seoDescription"
          error={errors.seoDescription}
          hint="Around 155 characters is what a result listing shows."
        >
          <Textarea
            id="seoDescription"
            name="seoDescription"
            defaultValue={property.seoDescription}
            error={errors.seoDescription}
            rows={3}
          />
        </Field>

        <label className="flex items-start gap-2.5 text-[13px] text-ink/80">
          <input
            type="checkbox"
            name="noindex"
            defaultChecked={property.noindex}
            className="mt-0.5 size-4 accent-[#12402a]"
          />
          <span>
            Keep out of search results
            <span className="mt-0.5 block text-[12px] text-ink/55">
              The page still works and can still be linked from a campaign — it
              simply is not indexed.
            </span>
          </span>
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" name="intent" value="publish" disabled={pending}>
          {property.status === "PUBLISHED" ? "Save and keep live" : "Publish"}
        </Button>
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="secondary"
          disabled={pending}
        >
          {property.status === "PUBLISHED"
            ? "Save and take offline"
            : "Save as draft"}
        </Button>
        <Link
          href="/admin/properties"
          className="text-[13px] text-ink/60 underline underline-offset-2 hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
