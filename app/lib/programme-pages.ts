/**
 * What a programme page and a comparison page show beyond the data: the
 * prose of each programme, the photography of each country, and the way a
 * programme is handed to the enquiry form.
 *
 * The figures on these pages come from `programmes.ts` and are never repeated
 * here — the prose describes what a programme *is*, and leaves what it costs
 * to the record, so a threshold that changes in one place changes everywhere.
 *
 * English here, staged for translation under `dictionary.programmes.copy`,
 * keyed by the programme's `copyKey`. A language fills in what it has and the
 * rest falls back to this text.
 *
 * A leaf module: nothing here imports `routes.ts` or `content.ts`.
 */

import { comparisonRows, comparisons, type Comparison } from "./comparisons";
import { comparisonValueText } from "./format-figure";
import type { Dictionary } from "./i18n";
import type { Locale } from "./i18n/config";
import { pick, pickAll } from "./i18n/format";
import type { EnquiryType } from "./leads/schema";
import type { CountryCode, Programme } from "./programmes";

export type ProgrammePageCopy = {
  /** The line under the name in the banner. */
  tagline: string;
  /** The paragraph under it. */
  intro: string;
  about: { heading: string; paragraphs: string[] };
  /**
   * The three groups of the highlights slider: what the programme grants,
   * who it includes, and what it asks of the applicant. The numbered points
   * beside each are read from the programme record; these are the prose.
   */
  highlights: { grants: string; family: string; asks: string };
  /** One line, for the card a programme gets on other pages. */
  summary: string;
};

/** The country's name in English; `dictionary.places` carries the rest. */
export const countryNames: Record<CountryCode, string> = {
  tr: "Türkiye",
  gd: "Grenada",
  dm: "Dominica",
  kn: "St. Kitts & Nevis",
  lc: "St. Lucia",
  ag: "Antigua & Barbuda",
  ae: "United Arab Emirates",
  pt: "Portugal",
  gr: "Greece",
  mt: "Malta",
};

export type CountryImagery = {
  /** The banner frame; carries white type, so a dark one. */
  hero: string;
  /** The tall photograph beside the prose. */
  about: string;
  /** The frames the highlight slider walks. */
  frames: string[];
  /** The photograph beside the hand-off to the comparison. */
  compare: string;
};

/**
 * Photography by country, from what the site holds. The Caribbean and
 * İstanbul are well covered; Portugal, Greece and Malta are not photographed
 * at all, so their pages carry the documents rather than a place — better an
 * honest passport than somebody else's coastline.
 */
export const countryImagery: Record<CountryCode, CountryImagery> = {
  tr: {
    hero: "/images/cbi/hero-istanbul-dusk.jpg",
    about: "/images/cbi/cbi-istanbul-strait.jpg",
    frames: [
      "/images/cbi/hero-istanbul.jpg",
      "/images/cbi/cbi-istanbul-strait.jpg",
      "/images/cbi/hero-istanbul-dusk.jpg",
      "/images/cbi/cbi-documents.jpg",
    ],
    compare: "/images/cbi/cbi-passport-turkiye.jpg",
  },
  ae: {
    hero: "/images/cbi/hero-dubai-night.jpg",
    about: "/images/cbi/cbi-documents.jpg",
    frames: [
      "/images/cbi/hero-dubai-night.jpg",
      "/images/cbi/cbi-documents.jpg",
      "/images/cbi/cbi-advisory.jpg",
    ],
    compare: "/images/cbi/hero-dubai-night.jpg",
  },
  gd: {
    hero: "/images/hero-six-senses.webp",
    about: "/images/article-six-senses.avif",
    frames: [
      "/images/hero-six-senses.webp",
      "/images/cb-la-sagesse-residences.webp",
      "/images/caribbean-grenada.webp",
      "/images/hero-la-sagesse.webp",
    ],
    compare: "/images/cbi/cbi-passport-caribbean.jpg",
  },
  dm: {
    hero: "/images/cbi/hero-caribbean.jpg",
    about: "/images/cb-ic-dominica.webp",
    frames: [
      "/images/cb-ic-dominica.webp",
      "/images/cbi/hero-caribbean.jpg",
      "/images/cb-port-cabrits.png",
      "/images/cbi/cbi-caribbean-bay.webp",
    ],
    compare: "/images/cbi/cbi-passport-caribbean.jpg",
  },
  kn: {
    hero: "/images/cb-park-hyatt.webp",
    about: "/images/region-caribbean.avif",
    frames: [
      "/images/cb-park-hyatt.webp",
      "/images/region-caribbean.avif",
      "/images/cbi/cbi-caribbean-aerial.jpg",
      "/images/cbi/hero-island-dusk.jpg",
    ],
    compare: "/images/cbi/cbi-passport-caribbean.jpg",
  },
  lc: {
    hero: "/images/cbi/hero-st-lucia-soufriere.jpg",
    about: "/images/cbi/cbi-island.jpg",
    frames: [
      "/images/cbi/hero-st-lucia-soufriere.jpg",
      "/images/cbi/cbi-caribbean-bay.webp",
      "/images/cbi/hero-island-lagoon.webp",
    ],
    compare: "/images/cbi/cbi-passport-caribbean.jpg",
  },
  ag: {
    hero: "/images/cbi/cbi-caribbean-aerial.jpg",
    about: "/images/cbi/hero-island-dusk.jpg",
    frames: [
      "/images/cbi/cbi-caribbean-aerial.jpg",
      "/images/cbi/hero-island-dusk.jpg",
      "/images/cbi/cbi-island.jpg",
    ],
    compare: "/images/cbi/cbi-passport-caribbean.jpg",
  },
  pt: {
    hero: "/images/cbi/hero-passports.jpg",
    about: "/images/cbi/cbi-documents.jpg",
    frames: [
      "/images/cbi/hero-passports.jpg",
      "/images/cbi/cbi-documents.jpg",
      "/images/cbi/cbi-advisory.jpg",
    ],
    compare: "/images/cbi/hero-passports.jpg",
  },
  gr: {
    hero: "/images/cbi/hero-passports.jpg",
    about: "/images/cbi/cbi-advisory.jpg",
    frames: [
      "/images/cbi/cbi-documents.jpg",
      "/images/cbi/hero-passports.jpg",
      "/images/cbi/cbi-advisory.jpg",
    ],
    compare: "/images/cbi/hero-passports.jpg",
  },
  mt: {
    hero: "/images/cbi/about-hero-earth-night.jpg",
    about: "/images/cbi/cbi-documents.jpg",
    frames: [
      "/images/cbi/hero-passports.jpg",
      "/images/cbi/cbi-documents.jpg",
    ],
    compare: "/images/cbi/hero-passports.jpg",
  },
};

/**
 * Which enquiry an interest in the programme is filed under, so the form on
 * the page arrives knowing what it is about and the CRM routes it to the
 * right desk.
 */
export function enquiryTypeFor(programme: Programme): EnquiryType {
  if (programme.country === "tr") {
    return programme.category === "citizenship"
      ? "turkishCitizenship"
      : "turkiyeProperty";
  }
  if (["gd", "dm", "kn", "lc", "ag"].includes(programme.country)) {
    return "caribbeanCbi";
  }
  return "general";
}

/**
 * The comparison a programme is handed to — the first that includes it, in
 * the order the comparisons are listed. `undefined` for a programme in none,
 * which the page answers with the comparison index instead.
 */
export function comparisonFor(programme: Programme): Comparison | undefined {
  return comparisons.find((comparison) =>
    comparison.programmes.some(
      ([category, slug]) =>
        category === programme.category && slug === programme.slug,
    ),
  );
}

export const programmeCopy: Record<string, ProgrammePageCopy> = {
  turkiye: {
    tagline:
      "Citizenship granted outright, against a freehold property in a city of sixteen million",
    intro:
      "Türkiye’s programme grants citizenship directly — no residence, no visit, no language test — to a family that buys a qualifying property and holds it for three years.",
    about: {
      heading: "A Passport With a Property Behind It",
      paragraphs: [
        "The route is a purchase: a property bought at or above the threshold at its official valuation, its title annotated so that it cannot be sold for three years, and an application filed on the strength of it. The passport typically follows within three to six months, and the family never has to set foot in the country to receive it.",
        "It is the programme this practice does most of its work in, because the asset is real. A qualifying property in İstanbul or on the coast lets at a market yield while it is held and is sold on an open market when the holding period ends — and the passport that comes with it is a treaty passport, carrying eligibility for the United States E-2 investor visa. What it does not carry is visa-free entry to the Schengen Area, which is the single most common misunderstanding we correct.",
      ],
    },
    highlights: {
      grants:
        "Citizenship for the applicant, spouse and children under eighteen, granted directly rather than after years of residence — a passport with visa-free or visa-on-arrival access to around 110 destinations and eligibility for the United States E-2 treaty investor visa. Dual citizenship is recognised.",
      family:
        "Spouse and children under eighteen are included in the one application. Parents and adult children are not, and would apply in their own right.",
      asks:
        "A property bought at or above the threshold at its official valuation, held for three years under a no-sale annotation on the title. No minimum stay, no visit and no language test — the paperwork is what sets the timeline.",
    },
    summary:
      "Citizenship in months against a freehold property held for three years.",
  },

  "turkiye-residency": {
    tagline:
      "A renewable residence permit on a property, at half the citizenship threshold",
    intro:
      "Own a property in Türkiye at the qualifying value and the family receives a short-term residence permit — renewable for as long as the property is held, and a base from which citizenship by residence can be sought after five years.",
    about: {
      heading: "The Permit Behind the Passport",
      paragraphs: [
        "The short-term residence permit is Türkiye’s residency route for property owners. A property at or above the qualifying value, registered in the applicant’s name, earns a permit for the applicant, spouse and children under eighteen — granted in weeks rather than months, and renewed for as long as the property is kept.",
        "It suits a family that wants a base in Türkiye rather than a passport, or whose budget sits below the citizenship threshold. It is a permit, not a nationality: it carries no visa-free travel of its own, it expects the holder to actually live in the country, and the road from it to citizenship runs five years of residence with time genuinely spent in Türkiye. A family whose objective is the passport is usually better served by the citizenship programme from the start.",
      ],
    },
    highlights: {
      grants:
        "A short-term residence permit for the family, renewed while the property is held — the right to live in Türkiye, open accounts, enrol children in school and, in time, apply for citizenship by residence. It is not a passport and carries no visa-free travel of its own.",
      family:
        "Spouse and children under eighteen are included; each holds a permit of their own, tied to the same property.",
      asks:
        "A property at or above the threshold, kept for as long as the permit is to be renewed, and a first application made in person — a permit, unlike citizenship, expects the holder to be in the country.",
    },
    summary:
      "A renewable residence permit against a property, at half the citizenship threshold.",
  },

  "uae-golden-visa": {
    tagline:
      "Ten years of residence in Dubai, renewable, with no employer and no minimum stay",
    intro:
      "The Golden Residence is a long-term visa granted on a property of two million dirhams: a decade of residence for the whole family, renewed for as long as the property is held, in a jurisdiction with no tax on worldwide income.",
    about: {
      heading: "A Base in the Gulf, Held on a Property",
      paragraphs: [
        "The property route is the simplest of the Golden Residence’s categories: a completed property with a title deed at or above the threshold, registered in the applicant’s name, and an application through the federal authority. The visa runs ten years and is renewed on the same property; the family is sponsored under it; and the holder is exempt from the six-month absence rule that cancels an ordinary residence visa.",
        "It is a residence, not a nationality, and it should be chosen for what it is: a legal base in Dubai without an employer, no tax on income earned anywhere in the world, and a property that lets at a market yield while it is held. Many of our clients hold it alongside a Turkish passport — the two answer different questions, and they are not exclusive.",
      ],
    },
    highlights: {
      grants:
        "A ten-year residence visa, renewable, for the applicant and the family, with no employer sponsor and no minimum time in the country — the six-month absence rule does not apply to it. It is a residence, not a nationality, and carries no passport.",
      family:
        "Spouse, children of any age and parents can all be sponsored under the one property, and domestic staff alongside them.",
      asks:
        "A completed property with a title deed at or above the threshold, held in the applicant’s name for as long as the visa is to be renewed; a medical test and an Emirates ID on arrival.",
    },
    summary:
      "A ten-year, renewable residence for the family on a Dubai property.",
  },

  grenada: {
    tagline:
      "The Caribbean passport that opens the United States as well as Europe",
    intro:
      "Grenada’s programme grants citizenship in four to six months against a share in an approved resort — and its passport is the only one in the region that carries the United States E-2 treaty investor visa and visa-free entry to China.",
    about: {
      heading: "The Spice Island’s Programme",
      paragraphs: [
        "Grenada offers two routes: a contribution to the National Transformation Fund, which is gone once it is paid, or a share in a government-approved real-estate development, held for five years and then sold on. The approved developments are branded resorts on the island’s coast, so the real-estate route buys a piece of a hotel that an operator runs and lets — nothing to manage from abroad.",
        "What sets Grenada apart is where the passport reaches. It is the only Caribbean programme whose country holds a treaty with the United States giving its citizens access to the E-2 investor visa, and one of the few with visa-free entry to China. Family inclusion is among the broadest in the region, no residence or visit is required, and citizenship passes to future generations.",
      ],
    },
    highlights: {
      grants:
        "Citizenship granted directly, with visa-free or visa-on-arrival access to around 140 destinations including the Schengen Area, the United Kingdom and China, and eligibility for the United States E-2 treaty investor visa — the only Caribbean programme with it. The passport passes to future generations.",
      family:
        "Spouse, children up to thirty and parents or grandparents over fifty-five can be included in the one application; unmarried siblings can be added under conditions.",
      asks:
        "An approved real-estate share held for five years, or a non-refundable contribution; due diligence and an interview for every adult applicant; no visit, no residence and no language test.",
    },
    summary:
      "Citizenship in four to six months, with the only E-2 treaty in the Caribbean.",
  },

  dominica: {
    tagline: "The lowest entry to a Caribbean citizenship, on the Nature Island",
    intro:
      "Dominica’s programme, running since 1993, grants citizenship in four to six months at the lowest threshold in the region — as a contribution to the Economic Diversification Fund, or as a share in an approved resort held for five years.",
    about: {
      heading: "The Nature Island’s Programme",
      paragraphs: [
        "Dominica has run its programme for over thirty years, and it is the one most often chosen on cost: the contribution route is the cheapest second citizenship in the Caribbean, and the real-estate route, at the same figure, leaves a share in an approved resort behind. The approved developments are branded — the InterContinental on Douglas Bay and the marina beside it — and the operator lets the share while it is held.",
        "Since 2023 every adult applicant is interviewed, which lengthened the timeline by a few weeks and strengthened the passport’s standing at the borders that matter. No residence or visit is otherwise required, the island does not tax income earned abroad, and citizenship passes to the next generation.",
      ],
    },
    highlights: {
      grants:
        "Citizenship granted directly, with visa-free or visa-on-arrival access to around 140 destinations including the Schengen Area and the United Kingdom, dual citizenship recognised, and no tax on income earned outside the island. The passport passes to the next generation.",
      family:
        "Spouse, children up to thirty and parents or grandparents over fifty-five can be included in one application; a sibling can be added under conditions.",
      asks:
        "A contribution to the Economic Diversification Fund, or an approved real-estate share held for five years; due diligence and an interview for every applicant over sixteen; no residence and no language test.",
    },
    summary:
      "The region’s lowest threshold, on a programme running since 1993.",
  },

  "st-kitts-and-nevis": {
    tagline:
      "The world’s first citizenship-by-investment programme, running since 1984",
    intro:
      "St. Kitts & Nevis wrote the model the rest of the region followed: citizenship in six to eight months against a contribution to the Sustainable Island State fund or an approved property, with the most widely recognised passport in the Caribbean.",
    about: {
      heading: "The Original Programme",
      paragraphs: [
        "Forty years of operation is the programme’s real asset. Border officials, banks and other governments know the St. Kitts & Nevis passport, which is why it travels furthest of the five — around 155 destinations without a visa, the Schengen Area and the United Kingdom among them. The routes are a contribution to the Sustainable Island State fund, or an approved property — a share in a resort development, or a private home at a higher threshold — held for the required term.",
        "The 2023 reforms raised thresholds and introduced interviews and stricter due diligence across the federation, and the programme is the more credible for it. No residence or visit is required, there is no tax on worldwide income, and the two islands — St. Kitts with its estates and Christophe Harbour, Nevis with its plantation inns — are among the region’s most established addresses.",
      ],
    },
    highlights: {
      grants:
        "Citizenship granted directly, with visa-free or visa-on-arrival access to around 155 destinations including the Schengen Area and the United Kingdom, dual citizenship recognised, and no tax on worldwide income. The passport is the region’s most established at a border.",
      family:
        "Spouse, dependent children and dependent parents can be included in one application, with siblings added under conditions.",
      asks:
        "A contribution to the Sustainable Island State fund, or an approved property held for the required term; due diligence and an interview for adult applicants; no residence and no language test.",
    },
    summary:
      "The region’s original programme, with the widest-travelling passport.",
  },

  "st-lucia": {
    tagline: "The youngest Caribbean programme, with the widest choice of routes",
    intro:
      "Saint Lucia’s programme, opened in 2015, grants citizenship in six to twelve months through a contribution to the National Economic Fund, an approved property, or government bonds — the broadest set of routes in the region.",
    about: {
      heading: "The Newest of the Five",
      paragraphs: [
        "Saint Lucia learned from its neighbours and offers every route they do, and one they do not: government bonds, held to term and returned in full, for an applicant who wants a passport without giving the capital away. The contribution route is the cheapest; the real-estate route buys into approved developments on an island whose tourism is its largest industry.",
        "Processing is the region’s longest, at six to twelve months, and every adult applicant is interviewed. In return: a passport with visa-free or visa-on-arrival access to around 147 destinations, no residence requirement, no tax on income earned abroad, and one of the Caribbean’s most photographed coastlines to hold a share of.",
      ],
    },
    highlights: {
      grants:
        "Citizenship granted directly, with visa-free or visa-on-arrival access to around 147 destinations including the Schengen Area and the United Kingdom, dual citizenship recognised, and no tax on income earned abroad.",
      family:
        "Spouse, children up to thirty and parents over fifty-five can be included in the one application, with siblings added under conditions.",
      asks:
        "A contribution to the National Economic Fund, an approved property held for five years, or government bonds held to term; due diligence and an interview for adult applicants; no residence and no language test.",
    },
    summary: "Three routes to citizenship in six to twelve months.",
  },

  "antigua-and-barbuda": {
    tagline:
      "The programme for larger families, with five days on the islands to keep the passport",
    intro:
      "Antigua & Barbuda grants citizenship in three to six months against a contribution to the National Development Fund or an approved property — and is the one Caribbean programme that asks its new citizens to spend five days in the country within the first five years.",
    about: {
      heading: "Twin Islands, One Programme",
      paragraphs: [
        "Antigua & Barbuda’s programme is the quickest of the five and the one priced for larger families: the National Development Fund contribution covers a family of four at one figure, and the University of the West Indies fund route covers a family of six or more, with a scholarship place at the university included. The real-estate route buys into approved resort and residential developments on an island of 365 beaches.",
        "It is also the one programme in the region with a residence condition, modest as it is — five days on the islands within the first five years — and an oath of allegiance taken in person or at an embassy. Both are easily met, and both are worth knowing about before an application rather than after.",
      ],
    },
    highlights: {
      grants:
        "Citizenship granted directly, with visa-free or visa-on-arrival access to around 150 destinations including the Schengen Area and the United Kingdom, dual citizenship recognised, and no tax on worldwide income.",
      family:
        "Spouse, children up to thirty and parents over fifty-five can be included; for families of six or more, the University of the West Indies fund route is priced for the whole family and carries a scholarship place.",
      asks:
        "A contribution to the National Development Fund or an approved property held for five years, five days on the islands within the first five years, and an oath of allegiance; due diligence and an interview for every adult applicant.",
    },
    summary:
      "Citizenship in three to six months, priced for larger families.",
  },

  "portugal-golden-visa": {
    tagline:
      "A Schengen residence with a week a year in the country — and a long road to the passport",
    intro:
      "Portugal’s residence permit for investment no longer runs on property: since 2023 it is granted against a subscription to a qualifying fund or a donation, with an average of seven days a year in the country to renew it and, under the current nationality law, ten years and a language test before citizenship can be sought.",
    about: {
      heading: "Europe’s Best-Known Golden Visa, Changed",
      paragraphs: [
        "For a decade the Portuguese golden visa meant a flat in Lisbon or Porto and a residence card. The property route closed in October 2023; what remains is a subscription to a qualifying investment or venture-capital fund, a donation to research or culture, or a job-creating business. The permit is granted for two years and renewed, the family is included, and the residence requirement is an average of seven days a year.",
        "Two things have changed the calculation. Processing at the immigration agency has run to a year or more for first approvals, and the nationality law now sets ten years of legal residence and a Portuguese language test before citizenship can be sought. A Schengen residence with almost no presence obligation is still a real thing to hold; a European passport is no longer the near-term reason to hold it. This is a programme we refer rather than transact.",
      ],
    },
    highlights: {
      grants:
        "A Portuguese residence permit, renewable, that lets the family live in Portugal and travel the Schengen Area — with only an average of seven days a year in the country required to keep it. A passport can be sought after ten years’ legal residence and a Portuguese language test.",
      family:
        "Spouse, dependent children and dependent parents can be included and hold permits of their own.",
      asks:
        "A qualifying fund subscription or donation held for the life of the permit, an average of seven days a year in Portugal, biometrics in person, and patience: first approvals have been running to a year or more.",
    },
    summary:
      "A Schengen residence on a fund subscription, with citizenship ten years away.",
  },

  "greece-golden-visa": {
    tagline: "A five-year Schengen residence on a property, with no minimum stay",
    intro:
      "Greece’s Golden Visa grants a five-year residence permit, renewable for as long as the property is held, against a purchase from the lowest tier in some areas and considerably more in Athens, Thessaloniki and the popular islands — with no minimum time in the country.",
    about: {
      heading: "The Property Route Europe Still Sells",
      paragraphs: [
        "Greece is the European golden visa that still runs on a property. Since 2024 the threshold depends on where the property is — the highest tier in Attica, Thessaloniki, Mykonos, Santorini and the larger islands, a middle tier elsewhere, and the lowest for conversions of commercial buildings and restorations of listed ones — and the permit runs five years, renewed while the property is held. Short-term letting of a golden-visa property is restricted, which matters for anyone buying it to earn.",
        "There is no minimum stay, the whole family is included, and the Schengen Area is open to the holder. Citizenship is a separate matter: seven years of actual residence and a Greek language test, which is not what most golden-visa holders have in mind. It is a route we refer rather than transact, and the comparison with the UAE and Türkiye is the one worth reading before choosing it.",
      ],
    },
    highlights: {
      grants:
        "A five-year residence permit, renewable while the property is held, for the family, with free movement in the Schengen Area and no minimum time in Greece. Citizenship can be sought after seven years of actual residence and a Greek language test.",
      family:
        "Spouse, children under twenty-one and the parents of both spouses can be included.",
      asks:
        "A property at the threshold for its area — the lowest tier for conversions and restorations, the highest for Athens, Thessaloniki and the popular islands — held for as long as the permit is to be renewed; biometrics in person and health insurance in Greece.",
    },
    summary:
      "A five-year Schengen residence on a property, with no minimum stay.",
  },

  malta: {
    tagline:
      "An EU citizenship by naturalisation for exceptional services — suspended since the 2025 ruling",
    intro:
      "Malta’s route to citizenship through investment was the only one inside the European Union. The Court of Justice of the EU ruled against it in April 2025, and the programme is suspended while Malta rewrites it; nothing described here can be applied for today.",
    about: {
      heading: "The EU Passport That Was",
      paragraphs: [
        "As it ran, the programme granted Maltese citizenship — and with it the right to live and work anywhere in the European Union — after a period of residence and the most searching due diligence of any programme in the world: a contribution to the national development fund, a property bought or leased for five years, a charitable donation, and twelve or thirty-six months of residence before naturalisation.",
        "It is listed here rather than left out because readers ask about it constantly, and “we do not mention it” is not an answer to “is it open?”. It is not. A family whose objective is a second citizenship is better served today by Türkiye or the Caribbean; one whose objective is a European address, by Greece or Portugal — and the comparisons on this site are the place to weigh them.",
      ],
    },
    highlights: {
      grants:
        "When open, it granted Maltese — and therefore EU — citizenship after a period of residence: free movement and settlement anywhere in the Union, and one of the strongest passports in the world. No application is accepted while the programme is suspended.",
      family:
        "Spouse, children and dependent parents and grandparents could be included.",
      asks:
        "A contribution to the national development fund, a property bought or leased for five years, a charitable donation, and twelve to thirty-six months of residence before naturalisation — under the most searching due diligence of any programme.",
    },
    summary: "The EU’s only investment citizenship, suspended since 2025.",
  },
};

export function getProgrammeCopy(programme: Programme): ProgrammePageCopy {
  const copy = programmeCopy[programme.copyKey];
  if (!copy) {
    throw new Error(`No page copy for programme "${programme.copyKey}".`);
  }
  return copy;
}

/**
 * The prose of a programme in the reader's language: each line falls back to
 * the English above through `pick`, so a programme reads whole in a language
 * that has translated none of it yet.
 */
export function localiseProgramme(t: Dictionary, programme: Programme) {
  const source = getProgrammeCopy(programme);
  const copy = t.programmes.copy[programme.copyKey];
  return {
    tagline: pick(copy?.tagline, source.tagline),
    intro: pick(copy?.intro, source.intro),
    aboutHeading: pick(copy?.aboutHeading, source.about.heading),
    aboutParagraphs: pickAll(copy?.aboutParagraphs, source.about.paragraphs),
    grants: pick(copy?.highlights?.grants, source.highlights.grants),
    family: pick(copy?.highlights?.family, source.highlights.family),
    asks: pick(copy?.highlights?.asks, source.highlights.asks),
    summary: pick(copy?.summary, source.summary),
  };
}

/**
 * The figures an answer engine is asked about most, in the order a reader
 * weighs them: what it costs, how long it takes, what it grants, whom it
 * covers. One list, so the key-facts block, its structured data and the hub's
 * questions cannot state a programme differently.
 */
export const keyFactRows = [
  "minimumInvestment",
  "holdingPeriod",
  "processingTime",
  "visaFree",
  "schengen",
  "residencyRequired",
  "physicalVisit",
  "dependentChildren",
  "parentsIncluded",
  "citizenshipAfter",
  "worldwideTax",
] as const;

/**
 * A programme's confirmed figures as label/value pairs, in the order given,
 * skipping any the record has not confirmed — an answer of "Not confirmed" is
 * not an answer.
 */
export function programmeFacts(
  locale: Locale,
  t: Dictionary,
  programme: Programme,
  keys: readonly string[] = keyFactRows,
): { key: string; label: string; value: string }[] {
  const facts: { key: string; label: string; value: string }[] = [];
  for (const key of keys) {
    const row = comparisonRows.find((r) => r.key === key);
    if (!row) continue;
    const value = row.read(programme);
    if (value.kind === "unknown") continue;
    facts.push({
      key,
      label: t.compare.rows[key as keyof typeof t.compare.rows],
      value: comparisonValueText(locale, t, value),
    });
  }
  return facts;
}

/**
 * Three of a programme's figures as one-line points — "Minimum investment:
 * US$270,000" — taken in the order given and skipping any the record has not
 * confirmed. A point that reads "Not confirmed" is not a highlight, so the
 * next known figure takes its place.
 */
export function programmePoints(
  locale: Locale,
  t: Dictionary,
  programme: Programme,
  keys: readonly string[],
  count = 3,
): string[] {
  return programmeFacts(locale, t, programme, keys)
    .slice(0, count)
    .map((fact) => `${fact.label}: ${fact.value}`);
}
