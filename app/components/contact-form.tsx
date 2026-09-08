"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/lib/i18n/context";
import { trackEvent } from "@/app/lib/analytics";
import { submitLead, type LeadState } from "@/app/lib/leads/actions";
import { enquiryTypes, type EnquiryType } from "@/app/lib/leads/schema";
import { SelectMenu } from "./select-menu";

export type { EnquiryType };

const initialState: LeadState = { status: "idle" };

/**
 * `defaultEnquiry` lets a page that already knows what the reader is here for
 * — a citizenship programme page, say — open the form on that option rather
 * than making them re-state it. Unset, it opens where /contact-us does.
 *
 * `defaultSubject` does the same for the subject line, so an enquiry raised
 * from a residence card arrives naming the residence.
 *
 * `token` is minted by the Server Component that renders this form; see
 * `app/lib/leads/token.ts` for what it is for.
 */
export function ContactForm({
  defaultEnquiry = enquiryTypes[0],
  defaultSubject,
  token,
  programme,
}: {
  defaultEnquiry?: EnquiryType;
  defaultSubject?: string;
  token: string;
  programme?: string;
}) {
  const { t, locale } = useI18n();
  const form = t.contact.form;
  const path = usePathname();
  const [state, action, pending] = useActionState(submitLead, initialState);
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(defaultEnquiry);
  const started = useRef(false);

  const errors = state.status === "invalid" ? state.errors : undefined;

  useEffect(() => {
    if (state.status === "sent") {
      trackEvent("generate_lead", { enquiry_type: enquiryType, locale });
    } else if (state.status === "invalid") {
      trackEvent("form_error", { fields: Object.keys(state.errors).join(",") });
    }
    // `enquiryType` and `locale` only describe the submission that just
    // settled; re-running when the reader edits the form would double-count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  /** Fires once per mount, the first time the reader touches the form. */
  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { locale });
  };

  if (state.status === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center border border-ink/10 bg-white px-8 text-center">
        <h3 className="font-display text-[26px] text-ink">
          {form.sentHeading}
        </h3>
        <p className="mt-3 max-w-[340px] text-[13px] leading-[21px] text-ink/70">
          {form.sentBody}
        </p>
        <a
          href={path}
          className="mt-7 rounded-full border border-ink/25 px-7 py-2.5 text-[12.5px] text-ink transition-colors hover:border-ink"
        >
          {form.sentAgain}
        </a>
      </div>
    );
  }

  return (
    <form
      action={action}
      onInput={onFirstInput}
      className="grid w-full content-start gap-x-4 gap-y-3 self-start sm:grid-cols-2"
      noValidate
    >
      {/* Context the action cannot work out for itself. */}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="path" value={path} />
      {programme ? (
        <input type="hidden" name="programme" value={programme} />
      ) : null}
      <input type="hidden" name="t" value={token} />

      {/* Invisible to readers and to screen readers; only bots fill it in. */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label={form.name}
        name="name"
        placeholder={form.namePlaceholder}
        required
        error={errors?.name && form.errors[errors.name]}
      />
      <Field
        label={form.phone}
        name="phone"
        type="tel"
        placeholder={form.phonePlaceholder}
        required
        error={errors?.phone && form.errors[errors.phone]}
      />
      <Field
        label={form.email}
        name="email"
        type="email"
        placeholder={form.emailPlaceholder}
        required
        className="sm:col-span-2"
        error={errors?.email && form.errors[errors.email]}
      />

      <div className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] text-ink/70">
          {form.enquiryAbout} <span className="text-gold">*</span>
        </span>
        <SelectMenu
          label={form.enquiryAbout}
          name="enquiryType"
          required
          value={enquiryType}
          onChange={(v) => setEnquiryType(v as EnquiryType)}
          options={[...enquiryTypes]}
          format={(v) => form.types[v as EnquiryType]}
          triggerClassName="rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink focus-visible:border-gold"
        />
      </div>

      <Field
        label={form.subject}
        name="subject"
        placeholder={form.subjectPlaceholder}
        defaultValue={defaultSubject}
        required
        className="sm:col-span-2"
        error={errors?.subject && form.errors[errors.subject]}
      />

      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] text-ink/70">
          {form.message} <span className="text-gold">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={form.messagePlaceholder}
          aria-invalid={errors?.message ? true : undefined}
          className="w-full resize-y rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold aria-invalid:border-red-700"
        />
        {errors?.message ? (
          <FieldError>{form.errors[errors.message]}</FieldError>
        ) : null}
      </label>

      <p className="text-[11px] leading-[17px] text-ink/60 sm:col-span-2">
        {form.consent}
      </p>

      {state.status === "failed" ? (
        <p
          role="alert"
          className="rounded-sm border border-red-800/30 bg-red-50 px-4 py-3 text-[12.5px] leading-[19px] text-red-900 sm:col-span-2"
        >
          {state.reason === "rate" ? form.errors.rate : form.errors.server}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-forest px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? form.submitting : form.submit}
        </button>
      </div>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 block text-[11.5px] leading-[17px] text-red-800">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  className = "",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  error?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-[12.5px] text-ink/70">
        {label} {required ? <span className="text-gold">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={error ? true : undefined}
        className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold aria-invalid:border-red-700"
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}
