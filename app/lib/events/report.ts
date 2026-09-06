/**
 * The numbers behind the report page.
 *
 * Kept out of the page so the shape of the report is a thing that can be read
 * in one screen and argued with. What it is built to answer, in order: who is
 * coming and when, who has been told, and who has been missed. The third is
 * the one that matters on the morning of the show, so it is not derived from
 * the first two by subtraction — it is queried directly, which is what makes a
 * visitor with a broken email address show up rather than quietly cancel out.
 */

import "server-only";
import { prisma } from "@/app/lib/db";
import { EVENT } from "./config";

export type DaySlotCount = {
  /** `YYYY-MM-DD`, or null for the visitors whose day could not be read. */
  day: string | null;
  morning: number;
  afternoon: number;
  evening: number;
  unspecified: number;
  total: number;
};

export type EventReport = Awaited<ReturnType<typeof buildReport>>;

const SLOT_KEYS = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  EVENING: "evening",
  UNSPECIFIED: "unspecified",
} as const;

export async function buildReport(now: Date = new Date()) {
  const where = { event: EVENT.key };

  const [visitors, byStatus, byList, reminderRows, recent] = await Promise.all([
    prisma.eventVisitor.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        list: true,
        visitDate: true,
        visitDateRaw: true,
        slot: true,
        preferredTimeRaw: true,
        status: true,
        remindAt: true,
        emailSentAt: true,
        whatsappSentAt: true,
      },
      orderBy: [{ visitDate: "asc" }, { name: "asc" }],
    }),
    prisma.eventVisitor.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
    prisma.eventVisitor.groupBy({
      by: ["list"],
      where,
      _count: { _all: true },
    }),
    prisma.eventReminder.groupBy({
      by: ["channel", "status"],
      _count: { _all: true },
    }),
    prisma.eventReminder.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        channel: true,
        status: true,
        detail: true,
        sentByName: true,
        automatic: true,
        createdAt: true,
        visitor: { select: { id: true, name: true } },
      },
    }),
  ]);

  // One pass over the list rather than a query per bucket. Fifty rows; the
  // round trips would cost more than the loop does.
  const grid = new Map<string, DaySlotCount>();
  let emailed = 0;
  let whatsapped = 0;
  let bothChannels = 0;
  let untouched = 0;
  let noEmail = 0;
  let noPhone = 0;
  let unschedulable = 0;

  const dueNow: typeof visitors = [];
  const missed: typeof visitors = [];
  const needsDecision: typeof visitors = [];

  for (const visitor of visitors) {
    const day = visitor.visitDate
      ? visitor.visitDate.toISOString().slice(0, 10)
      : null;
    const key = day ?? "unknown";
    const row =
      grid.get(key) ??
      { day, morning: 0, afternoon: 0, evening: 0, unspecified: 0, total: 0 };
    row[SLOT_KEYS[visitor.slot]] += 1;
    row.total += 1;
    grid.set(key, row);

    const live = visitor.status !== "CANCELLED" && visitor.status !== "NO_SHOW";

    if (visitor.emailSentAt) emailed += 1;
    if (visitor.whatsappSentAt) whatsapped += 1;
    if (visitor.emailSentAt && visitor.whatsappSentAt) bothChannels += 1;
    if (!visitor.emailSentAt && !visitor.whatsappSentAt && live) {
      untouched += 1;
      missed.push(visitor);
    }
    if (!visitor.email) noEmail += 1;
    if (!visitor.phone) noPhone += 1;

    if (!visitor.remindAt && live) {
      unschedulable += 1;
      needsDecision.push(visitor);
    }
    if (
      live &&
      visitor.email &&
      !visitor.emailSentAt &&
      visitor.remindAt &&
      visitor.remindAt <= now
    ) {
      dueNow.push(visitor);
    }
  }

  // Show days in order, with the unreadable dates last rather than sorted as
  // the string "unknown" — they are the exceptions and belong at the bottom.
  const schedule = [...grid.values()].sort((a, b) => {
    if (a.day === b.day) return 0;
    if (a.day === null) return 1;
    if (b.day === null) return -1;
    return a.day < b.day ? -1 : 1;
  });

  const reminders = {
    emailSent: countOf(reminderRows, "EMAIL", "SENT"),
    emailFailed: countOf(reminderRows, "EMAIL", "FAILED"),
    whatsappSent: countOf(reminderRows, "WHATSAPP", "SENT"),
  };

  return {
    generatedAt: now,
    total: visitors.length,
    byList: Object.fromEntries(
      byList.map((row) => [row.list, row._count._all]),
    ) as Record<string, number>,
    byStatus: Object.fromEntries(
      byStatus.map((row) => [row.status, row._count._all]),
    ) as Record<string, number>,
    schedule,
    coverage: {
      emailed,
      whatsapped,
      bothChannels,
      untouched,
      noEmail,
      noPhone,
      unschedulable,
    },
    reminders,
    dueNow,
    missed,
    needsDecision,
    recent,
    visitors,
  };
}

function countOf(
  rows: { channel: string; status: string; _count: { _all: number } }[],
  channel: string,
  status: string,
): number {
  return (
    rows.find((row) => row.channel === channel && row.status === status)?._count
      ._all ?? 0
  );
}

/**
 * The report as a CSV, for the version of "send me the report" that means a
 * spreadsheet. The list came out of Excel; it should be able to go back.
 */
export function reportCsv(report: EventReport): string {
  const header = [
    "Name",
    "List",
    "Visit date",
    "Preferred time",
    "Slot",
    "Phone",
    "Email",
    "Status",
    "Reminder due",
    "Email sent",
    "WhatsApp sent",
  ];

  const lines = report.visitors.map((visitor) =>
    [
      visitor.name,
      visitor.list,
      visitor.visitDate?.toISOString().slice(0, 10) ?? visitor.visitDateRaw,
      visitor.preferredTimeRaw,
      visitor.slot,
      visitor.phone ?? "",
      visitor.email ?? "",
      visitor.status,
      visitor.remindAt?.toISOString() ?? "",
      visitor.emailSentAt?.toISOString() ?? "",
      visitor.whatsappSentAt?.toISOString() ?? "",
    ]
      .map(csvCell)
      .join(","),
  );

  return [header.join(","), ...lines].join("\r\n");
}

/**
 * Quotes a cell, and defuses one that Excel would otherwise run as a formula.
 * A phone number is safe; a name somebody typed starting with `=` is not, and
 * this file is opened in Excel by definition.
 */
function csvCell(value: string): string {
  const text = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${text.replace(/"/g, '""')}"`;
}
