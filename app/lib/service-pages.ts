/**
 * The two advisory landing pages: a second passport for global investors, and
 * the Turkish citizenship eligibility review.
 *
 * These are product pages rather than programme pages. A programme page
 * describes what a country grants; these describe what Multi Mulk does about
 * it, and end on the enquiry form. They share one component, `ServicePage`,
 * and differ only in the copy and the figures here.
 *
 * English only, deliberately. The programme pages stage their copy in the
 * dictionaries because they are read in seven languages; these two pages are
 * built for an English search query and would be indexed in English first.
 * Should they need translating, the shape below is the shape to stage under
 * the dictionary — nothing in the component reads a string it could not have
 * been handed in another language.
 *
 * Every figure quoted in the prose — US$400,000, three years, 3–6 months,
 * 110+ destinations — is the one `figures.ts` states on the programme page, so
 * the two cannot disagree; the stat row on the eligibility page reads the
 * registry directly.
 */

import type { FigureId } from "./figures";
import type { EnquiryType } from "./leads/schema";
import type { RouteId } from "./routes";

export type ServicePageKey = "secondPassport" | "eligibilityReview";

export type ServiceFaq = { question: string; answer: string };

export type ServicePage = {
  key: ServicePageKey;
  routeId: RouteId;
  /** The path without its locale, for `alternatesFor`. */
  path: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    /** Carries white type, so a dark frame. */
    image: string;
    cta: string;
  };
  /** The headline figures, read from the registry. Absent on the global page. */
  stats?: { figure: FigureId; label: string }[];
  intro: {
    heading: string;
    paragraphs: string[];
    image: string;
    /** A short line above the photograph. */
    imageEyebrow: string;
  };
  audience: {
    eyebrow: string;
    heading: string;
    body: string;
    items: { title: string; body: string }[];
  };
  scope: {
    eyebrow: string;
    heading: string;
    body: string;
    steps: { title: string; body: string }[];
  };
  /**
   * A comparison from `comparisons.ts`, rendered with the same table as the
   * compare pages. The figures come from the programme records at render.
   */
  comparison?: { slug: string; heading: string; body: string; href: string };
  /** Pieces from the Knowledge Centre the reader is likely to want next. */
  reading: { heading: string; slugs: string[] };
  faq: { heading: string; items: ServiceFaq[] };
  enquire: {
    heading: string;
    body: string;
    defaultEnquiry: EnquiryType;
    /** Passed to the form so the lead records which page it came from. */
    programme?: string;
  };
};

export const servicePages: Record<ServicePageKey, ServicePage> = {
  secondPassport: {
    key: "secondPassport",
    routeId: "secondPassport",
    path: "/second-passport",
    meta: {
      title: "Second Passport Eligibility for Global Investors",
      description:
        "Lawful second passport and dual citizenship options for investors and families, through compliant investment routes in Türkiye and the Caribbean. Eligibility review, programme selection and end-to-end execution from Multi Mulk.",
    },
    hero: {
      eyebrow: "Global mobility solutions",
      heading: "Second Passport Eligibility for Global Investors",
      body: "A second nationality, obtained lawfully through a compliant investment: which programmes you and your family are eligible for, what each one grants, and how the path is structured from a written eligibility review to a passport in hand.",
      image: "/images/cbi/hero-passports.jpg",
      cta: "Check my eligibility",
    },
    intro: {
      heading: "What a second passport is, and what it is not",
      paragraphs: [
        "A second passport is a second nationality: the right to live, work and travel as a citizen of another country, held alongside the citizenship you were born with. It is not a residence permit, however long that permit runs, and it is not a visa. A residence card can be withdrawn when its basis changes; a citizenship, once granted, is yours and passes to your children.",
        "Two regions offer an additional passport to investors on terms that are clear, lawful and reasonably fast. Türkiye grants citizenship on a real estate investment of US$400,000 held for three years, with a realistic estimate of three to six months from the certificate of conformity. The five Caribbean programmes — Grenada, Dominica, St Kitts & Nevis, Saint Lucia and Antigua & Barbuda — grant citizenship on a contribution to a government fund or an approved real estate purchase, with processing measured in months. All of them include the spouse and dependent children; none requires the investor to live there.",
        "Whether you can hold a second nationality at all is a question of your first. Most countries permit dual citizenship; some restrict it, and a handful prohibit it. That is the first question in every eligibility review we run, because no investment route can answer it.",
      ],
      image: "/images/cbi/cbi-passport-turkiye-collage.webp",
      imageEyebrow: "Türkiye and the Caribbean",
    },
    audience: {
      eyebrow: "Who this is for",
      heading: "Investors and families who need options, not promises",
      body: "A second passport solves different problems for different people. The programme that fits depends on which of these describes you.",
      items: [
        {
          title: "Families securing a second base",
          body: "Parents who want their children to hold a second nationality by descent, with the right to live, study and work in a second country whatever happens in the first. Both regions include the spouse and children under 18; the Caribbean programmes extend to dependent adult children and parents.",
        },
        {
          title: "Business travellers who need mobility",
          body: "Executives and founders whose current passport requires a visa for markets they visit routinely. A Turkish passport reaches 110 or more destinations visa-free or on arrival and unlocks the US E-2 treaty investor visa; the Caribbean passports reach 140 to 155, including the Schengen area and the United Kingdom.",
        },
        {
          title: "Investors who want an asset behind the passport",
          body: "Those who would rather hold a property in a large, liquid market than make a non-refundable contribution. Türkiye's route is a property purchase that can be let during the three-year hold and sold after it, with the citizenship retained.",
        },
        {
          title: "Residents of countries where dual nationality is lawful",
          body: "Eligibility begins at home. Where your country permits a second nationality, the investment routes are open to you; where it restricts one, the review has to establish what is possible before anything else is discussed.",
        },
      ],
    },
    scope: {
      eyebrow: "How the path is structured",
      heading: "From eligibility review to passport, in five stages",
      body: "Every file we run follows the same sequence, and the first stage is the one that decides whether there should be a second.",
      steps: [
        {
          title: "Written eligibility review",
          body: "Your nationality and its position on dual citizenship, your family composition, your source of funds, and anything relevant to a security review. A written assessment tells you which programmes are open to you and which are not, before you spend anything.",
        },
        {
          title: "Programme selection",
          body: "Türkiye or the Caribbean, real estate or contribution, and which country within the Caribbean — decided on what you need the passport to do, the capital you want to commit, and whether you want an asset at the end of it. We compare the programmes on the same figures we publish.",
        },
        {
          title: "Investment and due diligence",
          body: "For a real estate route, a licensed valuation, a title and seller check, a developer check for an off-plan purchase, and a payment plan that satisfies the receiving authority. For a contribution route, the approved channel and the receipt trail. The same standard we set out on our investor protection page.",
        },
        {
          title: "Application",
          body: "Licensed counsel in the relevant jurisdiction files each step under a power of attorney, with a family document set we prepare and check against the current list. You attend once for biometrics; otherwise you are not required to travel.",
        },
        {
          title: "Passport, and after",
          body: "Civil registration, identity documents and the passport itself for each family member. Then rental management for a property route, and resale planning when the holding period ends. The relationship does not close on approval day.",
        },
      ],
    },
    comparison: {
      slug: "turkiye-vs-grenada-vs-dominica-vs-st-kitts",
      heading: "The citizenship programmes, side by side",
      body: "Every figure below is read from the programme records we maintain, not written into this page, so it cannot disagree with the programme's own page. The full comparison, with every route, is on the compare page.",
      href: "/compare/turkiye-vs-grenada-vs-dominica-vs-st-kitts",
    },
    reading: {
      heading: "Read before you decide",
      slugs: [
        "looking-for-a-second-passport-which-program-is-right-for-you-in-2026",
        "how-to-choose-between-residency-vs-second-citizenship",
        "turkey-citizenship-vs-caribbean-citizenship-by-investment",
        "turkey-citizenship-vs-uae-golden-visa-2026",
      ],
    },
    faq: {
      heading: "Second passport questions, answered",
      items: [
        {
          question: "Is a second passport legal?",
          answer:
            "Yes, where both countries permit it. Türkiye and every Caribbean programme country allow dual citizenship. Whether your current country does is the first question in the eligibility review; most permit it, some restrict it, and a few prohibit it.",
        },
        {
          question: "What is the difference between a second passport and a golden visa?",
          answer:
            "A second passport is a nationality: permanent, inheritable, with a passport of its own. A golden visa is a residence permit granted on an investment; it can be long and renewable, as the UAE's ten-year permit is, but it remains a permit tied to its basis, and it does not lead to a passport.",
        },
        {
          question: "Which second passport is fastest to obtain?",
          answer:
            "Türkiye and the Caribbean programmes are all measured in months. A realistic estimate for Türkiye is three to six months from the certificate of conformity; the Caribbean programmes range from three to twelve months depending on the country. In every case a clean file is what keeps the timeline inside the estimate.",
        },
        {
          question: "Can my family be included?",
          answer:
            "Yes. Türkiye includes the spouse and children under 18 on the same application. The Caribbean programmes include the spouse, dependent children — in most cases to a higher age where they are in full-time education — and, in several programmes, dependent parents.",
        },
        {
          question: "Do I have to live in the country?",
          answer:
            "No. Neither Türkiye nor the Caribbean programmes require residence. Antigua & Barbuda asks for five days in the country within the first five years; the others ask for none.",
        },
        {
          question: "Does a second passport affect my tax position?",
          answer:
            "Not by itself. Tax residency depends on where you live, not on which passports you hold. Owning a property abroad creates a tax position on that property's income and eventual sale. We coordinate with your tax adviser rather than pretend the question does not exist.",
        },
      ],
    },
    enquire: {
      heading: "Find out which programmes you are eligible for",
      body: "Send us your nationality, your family composition and the capital you are considering, and we will return a written eligibility assessment within two working days, covering every programme we advise on.",
      defaultEnquiry: "general",
    },
  },

  eligibilityReview: {
    key: "eligibilityReview",
    routeId: "eligibilityReview",
    path: "/turkish-citizenship-eligibility-review",
    meta: {
      title: "Turkish Citizenship Eligibility Review for Investors",
      description:
        "A written legal eligibility review and consultation on Turkish citizenship by investment for foreign investors in 2026: personal and family eligibility, source of funds, the real estate route, property compliance, timeline and cost — before you commit.",
    },
    hero: {
      eyebrow: "Türkiye · Citizenship by investment",
      heading: "Turkish Citizenship Eligibility Review for Investors",
      body: "A written eligibility review and consultation before you commit a dollar: whether you and your family qualify for Turkish citizenship by investment, which property would qualify, and what the realistic timeline and all-in cost are — coordinated with licensed Turkish counsel.",
      image: "/images/cbi/hero-istanbul-dusk.jpg",
      cta: "Request my review",
    },
    stats: [
      { figure: "tr.cbi.minimum-property", label: "Minimum real estate investment" },
      { figure: "tr.cbi.holding-period", label: "Holding period" },
      { figure: "tr.cbi.processing", label: "Application to decision" },
      { figure: "tr.cbi.visa-free", label: "Visa-free destinations" },
    ],
    intro: {
      heading: "Eligibility is decided before the property, not after",
      paragraphs: [
        "Turkish citizenship by investment is granted on a real estate purchase of at least US$400,000, held for three years, to an applicant with a clean record and no security concern. The rule is short. The reasons applications stall are not in the rule; they are in the details the rule assumes — that the seller is eligible, that the property has not been used before, that the funds moved by bank transfer and were converted as required, that every civil document carries the right apostille. Each of those is checkable before you buy, and none of them can be fixed afterwards.",
        "The eligibility review is a written assessment of your position against every legal requirement a foreign investor has to meet: personal, family, financial and, if you already have a property in mind, the property itself. It ends with a plain answer — eligible, eligible with conditions, or not eligible — and a realistic timeline and cost. If the programme is not right for you, we say so here rather than after the money has moved.",
        "We are a real estate and citizenship advisory, not a law firm. The legal questions in the review are put to licensed Turkish counsel, and the same counsel files each step under a power of attorney if you proceed.",
      ],
      image: "/images/cbi/cbi-advisory.jpg",
      imageEyebrow: "The consultation",
    },
    audience: {
      eyebrow: "What the review covers",
      heading: "The six questions a Turkish citizenship file has to answer",
      body: "A file that answers all six before it is lodged is reviewed once. A file that discovers one of them at the directorate is reviewed twice, from the back of the queue.",
      items: [
        {
          title: "Personal eligibility",
          body: "Your nationality and any restriction on it, your criminal record in Türkiye and elsewhere, your visa and residence history in Türkiye, and anything a security or public-order review would consider. The decision is discretionary; these are the factors it turns on.",
        },
        {
          title: "Family eligibility",
          body: "Who is included — the spouse and children under 18 — and who is not. What each family member will need to document, which documents need an apostille, and how a child close to eighteen is handled against the processing time.",
        },
        {
          title: "Source and route of funds",
          body: "Where the investment comes from, how it will reach Türkiye, and whether the route will satisfy the Turkish bank and the Ministry: bank transfer from your own account, foreign currency sold to a Turkish bank, and the conversion documented.",
        },
        {
          title: "The investment route",
          body: "Whether real estate at US$400,000 is the right instrument for you, or whether a bank deposit, government bonds or a fixed capital investment at US$500,000 fits better. Real estate is the route we advise on; the review says honestly if another suits you.",
        },
        {
          title: "Property compliance",
          body: "If you already have a property in mind: the licensed valuation against the threshold at the official rate, the declared value on the title, the seller's eligibility, whether the property has been used for a previous application, and whether the three-year annotation can be recorded.",
        },
        {
          title: "Timeline and cost",
          body: "A realistic sequence from purchase to passport, with the three-to-six-month estimate placed where it belongs — after the certificate of conformity — and the all-in figure: transfer tax, VAT where applicable, valuation, notary, translation, government and legal fees, and our own fee, quoted separately.",
        },
      ],
    },
    scope: {
      eyebrow: "How it works",
      heading: "From your first message to a written answer",
      body: "The review is designed to be fast at the front, because the decision it produces is the one that saves the most time later.",
      steps: [
        {
          title: "Send us your details",
          body: "Nationality, family composition, the capital you are considering and, if you have one, the property. Through the form below, or by email or telephone if you prefer.",
        },
        {
          title: "Consultation",
          body: "A call with a Multi Mulk advisor to go through the six questions above, understand what you need the citizenship to do, and identify anything that needs counsel's view before we can answer.",
        },
        {
          title: "Written assessment within two working days",
          body: "Eligible, eligible with conditions, or not eligible — with the conditions stated, the realistic timeline, the all-in cost and the risks specific to your situation. Legal points are confirmed with licensed Turkish counsel before we send it.",
        },
        {
          title: "Property shortlist",
          body: "If you proceed on the real estate route, a shortlist of properties that pass every compliance check and our investment test — yield, resale liquidity, district trajectory — from our own Türkiye portfolio and the wider market.",
        },
        {
          title: "Execution with counsel",
          body: "Transfer and annotation, certificate of conformity, residence permit, citizenship application, biometrics, decision and passport, filed by licensed counsel under a power of attorney and coordinated by us at each step.",
        },
      ],
    },
    comparison: {
      slug: "turkiye-vs-uae",
      heading: "Türkiye citizenship against the UAE Golden Visa",
      body: "Investors often weigh the two together, and often under the name \"Turkish golden visa\" — which is a misnomer, since Türkiye grants a nationality and the UAE grants a ten-year residence permit. The figures below are read from the programme records; the decision guide under News & Insights goes through the choice in full.",
      href: "/compare/turkiye-vs-uae",
    },
    reading: {
      heading: "Read before the consultation",
      slugs: [
        "how-much-to-invest-for-turkish-citizenship-2026",
        "how-to-file-a-turkish-citizenship-application",
        "turkish-citizenship-advisor-checklist-2026",
        "turkey-citizenship-vs-uae-golden-visa-2026",
      ],
    },
    faq: {
      heading: "Eligibility questions, answered",
      items: [
        {
          question: "What are the legal requirements for a foreign investor to obtain Turkish citizenship?",
          answer:
            "Real estate with an appraised and declared value of at least US$400,000, bought from a Turkish national or company by bank transfer, not previously used for another foreigner's application, with a three-year no-sale annotation on the title; a certificate of conformity from the Ministry; a short-term residence permit; a clean criminal record; and no security or public-order concern. The spouse and children under 18 are included.",
        },
        {
          question: "Is there a Turkish golden visa?",
          answer:
            "Not in the sense the term is used elsewhere. Türkiye grants citizenship — a passport — on a US$400,000 real estate investment, not a residence permit. It also offers a short-term residence permit on a property purchase of US$200,000, which is a residency route rather than a citizenship one. The compare page sets both beside the UAE Golden Visa.",
        },
        {
          question: "What does the eligibility review cost?",
          answer:
            "The consultation and written assessment are provided without charge to investors considering the programme. Our advisory fee applies only if you proceed, and is quoted in writing at that point, separately from legal, valuation, government and transaction costs.",
        },
        {
          question: "Do I have to be in Türkiye for the review or the application?",
          answer:
            "No. The review is conducted remotely. If you proceed, licensed counsel files each step under a power of attorney, and you and each family member attend once for biometrics, which can often be done at a Turkish consulate.",
        },
        {
          question: "How long does Turkish citizenship by investment take?",
          answer:
            "Three to six months from the certificate of conformity is a realistic estimate for a clean file, with the property purchase and document preparation before that. The decision is the government's and the estimate is not a guarantee; what the review controls is whether the file is clean when it is lodged.",
        },
        {
          question: "Can I use a property I already own in Türkiye?",
          answer:
            "Only if it meets the current regulation on every point — value, seller, prior use, payment route and annotation. A property bought under earlier rules often does not. The review checks it against the same list as a new purchase.",
        },
      ],
    },
    enquire: {
      heading: "Request your written eligibility review",
      body: "Tell us your nationality, your family composition, the capital you are considering and any property you have in mind. We will return a written assessment within two working days, with the legal points confirmed by licensed Turkish counsel.",
      defaultEnquiry: "turkishCitizenship",
      programme: "turkiye",
    },
  },
};
