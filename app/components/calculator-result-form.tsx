"use client";

/**
 * The gated half of `/calculator-result`: name, email and phone unlock the
 * line-item breakdown on the page and trigger the emailed report.
 */

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/lib/i18n/context";
import { trackEvent } from "@/app/lib/analytics";
import {
  requestCalculatorReport,
  type MagnetState,
} from "@/app/lib/leads/actions";
import { PhoneField } from "./phone-field";

const initialState: MagnetState = { status: "idle" };

export function CalculatorResultForm({
  token,
  programme,
  adults,
  children,
  onSent,
}: {
  token: string;
  programme: string;
  adults: string;
  children: string;
  onSent?: () => void;
}) {
  const { t, locale } = useI18n();
  const copy = t.calculatorResult;
  const form = t.contact.form;
  const path = usePathname();
  const [state, action, pending] = useActionState(
    requestCalculatorReport,
    initialState,
  );
  const started = useRef(false);
  const announced = useRef(false);

  const errors = state.status === "invalid" ? state.errors : undefined;

  useEffect(() => {
    if (state.status === "sent") {
      trackEvent("generate_lead", { enquiry_type: "calculator", locale });
      if (!announced.current) {
        announced.current = true;
        onSent?.();
      }
    } else if (state.status === "invalid") {
      trackEvent("form_error", { fields: Object.keys(state.errors).join(",") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { locale });
  };

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="flex min-h-[280px] flex-col items-center justify-center border border-ink/10 bg-white px-8 text-center"
      >
        <h3 className="font-display text-[26px] text-ink">{copy.sentHeading}</h3>
        <p className="mt-3 max-w-[340px] text-[13px] leading-[21px] text-ink/70">
          {copy.sentBody}
        </p>
      </div>
    );
  }

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
      <input type="hidden" name="programme" value={programme} />
      <input type="hidden" name="adults" value={adults} />
      <input type="hidden" name="children" value={children} />

      <div aria-hidden className="hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label={form.name}
        name="name"
        autoComplete="name"
        placeholder={form.namePlaceholder}
        error={errors?.name && form.errors[errors.name]}
      />
      <Field
        label={form.email}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={form.emailPlaceholder}
        error={errors?.email && form.errors[errors.email]}
      />
      <PhoneField
        label={form.phone}
        codeLabel={form.countryCode}
        placeholder={form.phonePlaceholder}
        error={errors?.phone && form.errors[errors.phone]}
      />

      <p className="text-[11px] leading-[17px] text-ink/60">{copy.consent}</p>

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
        disabled={pending}
        className="rounded-full bg-forest px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
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
      {error ? (
        <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
          {error}
        </span>
      ) : null}
    </label>
  );
}
