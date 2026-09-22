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
import { DISTRICT_NAMES } from "@/app/lib/districts";
import {
  amenityGroups,
  amenityNames,
  splitAmenities,
} from "@/app/lib/amenities";
import {
  CBI_THRESHOLD_USD,
  propertyTypes,
  titleDeedTaxRates,
  vatRates,
} from "@/app/lib/properties";
import {
  distanceGroups,
  formatDistances,
  groupDistances,
  parseDistances,
} from "@/app/lib/story";
import { AmenityIcon } from "../amenity-icon";
import { DistanceIcon } from "../distance-icon";
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
  /** The development's story — see `app/lib/story.ts`. Prose in the article grammar. */
  architecture: string;
  earthquake: string;
  /** The distances as saved: `## Group` lines over `Name | 4 km | 10 min` rows. */
  distances: string;
  areaOverview: string;
  areaGallery: string[];
  marketPerformance: string;
  marketChart: string;
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
  mapDistrict: string;
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
  architecture: "",
  earthquake: "",
  distances: "",
  areaOverview: "",
  areaGallery: [],
  marketPerformance: "",
  marketChart: "",
  paymentPlan: "",
  handover: "",
  serviceCharge: "",
  titleDeed: "",
  gyo: "",
  vatRate: "",
  titleDeedTaxRate: "",
  videoUrl: "",
  mapDistrict: "",
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
    architecture: text("architecture"),
    earthquake: text("earthquake"),
    distances: text("distances"),
    areaOverview: text("areaOverview"),
    areaGallery: list("areaGallery"),
    marketPerformance: text("marketPerformance"),
    marketChart: text("marketChart"),
    paymentPlan: text("paymentPlan"),
    handover: text("handover"),
    serviceCharge: text("serviceCharge"),
    titleDeed: text("titleDeed"),
    gyo: text("gyo"),
    vatRate: text("vatRate"),
    titleDeedTaxRate: text("titleDeedTaxRate"),
    videoUrl: text("videoUrl"),
    mapDistrict: text("mapDistrict"),
    mapLat: text("mapLat"),
    mapLng: text("mapLng"),
    seoTitle: text("seoTitle"),
    seoDescription: text("seoDescription"),
    noindex: form.get("noindex") !== null,
  };
}

// --- The steps -----------------------------------------------------------------
//
// One form, shown one step at a time. A listing has forty-odd fields, and
// forty boxes down a single page is where a lister loses their place; six
// tabs in the order a listing is usually written — what it is, what it costs,
// what it looks like, what to say about it, what its project is, and where it
// is — is the shape of every property portal they have used before.
//
// Every step stays mounted, only hidden, so the one <form> still submits all
// of it and the draft in localStorage still sees every field.

type StepId = "basics" | "price" | "media" | "description" | "project" | "location";

const STEPS: { id: StepId; label: string; note: string }[] = [
  { id: "basics", label: "Basics", note: "Name, place and specs" },
  { id: "price", label: "Price & terms", note: "Prices, payment, taxes" },
  { id: "media", label: "Photos & files", note: "Images, plans, brochure" },
  { id: "description", label: "Description", note: "Copy, highlights, amenities" },
  { id: "project", label: "Project details", note: "Building, area, market" },
  { id: "location", label: "Map & SEO", note: "Pin, title, indexing" },
];

/** Which step each field is on, so a rejected save can open the right one. */
const FIELD_STEP: Record<string, StepId> = {
  title: "basics",
  project: "basics",
  slug: "basics",
  location: "basics",
  country: "basics",
  type: "basics",
  bedroom: "basics",
  bathrooms: "basics",
  size: "basics",
  level: "basics",
  view: "basics",
  priceUSD: "price",
  priceEUR: "price",
  priceTRY: "price",
  paymentPlan: "price",
  handover: "price",
  serviceCharge: "price",
  titleDeed: "price",
  gyo: "price",
  vatRate: "price",
  titleDeedTaxRate: "price",
  image: "media",
  gallery: "media",
  floorPlans: "media",
  brochure: "media",
  videoUrl: "media",
  description: "description",
  highlights: "description",
  amenities: "description",
  architecture: "project",
  earthquake: "project",
  distances: "project",
  areaOverview: "project",
  areaGallery: "project",
  marketPerformance: "project",
  marketChart: "project",
  mapDistrict: "location",
  mapLat: "location",
  mapLng: "location",
  seoTitle: "location",
  seoDescription: "location",
};

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
  country: "Country",
  priceUSD: "Price (USD)",
  priceEUR: "Price (EUR)",
  priceTRY: "Price (TRY)",
  type: "Type",
  bedroom: "Bedrooms",
  bathrooms: "Bathrooms",
  size: "Size",
  level: "Floor",
  view: "View",
  image: "Main photo",
  gallery: "Gallery",
  floorPlans: "Floor plans",
  brochure: "Brochure (PDF)",
  description: "Description",
  highlights: "Highlights",
  amenities: "Amenities",
  architecture: "Architectural concept",
  earthquake: "Earthquake resistance",
  distances: "Nearby places",
  areaOverview: "About the area",
  areaGallery: "Area photos",
  marketPerformance: "Market performance",
  marketChart: "Market chart",
  paymentPlan: "Payment plan",
  handover: "Handover",
  serviceCharge: "Service charge",
  titleDeed: "Title deed",
  gyo: "REIT (GYO)",
  vatRate: "VAT",
  titleDeedTaxRate: "Title deed tax",
  videoUrl: "Video tour",
  mapDistrict: "District",
  mapLat: "Latitude",
  mapLng: "Longitude",
  seoTitle: "SEO title",
  seoDescription: "Meta description",
};

/** The box a field name belongs to, where the two differ. */
const FIELD_IDS: Record<string, string> = {
  amenities: "amenities-other",
  highlights: "highlights-editor",
  distances: "distances-editor",
};

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
  const [step, setStep] = useState<StepId>("basics");

  // When a save comes back rejected, open the first step with a problem on
  // it. Done as the answer arrives — during the render that first sees it —
  // rather than in an effect, so the right step is the one that paints.
  const [answered, setAnswered] = useState(state);
  if (state !== answered) {
    setAnswered(state);
    const first = Object.keys(state.fieldErrors ?? {}).find((name) => FIELD_STEP[name]);
    if (first) setStep(FIELD_STEP[first]);
  }

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

  const failed = useMemo(() => Object.keys(errors), [errors]);
  const alert = useRef<HTMLDivElement>(null);

  // How many fields on each step were rejected, for the badge on its tab.
  const problems = useMemo(() => {
    const counts: Partial<Record<StepId, number>> = {};
    for (const name of failed) {
      const at = FIELD_STEP[name];
      if (at) counts[at] = (counts[at] ?? 0) + 1;
    }
    return counts;
  }, [failed]);

  /** Opens the step a field is on, then scrolls to the field. */
  const goTo = useCallback((name: string) => {
    const at = FIELD_STEP[name];
    if (at) setStep(at);
    // After the step has been shown: a box on a hidden step has no position
    // to scroll to.
    requestAnimationFrame(() => {
      const box = document.getElementById(FIELD_IDS[name] ?? name);
      box?.scrollIntoView({ block: "center", behavior: "smooth" });
      box?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (!state.error && !state.fieldErrors) return;

    // Puts back everything React's post-action form reset just wiped, and
    // takes the draft again.
    rejected();

    // And announce the problem where the person is looking. Publish is at
    // the bottom of the form; without this a rejected save looks like a
    // button that does nothing.
    alert.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    alert.current?.focus({ preventScroll: true });
  }, [state, rejected]);

  const at = STEPS.findIndex((s) => s.id === step);
  const previous = STEPS[at - 1];
  const next = STEPS[at + 1];

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
        // The server checks everything and says which step the problem is on.
        // The browser's own check cannot: it stops the submit at a required
        // box on a hidden step and points at nothing.
        noValidate
        className="grid max-w-[860px] gap-5"
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
                        goTo(name);
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

        <Steps step={step} onChange={setStep} problems={problems} />

        {/* Remounted when a draft is restored, so every box below picks up its
            restored value the same way it picks up the server's. */}
        <PropertyFields
          key={version}
          step={step}
          property={values}
          locations={locations}
          errors={errors}
          onUpload={touch}
        />

        {/* Always in reach: a lister on step three should not have to find
            the bottom of step six to save. */}
        <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-3 border-t border-ink/10 bg-[#f7f8f7]/95 px-1 py-3 backdrop-blur">
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

          <span className="ms-auto flex items-center gap-2">
            {previous ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(previous.id)}
              >
                ← {previous.label}
              </Button>
            ) : null}
            {next ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(next.id)}
              >
                {next.label} →
              </Button>
            ) : null}
          </span>
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

/** The tab strip across the top of the form. */
function Steps({
  step,
  onChange,
  problems,
}: {
  step: StepId;
  onChange: (step: StepId) => void;
  problems: Partial<Record<StepId, number>>;
}) {
  return (
    <nav
      aria-label="Listing steps"
      className="sticky top-0 z-10 -mx-1 bg-[#f7f8f7]/95 px-1 py-1 backdrop-blur"
    >
      <ol className="flex flex-wrap gap-1 rounded-lg border border-ink/10 bg-white p-1">
        {STEPS.map((item, index) => {
          const active = item.id === step;
          const count = problems[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={active ? "step" : undefined}
                className={clsx(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-start transition-colors",
                  active ? "bg-forest text-white" : "text-ink/70 hover:bg-ink/5",
                )}
              >
                <span
                  className={clsx(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                    active ? "bg-white/20 text-white" : "bg-ink/8 text-ink/60",
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-[13px] font-medium" title={item.note}>
                  {item.label}
                </span>
                {count ? (
                  <span
                    title={`${count} to fix`}
                    className="ms-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-medium text-white"
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** One step's panel. Hidden rather than unmounted — see the note on `STEPS`. */
function Panel({
  active,
  title,
  note,
  children,
}: {
  active: boolean;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div hidden={!active} className="grid gap-5">
      <div>
        <h2 className="text-[16px] font-medium text-ink">{title}</h2>
        {note ? (
          <p className="mt-1 text-[12.5px] leading-[18px] text-ink/55">{note}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** A white card grouping a few related fields, with an optional heading. */
function Card({
  title,
  note,
  children,
}: {
  title?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
      {title ? (
        <div>
          <h3 className="text-[13px] font-medium text-ink">{title}</h3>
          {note ? (
            <p className="mt-1 text-[12px] leading-[18px] text-ink/55">{note}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function Check({
  name,
  label,
  note,
  defaultChecked,
}: {
  name: string;
  label: string;
  note?: React.ReactNode;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-2.5 text-[13px] text-ink/80">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-[#12402a]"
      />
      <span>
        {label}
        {note ? (
          <span className="mt-0.5 block text-[12px] text-ink/55">{note}</span>
        ) : null}
      </span>
    </label>
  );
}

/**
 * A prose box — the same editor and the same grammar the description uses,
 * with its label and its hint, for the sections of the development's story.
 */
function Prose({
  name,
  label,
  value,
  error,
  placeholder,
  hint,
  variant = "prose",
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  hint?: string;
  variant?: "article" | "prose";
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <RichEditor
        name={name}
        defaultValue={value}
        error={error}
        variant={variant}
        placeholder={placeholder}
      />
      {error ? (
        <p id={`${name}-error`} className="text-[12px] text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] leading-[18px] text-ink/55">{hint}</p>
      ) : null}
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

/** The small "×" on the end of an editable row. */
function RemoveRow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex size-9 shrink-0 items-center justify-center rounded-md text-[18px] leading-none text-ink/40 transition-colors hover:bg-red-50 hover:text-red-700"
    >
      ×
    </button>
  );
}

function AddRow({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="justify-self-start rounded-md border border-dashed border-ink/25 px-3 py-1.5 text-[13px] text-ink/70 transition-colors hover:border-forest hover:text-forest"
    >
      + {children}
    </button>
  );
}

// A row's key survives its neighbours being removed, so a caret is not
// handed to the wrong box when the row above it goes.
let rowId = 0;
const nextRowId = () => ++rowId;

/**
 * Highlights, one row each — a heading and the sentence under it — rather
 * than a box with a `Title | Text` rule to remember. Joined back into the
 * one `highlights` field the Server Action already parses.
 */
function HighlightsEditor({ value, error }: { value: string; error?: string }) {
  const [rows, setRows] = useState(() => {
    const parsed = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const at = line.indexOf("|");
        return {
          id: nextRowId(),
          title: at === -1 ? line : line.slice(0, at).trim(),
          text: at === -1 ? "" : line.slice(at + 1).trim(),
        };
      });
    return parsed.length ? parsed : [{ id: nextRowId(), title: "", text: "" }];
  });

  const update = (id: number, patch: Partial<{ title: string; text: string }>) =>
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );

  const serialised = rows
    .filter((row) => row.title.trim() || row.text.trim())
    .map((row) => `${row.title.trim()} | ${row.text.trim()}`)
    .join("\n");

  return (
    <div id="highlights-editor" tabIndex={-1} className="grid gap-2 outline-none">
      <div>
        <p className="text-[13px] font-medium text-ink">Highlights</p>
        <p className="mt-0.5 text-[12px] text-ink/55">
          Three short selling points, shown as cards. A heading and one sentence each.
        </p>
      </div>
      <input type="hidden" name="highlights" value={serialised} />
      <div className="grid gap-2">
        {rows.map((row, index) => {
          const half = Boolean(row.title.trim()) !== Boolean(row.text.trim());
          return (
            <div key={row.id} className="grid gap-1">
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-2">
                <Input
                  aria-label={`Highlight ${index + 1} heading`}
                  value={row.title}
                  onChange={(event) => update(row.id, { title: event.target.value })}
                  placeholder="Sea Views"
                  error={half ? "half" : undefined}
                />
                <Input
                  aria-label={`Highlight ${index + 1} text`}
                  value={row.text}
                  onChange={(event) => update(row.id, { text: event.target.value })}
                  placeholder="Every room faces the Marmara."
                  error={half ? "half" : undefined}
                />
                <RemoveRow
                  label="Remove highlight"
                  onClick={() =>
                    setRows((current) =>
                      current.length === 1
                        ? [{ id: nextRowId(), title: "", text: "" }]
                        : current.filter((r) => r.id !== row.id),
                    )
                  }
                />
              </div>
              {half ? (
                <p className="text-[12px] text-red-700">
                  Both the heading and the sentence are needed.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      {error ? <p className="text-[12px] text-red-700">{error}</p> : null}
      <AddRow
        onClick={() =>
          setRows((current) => [...current, { id: nextRowId(), title: "", text: "" }])
        }
      >
        Add a highlight
      </AddRow>
    </div>
  );
}

/**
 * Nearby places, entered a group at a time — "Airports", then the airports
 * under it with how far each is — the way the developer's sheet lists them
 * and the way the page shows them. The groups the site can translate and
 * illustrate are offered as suggestions; any other name is kept as written.
 * Joined back into the one `distances` field the Server Action parses.
 */
function DistancesEditor({ value, error }: { value: string; error?: string }) {
  type Place = { id: number; name: string; distance: string; time: string };
  type Group = { id: number; name: string; places: Place[] };

  const blankPlace = (): Place => ({ id: nextRowId(), name: "", distance: "", time: "" });
  const blankGroup = (name = ""): Group => ({
    id: nextRowId(),
    name,
    places: [blankPlace()],
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const parsed = groupDistances(parseDistances(value)).map(({ group, rows }) => ({
      id: nextRowId(),
      name: group,
      places: rows.map((row) => ({ id: nextRowId(), ...row })),
    }));
    return parsed.length ? parsed : [blankGroup()];
  });

  const setGroup = (id: number, patch: Partial<Group>) =>
    setGroups((current) =>
      current.map((group) => (group.id === id ? { ...group, ...patch } : group)),
    );
  const setPlace = (groupId: number, id: number, patch: Partial<Place>) =>
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              places: group.places.map((place) =>
                place.id === id ? { ...place, ...patch } : place,
              ),
            }
          : group,
      ),
    );

  // Only whole rows are saved; a row still being typed is shown, not sent.
  const whole = (place: Place) =>
    Boolean(place.name.trim() && (place.distance.trim() || place.time.trim()));
  const serialised = formatDistances(
    groups.flatMap((group) =>
      group.name.trim()
        ? group.places.filter(whole).map((place) => ({
            group: group.name.trim(),
            name: place.name.trim(),
            distance: place.distance.trim(),
            time: place.time.trim(),
          }))
        : [],
    ),
  );

  return (
    <div id="distances-editor" tabIndex={-1} className="grid gap-3 outline-none">
      <div>
        <p className="text-[13px] font-medium text-ink">Nearby places</p>
        <p className="mt-0.5 text-[12px] text-ink/55">
          Landmarks, airports, hospitals, offices, schools and shops, and how far
          they are. One block per group; each group gets an icon on the page.
        </p>
      </div>
      <input type="hidden" name="distances" value={serialised} />
      <datalist id="distance-groups">
        {distanceGroups.map((group) => (
          <option key={group} value={group} />
        ))}
      </datalist>

      {groups.map((group, groupIndex) => {
        const started = group.places.some(
          (place) => place.name.trim() || place.distance.trim() || place.time.trim(),
        );
        const unnamed = started && !group.name.trim();
        return (
          <div
            key={group.id}
            className="grid gap-2 rounded-md border border-ink/10 bg-[#f7f8f7] p-3"
          >
            <div className="flex items-center gap-2">
              <div className="relative grow sm:max-w-[280px]">
                <span className="pointer-events-none absolute inset-y-0 start-2.5 flex items-center text-gold">
                  <DistanceIcon group={group.name} className="w-4" />
                </span>
                <Input
                  aria-label={`Group ${groupIndex + 1} name`}
                  list="distance-groups"
                  value={group.name}
                  onChange={(event) => setGroup(group.id, { name: event.target.value })}
                  placeholder="Group — Airports, Hospitals, Schools…"
                  className="ps-9 font-medium"
                  error={unnamed ? "unnamed" : undefined}
                />
              </div>
              <RemoveRow
                label="Remove group"
                onClick={() =>
                  setGroups((current) =>
                    current.length === 1
                      ? [blankGroup()]
                      : current.filter((g) => g.id !== group.id),
                  )
                }
              />
            </div>
            {unnamed ? (
              <p className="text-[12px] text-red-700">
                Name the group — its places are not saved until it has one.
              </p>
            ) : null}

            <div className="grid gap-1.5">
              <div className="hidden grid-cols-[minmax(0,6fr)_minmax(0,2fr)_minmax(0,3fr)_36px] gap-2 px-0.5 text-[11px] uppercase tracking-[0.08em] text-ink/45 sm:grid">
                <span>Place</span>
                <span>Distance</span>
                <span>Travel time</span>
              </div>
              {group.places.map((place, index) => {
                const typed = Boolean(
                  place.name.trim() || place.distance.trim() || place.time.trim(),
                );
                const missing = typed && !whole(place);
                return (
                  <div key={place.id} className="grid gap-1">
                    <div className="grid grid-cols-[minmax(0,1fr)_36px] gap-2 sm:grid-cols-[minmax(0,6fr)_minmax(0,2fr)_minmax(0,3fr)_36px]">
                      <Input
                        aria-label={`${group.name || "Group"} place ${index + 1}`}
                        value={place.name}
                        onChange={(event) =>
                          setPlace(group.id, place.id, { name: event.target.value })
                        }
                        placeholder="Istanbul Airport"
                        className="col-span-2 sm:col-span-1"
                        error={missing && !place.name.trim() ? "missing" : undefined}
                      />
                      <Input
                        aria-label={`${place.name || "Place"} distance`}
                        value={place.distance}
                        onChange={(event) =>
                          setPlace(group.id, place.id, { distance: event.target.value })
                        }
                        placeholder="39 km"
                        className="col-start-1 sm:col-start-auto"
                        error={
                          missing && !place.distance.trim() && !place.time.trim()
                            ? "missing"
                            : undefined
                        }
                      />
                      <div className="col-span-2 flex gap-1 sm:col-span-2">
                        <Input
                          aria-label={`${place.name || "Place"} travel time`}
                          value={place.time}
                          onChange={(event) =>
                            setPlace(group.id, place.id, { time: event.target.value })
                          }
                          placeholder="35–45 min"
                          error={
                            missing && !place.distance.trim() && !place.time.trim()
                              ? "missing"
                              : undefined
                          }
                        />
                        <RemoveRow
                          label="Remove place"
                          onClick={() =>
                            setGroup(group.id, {
                              places:
                                group.places.length === 1
                                  ? [blankPlace()]
                                  : group.places.filter((p) => p.id !== place.id),
                            })
                          }
                        />
                      </div>
                    </div>
                    {missing ? (
                      <p className="text-[12px] text-red-700">
                        Needs the place and a distance or a travel time before it is saved.
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <AddRow
              onClick={() =>
                setGroup(group.id, { places: [...group.places, blankPlace()] })
              }
            >
              Add a place
            </AddRow>
          </div>
        );
      })}

      {error ? <p className="text-[12px] text-red-700">{error}</p> : null}
      <AddRow onClick={() => setGroups((current) => [...current, blankGroup()])}>
        Add a group
      </AddRow>
    </div>
  );
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
      <legend className="text-[13px] font-medium text-ink">
        Amenities
        {selected.length ? (
          <span className="ms-2 font-normal text-ink/45">{selected.length} selected</span>
        ) : null}
      </legend>
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
          Other amenities
        </label>
        <Textarea
          id="amenities-other"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "amenities-error" : undefined}
          rows={2}
          className="min-h-[72px]"
          placeholder="One per line — Helipad"
        />
        {error ? (
          <p id="amenities-error" className="text-[12px] text-red-700">
            {error}
          </p>
        ) : (
          <p className="text-[12px] leading-[18px] text-ink/55">
            Shown as written, in English. The ticked ones above are translated and get an icon.
          </p>
        )}
      </div>
    </fieldset>
  );
}

/**
 * Memoised: the preview re-renders as fast as somebody types, and the fields
 * beside it hold carets, upload progress and a rich-text editor that have no
 * reason to be rebuilt for it.
 */
const PropertyFields = memo(function PropertyFields({
  step,
  property,
  locations,
  errors,
  onUpload,
}: {
  step: StepId;
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
      {/* 1 — Basics */}
      <Panel
        active={step === "basics"}
        title="Basics"
        note="What the unit is and where it is. Everything on this step is required."
      >
        <Card>
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
              />
            </Field>

            <Field
              label="Development"
              name="project"
              error={errors.project}
              hint="The project this unit is part of. Units with the same development name share one project page."
              required
            >
              <Input
                id="project"
                name="project"
                defaultValue={property.project}
                error={errors.project}
                placeholder="Marmara Vista"
              />
            </Field>
          </div>

          <Field
            label="URL slug"
            name="slug"
            error={errors.slug}
            hint={
              <>
                Filled in from the title. The page will be at{" "}
                <code>/properties/{slug || "…"}</code>
              </>
            }
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
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="City or district"
              name="location"
              error={errors.location}
              hint="e.g. Şişli, Istanbul"
              required
            >
              <Input
                id="location"
                name="location"
                defaultValue={property.location}
                error={errors.location}
                list="known-locations"
                placeholder="Şişli, Istanbul"
              />
            </Field>

            <Field label="Country" name="country" error={errors.country} required>
              <Input
                id="country"
                name="country"
                defaultValue={property.country}
                error={errors.country}
                list="known-countries"
              />
            </Field>
          </div>

          <datalist id="known-locations">
            {locations.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
          <datalist id="known-countries">
            {["Türkiye", "Caribbean", "United Arab Emirates"].map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
        </Card>

        <Card
          title="Specifications"
          note="Shown in the “At a glance” row and used by the search filters."
        >
          <div className="grid gap-4 sm:grid-cols-3">
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
              hint="“2+1”, “Studio”, or a range: “1+1, 2+1, 3+1”"
              required
            >
              <Input
                id="bedroom"
                name="bedroom"
                defaultValue={property.bedroom}
                error={errors.bedroom}
                placeholder="2+1"
              />
            </Field>

            <Field label="Bathrooms" name="bathrooms" error={errors.bathrooms} required>
              <Input
                id="bathrooms"
                name="bathrooms"
                defaultValue={property.bathrooms}
                error={errors.bathrooms}
                placeholder="2"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Size"
              name="size"
              error={errors.size}
              hint="With the unit: sqm or sq. ft."
              required
            >
              <Input
                id="size"
                name="size"
                defaultValue={property.size}
                error={errors.size}
                placeholder="120 sqm"
              />
            </Field>
            <Field label="Floor" name="level" error={errors.level} required>
              <Input
                id="level"
                name="level"
                defaultValue={property.level}
                error={errors.level}
                placeholder="Floors 1–3"
              />
            </Field>
            <Field label="View" name="view" error={errors.view} required>
              <Input
                id="view"
                name="view"
                defaultValue={property.view}
                error={errors.view}
                placeholder="Sea view"
              />
            </Field>
          </div>

          <Check
            name="soldOut"
            label="Sold out"
            note="Stays on the site, marked unavailable."
            defaultChecked={property.soldOut}
          />
        </Card>
      </Panel>

      {/* 2 — Price & terms */}
      <Panel
        active={step === "price"}
        title="Price & terms"
        note="The three prices are required; the terms are optional and only shown when filled in."
      >
        <Card
          title="Price"
          note="Whole numbers. 450000, 450,000 and 450.000 are all read the same."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="USD" name="priceUSD" error={errors.priceUSD} required>
              <Input
                id="priceUSD"
                name="priceUSD"
                inputMode="numeric"
                value={usd}
                error={errors.priceUSD}
                onChange={(event) => setUsd(event.target.value)}
                placeholder="450000"
              />
            </Field>
            <Field label="EUR" name="priceEUR" error={errors.priceEUR} required>
              <Input
                id="priceEUR"
                name="priceEUR"
                inputMode="numeric"
                defaultValue={property.priceEUR}
                error={errors.priceEUR}
                placeholder="414000"
              />
            </Field>
            <Field label="TRY" name="priceTRY" error={errors.priceTRY} required>
              <Input
                id="priceTRY"
                name="priceTRY"
                inputMode="numeric"
                defaultValue={property.priceTRY}
                error={errors.priceTRY}
                placeholder="18400000"
              />
            </Field>
          </div>

          <Check
            name="cbiEligible"
            label="Eligible for citizenship by investment"
            defaultChecked={property.cbiEligible}
            note={
              overThreshold
                ? `Ticked automatically — the USD price meets the Türkiye threshold of $${CBI_THRESHOLD_USD.toLocaleString("en-US")}.`
                : `Below the Türkiye threshold of $${CBI_THRESHOLD_USD.toLocaleString("en-US")}. Tick only if it qualifies under another programme.`
            }
          />
        </Card>

        <Card title="Terms" note="Shown under “Terms” on the page. Write them in English.">
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
                placeholder="Q4 2027"
              />
            </Field>
            <Field label="Service charge" name="serviceCharge" error={errors.serviceCharge}>
              <Input
                id="serviceCharge"
                name="serviceCharge"
                defaultValue={property.serviceCharge}
                error={errors.serviceCharge}
                placeholder="USD 1.50 / sqm / month"
              />
            </Field>
            <Field label="Title deed" name="titleDeed" error={errors.titleDeed}>
              <Input
                id="titleDeed"
                name="titleDeed"
                defaultValue={property.titleDeed}
                error={errors.titleDeed}
                placeholder="Ready title deed"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="REIT (GYO)" name="gyo" error={errors.gyo}>
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
                  <option key={rate} value={rate}>
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
                  <option key={rate} value={rate}>
                    {rate}%
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>
      </Panel>

      {/* 3 — Photos & files */}
      <Panel
        active={step === "media"}
        title="Photos & files"
        note="Uploads go to Cloudinary. A path under /public also works if the file is in the repository."
      >
        <Card>
          <UploadField
            name="image"
            label="Main photo"
            error={errors.image}
            accept="image/*"
            resourceType="image"
            defaultValue={property.image}
            onValueChange={onUpload}
            placeholder="/images/units/…"
            hint="The card on the search page and the hero of the listing. Landscape, about 3:2."
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
            hint="In this order. The first gets the wide slot."
          />

          <UploadList
            name="floorPlans"
            label="Floor plans"
            error={errors.floorPlans}
            accept="image/*"
            resourceType="image"
            defaultValue={property.floorPlans}
            onValueChange={onUpload}
            hint="Shown whole, never cropped."
            rows={3}
          />
        </Card>

        <Card title="Brochure & tour">
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
            hint="Emailed to anyone who asks for it. Without one, the “Download Brochure” button is hidden."
          />

          <Field
            label="Video tour"
            name="videoUrl"
            error={errors.videoUrl}
            hint="A YouTube or Vimeo link. Shown as a button, not embedded."
          >
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={property.videoUrl}
              error={errors.videoUrl}
              placeholder="https://youtu.be/…"
            />
          </Field>
        </Card>
      </Panel>

      {/* 4 — Description */}
      <Panel
        active={step === "description"}
        title="Description"
        note="Optional. Each part is left off the page when empty, so a listing with only specs still looks finished."
      >
        <Card>
          <Prose
            name="description"
            label="About the development"
            value={property.description}
            error={errors.description}
            placeholder={
              "Describe the development and the residence.\n\nA blank line starts a new paragraph. Use the toolbar for bold, lists and links."
            }
          />

          <HighlightsEditor value={property.highlights} error={errors.highlights} />
        </Card>

        <Card>
          <AmenityPicker value={property.amenities} error={errors.amenities} />
        </Card>
      </Panel>

      {/* 5 — Project details */}
      <Panel
        active={step === "project"}
        title="Project details"
        note="The sections from the developer's project sheet. Fill them in once, on any unit — every unit in the development and the development's own page show them."
      >
        <Card title="The building">
          <Prose
            name="architecture"
            label="Architectural concept"
            value={property.architecture}
            error={errors.architecture}
            placeholder="What the building is like to live in — green space, social facilities, common areas, and who it is designed for."
          />

          <Prose
            name="earthquake"
            label="Earthquake resistance"
            value={property.earthquake}
            error={errors.earthquake}
            placeholder="Concrete grade, foundation depth, reinforcement, and the magnitude it is designed against."
            hint="Shown as a panel beside the architecture."
          />
        </Card>

        <Card>
          <DistancesEditor value={property.distances} error={errors.distances} />
        </Card>

        <Card title="The area">
          <UploadList
            name="areaGallery"
            label="Area photos"
            error={errors.areaGallery}
            accept="image/*"
            resourceType="image"
            defaultValue={property.areaGallery}
            onValueChange={onUpload}
            hint="Photos of the district, shown as a collage. Four is the usual number."
            rows={3}
          />

          <Prose
            name="areaOverview"
            label="About the area"
            value={property.areaOverview}
            error={errors.areaOverview}
            variant="article"
            placeholder={
              "The district — where it sits in the city, its neighbourhoods, transport, schools, hospitals and shopping.\n\nUse H2/H3 for each heading and the list button for bullets."
            }
            hint="The longest section. Headings, bullets, bold and images all carry through to the page."
          />
        </Card>

        <Card title="The market">
          <Prose
            name="marketPerformance"
            label="Market performance"
            value={property.marketPerformance}
            error={errors.marketPerformance}
            variant="article"
            placeholder={
              "Past — how prices have moved.\n\nCurrent — average price per m², rental yield.\n\nFuture — the forecast.\n\nSource: a link to where the figures come from."
            }
            hint="Past, current and forecast, each under an H3 heading, with the source linked at the end."
          />

          <UploadField
            name="marketChart"
            label="Market chart"
            error={errors.marketChart}
            accept="image/*"
            resourceType="image"
            defaultValue={property.marketChart}
            onValueChange={onUpload}
            hint="The price chart, shown beside the text. A screenshot is fine."
          />
        </Card>
      </Panel>

      {/* 6 — Map & SEO */}
      <Panel
        active={step === "location"}
        title="Map & SEO"
        note="Where the map pins the listing, and how it appears in search engines."
      >
        <Card
          title="Map"
          note="The page shows a map of the city with one pin on the district — never the exact building."
        >
          <Field label="District" name="mapDistrict" error={errors.mapDistrict}>
            <Select
              id="mapDistrict"
              name="mapDistrict"
              defaultValue={property.mapDistrict}
              error={errors.mapDistrict}
            >
              <option value="">Same as the city or district above</option>
              {DISTRICT_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude" name="mapLat" error={errors.mapLat}>
              <Input
                id="mapLat"
                name="mapLat"
                defaultValue={property.mapLat}
                error={errors.mapLat}
                placeholder="41.0602"
              />
            </Field>
            <Field
              label="Longitude"
              name="mapLng"
              error={errors.mapLng}
              hint="Both or neither. Kept on file; the pin drawn is the district's."
            >
              <Input
                id="mapLng"
                name="mapLng"
                defaultValue={property.mapLng}
                error={errors.mapLng}
                placeholder="28.9877"
              />
            </Field>
          </div>
        </Card>

        <Card
          title="Search engines"
          note="Left empty, the listing's own title and description are used."
        >
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
            hint="About 155 characters."
          >
            <Textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={property.seoDescription}
              error={errors.seoDescription}
              rows={3}
            />
          </Field>

          <Check
            name="noindex"
            label="Hide from search engines"
            note="The page still works and can be linked from a campaign — it is just not indexed."
            defaultChecked={property.noindex}
          />
        </Card>
      </Panel>
    </>
  );
});
