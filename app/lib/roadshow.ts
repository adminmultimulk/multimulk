/**
 * The Türkiye–Pakistan Property Roadshow: private meetings in Lahore,
 * Islamabad and Karachi, 11–15 November 2026.
 *
 * The facts live here rather than in the dictionaries because the landing
 * page, the thank-you page, the Server Action and the confirmation email all
 * read them, and a date that is right in three of the four is worse than
 * useless. The dictionaries hold only the words around them.
 *
 * Free of `server-only` and of any dictionary import: the registration form is
 * a Client Component and closes a city's option itself once its day is over.
 */

import { intlLocale, type Locale } from "./i18n/config";

export const roadshowCities = ["lahore", "islamabad", "karachi"] as const;
export type RoadshowCity = (typeof roadshowCities)[number];

export const roadshowSlots = ["morning", "afternoon", "evening"] as const;
export type RoadshowSlot = (typeof roadshowSlots)[number];

/**
 * Budget bands, keyed rather than labelled so the team reads them in English
 * whatever language the form was filled in. The first boundary is the Turkish
 * citizenship threshold in `programmes.ts`: a budget beneath it is a residency
 * or investment conversation, not a citizenship one.
 */
export const roadshowBudgets = [
  "under400k",
  "400kTo600k",
  "600kTo1m",
  "over1m",
] as const;
export type RoadshowBudget = (typeof roadshowBudgets)[number];

/** For the CRM and the team's email, which are always in English. */
export const budgetLabels: Record<RoadshowBudget, string> = {
  under400k: "Under $400,000",
  "400kTo600k": "$400,000–$600,000",
  "600kTo1m": "$600,000–$1,000,000",
  over1m: "Over $1,000,000",
};

export const cityNames: Record<RoadshowCity, string> = {
  lahore: "Lahore",
  islamabad: "Islamabad",
  karachi: "Karachi",
};

/** The meeting day in each city, in Pakistan time. */
export const roadshowDates: Record<RoadshowCity, string> = {
  lahore: "2026-11-11",
  islamabad: "2026-11-13",
  karachi: "2026-11-15",
};

/** Wall-clock hours in Pakistan. */
export const slotHours: Record<RoadshowSlot, { start: string; end: string }> = {
  morning: { start: "10:00", end: "13:00" },
  afternoon: { start: "13:00", end: "17:00" },
  evening: { start: "17:00", end: "20:00" },
};

/** Pakistan Standard Time is UTC+5 all year; there is no daylight saving. */
const PKT_OFFSET = "+05:00";
const PKT_ZONE = "Asia/Karachi";

export function isRoadshowCity(value: unknown): value is RoadshowCity {
  return (roadshowCities as readonly unknown[]).includes(value);
}

export function isRoadshowSlot(value: unknown): value is RoadshowSlot {
  return (roadshowSlots as readonly unknown[]).includes(value);
}

export function isRoadshowBudget(value: unknown): value is RoadshowBudget {
  return (roadshowBudgets as readonly unknown[]).includes(value);
}

export function slotStart(city: RoadshowCity, slot: RoadshowSlot): Date {
  return new Date(`${roadshowDates[city]}T${slotHours[slot].start}:00${PKT_OFFSET}`);
}

export function slotEnd(city: RoadshowCity, slot: RoadshowSlot): Date {
  return new Date(`${roadshowDates[city]}T${slotHours[slot].end}:00${PKT_OFFSET}`);
}

/**
 * A city takes bookings until its last meeting ends, so someone who sees the
 * ad on the morning of the Lahore day can still ask for an evening slot.
 */
export function cityOpen(city: RoadshowCity, now = new Date()): boolean {
  return now < slotEnd(city, "evening");
}

export function roadshowOpen(now = new Date()): boolean {
  return roadshowCities.some((city) => cityOpen(city, now));
}

/** "Wednesday, 11 November" in the reader's language, Latin digits. */
export function formatRoadshowDate(
  locale: Locale,
  city: RoadshowCity,
  options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" },
): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    ...options,
    timeZone: PKT_ZONE,
    numberingSystem: "latn",
  }).format(new Date(`${roadshowDates[city]}T12:00:00${PKT_OFFSET}`));
}

/** "10:00–13:00", as the slot is quoted in every language. */
export function slotRange(slot: RoadshowSlot): string {
  return `${slotHours[slot].start}–${slotHours[slot].end}`;
}

/**
 * Wraps a time range in a left-to-right isolate for display. Set inside an
 * Urdu, Arabic or Persian sentence, "10:00–20:00" is otherwise reordered by
 * the bidi algorithm into "20:00–10:00". Display only — the CRM gets the plain
 * text.
 */
export function isolateLtr(text: string): string {
  return `\u2066${text}\u2069`;
}

/** `20261111T050000Z`, the form both Google Calendar and iCalendar take. */
function calendarStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export type CalendarEntry = {
  title: string;
  details: string;
  location: string;
  city: RoadshowCity;
  slot: RoadshowSlot;
};

export function googleCalendarUrl(entry: CalendarEntry): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.title,
    dates: `${calendarStamp(slotStart(entry.city, entry.slot))}/${calendarStamp(slotEnd(entry.city, entry.slot))}`,
    details: entry.details,
    location: entry.location,
    ctz: PKT_ZONE,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/**
 * The same entry as an `.ics` data URI, for Apple and Outlook calendars.
 * Commas, semicolons and backslashes are escaped as RFC 5545 asks.
 */
export function icsDataUri(entry: CalendarEntry): string {
  const text = (value: string) => value.replace(/([\\;,])/g, "\\$1").replace(/\n/g, "\\n");
  const start = slotStart(entry.city, entry.slot);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Multi Mulk//Pakistan Roadshow 2026//EN",
    "BEGIN:VEVENT",
    `UID:roadshow-${entry.city}-${entry.slot}-2026@multimulk.com`,
    `DTSTAMP:${calendarStamp(start)}`,
    `DTSTART:${calendarStamp(start)}`,
    `DTEND:${calendarStamp(slotEnd(entry.city, entry.slot))}`,
    `SUMMARY:${text(entry.title)}`,
    `DESCRIPTION:${text(entry.details)}`,
    `LOCATION:${text(entry.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
