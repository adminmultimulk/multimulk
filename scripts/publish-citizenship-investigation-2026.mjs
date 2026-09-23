/**
 * Publishes the Knowledge Centre piece on Türkiye's investigation into
 * fraudulent citizenship-by-investment property transactions (August and
 * September 2026), and what it means for legitimate investors.
 *
 * Written as a script for the same reason as the other `publish-*` scripts:
 * the copy arrived as a finished article, not a draft to type into
 * /admin/articles. Re-running upserts the same slug rather than creating a
 * duplicate, so a corrected paragraph is a re-run, not a new row.
 *
 *   node --env-file=.env.local scripts/publish-citizenship-investigation-2026.mjs
 *
 * Always publishes. This is a live piece, not a review queue.
 *
 * The slug, the title tag and the meta description are the ones the brief
 * supplied under "SEO Deliverables". The title tag is given without the
 * company name because the layout's title template appends it.
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

const article = {
  slug: "turkish-citizenship-investment-investigation",
  title:
    "Türkiye Expands Investigation Into Fraudulent Citizenship Applications: What Property Investors Should Know",
  date: "2026-09-23T06:00:00.000Z",
  topics: ["citizenship", "turkiye", "news"],
  excerpt:
    "Turkish authorities have expanded an investigation into alleged irregularities involving Turkish Citizenship by Investment applications linked to real estate transactions, bringing renewed attention to property valuation, payment documentation and transaction compliance.",
  // The brief asks for a Turkish passport and Istanbul property; the site holds
  // both, so the card carries the passport and the banner the city.
  image: "/images/cbi/cbi-passport-turkiye.jpg",
  hero: "/images/cbi/hero-istanbul-dusk.jpg",
  seoTitle: "Turkish Citizenship Investment Probe: What to Know",
  seoDescription:
    "Türkiye expands scrutiny of citizenship-linked property transactions. Learn what the investigation means for foreign investors and CBI applicants.",
  body: `
Turkish authorities have expanded an investigation into alleged irregularities involving Turkish Citizenship by Investment applications linked to real estate transactions, bringing renewed attention to property valuation, payment documentation and transaction compliance.

On 21 September 2026, Türkiye Today and Daily Sabah reported a second phase of an Istanbul-based investigation into property transactions allegedly used to obtain Turkish citizenship through transactions that authorities described as *muvazaalı*, broadly meaning simulated or sham transactions. The operation was coordinated by the Istanbul Chief Public Prosecutor’s Office and conducted by the Istanbul Provincial Police Department.

The investigation is significant for international investors, but it requires careful interpretation. An investigation, detention or administrative review does not by itself amount to a final criminal judgment. Companies, intermediaries and individuals connected with transactions under examination should not be regarded as guilty merely because those transactions are being investigated.

For legitimate foreign investors looking to buy property in Turkey or pursue [Turkish citizenship through property investment](/citizenship-by-investment/turkiye), the developments instead highlight a broader lesson: citizenship-linked property transactions need to withstand legal, financial, valuation and title-deed scrutiny, not simply satisfy a headline purchase price.

## What Happened?

The September 21 operation represents the second publicly reported phase of a wider investigation.

According to Daily Sabah, authorities examined property sales involving **734 foreign nationals** as part of the latest phase of the investigation. Investigators reportedly classified **274 sales** as sham transactions. Authorities stated that citizenship had been obtained by **1,070 people**, including family members, through the transactions being investigated, while another 11 people were reported to be at different stages of the citizenship process.

The investigation remains ongoing, and the reported findings and allegations should not be interpreted as final determinations of criminal liability against individuals or businesses connected with the transactions.

Authorities also reported that transactions exceeding **TL3.5 billion** were under examination. Initial announcements said judicial proceedings had been initiated against 88 suspects and 72 had been detained. Anadolu Agency subsequently reported that 73 suspects had been detained in operations conducted across 13 provinces. The difference appears to reflect reporting at different stages of the operation rather than a fundamentally different account of the case.

Authorities imposed precautionary measures concerning 2,011 properties, one hotel, 86 vehicles, two yachts and 42 bank accounts, while 30 companies were reportedly placed under trustee management. These are investigative or precautionary measures and should not be confused with final confiscation following a criminal conviction.

## The First Phase Began in August 2026

The first publicly announced phase took place on 4 August 2026.

According to the Turkish Ministry of Justice, investigators examined a series of transactions and alleged that lower-value properties had been presented at substantially higher values through false appraisal documentation before being used in citizenship-linked transactions.

The Ministry said authorities identified **687 people** who had obtained citizenship through the transactions under investigation and initiated procedures concerning their citizenship status. At the initial stage, detention orders were issued for 90 suspects and 72 were apprehended. Authorities also reported approximately **TL2.5 billion** in investment funds that should have entered Türkiye had allegedly not entered the country as represented in the documentation.

Again, these are findings and allegations reported in an ongoing investigation; they are not equivalent to final convictions against every person or business connected with the transactions.

## How Did the Alleged Citizenship Scheme Work?

The two investigation phases appear to involve more than one alleged mechanism.

In the August operation, authorities specifically alleged that relatively low-value properties were represented at artificially higher values through false appraisal documentation, creating the appearance that the investment met the amount required for citizenship.

In the September investigation, authorities focused on what they described as sham property sales. Anadolu Agency reported that investigators examined Land Registry records, expert reports and financial-analysis material and found cases in which the required foreign-currency inflow allegedly had not occurred as represented. According to that reporting, financial movements and sales structures were allegedly arranged to create the appearance of qualifying investment transactions.

These allegations matter because the property route to Turkish Citizenship by Investment is not determined simply by a sales contract saying that a property is worth a particular amount.

Under the current Land Registry and Cadastre framework, several elements of the transaction must correspond, including the qualifying value, official transaction documentation, payment records and the *Taşınmaz Yatırım Tespit Belgesi*, or property investment determination document.

## What Are the Current Turkish Citizenship Property Requirements?

The General Directorate of Land Registry and Cadastre's December 2024 implementation guide states that the property route currently requires eligible real estate meeting a minimum investment amount of **US$400,000**, together with the applicable **three-year restriction** on sale or transfer. The guide also sets requirements concerning the types of property that can qualify.

Importantly, the official guide expressly explains that its procedures are intended, among other things, to prevent sham transactions and ensure the required foreign-currency inflow into Türkiye. It also makes clear that obtaining the property investment determination document does not, by itself, guarantee citizenship: the final acquisition of citizenship remains subject to the competent authority's evaluation and decision.

For determining the qualifying investment amount, official rules require relevant transaction values and payments to meet the applicable minimum. The foreign currency connected with the property price must be processed in accordance with the banking and foreign-exchange documentation rules, and official bank receipts are part of the evidentiary trail.

:::key The critical distinction
A property being marketed for US$400,000 or more does not automatically make it a compliant Turkish citizenship property investment.
:::

## Why Are Turkish Authorities Increasing Scrutiny?

The recent investigations are consistent with a compliance framework that increasingly allows authorities to examine multiple parts of a citizenship-linked property transaction together.

Depending on the case, this may include the property's qualifying value and valuation documentation; the title-deed history and restrictions affecting the property; the declared sales price; banking records and payment receipts; foreign-exchange documentation; relationships between buyer, seller and intermediary; previous transfers of the property; and the documents used to obtain the property investment determination certificate and citizenship.

The current TKGM guide, for example, requires banking documentation demonstrating payment of the qualifying amount and provides for examination of whether there is a reasonable connection between the parties sending and receiving the funds.

It also contains restrictions relating to certain previous ownership structures and transactions and explains how mortgages, liens and other title restrictions may affect citizenship eligibility. Some encumbered properties can be transacted, but particular restrictions capable of causing a change in ownership may prevent the property from being used for citizenship purposes.

For investors, this reinforces an important point: citizenship compliance and real-estate due diligence overlap, but they are not the same exercise.

A transaction can be legally registrable as a property purchase while still failing to satisfy the specific requirements applicable to Turkish citizenship.

## Are Previously Approved Citizenship Applications at Risk?

Approval should not be understood as making every aspect of an application permanently immune from subsequent examination.

Türkiye's official property-citizenship implementation guide expressly refers to Article 31 of Law No. 5901, under which a decision granting Turkish citizenship can be cancelled if it is later determined that the decision resulted from a false statement or concealment of material facts relevant to acquiring citizenship.

This helps explain why the current investigations include administrative procedures concerning people who had already obtained citizenship.

However, the September figures need to be interpreted carefully.

The 1,070 people identified in the second investigation had not necessarily all had their citizenship cancelled at the time the news was published. Authorities stated that administrative procedures had been initiated.

Separately, the Interior Ministry reported on September 21 that, in broader reviews, citizenship acquisition decisions involving 6,134 investors and family members had been cancelled or withdrawn. That total includes different categories and circumstances and should not be presented as 6,134 cases arising from the September property investigation alone.

Each case can depend on its underlying documentation, the applicant's circumstances and the applicable administrative and legal grounds. Anyone whose existing citizenship file may be affected should therefore obtain advice from an appropriately qualified independent Turkish lawyer rather than relying solely on a property seller or sales intermediary.

## What Does This Mean for Legitimate Property Investors?

The investigation should not automatically be interpreted as evidence that Türkiye's Citizenship by Investment framework itself is fraudulent.

It demonstrates something more specific: authorities are examining whether particular transactions genuinely met the requirements of the program.

For legitimate foreign investors, that makes transaction quality more important.

An investor considering Turkey real estate investment for citizenship purposes should be particularly cautious when encountering unusually inflated prices, citizenship-driven valuation claims, unclear payment arrangements, incomplete title-deed analysis, guaranteed-passport marketing, or transactions structured principally to reach the threshold.

Investors should assess whether the property's market fundamentals, location, rental demand, exit liquidity, construction quality and developer record, make commercial sense independently of citizenship.

The strongest investment is generally one that can be justified both as a real property investment and as a properly documented citizenship transaction.

## Due Diligence Before Buying Property for Turkish Citizenship

1. **Verify the developer or seller.** Review corporate identity, ownership, completed projects, delivery record and the legal authority to sell the specific property.
2. **Examine the title deed independently.** Confirm the legal owner, property type and cadastral information rather than relying solely on marketing material.
3. **Check encumbrances and restrictions.** Determine whether mortgages, liens, court annotations, promises of sale or other restrictions exist and how they affect both the investment and citizenship eligibility.
4. **Verify the citizenship valuation process.** Do not assume the sales price, brochure price or seller price automatically represents the qualifying value recognized for citizenship purposes.
5. **Document every payment.** Maintain a complete banking trail consistent with the official sales documentation, foreign-exchange documentation and citizenship rules.
6. **Confirm eligibility under the regulations applicable at the transaction date.** Citizenship and land-registry requirements have changed over time, so older explanations or sales presentations may no longer be accurate.
7. **Use independent legal review.** Ideally, the lawyer reviewing the buyer's legal interests should be independent of the seller and able to examine both the title and citizenship structure.
8. **Retain the entire transaction file.** Keep contracts, title documents, bank transfers, foreign-exchange certificates, official valuation or determination documents, invoices, receipts, powers of attorney and government correspondence.

These precautions reduce risk, but they do not guarantee citizenship approval or an investment return. The checks we run on every property are set out on our [investor protection](/investor-protection) page.

## Why Choosing the Right Advisory Team Matters

For international investors, a compliant citizenship transaction increasingly requires coordination across several disciplines.

Property selection should be assessed from an investment perspective: price, location, developer quality, rental demand, resale prospects and overall suitability.

Citizenship eligibility should then be assessed separately from the regulatory perspective: qualifying property, investment amount, title structure, transaction history, payment documentation and the applicant's individual circumstances.

Legal review, meanwhile, should remain an independent function capable of identifying problems even when doing so may delay or prevent a sale.

This separation of responsibilities is important. An attractive property is not automatically citizenship-eligible, and a property that technically meets citizenship requirements is not necessarily a good investment.

A professional advisory process should therefore help an investor understand both questions before capital is committed.

## Final Thoughts

The investigations announced in August and September 2026 reinforce a fundamental principle for international investors: Turkish Citizenship by Investment should be treated as a regulated legal and investment process, not simply as the purchase of a property marketed with a passport opportunity.

Türkiye continues to provide a legal property-based route to exceptional citizenship, subject to the applicable investment, documentation and governmental requirements. Current official guidance maintains the US$400,000 property threshold and the three-year holding requirement, while making clear that the ultimate citizenship decision remains with the competent authorities.

For legitimate investors, increased scrutiny makes transparency more, not less, important.

Before investing, verify the property, verify the price, verify the title, verify the payment trail and independently verify whether the transaction actually complies with the citizenship rules.

:::note Considering property investment or Turkish Citizenship by Investment?
Multi Mulk helps international investors evaluate property opportunities, understand investment and citizenship requirements, and coordinate the property, documentation and compliance process with greater transparency and clarity. [Contact Multi Mulk](/contact) to discuss your investment objectives and eligibility before making a property decision.
:::

*This article is provided for general informational purposes and does not constitute legal, tax or investment advice. Citizenship eligibility and property circumstances should be assessed individually.*

## Sources

- Türkiye Today — [Türkiye detects 1,070 more foreigners obtaining citizenship fraudulently](https://www.turkiyetoday.com/nation/turkiye-detects-1070-more-foreigners-obtaining-citizenship-fraudulently-3228590), 21 September 2026.
- Daily Sabah / Anadolu Agency — [Türkiye launches 2nd operation into fake citizenship scheme](https://www.dailysabah.com/turkiye/investigations/turkiye-launches-2nd-operation-into-fake-citizenship-scheme), 21 September 2026.
- Anadolu Agency — [İstanbul merkezli “usulsüz vatandaşlık” operasyonunda 73 zanlı yakalandı](https://www.aa.com.tr/tr/gundem/istanbul-merkezli-usulsuz-vatandaslik-operasyonunda-73-zanli-yakalandi/4062988), 21 September 2026.
- Republic of Türkiye Ministry of Justice — [Official statement concerning the first phase and 687 citizenship files](https://basin.adalet.gov.tr/bakan-gurlek-687-kisinin-vatandasliginin-iptali-icin-yasal-surec-baslatildi), 4 August 2026.
- General Directorate of Land Registry and Cadastre (TKGM) — [Guide on the Regulation for the Implementation of the Turkish Citizenship Law](https://www.tkgm.gov.tr/sites/default/files/2024-12/Kilavuz-2.pdf), 9 December 2024.
- TRT Haber / Ministry of Interior reporting — [Statement on irregular citizenship operation and broader citizenship reviews](https://www.trthaber.com/haber/gundem/icisleri-bakanligindan-istanbuldaki-usulsuz-vatandaslik-operasyonuna-iliskin-aciklama-957543.html), 21 September 2026.
`,
};

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
    throw new Error("No active editor or superadmin to own the article.");

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
