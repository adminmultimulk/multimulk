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
  status: "DRAFT",
};

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
        <Field
          label="Card image"
          name="image"
          error={errors.image}
          hint="A path under /public, e.g. /images/units/marmara-vista.webp."
          required
        >
          <Input
            id="image"
            name="image"
            defaultValue={property.image}
            error={errors.image}
            placeholder="/images/units/…"
            required
          />
        </Field>

        <Field
          label="Further photography"
          name="gallery"
          error={errors.gallery}
          hint="One path per line, in the order they should appear."
        >
          <Textarea
            id="gallery"
            name="gallery"
            defaultValue={property.gallery.join("\n")}
            error={errors.gallery}
            rows={4}
            className="font-mono text-[13px]"
          />
        </Field>

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
