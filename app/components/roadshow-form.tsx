"use client";

/**
 * The Pakistan roadshow registration: the three contact fields, then the
 * city, the time of day and a budget band.
 *
 * On success the conversion is reported here, while the page that loaded the
 * Google tag is still open, and the reader is then taken to the thank-you page
 * with what they booked in the query string. Reporting from the thank-you page
 * instead would count every reload of it.
 */

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/app/lib/i18n/context";
import { trackAdsConversion, trackEvent } from "@/app/lib/analytics";
import {
  registerRoadshow,
  type RoadshowState,
} from "@/app/lib/leads/actions";
import {
  formatRoadshowDate,
  isRoadshowCity,
  roadshowBudgets,
  roadshowCities,
  roadshowSlots,
  slotRange,
  type RoadshowCity,
  type RoadshowSlot,
} from "@/app/lib/roadshow";
import { routes } from "@/app/lib/routes";
import { PhoneField } from "./phone-field";
import { SelectMenu } from "./select-menu";

const initialState: RoadshowState = { status: "idle" };

/** `#register-lahore` on a city card opens the form with that city chosen. */
const HASH_PREFIX = "#register-";

/**
 * `open` is decided by the server render rather than here, so a city closing
 * between that render and hydration cannot make the two disagree. The Server
 * Action checks again on submit.
 */
export function RoadshowForm({
  token,
  open,
}: {
  token: string;
  open: readonly RoadshowCity[];
}) {
  const { t, locale, href } = useI18n();
  const copy = t.roadshow;
  const form = t.contact.form;
  const path = usePathname();
  const router = useRouter();
  const [state, action, pending] = useActionState(registerRoadshow, initialState);
  const [city, setCity] = useState<RoadshowCity | "">("");
  const [slot, setSlot] = useState<RoadshowSlot | "">("");
  const [budget, setBudget] = useState("");
  const started = useRef(false);

  const errors = state.status === "invalid" ? state.errors : undefined;

  useEffect(() => {
    const pick = () => {
      const hashed = window.location.hash.slice(HASH_PREFIX.length);
      if (window.location.hash.startsWith(HASH_PREFIX) && isRoadshowCity(hashed) && open.includes(hashed)) {
        setCity(hashed);
      }
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [open]);

  useEffect(() => {
    if (state.status === "sent") {
      trackEvent("generate_lead", { enquiry_type: "roadshow", city: state.city, locale });
      trackAdsConversion("roadshowRegistration");
      const query = new URLSearchParams({ city: state.city, slot: state.slot });
      router.push(`${href(routes.roadshowThanks.pattern)}?${query}`);
    } else if (state.status === "invalid") {
      trackEvent("form_error", { fields: Object.keys(state.errors).join(",") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { locale, enquiry_type: "roadshow" });
  };

  const choiceError = (key: "city" | "slot" | "budget") => {
    const error = errors?.[key];
    if (!error) return undefined;
    return error === "closed" ? copy.form.errors.closed : copy.form.errors.choose;
  };

  return (
    <form
      action={action}
      onInput={onFirstInput}
      className="grid w-full content-start gap-5"
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="t" value={token} />

      <div aria-hidden className="hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-[12.5px] text-ink/70">
          {copy.form.city} <span className="text-gold">*</span>
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {roadshowCities.map((key) => {
            const available = open.includes(key);
            return (
              <label
                key={key}
                className={`relative flex cursor-pointer flex-col border bg-white px-4 py-3 transition-colors has-checked:border-forest has-checked:bg-forest has-checked:text-cream has-focus-visible:outline-2 has-focus-visible:outline-gold ${
                  available ? "hover:border-gold" : "cursor-not-allowed opacity-50"
                } ${choiceError("city") ? "border-red-700" : "border-ink/15"}`}
              >
                <input
                  type="radio"
                  name="city"
                  value={key}
                  required
                  disabled={!available}
                  checked={city === key}
                  onChange={() => setCity(key)}
                  className="sr-only"
                />
                <span className="font-display text-[19px] leading-tight">
                  {copy.cities[key].name}
                </span>
                <span className="mt-1 text-[12px] opacity-75">
                  {available
                    ? formatRoadshowDate(locale, key, { weekday: "short", day: "numeric", month: "short" })
                    : copy.cityClosed}
                </span>
              </label>
            );
          })}
        </div>
        <FieldError message={choiceError("city")} />
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 block text-[12.5px] text-ink/70">
          {copy.form.slot} <span className="text-gold">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2.5">
          {roadshowSlots.map((key) => (
            <label
              key={key}
              className={`flex cursor-pointer flex-col items-center border bg-white px-2 py-2.5 text-center transition-colors hover:border-gold has-checked:border-forest has-checked:bg-forest has-checked:text-cream has-focus-visible:outline-2 has-focus-visible:outline-gold ${
                choiceError("slot") ? "border-red-700" : "border-ink/15"
              }`}
            >
              <input
                type="radio"
                name="slot"
                value={key}
                required
                checked={slot === key}
                onChange={() => setSlot(key)}
                className="sr-only"
              />
              <span className="text-[13.5px]">{copy.form.slots[key]}</span>
              <span dir="ltr" className="num mt-0.5 text-[11px] opacity-70">
                {slotRange(key)}
              </span>
            </label>
          ))}
        </div>
        <FieldError message={choiceError("slot")} />
      </fieldset>

      <div>
        <span className="mb-1.5 block text-[12.5px] text-ink/70">
          {copy.form.budget} <span className="text-gold">*</span>
        </span>
        <SelectMenu
          label={copy.form.budget}
          name="budget"
          required
          value={budget}
          onChange={setBudget}
          options={[...roadshowBudgets]}
          placeholder={copy.form.budgetPlaceholder}
          format={(v) => copy.form.budgets[v as (typeof roadshowBudgets)[number]]}
          triggerClassName={`rounded-sm border bg-white px-4 py-3 text-[13.5px] text-ink focus-visible:border-gold ${
            choiceError("budget") ? "border-red-700" : "border-ink/15"
          }`}
        />
        <FieldError message={choiceError("budget")} />
      </div>

      <Field
        label={form.name}
        name="name"
        autoComplete="name"
        placeholder={form.namePlaceholder}
        error={errors?.name && form.errors[errors.name]}
      />
      <PhoneField
        label={form.phone}
        codeLabel={form.countryCode}
        placeholder={form.phonePlaceholder}
        defaultCountry="PK"
        error={errors?.phone && form.errors[errors.phone]}
      />
      <Field
        label={form.email}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={form.emailPlaceholder}
        error={errors?.email && form.errors[errors.email]}
      />

      <p className="text-[11px] leading-[17px] text-ink/60">{copy.form.consent}</p>

      {state.status === "failed" ? (
        <p
          role="alert"
          className="rounded-sm border border-red-800/30 bg-red-50 px-4 py-3 text-[12.5px] leading-[19px] text-red-900"
        >
          {state.reason === "rate" ? form.errors.rate : form.errors.server}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || state.status === "sent"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending || state.status === "sent" ? copy.form.submitting : copy.form.submit}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
      {message}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[12.5px] text-ink/70">
        {label} <span className="text-gold">*</span>
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-invalid={error ? true : undefined}
        className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold aria-invalid:border-red-700"
      />
      <FieldError message={error} />
    </label>
  );
}
