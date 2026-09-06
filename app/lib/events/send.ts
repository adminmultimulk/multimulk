/**
 * Sending a reminder, and writing down that it was sent.
 *
 * Every path into this module records an `EventReminder` row — including the
 * failures, especially the failures. A reminder campaign is only trustworthy
 * if "who have we not reached?" has an answer, and a send that throws without
 * leaving a trace is indistinguishable from one that never ran.
 *
 * Two channels, and they are not symmetrical. Email is sent from here.
 * WhatsApp is not: see `markWhatsappSent`.
 */

import "server-only";
import { createHash } from "node:crypto";
import { prisma } from "@/app/lib/db";
import {
  ResendError,
  resendConfigured,
  sendResendEmail,
} from "@/app/lib/email/resend";
import { EVENT, REPLY_TO } from "./config";
import {
  emailHtml,
  emailText,
  subjectFor,
  type VisitorForMessage,
} from "./message";

/** Whether the email channel can send at all. */
export const reminderEmailConfigured = resendConfigured;

export type SendableVisitor = VisitorForMessage & {
  id: string;
  email: string | null;
};

export type SendOutcome = {
  visitorId: string;
  name: string;
  ok: boolean;
  /** Why it did not go, in words that belong on screen rather than in a log. */
  reason?: string;
};

/** Who pressed the button, or nobody when the scheduled run did. */
export type Actor = { id: string; name: string } | null;

/**
 * Makes a resend of the same reminder safe.
 *
 * Keyed on the visitor and the day they are being reminded about, not on the
 * moment of sending: pressing "Send" twice within the day is the mistake this
 * exists to absorb, and Resend replays its first response for 24 hours rather
 * than delivering a second copy. A genuinely new reminder — the visitor moved
 * from Tuesday to Wednesday — has a different day in the key and goes out.
 */
function idempotencyKey(visitor: SendableVisitor): string {
  const day =
    visitor.visitDate?.toISOString().slice(0, 10) ?? visitor.visitDateRaw;
  const digest = createHash("sha256")
    .update(`${EVENT.key} ${visitor.id} ${day}`)
    .digest("hex");
  return `event-reminder/${digest}`;
}

/**
 * One email, one log row.
 *
 * Never throws for an ordinary failure — a batch of fifty must not stop at the
 * one address with a typo in it — so the outcome is returned instead and the
 * caller reports it.
 */
export async function sendEmailReminder(
  visitor: SendableVisitor,
  actor: Actor,
  options: { automatic?: boolean } = {},
): Promise<SendOutcome> {
  const base = { visitorId: visitor.id, name: visitor.name };

  if (!visitor.email) {
    return { ...base, ok: false, reason: "No email address on file." };
  }
  if (!reminderEmailConfigured) {
    return {
      ...base,
      ok: false,
      reason:
        "Resend is not configured — set RESEND_API_KEY and LEAD_EMAIL_FROM.",
    };
  }

  const subject = subjectFor(visitor);

  try {
    const messageId = await sendResendEmail({
      to: [visitor.email],
      // The message asks them to reply; this is where that lands.
      replyTo: REPLY_TO,
      subject,
      text: emailText(visitor),
      html: emailHtml(visitor),
      idempotencyKey: idempotencyKey(visitor),
    });

    await prisma.$transaction([
      prisma.eventReminder.create({
        data: {
          visitorId: visitor.id,
          channel: "EMAIL",
          status: "SENT",
          subject,
          detail: messageId,
          sentById: actor?.id ?? null,
          sentByName: actor?.name ?? null,
          automatic: options.automatic ?? false,
        },
      }),
      prisma.eventVisitor.update({
        where: { id: visitor.id },
        data: { emailSentAt: new Date() },
      }),
    ]);

    return { ...base, ok: true };
  } catch (error) {
    const reason =
      error instanceof ResendError || error instanceof Error
        ? error.message
        : "The email could not be sent.";

    // Best effort: if the log write fails too there is nothing further to do
    // but keep the outcome, which the caller is about to show on screen.
    await prisma.eventReminder
      .create({
        data: {
          visitorId: visitor.id,
          channel: "EMAIL",
          status: "FAILED",
          subject,
          detail: reason.slice(0, 500),
          sentById: actor?.id ?? null,
          sentByName: actor?.name ?? null,
          automatic: options.automatic ?? false,
        },
      })
      .catch((cause) =>
        console.error("[events] could not log a failed send", cause),
      );

    return { ...base, ok: false, reason };
  }
}

/**
 * Records that a WhatsApp reminder went out.
 *
 * WhatsApp is sent by a person, not by this server: the dashboard opens
 * `wa.me` with the message already composed and the human presses send. So
 * there is nothing here to await — only the fact to write down, from the same
 * click that opened the link, so that the report counts WhatsApp the way it
 * counts email and "not yet contacted" stays true.
 *
 * That makes the WhatsApp figure a record of intent rather than a delivery
 * receipt, and the report says so rather than implying a confirmation it does
 * not have.
 */
export async function markWhatsappSent(
  visitorId: string,
  actor: Actor,
): Promise<void> {
  const visitor = await prisma.eventVisitor.findUnique({
    where: { id: visitorId },
    select: { id: true, phone: true },
  });
  if (!visitor) return;

  await prisma.$transaction([
    prisma.eventReminder.create({
      data: {
        visitorId: visitor.id,
        channel: "WHATSAPP",
        status: "SENT",
        subject: "WhatsApp reminder",
        detail: visitor.phone ? `wa.me/${visitor.phone}` : null,
        sentById: actor?.id ?? null,
        sentByName: actor?.name ?? null,
      },
    }),
    prisma.eventVisitor.update({
      where: { id: visitor.id },
      data: { whatsappSentAt: new Date() },
    }),
  ]);
}

/**
 * Everyone whose reminder is due and who has not had one.
 *
 * `remindAt` in the past and `emailSentAt` unset. Cancellations are excluded —
 * emailing somebody who has already pulled out is the one send that costs
 * something — and a visitor with no `remindAt` is deliberately not swept up
 * here: their date could not be read, and the dashboard asks a person to
 * decide rather than picking a day on their behalf.
 */
export async function dueForEmail(now: Date = new Date(), limit = 200) {
  return prisma.eventVisitor.findMany({
    where: {
      event: EVENT.key,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      emailSentAt: null,
      email: { not: null },
      remindAt: { not: null, lte: now },
    },
    orderBy: { remindAt: "asc" },
    take: limit,
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
}

/**
 * Sends to everyone due, one at a time.
 *
 * Sequential rather than `Promise.all`: Resend rate-limits, a list of fifty is
 * over in a few seconds either way, and a burst that trips the limit turns a
 * clean run into a page of 429s to work through by hand.
 */
export async function sendDueEmailReminders(
  actor: Actor,
  options: { automatic?: boolean; now?: Date } = {},
): Promise<SendOutcome[]> {
  const visitors = await dueForEmail(options.now ?? new Date());
  const outcomes: SendOutcome[] = [];
  for (const visitor of visitors) {
    outcomes.push(await sendEmailReminder(visitor, actor, options));
  }
  return outcomes;
}
