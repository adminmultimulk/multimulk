"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { EVENT } from "@/app/lib/events/config";
import { parseVisitorPaste } from "@/app/lib/events/import";
import {
  computeRemindAt,
  isEmail,
  normalisePhone,
  parseSlot,
  parseVisitDate,
} from "@/app/lib/events/parse";
import {
  markWhatsappSent,
  sendDueEmailReminders,
  sendEmailReminder,
} from "@/app/lib/events/send";
import { requireSuperadmin, type ActionState } from "./guard";
import { field } from "./validate";

/**
 * The visitor list and its reminders.
 *
 * Superadmin only, and not because the data is secret: this is fifty people's
 * phone numbers and a button that emails all of them at once. The blast radius
 * of a misclick is what decides the gate, not the sensitivity of the row.
 */

function changed() {
  revalidatePath("/admin/events");
  revalidatePath("/admin/events/report");
  revalidatePath("/admin");
}

/** The year to assume when the sheet writes "8 Sep" with no year on it. */
const FALLBACK_YEAR = Number(EVENT.days[0].slice(0, 4));

/**
 * Imports a pasted block of spreadsheet rows.
 *
 * Repeatable by design. A row that is already here has its schedule and
 * contact details refreshed and keeps everything a person has since done to it
 * — the status they set at the stand, the reminder already sent — because the
 * sheet is the source for *when they are coming* and the dashboard is the
 * source for *what has happened since*. Merging the other way round would undo
 * a morning's work at the stand with one paste.
 */
export async function importVisitors(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireSuperadmin();

  const text = String(form.get("paste") ?? "");
  const list = field(form, "list") === "Clients" ? "Clients" : "Visitors";

  if (!text.trim()) {
    return { fieldErrors: { paste: "Paste the rows from the spreadsheet first." } };
  }

  const { rows, skipped } = parseVisitorPaste(text, {
    event: EVENT.key,
    list,
    fallbackYear: FALLBACK_YEAR,
  });

  if (rows.length === 0) {
    return {
      error:
        skipped.length > 0
          ? `Nothing could be imported. ${skipped[0].reason}`
          : "No rows were found in that paste. Copy the cells from the sheet, including the name, date, time, phone and email columns.",
    };
  }

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const existing = await prisma.eventVisitor.findUnique({
      where: { dedupeKey: row.dedupeKey },
      select: { id: true },
    });

    const shared = {
      event: EVENT.key,
      list,
      serial: row.serial,
      name: row.name,
      email: row.email || null,
      phone: row.phone || null,
      visitDate: row.visitDate,
      visitDateRaw: row.visitDateRaw,
      slot: row.slot,
      preferredTimeRaw: row.preferredTimeRaw,
      remindAt: row.remindAt,
      notes: row.notes || null,
    };

    if (existing) {
      // The status is not in `shared`: it came from the Remarks column on the
      // first import and belongs to whoever has touched the row since.
      await prisma.eventVisitor.update({ where: { id: existing.id }, data: shared });
      updated += 1;
    } else {
      await prisma.eventVisitor.create({
        data: { ...shared, status: row.status, dedupeKey: row.dedupeKey },
      });
      created += 1;
    }
  }

  changed();

  const parts = [
    created ? `${created} added` : "",
    updated ? `${updated} updated` : "",
  ].filter(Boolean);

  return {
    success:
      `${parts.join(", ")}.` +
      (skipped.length
        ? ` ${skipped.length} row${skipped.length === 1 ? "" : "s"} skipped — ${skipped
            .slice(0, 3)
            .map((row) => `line ${row.line}: ${row.reason}`)
            .join("; ")}${skipped.length > 3 ? "; …" : ""}`
        : ""),
  };
}

/** Edits one visitor by hand — the corrected email, the moved appointment. */
export async function saveVisitor(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireSuperadmin();

  const id = field(form, "id");
  if (!id) return { error: "That visitor no longer exists." };

  const name = field(form, "name");
  const email = field(form, "email").toLowerCase();
  const phone = normalisePhone(field(form, "phone"));
  const visitDateRaw = field(form, "visitDate");
  const preferredTimeRaw = field(form, "preferredTime");
  const notes = field(form, "notes");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "A name is required.";
  if (email && !isEmail(email)) fieldErrors.email = "That is not an email address.";
  if (!email && !phone)
    fieldErrors.email =
      "An email address or a phone number is needed — otherwise there is no way to remind them.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const visitDate = parseVisitDate(visitDateRaw, FALLBACK_YEAR);
  const slot = parseSlot(preferredTimeRaw);

  await prisma.eventVisitor.update({
    where: { id },
    data: {
      name,
      email: email || null,
      phone: phone || null,
      visitDate,
      visitDateRaw,
      slot,
      preferredTimeRaw,
      remindAt: computeRemindAt(visitDate, slot, preferredTimeRaw),
      notes: notes || null,
    },
  });

  changed();
  return {
    success: visitDate
      ? `${name} saved. Reminder rescheduled.`
      : `${name} saved, but "${visitDateRaw}" is not a date the schedule can read — they will not be reminded automatically.`,
  };
}

const STATUSES = [
  "AWAITING",
  "CONFIRMED",
  "CANCELLED",
  "ATTENDED",
  "NO_SHOW",
] as const;

export async function setVisitorStatus(id: string, status: string): Promise<void> {
  await requireSuperadmin();

  const value = STATUSES.find((allowed) => allowed === status);
  if (!value) throw new Error("Not a status.");

  await prisma.eventVisitor.update({ where: { id }, data: { status: value } });
  changed();
}

/** Sends one reminder now, whether or not it was due. */
export async function sendOneReminder(id: string): Promise<void> {
  const admin = await requireSuperadmin();

  const visitor = await prisma.eventVisitor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      visitDate: true,
      visitDateRaw: true,
      slot: true,
      preferredTimeRaw: true,
    },
  });
  if (!visitor) return;

  const outcome = await sendEmailReminder(visitor, {
    id: admin.id,
    name: admin.name,
  });
  changed();

  // Thrown rather than returned: this one runs from a bound-argument button
  // with no state of its own, and a failure that showed nothing would read as
  // a reminder that went out.
  if (!outcome.ok) throw new Error(outcome.reason ?? "The reminder did not send.");
}

/**
 * Sends to everyone whose reminder is due.
 *
 * The summary is the point of the return value: "42 sent" is not the useful
 * half of the answer, the six that failed are, and they are named.
 */
export async function sendDueReminders(): Promise<ActionState> {
  // No parameters: there is nothing to read off the form, and `useActionState`
  // is happy to call an action that ignores the state and payload it passes.
  const admin = await requireSuperadmin();

  const outcomes = await sendDueEmailReminders({
    id: admin.id,
    name: admin.name,
  });
  changed();

  if (outcomes.length === 0)
    return { success: "Nobody is due a reminder right now." };

  const failed = outcomes.filter((outcome) => !outcome.ok);
  const sent = outcomes.length - failed.length;

  if (failed.length === 0)
    return { success: `${sent} reminder${sent === 1 ? "" : "s"} sent.` };

  return {
    error:
      `${sent} sent, ${failed.length} failed — ` +
      failed
        .slice(0, 5)
        .map((outcome) => `${outcome.name} (${outcome.reason})`)
        .join("; ") +
      (failed.length > 5 ? "; …" : ""),
  };
}

/** Records a WhatsApp message the person sending it has just opened. */
export async function logWhatsappSent(id: string): Promise<void> {
  const admin = await requireSuperadmin();
  await markWhatsappSent(id, { id: admin.id, name: admin.name });
  changed();
}

export async function deleteVisitor(id: string): Promise<void> {
  await requireSuperadmin();
  await prisma.eventReminder.deleteMany({ where: { visitorId: id } });
  await prisma.eventVisitor.delete({ where: { id } });
  changed();
}
