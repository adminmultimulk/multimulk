/**
 * Where a validated lead actually goes.
 *
 * The bug this replaces told the reader their enquiry had been sent and then
 * dropped it. So the contract here is narrow and deliberately unforgiving:
 * `deliverLead` either persists the lead somewhere durable or it throws. It
 * never resolves on a best-effort basis, because the caller turns a resolved
 * promise into the words "Thank You" on the reader's screen.
 */

import "server-only";
import { bitrixConfigured, createBitrixLead } from "./bitrix24";
import { emailConfigured, emailLead } from "./email";
import type { Lead } from "./schema";
import { linkBitrix, saveLead } from "./store";

/**
 * An HTTPS endpoint that accepts a JSON lead — a CRM intake, a Zapier or Make
 * catch hook, or an internal service. Awaited, and a non-2xx is a failure.
 *
 * Optional, because Bitrix24 and email through Resend are destinations in
 * their own right; see `./bitrix24.ts` and `./email.ts`. Any one on its own is
 * enough. A Zapier or Make catch hook belongs here rather than in a module of
 * its own — it wants exactly this, the lead as JSON on a URL — so pointing a
 * Zap at `LEAD_WEBHOOK_URL` needs no code and is the way to reach anything
 * Bitrix24 is not.
 */
const webhook = process.env.LEAD_WEBHOOK_URL;

/** Optional shared secret, sent as a bearer token when the endpoint wants one. */
const webhookToken = process.env.LEAD_WEBHOOK_TOKEN;

export class LeadDeliveryError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "LeadDeliveryError";
  }
}

/**
 * Persists the lead. Resolves only once it is somewhere it can be read back.
 *
 * The database is always one of the destinations, so there is no longer an
 * unconfigured case to guard: a lead with no CRM and no inbox set up still
 * lands on the dashboard's Leads page.
 *
 * Where more than one destination is configured they are attempted together
 * and one success is enough. A lead sitting in the team's inbox *is* readable
 * back, so a CRM having a bad afternoon should not tell the reader their
 * enquiry failed and send them round again — but it is logged as the error it
 * is, because the destinations are now out of step and somebody has to
 * reconcile them by hand.
 */
export async function deliverLead(lead: Lead): Promise<void> {
  // Held so the dashboard's row can link to the Bitrix card once both exist.
  let rowId: string | undefined;
  let bitrixId: string | undefined;

  const destinations: { name: string; send: () => Promise<void> }[] = [
    // The dashboard's own copy, always: it needs no configuration beyond the
    // database the dashboard already runs on.
    {
      name: "database",
      send: async () => {
        rowId = await saveLead(lead);
      },
    },
  ];
  if (bitrixConfigured) {
    destinations.push({
      name: "bitrix24",
      send: async () => {
        bitrixId = await createBitrixLead(lead);
      },
    });
  }
  if (emailConfigured) {
    destinations.push({ name: "resend", send: () => emailLead(lead) });
  }
  if (webhook) {
    const url = webhook;
    destinations.push({ name: "webhook", send: () => postWebhook(lead, url) });
  }

  const results = await Promise.allSettled(
    destinations.map((destination) => destination.send()),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[lead] ${destinations[index].name} delivery failed`,
        result.reason,
      );
    }
  });

  if (rowId && bitrixId) {
    await linkBitrix(rowId, bitrixId).catch((error: unknown) => {
      console.error("[lead] could not link the stored lead to Bitrix24", error);
    });
  }

  if (results.every((result) => result.status === "rejected")) {
    throw new LeadDeliveryError(
      "No configured destination accepted the lead.",
      { cause: results[0].reason },
    );
  }
}

async function postWebhook(lead: Lead, url: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(webhookToken ? { authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify(lead),
      // A lead is small; if the endpoint cannot answer promptly it is down,
      // and the reader is better off being told than left waiting.
      signal: AbortSignal.timeout(8000),
    });
  } catch (cause) {
    throw new LeadDeliveryError("Lead endpoint did not respond.", { cause });
  }

  if (!response.ok) {
    throw new LeadDeliveryError(
      `Lead endpoint returned ${response.status} ${response.statusText}.`,
    );
  }
}
