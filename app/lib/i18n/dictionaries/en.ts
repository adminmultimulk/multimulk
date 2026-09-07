/**
 * English — the master dictionary. Its shape *is* the `Dictionary` type, so
 * every other language file is checked against this one and a missing or
 * misspelled key is a build error rather than a blank on the page.
 *
 * What lives here: everything a reader sees. What does not: proper nouns that
 * stay in Latin script in every language — development names (Bosphorus
 * Heights), operator brands (Six Senses, Park Hyatt) and the company name.
 * Those are read from `app/lib/*` unchanged in all five languages, which is
 * how the industry writes them and how buyers search for them.
 *
 * Keys that end in `_n` take a count and are called through the helpers in
 * `../format`, so plural rules stay out of the components.
 */

import { plural, staged, type ArticleCopy, type ProjectCopy } from "../format";

const en = {
  /** <title> and <meta description> per route. */
  meta: {
    home: {
      title: "Multi Mulk | Global Solutions for Global Citizens",
      description:
        "Multi Mulk connects global citizens with luxury residences and citizenship-by-investment opportunities across the UAE, Türkiye and the Caribbean.",
    },
    about: {
      title: "About Us",
      description:
        "Multi Mulk is an international property and citizenship advisory, connecting global citizens with landmark residences across Türkiye and the Caribbean.",
    },
    media: {
      title: "Media Centre",
      description:
        "Press coverage, announcements and guides from Multi Mulk — Turkish citizenship by investment, İstanbul and coastal developments, and our Caribbean portfolio.",
    },
    search: {
      title: "Search Property",
      description:
        "Browse residences with resort access, sweeping views, and effortless coastal living — filtered to your preferences.",
    },
    contact: {
      title: "Contact Us",
      description:
        "Speak to the Multi Mulk team about Turkish citizenship by investment, Türkiye property, and Caribbean CBI programmes.",
    },
    team: {
      title: "Our Team",
      description:
        "The people behind Multi Mulk — leadership, and the three offices in Dubai, İstanbul and Lahore that handle Turkish citizenship, Caribbean CBI and property files end to end.",
    },
    /** Keyed by programme slug, matching `citizenship.ts`. */
    citizenship: {
      turkiye: {
        title: "Turkish Citizenship by Investment",
        description:
          "Turkish citizenship through a USD 400,000 property purchase — thresholds, timelines, and the İstanbul and coastal residences that qualify.",
      },
      caribbean: {
        title: "Caribbean Citizenship by Investment",
        description:
          "Second citizenship in Grenada, Dominica and St. Kitts & Nevis through government-approved resort investments — thresholds, timelines and approved developments.",
      },
    },
    propertyFallback: "Property",
    articleFallback: "Article",
  },

  /** Strings that recur across more than one section. */
  common: {
    getInTouch: "Get in Touch",
    learnMore: "Learn More",
    viewAll: "View All",
    readMore: "Read More",
    enquireNow: "Enquire Now",
    loadMore: "Load More",
    startingFrom: "Starting From",
    any: "Any",
    sortBy: "Sort by",
    resetAll: "Reset All",
    searchProperties: "Search Properties",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    close: "Close",
    logoAlt: "Multi Mulk — Global Solutions for Global Citizens",
    chooseLanguage: "Choose a language",
    socialProfile: "{name} social profile",
  },

  /** Breadcrumb names, keyed by `labelKey` in `app/lib/routes.ts`. */
  /** Sourcing and review lines shown wherever the site states a figure. */
  review: {
    line: "Last reviewed {date}",
    by: "Reviewed by {name}",
    sources: "Sources",
    retrieved: "retrieved {date}",
    /** Shown when a figure's review has lapsed, rather than hiding the page. */
    stale: "This page is due for review. Confirm any figure with us before acting on it.",
  },

  figures: {
    /** What kind of claim a number is. Rendered with the number, always. */
    qualifiers: {
      statutory: "Set in law.",
      estimated:
        "Estimated — subject to government processing and to the circumstances of each applicant. Not a guarantee.",
      indicative: "Indicative. Confirm the figure for your own circumstances.",
      market: "A market estimate, which varies by property and by date.",
    },
    units: {
      months: "months",
      years: "years",
      days: "days",
      count: "destinations",
      percent: "%",
    },
  },

  /** Ask Multi Mulk, client outcomes, the calculators and the author pages. */
  faq: {
    eyebrow: "Ask Multi Mulk",
    heading: "The Questions People Actually Ask",
    body: "Answers that end. Where the answer genuinely depends on something, the something is stated rather than left as a reason to call us.",
    fullAnswer: "Read the full answer",
    topics: {
      eligibility: "Eligibility",
      cost: "Cost",
      timeline: "Timeline",
      family: "Family",
      property: "Property",
      tax: "Tax",
      process: "Process",
      travel: "Travel",
    },
  },

  caseStudies: {
    eyebrow: "Client Outcomes",
    heading: "What the Work Looks Like",
    body: "Anonymised engagements, with the reasoning and the complications left in. A case study without a complication is a brochure.",
    objective: "Objective",
    family: "Family",
    invested: "Invested",
    timeline: "Start to finish",
    afterwards: "Afterwards",
    reasoning: "Why this, and what was rejected",
    complication: "What went wrong",
    consentPending: "No client outcomes are published yet. These require written client consent, which Multi Mulk holds for none of them so far.",
  },

  tools: {
    eyebrow: "Tools",
    heading: "Work the Numbers Yourself",
    body: "Every calculator reads the same programme records the rest of the site does, so nothing here can quote a threshold the programme page contradicts.",
    calculator: {
      heading: "What it costs, all in",
      body: "The threshold is the investment, not the cost. This adds the transaction on top of it, using the assumptions listed below the total.",
      programme: "Programme",
      adults: "Adults",
      children: "Children under 18",
      total: "Estimated total",
      lines: {
      investment: "Qualifying investment",
      transferTax: "Title transfer tax",
      legal: "Legal and advisory fees",
      documentation: "Valuation, translation and notary",
      government: "Government fees",
      },
      assumptions: "Assumes a {tax} transfer tax, {legal} in legal and advisory fees, {docs} in documentation, and {gov} per person for {people} applicants.",
      caveat: "An estimate for planning, not a quotation. Rates vary by property, by jurisdiction and by date, and VAT treatment is not included. We put the real figure in writing before you commit to anything.",
    },
  },

  authors: {
    eyebrow: "Our Team",
    heading: "Who Is Advising You",
    body: "Immigration and investment advice is only as good as the person giving it. These are the people behind what is written here.",
    credentials: "Credentials",
    knowsAbout: "Areas of practice",
    noCredentials: "Credentials pending confirmation.",
    reviewedContent: "Reviewed content",
    roles: {
      founder: "Founder & Chief Executive",
      advisory: "Advisory Director",
      team: "Advisory Team",
    },
  },

  /** The four pillars, their hubs and the pages built on programme data. */
  /** The Investor Protection framework: the three filters, the twenty checks
   *  and the scoring model. Structure lives in `app/lib/due-diligence.ts`. */
  legal: {
    pending: "This page is awaiting its final text from Multi Mulk. Until it is published here, write to info@multimulk.com for the current terms.",
    /** The image credits page. Author names and licence names are not
     *  translated: they identify a person and a licence, and a translated
     *  licence name cites a licence that does not exist. */
    credits: {
      intro: "Almost every photograph on this site is stock or public domain, and asks for nothing in return. Two are Creative Commons, and their licences ask to be credited here.",
      authorLabel: "Photographer",
      sourceLabel: "Source",
      licenceLabel: "Licence",
      shareAlike: "This licence is share-alike. The version used on this site is cropped, which makes it a derivative work, so it is published under the same licence — you may reuse it on the same terms.",
      rest: "Everything else is Pexels stock, public domain, or photography supplied by the developments themselves. A full record of where each file came from is kept with the files.",
    },
  },

  protection: {
    filtersHeading: "Three filters, in order",
    filters: {
      eligible: { heading: "Eligible", body: "Does the property legally qualify under the programme? This is a yes or no, and a no ends the conversation." },
      sensible: { heading: "Financially sensible", body: "Is the price close to what the property is actually worth? Meeting a threshold says nothing about value, and a property bought to clear a threshold is usually bought badly." },
      exitReady: { heading: "Exit ready", body: "Can it be let, and can it be sold when the holding period ends? An asset you cannot leave is not an investment, it is a commitment." },
    },
    checksHeading: "What we check before you invest",
    checksIntro: "Twenty questions, asked in the same order every time. They are written as questions because that is what they are — each one has an answer we hold on file, or the property does not go forward.",
    checks: {
      developerRecord: "Who is the developer, and what have they finished before?",
      developerFinances: "What do the developer's accounts and filings show?",
      titleDeed: "Is the title deed clean, and is it in the seller's name?",
      ownershipHistory: "Who has owned this property, and when did it last change hands?",
      citizenshipEligibility: "Does the property satisfy the programme's eligibility rules?",
      gyoStatus: "Is the seller a REIT (GYO), and does that change anything here?",
      valuation: "Does the official valuation support the price being asked?",
      sellerEligibility: "Is the seller eligible to sell to a citizenship applicant?",
      buildingPermits: "Are the building permits in place and current?",
      constructionStage: "What stage is construction at, and against what schedule?",
      comparablePrices: "What have comparable properties nearby actually sold for?",
      pricePerSqm: "How does the price per square metre sit against the district?",
      rentalDemand: "Is there real rental demand here, or only projected demand?",
      rentalYield: "What net yield does that demand support after costs?",
      resaleLiquidity: "How quickly does stock like this resell in this market?",
      exitStrategy: "What is the exit, and what does it depend on?",
      hiddenCosts: "What costs are not in the headline price?",
      vatPosition: "What is the VAT position, and does an exemption apply?",
      titleDeedCosts: "What will the title deed transfer actually cost?",
      deliveryRisk: "What happens if the project is delivered late, or not at all?",
    },
    scoreHeading: "The Multi Mulk Investment Score",
    scoreIntro: "Every property we recommend is scored out of a hundred against eight weighted factors. The weights are published here because a score whose workings are hidden is a number, not an assessment.",
    scoreCaveat: "A score is one assessor's judgement on a stated date, not a forecast and not a guarantee. Every score carries the name of who made it and when. Ask us for the reasoning behind any figure.",
    factorLabel: "Factor",
    weightLabel: "Weight",
    factors: {
      citizenshipSafety: "Citizenship safety",
      developerStrength: "Developer strength",
      location: "Location",
      priceVsMarket: "Price against market",
      rentalPotential: "Rental potential",
      resaleLiquidity: "Resale liquidity",
      capitalAppreciation: "Capital appreciation",
      deliveryRisk: "Delivery risk",
    },
  },

  pillars: {
    citizenship: {
      eyebrow: "Citizenship by Investment",
      heading: "A Second Citizenship, Held as an Asset",
      body: "Programmes that grant full citizenship in return for a qualifying investment. We advise on which one fits — and, as often, on which does not.",
      hubIntro:
        "Each programme below is set out in the same fields, so they can be read against one another rather than one brochure at a time. Figures carry their source and the date they were last checked.",
    },
    goldenVisa: {
      eyebrow: "Golden Visa & Residency",
      heading: "Residency Without Relocation",
      body: "Residence permits obtained through investment — a base, a tax position, and in several cases a route to citizenship over time.",
      hubIntro:
        "Residency programmes differ from citizenship in one decisive way: they are permissions to stay, renewable and revocable, not a nationality. The table below sets out what each actually grants.",
    },
    realEstate: {
      eyebrow: "Real Estate",
      heading: "Property That Works as an Investment",
      body: "Developments in İstanbul, on the Turkish coast, in Dubai and across the Caribbean — assessed before they enter our portfolio, not after.",
    },
    protection: {
      eyebrow: "Investor Protection",
      heading: "Not Every Qualifying Property Is a Good Investment",
      body: "A property can satisfy a programme's threshold and still be a poor asset. These are the checks we run before we put anything in front of a client.",
    },
  },

  /** Column headings for a generated programme comparison. */
  compare: {
    eyebrow: "Compare",
    heading: "Programmes, Side by Side",
    intro:
      "Every figure in these tables is read from the same programme record, so a threshold cannot say one thing here and another on the programme's own page.",
    factor: "Factor",
    unknownLabel: "Not confirmed",
    noneRequired: "None required",
    noAgeLimit: "No age limit",
    grantedDirectly: "Granted directly",
    noRoute: "No route",
    yes: "Yes",
    no: "No",
    bestLabel: "Most favourable",
    rows: {
      minimumInvestment: "Minimum investment",
      holdingPeriod: "Holding period",
      processingTime: "Processing time",
      visaFree: "Visa-free destinations",
      schengen: "Schengen access",
      dualCitizenship: "Dual citizenship allowed",
      residencyRequired: "Time required in country",
      physicalVisit: "Visit required",
      dependentChildren: "Dependent children up to",
      parentsIncluded: "Parents can be included",
      citizenshipAfter: "Citizenship after",
      worldwideTax: "Taxes worldwide income",
    },
  },

  programmes: {
    routes: {
      "real-estate": "Real estate",
      donation: "Government fund donation",
      bonds: "Government bonds",
      business: "Business investment",
      deposit: "Bank deposit",
      fund: "Investment fund",
    },
    offeredLabel: "We advise on this route",
    notOfferedLabel: "Recognised, but not a route we transact",
    routesHeading: "Qualifying routes",
    statusHeading: "Programme status",
    status: {
      open: "Open",
      suspended: "Suspended",
      closed: "Closed",
      announced: "Announced",
    },
    sinceLabel: "Open since",
    /** Shown on a programme whose figures are not yet signed off. */
    unreviewed:
      "The figures on this page have not yet completed legal review and are not published. Confirm every one with us before acting on it.",
  },

  routes: {
    home: "Home",
    about: "About Us",
    team: "Our Team",
    contact: "Contact Us",
    search: "Properties",
    knowledge: "Knowledge Centre",
    article: "Article",
    development: "Development",
    citizenshipHub: "Citizenship by Investment",
    citizenshipProgramme: "Programme",
    goldenVisaHub: "Golden Visa & Residency",
    goldenVisaProgramme: "Programme",
    realEstateHub: "Real Estate",
    country: "Country",
    compareIndex: "Compare Programmes",
    comparison: "Comparison",
    investorProtection: "Investor Protection",
    faqIndex: "Ask Multi Mulk",
    faq: "Question",
    caseStudies: "Client Outcomes",
    caseStudy: "Case Study",
    tools: "Tools",
    authors: "Our Team",
    author: "Profile",
    legal: "Legal",
  },

  nav: {
    citizenship: "Citizenship",
    goldenVisa: "Golden Visa",
    realEstate: "Real Estate",
    protection: "Investor Protection",
    knowledge: "Knowledge",
    about: "About",
  },

  menus: {
    about: {
      heading: "About Us",
      body: "Multi Mulk is an international property and citizenship advisory, specialising in Turkish citizenship by investment and connecting global citizens with landmark residences across Türkiye and the Caribbean.",
      ourStory: "Our Story",
      ourTeam: "Our Team",
    },
    realEstate: {
      heading: "Real Estate",
      body: "Developments in İstanbul, on the Turkish coast and across the Caribbean — each assessed against its market before it enters the portfolio.",
    },
    citizenship: {
      label: "Citizenship by Investment",
      turkiyeRoutes: [
        "{investment} property route",
        "Held for {holding}",
        "Spouse and children under 18 included",
      ],
    },
    /** Unit counts under each portfolio card, keyed by development slug. */
    detail: {
      "bosphorus-heights": "165 Apartments",
      "marmara-vista": "151 Apartments",
      "levent-residences": "420 Apartments + 11 Townhouses",
      "aegean-bay-residences": "88 Apartments",
      "antalya-coast": "1,023 Apartments in 3 Buildings",
      "anatolian-villas": "Private villas in exclusive neighbourhoods",
      "la-sagesse-collection": "94 premier Apartments",
      "intercontinental-grenada": "120 rooms including 30 private suites",
      "six-senses-la-sagesse": "56 pool suites with 15 pool villas",
      "intercontinental-dominica": "151 Guest Rooms & 10 Private Suites",
      "park-hyatt-st-kitts": "126 rooms and an exclusive yacht marina",
      "port-cabrits-marina": "150-berth superyacht facility",
    },
  },

  /** Home page. */
  hero: {
    heading: "Citizenship, Residency & Global Investment",
    body: "Invest globally. Secure residency. Build a second-home strategy — advised by people who will tell you when a programme does not fit.",
    pathsLabel: "Where would you like to start?",
    paths: {
      citizenship: "Get Citizenship",
      residency: "Get Residency",
      property: "Invest in Property",
    },
    slides: {
      "istanbul-dusk": "Where two continents meet",
      "island": "Government-approved Caribbean programmes",
      "dubai": "A ten-year residence, renewable",
      "advisory": "Advice before inventory",
    },
    showSlide: "Show {name}",
    propertyType: "Property Type",
    bedroom: "Bedroom",
    country: "Country",
    currency: "Currency",
    maximumPrice: "Maximum price",
  },

  welcome: {
    eyebrow: "Welcome to Multi Mulk",
    heading: "Global Solutions for Global Citizens",
    body: "Multi Mulk helps internationally minded families and investors put down roots in the world’s most desirable places. Turkish citizenship by investment is at the centre of what we do — from landmark İstanbul addresses to the Aegean coast — alongside select Caribbean programmes. We guide every step: property selection, purchase, and the citizenship application itself, with offices across Türkiye, the UAE and Pakistan.",
  },

  video: {
    eyebrow: "IPS Dubai Expo 2026",
    heading: "Top 14 İstanbul Investment Projects",
    play: "Play video",
  },

  regions: {
    turkiye: { label: "Türkiye" },
    caribbean: { label: "Caribbean" },
  },

  turkiyeSection: {
    eyebrow: "Türkiye Property",
    heading: "Turkish Citizenship Living",
    body: "Discover our portfolio of Türkiye properties, featuring contemporary architecture, prime İstanbul and coastal settings, and residences that qualify for citizenship by investment.",
    /** Keyed by development slug; the names beside them are never translated. */
    descriptions: {
      "bosphorus-heights":
        "In Beyoğlu, moments from Galata and the ferry piers, Bosphorus Heights offers 165 residences framing the strait and the historic peninsula beyond.",
      "marmara-vista":
        "Marmara Vista offers 151 exquisite studio, 1- and 2-bedroom residences on İstanbul’s western shore, with serene, panoramic views across the Marmara Sea.",
      "levent-residences":
        "A landmark Şişli address minutes from the Levent financial district, with 420 apartments and 11 exclusive townhouses.",
      "aegean-bay-residences":
        "A haven above a quiet Bodrum bay, offering 88 luxurious studio, 1-bedroom, and 2-bedroom residences.",
      "antalya-coast":
        "On the Konyaaltı shoreline, Antalya Coast offers 1,023 residences across three signature buildings, blending apartments, penthouses, and amenities.",
      "anatolian-villas":
        "Discover our four villa types in Sarıyer, designed for residents seeking privacy, elegance, and a tailored approach to modern luxury.",
    },
  },

  awards: {
    eyebrow: "Awards & Achievements",
    heading: "Recognized for Excellence",
    captions: {
      beachfront: "Best Beachfront Property of the Year",
      michelin: "One Michelin Key - A Very Special Stay",
      eco: "The Best Eco-Friendly Resort of the Year - 2025",
      travel: "The Best in Travel 2025",
      newHotels: "The Best New Hotels in North America & the Caribbean",
      luxuryHotels:
        "31 Incredible Luxury Hotels Opening Around the World This Year",
    },
  },

  caribbeanSection: {
    heading: "Caribbean Island Retreats",
    body: "Discover our expanding portfolio across the Caribbean—beachfront resorts and iconic branded developments that offer long-term value, immersive experiences and global appeal, with select government-approved projects also providing an approved pathway to Citizenship by Investment.",
    /** Keyed by resort slug; the resort names themselves stay as written. */
    descriptions: {
      "park-hyatt-st-kitts":
        "Park Hyatt St. Kitts, opened in 2017, presents 126 luxurious rooms and suites with island-inspired design, expansive ocean views, and access to Christophe Harbour’s marina.",
      "intercontinental-grenada":
        "Opening in 2026, the resort presents 120 rooms, 30+ luxury suites, exceptional dining, spa experiences, and stunning Caribbean-inspired design and architecture.",
      "intercontinental-dominica":
        "A luxurious retreat on Dominica’s white-sand beaches, embracing rainforest and sea, with elegant design, stunning Caribbean views, and adventure at your doorstep.",
      "six-senses-la-sagesse":
        "A sanctuary of wellness and luxury, Six Senses La Sagesse offers low-rise villas, ocean vistas, and an intimate, culturally rich Grenada experience.",
      "la-sagesse-collection":
        "Experience 96 exclusive residences on La Sagesse Bay, where natural beauty meets luxury, with crystal waters, sun-kissed sands, and neighbours Six Senses La Sagesse and InterContinental Grenada La Sagesse.",
      "port-cabrits-marina":
        "In Bell Hall near Portsmouth, this premier waterfront destination blends seclusion, natural beauty, and world-class hospitality with superyacht berths, luxury dining, and boutique retail.",
    },
  },

  destinations: {
    passportAlt:
      "The passport issued under the {region} citizenship-by-investment programme",
    turkiye: {
      label: "Türkiye",
      eyebrow: "İstanbul, Türkiye",
      heading: "Where Two Continents Meet",
      body: "Türkiye pairs one of the world’s great cities with a coastline that runs from the Aegean to the Mediterranean. İstanbul alone spans two continents, and the citizenship-by-investment programme makes a property purchase here a route to a second passport — a combination no other market offers at this scale.",
      stats: {
        threshold: "Citizenship Threshold",
        months: "Processing Time",
        visaFree: "Visa-Free Destinations",
      },
    },
    caribbean: {
      label: "Caribbean",
      eyebrow: "Caribbean",
      heading: "Home to the Caribbean’s Most Iconic Destinations",
      body: "The Caribbean is home to a growing collection of the residences and resort developments we represent, spread across several island destinations — many of them tied to government-approved citizenship-by-investment routes.",
      stats: {
        years: "Years of Experience",
        clients: "Happy Clients",
        properties: "Verified Properties",
      },
    },
  },

  articlesSection: {
    heading: "The Latest Articles",
    body: "Discover all the latest updates, insights, and valuable resources right here. This hub provides blog posts, press releases, and detailed guides to keep you up to date on our projects.",
    categoryLabel: "Articles Category",
  },

  /** Article categories and sort order, keyed by the values in `media.ts`. */
  articles: {
    categories: {
      All: "All",
      "Press Media": "Press Media",
      Blog: "Blog",
    },
    /** The Knowledge Centre's pillars; the index filters on these. */
    topics: {
      citizenship: "Citizenship",
      residency: "Residency",
      "real-estate": "Real Estate",
      turkiye: "Türkiye",
      news: "News",
    },
    sort: { Newest: "Newest", Oldest: "Oldest" },
    sortLabel: "Sort articles",
    empty: "Nothing filed under {filter} yet.",
    /**
     * Headlines and bodies, keyed by article slug. English is the source, so
     * this stays empty here; the other four fill in whichever pieces have been
     * translated and the rest falls back to `media.ts`.
     */
    copy: staged<ArticleCopy>({}),
  },

  footer: {
    columns: {
      turkiye: "Türkiye",
      caribbean: "Caribbean",
      about: "About Us",
    },
    /** The About column's items; the two portfolio columns list development
     *  names, which are not translated. */
    aboutItems: {
      ourStory: "Our Story",
      ourTeam: "Our Team",
      turkishCitizenship: "Turkish Citizenship",
      caribbeanCbi: "Caribbean CBI",
      mediaCentre: "Media Centre",
      construction: "Construction Updates",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      imageCredits: "Image Credits",
    },
    contactTitle: "Contact Us",
    /** One entry per office in `contact.offices`, head office first. */
    addresses: {
      UAE: "Grosvenor Business Tower, Office 1909, Al Thanyah First, Barsha Heights, Dubai",
      "Türkiye": "Burc Plaza, Gökevler Mah. 2312 Sk. Blok No:18J, Kat:5, Ofis No:48-49, Beykent / Istanbul",
      Pakistan: "13 Sher Shah Block, Garden Town, Lahore, Pakistan",
    },
    copyright: "© 2026 Multi Mulk. All Rights Reserved.",
    /** Office labels beside each phone number. */
    offices: { UAE: "UAE", Türkiye: "Türkiye", Pakistan: "Pakistan" },
  },

  whatsapp: {
    label: "Hello!",
    message: "Hello Multi Mulk, I'd like to know more about your properties.",
    aria: "Chat with Multi Mulk on WhatsApp",
  },

  /** /about */
  about: {
    hero: {
      heading: "Crafting a Legacy of Unrivaled Distinction",
      body: "Our work begins with the people we act for. Multi Mulk brings together property specialists, citizenship advisors and legal counsel so that a purchase in İstanbul or on a Caribbean bay is handled as one considered decision — not a series of loose ends.",
    },
    intro: {
      heading: "Redefining Luxury, One Destination at a Time",
      paragraphs: [
        "Multi Mulk is an international property and citizenship advisory working across two of the most compelling markets open to global citizens. In Türkiye we represent landmark residences on both shores of İstanbul and along the Aegean and Mediterranean coasts, every one of them measured against the USD 400,000 threshold that opens the Turkish citizenship-by-investment programme.",
        "In the Caribbean we work with government-approved developments in Grenada, Dominica and St. Kitts & Nevis — among them Six Senses La Sagesse, InterContinental Grenada – La Sagesse and Park Hyatt St. Kitts — where a single investment carries both a residence and a second passport. Offices in Türkiye, the UAE and Pakistan keep our clients close to the desk handling their file.",
      ],
      stats: {
        experience: "Years of experience",
        clients: "Happy clients",
        properties: "Verified properties",
      },
      imageAlt: "Waterfront residences in the Multi Mulk portfolio",
    },
    regions: {
      turkiye: {
        label: "Türkiye",
        body: "A country where two continents meet and a coastline runs from the Bosphorus to the Mediterranean. Our Türkiye developments pair central city addresses with quiet coastal bays — and a direct, government-backed route to citizenship.",
        imageAlt: "İstanbul residences overlooking the Bosphorus",
      },
      caribbean: {
        label: "Caribbean",
        body: "A world of calm waters, soft horizons, and unhurried beauty. Our Caribbean destinations embrace the essence of island life, crafting considered retreats where nature, architecture, and well-being exist in perfect balance.",
        imageAlt: "A Caribbean bay in the Multi Mulk portfolio",
      },
    },
    principles: {
      heading: "The Principles Behind Everything We Build",
      items: {
        craftsmanship: {
          title: "Craftsmanship That Defines Luxury",
          body: "The residences we represent are held to the precision and artistry found in the world’s most exclusive real estate. From bespoke interiors to immersive outdoor spaces, we look for an uncompromising level of detail — the kind that still reads as considered a decade after handover.",
        },
        advice: {
          title: "Advice Before Inventory",
          body: "A second citizenship is a legal undertaking before it is a purchase. We set out the thresholds, the holding periods and the timelines in plain terms, and we say when a project is the wrong fit. Clients are guided through selection, purchase and the application itself by one team.",
        },
        lifestyle: {
          title: "Lifestyle-Centric Experiences",
          body: "Beyond properties, we look for lifestyle destinations — from İstanbul’s connected districts to serene waterfront enclaves and elevated wellness retreats, chosen around how people aspire to live. Connection, privacy and well-being are what hold value long after the paperwork closes.",
        },
      },
    },
    developments: {
      heading: "Our Latest Developments",
      body: "Explore our newest residential and hospitality developments across Türkiye and the Caribbean, crafted to deliver refined living, long-term value, and exceptional lifestyle experiences.",
      cards: {
        "bosphorus-heights":
          "165 residences in Beyoğlu framing the strait and the historic peninsula beyond.",
        "aegean-bay-residences":
          "A haven above a quiet Bodrum bay, offering 88 studio, 1- and 2-bedroom residences.",
        "la-sagesse-collection":
          "A limited selection of 94 premier apartments at the edge of a private Grenadian beach, beside Six Senses La Sagesse.",
      },
      actions: {
        turkiye: "Explore Türkiye Properties",
        caribbean: "Explore Caribbean Properties",
      },
    },
    leadership: {
      heading: "Leading with Expertise & Vision",
      body: "At the core of our work is a team of property specialists, citizenship advisors and legal counsel spread across three offices. Each file is led end to end by the desk closest to the client, so the person who answers the first question is the person who sees the application through.",
      portraitAlt: "{name}, {title} at Multi Mulk",
      /** Roles, keyed by the person's slug. Names themselves are not translated. */
      roles: {
        "sajid-ali-haydar": "Chief Executive Officer",
        "nader-djebbi": "Chief Growth Officer",
      },
    },
    map: {
      heading:
        "From coastlines to islands, our work centres on environments that support a calmer, more connected lifestyle.",
      body: "Across Türkiye and the Caribbean we focus on places shaped by their surroundings — designed with clarity, comfort, and a sense of belonging. Each development we represent reflects the same commitment to thoughtful architecture, natural settings, and a lifestyle that feels effortless and genuine.",
      imageAlt: "Aerial view of a Multi Mulk destination",
    },
    places: {
      istanbul: { title: "İstanbul", caption: "Where two continents meet" },
      bodrum: { title: "Bodrum", caption: "The Aegean coast" },
      antalya: { title: "Antalya", caption: "The turquoise coast" },
      grenada: { title: "Grenada", caption: "La Sagesse Bay" },
    },
  },

  /**
   * /citizenship/[programme]
   *
   * `turkiye` and `caribbean` are deliberately the same shape: one set of
   * components renders both pages, and the item keys under `benefits`, `steps`
   * and `faq` are shared so that neither page can drift structurally from the
   * other. What differs between the two programmes is the prose, not the keys.
   */
  citizenship: {
    eyebrow: "Citizenship by Investment",
    /** The sticky in-page rail; keys are the section ids in `citizenship.ts`. */
    anchors: {
      introduction: "Introduction",
      benefits: "Benefits",
      gallery: "Gallery",
      projects: "Developments",
      process: "How It Works",
      industry: "Industry Overview",
      about: "About Multi Mulk",
      faq: "FAQ",
    },
    browseAll: "Browse qualifying residences",
    /** Read by screen readers on the anchor rail. */
    onThisPage: "On this page",
    cta: {
      heading: "Your Next Step Starts Here",
      body: "Speak to our team about eligibility, timelines and the residences that qualify. We will tell you plainly whether the programme fits what you are trying to achieve.",
      button: "Enquire Now",
    },

    /** The industry timeline. Shared: it is the same history on both pages. */
    industry: {
      eyebrow: "Industry Overview",
      heading: "The Investment Migration Industry",
      body: "Citizenship by investment is not a recent idea. The first programme opened in 1984, and four decades of legislation, scrutiny and reform have made it an established asset class rather than a curiosity.",
      marketLabel: "Global market value",
      growthLabel: "Annual growth",
      timelineHeading: "Programmes, in the order they opened",
      /** Marks the entries belonging to the programme being read. */
      thisProgramme: "This programme",
    },

    /** Who the reader would actually be working with. Shared for the same reason. */
    about: {
      eyebrow: "About Multi Mulk",
      heading: "Your Partner for a Second Citizenship",
      body: "Multi Mulk brings property specialists, citizenship advisors and legal counsel together under one roof, across offices in Türkiye, the UAE and Pakistan. We represent the developments ourselves rather than broker them at a distance, which is why we can be specific about what a residence is worth, what a programme requires, and when neither one fits. Every figure we quote is confirmed in writing before you commit to anything.",
      link: "Learn More About Us",
    },

    turkiye: {
      hero: {
        heading: "Turkish Citizenship by Investment",
        body: "A single qualifying property purchase leads to citizenship for you, your spouse and your children under 18 — with no requirement to live in Türkiye before or after.",
      },
      intro: {
        eyebrow: "Introduction",
        heading: "Citizenship Through Property You Actually Own",
        paragraphs: [
          "Türkiye runs the only major programme that turns a straightforward property purchase into full citizenship. Nothing is donated and nothing is surrendered: you buy a residence at or above the USD 400,000 threshold, hold it for three years, and the investment stays yours to sell afterwards while the citizenship remains with your family for life.",
          "Multi Mulk represents developments on both shores of İstanbul and along the Aegean and Mediterranean coasts, each one measured against that threshold before it enters our portfolio. Property specialists, citizenship advisors and legal counsel work as a single team, so the person who answers your first question is the person who sees the application through to the passport.",
        ],
      },
      stats: {
        investment: "Minimum Property Investment",
        timeline: "Processing Time",
        visaFree: "Visa-Free Destinations",
        holding: "Holding Period",
      },
      benefits: {
        eyebrow: "Programme Benefits",
        heading: "What Turkish Citizenship Opens",
        body: "Citizenship here is a working asset rather than a document in a drawer: mobility, a foothold between Europe and Asia, and a property that continues to earn.",
        items: {
          citizenship: {
            title: "Citizenship for Life, and for Your Family",
            body: "Turkish citizenship is granted for life and passes to your descendants. One application covers you, your spouse and your children under 18, and children born afterwards are Turkish from birth. Türkiye permits dual citizenship, so nothing has to be given up to take it.",
          },
          mobility: {
            title: "Mobility Between Europe and Asia",
            body: "A Turkish passport opens visa-free or visa-on-arrival access to more than 110 destinations, and Türkiye’s treaty with the United States gives citizens a route to the E-2 investor visa that most programmes cannot offer. İstanbul’s two airports put much of Europe, the Gulf and Central Asia within a few hours.",
          },
          assets: {
            title: "A Residence That Keeps Working",
            body: "The threshold is met by buying, not by donating. You take title to a real residence in a real market — one you can live in, let, or hand to your children — and once the three-year holding period ends it can be sold at whatever the market has made it worth.",
          },
          process: {
            title: "A Fast, Codified Process",
            body: "The programme is set out in Turkish law rather than granted case by case, and runs a predictable three to six months from valuation to passport. There is no interview, no language test, and no requirement to reside in Türkiye at any point.",
          },
        },
      },
      gallery: {
        eyebrow: "Gallery",
        heading: "Where Two Continents Meet",
        body: "İstanbul on both shores, the Aegean at Bodrum, the Mediterranean at Antalya — the settings behind the residences that qualify.",
      },
      signature: {
        heading: "A Signature CBI Investment on Two Shores",
        body: "Türkiye is the only major programme where the threshold is met by owning rather than donating, in a market deep enough to sell back into. İstanbul spans two continents and prices at a fraction of comparable European capitals, and the coast runs from the Aegean to the Mediterranean — which is why a qualifying purchase here tends to be judged on its own merits before the passport is counted at all.",
        button: "Enquire About Turkish CBI",
      },
      enquire: {
        heading: "Secure Global Mobility Through Türkiye’s CBI Programme",
        body: "Tell us what you are trying to achieve and we will come back with the residences that qualify, the total cost beyond the purchase price, and a realistic timeline.",
      },
      projects: {
        heading: "Developments That Qualify",
        body: "Every residence below sits at or above the USD 400,000 threshold at current valuations. Stock moves quickly at the qualifying tier, so figures are confirmed against the official valuation report before any commitment is made.",
      },
      process: {
        eyebrow: "How It Works",
        heading: "From First Conversation to Passport",
        body: "Five stages, handled by one team. Most families complete the route in three to six months without setting foot in Türkiye.",
        steps: {
          consultation: {
            title: "Consultation",
            body: "We set out the threshold, the holding period, the costs beyond the purchase price and a realistic timeline — and we say so when the programme is the wrong fit for what you are trying to achieve.",
          },
          selection: {
            title: "Property Selection",
            body: "We shortlist residences that clear the threshold on their official valuation rather than their asking price, and arrange viewings either in person or remotely.",
          },
          purchase: {
            title: "Purchase and Title Deed",
            body: "Your lawyer completes the transfer under power of attorney if you would rather not travel. The title deed is registered with the three-year non-resale annotation the programme requires.",
          },
          application: {
            title: "Citizenship Application",
            body: "We file the certificate of conformity, the residence permit and the citizenship application together, with due diligence documents prepared in advance so nothing stalls at the desk.",
          },
          passport: {
            title: "Approval and Passport",
            body: "On approval, passports are issued for you and every family member named on the application. Your property remains yours throughout, and is free to sell once the three years have passed.",
          },
        },
      },
      faq: {
        heading: "Frequently Asked Questions",
        items: {
          what: {
            question: "What is the Turkish Citizenship by Investment Programme?",
            answer:
              "A route written into Turkish law that grants full citizenship to foreign nationals who buy property in Türkiye at or above USD 400,000 and hold it for three years. Unlike a donation-based programme, the investment is an asset you own and can sell once the holding period ends, while the citizenship itself is permanent.",
          },
          options: {
            question: "What investment options qualify?",
            answer:
              "Property is the route most of our clients take, at a minimum of USD 400,000 confirmed by an official valuation report. Turkish law also recognises a USD 500,000 bank deposit, government bond purchase or capital investment, each held for three years. The property route is the only one that leaves you with a usable asset in a market you have chosen.",
          },
          timeline: {
            question: "How long does the process take?",
            answer:
              "Three to six months from purchase to passport in a typical file. The title transfer itself takes days; most of the time goes to the certificate of conformity and the citizenship application. Files stall when documents are incomplete, which is why we prepare due diligence paperwork before the purchase rather than after.",
          },
          family: {
            question: "Who can be included in the application?",
            answer:
              "You, your spouse and your children under 18 are covered by a single application and a single threshold. Children over 18 must apply on their own investment. Any child born after citizenship is granted is Turkish from birth.",
          },
          residency: {
            question: "Do I need to live in or travel to Türkiye?",
            answer:
              "No. There is no residency requirement before or after citizenship, no minimum stay to maintain it, and no interview or language test. The purchase itself can be completed by your lawyer under power of attorney, so the entire route can run without you leaving home.",
          },
          benefits: {
            question: "What does a Turkish passport give me?",
            answer:
              "Visa-free or visa-on-arrival access to more than 110 destinations, the right to live, work and study in Türkiye, and eligibility to apply for the United States E-2 investor visa under Türkiye’s treaty. Türkiye allows dual citizenship, so you keep your existing nationality.",
          },
          dueDiligence: {
            question: "What checks are carried out on applicants?",
            answer:
              "Applicants are screened for criminal record, sanctions listings and the source of the funds being invested. The standard is real and applications are refused, which is what keeps the programme credible with the banks and border agencies that matter. We flag anything likely to cause difficulty before you commit.",
          },
          resale: {
            question: "Can I sell the property afterwards?",
            answer:
              "Yes. The title deed carries a three-year annotation against resale; once it lapses the residence is yours to sell, let or keep, at whatever the market values it at. Selling does not affect the citizenship of anyone named on the application — it is granted for life.",
          },
        },
      },
    },

    caribbean: {
      hero: {
        heading: "Caribbean Citizenship by Investment",
        body: "Grenada, Dominica and St. Kitts & Nevis run three of the world’s longest-established programmes — each with a government-approved route through the resorts we represent.",
      },
      intro: {
        eyebrow: "Introduction",
        heading: "Three Programmes, One Approved Portfolio",
        paragraphs: [
          "The Caribbean invented citizenship by investment. St. Kitts & Nevis opened the first programme in 1984 and Dominica followed in 1993, which is why these passports are recognised at borders and by banks in a way newer programmes are not. Each island runs its own legislation, its own thresholds and its own list of approved developments.",
          "Multi Mulk works only with government-approved projects — among them Six Senses La Sagesse and InterContinental Grenada – La Sagesse, the InterContinental Dominica Cabrits Resort & Spa, and Park Hyatt St. Kitts. A single investment carries both a share in a branded resort asset and a second passport for the family. Grenada is worth singling out: it is the only Caribbean programme holding a treaty with the United States.",
        ],
      },
      stats: {
        investment: "Minimum Real Estate Investment",
        timeline: "Processing Time",
        visaFree: "Visa-Free Destinations",
        holding: "Holding Period",
      },
      benefits: {
        eyebrow: "Programme Benefits",
        heading: "Your Legacy, Upgraded",
        body: "A Caribbean passport is a hedge and an asset at once — mobility that does not depend on any single government, held alongside a share of a resort that continues to trade.",
        items: {
          citizenship: {
            title: "Citizenship for Life, Across Generations",
            body: "Caribbean citizenship is granted for life and passes to your descendants. Depending on the island, one application can cover your spouse, your children, and dependent parents or grandparents — which makes it a legacy asset rather than a travel document.",
          },
          mobility: {
            title: "Access to 140+ Destinations",
            body: "These passports carry visa-free or visa-on-arrival access to more than 140 destinations, including the Schengen Area, the United Kingdom, Singapore and Hong Kong. Grenada adds a treaty with the United States, the only Caribbean programme to hold one.",
          },
          assets: {
            title: "Ownership in Branded Resorts",
            body: "The approved developments are not shell projects. They are operated by Six Senses, InterContinental and Park Hyatt, which means an asset with rental performance, a resale market, and a name recognised well beyond the island it stands on.",
          },
          process: {
            title: "The Longest-Established Programmes",
            body: "St. Kitts & Nevis has run its programme since 1984 and Dominica since 1993. Four decades of legislation, international scrutiny and independent due diligence firms are why these passports still clear checks that newer programmes struggle with.",
          },
        },
      },
      gallery: {
        eyebrow: "Gallery",
        heading: "Islands, and What Was Built on Them",
        body: "La Sagesse Bay in Grenada, Cabrits in Dominica, Christophe Harbour in St. Kitts — the approved developments, as they stand.",
      },
      signature: {
        heading: "A Signature CBI Investment Across Three Islands",
        body: "The approved developments here are operated by Six Senses, InterContinental and Park Hyatt — names that carry a rental market and a resale market with them. Grenada, Dominica and St. Kitts each run their own legislation and their own thresholds, so the first question is never which unit but which island, and we work that out before showing you anything.",
        button: "Enquire About Caribbean CBI",
      },
      enquire: {
        heading: "Secure Global Mobility Through the Caribbean CBI Programmes",
        body: "Tell us what you are trying to achieve and we will come back with the island that fits, the developments approved under it, and a realistic timeline.",
      },
      projects: {
        heading: "Government-Approved Developments",
        body: "Each development below is approved under its island’s programme. Thresholds and unit availability differ by project and change with legislation, so we confirm both in writing before any commitment is made.",
      },
      process: {
        eyebrow: "How It Works",
        heading: "From First Conversation to Passport",
        body: "Five stages, handled by one team. No island requires you to travel, and most families complete the route in three to six months.",
        steps: {
          consultation: {
            title: "Consultation",
            body: "Grenada, Dominica and St. Kitts differ on thresholds, on who counts as a dependant, and on what the passport opens. We work out which of the three actually fits your family before looking at a single property.",
          },
          selection: {
            title: "Project Selection",
            body: "We shortlist units within the government-approved developments on your chosen island, and set out what each one means for rental performance and eventual resale — not only for eligibility.",
          },
          purchase: {
            title: "Reservation and Escrow",
            body: "Funds are placed with the appointed escrow agent rather than paid to the developer directly, and released against construction milestones. Your purchase agreement can be signed under power of attorney if you would rather not travel.",
          },
          application: {
            title: "Application and Due Diligence",
            body: "An authorised agent files the application with the island’s citizenship unit. Independent international firms then run the background and source-of-funds checks, and this is the stage that sets the timeline.",
          },
          passport: {
            title: "Approval and Passport",
            body: "On approval you take the oath — remotely, at an embassy, or on the island — and passports are issued for everyone named on the application. The resort share stays yours, and can be sold once the holding period ends.",
          },
        },
      },
      faq: {
        heading: "Frequently Asked Questions",
        items: {
          what: {
            question: "What is Caribbean Citizenship by Investment?",
            answer:
              "Grenada, Dominica and St. Kitts & Nevis each run a programme, written into their own law, granting citizenship to foreign nationals who make an approved economic contribution — either a donation to a national fund or an investment in a government-approved real estate project. St. Kitts opened the first such programme in 1984, making these the oldest and most heavily scrutinised routes in the industry.",
          },
          options: {
            question: "What investment options are available?",
            answer:
              "Every island offers two routes: a non-refundable donation to a national development fund, which is cheaper but returns nothing, and an investment in an approved real estate project starting from around USD 200,000. The real estate route costs more up front and leaves you with an asset that can be sold after the holding period. Multi Mulk works on the real estate route.",
          },
          timeline: {
            question: "How long does the process take?",
            answer:
              "Three to six months in a typical file, from application to passport. The due diligence stage sets the pace rather than the paperwork, which is why we assemble source-of-funds documentation before filing rather than in response to a query.",
          },
          family: {
            question: "Who can be included in the application?",
            answer:
              "Your spouse and dependent children are covered on every island, and depending on the programme you may also include dependent parents or grandparents, and unmarried dependent siblings. The rules differ between Grenada, Dominica and St. Kitts, and this is often what decides which programme a family should choose.",
          },
          residency: {
            question: "Do I need to travel to or live in the Caribbean?",
            answer:
              "No. None of the three programmes requires residence, a minimum stay, an interview or a language test, and the process can be completed remotely. Grenada requires no visit at all; the others can administer the oath at an embassy or consulate.",
          },
          benefits: {
            question: "What do these passports give me?",
            answer:
              "Visa-free or visa-on-arrival access to more than 140 destinations including the Schengen Area, the United Kingdom, Singapore and Hong Kong; lifetime citizenship that passes to your descendants; and no tax on worldwide income, capital gains or inheritance in any of the three countries. Grenada additionally qualifies holders for the United States E-2 investor visa.",
          },
          dueDiligence: {
            question: "What checks are carried out on applicants?",
            answer:
              "Each government commissions independent international due diligence firms to verify identity, criminal record, sanctions exposure and source of funds, alongside its own citizenship unit review. The standard has tightened considerably under pressure from the European Union and the United States, and applications are refused. We assess a file honestly before you spend anything on it.",
          },
          resale: {
            question: "Can I sell the real estate afterwards?",
            answer:
              "Yes, once the holding period ends — typically five years, though it varies by island and by whether your buyer is themselves applying for citizenship. Many approved developments also pay rental returns during the holding period. Selling has no effect on your citizenship, which is granted for life.",
          },
        },
      },
    },
  },

  /** /media-centre and /media-centre/[slug] */
  media: {
    heroEyebrow: "Media Centre",
    showArticle: "Show “{title}”",
    indexHeading: "All Articles",
    indexBody:
      "Discover all the latest updates, insights, and valuable resources right here. This hub provides blog posts, press releases, and detailed guides to keep you up to date on our projects.",
    newsletter: {
      heading: "Dive deeper, stay informed",
      body: "Never miss a wave — stay in the loop with every update.",
      cta: "Enquire Now",
    },
    article: {
      categoryLabel: "Category:",
      publishedLabel: "Published on:",
      sourceLabel: "Source:",
      relatedHeading: "Related Articles",
      /** `{count}` is pre-formatted for the locale before substitution. */
      readingTime: plural({ one: "{count} min read", other: "{count} min read" }),
    },
  },

  /** /search-property */
  search: {
    heading: "Your Next Address Starts Here",
    body: "Browse residences with resort access, sweeping views, and effortless coastal living—tailored to your search. Explore curated beachfront homes across the UAE and the Caribbean—filtered to your preferences.",
    panelHeading: "Find the Finest Residences",
    /** `{count}` is pre-formatted for the locale before substitution. */
    showing: plural({
      one: "Showing {count} Unit",
      other: "Showing {count} Units",
    }),
    searchLabel: "Search",
    searchPlaceholder: "Residence name",
    propertyType: "Property Type",
    bedroom: "Bedroom",
    currency: "Currency",
    location: "Location",
    cbiOnly: "Citizenship eligible only",
    cbiHint: "From USD {amount} — the Türkiye CBI property threshold",
    noResults: "No residences match those filters",
  },

  /** The unit card, and the vocabulary its specs are written in. */
  unit: {
    citizenshipEligible: "Citizenship Eligible",
    soldOut: "Sold Out",
    /** Pre-fills the subject line when "Enquire Now" opens the form. */
    enquirySubject: "Enquiry about {unit}, {place}",
    types: { Apartment: "Apartment", Townhouse: "Townhouse", Villa: "Villa" },
    studio: "Studio",
    bedrooms: plural({ one: "{count} Bedroom", other: "{count} Bedrooms" }),
    bathrooms: plural({ one: "{count} Bathroom", other: "{count} Bathrooms" }),
    /** Layout suffixes that follow the bedroom count in a unit title. */
    layouts: {
      Simplex: "Simplex",
      Duplex: "Duplex",
      "Townhouse + Maid": "Townhouse + Maid",
    },
    /** Appended to the numeric range in `Unit.size`. */
    sqft: "sq. ft.",
    /** `Unit.level`: a floor range, then the named blocks. */
    level: "Level {range}",
    levels: {
      "Ground Floor": "Ground Floor",
      "First Floor": "First Floor",
      "East Wing": "East Wing",
      "West Wing": "West Wing",
      "Sky Lofts": "Sky Lofts",
      "Marjan Lofts": "Marjan Lofts",
      "Mrjan Lofts": "Marjan Lofts",
      "Luxury Residences": "Luxury Residences",
      Townhouses: "Townhouses",
    },
    views: {
      "Sea View": "Sea View",
      "City View": "City View",
      "Sea View & Island View": "Sea View & Island View",
      "Casino & Island View": "Casino & Island View",
      "Island & Casino": "Island & Casino",
    },
  },

  /**
   * Place names — used as filter values, in card eyebrows and in the
   * destination lists. Every language spells these out in its own script;
   * `lookup()` falls back to the English key for any left untranslated.
   */
  places: {
    Türkiye: "Türkiye",
    Caribbean: "Caribbean",
    İstanbul: "İstanbul",
    Antalya: "Antalya",
    Muğla: "Muğla",
    Grenada: "Grenada",
    Şişli: "Şişli",
    Beylikdüzü: "Beylikdüzü",
    Beyoğlu: "Beyoğlu",
    Bodrum: "Bodrum",
    Sarıyer: "Sarıyer",
    Konyaaltı: "Konyaaltı",
    Dominica: "Dominica",
    "St. Kitts & Nevis": "St. Kitts & Nevis",
    "Antigua & Barbuda": "Antigua & Barbuda",
    "St. Lucia": "St. Lucia",
    "La Sagesse Bay": "La Sagesse Bay",
    "Cabrits National Park": "Cabrits National Park",
    "Christophe Harbour": "Christophe Harbour",
    Portsmouth: "Portsmouth",
  },

  /** /properties/[slug] */
  property: {
    viewResidences: "View Residences",
    viewProgress: "View Construction Progress",
    residencesEyebrow: "Find Your Dream Home",
    residencesHeading: "Available Residences",
    residencesBody: plural({
      one: "Explore the {count} residence currently released at {project}.",
      other: "Explore the {count} residences currently released at {project}.",
    }),
    residencesCount: plural({
      one: "{count} residence",
      other: "{count} residences",
    }),
    residencesEmpty:
      "Residences at {project} are released in phases — enquire for current availability.",
    browseAll: "Browse all residences",
    amenities: "Amenities",
    otherDevelopments: "Other Developments",
    /**
     * Per-development copy, keyed by slug. Long-form prose — `description`,
     * the overview body, the amenity blurb and each highlight's text — is
     * deliberately not carried here; those fall back to the English in
     * `projects.ts` through `pick()` until human translations land.
     */
    projects: {
      "levent-residences": {
        tagline: "A Landmark Address in the Heart of İstanbul",
        overviewHeading: "Each Residence: A Panorama of the City.",
      },
      "bosphorus-heights": {
        tagline: "Elevated Living Above the Strait",
        overviewHeading: "Framed by Water, Crowned by Sky.",
      },
      "marmara-vista": {
        tagline: "Coastal Calm on İstanbul’s Western Shore",
        overviewHeading: "Space, Light and the Open Sea.",
      },
      "aegean-bay-residences": {
        tagline: "The Ideal Escape on the Bodrum Peninsula",
        overviewHeading: "Wake Up to the Aegean.",
      },
    },
    /** Highlight headings, keyed by their English text. */
    highlights: {
      "Central Connectivity": "Central Connectivity",
      "Citizenship Eligible": "Citizenship Eligible",
      "City and Bosphorus Views": "City and Bosphorus Views",
      "Bosphorus Outlook": "Bosphorus Outlook",
      "Heritage Quarter": "Heritage Quarter",
      "Marmara Sea Views": "Marmara Sea Views",
      "Family Neighbourhood": "Family Neighbourhood",
      "Airport Access": "Airport Access",
      "Bodrum Peninsula": "Bodrum Peninsula",
      "Unmatched Coastal Living": "Unmatched Coastal Living",
    },
    /** Stat labels, keyed by their English text. */
    stats: {
      Quantity: "Quantity",
      Floors: "Floors",
      Location: "Location",
      "Room Sizes": "Room Sizes",
      Apartments: "Apartments",
      Townhouses: "Townhouses",
      "Studio Apartments": "Studio Apartments",
    },
    /**
     * Stat *values*, keyed by their English text. The labels above are keyed
     * separately; these are the figures beside them, and they carry words —
     * "apartments", "sq. ft." — so they need translating too. Left untranslated
     * they also read badly right-to-left, where a bare Latin run inside an
     * Arabic line reorders around the numeral.
     */
    statValues: {
      "420 apartments": "420 apartments",
      "11 townhouses with 3 & 5 bedrooms": "11 townhouses with 3 & 5 bedrooms",
      "Studio, 1, 2, 3 bedroom units": "Studio, 1, 2, 3 bedroom units",
      "512 sq. ft. - 6,600 sq. ft.": "512 sq. ft. - 6,600 sq. ft.",
      "165 total apartments": "165 total apartments",
      "78 studio units": "78 studio units",
      "87 one-bedroom units": "87 one-bedroom units",
      "Beyoğlu, İstanbul": "Beyoğlu, İstanbul",
      "151 apartments": "151 apartments",
      "Studio, 1 & 2 bedroom units": "Studio, 1 & 2 bedroom units",
      "479 sq. ft. - 1,709 sq. ft.": "479 sq. ft. - 1,709 sq. ft.",
      "Floor 1 - 15": "Floor 1 - 15",
      "88 apartments": "88 apartments",
      "Studio to 3 bedrooms": "Studio to 3 bedrooms",
      "572 sq. ft. - 3,874 sq. ft.": "572 sq. ft. - 3,874 sq. ft.",
      "Bodrum, Muğla": "Bodrum, Muğla",
    },
    /**
     * The long prose on a development page, keyed by slug — description,
     * overview body, amenity blurb and each highlight's paragraph. Empty in
     * English, which is the source these fall back to.
     */
    copy: staged<ProjectCopy>({}),
    /** Amenity names, keyed by their English text. */
    amenityItems: {
      "Lobby & Concierge": "Lobby & Concierge",
      Lobby: "Lobby",
      Concierge: "Concierge",
      "Spa & Hammam": "Spa & Hammam",
      "Residents’ Lounge": "Residents’ Lounge",
      "Fitness Centre": "Fitness Centre",
      Gym: "Gym",
      "Landscaped Terrace": "Landscaped Terrace",
      "Secure Parking": "Secure Parking",
      "Indoor Pool": "Indoor Pool",
      "Outdoor Pool": "Outdoor Pool",
      "Pool Terrace": "Pool Terrace",
      "Rooftop Lounge": "Rooftop Lounge",
      "Promenade Access": "Promenade Access",
      "Bay Access": "Bay Access",
      "24/7 Security": "24/7 Security",
      "Cinema Room": "Cinema Room",
      "Co-working Space": "Co-working Space",
      "Private Elevator": "Private Elevator",
      "Retail & Dining": "Retail & Dining",
      Sauna: "Sauna",
      "Yoga Studio": "Yoga Studio",
      "Landscaped Gardens": "Landscaped Gardens",
      "Children’s Play Area": "Children’s Play Area",
      "Jogging Track": "Jogging Track",
      "Tennis Court": "Tennis Court",
      "Padel Court": "Padel Court",
      "BBQ Area": "BBQ Area",
      "EV Charging": "EV Charging",
      "Smart Home": "Smart Home",
      "Pet Friendly": "Pet Friendly",
      "Beach Access": "Beach Access",
    },
  },

  /** /contact-us */
  /** /our-team. Names stay as written; roles are shared with the About page. */
  team: {
    hero: {
      heading: "The People Who Handle the File",
      body: "Multi Mulk is a small advisory by design. The person who answers your first question is the person who sees the application through, and there is no desk between the two.",
    },
    leadership: {
      eyebrow: "Executive Leadership",
      heading: "Leadership With Global Perspective",
      body: "Strategic leadership across Multi Mulk\u2019s advisory work, its offices and its long-term growth.",
    },
    people_section: {
      eyebrow: "Our People",
      heading: "Expertise Across Every Function",
      body: "Operations, sales, client advisory and digital media, working together across Dubai, \u0130stanbul and Lahore so a file is handled by one firm rather than three offices.",
    },
    portraitAlt: "{name}, {title} at Multi Mulk",
    /** The line above each name. Several people share one, so these are keyed
     *  by department rather than by person. */
    departments: {
      executiveLeadership: "Executive Leadership",
      growthDubai: "Growth & Dubai Operations",
      turkeyOperations: "T\u00fcrkiye Operations",
      operations: "Operations",
      istanbulSales: "\u0130stanbul Sales",
      sales: "Sales",
      clientAdvisory: "Client Advisory",
      digitalMedia: "Digital Media",
      mediaProduction: "Media Production",
    },
    /** Role lines under each name, keyed by slug. Two lines where the person
     *  holds two titles; the names themselves are never translated. */
    people: {
      "sajid-ali-haydar": ["Chief Executive Officer (CEO)"],
      "nader-djebbi": ["CGO", "Office Manager (Dubai)"],
      "nargis-sadiq": ["Office Manager (T\u00fcrkiye)"],
      "seyhan-ozman": ["Office Admin"],
      "fatih-abbas": ["Sales Coordinator", "\u0130stanbul Office"],
      "errfan-balouch": ["Sales Coordinator"],
      "nilofar-sadiq": ["Sales Consultant"],
      "danish-anwar": ["Sales Consultant"],
      "rizwan-saeed": ["Sales Consultant"],
      "sadaf-sarwar": ["Social Media Manager"],
      "abdul-hadi": ["Videographer"],
      "zeeshan-haider": ["Video Editor"],
    },
    cta: {
      heading: "Talk to the People Who Will Do the Work",
      body: "Tell us what you are trying to achieve. You will get a view on whether it is achievable, what it will cost beyond the headline figure, and how long it should take — before anyone asks you to commit to anything.",
    },
  },

  contact: {
    heading: "Contact Us",
    leadHeading: "A new level of luxury living awaits make it yours today.",
    leadBody:
      "Whether you are exploring Turkish citizenship by investment, looking for a property in İstanbul or on the coast, or considering a Caribbean programme, our team is here to guide you with discretion, clarity, and expertise.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    addressLabel: "Address",
    mapTitle: "Map of the Multi Mulk office in Beykent, İstanbul",
    mapLink: "Open in Google Maps",
    form: {
      name: "Name",
      namePlaceholder: "Insert your name",
      phone: "Phone Number",
      phonePlaceholder: "Phone Number",
      email: "Email",
      emailPlaceholder: "myemail@email.com",
      enquiryAbout: "What is your enquiry about?",
      subject: "Subject",
      subjectPlaceholder: "What would you like to enquire about?",
      message: "Message",
      messagePlaceholder: "Type your message..",
      consent:
        "By submitting this form, you consent to us contacting you regarding your enquiry. See our Privacy Policy for details on how we handle your data.",
      submit: "Send Enquiry",
      types: {
        turkishCitizenship: "Turkish citizenship enquiry",
        turkiyeProperty: "Türkiye property enquiry",
        caribbeanCbi: "Caribbean CBI enquiry",
        general: "General enquiry",
      },
      /**
       * The acknowledgement emailed back to the enquirer, in their own
       * language. `sentBody` below is reused as its opening paragraph — it
       * already says the one thing this email is for.
       */
      ack: {
        subject: "We have received your enquiry",
        greeting: "Dear {name},",
        yourMessage: "Your message",
        closing:
          "If your enquiry is urgent, reply to this email or call the office nearest you.",
      },
      sentHeading: "Thank You",
      sentBody:
        "Thank you for getting in touch. A member of the Multi Mulk team will reply shortly.",
      sentAgain: "Send another message",
      submitting: "Sending…",
      errors: {
        required: "This field is required.",
        email: "Enter a valid email address.",
        phone: "Enter a valid phone number, including the country code.",
        tooLong: "This is longer than we can accept.",
        /** The enquiry dialog could not fetch what it needs to submit. */
        load: "We could not load the form. The contact page carries the same one — or use the details alongside.",
        rate: "You have sent several enquiries recently. Please try again later, or email info@multimulk.com.",
        server: "We could not send your enquiry. Please try again, or email info@multimulk.com.",
      },
    },
  },

  /**
   * "Download Brochure": the button, the dialog behind it, and the email the
   * brochure arrives in. The field labels and the error messages are the
   * contact form's — it is the same three fields and the same failures — so
   * only what is particular to a brochure is written here.
   */
  brochure: {
    cta: "Download Brochure",
    heading: "The {project} Brochure",
    body: "Floorplans, finishes, specifications and payment terms in one document. Tell us where to send it and it will be in your inbox in a moment.",
    consent:
      "By requesting the brochure you consent to us contacting you about this development. See our Privacy Policy for details on how we handle your data.",
    submit: "Send Me the Brochure",
    submitting: "Sending…",
    sentHeading: "On Its Way",
    sentBody:
      "We have emailed the {project} brochure to you. If it has not arrived within a few minutes, check your spam folder.",
    /** The email itself; see `app/lib/leads/brochure.ts`. */
    email: {
      subject: "Your {project} brochure",
      greeting: "Dear {name},",
      body: "Thank you for your interest in {project}. Your brochure is ready — floorplans, finishes, specifications and payment terms.",
      button: "Download the brochure",
      closing:
        "A member of the Multi Mulk team will follow up shortly. To arrange a viewing or ask about payment terms, simply reply to this email.",
    },
  },
  /**
   * A single listed residence's own page, at /properties/<slug>. The
   * developments that ship with the site use `property` above; this is the
   * page a lister's unit gets, and every section it names is optional.
   */
  listing: {
    specs: "At a Glance",
    about: "About This Residence",
    gallery: "Gallery",
    galleryViewAll: plural({
      one: "View the photo",
      other: "View all {count} photos",
    }),
    galleryMore: "+{count} more",
    galleryCounter: "{index} of {count}",
    galleryPrevious: "Previous",
    galleryNext: "Next",
    floorPlans: "Floor Plans",
    terms: "Terms",
    paymentPlan: "Payment plan",
    handover: "Handover",
    serviceCharge: "Service charge",
    titleDeed: "Title deed",
    watchTour: "Watch the Tour",
    location: "Location",
    mapTitle: "Map of {title}",
    moreAt: "More at {project}",
    ctaHeading: "Ask us anything about this residence.",
    viewDevelopment: "View the Development",
  },
} as const;

export default en;

/**
 * The contract every other language file is checked against. `DeepMutable`
 * drops the `as const` readonly modifiers so translations can be written as
 * ordinary object literals.
 */
export type Dictionary = DeepMutable<typeof en>;

type DeepMutable<T> = T extends readonly (infer U)[]
  ? DeepMutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;
