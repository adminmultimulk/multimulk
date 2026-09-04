/**
 * The enquirer's own copy: "we have this, someone will reply".
 *
 * The opposite of the team's email in `./email.ts`. That one is a destination
 * and `deliverLead` awaits it; this one runs inside `after()` alongside
 * `notifyTeam`, once the enquiry is already stored, so a mail provider having
 * a bad afternoon costs an acknowledgement and never an enquiry. It is also
 * why nothing here throws at the reader: by the time it runs they have already
 * been told "Thank You", and that must stay true.
 *
 * Written in the language the enquiry arrived in — which is the whole point of
 * carrying `locale` on the lead. `getDictionary` takes an explicit locale, so
 * it never reaches for `next/root-params`; that is unavailable in a Server
 * Function, and this is called from one. See the note in `./actions.ts`.
 */

import "server-only";
import { company, contact } from "../content";
import { dirFor } from "../i18n/config";
import { getDictionary } from "../i18n";
import { interpolate } from "../i18n/format";
import { absoluteUrl } from "../site";
import {
  emailConfigured,
  escape,
  idempotencyKey,
  sendEmail,
  teamInbox,
} from "./email";
import type { Lead } from "./schema";

export async function acknowledgeLead(lead: Lead): Promise<void> {
  // Not configured is not a failure; the team simply never offered to send it.
  if (!emailConfigured) return;

  const t = await getDictionary(lead.locale);
  const form = t.contact.form;
  const copy = form.ack;
  const dir = dirFor(lead.locale);
  const greeting = interpolate(copy.greeting, { name: lead.name });
  // The name is the one reader-supplied value sitting mid-sentence, so it is
  // isolated on its own rather than by the element's `dir`. A sentinel keeps
  // the translated half escaped without escaping the markup around the name;
  // NUL cannot occur in the copy and `escape` leaves it alone.
  const greetingHtml = escape(
    interpolate(copy.greeting, { name: "\u0000" }),
  ).replace("\u0000", `<bdi>${escape(lead.name)}</bdi>`);

  // A reply from the enquirer has to reach the people who can answer it, not
  // the unattended address the acknowledgement was sent from.
  const replyTo = teamInbox[0];

  await sendEmail({
    to: [lead.email],
    replyTo,
    subject: copy.subject,
    text: text({ greeting, body: form.sentBody, copy, lead, replyTo }),
    html: html({ greeting: greetingHtml, body: form.sentBody, copy, lead, dir }),
    idempotencyKey: idempotencyKey(lead, "ack"),
  });
}

type Copy = Awaited<ReturnType<typeof getDictionary>>["contact"]["form"]["ack"];

type Parts = {
  /** Plain for `text`, already-escaped markup for `html`. */
  greeting: string;
  body: string;
  copy: Copy;
  lead: Lead;
};

function text({ greeting, body, copy, lead, replyTo }: Parts & { replyTo: string }): string {
  return [
    greeting,
    "",
    body,
    "",
    `${copy.yourMessage}:`,
    lead.subject,
    "",
    lead.message,
    "",
    copy.closing,
    "",
    company.name,
    replyTo,
    absoluteUrl("/"),
  ].join("\n");
}

function html({
  greeting,
  body,
  copy,
  lead,
  dir,
}: Parts & { dir: "ltr" | "rtl" }): string {
  // `border-inline-start` is unreliable across mail clients, so the quote rule
  // is placed on whichever physical side this language starts from.
  const rule = dir === "rtl" ? "border-right" : "border-left";
  const pad = dir === "rtl" ? "padding-right" : "padding-left";

  // Everything the enquirer typed needs its direction resolved on its own
  // terms. Latin text inside an Arabic email otherwise has its punctuation
  // dragged to the wrong end — "Hello," reads as ",Hello" — because the base
  // direction, not the content, decides. `dir="auto"` lets each value speak
  // for itself, and the signature is always Latin so it is pinned outright.
  const home = absoluteUrl("/");

  return `<!doctype html>
<html dir="${dir}" lang="${lead.locale}">
  <body style="margin:0;padding:24px;background:#f5f4f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:24px">
    <div dir="${dir}" style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;text-align:${dir === "rtl" ? "right" : "left"}">
      <p style="margin:0 0 16px;color:#222a2c">${greeting}</p>
      <p style="margin:0 0 24px;color:#222a2c">${escape(body)}</p>

      <p style="margin:0 0 8px;color:#6b7280;font-size:12px">${escape(copy.yourMessage)}</p>
      <div style="${rule}:2px solid #b38a1e;${pad}:14px;color:#222a2c">
        <p dir="auto" style="margin:0 0 8px;font-weight:600">${escape(lead.subject)}</p>
        <div dir="auto" style="white-space:pre-wrap">${escape(lead.message)}</div>
      </div>

      <p style="margin:24px 0 0;color:#222a2c">${escape(copy.closing)}</p>

      <p dir="ltr" style="margin:28px 0 0;padding-top:20px;border-top:1px solid #edf2ee;color:#6b7280;font-size:12px">
        <strong style="color:#12402a">${escape(company.name)}</strong><br />
        <a href="mailto:${escape(contact.email)}" style="color:#6b7280">${escape(contact.email)}</a><br />
        <a href="${escape(home)}" style="color:#6b7280">${escape(home)}</a>
      </p>
    </div>
  </body>
</html>`;
}
