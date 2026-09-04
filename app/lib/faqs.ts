/**
 * The questions people actually ask, answered one at a time.
 *
 * Separate from the eight FAQs bolted to each programme page, because those
 * are a section and these are a destination: someone searching "can I sell my
 * property after three years" wants the answer, not a programme brochure with
 * the answer somewhere inside it.
 *
 * Only a question with a substantial answer earns its own page. `slug` is what
 * grants that; without it a question lives on the hub and in the programme's
 * FAQ section only. The bar exists because a thin page per question is how a
 * useful hub turns into a hundred near-duplicates.
 */

import { DEFAULT_REVIEW_DAYS, type LegalReview } from "./review";

export type FaqTopic =
  | "eligibility"
  | "cost"
  | "timeline"
  | "family"
  | "property"
  | "tax"
  | "process"
  | "travel";

export const faqTopics: FaqTopic[] = [
  "eligibility",
  "cost",
  "timeline",
  "family",
  "property",
  "tax",
  "process",
  "travel",
];

export type Faq = {
  id: string;
  topics: FaqTopic[];
  /** Programme slugs this is specific to. Empty means it applies generally. */
  programmes: string[];
  question: string;
  /** Paragraphs. The first is the short answer, and is used on the hub. */
  answer: string[];
  /** Present only where the answer earns an indexable page of its own. */
  slug?: string;
  /** Required wherever the answer makes a legal or financial claim. */
  review?: LegalReview;
};

const sourced = (label: string, url: string): LegalReview => ({
  reviewedOn: "2026-09-02",
  reviewedBy: "advisory-team",
  sources: [{ label, url, retrievedOn: "2026-09-02" }],
  reviewEveryDays: DEFAULT_REVIEW_DAYS,
});

const MM = (slug: string) => `https://multimulk.com/${slug}/`;

/**
 * Answers are written to end. A question answered with "it depends, contact
 * us" is not answered, and it is the pattern that makes most advisory FAQs
 * useless — so where the answer is genuinely conditional, the conditions are
 * stated.
 */
export const faqs: Faq[] = [
  {
    id: "tr-can-i-sell-after-three-years",
    slug: "can-i-sell-my-property-after-three-years",
    topics: ["property", "process"],
    programmes: ["turkiye"],
    question:
      "Can I sell my property after the three-year holding period, and does it affect my citizenship?",
    answer: [
      "Yes. Once the three-year annotation on the title deed expires you may sell freely, and the citizenship already granted is not affected — it is permanent and does not depend on continuing to hold the asset.",
      "The three years run from the date the holding commitment is annotated on the title deed at the land registry, not from the date you applied or the date the passport was issued. People routinely misremember this, and the gap between the two dates can be several months.",
      "Selling earlier does put the application at risk. If the sale happens before the annotation lapses and the citizenship has already been granted, it can be reviewed. If it happens while the application is still in progress, the application fails.",
      "What the holding period does not restrict is use. You may rent the property out for the whole three years, and most investors do — the rental income is unaffected by the annotation.",
    ],
    review: sourced(
      "Multi Mulk — Can you sell property after 3 years? Türkiye CBI exit strategy",
      MM("can-you-sell-property-after-3-years-turkey-cbi-exit-strategy"),
    ),
  },
  {
    id: "tr-two-properties",
    slug: "can-i-combine-two-properties",
    topics: ["property", "eligibility"],
    programmes: ["turkiye"],
    question:
      "Can I combine two or more properties to reach the USD 400,000 threshold?",
    answer: [
      "Yes. The threshold is met by the combined value of the properties, not by any single one, and there is no rule requiring one deed.",
      "The conditions are that every property is bought in the same application, each is independently valued by a licensed appraiser, and each receives the three-year annotation. Buying one now and another next year does not work — the purchases must belong to one application.",
      "There is a practical argument against splitting, though. Two smaller units mean two valuations, two sets of transfer costs and two exit transactions, and small units in the same building compete with each other on resale. Where the budget allows one property that clears the threshold on its own, that is usually the better asset.",
    ],
    review: sourced(
      "Multi Mulk — Can you split the requirement across two properties?",
      MM("turkey-citizenship-by-investment-400000-can-you-split-the-requirement-across-two-properties"),
    ),
  },
  {
    id: "tr-residency-requirement",
    slug: "do-i-need-to-live-in-turkiye",
    topics: ["travel", "eligibility"],
    programmes: ["turkiye"],
    question: "Do I need to live in or even visit Türkiye to qualify?",
    answer: [
      "No. There is no residency requirement before or after citizenship, no minimum stay to keep it, and no language test or interview.",
      "The purchase itself can be completed by a lawyer acting under power of attorney, so the entire route can run without you leaving home. In practice most clients do visit — to see what they are buying — but it is a choice, not a condition.",
      "This is the single largest structural difference between Türkiye and the European residency programmes, which generally require you to establish and maintain an actual presence.",
    ],
    review: sourced(
      "Multi Mulk — Turkish Citizenship by Investment guide, 2026 edition",
      MM("turkish-citizenship-by-investment-guide-2026-edition"),
    ),
  },
  {
    id: "tr-family",
    topics: ["family"],
    programmes: ["turkiye"],
    question: "Who can be included in my application?",
    answer: [
      "You, your spouse and your children under 18 are covered by a single application and a single threshold. No additional investment is required for them.",
      "Children over 18 must qualify on their own investment. A child born after citizenship is granted is Turkish from birth. Parents cannot be included.",
    ],
    review: sourced(
      "Multi Mulk — Türkiye citizenship for families",
      MM("turkey-citizenship-for-families-benefits-facts-timeline"),
    ),
  },
  {
    id: "tr-schengen",
    slug: "does-a-turkish-passport-give-schengen-access",
    topics: ["travel"],
    programmes: ["turkiye"],
    question: "Does a Turkish passport give visa-free access to Europe?",
    answer: [
      "No. This is the most common misunderstanding about the programme, and it is worth being blunt: a Turkish passport does not carry visa-free entry to the Schengen Area. You will still apply for a Schengen visa.",
      "What it does carry is visa-free or visa-on-arrival access to a large number of other destinations, and — uniquely among the programmes we advise on — eligibility for the United States E-2 treaty investor visa after three years of citizenship.",
      "If unrestricted European access is the objective, a Caribbean programme or an EU residency route answers it and Türkiye does not. We would rather say so at the first conversation than at the last.",
    ],
    review: sourced(
      "Multi Mulk — Turkish passport visa-free list 2026",
      MM("turkish-passport-visa-free-list-2026-the-countries-that-matter-most-for-business-travel"),
    ),
  },
  {
    id: "tr-hidden-costs",
    slug: "what-does-turkish-citizenship-cost-all-in",
    topics: ["cost"],
    programmes: ["turkiye"],
    question: "What does Turkish citizenship actually cost, all in?",
    answer: [
      "The USD 400,000 is the investment, not the cost. Budget for the transaction on top of it, and expect the total outlay to exceed the threshold by a meaningful margin.",
      "The recurring items are the title deed transfer tax, the official valuation report, legal and advisory fees, sworn translation and apostille of every foreign document, compulsory earthquake insurance, and the government application fees for each family member.",
      "Two costs surprise people more than the rest. The first is VAT position, which varies by property and by whether an exemption applies. The second is the building's service charge, which is a running cost rather than a transaction cost and lands in the second year.",
      "We put the full figure in writing before you commit to anything. A number quoted without its costs is not a price.",
    ],
    review: sourced(
      "Multi Mulk — The $400K question: what Turkish citizenship actually costs",
      MM("the-400k-question-what-does-turkish-citizenship-actually-cost-all-in-in-2026"),
    ),
  },
  {
    id: "tr-valuation",
    topics: ["property", "process"],
    programmes: ["turkiye"],
    question: "Is an official valuation required, and what if it comes in low?",
    answer: [
      "Yes. The threshold is assessed against a valuation report prepared by a licensed appraiser, not against the price on the contract.",
      "If the valuation comes in below the threshold the application fails, regardless of what you paid. This catches buyers who budget to exactly USD 400,000 — a valuation a few percent under leaves no margin. It is also why a property priced well above its market value is a problem even when it clears the threshold on paper.",
    ],
    review: sourced(
      "Multi Mulk — Minimum investment for Türkiye citizenship in 2026",
      MM("minimum-investment-for-turkey-citizenship-in-2026-the-400000-rule-fully-explained"),
    ),
  },
  {
    id: "tr-vs-caribbean",
    slug: "turkiye-or-the-caribbean",
    topics: ["eligibility", "travel"],
    programmes: ["turkiye", "grenada", "dominica"],
    question: "Should I choose Türkiye or a Caribbean programme?",
    answer: [
      "They answer different questions. Türkiye costs more and buys an asset in a functioning rental market; the Caribbean costs less and buys a stronger travel document.",
      "Take Türkiye if the money should stay invested in something that earns and can be sold, if E-2 access to the United States matters, or if you want a foothold between Europe and the Gulf. Take the Caribbean if visa-free breadth is the point, if you want the file closed in months rather than a property managed for years, or if you would rather not own real estate abroad at all.",
      "The Caribbean donation routes leave nothing behind — that is the trade for the lower price, and it is a legitimate trade. We do not transact them, which is a fact about us rather than a judgement about them.",
    ],
    review: sourced(
      "Multi Mulk — Türkiye CBI vs Caribbean CBI, 2026",
      MM("turkey-cbi-vs-caribbean-cbi-which-one-is-better-in-2026"),
    ),
  },
  {
    id: "tr-rejection",
    slug: "why-applications-get-rejected",
    topics: ["process", "eligibility"],
    programmes: ["turkiye"],
    question: "Why do applications get rejected?",
    answer: [
      "Almost never because of the money. Files fail on documents, on the property, and on due diligence — in roughly that order.",
      "Documents are the commonest cause: a missing apostille, a translation that is not sworn, a certificate issued too long ago to be accepted. The property is the next: a valuation under the threshold, an ineligible seller, a title with an encumbrance, a building without its occupancy permit.",
      "Due diligence failures are rarer and harder to remedy. They turn on the source of funds and on background checks, and the time to surface a complication is before the purchase, not after the file is lodged.",
      "This is why we prepare the due-diligence pack before the money moves rather than after.",
    ],
    review: sourced(
      "Multi Mulk — CBI due diligence in Türkiye",
      MM("cbi-due-diligence-in-turkey-what-background-checks-applicants-face-and-what-disqualifies-you-in-2026"),
    ),
  },
  {
    id: "tr-tax",
    topics: ["tax"],
    programmes: ["turkiye"],
    question: "Does Turkish citizenship make me a Turkish taxpayer?",
    answer: [
      "Citizenship and tax residency are separate. Türkiye taxes residents on worldwide income, and residency generally follows from spending more than 183 days in the country in a calendar year — not from holding the passport.",
      "If you do not live in Türkiye, citizenship alone does not make you a Turkish tax resident. Your own jurisdiction's rules still apply, and they are the ones that will determine what you owe.",
      "This is the point at which we stop and your tax adviser starts. Nothing here is tax advice.",
    ],
    review: sourced(
      "Multi Mulk — No worldwide tax, no inheritance tax",
      MM("no-worldwide-tax-no-inheritance-tax-why-turkeys-tax-system-is-attracting-gulf-family-offices-in-2026"),
    ),
  },
  {
    id: "tr-residency-vs-citizenship",
    slug: "residency-or-citizenship",
    topics: ["eligibility", "cost"],
    programmes: ["turkiye"],
    question: "What is the difference between the $200,000 and $400,000 routes?",
    answer: [
      "They are different things, not two prices for the same thing. USD 200,000 in property qualifies you for a short-term residence permit; USD 400,000 qualifies you for citizenship.",
      "A residence permit is permission to stay. It is renewable, it can be refused on renewal, and it is not a nationality — there is no passport at the end of it. It can lead to citizenship by ordinary naturalisation after five years of continuous legal residence, which requires actually living in Türkiye.",
      "If the objective is a second passport without relocating, the residency route does not get you there. If the objective is a base in Türkiye at a lower entry price, it does.",
    ],
    review: sourced(
      "Multi Mulk — How to choose between residency and second citizenship",
      MM("how-to-choose-between-residency-vs-second-citizenship"),
    ),
  },
  {
    id: "gd-e2",
    topics: ["travel"],
    programmes: ["grenada"],
    question: "Which programmes give access to the US E-2 investor visa?",
    answer: [
      "Grenada is the only Caribbean citizenship programme with an E-2 treaty with the United States. Türkiye also has one, available three years after citizenship.",
      "The E-2 is not a green card and not a path to one. It permits you to live in the United States while directing a substantial investment in a business there, renewable for as long as the business operates.",
    ],
    review: sourced(
      "Multi Mulk — E-2 visa USA through Turkish citizenship",
      MM("e-2-visa-usa-through-turkish-citizenship-the-complete-guide"),
    ),
  },
];

export function getFaq(slug: string): Faq | undefined {
  return faqs.find((faq) => faq.slug === slug);
}

export function faqsOnTopic(topic: FaqTopic): Faq[] {
  return faqs.filter((faq) => faq.topics.includes(topic));
}

export function faqsForProgramme(slug: string): Faq[] {
  return faqs.filter((faq) => faq.programmes.includes(slug));
}

/** Only the questions that earned a page of their own. */
export const answeredInFull = faqs.filter((faq) => faq.slug !== undefined);
