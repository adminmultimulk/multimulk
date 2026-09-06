/**
 * The reminder itself, in both channels.
 *
 * One module for the email and the WhatsApp text because they say the same
 * thing and have to keep saying the same thing: a visitor who gets both should
 * not find two different stand numbers. The wording is the sales team's own,
 * with the bracketed placeholders in their draft resolved per visitor.
 *
 * Free of `server-only` — the dashboard renders the WhatsApp text into a
 * `wa.me` link that the browser opens, so this has to build in both places.
 */

import { BRAND, BRAND_FONTS, BRAND_ORIGIN, EVENT, SLOT_LABELS } from "./config";

export type VisitorForMessage = {
  name: string;
  email?: string | null;
  phone?: string | null;
  visitDate: Date | null;
  visitDateRaw: string;
  slot: string;
  preferredTimeRaw: string;
};

/** "8 September 2026", or whatever the sheet said when there is no date. */
export function dayLabel(visitor: VisitorForMessage): string {
  if (!visitor.visitDate) return visitor.visitDateRaw || "your chosen day";
  return visitor.visitDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * "Afternoon (2:00 PM)" — the slot, and the visitor's own words when they
 * added a time. The team's draft wrote it as "Afternoon / 2:00 PM"; that slash
 * reads as an alternative rather than a clarification, so it is a bracket here.
 */
export function timeLabel(visitor: VisitorForMessage): string {
  const slot = SLOT_LABELS[visitor.slot] ?? "";
  const raw = visitor.preferredTimeRaw.trim();
  if (!raw) return slot || "the time we agreed";
  if (!slot || raw.toLowerCase() === slot.toLowerCase()) return raw;
  return `${slot} (${raw})`;
}

export function subjectFor(visitor: VisitorForMessage): string {
  return `Reminder: your ${EVENT.name} visit — ${dayLabel(visitor)}`;
}

/**
 * The greeting.
 *
 * The draft said "Dear Mr./Ms. [Client Name]". The honorific is dropped rather
 * than guessed: the list is 48 people whose titles nobody recorded, and
 * addressing a woman as "Mr." to save a line is a worse outcome than the
 * slightly plainer "Dear Naveeda".
 */
function greeting(visitor: VisitorForMessage): string {
  const first = visitor.name.trim().split(/\s+/)[0] ?? "";
  return `Dear ${visitor.name.trim() || first || "guest"},`;
}

/** The WhatsApp text. Plain, with WhatsApp's own `*bold*` markers. */
export function whatsappText(visitor: VisitorForMessage): string {
  return [
    greeting(visitor),
    "",
    `A friendly reminder about your scheduled visit to the *${EVENT.name}* at the *${EVENT.venue}*.`,
    "",
    `📅 *Date:* ${dayLabel(visitor)}`,
    `🕐 *Time:* ${timeLabel(visitor)}`,
    `📍 *Venue:* ${EVENT.venue}`,
    `🏢 *Our Stand:* *${EVENT.stand}*`,
    "",
    `${EVENT.shortName} runs ${EVENT.daysLabel}, ${EVENT.hoursLabel}.`,
    "",
    `The *${EVENT.company}* team looks forward to welcoming you at Stand ${EVENT.stand}.`,
    "",
    "If you need to change your time, just reply to this message.",
    "",
    EVENT.company,
    `_${EVENT.tagline}_`,
  ].join("\n");
}

/** The same message as plain-text email, without WhatsApp's markers. */
export function emailText(visitor: VisitorForMessage): string {
  return [
    greeting(visitor),
    "",
    "I hope you are doing well.",
    "",
    `Just a friendly reminder about your scheduled visit to the ${EVENT.name} at the ${EVENT.venue}.`,
    "",
    `Date:  ${dayLabel(visitor)}`,
    `Time:  ${timeLabel(visitor)}`,
    `Venue: ${EVENT.venue}`,
    `Our stand: ${EVENT.stand}`,
    "",
    `${EVENT.shortName} will be held from ${EVENT.daysLabel}, ${EVENT.hoursLabel}.`,
    "",
    `The ${EVENT.company} team looks forward to welcoming you at Stand ${EVENT.stand}, and assisting you during your visit.`,
    "",
    "If you need to make any changes to your scheduled time, please feel free to contact us — simply reply to this email.",
    "",
    "Best regards,",
    "",
    EVENT.company,
    EVENT.tagline,
  ].join("\n");
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The HTML email, in the brand's own type and colour.
 *
 * Tables and inline styles, which is not how anything else in this codebase is
 * written and is how email has to be written: Outlook has no flexbox, and
 * Gmail strips a `<style>` block often enough that anything load-bearing has
 * to be on the element itself. The `<style>` here therefore carries only what
 * cannot be inlined — the two `@font-face` rules — and nothing depends on it.
 *
 * Two details that are easy to leave out and expensive to miss:
 *
 * The preheader is the grey line a phone shows next to the subject. Left
 * unset, clients fill it with whatever text comes first, which here would be
 * "Dear —" and the recipient's own name. It is hidden in the body and written
 * for the inbox list instead.
 *
 * `color-scheme: light` is what stops a phone in dark mode inverting the
 * design — which is what happened to the first send: the white card came out
 * near-black and the forest and gold went with it. Declaring the scheme asks
 * the client not to, and the palette below is chosen to survive it where a
 * client insists anyway.
 */
export function emailHtml(visitor: VisitorForMessage): string {
  const details: [string, string][] = [
    ["Date", dayLabel(visitor)],
    ["Time", timeLabel(visitor)],
    ["Venue", EVENT.venue],
    ["Our stand", EVENT.stand],
  ];

  const rows = details
    .map(
      ([label, value], index) => `<tr>
        <td style="padding:${index === 0 ? "0" : "10px"} 20px 0 0;font-family:${BRAND_FONTS.sans};font-size:12px;line-height:18px;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};white-space:nowrap;vertical-align:top">${escape(label)}</td>
        <td style="padding:${index === 0 ? "0" : "10px"} 0 0;font-family:${BRAND_FONTS.sans};font-size:15px;line-height:22px;font-weight:600;color:${BRAND.ink};vertical-align:top">${escape(value)}</td>
      </tr>`,
    )
    .join("");

  const preheader = `${dayLabel(visitor)}, ${timeLabel(visitor)} — Stand ${EVENT.stand}, ${EVENT.venue}.`;

  const paragraph = `margin:0 0 16px;font-family:${BRAND_FONTS.sans};font-size:15px;line-height:24px;color:${BRAND.ink}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escape(subjectFor(visitor))}</title>
    <style>
      :root { color-scheme: light; supported-color-schemes: light; }
      @font-face {
        font-family: 'The Seasons';
        src: url('${BRAND_ORIGIN}/fonts/TheSeasons-Light.woff2') format('woff2');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Manrope';
        src: url('https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSvfedN4.woff2') format('woff2');
        font-weight: 400 700;
        font-style: normal;
        font-display: swap;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.cream};-webkit-font-smoothing:antialiased">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0">
      ${escape(preheader)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream}">
      <tr>
        <td align="center" style="padding:24px 12px">

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse">

            <!--
              The forest is baked into the image rather than set on the cell.

              Gmail's dark mode inverts declared colours and cannot be talked
              out of it — "color-scheme: light" is advisory and Gmail ignores
              it. That turned the forest band into pale mint and left the gold
              wordmark all but invisible on it. Image pixels are the one thing
              Gmail does not touch, so the band and the logo travel together as
              one full-bleed picture and look the same everywhere.

              The bgcolor still matches, for the reader who blocks images: they
              get the forest and the gold alt text rather than a white gap.
            -->
            <tr>
              <td bgcolor="${BRAND.forest}" align="center" style="background:${BRAND.forest};font-size:0;line-height:0">
                <img src="${BRAND_ORIGIN}/email/multi-mulk-header.png"
                     width="600" alt="${escape(EVENT.company)} — ${escape(EVENT.tagline)}"
                     style="display:block;width:100%;max-width:600px;height:auto;border:0;font-family:${BRAND_FONTS.sans};font-size:15px;color:${BRAND.goldLight}">
              </td>
            </tr>
            <tr>
              <td style="background:${BRAND.gold};height:3px;line-height:3px;font-size:0">&nbsp;</td>
            </tr>

            <tr>
              <td style="background:${BRAND.white};padding:32px 28px 28px">
                <p style="margin:0 0 10px;font-family:${BRAND_FONTS.sans};font-size:11px;line-height:16px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${BRAND.gold}">
                  A reminder
                </p>
                <h1 style="margin:0 0 22px;font-family:${BRAND_FONTS.display};font-size:28px;line-height:36px;font-weight:300;letter-spacing:.005em;color:${BRAND.forest}">
                  Your visit to the ${escape(EVENT.name)}
                </h1>

                <p style="${paragraph}">${escape(greeting(visitor))}</p>
                <p style="${paragraph}">I hope you are doing well.</p>
                <p style="margin:0 0 24px;font-family:${BRAND_FONTS.sans};font-size:15px;line-height:24px;color:${BRAND.ink}">
                  Just a friendly reminder about your scheduled visit to the
                  <strong style="color:${BRAND.forest}">${escape(EVENT.name)}</strong>
                  at the ${escape(EVENT.venue)}.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px">
                  <tr>
                    <td style="background:${BRAND.gold};width:3px;line-height:0;font-size:0">&nbsp;</td>
                    <td style="background:${BRAND.mist};padding:18px 20px">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                        ${rows}
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="${paragraph}">
                  ${escape(EVENT.shortName)} will be held from
                  <strong>${escape(EVENT.daysLabel)}</strong>, ${escape(EVENT.hoursLabel)}.
                </p>
                <p style="${paragraph}">
                  The <strong>${escape(EVENT.company)}</strong> team looks forward to
                  welcoming you at <strong style="color:${BRAND.forest}">Stand ${escape(EVENT.stand)}</strong>,
                  and assisting you during your visit.
                </p>
                <p style="margin:0 0 28px;font-family:${BRAND_FONTS.sans};font-size:15px;line-height:24px;color:${BRAND.ink}">
                  If you need to make any changes to your scheduled time, please
                  reply to this email.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.sand};border-collapse:collapse">
                  <tr>
                    <td style="padding:20px 0 0">
                      <p style="margin:0 0 6px;font-family:${BRAND_FONTS.sans};font-size:14px;line-height:20px;color:${BRAND.muted}">
                        Best regards,
                      </p>
                      <p style="margin:0;font-family:${BRAND_FONTS.display};font-size:19px;line-height:26px;font-weight:300;color:${BRAND.forest}">
                        ${escape(EVENT.company)}
                      </p>
                      <p style="margin:4px 0 0;font-family:${BRAND_FONTS.sans};font-size:12px;line-height:18px;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.gold}">
                        ${escape(EVENT.tagline)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!--
              Cream rather than a second forest band, for the same reason: a
              dark panel is what inversion mangles. Light ground with dark text
              reads correctly either way round — inverted it simply becomes
              dark ground with light text, which is a legible footer and not a
              mistake.
            -->
            <tr>
              <td align="center" style="background:${BRAND.cream};padding:18px 24px;border-top:1px solid ${BRAND.sand}">
                <p style="margin:0;font-family:${BRAND_FONTS.sans};font-size:12px;line-height:18px;color:${BRAND.muted}">
                  <a href="${BRAND_ORIGIN}" style="color:${BRAND.forest};text-decoration:none;font-weight:600">multimulk.com</a>
                  &nbsp;·&nbsp; ${escape(EVENT.venue)}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * The click-to-chat link.
 *
 * WhatsApp's own URL scheme, which opens the conversation with the message
 * already typed and sends nothing until a person presses send. That is the
 * whole reason it is used in place of the Business API: this list is 48 people
 * over three days, the API's template approval takes longer than the show
 * lasts, and a link that a human sends is a message WhatsApp will not treat as
 * unsolicited traffic from a cold number.
 */
export function whatsappLink(visitor: VisitorForMessage): string | null {
  if (!visitor.phone) return null;
  return `https://wa.me/${visitor.phone}?text=${encodeURIComponent(whatsappText(visitor))}`;
}
