"use client";

import { useState } from "react";
import { useI18n } from "@/app/lib/i18n/context";
import { SelectMenu } from "./select-menu";

/** Option keys; the labels beside them come from the dictionary. */
const ENQUIRY_TYPES = [
  "turkishCitizenship",
  "turkiyeProperty",
  "caribbeanCbi",
  "general",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
type Status = "idle" | "sent";

/**
 * `defaultEnquiry` lets a page that already knows what the reader is here for
 * — a citizenship programme page, say — open the form on that option rather
 * than making them re-state it. Unset, it opens where /contact-us does.
 */
export function ContactForm({
  defaultEnquiry = ENQUIRY_TYPES[0],
}: {
  defaultEnquiry?: EnquiryType;
} = {}) {
  const { t } = useI18n();
  const form = t.contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(defaultEnquiry);

  // No backend is wired up yet — this confirms locally so the flow is
  // testable. Point `onSubmit` at the real endpoint when it exists.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center border border-ink/10 bg-white px-8 text-center">
        <h3 className="font-display text-[26px] text-ink">
          {form.sentHeading}
        </h3>
        <p className="mt-3 max-w-[340px] text-[13px] leading-[21px] text-ink/70">
          {form.sentBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 rounded-full border border-ink/25 px-7 py-2.5 text-[12.5px] text-ink transition-colors hover:border-ink"
        >
          {form.sentAgain}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field
        label={form.name}
        name="name"
        placeholder={form.namePlaceholder}
        required
      />
      <Field
        label={form.phone}
        name="phone"
        type="tel"
        placeholder={form.phonePlaceholder}
        required
      />
      <Field
        label={form.email}
        name="email"
        type="email"
        placeholder={form.emailPlaceholder}
        required
        className="sm:col-span-2"
      />

      <div className="sm:col-span-2">
        <span className="mb-2 block text-[12.5px] text-ink/70">
          {form.enquiryAbout} <span className="text-gold">*</span>
        </span>
        <SelectMenu
          label={form.enquiryAbout}
          name="enquiryType"
          required
          value={enquiryType}
          onChange={(v) => setEnquiryType(v as EnquiryType)}
          options={ENQUIRY_TYPES}
          format={(v) => form.types[v as EnquiryType]}
          triggerClassName="rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink focus-visible:border-gold"
        />
      </div>

      <Field
        label={form.subject}
        name="subject"
        placeholder={form.subjectPlaceholder}
        required
        className="sm:col-span-2"
      />

      <label className="sm:col-span-2">
        <span className="mb-2 block text-[12.5px] text-ink/70">
          {form.message} <span className="text-gold">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={form.messagePlaceholder}
          className="w-full resize-y rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold"
        />
      </label>

      <p className="text-[11px] leading-[17px] text-ink/60 sm:col-span-2">
        {form.consent}
      </p>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-forest px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep"
        >
          {form.submit}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-[12.5px] text-ink/70">
        {label} {required ? <span className="text-gold">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold"
      />
    </label>
  );
}
