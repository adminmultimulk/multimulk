/**
 * The shape of a contact enquiry, and the rules it has to satisfy.
 *
 * Deliberately pure — no `"use server"`, no imports beyond the locale list —
 * so the client form and the Server Action can share one definition of what a
 * valid lead is. `app/lib/i18n/config.ts` is safe to pull in here for the same
 * reason it is safe in the proxy: it carries no dictionary and no `server-only`.
 */

import { isLocale, type Locale } from "../i18n/config";

/** Option keys; the labels beside them come from the dictionary. */
export const enquiryTypes = [
  "turkishCitizenship",
  "turkiyeProperty",
  "caribbeanCbi",
  "general",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number];

export function isEnquiryType(value: unknown): value is EnquiryType {
  return (enquiryTypes as readonly unknown[]).includes(value);
}

export const leadFields = [
  "name",
  "phone",
  "email",
  "enquiryType",
  "subject",
  "message",
] as const;

export type LeadField = (typeof leadFields)[number];

/**
 * Errors travel as *keys*, never as sentences.
 *
 * The Server Action cannot read the dictionary — `next/root-params` is not
 * available to Server Functions, so it has no way to know which of the seven
 * languages to apologise in. The client already holds the dictionary, so it
 * does the wording and the action stays a few hundred bytes.
 */
export type LeadErrorKey = "required" | "email" | "phone" | "tooLong";

export type LeadErrors = Partial<Record<LeadField, LeadErrorKey>>;

export type Lead = {
  name: string;
  phone: string;
  email: string;
  enquiryType: EnquiryType;
  subject: string;
  message: string;
  locale: Locale;
  /** Where the enquiry was raised, so sales can see what was being read. */
  source: { path: string; programme?: string };
  submittedAt: string;
};

/** Per-field ceilings. Generous for humans, ungenerous for payload stuffing. */
const limits: Record<LeadField, number> = {
  name: 120,
  phone: 40,
  email: 254, // RFC 5321 maximum
  enquiryType: 40,
  subject: 200,
  message: 5000,
};

/**
 * Deliberately permissive. A pattern strict enough to be interesting rejects
 * real addresses, and the only thing that actually proves an address works is
 * sending to it — so this catches typos, not exotica.
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Multi Mulk's enquiries arrive from the Gulf, Türkiye, Pakistan and Europe in
 * every local convention, so this checks only that enough digits are present
 * to dial. Punctuation, spacing and country prefixes are left alone.
 */
function looksDialable(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function text(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

export type LeadValidation =
  | { ok: true; lead: Omit<Lead, "submittedAt"> }
  | { ok: false; errors: LeadErrors };

/**
 * Validates a submission. Every field is checked before returning, so the
 * reader sees everything that needs fixing at once rather than one error per
 * round trip.
 */
export function validateLead(raw: Record<string, unknown>): LeadValidation {
  const errors: LeadErrors = {};

  const name = text(raw.name);
  const phone = text(raw.phone);
  const email = text(raw.email);
  const subject = text(raw.subject);
  const message = text(raw.message);
  const enquiryType = text(raw.enquiryType);

  if (!name) errors.name = "required";
  else if (name.length > limits.name) errors.name = "tooLong";

  if (!phone) errors.phone = "required";
  else if (phone.length > limits.phone) errors.phone = "tooLong";
  else if (!looksDialable(phone)) errors.phone = "phone";

  if (!email) errors.email = "required";
  else if (email.length > limits.email) errors.email = "tooLong";
  else if (!emailPattern.test(email)) errors.email = "email";

  if (!subject) errors.subject = "required";
  else if (subject.length > limits.subject) errors.subject = "tooLong";

  if (!message) errors.message = "required";
  else if (message.length > limits.message) errors.message = "tooLong";

  if (!isEnquiryType(enquiryType)) errors.enquiryType = "required";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // The hidden locale field comes from the rendering page, but it arrives over
  // the wire like everything else, so it is re-checked rather than trusted.
  const submitted = text(raw.locale);
  const locale: Locale = isLocale(submitted) ? submitted : "en";

  const programme = text(raw.programme);

  return {
    ok: true,
    lead: {
      name,
      phone,
      email,
      enquiryType: enquiryType as EnquiryType,
      subject,
      message,
      locale,
      source: {
        path: text(raw.path) || "/",
        ...(programme ? { programme } : {}),
      },
    },
  };
}
