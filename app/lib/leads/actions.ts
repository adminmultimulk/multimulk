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
import {
  documentFile,
  libraryDocuments,
} from "../documents";
import en from "../i18n/dictionaries/en";
import { isLocale } from "../i18n/config";
import { isPartnerType } from "../partners";
import {
  cheapestOfferedRoute,
  getProgramme,
  isPublishable,
  parseProgrammeKey,
} from "../programmes";
import {
  budgetLabels,
  cityNames,
  cityOpen,
  isRoadshowBudget,
  isRoadshowCity,
  isRoadshowSlot,
  roadshowDates,
  slotRange,
  type RoadshowCity,
  type RoadshowSlot,
} from "../roadshow";
import { absoluteUrl } from "../site";
import {
  costAssumptions,
  costLines,
  costTotal,
} from "../tools/cost";
import { composePhone, type ComposedPhone } from "./phone";
import {
  isEmail,
  validateLead,
  type Lead,
  type LeadErrorKey,
  type LeadErrors,
} from "./schema";
import { acknowledgeLead } from "./ack";
import { sendBrochure } from "./brochure";
import { sendCalculatorReport } from "./calculator-report";
import { sendGuide } from "./guide";
import { sendRoadshowConfirmation } from "./roadshow";
import { deliverLead } from "./sink";
import { notifyTeam } from "./notify";
import { withinRateLimit } from "./rate-limit";
import { mintFormToken, verifyFormToken } from "./token";

/** The guide `/free-guide` always delivers. Kept here so the action cannot
 *  be pointed at an arbitrary PDF by rewriting the form. */
const FREE_GUIDE_SLUG = "turkiye-citizenship-guide";

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

/** Same states as a brochure request: the asset arrives by email. */
export type MagnetState =
  | { status: "idle" }
  | { status: "invalid"; errors: LeadErrors }
  | { status: "failed"; reason: "rate" | "server" }
  | { status: "sent" };

/**
 * A free-guide request from `/free-guide`: three fields on screen, a lead in
 * the inbox, and the guide PDF in the reader's email.
 */
export async function requestGuide(
  _previous: MagnetState,
  form: FormData,
): Promise<MagnetState> {
  const doc = libraryDocuments.find((item) => item.slug === FREE_GUIDE_SLUG);
  if (!doc) return { status: "failed", reason: "server" };

  if (String(form.get("company") ?? "")) return { status: "sent" };

  const verdict = verifyFormToken(form.get("t"));
  if (verdict === "too-fast" || verdict === "bad") return { status: "sent" };
  if (verdict === "stale") return { status: "failed", reason: "server" };

  if (!withinRateLimit(`guide:${await clientKey()}`)) {
    return { status: "failed", reason: "rate" };
  }

  const title =
    en.documents.items[FREE_GUIDE_SLUG as keyof typeof en.documents.items]
      ?.title ?? FREE_GUIDE_SLUG;

  const result = validateLead({
    ...Object.fromEntries(form.entries()),
    enquiryType: "guide",
    subject: `Free guide request: ${title}`,
    message: `Requested the free guide “${title}”.`,
  });
  if (!result.ok) return { status: "invalid", errors: result.errors };

  const lead: Lead = {
    ...result.lead,
    submittedAt: new Date().toISOString(),
  };

  try {
    await deliverLead(lead);
  } catch (error) {
    console.error("[guide] delivery failed", error);
    return { status: "failed", reason: "server" };
  }

  after(async () => {
    const names = ["notification", "guide"];
    const results = await Promise.allSettled([
      notifyTeam(lead),
      sendGuide(lead, {
        title,
        url: absoluteUrl(documentFile(FREE_GUIDE_SLUG)),
      }),
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[guide] ${names[index]} failed`, result.reason);
      }
    });
  });

  return { status: "sent" };
}

/**
 * A calculator-result request from `/calculator-result`: the all-in estimate
 * is recomputed server-side from the programme slug and family size, so the
 * emailed numbers cannot be forged from the form.
 */
export async function requestCalculatorReport(
  _previous: MagnetState,
  form: FormData,
): Promise<MagnetState> {
  if (String(form.get("company") ?? "")) return { status: "sent" };

  const verdict = verifyFormToken(form.get("t"));
  if (verdict === "too-fast" || verdict === "bad") return { status: "sent" };
  if (verdict === "stale") return { status: "failed", reason: "server" };

  if (!withinRateLimit(`calculator:${await clientKey()}`)) {
    return { status: "failed", reason: "rate" };
  }

  const key = parseProgrammeKey(String(form.get("programme") ?? "").trim());
  const adults = clampInt(form.get("adults"), 1, 2, 2);
  const children = clampInt(form.get("children"), 0, 4, 0);
  const programme = key ? getProgramme(key.category, key.slug) : undefined;
  const route =
    programme && isPublishable(programme)
      ? cheapestOfferedRoute(programme)
      : undefined;
  if (!programme || !route) return { status: "failed", reason: "server" };

  const people = adults + children;
  const lines = costLines(route.minimum.amount, people);
  const total = costTotal(lines);

  const result = validateLead({
    ...Object.fromEntries(form.entries()),
    enquiryType: "calculator",
    subject: `Calculator report: ${programme.officialName}`,
    message: [
      `Requested the all-in cost estimate for ${programme.officialName}.`,
      `Adults: ${adults}. Children under 18: ${children}.`,
      `Estimated total: ${route.minimum.currency} ${Math.round(total).toLocaleString("en-GB")}.`,
      `Assumes ${costAssumptions.transferTaxRate * 100}% transfer tax, ${costAssumptions.legalFees} legal, ${costAssumptions.documentation} documentation, ${costAssumptions.governmentFeePerPerson} government fee per person.`,
    ].join("\n"),
  });
  if (!result.ok) return { status: "invalid", errors: result.errors };

  const lead: Lead = {
    ...result.lead,
    submittedAt: new Date().toISOString(),
  };

  try {
    await deliverLead(lead);
  } catch (error) {
    console.error("[calculator] delivery failed", error);
    return { status: "failed", reason: "server" };
  }

  after(async () => {
    const names = ["notification", "report"];
    const results = await Promise.allSettled([
      notifyTeam(lead),
      sendCalculatorReport(lead, {
        programmeName: programme.officialName,
        adults,
        children,
        currency: route.minimum.currency,
        lines,
        total,
      }),
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[calculator] ${names[index]} failed`, result.reason);
      }
    });
  });

  return { status: "sent" };
}

/**
 * A roadshow registration's states. The three choices are reported apart from
 * the lead's own fields, and a sent registration carries what was booked so the
 * form can hand it to the thank-you page.
 */
export type RoadshowErrors = LeadErrors & {
  city?: "required" | "closed";
  slot?: "required";
  budget?: "required";
};

export type RoadshowState =
  | { status: "idle" }
  | { status: "invalid"; errors: RoadshowErrors }
  | { status: "failed"; reason: "rate" | "server" }
  | { status: "sent"; city: RoadshowCity; slot: RoadshowSlot };

/**
 * A request for a private meeting at the Pakistan roadshow, from
 * `/events/pakistan-roadshow-2026`.
 *
 * Delivered as an ordinary lead of kind `roadshow`, with the city and date in
 * the subject — what a salesperson scanning the CRM sorts by — and the slot
 * and budget in the message. The exact time and venue are confirmed by the
 * team afterwards, so nothing here books a slot or checks capacity.
 */
export async function registerRoadshow(
  _previous: RoadshowState,
  form: FormData,
): Promise<RoadshowState> {
  const city = form.get("city");
  const slot = form.get("slot");
  const budget = form.get("budget");

  // A bot is thanked with a plausible booking rather than told what gave it
  // away; nothing is stored or sent.
  const decoy = { status: "sent", city: "lahore", slot: "morning" } as const;
  if (String(form.get("company") ?? "")) return decoy;

  const verdict = verifyFormToken(form.get("t"));
  if (verdict === "too-fast" || verdict === "bad") return decoy;
  if (verdict === "stale") return { status: "failed", reason: "server" };

  if (!withinRateLimit(`roadshow:${await clientKey()}`)) {
    return { status: "failed", reason: "rate" };
  }

  const choiceErrors: RoadshowErrors = {};
  if (!isRoadshowCity(city)) choiceErrors.city = "required";
  // Checked here as well as in the form: the page is regenerated every few
  // minutes, so a tab left open overnight can still offer yesterday's city.
  else if (!cityOpen(city)) choiceErrors.city = "closed";
  if (!isRoadshowSlot(slot)) choiceErrors.slot = "required";
  if (!isRoadshowBudget(budget)) choiceErrors.budget = "required";

  const cityName = isRoadshowCity(city) ? cityNames[city] : "";
  const result = validateLead({
    ...Object.fromEntries(form.entries()),
    enquiryType: "roadshow",
    subject: isRoadshowCity(city)
      ? `Pakistan Roadshow: ${cityName}, ${roadshowDates[city]}`
      : "Pakistan Roadshow",
    message: [
      isRoadshowCity(city) ? `City: ${cityName} — ${roadshowDates[city]}` : "",
      isRoadshowSlot(slot) ? `Preferred time: ${slot} (${slotRange(slot)} PKT)` : "",
      isRoadshowBudget(budget) ? `Budget: ${budgetLabels[budget]}` : "",
    ]
      .filter(Boolean)
      .join("\n") || "Pakistan Roadshow registration",
  });

  if (
    !result.ok ||
    Object.keys(choiceErrors).length > 0 ||
    !isRoadshowCity(city) ||
    !isRoadshowSlot(slot)
  ) {
    return {
      status: "invalid",
      errors: { ...(result.ok ? {} : result.errors), ...choiceErrors },
    };
  }

  const lead: Lead = {
    ...result.lead,
    submittedAt: new Date().toISOString(),
  };

  try {
    await deliverLead(lead);
  } catch (error) {
    console.error("[roadshow] delivery failed", error);
    return { status: "failed", reason: "server" };
  }

  after(async () => {
    const names = ["notification", "confirmation"];
    const results = await Promise.allSettled([
      notifyTeam(lead),
      sendRoadshowConfirmation(lead, { city, slot }),
    ]);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[roadshow] ${names[index]} failed`, result.reason);
      }
    });
  });

  return { status: "sent", city, slot };
}

function clampInt(
  raw: FormDataEntryValue | null,
  min: number,
  max: number,
  fallback: number,
): number {
  const value = Number(String(raw ?? ""));
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * A registration's states. The form has fields of its own — one for name and
 * company, one contact field taking an email or a WhatsApp number, the
 * partnership type and the markets served — so it reports against those
 * rather than the lead's.
 */
export type PartnerErrors = {
  name?: LeadErrorKey;
  /** `contact`: neither an email address nor an international number. */
  contact?: "required" | "contact" | "tooLong";
  type?: "required";
  markets?: LeadErrorKey;
  message?: LeadErrorKey;
};

export type PartnerState =
  | { status: "idle" }
  | { status: "invalid"; errors: PartnerErrors }
  | { status: "failed"; reason: "rate" | "server" }
  | { status: "sent" };

/** Ceilings for the fields only this form has; see `limits` in `./schema`. */
const partnerLimits = { name: 160, contact: 254, markets: 500, message: 5000 };

/**
 * A broker or adviser registering to work with Multi Mulk, from
 * /partner-with-us.
 *
 * Delivered as an ordinary lead of kind `partnership`, so it lands in the same
 * inbox and CRM as every other enquiry rather than in a pipeline of its own
 * that someone has to remember to check. The partnership type is folded into
 * the subject, and it and the markets into the message, which is where the
 * salesperson reading it looks — worded in English whatever the page's
 * language, like the rest of what the team receives.
 *
 * The contact field takes an email address or a phone number. A number has to
 * carry its country code: there is no country picker beside it, and guessing
 * one from the page's language would file a Lahore broker's number under
 * Türkiye.
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

  const field = (key: string) => String(form.get(key) ?? "").trim();
  const name = field("name");
  const contact = field("contact");
  const type = form.get("type");
  const markets = field("markets");
  const message = field("message");

  const errors: PartnerErrors = {};

  if (!name) errors.name = "required";
  else if (name.length > partnerLimits.name) errors.name = "tooLong";

  let email = "";
  let phone: ComposedPhone | null = null;
  if (!contact) errors.contact = "required";
  else if (contact.length > partnerLimits.contact) errors.contact = "tooLong";
  else if (contact.includes("@")) {
    if (isEmail(contact)) email = contact;
    else errors.contact = "contact";
  } else {
    // The `+` (or `00`) is what makes the country explicit; `composePhone`
    // then reads it off the number and the country passed here is ignored.
    phone = /^\s*(\+|00)/.test(contact) ? composePhone("TR", contact) : null;
    if (!phone) errors.contact = "contact";
  }

  if (!isPartnerType(type)) errors.type = "required";

  if (!markets) errors.markets = "required";
  else if (markets.length > partnerLimits.markets) errors.markets = "tooLong";

  if (message.length > partnerLimits.message) errors.message = "tooLong";

  if (Object.keys(errors).length > 0 || !isPartnerType(type)) {
    return { status: "invalid", errors };
  }

  const submitted = field("locale");
  const typeName = en.partners.form.types[type];

  const lead: Lead = {
    name,
    email,
    phone: phone?.phone ?? "",
    ...(phone ? { phoneCountry: phone.country, phoneCode: phone.code } : {}),
    enquiryType: "partnership",
    subject: `Partnership enquiry: ${typeName}`,
    message: [
      `Partnership type: ${typeName}`,
      `Markets / client groups: ${markets}`,
      "",
      message || "(No message.)",
    ].join("\n"),
    locale: isLocale(submitted) ? submitted : "en",
    source: { path: field("path") || "/" },
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
