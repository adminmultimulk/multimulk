/**
 * The calculator-result email: the all-in breakdown a gated estimate promises.
 *
 * Sent as HTML and plain text with the same line items the page shows, so the
 * reader can keep the numbers without reopening the site.
 */

import "server-only";
import { contact } from "../content";
import { resendConfigured, sendResendEmail } from "../email/resend";
import { dirFor, type Locale } from "../i18n/config";
import { getDictionary } from "../i18n";
import { interpolate } from "../i18n/format";
import type { CostLine } from "../tools/cost";
import {
  escape,
  idempotencyKey,
  signatureHtml,
  signatureText,
  teamInbox,
} from "./email";
import type { Lead } from "./schema";

export type CalculatorReport = {
  programmeName: string;
  adults: number;
  children: number;
  currency: string;
  lines: readonly CostLine[];
  total: number;
};

export async function sendCalculatorReport(
  lead: Lead,
  report: CalculatorReport,
): Promise<void> {
  if (!resendConfigured) return;

  const t = await getDictionary(lead.locale);
  const copy = t.calculatorResult.email;
  const linesCopy = t.tools.calculator.lines;
  const dir = dirFor(lead.locale);
  const money = formatMoney(lead.locale, report.currency);

  const values = {
    name: lead.name,
    programme: report.programmeName,
    total: money(report.total),
  };

  const isolate = (template: string, key: "name" | "programme" | "total") =>
    escape(interpolate(template, { ...values, [key]: "\u0000" })).replace(
      "\u0000",
      `<bdi>${escape(values[key])}</bdi>`,
    );

  const lineText = report.lines
    .map(
      (line) =>
        `${linesCopy[line.key]}: ${money(line.value)}`,
    )
    .join("\n");

  const lineHtml = report.lines
    .map(
      (line) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #edf2ee;color:#6b7280;font-size:13px">${escape(linesCopy[line.key])}</td>
          <td dir="ltr" style="padding:8px 0;border-bottom:1px solid #edf2ee;color:#222a2c;font-size:13px;text-align:${dir === "rtl" ? "left" : "right"}">${escape(money(line.value))}</td>
        </tr>`,
    )
    .join("");

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
      lineText,
      "",
      `${t.tools.calculator.total}: ${money(report.total)}`,
      "",
      copy.closing,
      "",
      ...signatureText(replyTo),
    ].join("\n"),
    html: html({
      greeting: isolate(copy.greeting, "name"),
      body: isolate(copy.body, "programme"),
      closing: copy.closing,
      lineHtml,
      totalLabel: t.tools.calculator.total,
      total: money(report.total),
      locale: lead.locale,
      dir,
    }),
    idempotencyKey: idempotencyKey(lead, "calculator"),
  });
}

function formatMoney(locale: Locale, currency: string) {
  return (value: number) =>
    new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      numberingSystem: "latn",
    }).format(value);
}

function html({
  greeting,
  body,
  closing,
  lineHtml,
  totalLabel,
  total,
  locale,
  dir,
}: {
  greeting: string;
  body: string;
  closing: string;
  lineHtml: string;
  totalLabel: string;
  total: string;
  locale: string;
  dir: "ltr" | "rtl";
}): string {
  return `<!doctype html>
<html dir="${dir}" lang="${locale}">
  <body style="margin:0;padding:24px;background:#f5f4f2;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:24px">
    <div dir="${dir}" style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;text-align:${dir === "rtl" ? "right" : "left"}">
      <p style="margin:0 0 16px;color:#222a2c">${greeting}</p>
      <p style="margin:0 0 24px;color:#222a2c">${body}</p>

      <table style="width:100%;border-collapse:collapse;margin:0 0 8px">
        ${lineHtml}
        <tr>
          <td style="padding:16px 0 0;color:#222a2c;font-size:16px">${escape(totalLabel)}</td>
          <td dir="ltr" style="padding:16px 0 0;color:#12402a;font-size:22px;text-align:${dir === "rtl" ? "left" : "right"}">${escape(total)}</td>
        </tr>
      </table>

      <p style="margin:24px 0 0;color:#222a2c">${escape(closing)}</p>

      ${signatureHtml()}
    </div>
  </body>
</html>`;
}
