/**
 * Publishes the Reportaj series into the Knowledge Centre.
 *
 * Same shape as `publish-investor-briefs-2026.mjs`: the copy arrives finished
 * rather than as a draft to type into /admin/articles, and re-running upserts
 * the same slugs instead of creating duplicates.
 *
 *   node --env-file=.env.local scripts/publish-reportaj-2026.mjs
 *
 * Always publishes. These are live pieces, not a review queue.
 *
 * NOTE: photography is borrowed from the existing library so nothing 404s —
 * swap `image` and `hero` for commissioned assets under /images/knowledge
 * when they exist, the way the investor briefs do.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Same split as `toBlocks` in `app/lib/rich-text.ts`. */
function toBlocks(value) {
  return value
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+$/gm, "").trim())
    .filter(Boolean);
}

const articles = [
  {
    slug: "why-international-investors-are-looking-at-turkish-real-estate-in-2026",
    title:
      "Why International Investors Are Looking at Turkish Real Estate in 2026",
    date: "2026-09-08T09:00:00.000Z",
    topics: ["turkiye", "real-estate", "citizenship"],
    excerpt:
      "From İstanbul's metropolitan market to the Antalya coast, Türkiye continues to draw international buyers in 2026 — a large and diverse property market, an established framework for foreign ownership, and a citizenship route for qualifying purchases.",
    image: "/images/antalya-coast.webp",
    hero: "/images/cbi/hero-istanbul-dusk.jpg",
    seoTitle:
      "Turkey Real Estate Investment: Why Investors Are Looking at Türkiye in 2026",
    seoDescription:
      "Discover why international investors are exploring Turkish real estate in 2026, from property opportunities and strategic locations to citizenship by investment.",
    body: `
The Turkish property market continues to attract attention from international buyers in 2026. From İstanbul's metropolitan property market to coastal destinations such as Antalya, Türkiye offers investors a combination of real estate opportunities, lifestyle advantages, geographic accessibility, and an established framework for foreign property ownership.

The market is not without challenges. Investors must consider inflation, currency movements, location-specific demand, construction quality, legal due diligence, and the long-term potential of individual properties. However, Türkiye continues to remain on the radar of buyers looking beyond traditional European and Middle Eastern property markets.

Official data also shows that international demand has not disappeared. According to the Turkish Statistical Institute (TÜİK), **2,120 homes were sold to foreign buyers in July 2026**, representing a 1.9% increase compared with July 2025. Between January and July 2026, foreign buyers purchased 11,203 homes. Russian, Iranian and Ukrainian nationals were among the leading foreign purchasers during July ([TÜİK](https://veriportali.tuik.gov.tr/tr/press/58339)).

So, what continues to make [Turkey real estate investment](/real-estate) relevant to international investors in 2026?

## 1. A Strategic Location Between Major Markets

Türkiye occupies a distinctive position connecting Europe, Asia and the Middle East.

For international investors, this geographic position is important for more than tourism. İstanbul is a major commercial and transportation hub, while cities such as Antalya have developed substantial international residential markets.

This makes Turkish real estate relevant to several different buyer profiles, including investors searching for rental properties, families looking for a second residence, entrepreneurs conducting business in Türkiye, and buyers considering long-term relocation.

Unlike markets that depend heavily on one type of foreign buyer, Türkiye attracts property interest from Europe, the Middle East, Central Asia and neighbouring regions.

## 2. A Large and Diverse Property Market

One of Türkiye's main advantages is the scale of its real estate market.

TÜİK recorded **123,603 housing transactions across Türkiye in July 2026 alone**. During the first seven months of the year, 823,119 housing sales were recorded nationally ([TÜİK](https://veriportali.tuik.gov.tr/tr/press/58339)).

For investors, this creates a market with very different property categories and investment strategies.

İstanbul may appeal to buyers prioritising business activity, population density and long-term metropolitan demand. Antalya is frequently considered by international buyers looking for tourism-related and residential opportunities. Ankara provides exposure to Türkiye's capital city, while other regional markets can offer different entry prices and development profiles — a comparison our [guide to the Bodrum, Marmaris, Fethiye and Antalya coast](/knowledge/bodrum-marmaris-fethiye-antalya-real-estate-guide) sets out in detail.

As a result, asking whether "Turkish property" is a good investment is often too broad. The more useful questions are **which city, which district, which property and for what investment objective?**

## 3. Opportunities Beyond Property Price Appreciation

Real estate investors increasingly evaluate property based on several potential sources of value rather than relying entirely on appreciation.

A property may serve as a long-term residence, generate rental income where legally and commercially appropriate, provide exposure to a developing district, or form part of a wider international asset strategy.

Türkiye's Central Bank actively tracks residential property prices through its [Residential Property Price Index](https://tcmb.gov.tr/wps/wcm/connect/en/tcmb+en/main+menu/statistics/real+sector+statistics/residential+property+price+index), providing investors with an official source for monitoring housing-market movements.

However, investors should avoid treating national price statistics as a substitute for property-level research.

Two apartments in the same city can have significantly different investment potential depending on factors such as transportation access, building age, earthquake compliance, nearby development, rental demand, maintenance costs and the reputation of the developer.

For this reason, successful Turkey real estate investment requires more detailed analysis than simply selecting a popular city.

## 4. Turkish Citizenship by Investment Remains an Important Consideration

Another factor distinguishing Türkiye from many property markets is its Citizenship by Investment framework.

According to Türkiye's official investment portal, eligible foreign nationals may apply for [Turkish citizenship](/citizenship-by-investment/turkiye) through the purchase of qualifying real estate worth at least **USD 400,000**.

The property must meet the applicable legal requirements, and the title deed must include a restriction preventing its sale for at least three years. Eligibility remains subject to the relevant authorities and the complete citizenship application process ([Invest in Türkiye](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx)).

For some international investors, this creates a connection between property acquisition and wider mobility, residency and family-planning objectives.

However, investors should not select a property purely because it is marketed as "citizenship eligible."

Professional valuation, title-deed verification, legal review and confirmation that the transaction complies with the current citizenship regulations should take place before proceeding.

## 5. Foreigners Can Purchase Property in Türkiye

Türkiye has an established framework for foreign property ownership.

Official investment guidance states that eligible foreign nationals can acquire real estate in Türkiye through registration with the relevant land registry authorities. A residence permit is not generally required simply as a prerequisite for purchasing property ([Invest in Türkiye](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx)).

This makes the purchasing process accessible to international buyers, but accessibility should not be confused with simplicity.

Before purchasing, investors should verify important issues including:

- Legal ownership of the property
- Existing mortgages, liens or restrictions
- Independent property valuation
- Construction and occupancy documentation
- Developer history
- Applicable taxes and transaction costs
- Rental and property-management considerations
- Citizenship eligibility, where relevant

The official Invest in Türkiye guidance specifically advises buyers to check mortgages, liens and other restrictions associated with a property before completing the transaction.

## 6. International Demand Is Becoming More Selective

The 2026 statistics reveal an important trend.

Although foreign property sales increased year-on-year in July, foreign sales during January–July 2026 were **7.3% lower than during the same period of 2025** ([TÜİK](https://veriportali.tuik.gov.tr/tr/press/58339)).

That does not necessarily mean international investors have abandoned Türkiye. Instead, it reinforces the importance of approaching the market selectively.

Today's investor has access to considerably more information than a buyer several years ago. Properties, developers, locations and investment programmes can be compared before a buyer even arrives in Türkiye.

As the market matures, professional investors are likely to place greater emphasis on due diligence, realistic valuations, rental demand and exit strategy rather than purchasing solely because a project is being aggressively marketed.

## Is Turkish Real Estate a Good Investment in 2026?

There is no universal answer.

Türkiye can provide compelling opportunities for the right investor, but the outcome depends heavily on the property selected, purchase price, location, investment horizon and the investor's objectives.

A buyer seeking citizenship may have different requirements from someone focused on rental income. Likewise, an investor looking for long-term capital growth may choose a completely different property from a family purchasing a holiday residence.

The strongest approach is therefore to define the investment objective first and search for property second.

## Making an Informed Real Estate Investment in Türkiye

International interest in Turkish property continues in 2026 because Türkiye combines a large residential market, internationally connected cities, diverse property options and a citizenship-by-investment route for qualifying buyers.

But opportunity alone does not make an investment successful.

Research, market comparison, legal verification and professional due diligence remain essential.

For international buyers considering a Turkey real estate investment, working with professionals who understand both property acquisition and the requirements facing foreign investors can make the process considerably clearer.

**Multi Mulk** assists international investors in evaluating [real estate opportunities in Türkiye](/real-estate), from property selection and investment analysis to support throughout the acquisition process and guidance for eligible [Citizenship by Investment](/citizenship-by-investment/turkiye) cases.

Whether the objective is investment, relocation, portfolio diversification or Turkish citizenship, the first step should be choosing a property based on a clear strategy rather than simply following the market.

To explore real estate investment opportunities in Türkiye, [contact Multi Mulk](/contact-us) for a personalised consultation.

## Sources

- [TÜİK — Konut ve İş Yeri Satış İstatistikleri, Temmuz 2026](https://veriportali.tuik.gov.tr/tr/press/58339)
- [Central Bank of the Republic of Türkiye — Residential Property Price Index](https://tcmb.gov.tr/wps/wcm/connect/en/tcmb+en/main+menu/statistics/real+sector+statistics/residential+property+price+index)
- [Invest in Türkiye — Acquiring Property and Citizenship](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx)
`.trim(),
  },
  {
    slug: "turkish-citizenship-by-investment-advisors-wealth-planning",
    title:
      "Turkish Citizenship by Investment Advisors: Coordinating Legal, Tax and Wealth Planning",
    date: "2026-09-08T15:00:00.000Z",
    topics: ["citizenship", "turkiye", "real-estate"],
    excerpt:
      "For a high-net-worth family, Turkish citizenship by real estate investment is rarely only a property purchase. It is a title-deed transaction, an immigration file and a long-term tax and succession decision running at once — and the advisor's job is to keep those three from being handled separately.",
    image: "/images/cbi/cbi-advisory.jpg",
    hero: "/images/cbi/hero-passports.jpg",
    seoTitle:
      "Turkish Citizenship by Investment Advisors: A 2026 Investor's Guide",
    seoDescription:
      "How Turkish citizenship by investment advisors coordinate property selection, legal work, family applications and long-term tax and wealth planning in 2026.",
    body: `
Most investors begin the conversation with a property question. Which district, which developer, which unit, what price. It is the natural starting point, and for a straightforward purchase it is often the only question that matters.

[Turkish citizenship by real estate investment](/citizenship-by-investment/turkiye) is not a straightforward purchase. A single transaction has to satisfy a property valuation regime, a land registry, an immigration file, a family's long-term plans, and — usually — a tax position in at least one other country. Each of those is handled by a different specialist, and the cost of getting it wrong is rarely the property. It is the year lost to a rejected application, or the structure that turns out to be unhelpful once the passports arrive.

That is the work **Turkish citizenship by investment advisors** are actually appointed to do: not to sell a unit, but to keep the property decision, the legal file and the wealth-planning position pointing in the same direction.

:::key
Choose the advisor before the property. The property can be changed at almost any point before the title transfer. The consequences of a badly assembled application file, or a purchase made without a tax position, are much harder to unwind.
:::

## What Turkish Citizenship by Investment Advisors Actually Do

The label covers very different levels of service. At one end sit brokers who introduce a unit and hand the buyer a lawyer's phone number. At the other sits a coordinated practice that owns the whole sequence and answers for it.

A full [property investment and citizenship advisory](/knowledge/end-to-end-turkish-citizenship-advisory) engagement generally covers five workstreams.

| Workstream | What it decides |
| --- | --- |
| Property selection | Which asset, at what price, in which district — judged as an investment, not only as an eligible one |
| Valuation and compliance | Whether the property will support the threshold on an official appraisal, and whether its title is clean |
| Legal and title transfer | Contract, due diligence, land registry transfer and the three-year annotation |
| Citizenship and passport application | The residence permit, the application file, the family's documents and the interview |
| Tax and wealth planning | Where income arises, where the family is resident, how the asset is held and what happens to it next |

The first four are procedural. The fifth is the one most often left until after the passports are issued, and it is the one that is hardest to fix retrospectively.

## Turkish Citizenship by Real Estate Investment: The Requirements That Matter

Türkiye's official investment portal sets out the core conditions: eligible foreign nationals may apply for citizenship through the purchase of qualifying real estate worth at least **USD 400,000**, and the title deed must carry a restriction preventing the sale of the property for at least three years. Eligibility remains subject to the relevant authorities and to the complete application process ([Invest in Türkiye](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx)).

Four points inside those requirements deserve an investor's attention.

### The threshold is assessed on a valuation, not on the price you pay

The figure that counts is the one in the official appraisal report prepared by a licensed valuer, which will not always agree with the contract price. Buyers who budget to the threshold exactly are the ones who discover the gap late, and by then the deposit is usually placed.

### The three-year restriction is an exit constraint, not a formality

The annotation is registered on the title deed. For the family this means the asset is illiquid for a defined period, and that period begins at registration rather than at application. Any plan that depends on selling within three years is not compatible with this route.

### Payment routing is part of the file

Transfers are expected to move through the Turkish banking system with documentation that the application can rely on. Currency conversion and the paperwork evidencing it are an administrative step advisors handle as a matter of course — and a common source of delay when they are not.

### The workstreams run in parallel

The title transfer, the residence permit and the citizenship file can be progressed at the same time rather than in sequence. Whether they actually are is the clearest practical difference between a coordinated advisor and a collection of separate ones.

## Family Citizenship Investment: Who Is Included

For most of the families we work with, the application is the point of the exercise — the investor's own citizenship is one part of a wider plan.

Under the applicable rules, an approved application generally extends to the investor's spouse and their children under 18. Children who have already passed that age are treated separately and need a route of their own, which is why timing matters to families with children in their late teens: a decision deferred by two years can quietly remove a child from the file.

**Family citizenship investment** planning therefore starts with the family, not the property:

- Which family members should be on the original application, and which need an alternative route
- Whether documents from multiple jurisdictions — marriage, birth, name changes — will need legalisation and translation, and how long that realistically takes
- Where the children will be educated, and whether the property's location supports that
- Which family members intend to spend meaningful time in Türkiye, which affects the tax analysis below

## Tax and Wealth Planning: The Questions to Settle Before You Buy

This is where advisory earns its fee, and where generic guidance is least useful — the answers depend on the family's existing residence, nationality, income sources and reporting obligations.

A few principles hold generally.

**Citizenship and tax residency are different questions.** Acquiring Turkish citizenship does not by itself make someone a Turkish tax resident. Turkish tax residency is determined by its own tests — broadly, domicile in Türkiye or presence in the country beyond the period the legislation specifies in a calendar year. A family that acquires citizenship and continues to live elsewhere is generally taxed accordingly, but this must be confirmed against the family's own circumstances and the rules in force at the time.

**Your home jurisdiction does not stop asking questions.** A second citizenship does not end reporting obligations in the country where a family is resident, and information-exchange arrangements mean foreign assets are visible. Any plan built on the assumption of invisibility is not a plan.

**Ownership structure is a decision, not a default.** Holding a qualifying property personally, jointly, or [through a company](/knowledge/turkish-real-estate-purchase-inside-a-holding-company) has consequences for the application itself, for rental income, for eventual disposal and for succession. The structure that suits the citizenship application is not automatically the structure that suits the estate.

**Succession is the question nobody asks at the start.** The asset is illiquid for three years, held in a jurisdiction where the family may not be resident, and will eventually pass to the next generation. The rules that govern that transfer should be understood before the purchase, not after.

:::warning
Nothing here is tax or legal advice. Rates, thresholds, residency tests and treaty positions change, and they apply differently to every family. Take advice from qualified Turkish counsel and from an advisor in your country of residence before committing to a transaction.
:::

## What "Coordinated" Should Actually Mean

Coordination is the word every advisor uses. In practice it should be visible in specific ways:

- **One named point of contact** who is accountable for the whole file, not one per workstream
- **Independent legal representation** — counsel who acts for the buyer, not for the developer
- **Valuation obtained before commitment**, so the threshold question is answered before a deposit is at risk
- **A written timeline** covering the title transfer, the residence permit, the application and the interview, with the dependencies between them stated
- **A tax conversation before the purchase**, involving the family's existing advisors rather than replacing them
- **Documented answers**, so that what was promised at the outset can be checked at the end

## Questions to Ask Before Appointing an Advisor

The market includes excellent practitioners and some that should be avoided; our piece on the [red flags that mean an agent is cutting corners](/knowledge/five-red-flags-that-mean-your-turkey-cbi-agent-is-cutting-corners-and-how-to-spot-them) covers the warning signs in detail. A shorter version, for a first meeting:

1. Who will represent me legally, and are they independent of the seller?
2. Who prepares the valuation, and what happens if it comes in below the threshold?
3. Is the total cost — property, taxes, fees, valuation, legal, application — set out in writing?
4. Which family members will be on the application, and which will not?
5. What is the realistic timeline, and what are the most common causes of delay in your files?
6. What happens at the end of the three-year restriction, and what are my exit options?
7. Who advises on tax, and at what point in the process?
8. How many applications have you completed, and can I speak to a client who has finished the process?

An advisor who answers all eight without hesitation is telling you something. So is one who does not.

## Frequently Asked Questions

### What do Turkish citizenship by investment advisors do?

They coordinate the property purchase, the legal and title-deed work, the citizenship and passport application, the family's documentation, and the tax and wealth-planning analysis around the investment — so that decisions in one workstream do not create problems in another.

### What is the minimum property investment for Turkish citizenship?

Türkiye's official investment portal states a minimum of USD 400,000 in qualifying real estate, with a title-deed restriction preventing sale for at least three years. Eligibility is subject to the applicable regulations and the full application process ([Invest in Türkiye](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx)).

### Does Turkish citizenship make me a Turkish tax resident?

Not automatically. Tax residency is determined by separate tests, broadly based on domicile or presence in Türkiye during a calendar year. Confirm your own position with qualified advisors in both Türkiye and your country of residence.

### Can my family be included in the application?

An approved application generally extends to the spouse and to children under 18. Adult children need a separate route, which is why families with older teenagers should plan the timing carefully.

### Can I sell the property after three years?

The title-deed annotation prevents sale for at least three years from registration. After that period the restriction no longer applies, but the sale decision should be made on the market conditions and tax position at the time.

### Should I choose the property or the advisor first?

The advisor. Property selection is one output of the engagement; a property chosen before anyone has looked at valuation, structure, family eligibility and tax is a decision made with most of the information missing.

## Working With Multi Mulk

Multi Mulk advises international investors and families on [Turkish citizenship by real estate investment](/citizenship-by-investment/turkiye) as a single engagement: property selection and investment analysis, independent legal coordination, the [citizenship and passport application](/knowledge/turkish-citizenship-application-process-2026), family eligibility, and the tax and wealth-planning questions that sit behind all of it.

We work alongside the advisors a family already has rather than in place of them, and we put the cost, the timeline and the exit position in writing before anyone commits to a property.

To discuss a Turkish citizenship and wealth-planning strategy in confidence, [contact our advisory team](/contact-us).

## Sources

- [Invest in Türkiye — Acquiring Property and Citizenship](https://www.invest.gov.tr/en/investmentguide/pages/acquiring-property-and-citizenship.aspx)
`.trim(),
  },
];

async function main() {
  const author =
    (await prisma.user.findFirst({
      where: { active: true, role: "EDITOR" },
      orderBy: { createdAt: "asc" },
    })) ??
    (await prisma.user.findFirst({
      where: { active: true, role: "SUPERADMIN" },
      orderBy: { createdAt: "asc" },
    }));

  if (!author)
    throw new Error("No active editor or superadmin to own the articles.");

  for (const article of articles) {
    const body = toBlocks(article.body);
    const data = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      body,
      topics: article.topics,
      category: "Blog",
      source: null,
      image: article.image,
      hero: article.hero,
      readMore: null,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      canonicalUrl: null,
      noindex: false,
      status: "PUBLISHED",
      publishedAt: new Date(article.date),
    };

    const row = await prisma.article.upsert({
      where: { slug: article.slug },
      update: data,
      create: { ...data, authorId: author.id },
    });

    console.log(
      `${row.status.padEnd(9)} ${row.slug}  (${body.length} blocks, ${row.id})`,
    );
  }

  console.log(
    `\nOwned by ${author.name} (${author.username}).` +
      "\nPublished — live on /en/knowledge once the article cache refreshes.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
