/**
 * Pings a webhook — a Slack or Teams hook — that a lead arrived.
 *
 * Not the team's email: that is `./email.ts`, and it is a destination rather
 * than a notification, so `deliverLead` awaits it. This is the layer above
 * that, strictly secondary. It runs inside `after()`, once the lead is already
 * stored, so an endpoint having a bad afternoon costs a ping and never an
 * enquiry. Unconfigured, it does nothing at all.
 */

import "server-only";
import type { Lead } from "./schema";

const endpoint = process.env.LEAD_NOTIFY_URL;
const token = process.env.LEAD_NOTIFY_TOKEN;

export async function notifyTeam(lead: Lead): Promise<void> {
  if (!endpoint) return;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Notification endpoint returned ${response.status}.`);
  }
}
