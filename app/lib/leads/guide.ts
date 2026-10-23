/**
 * The free-guide email: the PDF a `/free-guide` submission promises.
 *
 * Same shape as `./brochure.ts` — a link rather than an attachment — so a
 * replaced file keeps working for every reader who already has the email.
 */

import "server-only";
import { contact } from "../content";
import { resendConfigured, sendResendEmail } from "../email/resend";
import { dirFor } from "../i18n/config";
import { getDictionary } from "../i18n";
import { interpolate } from "../i18n/format";
import {
  escape,
  idempotencyKey,
  signatureHtml,
  signatureText,
  teamInbox,
} from "./email";
import type { Lead } from "./schema";

export async function sendGuide(
  lead: Lead,
  guide: { title: string; url: string },
): Promise<void> {
  if (!resendConfigured) return;

  const t = await getDictionary(lead.locale);
  const copy = t.freeGuide.email;
  const dir = dirFor(lead.locale);
  const values = { name: lead.name, title: guide.title };

  const isolate = (template: string, key: "name" | "title") =>
    escape(interpolate(template, { ...values, [key]: "\u0000" })).replace(
      "\u0000",
      `<bdi>${escape(values[key])}</bdi>`,
    );

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
      guide.url,
      "",
      copy.closing,
      "",
      ...signatureText(replyTo),
    ].join("\n"),
    html: html({
      greeting: isolate(copy.greeting, "name"),
      body: isolate(copy.body, "title"),
      button: copy.button,
      closing: copy.closing,
      url: guide.url,
      locale: lead.locale,
      dir,
    }),
    idempotencyKey: idempotencyKey(lead, "guide"),
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
  greeting: string;
  body: string;
  button: string;
  closing: string;
  url: string;
  locale: string;
  dir: "ltr" | "rtl";
}): string {
  return `<!doctype html>
<html dir="${dir}" lang="${locale}">
  <body style="margin:0;padding:24px;background:#f5f4f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:24px">
    <div dir="${dir}" style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;text-align:${dir === "rtl" ? "right" : "left"}">
      <p style="margin:0 0 16px;color:#222a2c">${greeting}</p>
      <p style="margin:0 0 24px;color:#222a2c">${body}</p>

      <p style="margin:0 0 20px">
        <a href="${escape(url)}" style="display:inline-block;background:#12402a;color:#ffffff;padding:14px 30px;border-radius:999px;text-decoration:none;font-size:14px">${escape(button)}</a>
      </p>

      <p dir="ltr" style="margin:0 0 24px;color:#6b7280;font-size:12px;word-break:break-all">
        <a href="${escape(url)}" style="color:#6b7280">${escape(url)}</a>
      </p>

      <p style="margin:0;color:#222a2c">${escape(closing)}</p>

      ${signatureHtml()}
    </div>
  </body>
</html>`;
}
