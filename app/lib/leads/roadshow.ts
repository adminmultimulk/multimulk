/**
 * The roadshow confirmation: what was asked for, and what happens next.
 *
 * Same footing as `./guide.ts` — sent from inside `after()` once the lead is
 * stored, in the language the form was filled in, and never thrown at the
 * reader, who has already been shown the thank-you page.
 */

import "server-only";
import { contact } from "../content";
import { resendConfigured, sendResendEmail } from "../email/resend";
import { dirFor } from "../i18n/config";
import { getDictionary } from "../i18n";
import { interpolate } from "../i18n/format";
import {
  formatRoadshowDate,
  isolateLtr,
  slotRange,
  type RoadshowCity,
  type RoadshowSlot,
} from "../roadshow";
import {
  escape,
  idempotencyKey,
  signatureHtml,
  signatureText,
  teamInbox,
} from "./email";
import type { Lead } from "./schema";

export async function sendRoadshowConfirmation(
  lead: Lead,
  booking: { city: RoadshowCity; slot: RoadshowSlot },
): Promise<void> {
  if (!resendConfigured) return;

  const t = await getDictionary(lead.locale);
  const copy = t.roadshow;
  const dir = dirFor(lead.locale);

  const rows = [
    { label: copy.summary.city, value: copy.cities[booking.city].name },
    { label: copy.summary.date, value: formatRoadshowDate(lead.locale, booking.city) },
    {
      label: copy.summary.time,
      value: `${copy.form.slots[booking.slot]} (${isolateLtr(slotRange(booking.slot))})`,
    },
    { label: copy.summary.venue, value: copy.venueTbc },
  ];

  const greeting = interpolate(copy.email.greeting, { name: lead.name });
  // The name is the one reader-supplied value mid-sentence; see `./ack.ts`.
  const greetingHtml = escape(
    interpolate(copy.email.greeting, { name: "\u0000" }),
  ).replace("\u0000", `<bdi>${escape(lead.name)}</bdi>`);

  const replyTo = teamInbox[0] ?? contact.email;
  await sendResendEmail({
    to: [lead.email],
    replyTo,
    subject: copy.email.subject,
    text: [
      greeting,
      "",
      copy.email.body,
      "",
      ...rows.map((row) => `${row.label}: ${row.value}`),
      "",
      copy.email.next,
      "",
      copy.email.closing,
      "",
      ...signatureText(replyTo),
    ].join("\n"),
    html: `<!doctype html>
<html dir="${dir}" lang="${lead.locale}">
  <body style="margin:0;padding:24px;background:#f5f4f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:24px">
    <div dir="${dir}" style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;text-align:${dir === "rtl" ? "right" : "left"}">
      <p style="margin:0 0 16px;color:#222a2c">${greetingHtml}</p>
      <p style="margin:0 0 24px;color:#222a2c">${escape(copy.email.body)}</p>

      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;background:#edf2ee">
        ${rows
          .map(
            (row) => `<tr>
          <td style="padding:10px 16px;color:#6b7280;font-size:12px;white-space:nowrap;vertical-align:top">${escape(row.label)}</td>
          <td style="padding:10px 16px;color:#12402a">${escape(row.value)}</td>
        </tr>`,
          )
          .join("\n        ")}
      </table>

      <p style="margin:0 0 16px;color:#222a2c">${escape(copy.email.next)}</p>
      <p style="margin:0;color:#222a2c">${escape(copy.email.closing)}</p>

      ${signatureHtml()}
    </div>
  </body>
</html>`,
    idempotencyKey: idempotencyKey(lead, "roadshow"),
  });
}
