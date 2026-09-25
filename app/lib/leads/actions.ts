"use server";

/**
 * The contact form's submission path.
 *
 * A Server Action rather than a route handler: the form then works before
 * hydration and with JavaScript off, and there is no public endpoint for
 * anyone to POST at. An action's id is bound to the build, so it cannot be
 * called from outside the app — worth having for an unauthenticated form.
 *
 * What this module cannot do is speak the reader's language. `next/root-params`
 * is unavailable in Server Functions, so there is no way to resolve the locale
 * here; it arrives as a field and errors leave as keys for the client to word.
 */

import { headers } from "next/headers";
import { after } from "next/server";

import { resolveBrochure } from "../brochures";
import en from "../i18n/dictionaries/en";
import { isPartnerTrack } from "../partners";
import {
  validateLead,
  type Lead,
  type LeadErrorKey,
  type LeadErrors,
} from "./schema";
import { acknowledgeLead } from "./ack";
import { sendBrochure } from "./brochure";
import { deliverLead } from "./sink";
import { notifyTeam } from "./notify";
import { withinRateLimit } from "./rate-limit";
import { mintFormToken, verifyFormToken } from "./token";

export type LeadState =
  | { status: "idle" }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "failed"; reason: "rate" | "server" }
  | { status: "sent" };

/**
 * A token for a form that no Server Component rendered.
 *
 * The enquiry dialog is opened by a click, so there is no server render to
 * mint against the way `/contact-us` has one — and a token baked into a
 * prerendered page would be hours stale by the time anyone clicked. Minting on
 * open also means the clock starts when the reader sees the form, which is
 * what `MIN_AGE_MS` is trying to measure in the first place.
 *
 * This does hand a bot a way to fetch a token without loading a page, but it
 * could always have scraped one out of the HTML; the honeypot and the rate
 * limit are what stand between a script and a delivered lead.
 */
export async function issueFormToken(): Promise<string> {
  return mintFormToken();
}

/** Vercel and most proxies put the originating address first in this list. */
async function clientKey(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return list.get("x-real-ip") ?? "unknown";
}

export async function submitLead(
  _previous: LeadState,
  form: FormData,
): Promise<LeadState> {
  // A field no human can see and no human will fill. Bots fill everything.
  // They are told the message sent, so the attempt is not worth retrying.
  if (String(form.get("company") ?? "")) return { status: "sent" };

  const verdict = verifyFormToken(form.get("t"));
  if (verdict === "too-fast" || verdict === "bad") return { status: "sent" };
  // A stale token means a form left open too long. That is a person, so it
  // gets an honest error and a chance to resubmit against a fresh render.
  if (verdict === "stale") return { status: "failed", reason: "server" };

  if (!withinRateLimit(await clientKey())) {
    return { status: "failed", reason: "rate" };
  }

  const raw = Object.fromEntries(form.entries());
  const result = validateLead(raw);
  if (!result.ok) return { status: "invalid", errors: result.errors };

  const lead: Lead = {
    ...result.lead,
    submittedAt: new Date().toISOString(),
  };

  // Awaited: "sent" on the reader's screen has to mean the lead is stored.
  try {
    await deliverLead(lead);
  } catch (error) {
    console.error("[lead] delivery failed", error);
    return { status: "failed", reason: "server" };
  }

  // Already durable, so a slow mail hop should not hold up the response, and a
  // failed one must not retract a success the reader has been given. The two
  // are independent: an unreachable Slack hook must not cost the enquirer
  // their acknowledgement, or the other way round.
  after(async () => {
    const names = ["notification", "acknowledgement"];
    const results = await Promise.allSettled([
      notifyTeam(lead),
      acknowledgeLead(lead),
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[lead] ${names[index]} failed`, result.reason);
      }
    });
  });

  return { status: "sent" };
}

/** The same states as an enquiry: the brochure itself arrives by email. */
export type BrochureState =
  | { status: "idle" }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "failed"; reason: "rate" | "server" }
  | { status: "sent" };

/**
 * A brochure request: three fields on screen, a lead in the inbox, and the
 * brochure in the reader's email.
 *
 * The enquiry the sales team reads is composed here rather than typed — there
 * is no subject or message field on a brochure form — so what arrives beside
 * the ordinary enquiries names the development and says how it was raised.
 */
export async function requestBrochure(
  _previous: BrochureState,
  form: FormData,
): Promise<BrochureState> {
  // The slug arrives over the wire, so the file is resolved from the site's
  // own data rather than taken from the form: a request cannot name a path
  // the site does not publish, and anything with no brochure — which is
  // anything with no button either — cannot be requested at all.
  const brochure = await resolveBrochure(String(form.get("project") ?? ""));
  if (!brochure) return { status: "failed", reason: "server" };

  // As in `submitLead`: a bot is thanked rather than told what gave it away,
  // and what is withheld is the lead and the email.
  if (String(form.get("company") ?? "")) return { status: "sent" };

  const verdict = verifyFormToken(form.get("t"));
  if (verdict === "too-fast" || verdict === "bad") return { status: "sent" };
  if (verdict === "stale") return { status: "failed", reason: "server" };

  // Keyed apart from the enquiry form's window: someone who asks for two
  // brochures and then enquires is doing exactly what the site invites.
  if (!withinRateLimit(`brochure:${await clientKey()}`)) {
    return { status: "failed", reason: "rate" };
  }

  const result = validateLead({
    ...Object.fromEntries(form.entries()),
    enquiryType: brochure.country.includes("Caribbean")
      ? "caribbeanCbi"
      : "turkiyeProperty",
    subject: `Brochure request: ${brochure.name}`,
    message: `Requested the ${brochure.name} brochure — ${brochure.place}, ${brochure.country}.`,
  });
  if (!result.ok) return { status: "invalid", errors: result.errors };

  const lead: Lead = {
    ...result.lead,
    submittedAt: new Date().toISOString(),
  };

  // Awaited for the reason it is in `submitLead`: the reader is about to be
  // told this worked, and the lead is the half that has to be durable.
  try {
    await deliverLead(lead);
  } catch (error) {
    console.error("[brochure] delivery failed", error);
    return { status: "failed", reason: "server" };
  }

  after(async () => {
    const names = ["notification", "brochure"];
    const results = await Promise.allSettled([
      notifyTeam(lead),
      sendBrochure(lead, { project: brochure.name, url: brochure.url }),
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[brochure] ${names[index]} failed`, result.reason);
      }
    });
  });

  return { status: "sent" };
}

/**
 * A registration's states. The form asks for a first and a last name and a
 * consent box where an enquiry has one name field, so those three carry their
 * own errors; everything else is reported against the lead's fields as usual.
 */
export type PartnerErrors = Omit<LeadErrors, "name"> & {
  firstName?: LeadErrorKey;
  lastName?: LeadErrorKey;
  consent?: "required";
};

export type PartnerState =
  | { status: "idle" }
  | { status: "invalid"; errors: PartnerErrors }
  | { status: "failed"; reason: "rate" | "server" }
  | { status: "sent" };

/**
 * A broker or adviser registering to work with Multi Mulk, from
 * /partner-with-us.
 *
 * Delivered as an ordinary lead of kind `partnership`, so it lands in the same
 * inbox and CRM as every other enquiry rather than in a pipeline of its own
 * that someone has to remember to check. The track is folded into the subject
 * and the message, which is where the salesperson reading it looks — worded in
 * English whatever the page's language, like the rest of what the team
 * receives.
 */
export async function registerPartner(
  _previous: PartnerState,
  form: FormData,
): Promise<PartnerState> {
  if (String(form.get("company") ?? "")) return { status: "sent" };

  const verdict = verifyFormToken(form.get("t"));
  if (verdict === "too-fast" || verdict === "bad") return { status: "sent" };
  if (verdict === "stale") return { status: "failed", reason: "server" };

  if (!withinRateLimit(`partner:${await clientKey()}`)) {
    return { status: "failed", reason: "rate" };
  }

  // The track is a picker with a value always selected, so anything outside
  // the list was not sent by the page.
  const track = form.get("track");
  if (!isPartnerTrack(track)) return { status: "failed", reason: "server" };

  const firstName = String(form.get("firstName") ?? "").trim();
  const lastName = String(form.get("lastName") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const trackName = en.partners.tracks[track].title;

  const result = validateLead({
    ...Object.fromEntries(form.entries()),
    name: `${firstName} ${lastName}`.trim(),
    enquiryType: "partnership",
    subject: `Partner registration: ${trackName}`,
    // Composed, so it is never empty; a blank message is caught below.
    message: message ? `Track: ${trackName}\n\n${message}` : "",
  });

  const errors: PartnerErrors = {};
  if (!result.ok) {
    const { name, ...rest } = result.errors;
    Object.assign(errors, rest);
    if (name === "tooLong") errors.firstName = "tooLong";
  }
  if (!firstName) errors.firstName = "required";
  if (!lastName) errors.lastName = "required";
  if (form.get("consent") !== "on") errors.consent = "required";

  if (!result.ok || Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  const lead: Lead = {
    ...result.lead,
    submittedAt: new Date().toISOString(),
  };

  try {
    await deliverLead(lead);
  } catch (error) {
    console.error("[partner] delivery failed", error);
    return { status: "failed", reason: "server" };
  }

  after(async () => {
    const names = ["notification", "acknowledgement"];
    const results = await Promise.allSettled([
      notifyTeam(lead),
      acknowledgeLead(lead),
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[partner] ${names[index]} failed`, result.reason);
      }
    });
  });

  return { status: "sent" };
}
