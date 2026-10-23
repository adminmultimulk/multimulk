import "server-only";
import type { Prisma } from "@prisma/client";
import en from "@/app/lib/i18n/dictionaries/en";
import { isLocale, localeNames } from "@/app/lib/i18n/config";
import { isEnquiryType, leadKinds } from "@/app/lib/leads/schema";

/**
 * The Leads page and its CSV share one reading of the query string, so the
 * download is always exactly the list on screen.
 */
export type LeadFilters = { kind?: string; q?: string };

export function leadFilters(query: Record<string, string | string[] | undefined>): LeadFilters {
  const one = (value: string | string[] | undefined) => {
    const first = Array.isArray(value) ? value[0] : value;
    return first?.trim() || undefined;
  };
  const kind = one(query.kind);
  return { kind: isEnquiryType(kind) ? kind : undefined, q: one(query.q) };
}

export function leadWhere(filters: LeadFilters): Prisma.LeadWhereInput {
  const conditions: Prisma.LeadWhereInput[] = [];
  if (filters.kind) conditions.push({ kind: filters.kind });
  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" } as const;
    // A number is searched without its spaces, since it is stored as E.164.
    const digits = filters.q.replace(/[\s()-]/g, "");
    conditions.push({
      OR: [
        { name: contains },
        { email: contains },
        { subject: contains },
        ...(digits ? [{ phone: { contains: digits } }] : []),
      ],
    });
  }
  return conditions.length ? { AND: conditions } : {};
}

export const kindOptions = leadKinds.map((kind) => ({
  value: kind,
  label: en.contact.form.types[kind],
}));

export function kindLabel(kind: string): string {
  return isEnquiryType(kind) ? en.contact.form.types[kind] : kind;
}

export function languageLabel(locale: string): string {
  return isLocale(locale) ? localeNames[locale].english : locale;
}

/** "23 Oct 2026, 14:48" in Istanbul, where the team reads it. */
export function leadTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

type CsvLead = {
  submittedAt: Date;
  kind: string;
  name: string;
  phone: string;
  email: string;
  locale: string;
  subject: string;
  message: string;
  path: string;
  bitrixId: string | null;
};

export function leadsCsv(leads: CsvLead[]): string {
  const header = ["Received (UTC)", "Form", "Name", "Phone", "Email", "Language", "Subject", "Message", "Page", "Bitrix ID"];
  const rows = leads.map((lead) => [
    lead.submittedAt.toISOString().slice(0, 16).replace("T", " "),
    kindLabel(lead.kind),
    lead.name,
    lead.phone,
    lead.email,
    languageLabel(lead.locale),
    lead.subject,
    lead.message,
    lead.path,
    lead.bitrixId ?? "",
  ]);
  // A byte-order mark, or Excel opens the Arabic, Urdu and Persian names as
  // mojibake.
  return "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

/**
 * Quotes a cell, and defuses one Excel would run as a formula. A phone number
 * — a plus and digits — is left as it is, so it stays a number to dial.
 */
function csvCell(value: string): string {
  const risky = /^[=@]/.test(value) || (/^[+-]/.test(value) && !/^\+?\d+$/.test(value));
  const text = risky ? `'${value}` : value;
  return `"${text.replace(/"/g, '""')}"`;
}
