"use client";

import {
  memo,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import clsx from "clsx";
import { saveProperty } from "@/app/lib/admin/property-actions";
import { money } from "@/app/lib/admin/money";
import { slugify } from "@/app/lib/admin/slug";
import {
  amenityGroups,
  amenityNames,
  splitAmenities,
} from "@/app/lib/amenities";
import {
  CBI_THRESHOLD_USD,
  bedroomOptions,
  propertyTypes,
  titleDeedTaxRates,
  vatRates,
} from "@/app/lib/properties";
import { AmenityIcon } from "../amenity-icon";
import { useFormDraft } from "./form-draft";
import { PropertyPreview } from "./property-preview";
import { RichEditor } from "./rich-editor";
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
  /** "", "yes" or "no" — empty is "not stated", which is not the same as no. */
  gyo: string;
  /** A whole percentage as written in the select, or "" for not stated. */
  vatRate: string;
  titleDeedTaxRate: string;
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
  gyo: "",
  vatRate: "",
  titleDeedTaxRate: "",
  videoUrl: "",
  mapLat: "",
  mapLng: "",
  seoTitle: "",
  seoDescription: "",
  noindex: false,
  status: "DRAFT",
};

/**
 * The form as it stands, in the shape the server rendered it in.
 *
 * Read out of the live `FormData` rather than tracked in state, so a field
 * added to this form is kept in a draft without anything here being told about
 * it twice. `id` and `status` are taken from the listing rather than the form:
 * they say which row is being edited, not what somebody typed.
 */
function readDraft(form: FormData, base: PropertyDraft): PropertyDraft {
  const text = (name: string) => String(form.get(name) ?? "");
  const list = (name: string) =>
    text(name)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  return {
    id: base.id,
    status: base.status,
    slug: text("slug"),
    title: text("title"),
    project: text("project"),
    location: text("location"),
    country: text("country"),
    priceUSD: text("priceUSD"),
    priceEUR: text("priceEUR"),
    priceTRY: text("priceTRY"),
    type: text("type"),
    bathrooms: text("bathrooms"),
    bedroom: text("bedroom"),
    size: text("size"),
    level: text("level"),
    view: text("view"),
    soldOut: form.get("soldOut") !== null,
    cbiEligible: form.get("cbiEligible") !== null,
    image: text("image"),
    gallery: list("gallery"),
    description: text("description"),
    highlights: text("highlights"),
    amenities: list("amenities"),
    brochure: text("brochure"),
    floorPlans: list("floorPlans"),
    paymentPlan: text("paymentPlan"),
    handover: text("handover"),
    serviceCharge: text("serviceCharge"),
    titleDeed: text("titleDeed"),
    gyo: text("gyo"),
    vatRate: text("vatRate"),
    titleDeedTaxRate: text("titleDeedTaxRate"),
    videoUrl: text("videoUrl"),
    mapLat: text("mapLat"),
    mapLng: text("mapLng"),
    seoTitle: text("seoTitle"),
    seoDescription: text("seoDescription"),
    noindex: form.get("noindex") !== null,
  };
}

function SectionTitle({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <h2 className="text-[13px] font-medium text-ink">{title}</h2>
      <p className="mt-1 text-[12px] leading-[18px] text-ink/55">{note}</p>
    </div>
  );
}

/** "3 minutes ago", for the line that says what was brought back. */
function ago(at: number): string {
  const minutes = Math.round((Date.now() - at) / 60000);
  if (minutes < 1) return "a moment ago";
  if (minutes === 1) return "a minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  return hours === 1 ? "an hour ago" : `${hours} hours ago`;
}

/**
 * Amenities, picked rather than typed.
 *
 * This was a free-text box, and free text is how a listing ended up with
 * "indoor pool" where the rest of the site says "Indoor Pool" — a name the
 * dictionaries cannot translate and the icon map cannot illustrate. The
 * vocabulary in `app/lib/amenities.ts` is offered as checkboxes so the common
 * cases are spelled once, in the one place that spells them.
 *
 * The box underneath stays, because no vocabulary is finished: an amenity
 * typed there is saved as written and shown as written. Both halves are joined
 * back into the single newline-separated `amenities` field the Server Action
 * already parses, so nothing behind this component had to change.
 */
function AmenityPicker({
  value,
  error,
}: {
  value: string[];
  error?: string;
}) {
  const initial = splitAmenities(value);
  const [selected, setSelected] = useState<string[]>(initial.selected);
  const [custom, setCustom] = useState(initial.custom.join("\n"));

  function toggle(name: string) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  // Vocabulary order rather than click order, so the page reads the same way
  // whichever order a lister ticked the boxes in.
  const amenities = [
    ...amenityNames.filter((name) => selected.includes(name)),
    ...custom
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  ];

  return (
    <fieldset className="grid gap-3">
      <legend className="text-[13px] font-medium text-ink">Amenities</legend>
      <input type="hidden" name="amenities" value={amenities.join("\n")} />

      {amenityGroups.map((group) => (
        <div key={group.label} className="grid gap-2">
          <p className="text-[11px] uppercase tracking-[0.08em] text-ink/45">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((name) => {
              const on = selected.includes(name);
              return (
                <label
                  key={name}
                  className={clsx(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-[13px] transition-colors",
                    "focus-within:ring-2 focus-within:ring-forest/15",
                    on
                      ? "border-forest bg-forest/5 text-ink"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink/30",
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => toggle(name)}
                  />
                  <AmenityIcon
                    name={name}
                    className={clsx("w-4 shrink-0", on ? "text-forest" : "text-ink/40")}
                  />
                  {name}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="grid gap-1.5">
        <label
          htmlFor="amenities-other"
          className="text-[13px] font-medium text-ink"
        >
          Anything else
        </label>
        <Textarea
          id="amenities-other"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "amenities-error" : undefined}
          rows={3}
          placeholder="Helipad"
        />
        {error ? (
          <p id="amenities-error" className="text-[12px] text-red-700">
            {error}
          </p>
        ) : (
          <p className="text-[12px] leading-[18px] text-ink/55">
            One per line. The ticked names above are translated into every
            language and carry an icon; anything typed here is shown as written,
            in English.
          </p>
        )}
      </div>
    </fieldset>
  );
}

/** The hint under every box that takes emphasis, written once. */
const FORMATTING_HINT = "**bold**, *italic*, [a link](https://…).";

/**
 * What each field is called, for the summary a rejected save opens with.
 *
 * The Server Action answers with field names; a lister looking for what went
 * wrong is looking for the words above the boxes. Keyed by the `name` the form
 * submits, which is also the `id` on the control, so each entry in the summary
 * is a link straight to the box it is about.
 */
const FIELD_LABELS: Record<string, string> = {
  title: "Listing title",
  project: "Development",
  slug: "URL slug",
  location: "City or district",
  country: "Country or region",
  priceUSD: "Price (USD)",
  priceEUR: "Price (EUR)",
  priceTRY: "Price (TRY)",
  type: "Type",
  bedroom: "Bedrooms",
  bathrooms: "Bathrooms",
  size: "Size",
  level: "Level",
  view: "View",
  image: "Card image",
  gallery: "Gallery",
  floorPlans: "Floor plans",
  brochure: "Brochure (PDF)",
  description: "Description",
  highlights: "Highlights",
  amenities: "Amenities",
  paymentPlan: "Payment plan",
  handover: "Handover",
  serviceCharge: "Service charge",
  titleDeed: "Title deed",
  gyo: "REIT (GYO)",
  vatRate: "VAT",
  titleDeedTaxRate: "Title deed tax",
  videoUrl: "Video tour",
  mapLat: "Latitude",
  mapLng: "Longitude",
  seoTitle: "SEO title",
  seoDescription: "Meta description",
};

/** The box a field name belongs to, where the two differ. */
const FIELD_IDS: Record<string, string> = { amenities: "amenities-other" };

export function PropertyForm({
  property,
  locations,
}: {
  property: PropertyDraft;
  locations: string[];
}) {
  const [state, action, pending] = useActionState(saveProperty, {});
  // Stable across the re-renders the preview causes, so the fields beside it
  // are not re-rendered for every keystroke that only the preview cares about.
  const errors = useMemo(() => state.fieldErrors ?? {}, [state]);

  const {
    formRef,
    values,
    live,
    version,
    restoredAt,
    touch,
    onSubmit,
    rejected,
    discard,
  } = useFormDraft({
    key: `multimulk:property:${property.id ?? "new"}`,
    initial: property,
    fromForm: useCallback(
      (form: FormData) => readDraft(form, property),
      [property],
    ),
  });

  const failed = Object.keys(errors);
  const alert = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.error && !state.fieldErrors) return;

    // Puts back everything React's post-action form reset just wiped, and
    // takes the draft again.
    rejected();

    /*
     * And it is announced where the person is looking, not where the markup
     * happens to put it. Publish is at the bottom of a form two screens long;
     * without this, a rejected save looks exactly like a button that does
     * nothing, and the reason for it sits unread above the fold.
     */
    alert.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    alert.current?.focus({ preventScroll: true });
  }, [state, rejected]);

  return (
    /*
     * Two columns where there is room for two. The preview is a companion to
     * the form and not a step after it, so it sits alongside and sticks to the
     * top of the screen while the form is scrolled; below `xl` it falls under
     * the form, where it is still the answer to "what did I just make?".
     */
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      <form
        ref={formRef}
        action={action}
        onChange={touch}
        onInput={touch}
        onSubmit={onSubmit}
        className="grid max-w-[860px] gap-6"
      >
        {property.id ? <input type="hidden" name="id" value={property.id} /> : null}

        {state.error ? (
          <Alert ref={alert}>
            {state.error}
            {failed.length ? (
              <ul className="mt-1.5 grid gap-1">
                {failed.map((name) => (
                  <li key={name}>
                    <a
                      href={`#${FIELD_IDS[name] ?? name}`}
                      onClick={(event) => {
                        event.preventDefault();
                        const box = document.getElementById(
                          FIELD_IDS[name] ?? name,
                        );
                        box?.scrollIntoView({ block: "center" });
                        box?.focus();
                      }}
                      className="font-medium underline underline-offset-2"
                    >
                      {FIELD_LABELS[name] ?? name}
                    </a>{" "}
                    — {errors[name]}
                  </li>
                ))}
              </ul>
            ) : null}
          </Alert>
        ) : null}

        {restoredAt !== null ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
            <span>
              Unsaved changes from {ago(restoredAt)} were brought back —
              nothing here is saved until you publish or save a draft.
            </span>
            <button
              type="button"
              onClick={discard}
              className="underline underline-offset-2 hover:no-underline"
            >
              Discard them
            </button>
          </p>
        ) : null}

        {/* Remounted when a draft is restored, so every box below picks up its
            restored value the same way it picks up the server's. */}
        <PropertyFields
          key={version}
          property={values}
          locations={locations}
          errors={errors}
          onUpload={touch}
        />

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

      {/* Outside the form on purpose: nothing in here is a field, and a
          preview that could be submitted with the listing is a bug waiting. */}
      <aside className="max-w-[520px] xl:sticky xl:top-9 xl:max-h-[calc(100svh-4.5rem)] xl:overflow-y-auto">
        <PropertyPreview property={live} />
      </aside>
    </div>
  );
}

/**
 * Memoised: the preview re-renders as fast as somebody types, and the fields
 * beside it hold carets, upload progress and a rich-text editor that have no
 * reason to be rebuilt for it.
 */
const PropertyFields = memo(function PropertyFields({
  property,
  locations,
  errors,
  onUpload,
}: {
  property: PropertyDraft;
  locations: string[];
  errors: Record<string, string>;
  /** A photograph arriving is a change to the listing like any other. */
  onUpload: () => void;
}) {
  const [slug, setSlug] = useState(property.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(property.slug));
  const [usd, setUsd] = useState(property.priceUSD);

  // Shown, not enforced — the server derives the same thing from the price it
  // is actually given, so a stale number on screen cannot mislabel a unit. Read
  // with the action's own parser, so "450.000" counts here exactly as it counts
  // there.
  const overThreshold = (money(usd) ?? 0) >= CBI_THRESHOLD_USD;

  return (
    <>
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
          does not convert. Whole numbers, written however you write them:
          450000, 450,000 and 450.000 are all read as the same price.
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
          onValueChange={onUpload}
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
          onValueChange={onUpload}
          hint="Shown on the listing's page, in this order. The first is given the wide slot."
        />

        <UploadList
          name="floorPlans"
          label="Floor plans"
          error={errors.floorPlans}
          accept="image/*"
          resourceType="image"
          defaultValue={property.floorPlans}
          onValueChange={onUpload}
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
          onValueChange={onUpload}
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

        <div className="grid gap-1.5">
          <label htmlFor="description" className="text-[13px] font-medium text-ink">
            Description
          </label>
          {/* The same editor and the same grammar the articles use, so a
              lister who can write a blog post can write a listing. */}
          <RichEditor
            name="description"
            defaultValue={property.description}
            error={errors.description}
            variant="prose"
            placeholder={
              "Describe the residence.\n\nA blank line starts a new paragraph. Use the toolbar, or type **bold**, *italic* and - for a bullet."
            }
          />
          {errors.description ? (
            <p id="description-error" className="text-[12px] text-red-700">
              {errors.description}
            </p>
          ) : (
            <p className="text-[12px] leading-[18px] text-ink/55">
              Bold, italic, links, headings and lists are all carried through to
              the page. Preview shows exactly what a reader sees.
            </p>
          )}
        </div>

        <Field
          label="Highlights"
          name="highlights"
          error={errors.highlights}
          hint={`One per line, written as "Title | The sentence under it". Three is the usual number. The sentence takes ${FORMATTING_HINT}`}
        >
          <Textarea
            id="highlights"
            name="highlights"
            defaultValue={property.highlights}
            error={errors.highlights}
            rows={4}
            placeholder="Sea Views | Every room on this floor faces the **Marmara**."
          />
        </Field>

        <AmenityPicker value={property.amenities} error={errors.amenities} />
      </section>

      <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
        <SectionTitle
          title="Terms"
          note="What a buyer asks before they enquire. The written ones are shown as written, in the language they are written in — so write them in English."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Payment plan"
            name="paymentPlan"
            error={errors.paymentPlan}
            hint={FORMATTING_HINT}
          >
            <Input
              id="paymentPlan"
              name="paymentPlan"
              defaultValue={property.paymentPlan}
              error={errors.paymentPlan}
              placeholder="**30%** on signing, 70% over 24 months"
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

        {/* The three that are answers rather than sentences. Each is a fixed
            list: they are the same statutory figures on every listing, they
            are what a buyer compares two units on, and a number picked from a
            list is a number the page can translate. */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="REIT (GYO)"
            name="gyo"
            error={errors.gyo}
            hint="Whether the development is held through a gayrimenkul yatırım ortaklığı."
          >
            <Select id="gyo" name="gyo" defaultValue={property.gyo} error={errors.gyo}>
              <option value="">Not stated</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Field>

          <Field label="VAT" name="vatRate" error={errors.vatRate}>
            <Select
              id="vatRate"
              name="vatRate"
              defaultValue={property.vatRate}
              error={errors.vatRate}
            >
              <option value="">Not stated</option>
              {vatRates.map((rate) => (
                <option key={rate} value={String(rate)}>
                  {rate}%
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Title deed tax"
            name="titleDeedTaxRate"
            error={errors.titleDeedTaxRate}
          >
            <Select
              id="titleDeedTaxRate"
              name="titleDeedTaxRate"
              defaultValue={property.titleDeedTaxRate}
              error={errors.titleDeedTaxRate}
            >
              <option value="">Not stated</option>
              {titleDeedTaxRates.map((rate) => (
                <option key={rate} value={String(rate)}>
                  {rate}%
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <p className="text-[12px] leading-[18px] text-ink/55">
          Left as “Not stated”, a row is omitted from the page rather than shown
          empty — which is not the same as answering no or zero.
        </p>

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
    </>
  );
});
