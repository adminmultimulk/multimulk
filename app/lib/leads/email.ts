/**
 * Email through Resend: the transport, and the enquiry as the team reads it.
 *
 * The team's copy is a *delivery* channel and not a notification: for an
 * advisory firm without a CRM the inbox is the system of record, so
 * `deliverLead` awaits it and a failure here is a failure the reader is told
 * about. See `./sink.ts`. The enquirer's own copy is the opposite — strictly
 * secondary — and lives in `./ack.ts`.
 *
 * Resend's REST API rather than the `resend` package, for the same reason
 * `sink.ts` and `notify.ts` post their own JSON: one `fetch` against a
 * documented endpoint carries less than a dependency would, and the whole
 * surface used here is a POST with a handful of fields.
 *
 * The team's email is written in English regardless of the language the
 * enquiry arrived in. It is read by the sales team, not by the enquirer — but
 * which language *they* wrote in decides who picks the enquiry up, so it is
 * stated near the top.
 */

import "server-only";
import { createHash } from "node:crypto";
import en from "../i18n/dictionaries/en";
import { localeNames } from "../i18n/config";
import { absoluteUrl } from "../site";
import type { Lead } from "./schema";

const ENDPOINT = "https://api.resend.com/emails";

/** Set by the Resend integration on Vercel; keep the name it injects. */
const apiKey = process.env.RESEND_API_KEY;

/** Where enquiries land. Comma-separated for more than one inbox. */
export const teamInbox = (process.env.LEAD_EMAIL_TO ?? "")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);

/**
 * The sender, on a domain verified in Resend — `Multi Mulk
 * <enquiries@multimulk.com>`. Resend rejects anything else, so this cannot
 * default to the enquirer's own address; theirs goes in `reply_to`.
 */
const sender = process.env.LEAD_EMAIL_FROM;

/** All three are needed before this channel counts as available. */
export const emailConfigured = Boolean(
  apiKey && sender && teamInbox.length > 0,
);

export class LeadEmailError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "LeadEmailError";
  }
}

/**
 * One POST to Resend. Resolves only once it has accepted the message, and
 * throws with the API's own message otherwise — a 403 for an unverified
 * sending domain is the mistake worth reading, and it is the one the response
 * body explains.
 */
export async function sendEmail(message: {
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  /** Makes this attempt safely retryable; see `idempotencyKey`. */
  idempotencyKey: string;
}): Promise<void> {
  if (!emailConfigured) {
    throw new LeadEmailError(
      "Resend is not configured — set RESEND_API_KEY, LEAD_EMAIL_FROM and LEAD_EMAIL_TO.",
    );
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "Idempotency-Key": message.idempotencyKey,
      },
      body: JSON.stringify({
        from: sender,
        to: message.to,
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      // A lead is small; if Resend cannot answer promptly the reader is better
      // off being told than left waiting.
      signal: AbortSignal.timeout(8000),
    });
  } catch (cause) {
    throw new LeadEmailError("Resend did not respond.", { cause });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new LeadEmailError(
      `Resend returned ${response.status} ${response.statusText}. ${detail}`.trim(),
    );
  }
}

/**
 * Makes one delivery attempt safely retryable — Resend replays its original
 * response for 24 hours instead of sending twice. It does not deduplicate two
 * separate submissions: `submittedAt` differs, which is correct, because
 * somebody enquiring twice about two residences means it.
 *
 * `kind` keeps the team's copy and the enquirer's from colliding on the same
 * key, which Resend would answer with `invalid_idempotent_request`.
 */
export function idempotencyKey(lead: Lead, kind: string): string {
  const digest = createHash("sha256")
    .update(`${lead.email}\u0000${lead.submittedAt}`)
    .digest("hex");
  return `${kind}/${digest}`;
}

/** Everything here is reader-supplied and goes into an HTML document. */
export function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The fields, in the order somebody triaging an enquiry wants them. */
function rows(lead: Lead): { label: string; value: string; href?: string }[] {
  const page = absoluteUrl(lead.source.path);

  return [
    { label: "Name", value: lead.name },
    { label: "Email", value: lead.email, href: `mailto:${lead.email}` },
    {
      label: "Phone",
      value: lead.phone,
      href: `tel:${lead.phone.replace(/\s/g, "")}`,
    },
    { label: "Enquiry about", value: en.contact.form.types[lead.enquiryType] },
    { label: "Subject", value: lead.subject },
    { label: "Language", value: localeNames[lead.locale].english },
    // The absolute URL rather than the path, so it is still a usable link in
    // the plain-text part, where there is no anchor to hang it off.
    { label: "Page", value: page, href: page },
    ...(lead.source.programme
      ? [{ label: "Programme", value: lead.source.programme }]
      : []),
    {
      label: "Received",
      value: new Date(lead.submittedAt).toUTCString(),
    },
  ];
}

function subjectLine(lead: Lead): string {
  const line = `New ${en.contact.form.types[lead.enquiryType]}: ${lead.subject}`;
  // Long subjects are truncated by mail clients anyway, and the reader's own
  // subject line can run to 200 characters.
  return line.length > 160 ? `${line.slice(0, 157)}…` : line;
}

function textBody(lead: Lead): string {
  const fields = rows(lead)
    .map(({ label, value }) => `${label}: ${value}`)
    .join("\n");
  return `${fields}\n\nMessage:\n${lead.message}\n`;
}

function htmlBody(lead: Lead): string {
  const fields = rows(lead)
    .map(({ label, value, href }) => {
      const shown = escape(value);
      const cell = href
        ? `<a href="${escape(href)}" style="color:#12402a">${shown}</a>`
        : shown;
      return `<tr>
        <td style="padding:6px 16px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td>
        <td style="padding:6px 0;color:#222a2c">${cell}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f4f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;padding:28px">
      <h1 style="margin:0 0 20px;font-size:18px;font-weight:600;color:#222a2c">
        ${escape(subjectLine(lead))}
      </h1>
      <table style="border-collapse:collapse;width:100%">${fields}</table>
      <p style="margin:24px 0 8px;color:#6b7280">Message</p>
      <div style="white-space:pre-wrap;color:#222a2c;border-left:2px solid #b38a1e;padding-left:14px">${escape(lead.message)}</div>
      <p style="margin:28px 0 0;color:#6b7280;font-size:12px">
        Reply to this email to answer ${escape(lead.name)} directly.
      </p>
    </div>
  </body>
</html>`;
}

/** Sends the enquiry to the team. */
export async function emailLead(lead: Lead): Promise<void> {
  await sendEmail({
    to: teamInbox,
    // Hitting Reply answers the enquirer rather than the sending domain.
    replyTo: lead.email,
    subject: subjectLine(lead),
    text: textBody(lead),
    html: htmlBody(lead),
    idempotencyKey: idempotencyKey(lead, "enquiry"),
  });
}
