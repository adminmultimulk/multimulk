/**
 * Bitrix24 CRM: the enquiry as a lead in the pipeline.
 *
 * A *destination* and not a notification, so `deliverLead` awaits it and a
 * failure is a failure the reader is told about — see `./sink.ts`. Once a firm
 * has a CRM it is the system of record, and the inbox in `./email.ts` becomes
 * the copy rather than the original. Both configured is fine and is the
 * sensible way to cut over: they are attempted together and one success is
 * enough, so a portal having a bad afternoon still leaves the enquiry in the
 * team's inbox.
 *
 * An *inbound webhook* rather than an OAuth application. The whole exchange is
 * one server-to-server POST from a Next.js Server Action; a local application
 * would buy token refresh and an install flow that nothing here has a use for.
 * The cost of that choice is that the URL is itself the credential — it has
 * the access token in its path — which is why nothing in this module ever puts
 * the URL into an error, a log line, or a thrown message.
 *
 * REST rather than a client library, for the same reason `./email.ts` and
 * `./sink.ts` post their own JSON: the surface used here is a single
 * documented method, and a dependency would carry more than it saves.
 *
 * Leads specifically, not deals. An inbound enquiry from a stranger is what
 * `CRM_LEAD` is for, and Bitrix converts a qualified one into a contact and a
 * deal itself. Portals switched to "simple CRM" mode have leads turned off
 * entirely and `crm.lead.add` will refuse — the fix is a portal setting, not a
 * change here.
 */

import "server-only";
import en from "../i18n/dictionaries/en";
import { localeNames } from "../i18n/config";
import { absoluteUrl } from "../site";
import { escape } from "./email";
import type { Lead } from "./schema";

/**
 * The inbound webhook, from Developer resources → Other → Inbound webhook, with
 * `crm` scope. Looks like `https://acme.bitrix24.com/rest/1/xxxxxxxxxxxx/`.
 *
 * It authenticates as the user who created it, so that user needs permission
 * to create leads and — unless `BITRIX24_ASSIGNED_BY_ID` says otherwise — will
 * own every lead this creates.
 */
const webhookUrl = process.env.BITRIX24_WEBHOOK_URL;

/**
 * Who the lead is assigned to. A Bitrix user id — the number in the URL of
 * their profile page. Unset, Bitrix assigns it to the webhook's own user,
 * which is usually an administrator and usually not who should be calling.
 */
const assignedTo = process.env.BITRIX24_ASSIGNED_BY_ID;

/**
 * The source shown on the lead card. `WEB` is Bitrix's own built-in id for a
 * website enquiry and exists on every portal; override it only if the team has
 * added a custom source in Settings → Start point → Lists → Source.
 */
const sourceId = process.env.BITRIX24_SOURCE_ID ?? "WEB";

export const bitrixConfigured = Boolean(webhookUrl);

export class BitrixLeadError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "BitrixLeadError";
  }
}

/**
 * Turns whatever was pasted into the environment into a method endpoint.
 *
 * Bitrix shows the webhook two ways on the same screen — the bare base ending
 * at the token, and a worked example ending in a method like
 * `crm.lead.add.json` — and either one gets pasted. A token is hex-ish and
 * never contains a dot, so a trailing segment with one in it is a method left
 * on the end, and dropping it makes both pastes work.
 */
function endpointFor(base: string, method: string): string {
  // Rebuilt from the parsed URL rather than string-joined, so a base with a
  // query string or a stray space cannot smuggle anything onto the path.
  const url = new URL(base);
  const segments = url.pathname.split("/").filter(Boolean);

  // Only a check that this is a webhook and not the portal's own address.
  // What comes *before* it is kept as it was: a self-hosted Bitrix24 can live
  // under a subdirectory, and slicing from here would quietly drop it.
  //
  // Worth catching at all because, left alone, a portal URL builds a
  // plausible-looking endpoint that 404s as HTML, and the error that follows
  // describes a parsing problem rather than the mistake that caused it.
  if (!segments.includes("rest")) {
    throw new BitrixLeadError(
      "BITRIX24_WEBHOOK_URL has no /rest/ path segment, so it is the portal address rather than an inbound webhook. Take the URL from Developer resources → Other → Inbound webhook.",
    );
  }

  const last = segments[segments.length - 1];
  if (last?.includes(".")) segments.pop();

  url.search = "";
  url.hash = "";
  url.pathname = `/${[...segments, `${method}.json`].join("/")}`;
  return url.toString();
}

/**
 * Calls one REST method.
 *
 * Bitrix does not use status codes the way the rest of this directory's
 * endpoints do: a rejected call frequently arrives as `200 OK` carrying
 * `{"error":"...","error_description":"..."}`, so the body decides the outcome
 * and the status is only a fallback. `error_description` is the part worth
 * reading — `Access denied` for a webhook missing the `crm` scope, and
 * `Lead is not supported in current CRM mode` for a portal running simple mode.
 */
async function callBitrix(
  method: string,
  payload: Record<string, unknown>,
): Promise<unknown> {
  if (!webhookUrl) {
    throw new BitrixLeadError(
      "Bitrix24 is not configured — set BITRIX24_WEBHOOK_URL.",
    );
  }

  let endpoint: string;
  try {
    endpoint = endpointFor(webhookUrl, method);
  } catch (cause) {
    if (cause instanceof BitrixLeadError) throw cause;
    // Deliberately does not quote the value: it is the credential.
    throw new BitrixLeadError(
      "BITRIX24_WEBHOOK_URL is not a valid URL. Expected the inbound webhook, e.g. https://your-portal.bitrix24.com/rest/1/<token>/",
      { cause },
    );
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // A lead is small, and this runs while the reader waits on the word
      // "Thank You"; if the portal cannot answer promptly they are better off
      // told than left watching a spinner.
      signal: AbortSignal.timeout(8000),
    });
  } catch (cause) {
    throw new BitrixLeadError(`Bitrix24 did not respond to ${method}.`, {
      cause,
    });
  }

  const body: unknown = await response.json().catch(() => null);

  if (body && typeof body === "object" && "error" in body) {
    const detail = body as { error?: unknown; error_description?: unknown };
    const description =
      typeof detail.error_description === "string" && detail.error_description
        ? detail.error_description
        : String(detail.error);
    throw new BitrixLeadError(`Bitrix24 rejected ${method}: ${description}`);
  }

  if (!response.ok) {
    throw new BitrixLeadError(
      `Bitrix24 returned ${response.status} ${response.statusText} for ${method}.`,
    );
  }

  if (!body || typeof body !== "object" || !("result" in body)) {
    throw new BitrixLeadError(
      `Bitrix24 answered ${method} without a result. The URL may point at the portal rather than at an inbound webhook.`,
    );
  }

  return (body as { result: unknown }).result;
}

/** What the salesperson sees in the list before opening anything. */
function title(lead: Lead): string {
  const kind = en.contact.form.types[lead.enquiryType];
  const line = `${kind} — ${lead.name}`;
  // Bitrix stores 255; a reader's own subject can already run to 200 and the
  // list view truncates long titles into uselessness well before that.
  return line.length > 120 ? `${line.slice(0, 119)}…` : line;
}

/**
 * The context that has no field of its own on a lead card.
 *
 * `COMMENTS` is an HTML field in Bitrix, so every reader-supplied value is
 * escaped and newlines become breaks. That is a rendering decision and an
 * injection defence at once: without it a message containing markup would
 * both render wrongly and run in the CRM.
 */
function comments(lead: Lead): string {
  const page = absoluteUrl(lead.source.path);
  const rows: [string, string][] = [
    ["Subject", lead.subject],
    // Which language they wrote in decides who picks the enquiry up, so it is
    // stated rather than left to be inferred from the message.
    ["Language", localeNames[lead.locale].english],
    ["Page", page],
    ...(lead.source.programme
      ? ([["Programme", lead.source.programme]] as [string, string][])
      : []),
    ["Received", new Date(lead.submittedAt).toUTCString()],
  ];

  const details = rows
    .map(([label, value]) => `<b>${label}:</b> ${escape(value)}`)
    .join("<br>");

  return `${details}<br><br><b>Message:</b><br>${escape(lead.message).replace(/\r?\n/g, "<br>")}`;
}

/**
 * Creates the lead. Resolves only once Bitrix has given it an id.
 *
 * `EMAIL` and `PHONE` are multi-value on a Bitrix lead, so they go as arrays
 * of typed entries rather than plain strings — a string is silently dropped,
 * which is the mistake worth not making, because it produces a lead with no
 * way to answer it.
 *
 * `REGISTER_SONET_EVENT` puts the creation in the activity stream and fires
 * the portal's own notifications, which is what makes an assignee actually
 * find out. It is off by default in the REST API.
 */
export async function createBitrixLead(lead: Lead): Promise<void> {
  await callBitrix("crm.lead.add", {
    fields: {
      TITLE: title(lead),
      // The whole name in NAME rather than split across NAME and LAST_NAME.
      // Multi Mulk's enquiries arrive from the Gulf, Türkiye, Pakistan and
      // Europe, where a first-token-is-the-given-name guess is wrong often
      // enough to matter, and Bitrix renders the two fields joined anyway.
      NAME: lead.name,
      COMMENTS: comments(lead),
      SOURCE_ID: sourceId,
      SOURCE_DESCRIPTION: lead.source.programme
        ? `${lead.source.path} (${lead.source.programme})`
        : lead.source.path,
      // Visible to the whole team rather than only to the assignee — an
      // enquiry nobody else can see is an enquiry nobody covers on a day off.
      OPENED: "Y",
      EMAIL: [{ VALUE: lead.email, VALUE_TYPE: "WORK" }],
      PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
      ...(assignedTo ? { ASSIGNED_BY_ID: assignedTo } : {}),
    },
    params: { REGISTER_SONET_EVENT: "Y" },
  });
}
