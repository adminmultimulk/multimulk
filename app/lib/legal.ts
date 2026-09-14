/**
 * The legal pages: the privacy policy and the terms of use, served at
 * /legal/[slug].
 *
 * The privacy policy is Multi Mulk's own — the text the legacy site published
 * at /privacy-policy (last revised 13 May 2025), carried over and brought up
 * to date with what this site actually does: enquiries are recorded in the
 * CRM, brochures are sent by email, and the office details have moved to the
 * Dubai head office. The terms of use are new; the legacy site had none, and
 * a site that quotes programme thresholds and property prices needs to say
 * what those figures are and are not.
 *
 * Both are English here and staged for translation under
 * `dictionary.legal.copy[slug]`, keyed by section id, so a language can
 * translate the policy section by section and anything missing falls back to
 * this text. Names, addresses and email addresses are never translated.
 *
 * Held to the same discipline as the other leaf content modules: no import of
 * `routes.ts` or `content.ts`. The contact block reads its details from
 * `contact` at render time rather than repeating them here.
 */

export const legalSlugs = ["privacy-policy", "terms", "image-credits"] as const;

export type LegalSlug = (typeof legalSlugs)[number];

export const isLegalSlug = (value: string): value is LegalSlug =>
  (legalSlugs as readonly string[]).includes(value);

/** The two written documents; the credits page renders from `credits.ts`. */
export type LegalDocumentSlug = Exclude<LegalSlug, "image-credits">;

export type LegalSection = {
  /** Stable key for the staged translation; never shown. */
  id: string;
  heading: string;
  paragraphs: string[];
  /** A list after the paragraphs, where the section has one. */
  bullets?: string[];
  /** A closing line after the list. */
  after?: string;
};

export type LegalDocument = {
  slug: LegalDocumentSlug;
  /** ISO day the text was last changed; shown under the title. */
  updatedOn: string;
  intro: string[];
  sections: LegalSection[];
  /** Whether to close with the offices' contact details. */
  contact: boolean;
};

export const legalDocuments: Record<LegalDocumentSlug, LegalDocument> = {
  "privacy-policy": {
    slug: "privacy-policy",
    updatedOn: "2026-09-14",
    intro: [
      "At Multi Mulk, we are committed to protecting your privacy and ensuring that your personal information is handled safely and responsibly. This Privacy Policy explains how we collect, use, share and protect your data when you visit multimulk.com or use our services.",
      "Multi Mulk is an international real estate and citizenship advisory with its head office in Dubai, United Arab Emirates, and offices in İstanbul, Türkiye, and Lahore, Pakistan. For the purposes of this policy, Multi Mulk is the controller of the personal information collected through this website.",
    ],
    sections: [
      {
        id: "collect",
        heading: "1. Information We Collect",
        paragraphs: [
          "We collect personal information that you give us directly when you fill in a form on our website, request a brochure, subscribe to updates or contact us with an enquiry. This includes:",
        ],
        bullets: [
          "Your name, email address and telephone number, including the country your number belongs to.",
          "What your enquiry is about, the subject and message you write, and the property, development or programme you are asking about.",
          "The language you wrote in and the page you wrote from, so the right adviser can pick the enquiry up.",
          "Where you go on to become a client, the documents an application requires — identity, family, source of funds and the like — which are collected under a separate engagement and not through this website.",
        ],
        after:
          "We also collect non-personal information automatically as you use the site, such as your IP address, browser type, device, the pages you visit and the site that referred you, through cookies and analytics tools described below.",
      },
      {
        id: "use",
        heading: "2. How We Use Your Information",
        paragraphs: ["We use your personal information to:"],
        bullets: [
          "Respond to your enquiries and provide the services you request, including sending a brochure you have asked for to your email address.",
          "Follow up your enquiry by email, telephone or WhatsApp, and arrange consultations with our advisers.",
          "Send you updates, newsletters and information about properties and programmes we think will interest you. You can ask us to stop at any time.",
          "Improve our website, understand which pages are read and in which languages, and customise your experience.",
          "Meet our legal and regulatory obligations, including the due-diligence, anti-money-laundering and know-your-customer checks that citizenship and residency applications require.",
          "Protect the security of our website and prevent misuse of it.",
        ],
      },
      {
        id: "share",
        heading: "3. Sharing Your Information",
        paragraphs: [
          "We do not sell or rent your personal information to third parties. We share your data only where it is needed to do what you have asked of us:",
        ],
        bullets: [
          "With the trusted service providers who help us operate the website and manage our communications — our customer relationship management system, where enquiries are recorded and assigned to an adviser; our email delivery and website hosting providers; and our analytics providers. Each is obliged to protect your information and to use it only for the purposes we specify.",
          "With the developers, resort operators, licensed agents, lawyers and government citizenship or immigration units involved in a purchase or an application, once you have instructed us to proceed and only to the extent the transaction or application requires.",
          "Between our own offices in the United Arab Emirates, Türkiye and Pakistan, so that the desk closest to you can handle your file.",
          "Where the law requires it, or to protect our rights, our clients or the public.",
        ],
      },
      {
        id: "transfers",
        heading: "4. International Transfers",
        paragraphs: [
          "Because we operate from three countries and use service providers based elsewhere, your information may be stored and processed outside the country you live in. Wherever it is processed, we apply the safeguards described in this policy and require our providers to protect it to the same standard.",
        ],
      },
      {
        id: "retention",
        heading: "5. How Long We Keep It",
        paragraphs: [
          "We keep the details of an enquiry for as long as we need them to deal with it and to follow it up, and the records of a client engagement for as long as the law and our regulatory obligations require after it ends. You can ask us to delete your information at any time, and we will do so unless we are required to keep it.",
        ],
      },
      {
        id: "security",
        heading: "6. Data Security",
        paragraphs: [
          "We take the security of your personal information seriously and implement reasonable technical and organisational measures to prevent unauthorised access, disclosure or misuse of your data. Forms on this website are submitted over an encrypted connection and protected against automated abuse. Please note, however, that no method of data transmission over the internet is completely secure, and we cannot guarantee absolute protection.",
        ],
      },
      {
        id: "rights",
        heading: "7. Your Rights",
        paragraphs: [
          "You have the right to access the personal information we hold about you, to have it corrected, to ask us to delete it, to object to or restrict how we use it, and to withdraw any consent you have given. Where you are protected by the data protection law of the United Arab Emirates, Türkiye, the European Union or another jurisdiction, you may also have the right to complain to the supervisory authority there.",
          "To exercise any of these rights, or if you have any concerns about how we use your data, please contact us using the details at the end of this policy. We may ask you to confirm your identity before acting on a request.",
        ],
      },
      {
        id: "cookies",
        heading: "8. Cookies and Analytics",
        paragraphs: [
          "Our website uses cookies and similar technologies to remember your preferences — such as the language you chose to read the site in — and to analyse how the site is used, so that we can improve it. We use Google Analytics and Vercel Web Analytics for this; the former sets cookies, the latter does not identify individual visitors.",
          "You can choose to disable cookies through your browser settings, but this may limit some functions of the site.",
        ],
      },
      {
        id: "thirdParties",
        heading: "9. Third-Party Services and Links",
        paragraphs: [
          "Some pages embed content from other services — maps from Google, videos from YouTube — and offer to open a conversation on WhatsApp. When you use these, the provider concerned may collect information under its own privacy policy, which we encourage you to read. Links from our website to other sites are provided for convenience, and we are not responsible for their content or their privacy practices.",
        ],
      },
      {
        id: "children",
        heading: "10. Children",
        paragraphs: [
          "Our website and services are directed at adults. We do not knowingly collect personal information from anyone under the age of eighteen through this website. Where a child is included in a family application, their details are collected from the applying parent under the engagement, not here.",
        ],
      },
      {
        id: "changes",
        heading: "11. Changes to This Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes in our practices or in the law that applies to us. Any changes will be posted on this page with a new revision date, and we encourage you to review it periodically.",
        ],
      },
      {
        id: "contact",
        heading: "12. Contact Us",
        paragraphs: [
          "If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at any of our offices:",
        ],
      },
    ],
    contact: true,
  },

  terms: {
    slug: "terms",
    updatedOn: "2026-09-14",
    intro: [
      "These terms govern your use of multimulk.com and the information published on it. By using the website you agree to them; if you do not agree, please do not use the site.",
      "The website is operated by Multi Mulk, an international real estate and citizenship advisory with its head office in Dubai, United Arab Emirates, and offices in İstanbul, Türkiye, and Lahore, Pakistan.",
    ],
    sections: [
      {
        id: "information",
        heading: "1. The Nature of the Information on This Site",
        paragraphs: [
          "The website describes citizenship-by-investment and residency programmes, the properties and developments that qualify under them, and the way Multi Mulk works. It is published for general information. Nothing on it is legal, tax, financial or immigration advice, and nothing on it is a recommendation to any particular person to buy a property or apply to a programme.",
          "Programme thresholds, holding periods, processing times, visa-free counts and similar figures are taken from the legislation and official guidance current on the review date shown on the page, and they change. Every figure should be confirmed with us, and where appropriate with your own legal and tax advisers, before you act on it. A comparison or a calculator on this site shows how programmes relate on the facts we hold; it is not a decision made for you.",
          "Applications for citizenship or residency are decided by the government concerned. Multi Mulk prepares, files and follows an application; it does not decide it, and it cannot guarantee the outcome or the time a government takes.",
        ],
      },
      {
        id: "properties",
        heading: "2. Properties and Prices",
        paragraphs: [
          "Property details, prices, availability, handover dates, payment plans and rental yields are provided by developers and operators or drawn from market data, and are indicative. They are subject to change and to availability, and they do not constitute an offer capable of acceptance. Images may be architectural renderings rather than photographs of the finished building. The terms of any purchase are those of the sale agreement you sign, not those of a page on this website.",
        ],
      },
      {
        id: "use",
        heading: "3. Using the Website",
        paragraphs: ["You agree to use the website lawfully and not to:"],
        bullets: [
          "Submit false or misleading information through our forms, or use them to send unsolicited messages.",
          "Attempt to gain unauthorised access to the site, its administration area or the systems behind it, or to interfere with its operation.",
          "Copy, scrape or systematically extract the content, listings or data on the site, whether by hand or with automated tools.",
        ],
      },
      {
        id: "enquiries",
        heading: "4. Enquiries",
        paragraphs: [
          "Submitting an enquiry, requesting a brochure or opening a conversation on WhatsApp invites us to contact you about it; it does not make you a client. A client relationship begins only when an engagement is agreed in writing, and the terms of that engagement govern the work. How we handle the information you give us is described in our Privacy Policy.",
        ],
      },
      {
        id: "ip",
        heading: "5. Intellectual Property",
        paragraphs: [
          "The text, design, illustrations and photography on this website belong to Multi Mulk or are used under licence, and may not be reproduced without permission except as the site itself invites — sharing a page, for example. The names and marks of developments, resorts, hotel operators and government programmes belong to their respective owners and appear here to identify them. Photographs published under Creative Commons licences are credited on our Image Credits page.",
        ],
      },
      {
        id: "thirdParties",
        heading: "6. Third-Party Content and Links",
        paragraphs: [
          "The site embeds maps, videos and other content from third parties, links to other websites, and quotes press coverage and sources. We do not control that content and are not responsible for it. Programme legislation and official guidance are the property of the governments that publish them, and we link to them where we can.",
        ],
      },
      {
        id: "liability",
        heading: "7. Liability",
        paragraphs: [
          "We take care to keep the website accurate and current, and the review date on a page tells you when its figures were last checked. Even so, the website is provided as it is, and to the extent the law allows we accept no liability for loss arising from reliance on its content, from any interruption to the site, or from the content of third-party sites it links to. Nothing in these terms limits liability that cannot be limited by law.",
        ],
      },
      {
        id: "law",
        heading: "8. Governing Law",
        paragraphs: [
          "These terms are governed by the laws of the United Arab Emirates, and any dispute about them is subject to the courts of Dubai. Where you deal with one of our other offices under a written engagement, that engagement states which law applies to it.",
        ],
      },
      {
        id: "changes",
        heading: "9. Changes to These Terms",
        paragraphs: [
          "We may revise these terms from time to time. The revision date is shown at the top of this page, and continued use of the website after a revision is acceptance of the revised terms.",
        ],
      },
      {
        id: "contact",
        heading: "10. Contact Us",
        paragraphs: ["Questions about these terms can be sent to any of our offices:"],
      },
    ],
    contact: true,
  },
};

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return slug === "privacy-policy" || slug === "terms"
    ? legalDocuments[slug]
    : undefined;
}
