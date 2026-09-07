/**
 * The brochure email: the thing a "Download Brochure" actually promises.
 *
 * A link rather than an attachment. The PDF is served from `public/`, so a
 * link costs nothing to send, cannot bounce for size, and survives a brochure
 * being replaced — the reader's email keeps pointing at the current file.
 *
 * Sibling of `./ack.ts` and sent the same way: inside `after()`, once the lead
 * is already stored, in the language the request arrived in. Nothing here
 * throws at the reader, because by the time it runs they have been told the
 * brochure is on its way — and the dialog shows them the same link directly,
 * so a mail provider having a bad afternoon costs an email and not the
 * brochure.
 */

import "server-only";
import { company, contact } from "../content";
import { resendConfigured, sendResendEmail } from "../email/resend";
import { dirFor } from "../i18n/config";
import { getDictionary } from "../i18n";
import { interpolate } from "../i18n/format";
import { absoluteUrl } from "../site";
import { escape, idempotencyKey, teamInbox } from "./email";
import type { Lead } from "./schema";

export async function sendBrochure(
  lead: Lead,
  brochure: { project: string; url: string },
): Promise<void> {
  // Gated on the sender alone, and deliberately not on `emailConfigured` the
  // way `./ack.ts` is: that one also requires `LEAD_EMAIL_TO`, because an
  // acknowledgement is worth nothing if nobody is reading the enquiry. This
  // email is the thing the reader was promised, so where the team's copy
  // lands has no bearing on whether it goes out.
  if (!resendConfigured) return;

  const t = await getDictionary(lead.locale);
  const copy = t.brochure.email;
  const dir = dirFor(lead.locale);
  const values = { name: lead.name, project: brochure.project };

  // The name and the development name are the two values sitting mid-sentence
  // that the reader's language does not control, so each is isolated on its
  // own rather than by the element's `dir`. A sentinel keeps the translated
  // half escaped without escaping the markup around the value; NUL cannot
  // occur in the copy and `escape` leaves it alone.
  const isolate = (template: string, key: "name" | "project") =>
    escape(interpolate(template, { ...values, [key]: "\u0000" })).replace(
      "\u0000",
      `<bdi>${escape(values[key])}</bdi>`,
    );

  // A reply has to reach the people who can answer it, not the unattended
  // address the brochure was sent from. With no `LEAD_EMAIL_TO` configured
  // that is the published inbox, which is where a reader would have written
  // anyway.
  const replyTo = teamInbox[0] ?? contact.email;

  await sendResendEmail({
    to: [lead.email],
    replyTo,
    subject: interpolate(copy.subject, values),
    text: [
      interpolate(copy.greeting, values),
      "",
      interpolate(copy.body, values),
      "",
      brochure.url,
      "",
      copy.closing,
      "",
      company.name,
      replyTo,
      absoluteUrl("/"),
    ].join("\n"),
    html: html({
      greeting: isolate(copy.greeting, "name"),
      body: isolate(copy.body, "project"),
      button: copy.button,
      closing: copy.closing,
      url: brochure.url,
      locale: lead.locale,
      dir,
    }),
    idempotencyKey: idempotencyKey(lead, "brochure"),
  });
}

function html({
  greeting,
  body,
  button,
  closing,
  url,
  locale,
  dir,
}: {
  /** Already-escaped markup; see `isolate` above. */
  greeting: string;
  body: string;
  button: string;
  closing: string;
  url: string;
  locale: string;
  dir: "ltr" | "rtl";
}): string {
  const home = absoluteUrl("/");

  return `<!doctype html>
<html dir="${dir}" lang="${locale}">
  <body style="margin:0;padding:24px;background:#f5f4f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:24px">
    <div dir="${dir}" style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;text-align:${dir === "rtl" ? "right" : "left"}">
      <p style="margin:0 0 16px;color:#222a2c">${greeting}</p>
      <p style="margin:0 0 24px;color:#222a2c">${body}</p>

      <p style="margin:0 0 20px">
        <a href="${escape(url)}" style="display:inline-block;background:#12402a;color:#ffffff;padding:14px 30px;border-radius:999px;text-decoration:none;font-size:14px">${escape(button)}</a>
      </p>

      <!-- Clients that strip the button, and readers who would rather see
           where a link goes, still get the address itself. -->
      <p dir="ltr" style="margin:0 0 24px;color:#6b7280;font-size:12px;word-break:break-all">
        <a href="${escape(url)}" style="color:#6b7280">${escape(url)}</a>
      </p>

      <p style="margin:0;color:#222a2c">${escape(closing)}</p>

      <p dir="ltr" style="margin:28px 0 0;padding-top:20px;border-top:1px solid #edf2ee;color:#6b7280;font-size:12px">
        <strong style="color:#12402a">${escape(company.name)}</strong><br />
        <a href="mailto:${escape(contact.email)}" style="color:#6b7280">${escape(contact.email)}</a><br />
        <a href="${escape(home)}" style="color:#6b7280">${escape(home)}</a>
      </p>
    </div>
  </body>
</html>`;
}
