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
import { emailConfigured, emailLead } from "./email";
import type { Lead } from "./schema";

/**
 * An HTTPS endpoint that accepts a JSON lead — a CRM intake, a Zapier or Make
 * catch hook, or an internal service. Awaited, and a non-2xx is a failure.
 *
 * Optional, because email through Resend is a destination in its own right;
 * see `./email.ts`. Either one on its own is enough.
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
 * With no destination configured this throws in production and logs in
 * development, which is the important asymmetry: a missing environment
 * variable must never become a silent data loss on the live site, but it also
 * must not stop anyone working on the form locally.
 *
 * Where both a webhook and email are configured, they are attempted together
 * and one success is enough. A lead sitting in the team's inbox *is* readable
 * back, so a CRM having a bad afternoon should not tell the reader their
 * enquiry failed and send them round again — but it is logged as the error it
 * is, because the two destinations are now out of step.
 */
export async function deliverLead(lead: Lead): Promise<void> {
  const destinations: { name: string; send: () => Promise<void> }[] = [];
  if (emailConfigured) {
    destinations.push({ name: "resend", send: () => emailLead(lead) });
  }
  if (webhook) {
    const url = webhook;
    destinations.push({ name: "webhook", send: () => postWebhook(lead, url) });
  }

  if (destinations.length === 0) {
    if (process.env.NODE_ENV === "production") {
      throw new LeadDeliveryError(
        "No lead destination configured — refusing to accept a lead with nowhere to put it. Set RESEND_API_KEY, LEAD_EMAIL_FROM and LEAD_EMAIL_TO, or LEAD_WEBHOOK_URL.",
      );
    }
    console.info("[lead] no destination configured; logging instead:", lead);
    return;
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
