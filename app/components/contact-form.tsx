"use client";

import { useState } from "react";
import { SelectMenu } from "./select-menu";

const ENQUIRY_TYPES = [
  "Turkish citizenship enquiry",
  "Türkiye property enquiry",
  "Caribbean CBI enquiry",
  "General enquiry",
];

type Status = "idle" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [enquiryType, setEnquiryType] = useState(ENQUIRY_TYPES[0]);

  // No backend is wired up yet — this confirms locally so the flow is
  // testable. Point `onSubmit` at the real endpoint when it exists.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center border border-ink/10 bg-white px-8 text-center">
        <h3 className="font-display text-[26px] text-ink">Thank You</h3>
        <p className="mt-3 max-w-[340px] text-[13px] leading-[21px] text-ink/70">
          Thank you for getting in touch. A member of the Multi Mulk team will
          reply shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 rounded-full border border-ink/25 px-7 py-2.5 text-[12.5px] text-ink transition-colors hover:border-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Name" name="name" placeholder="Insert your name" required />
      <Field
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="Phone Number"
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="myemail@email.com"
        required
        className="sm:col-span-2"
      />

      <div className="sm:col-span-2">
        <span className="mb-2 block text-[12.5px] text-ink/70">
          What is your enquiry about? <span className="text-gold">*</span>
        </span>
        <SelectMenu
          label="What is your enquiry about?"
          name="enquiryType"
          required
          value={enquiryType}
          onChange={setEnquiryType}
          options={ENQUIRY_TYPES}
          triggerClassName="rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink focus-visible:border-gold"
        />
      </div>

      <Field
        label="Subject"
        name="subject"
        placeholder="What would you like to enquire about?"
        required
        className="sm:col-span-2"
      />

      <label className="sm:col-span-2">
        <span className="mb-2 block text-[12.5px] text-ink/70">
          Message <span className="text-gold">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Type your message.."
          className="w-full resize-y rounded-sm border border-ink/15 bg-white px-4 py-3 text-[13.5px] text-ink outline-none placeholder:text-ink/35 focus:border-gold"
        />
      </label>

      <p className="text-[11px] leading-[17px] text-ink/60 sm:col-span-2">
        By submitting this form, you consent to us contacting you regarding your
        enquiry. See our Privacy Policy for details on how we handle your data.
      </p>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-full bg-forest px-9 py-3.5 text-[13px] text-cream transition-colors hover:bg-forest-deep"
        >
          Send Enquiry
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
