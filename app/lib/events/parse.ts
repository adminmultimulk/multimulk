/**
 * Turning what the sales team typed into something a schedule can be built on.
 *
 * The source is a spreadsheet filled in by hand over three weeks, so every
 * field arrives in several shapes: "7 Sep 2026" and "7 or 8 Sep" in the date
 * column, "Morning" and "1800 hrs" and "3PM" in the time column, phone numbers
 * that Excel has helpfully turned into `9.71562415166E11`. Nothing here
 * rejects a row — a visitor with an unreadable date is still a visitor, and
 * the dashboard shows them as needing a decision. Rejecting would lose them.
 */

import { DUBAI_OFFSET_HOURS, LEAD_HOURS, SLOT_START_HOUR } from "./config";

export type Slot = "MORNING" | "AFTERNOON" | "EVENING" | "UNSPECIFIED";
export type Status =
  | "AWAITING"
  | "CONFIRMED"
  | "CANCELLED"
  | "ATTENDED"
  | "NO_SHOW";

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * A calendar day as midnight UTC.
 *
 * Stored as UTC midnight rather than as a Dubai instant because it is a *day*,
 * not a moment: "8 September" is the same day whichever timezone the person
 * reading the dashboard is in, and the actual instant a reminder fires is
 * `remindAt`, which is computed separately and does carry a timezone.
 *
 * `"7 or 8 Sep"` returns null on purpose — guessing which of two days somebody
 * meant is exactly the mistake that sends a reminder on the wrong morning.
 */
export function parseVisitDate(
  raw: string,
  fallbackYear: number,
): Date | null {
  const value = raw.trim();
  if (!value) return null;
  // Two day numbers before the month means the visitor gave two options.
  if (/\d\s*(?:or|\/|&|-|–)\s*\d/i.test(value)) return null;

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));

  const named = value.match(/(\d{1,2})\s*(?:st|nd|rd|th)?\s*([A-Za-z]{3,})\.?\s*(\d{4})?/);
  if (named) {
    const month = MONTHS[named[2].slice(0, 3).toLowerCase()];
    if (month === undefined) return null;
    const day = Number(named[1]);
    if (day < 1 || day > 31) return null;
    return new Date(Date.UTC(named[3] ? Number(named[3]) : fallbackYear, month, day));
  }

  return null;
}

/**
 * Which half of the day, from anything the column might hold.
 *
 * A clock time wins over a word — "1800 hrs" is an evening appointment however
 * it is spelled — and the cut-offs are the ones the stand actually works to:
 * before noon is the morning, up to five is the afternoon, after that is the
 * evening push before the hall closes at six.
 */
export function parseSlot(raw: string): Slot {
  const value = raw.trim().toLowerCase();
  if (!value) return "UNSPECIFIED";

  const hour = parseHour(value);
  if (hour !== null) {
    if (hour < 12) return "MORNING";
    if (hour < 17) return "AFTERNOON";
    return "EVENING";
  }

  if (/morning|am\b/.test(value)) return "MORNING";
  if (/after ?noon|midday|noon/.test(value)) return "AFTERNOON";
  if (/evening|night|pm\b/.test(value)) return "EVENING";
  return "UNSPECIFIED";
}

/** The hour of day in a free-text time, or null if there is not one. */
function parseHour(value: string): number | null {
  // "1800 hrs", "1400hrs"
  const military = value.match(/\b([01]?\d|2[0-3])([0-5]\d)\s*(?:hrs?|hours?)\b/);
  if (military) return Number(military[1]);

  // "3PM", "10 AM", "2:00 pm"
  const clock = value.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (clock) {
    let hour = Number(clock[1]) % 12;
    if (clock[3] === "pm") hour += 12;
    return hour;
  }

  // Bare "14:00"
  const bare = value.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (bare) return Number(bare[1]);

  return null;
}

/** The window a reminder may land in, in Dubai time. */
const EARLIEST_SEND_HOUR = 8;
const LATEST_SEND_HOUR = 20;

/**
 * The exact instant the reminder should go out.
 *
 * The visit day plus the slot's starting hour *in Dubai*, less the lead time.
 * A visitor who named a clock time gets that hour rather than the slot's, so
 * the one person booked for six in the evening is not reminded on the same
 * schedule as the ten o'clock crowd.
 *
 * Then clamped into civil hours, which is not a detail: an appointment at six
 * in the evening less a twenty-hour lead is ten o'clock the night before, and
 * an unprompted email from a company at ten at night is the kind of reminder
 * people remember for the wrong reason. The clamp only ever moves a send
 * *earlier* within its own day, so it can never push one past the appointment
 * it is reminding about.
 */
export function computeRemindAt(
  visitDate: Date | null,
  slot: Slot,
  preferredTimeRaw: string,
  leadHours: number = LEAD_HOURS,
): Date | null {
  if (!visitDate) return null;

  const hour = parseHour(preferredTimeRaw.trim().toLowerCase()) ?? SLOT_START_HOUR[slot];
  const slotStartUtcMs =
    visitDate.getTime() + (hour - DUBAI_OFFSET_HOURS) * 3_600_000;
  const remindAt = new Date(slotStartUtcMs - leadHours * 3_600_000);

  // The hour of the send in Dubai, read off the UTC instant rather than via a
  // formatter — the offset is fixed, so the arithmetic is exact and there is
  // no locale in the middle of it.
  const dubai = new Date(remindAt.getTime() + DUBAI_OFFSET_HOURS * 3_600_000);
  const sendHour = dubai.getUTCHours();
  if (sendHour >= EARLIEST_SEND_HOUR && sendHour < LATEST_SEND_HOUR) return remindAt;

  const clamped =
    sendHour < EARLIEST_SEND_HOUR ? EARLIEST_SEND_HOUR : LATEST_SEND_HOUR;
  dubai.setUTCHours(clamped, 0, 0, 0);
  return new Date(dubai.getTime() - DUBAI_OFFSET_HOURS * 3_600_000);
}

/** The Remarks column, which only ever says one of two things — or nothing. */
export function parseStatus(raw: string): Status {
  const value = raw.trim().toLowerCase();
  if (!value) return "AWAITING";
  if (/cancel|declin|not coming/.test(value)) return "CANCELLED";
  if (/no.?show/.test(value)) return "NO_SHOW";
  if (/attend|visited|came/.test(value)) return "ATTENDED";
  if (/confirm|yes\b/.test(value)) return "CONFIRMED";
  return "AWAITING";
}

/**
 * Digits only, no leading plus — the shape `wa.me` wants.
 *
 * Excel stores a long number as a float and writes it back as
 * `9.71562415166E11`, so that is undone first; without it every phone number
 * in the sheet imports as the literal string "9.7". A UAE number typed as
 * `0559488448` is given its country code, because the sheet is a Dubai team's
 * and a local number with no code is a local number.
 */
export function normalisePhone(raw: string, defaultCountry = "971"): string {
  let value = String(raw ?? "").trim();
  if (!value) return "";

  if (/^\d+(\.\d+)?[eE][+-]?\d+$/.test(value)) {
    const n = Number(value);
    if (Number.isFinite(n)) value = BigInt(Math.round(n)).toString();
  }

  let digits = value.replace(/[^\d]/g, "");
  // Fewer than seven digits is not a phone number anywhere — it is a column
  // that got mangled on the way out of the sheet, and importing it would put a
  // dead `wa.me` link in front of somebody about to press send.
  if (digits.length < 7) return "";

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = defaultCountry + digits.slice(1);
  // A bare local number: 9 digits for the UAE, e.g. 559488448.
  else if (digits.length === 9) digits = defaultCountry + digits;

  return digits;
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normaliseEmail(raw: string): string {
  const value = String(raw ?? "").trim().toLowerCase();
  return EMAIL.test(value) ? value : "";
}

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/**
 * What makes two rows the same person.
 *
 * The email first, because that is what a reminder is sent to and two rows
 * sharing one would email somebody twice. Then the phone. Only then the name,
 * which is the weakest of the three — the sheet has both "Mohammed Islam" and
 * "Mohammed Ismail" — but a row with neither contact detail still has to import
 * without colliding with the next such row.
 */
export function dedupeKey(
  event: string,
  fields: { email?: string; phone?: string; name: string },
): string {
  if (fields.email) return `${event}:e:${fields.email}`;
  if (fields.phone) return `${event}:p:${fields.phone}`;
  return `${event}:n:${fields.name.trim().toLowerCase().replace(/\s+/g, " ")}`;
}
