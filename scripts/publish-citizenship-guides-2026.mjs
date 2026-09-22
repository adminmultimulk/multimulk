/**
 * Publishes eleven Knowledge Centre guides on Turkish citizenship by
 * investment: choosing an advisor, filing, costs, the UAE comparison, and
 * what to do after a rejection.
 *
 * Written as a script for the same reason as `publish-investor-briefs-2026`:
 * the copy arrived as finished articles, not as drafts to type into
 * /admin/articles. Re-running upserts the same eleven slugs rather than
 * creating duplicates, so a corrected paragraph is a re-run, not a new row.
 *
 *   node --env-file=.env.local scripts/publish-citizenship-guides-2026.mjs
 *
 * Always publishes. These are live pieces, not a review queue.
 *
 * The figures — the USD 400,000 threshold, the three-year hold, the 3–6 month
 * estimate, 110+ visa-free destinations — are the ones `app/lib/figures.ts`
 * already states on the programme page, so the guides and the page agree.
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

/** Photography the site already holds; the pieces have no art of their own. */
const img = {
  advisory: "/images/cbi/cbi-advisory.jpg",
  documents: "/images/cbi/cbi-documents.jpg",
  passport: "/images/cbi/cbi-passport-turkiye.jpg",
  passportCollage: "/images/cbi/cbi-passport-turkiye-collage.webp",
  passports: "/images/cbi/hero-passports.jpg",
  istanbul: "/images/cbi/hero-istanbul.jpg",
  istanbulDusk: "/images/cbi/hero-istanbul-dusk.jpg",
  strait: "/images/cbi/cbi-istanbul-strait.jpg",
  dubai: "/images/cbi/hero-dubai-night.jpg",
  cranes: "/images/cbi/protection-cranes-dusk.jpg",
};

const DAY = "2026-09-22";

const articles = [
  // ---------------------------------------------------------------------------
  {
    slug: "turkish-citizenship-advisor-checklist-2026",
    title: "Turkish Citizenship Advisor Checklist for 2026",
    date: `${DAY}T06:00:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "A practical checklist for comparing Turkish citizenship by investment advisors on the five things that decide the outcome: legal support, property due diligence, family planning, tax coordination and end-to-end execution.",
    image: img.advisory,
    hero: img.istanbulDusk,
    seoTitle: "Turkish Citizenship Advisor Checklist 2026 | Multi Mulk",
    seoDescription:
      "Compare Turkish citizenship by investment advisors on legal support, property due diligence, family planning, tax coordination and execution. A 2026 checklist for investors.",
    body: `
Turkish citizenship by investment is, on paper, one of the simplest programmes of its kind: buy qualifying real estate worth at least **USD 400,000**, hold it for **three years**, and apply. In practice, the outcome depends less on the rule than on the people executing it. The property has to be the right property, the paperwork has to be right the first time, the family has to be structured correctly, and someone has to be accountable from the first conversation to the passport in hand.

That is what a good advisor is for. This checklist sets out the questions to put to any Turkish citizenship by investment advisor before you engage them, grouped under the five areas that decide whether an application moves smoothly or stalls.

:::key Before you start
An advisor is not a substitute for a licensed Turkish lawyer, and a lawyer is not a substitute for a property due diligence process. The best advisory relationships bring both together under one point of accountability. If a firm cannot explain who does what, that is your first finding.
:::

## 1. Legal support: who is actually accountable?

Every citizenship file passes through several government bodies — the Land Registry, the Ministry of Environment, Urbanisation and Climate Change for the certificate of conformity, the Provincial Directorate of Migration Management for the residence permit, and finally the Directorate of Population and Citizenship Affairs. Somebody has to be responsible for what is filed at each step.

Ask the advisor:

- Is a licensed Turkish lawyer involved, and will they act under a power of attorney in my name?
- Who reviews the sale contract and the title deed annotation before I sign anything?
- Who drafts and lodges the residence permit and citizenship applications?
- If a document is returned as deficient, who fixes it, and at whose cost?
- Can I see a written scope of work that names the responsible person for each stage?

A firm that answers with "we handle everything" but cannot name the lawyer or show a scope is describing a sales process, not a legal one. Our guide to the [end-to-end Turkish citizenship advisory](/knowledge/end-to-end-turkish-citizenship-advisory) sets out what a complete scope looks like.

## 2. Property due diligence: is the asset genuinely eligible?

The single most common reason a Turkish citizenship application is delayed is the property itself. The regulation is precise about what qualifies, and a property that fails on any one point fails on all of them.

Your advisor should be able to show, in writing, that:

- The property's **appraised value** from a licensed valuation firm meets or exceeds USD 400,000 at the official exchange rate on the day.
- The **declared sale price on the title deed** also meets the threshold — both figures matter, not just one.
- The seller is a Turkish citizen or a Turkish company, and the property has **not previously been used** for another foreigner's citizenship application.
- Payment will move by **bank transfer**, with receipts on both sides, so the money trail is clean.
- The **three-year no-sale annotation** will be entered on the title at the Land Registry at the time of transfer.
- The developer, if buying off-plan, has a track record of delivering and registering title on time.

The questions to ask are the ones on our [investor protection](/investor-protection) page: who is the developer, what have they delivered, what does the title say, and what happens if the building is late. An advisor who steers you toward one project without answering them is selling inventory, not advising you. Our [property investment and citizenship guide](/knowledge/turkish-citizenship-by-property-investment-2026) covers the eligibility rules in full.

:::warning Split purchases
The USD 400,000 requirement can be met across more than one property, but every unit must be purchased under the same rules and included in the same certificate of conformity. Ask how the advisor handles a split purchase before you assume it works. We explain the mechanics in [Can you split the USD 400,000 across two properties?](/knowledge/turkey-citizenship-by-investment-400000-can-you-split-the-requirement-across-two-properties)
:::

## 3. Family citizenship investment: who is on the application?

Turkish citizenship by investment covers the main applicant, their spouse and children under 18 in a single file. That is generous, but it has to be planned.

Questions to ask:

- Which family members can be included, and which cannot — adult children and parents are **not** covered by the investor's application.
- What documents does each family member need, and which need apostille and sworn translation?
- How are children close to their eighteenth birthday handled, given processing time?
- If a second marriage or a child born abroad is involved, what additional civil documents will the Directorate ask for?
- Does the firm coordinate separate applications for adult children who want their own route?

A firm that has done this many times will have a family document matrix ready. If they have to think about it, they have not. See our guide to [Turkish citizenship for families](/knowledge/turkey-citizenship-for-families-benefits-facts-timeline).

## 4. Tax and wealth planning: is anyone looking past the passport?

Citizenship is not tax residency, and buying a property does not by itself make you a Turkish tax resident. But an investor who spends time in Türkiye, earns rental income, or later sells the property will have Turkish tax questions — and may have questions at home about reporting a second nationality or a foreign asset.

A serious advisor will:

- Distinguish clearly between **citizenship** and **tax residency** and explain what triggers each.
- Explain how rental income on the qualifying property is taxed and declared.
- Explain the capital gains position on a sale after the three-year hold.
- Coordinate with your existing tax adviser at home rather than pretend the question does not exist.
- Never promise tax outcomes they are not qualified to promise.

You do not need your citizenship advisor to be your tax adviser. You do need them to know where their competence ends and to have someone to hand you to. Our piece on [dual tax residency by design](/knowledge/dual-tax-resident-by-design-how-hnwis-use-turkish-citizenship-to-legally-reduce-their-tax-burden) explains the questions worth raising early.

## 5. End-to-end execution: what does the timeline actually look like?

The programme is often advertised as "citizenship in three to six months". That estimate is achievable, but only when the property, the payment and the documents are all right before the file is lodged. Ask the advisor to walk you through their timeline step by step:

1. Eligibility review and family structure — before any property is viewed.
2. Property selection and independent valuation.
3. Sale contract, bank transfer, title transfer and annotation.
4. Certificate of conformity from the Ministry.
5. Residence permit application for the main applicant.
6. Citizenship application and biometric appointment.
7. Approval, identity card and passport issuance.

Then ask what has gone wrong on previous files and how it was handled. A firm that says nothing has ever gone wrong is not being candid. Delays happen; the question is who owns them.

## The checklist, in one place

| Area | The question to ask | A good answer looks like |
| --- | --- | --- |
| Legal support | Who is the lawyer, and what is their scope? | A named, licensed lawyer under power of attorney, with a written scope |
| Property due diligence | Is this property eligible on every point? | A valuation report, title check, seller check and payment plan, in writing |
| Family planning | Who is on the file, and what do they need? | A document matrix per family member, with apostille and translation handled |
| Tax coordination | What happens after the passport? | A clear line between citizenship and tax residency, and a referral where needed |
| Execution | What is the timeline, and who owns delays? | A step-by-step plan with named owners and honest precedents |

## How Multi Mulk approaches this

Multi Mulk is a real estate and citizenship advisory. We are not a law firm, and we do not present ourselves as one. Every citizenship file we run is coordinated with licensed Turkish counsel, and every property we put in front of a client has been through the same eligibility review we would apply to our own capital. If you would like a written eligibility assessment before you commit to anything, you can [start with a consultation](/contact-us).

## Frequently asked questions

### Do I need both an advisor and a lawyer for Turkish citizenship by investment?

In practice, yes. A lawyer handles the legal filings under power of attorney; an advisor coordinates the property, the valuation, the bank process, the family documents and the timeline. Some firms provide both under one roof; the important thing is that both roles are clearly filled.

### How do I verify that a property qualifies for Turkish citizenship?

Ask for the licensed valuation report, confirm the seller is a Turkish national or company, confirm the property has not been used for a previous citizenship application, and confirm that the three-year annotation will be recorded at transfer. Your advisor should provide all of this before you pay a deposit.

### Can my family be included in a Turkish citizenship by investment application?

Your spouse and children under 18 are included in the same application. Adult children and parents are not, and would need a separate route.

### Does Turkish citizenship make me a Turkish tax resident?

No. Tax residency depends on where you live and how long you spend in Türkiye, not on your passport. Rental income from the qualifying property is taxable in Türkiye regardless.

### How long does Turkish citizenship by investment take in 2026?

Three to six months is a realistic estimate once the property has been transferred and the certificate of conformity issued. Files with document deficiencies or property issues take longer.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "turkey-citizenship-vs-uae-golden-visa-2026",
    title: "Turkey Citizenship vs UAE Golden Visa in 2026",
    date: `${DAY}T06:10:00.000Z`,
    topics: ["citizenship", "residency", "real-estate"],
    excerpt:
      "A decision guide for real estate investors comparing Turkish citizenship by investment with the UAE Golden Visa: what each grants, what each requires, the process, the costs, the timelines, and the long-term planning questions behind the choice.",
    image: img.dubai,
    hero: img.passports,
    seoTitle: "Turkey Citizenship vs UAE Golden Visa 2026: Investor Comparison",
    seoDescription:
      "Turkish citizenship by investment or the UAE Golden Visa? Compare legal requirements, process, costs, timelines and long-term planning for real estate investors in 2026.",
    body: `
Investors who look at Türkiye and the UAE are usually asking the same underlying question: which of these two gives me the most durable position for my family and my capital? The answer depends on what you actually need, because the two programmes grant fundamentally different things.

**Turkish citizenship by investment** grants a nationality: a passport, the right to live and work in Türkiye indefinitely, and citizenship that passes to your children. **The UAE Golden Visa** grants long-term residency: a ten-year renewable permit to live in the UAE, sponsor your family, and stay away from the country without losing status. One is a passport; the other is a residence card.

This guide compares them the way a careful investor would — on legal requirements, process, costs, timelines and what each means in ten years' time.

## What each programme grants

| | Turkish citizenship by investment | UAE Golden Visa |
| --- | --- | --- |
| Status granted | Full citizenship and passport | 10-year renewable residence permit |
| Passes to children | Yes, by descent | No — dependants hold their own permits |
| Right to work | Anywhere in Türkiye, as a citizen | In the UAE, as a resident |
| Visa-free travel | 110+ destinations on a Turkish passport | Depends on your existing passport |
| Dual citizenship | Permitted by Türkiye | Not applicable — residency only |
| Physical presence | None required | No minimum stay; permit is not cancelled by long absence |

The rest of the comparison sits underneath that first row. A residence permit, however long, is not a nationality, and the UAE does not offer a citizenship pathway to Golden Visa holders. If a second passport is the objective, only one of these delivers it. If a tax-efficient base in the Gulf is the objective, the other may serve better.

## Legal requirements for foreign investors

### Türkiye

- Real estate purchase of at least **USD 400,000** in appraised and declared value.
- Property bought from a Turkish national or Turkish company, not previously used for another foreigner's application.
- Payment by bank transfer, with the required currency conversion documented.
- A **three-year no-sale annotation** recorded on the title deed.
- Certificate of conformity from the Ministry of Environment, Urbanisation and Climate Change.
- A short-term residence permit, then the citizenship application itself.
- Clean criminal record; no security or public-order concern.

Other routes exist — a USD 500,000 bank deposit, government bonds, or fixed capital investment, each held for three years — but real estate is the route most investors use and the one Multi Mulk advises on. See [real estate vs bank deposit for Turkey citizenship](/knowledge/real-estate-vs-bank-deposit-for-turkey-citizenship).

### UAE

- Real estate worth at least **AED 2 million**, in one or more properties, in the investor's name.
- Off-plan and mortgaged property can qualify subject to the conditions of the relevant emirate's land department and the ICP.
- Valid passport, UAE medical fitness test, and Emirates ID enrolment.
- No minimum investment holding period is written into the visa rule, but the visa is tied to the ownership that qualified it.

The UAE requirement is set in dirhams and does not move with the dollar. The Turkish requirement is set in dollars, so the lira price of a qualifying property moves with the exchange rate — a point we cover in [Lira vs dollar: does currency risk affect your citizenship investment?](/knowledge/lira-vs-dollar-in-2026-does-currency-risk-affect-your-turkish-citizenship-investment)

## Process steps compared

### Türkiye, step by step

1. Eligibility review and family structure.
2. Property selection, licensed valuation, and title check.
3. Sale contract, bank transfer, title transfer with annotation.
4. Certificate of conformity.
5. Residence permit for the main applicant.
6. Citizenship application, biometrics, and security review.
7. Approval by decision of the Presidency; identity card and passport.

### UAE, step by step

1. Property purchase and title deed registration with the land department.
2. Confirmation from the land department that the property qualifies.
3. Application through the ICP or the emirate's residency authority.
4. Medical test and Emirates ID biometrics.
5. Visa issuance; family sponsorship applications follow.

The UAE process is shorter and more administrative. The Turkish process is longer because it ends in a nationality decision, which carries a security review that a residence permit does not.

## Costs beyond the investment

Both programmes have costs that sit outside the headline figure.

**Türkiye**: title deed transfer tax (a percentage of the declared value, usually split between buyer and seller by agreement), valuation fee, notary and sworn translation fees, residence permit fees, lawyer's fees, and, if applicable, VAT on a new-build purchase from a developer. Our guide to the [hidden costs of Turkish citizenship by investment](/knowledge/hidden-costs-of-turkish-citizenship-by-investment-in-2026) puts numbers to each.

**UAE**: land department transfer fee (4% of the purchase price in Dubai), registration and trustee fees, agent commission, medical and Emirates ID fees, visa issuance fees, and annual service charges on the property, which in prime Dubai buildings can be significant.

Neither is a small number. The difference is that in Türkiye the transaction costs are front-loaded, and in the UAE the ongoing costs — service charges in particular — deserve as much attention as the entry cost.

## Timelines

- **Türkiye**: three to six months from title transfer to citizenship approval is a realistic estimate for a clean file; the property purchase itself sits before that.
- **UAE**: the Golden Visa can typically be issued within weeks of the property being registered, provided the medical and biometric steps are completed promptly.

If speed to status is decisive, the UAE is faster. If the status itself is decisive, speed is not the right measure.

## Long-term planning considerations

### Tax

The UAE levies no personal income tax, which is a large part of its appeal to those who intend to live there. Türkiye taxes residents on worldwide income and non-residents on Turkish-source income, including rental income from the qualifying property. Citizenship does not by itself create Turkish tax residency; living there does.

### Mobility

A Turkish passport gives visa-free or visa-on-arrival access to more than 110 destinations, and, notably, eligibility for the **US E-2 treaty investor visa**, which many nationalities cannot access. It does not give visa-free Schengen entry. A UAE residence permit does not change the travel rights of the passport you already hold, though it makes some visa applications easier. See [the Turkish passport visa-free list for business travel](/knowledge/turkish-passport-visa-free-list-2026-the-countries-that-matter-most-for-business-travel).

### Permanence

A Turkish citizenship is permanent unless revoked for cause. A UAE Golden Visa is renewable but remains a permit, tied to the qualifying investment, and can be affected by a change in the rules or the disposal of the property.

### Exit

In Türkiye, the property can be sold after three years and citizenship is retained. In the UAE, selling the qualifying property means the basis of the visa is gone unless it is replaced.

## Can you hold both?

Yes. Many investors do: a Turkish passport for citizenship and mobility, a UAE Golden Visa for a tax-efficient base. We cover the combination in [UAE resident, Turkish citizen: can you hold both?](/knowledge/uae-resident-turkey-citizen-can-you-hold-both)

## Which should you choose?

Choose **Turkish citizenship by investment** if what you need is a second nationality: a passport for your children, treaty-visa eligibility, a permanent status that does not depend on where you live, and an asset in a large, liquid property market.

Choose the **UAE Golden Visa** if what you need is a long-term residential base in the Gulf, no personal income tax, and a fast administrative process — and if your existing passport already gives you the mobility you want.

Choose **both** if the budget allows and the two roles are genuinely distinct in your plan.

:::tip Compare programmes side by side
Our [programme comparison tool](/compare) puts the Turkish citizenship route and the UAE Golden Residence next to each other on every figure we publish, and the [cost calculator](/tools) estimates the all-in cost of each for your family size.
:::

## Frequently asked questions

### Does the UAE Golden Visa lead to citizenship?

No. The UAE Golden Visa is a ten-year renewable residence permit. It does not lead to UAE citizenship, and there is no investment route to a UAE passport.

### Which is faster, Turkish citizenship or the UAE Golden Visa?

The UAE Golden Visa is usually issued within weeks of the property being registered. Turkish citizenship typically takes three to six months after the property transfer, because it ends in a nationality decision with a security review.

### Can I include my parents in either programme?

The UAE Golden Visa allows holders to sponsor parents. Turkish citizenship by investment covers the spouse and children under 18 only; parents would need their own route.

### Do I have to live in Türkiye or the UAE to keep the status?

Neither programme imposes a minimum stay. Turkish citizenship is permanent regardless of residence. The UAE Golden Visa is not cancelled by long absence, unlike a standard UAE residence visa.

### Is the Turkish citizenship investment refundable?

The property can be sold after the three-year holding period, and the citizenship is retained. Whether you recover the capital depends on the market, which is why the property should be chosen as an investment and not only as a qualification.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "fast-track-turkish-citizenship-support-2026",
    title: "Fast-Track Turkish Citizenship Support in 2026",
    date: `${DAY}T06:20:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "How Multi Mulk supports investors through Turkish citizenship by investment: a fast, written eligibility decision, compliant process guidance at every step, and realistic timelines rather than promises.",
    image: img.passportCollage,
    hero: img.istanbul,
    seoTitle: "Fast-Track Turkish Citizenship Support 2026 | Multi Mulk",
    seoDescription:
      "Turkish citizenship by investment support from Multi Mulk: fast eligibility clarity, compliant process guidance, realistic processing times and a single point of accountability.",
    body: `
Turkish citizenship is one of the few nationalities in the world that an investor can obtain in months rather than years, without residing in the country, without a language test, and with a real asset at the centre of it rather than a donation. The programme has been open since 2017, the rules are clear, and the process is well understood.

What is not well understood — and what separates a six-month file from an eighteen-month one — is execution. This page explains how Multi Mulk supports investors through the Turkish citizenship application from first enquiry to passport, and what "fast-track" means when it is done properly.

:::note What "fast-track" means here
There is no official expedited lane for Turkish citizenship by investment. Every application goes through the same government review. "Fast-track" support means removing every avoidable delay on our side of the file: the wrong property, the missing apostille, the payment that cannot be traced, the residence permit lodged a week late. Those are where the months go.
:::

## Step one: eligibility clarity in days, not weeks

Before any property is discussed, we run a written eligibility review. It covers:

- **Citizenship requirements** as they apply to you: nationality, criminal record, previous visa or residence history in Türkiye, and any factor that could trigger a security or public-order concern.
- **Family structure**: who can be included (spouse and children under 18) and who cannot, and what each person will need to document.
- **Source of funds**: what the Turkish bank and the Ministry will expect to see, and whether your intended payment route will satisfy them.
- **Investment route**: whether real estate at USD 400,000 is the right instrument for you, or whether one of the other routes fits better.

The output is a short written assessment that tells you, plainly, whether we think you are eligible, what the risks are, and what the realistic timeline is. If we do not think the programme is right for you, we say so at this stage rather than after you have bought a property.

## Step two: a property that actually qualifies

The Turkish passport is granted on the basis of a compliant investment. Every eligibility condition attaches to the property, and a property that fails one condition fails the application. Our property process is built around that.

- A licensed valuation confirming the USD 400,000 threshold at the official rate.
- A title deed check: ownership, encumbrances, whether the property has been used for a previous citizenship application.
- A seller check: Turkish national or Turkish company, not a related party.
- A developer check for off-plan purchases: delivery history, title registration record, financial standing.
- A payment plan that moves the funds by bank transfer, with the currency conversion documented as the regulation requires.

We show you properties from our own [Türkiye portfolio](/real-estate) and from the wider market. The test is the same either way, and it is the same test we set out on our [investor protection](/investor-protection) page.

## Step three: the application process, run to a plan

Once the property has transferred and the three-year annotation is on the title, the application process runs in a fixed order. Our role is to make sure each step is filed complete, on time, and with the right supporting documents.

1. **Certificate of conformity** from the Ministry of Environment, Urbanisation and Climate Change, confirming the investment qualifies.
2. **Short-term residence permit** for the main applicant, lodged with the Provincial Directorate of Migration Management.
3. **Citizenship application** lodged with the Directorate of Population and Citizenship Affairs, with the full family file.
4. **Biometrics and identity checks** for each applicant.
5. **Security review** and decision.
6. **Approval**, identity card and passport issuance.

A licensed Turkish lawyer acts for you under power of attorney throughout, so you are not required to be in Türkiye for each step. Multi Mulk coordinates the lawyer, the valuation firm, the bank, the notary and the sworn translators, and reports to you at each stage.

## Step four: realistic processing time

We are asked about processing time in every first meeting, and we give the same answer every time: **three to six months from the certificate of conformity is a realistic estimate for a clean file**. It is not a guarantee, because the decision is the government's, and the security review takes the time it takes.

What we can control is whether your file is clean. The files that take a year or more are almost always the ones that were lodged with a problem in them — a valuation short of the threshold, a payment that went through the wrong channel, a marriage certificate without an apostille — and were returned. Our guide to [what actually happens on approval day](/knowledge/what-actually-happens-on-turkish-citizenship-approval-day-documents-timeline-and-what-to-expect) sets out the end of the process; our piece on [why applications get rejected](/knowledge/why-some-turkish-citizenship-applications-get-rejected-and-how-to-ensure-yours-isnt) sets out how to avoid the beginning of a bad one.

## What you get from Multi Mulk

| Stage | What we do | What you receive |
| --- | --- | --- |
| Eligibility | Written review of requirements, family and funds | A clear yes, no, or "yes, with conditions" |
| Property | Valuation, title, seller and developer checks | A property that qualifies on every point |
| Transaction | Bank, notary, Land Registry coordination | A compliant transfer with the annotation recorded |
| Application | Lawyer coordination, document preparation, filing | A complete file lodged on time at each step |
| Follow-up | Status tracking, deficiency responses | Regular reporting until the passport is issued |
| After | Rental management, resale planning after three years | An asset, not only a qualification |

## Why investors choose an advisory rather than an agency

Citizenship agencies typically sell a property and hand the file to a lawyer. The property is chosen because it is what the agency has to sell, and the client meets the legal process for the first time when something goes wrong. Multi Mulk is an advisory: the property is chosen because it qualifies and because it is a sound investment, and the legal process is planned before the property is bought. Our guide to [choosing a Turkish citizenship advisor](/knowledge/https-multimulk-com-blog-how-to-choose-a-turkish-citizenship-advisor-2026https-multimulk-com-blog-how-to-choose-a-turkish-citizenship-advisor-2026) explains the difference in more detail.

:::key Start with an eligibility review
If you would like a written eligibility assessment, [contact us](/contact-us) with your nationality, your family composition and your intended budget. We respond within two working days.
:::

## Frequently asked questions

### How fast can I get Turkish citizenship by investment?

A realistic estimate is three to six months from the certificate of conformity for a clean application. Add the time it takes to select and transfer the property before that. Anyone promising a fixed number of weeks is promising something the government has not.

### What are the citizenship requirements for the real estate route?

A property or properties with an appraised and declared value of at least USD 400,000, bought from a Turkish national or company by bank transfer, with a three-year no-sale annotation on the title; a clean criminal record; and no security or public-order concern.

### Do I need to live in Türkiye during the application?

No. There is no residency requirement. A short-term residence permit is obtained as part of the process, but you are not required to spend time in the country.

### Can my family get the Turkish passport too?

Your spouse and children under 18 are included in your application and receive citizenship with you.

### Is Multi Mulk a law firm?

No. Multi Mulk is a real estate and citizenship advisory. Every file is run with licensed Turkish counsel acting under power of attorney, and we coordinate the legal, property and banking sides under one point of accountability.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "turkish-citizenship-advisor-vs-lawyer-guide",
    title: "Turkish Citizenship Advisor vs Lawyer: The Full Guide",
    date: `${DAY}T06:30:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "When do you need a Turkish citizenship advisor, an immigration lawyer, or an investment consultant? A decision guide with selection criteria grounded in compliance, legal scope and end-to-end execution.",
    image: img.documents,
    hero: img.advisory,
    seoTitle: "Turkish Citizenship Advisor vs Lawyer: Who Do You Need? (2026)",
    seoDescription:
      "Advisor, immigration lawyer or investment consultant for Turkish citizenship by investment? A decision guide on legal scope, compliance and execution, with selection criteria.",
    body: `
Three kinds of professional offer Turkish citizenship consultation, and investors are frequently unsure which they need. The short answer is that a compliant citizenship by investment application needs the work of all three roles — legal, property and coordination — and the real question is who fills each one, and who is accountable for the whole.

This guide explains what a Turkish citizenship advisor, an immigration lawyer in Turkey and an investment consultant each do, where their scope ends, and how to choose between them — or combine them.

## The three roles, defined

### Immigration lawyer

A licensed Turkish lawyer (*avukat*), registered with a bar association, who can act for you under a power of attorney before the Land Registry, the Migration Directorate and the Directorate of Population and Citizenship Affairs. Only a lawyer can:

- Represent you before the authorities and sign filings on your behalf.
- Give legal advice on Turkish nationality law, and on your specific situation.
- Represent you in an administrative court if an application is refused.
- Review and draft the sale contract and the power of attorney itself.

A lawyer's scope is legal. It does not usually include finding the property, assessing whether it is a good investment, managing the developer, or coordinating your bank at home.

### Turkish citizenship advisor

An advisory firm that coordinates the entire process: eligibility review, property selection and due diligence, the banking and payment process, the family document set, the lawyer, the valuation firm, the notary and the translators, and the timeline. A good advisor:

- Runs the eligibility review before any property is chosen.
- Applies an investment test to the property as well as a compliance test.
- Coordinates every party and owns the timeline.
- Reports to you throughout, and manages the property after the passport.

An advisor is not a lawyer and cannot give legal advice or represent you. A reputable advisor works with licensed counsel on every file.

### Investment consultant

A consultant, often a wealth manager or a real estate broker, whose expertise is the investment case: the property market, the yield, the resale, the currency, the tax position at home. An investment consultant will tell you whether an İstanbul apartment at USD 400,000 is a good use of capital; they will not usually know whether the seller is eligible or the annotation has been recorded.

## Where the scopes overlap, and where they do not

| Task | Lawyer | Advisor | Investment consultant |
| --- | --- | --- | --- |
| Legal advice on nationality law | Yes | No | No |
| Representation before authorities | Yes | No | No |
| Eligibility review | Legal aspects | Full review, with counsel | No |
| Property selection | No | Yes | Yes |
| Property compliance check | Title and contract | Coordinates valuation, seller, developer checks | No |
| Investment assessment | No | Yes | Yes |
| Bank and payment coordination | Limited | Yes | Sometimes |
| Family document set | Reviews | Prepares and coordinates | No |
| Filing the applications | Yes | Coordinates | No |
| Appeal after refusal | Yes | Coordinates | No |
| Timeline ownership | Own filings only | End to end | No |
| Post-citizenship property management | No | Yes | Sometimes |

The pattern is clear. The lawyer's role is essential but bounded; the consultant's role is useful but optional; the advisor's role is to make the whole thing work. A file with a lawyer and no advisor is legally sound and frequently slow. A file with an advisor and no lawyer is not a compliant file at all.

## When you need which

**You need an immigration lawyer, always.** There is no compliant Turkish citizenship by investment application without one. If a firm offering citizenship application assistance cannot name the lawyer on your file, walk away.

**You need an advisor when** the process involves a property purchase, a family, an international payment, or a timeline that matters — which is to say, in almost every case. The exception is an investor who already owns qualifying property in Türkiye, has their own trusted lawyer, and simply needs the filings made.

**You need an investment consultant when** the capital allocation is a significant decision in your overall portfolio and you want an independent view of the Turkish property market. A good advisor will give you that view; an independent consultant will give you a second one.

## How to choose an advisor: selection criteria

If the advisor is the party that makes everything else work, choosing one is the decision that matters most. Assess on five criteria.

### 1. Compliance first

Ask how the advisor confirms that a property qualifies. The answer should include a licensed valuation, a title and seller check, a review of whether the property has been used for a previous application, and a payment plan that satisfies the currency-conversion requirement. Anything less is a sales pitch.

### 2. Legal scope, clearly stated

Ask who the lawyer is, whether they are independent of the developer, and what their written scope covers. Ask whether the advisor's fee and the lawyer's fee are separate. Transparency here predicts transparency everywhere else.

### 3. End-to-end execution

Ask for the step-by-step plan from eligibility review to passport, with a named owner for each step. Ask what has gone wrong on previous files. Ask how deficiency notices are handled and at whose cost.

### 4. Independence in property selection

Ask whether the advisor is tied to one developer or one project. Ask what proportion of their clients buy from their own inventory. An advisor who only ever recommends one project is a sales channel for that project.

### 5. What happens after the passport

Ask about rental management, resale after the three-year hold, and the tax position. A firm whose relationship ends on approval day was never advising you on an investment.

Our [advisor checklist for 2026](/knowledge/turkish-citizenship-advisor-checklist-2026) turns these into a question list you can put to any firm.

## How to choose a lawyer

- Confirm bar registration and ask for the registration number.
- Ask how many citizenship by investment files they have handled in the last twelve months.
- Ask whether they have handled a refusal and what the outcome was.
- Confirm they will act under a power of attorney and that you will not be required to attend each step in person.
- Ask for a written fee agreement.

A lawyer recommended by your advisor is not a conflict of interest in itself; a lawyer employed by the developer selling you the property is.

## The Multi Mulk model

Multi Mulk is a Turkish citizenship advisor. We are not a law firm. Every file we run is executed by licensed Turkish counsel under power of attorney, and the property side is run to the standard on our [investor protection](/investor-protection) page. We coordinate both under one written scope and one point of accountability, and we stay with the property after the passport.

If you would like to discuss which combination of support is right for your situation, [book a consultation](/contact-us).

## Frequently asked questions

### Can a Turkish citizenship advisor file my application?

No. Applications are filed by a licensed Turkish lawyer acting under a power of attorney, or by you in person. An advisor coordinates and prepares; a lawyer files.

### Can I use only a lawyer and skip the advisor?

You can. The lawyer will handle the legal filings correctly. What you will not have is someone selecting and vetting the property, coordinating the bank and valuation, preparing the family document set, and owning the overall timeline — and those are where most delays come from.

### What does a Turkish citizenship consultation cover?

A proper consultation covers your eligibility, your family structure, the investment route that suits you, the realistic timeline, and the full cost. It should end with a written summary.

### Is it a conflict of interest if my advisor recommends a lawyer?

Not in itself. It is a conflict if the lawyer is employed by or dependent on the developer selling you the property. Ask about independence directly.

### Do Turkey immigration advisors handle residence permits as well as citizenship?

Most do, because a short-term residence permit is a step in the citizenship process. Confirm it is included in the scope rather than assuming it.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "how-to-file-a-turkish-citizenship-application",
    title: "How to File a Turkish Citizenship Application",
    date: `${DAY}T06:40:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "A step-by-step guide to starting a Turkish citizenship application by investment: the eligibility checks to run first, the documents to prepare, the filing sequence, and how to track status once the file is lodged.",
    image: img.documents,
    hero: img.strait,
    seoTitle: "How to File a Turkish Citizenship Application: Step by Step (2026)",
    seoDescription:
      "Eligibility checks, required documents, filing steps and status tracking for a Turkish citizenship application by investment. A step-by-step guide for investors.",
    body: `
A Turkish citizenship application by investment is filed in a fixed sequence, with each step depending on the one before it. Investors who understand the order — and prepare the documents for the next step while the current one is in progress — move through it in months. Investors who discover each requirement as they reach it do not.

This guide sets out the sequence from the eligibility check to the passport, the documents at each stage, and how to track the application once it is lodged. It describes the real estate route, which is the one most investors use.

## Before filing: three eligibility checks

### 1. Personal eligibility

Turkish citizenship by investment is granted by exceptional means under Article 12 of the Turkish Citizenship Law. The decision is discretionary and considers:

- Whether you have a criminal record, in Türkiye or elsewhere.
- Whether there is any national security or public-order concern.
- Your visa and residence history in Türkiye, including any overstays or deportations.
- Whether your nationality is subject to any restriction at the time of application.

Most investors clear all four without difficulty. The point of checking first is that none of them can be fixed by buying a property.

### 2. Investment eligibility

The property or properties must meet every one of the following:

- Appraised value of at least **USD 400,000** in a report from a licensed valuation firm, at the Central Bank rate on the relevant date.
- Declared sale value on the title deed of at least USD 400,000.
- Purchased from a Turkish citizen or a Turkish company, not from a foreign national or a company you control.
- Not previously used as the basis of another foreigner's citizenship application.
- Paid for by bank transfer, with the foreign currency converted through a Turkish bank and documented.
- Subject to a **three-year no-sale annotation** recorded on the title at transfer.

Our guide to [Turkish citizenship by property investment](/knowledge/turkish-citizenship-by-property-investment-2026) covers each condition in detail.

### 3. Family eligibility

Your spouse and children under 18 can be included in the same application. Each will need their own civil documents. Adult children and parents cannot be included.

:::tip Do the family paperwork first
The family documents — marriage certificate, birth certificates, apostilles, sworn translations — take longer to assemble than any other part of the file, and none of them depend on the property. Start them at the eligibility stage.
:::

## The documents you will need

### For the main applicant

- Valid passport, with a notarised and sworn-translated copy.
- Birth certificate, apostilled and translated.
- Marriage certificate (or divorce decree), apostilled and translated.
- Criminal record certificate from your country of nationality and any country of residence in the last five years, apostilled and translated.
- Biometric photographs to Turkish specification.
- Turkish tax identification number.
- Health insurance valid in Türkiye, for the residence permit stage.
- Power of attorney in favour of your lawyer, notarised in Türkiye or at a Turkish consulate.

### For the investment

- Title deed showing the transfer and the three-year annotation.
- Licensed valuation report.
- Bank receipts for the transfer of funds, with the currency-conversion document.
- Sale contract.
- Certificate of conformity from the Ministry, once issued.

### For each family member

- Passport, birth certificate, and, for a spouse, the marriage certificate, each apostilled and translated.
- Biometric photographs.
- For children, proof of parental consent where only one parent is applying.

Document requirements are set by the receiving directorate and can vary slightly by province and over time. Your lawyer will confirm the current list before filing.

## Filing, step by step

### Step 1: Purchase the property and record the annotation

Sign the sale contract, transfer the funds by bank transfer, and complete the transfer at the Land Registry. At the same appointment, the three-year no-sale annotation is recorded on the title. Without the annotation, the certificate of conformity will not be issued.

### Step 2: Apply for the certificate of conformity

Your lawyer applies to the Ministry of Environment, Urbanisation and Climate Change, through its General Directorate of Land Registry and Cadastre, with the title deed, the valuation report and the bank documents. The Ministry confirms that the investment meets the regulation and issues the certificate. This is the document that turns a property purchase into a citizenship qualification.

### Step 3: Apply for the short-term residence permit

With the certificate, your lawyer applies to the Provincial Directorate of Migration Management for a short-term residence permit for the main applicant under the investment provision. This is a procedural step; you are not required to live in Türkiye.

### Step 4: File the citizenship application

Your lawyer lodges the citizenship application with the Provincial Directorate of Population and Citizenship Affairs, with the full document set for you and every family member included. The file is checked for completeness at lodgement. A file with a missing document is not accepted; a file with a defective document is accepted and later returned, which costs more time.

### Step 5: Biometrics and identity checks

Each applicant attends for fingerprints and photographs. This can be done at the directorate in Türkiye or, in many cases, at a Turkish consulate abroad.

### Step 6: Review and decision

The file is reviewed by the Directorate and passed through the security review. Citizenship by exceptional means is granted by decision of the Presidency. A realistic estimate for a clean file is **three to six months** from the certificate of conformity, though the decision is the government's and the time is not guaranteed.

### Step 7: Approval, identity card and passport

On approval, each applicant is registered in the Turkish civil registry, receives a Turkish identity number and identity card, and can then apply for a passport. We cover this stage in [What actually happens on approval day](/knowledge/what-actually-happens-on-turkish-citizenship-approval-day-documents-timeline-and-what-to-expect).

## How to track your application status

Once the application is lodged, status can be followed through the official e-Government portal (e-Devlet) using the applicant's Turkish tax or identity number, and by your lawyer through direct contact with the receiving directorate. The stages you will see are, broadly: application received, under review, referred for security review, decision pending, and decided.

Three practical points:

- A status that does not change for several weeks is normal during the security review.
- A request for additional documents is a request, not a refusal. Respond promptly and completely.
- If the outcome is a refusal, there is a defined path. See [How to respond to a Turkish citizenship rejection](/knowledge/how-to-respond-to-a-turkish-citizenship-rejection).

## Common filing mistakes

- Buying the property before confirming the seller is eligible.
- A valuation report that meets the threshold on the day it is written but not on the day of transfer, because the rate moved.
- Funds transferred from a third party's account.
- An apostille obtained in the wrong country, or a translation by a translator who is not sworn.
- Letting the residence permit lapse before the citizenship application is lodged.
- Filing in a province where the directorate is heavily backlogged when the property allows a choice. Our guide to the [fastest cities to get citizenship approved](/knowledge/fastest-cities-in-turkey-to-get-citizenship-approved-in-2026) explains why this matters.

## Filing with Multi Mulk

Multi Mulk prepares the document set, runs the property compliance checks, and coordinates the licensed lawyer who files at each step. If you would like a written eligibility review before you begin, [contact us](/contact-us).

## Frequently asked questions

### Can I file a Turkish citizenship application myself?

You can attend in person for each step, but most investors act through a licensed Turkish lawyer under a power of attorney, which removes the need to be in Türkiye for each filing.

### How long do the application documents take to prepare?

Allow four to eight weeks for civil documents with apostilles and sworn translations, depending on the issuing country. This can run in parallel with the property purchase.

### What is the certificate of conformity?

The Ministry's confirmation that your investment meets the citizenship regulation. It is a prerequisite for both the residence permit and the citizenship application.

### Do I need to be in Türkiye to file?

Not for the filings, if your lawyer holds a power of attorney. You, and each family member, will need to attend once for biometrics, which can often be done at a Turkish consulate.

### What immigration procedures apply after approval?

After approval you are a Turkish citizen and no longer subject to immigration procedures in Türkiye. You will register in the civil registry, receive an identity card, and can apply for a passport.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "turkish-citizenship-advisory-services-2026",
    title: "Turkish Citizenship Advisory Services in 2026",
    date: `${DAY}T06:50:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "Multi Mulk's Turkish citizenship advisory service, explained: eligibility review, property due diligence, legal coordination with licensed counsel, and application support from first enquiry to passport.",
    image: img.advisory,
    hero: img.istanbulDusk,
    seoTitle: "Turkish Citizenship Advisory Services 2026 | Multi Mulk",
    seoDescription:
      "Structured Turkish citizenship by investment advisory: written eligibility review, property due diligence, legal coordination and application support. How Multi Mulk works.",
    body: `
Most investors who approach Turkish citizenship by investment for the first time have the same three concerns: whether they qualify, whether the property they are being shown is genuinely eligible, and whether anyone is accountable for the file once the money has moved. A structured advisory service exists to answer all three before the first payment, not after.

This page sets out how Multi Mulk's Turkish citizenship advisory works: what we do at each stage, who does it, and what you receive.

## What a Turkish citizenship advisor does

An advisor coordinates. The legal filings are made by a licensed Turkish lawyer; the valuation is produced by a licensed valuation firm; the transfer is recorded by the Land Registry; the decision is made by the government. What an advisor adds is the review that happens before each step, the coordination between the parties, and the accountability for the whole.

Concretely, our service has four parts.

## 1. Eligibility review

Before any property is discussed, we review your eligibility in writing.

- **Personal**: nationality, criminal record, previous residence or visa history in Türkiye, any factor relevant to the security review.
- **Family**: who can be included — spouse and children under 18 — and what each will need to document.
- **Funds**: the source and route of the investment, and whether it will satisfy the bank and the Ministry.
- **Route**: whether real estate at USD 400,000 is the right instrument for you, or whether a deposit or another route fits better.

You receive a short written assessment: eligible, not eligible, or eligible with conditions, with the realistic timeline and the full cost. If the programme is not right for you, we tell you at this stage.

## 2. Property due diligence

Every eligibility condition attaches to the property. Our due diligence confirms each one before you commit.

| Check | What we confirm | Why it matters |
| --- | --- | --- |
| Valuation | Licensed report at or above USD 400,000 at the official rate | Below threshold, no certificate of conformity |
| Declared value | Title deed value at or above the threshold | Both figures are checked, not one |
| Seller | Turkish national or company, unrelated to you | A foreign or related-party seller disqualifies the purchase |
| History | Not used for a previous citizenship application | A reused property disqualifies the purchase |
| Title | Ownership, encumbrances, annotation feasibility | The three-year annotation must be recordable |
| Developer | Delivery and title-registration record, for off-plan | A late building delays the annotation and the file |
| Payment | Bank transfer route and currency conversion | An untraceable payment is a deficient file |

The same standard applies whether the property comes from our own [Türkiye portfolio](/real-estate) or the wider market, and it is the standard we describe on our [investor protection](/investor-protection) page. We also apply an investment test: yield, resale liquidity, district trajectory. A property that qualifies but is a poor investment is not one we recommend.

## 3. Legal coordination

We are not a law firm. Every file is executed by licensed Turkish counsel acting under a power of attorney, and we coordinate them together with the valuation firm, the bank, the notary and the sworn translators. Our role is to make sure the lawyer has a complete, correct file at each step and that nothing waits on anyone.

- Sale contract and power of attorney reviewed before signature.
- Land Registry transfer and annotation attended.
- Certificate of conformity applied for with a complete document set.
- Residence permit and citizenship applications lodged on time.
- Deficiency notices, if any, answered promptly and at no additional advisory fee.

If you already have a Turkish lawyer you trust, we work with them. If you do not, we introduce independent counsel with a citizenship track record and a written fee agreement. Our guide to [advisor vs lawyer](/knowledge/turkish-citizenship-advisor-vs-lawyer-guide) explains how the two roles fit together.

## 4. Application support

From lodgement to passport, we track the file, report to you, and handle whatever the process asks for.

- Family document set prepared and checked before filing.
- Biometric appointments arranged, in Türkiye or at a consulate.
- Application status monitored and reported.
- Approval-stage steps — civil registration, identity card, passport — coordinated.
- After the passport: rental management and, after the three-year hold, resale planning.

## Timeline

| Stage | Typical duration |
| --- | --- |
| Eligibility review | Within one week of receiving your information |
| Property selection and due diligence | Two to six weeks, depending on your brief |
| Transfer, annotation and certificate of conformity | Four to eight weeks |
| Residence permit | Two to four weeks |
| Citizenship application to decision | Three to six months, estimated |

These are estimates from our own files, not guarantees. The decision is the government's. What we control is whether the file is clean when it is lodged, which is what determines whether it sits in the estimate or outside it.

## Who this service is for

- Investors who want a written answer on eligibility before spending anything.
- Families who need the whole application planned, not just the main applicant's.
- Investors buying off-plan who need the developer vetted as carefully as the property.
- Investors who have been told "we handle everything" and want to know by whom.

## Fees

Our advisory fee is quoted in writing at the eligibility stage, separately from the lawyer's fee, the valuation fee, government fees and transaction taxes, so that you can see the full cost before you commit. We do not take undisclosed commissions from developers on the properties we recommend. Our guide to the [hidden costs of Turkish citizenship](/knowledge/hidden-costs-of-turkish-citizenship-by-investment-in-2026) sets out what the other items typically come to.

:::key Begin with an eligibility review
Send us your nationality, family composition and intended budget through our [contact page](/contact-us), and we will return a written eligibility assessment within two working days.
:::

## Frequently asked questions

### What does a Turkish citizenship consultation with Multi Mulk cover?

Your personal and family eligibility, the investment route, the realistic timeline, the full cost, and the risks specific to your situation — in writing.

### Do you provide citizenship application assistance if I already own property in Türkiye?

Yes, if the property meets the current regulation. We review it against the same checks as a new purchase; a property bought before the current rules may not qualify.

### Are Turkey immigration advisors regulated?

Advisory firms are not licensed in the way lawyers are, which is why we run every file with licensed Turkish counsel and set out our scope in writing.

### Do you handle the residence permit as part of the service?

Yes. The short-term residence permit is a step in the citizenship process and is included in the scope.

### What happens if my application is refused?

Your lawyer will advise on whether to challenge the decision in the administrative court or to reapply after addressing the cause. We coordinate either path. See [What happens if Turkish citizenship is rejected](/knowledge/what-happens-if-turkish-citizenship-is-rejected).
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "turkish-citizenship-application-support-for-investors",
    title: "Turkish Citizenship Application Support for Investors",
    date: `${DAY}T07:00:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "Multi Mulk's document preparation and application support for Turkish citizenship by investment: the exact requirements, a compliant document set, and guided execution through each filing.",
    image: img.documents,
    hero: img.passportCollage,
    seoTitle: "Turkish Citizenship Application Support for Investors | Multi Mulk",
    seoDescription:
      "Document preparation and application support for Turkish citizenship by investment. Clear requirements, compliant paperwork and guided execution from Multi Mulk.",
    body: `
The Turkish citizenship application is a documents process. The investment qualifies you; the documents get you approved. A file lodged with a missing apostille, an unsworn translation or a bank receipt that does not match the contract is not refused — it is returned, and the weeks it took to reach the front of the queue are lost.

Multi Mulk's application support service exists to make sure the file is complete and correct the first time. This page sets out what it covers.

## The requirements, stated plainly

### Turkish citizenship requirements for the real estate route

- Real estate with an appraised and declared value of at least **USD 400,000**.
- Bought from a Turkish national or Turkish company, not previously used for another foreigner's application.
- Paid by bank transfer, with the currency conversion documented through a Turkish bank.
- A **three-year no-sale annotation** recorded on the title.
- A clean criminal record and no security or public-order concern.
- A short-term residence permit obtained before the citizenship application.

Our guide to [the USD 400,000 rule](/knowledge/minimum-investment-for-turkey-citizenship-in-2026-the-400000-rule-fully-explained) explains the threshold in full.

### Who can be included

The main applicant, their spouse, and children under 18. Each is a separate applicant on the same file with their own document set.

## The application documents, by stage

### Stage 1: Power of attorney and identity

- Passport, notarised copy and sworn translation.
- Turkish tax identification number.
- Power of attorney in favour of your lawyer, notarised in Türkiye or at a Turkish consulate.
- Biometric photographs.

### Stage 2: Investment documents

- Sale contract.
- Title deed with the three-year annotation.
- Licensed valuation report.
- Bank transfer receipts, sender and recipient, and the currency-conversion document.
- Certificate of conformity from the Ministry, once issued.

### Stage 3: Residence permit

- Certificate of conformity.
- Health insurance valid in Türkiye.
- Proof of address in Türkiye (the qualifying property serves).
- Application form and fee.

### Stage 4: Citizenship application

- All of the above.
- Birth certificate, apostilled and sworn-translated.
- Marriage certificate or divorce decree, apostilled and sworn-translated.
- Criminal record certificates from your country of nationality and any country of residence in the last five years, apostilled and translated.
- For each family member: passport, birth certificate and, where applicable, marriage certificate and parental consent, each apostilled and translated.

The receiving directorate sets the precise list and it can vary by province and over time. Your lawyer confirms it before filing.

:::warning Where files most often fail
Three documents cause most returns: the criminal record certificate (wrong issuing authority, or older than the directorate accepts), the marriage certificate (no apostille, or apostille from the wrong country), and the bank receipts (funds sent from a third party's account, or the conversion not documented). We check each of these against the current requirement before anything is lodged.
:::

## What the service includes

### Document preparation

- A document matrix for you and each family member, listing every item, the issuing authority, the apostille requirement and the translation requirement.
- Guidance on obtaining each document in your country, including which apostille authority applies.
- Sworn translation into Turkish by translators registered with a Turkish notary.
- A completeness check against the directorate's current list before filing.

### Application filing

- Certificate of conformity application prepared and lodged by your lawyer.
- Residence permit application prepared and lodged.
- Citizenship application prepared and lodged with the full family file.
- Biometric appointments booked, in Türkiye or at a consulate.

### Guided execution

- A written timeline with each step and its owner.
- Status reporting at each stage, and on request.
- Deficiency notices answered promptly, with no additional advisory fee.
- Coordination of the approval-stage steps: civil registration, identity card, passport.

## How the process runs

1. **Eligibility review** — we confirm you and your family qualify, in writing, before anything is bought.
2. **Document matrix issued** — you begin collecting civil documents while the property is selected.
3. **Property compliance and transfer** — valuation, title, seller and payment checks; transfer and annotation.
4. **Certificate of conformity** — applied for and issued.
5. **Residence permit** — applied for and issued.
6. **Citizenship application** — the complete file lodged; biometrics attended.
7. **Decision** — three to six months is a realistic estimate for a clean file.
8. **Passport** — civil registration, identity card, passport application.

Our guide to [how to file a Turkish citizenship application](/knowledge/how-to-file-a-turkish-citizenship-application) walks through each of these in detail.

## Why documents decide the timeline

The government's review time is the government's. What varies from file to file is how many times the file goes back. A complete, correct file is reviewed once. A file returned for a missing document is reviewed twice, and the second review starts where the queue is when the corrected document arrives, not where the file was. Two returns can turn a six-month process into a year.

That is the whole case for a structured document process, and it is why we treat the document matrix as the first deliverable, not the last.

## Working with Multi Mulk

We are a real estate and citizenship advisory, not a law firm. Filings are made by licensed Turkish counsel under power of attorney; we prepare, check, coordinate and report. If you would like to see a sample document matrix for your family composition, [contact us](/contact-us).

## Frequently asked questions

### What documents are needed for a Turkish citizenship application?

Passport, birth certificate, marriage certificate, criminal record certificates, biometric photographs, a Turkish tax number and a power of attorney for the main applicant; the title deed, valuation report, bank documents and certificate of conformity for the investment; and passport, birth certificate and, where applicable, marriage certificate for each family member. All foreign civil documents must be apostilled and sworn-translated.

### How long does the citizenship application process take?

Three to six months from the certificate of conformity is a realistic estimate for a clean file. Document preparation before that typically takes four to eight weeks and can run alongside the property purchase.

### Do documents have to be apostilled?

Yes, for civil documents issued in a Hague Convention country. Documents from non-Convention countries require consular legalisation instead. Your document matrix will state which applies to you.

### What immigration procedures are involved before citizenship?

A short-term residence permit for the main applicant, obtained after the certificate of conformity and before the citizenship application. It is a procedural step and does not require you to live in Türkiye.

### What happens if a document is rejected?

The directorate issues a deficiency notice and the file waits for the corrected document. We respond as quickly as the document can be reissued, and this is included in the service.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "how-to-respond-to-a-turkish-citizenship-rejection",
    title: "How to Respond to a Turkish Citizenship Rejection",
    date: `${DAY}T07:10:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "Practical guidance after a Turkish citizenship application rejection: how to read the decision, check the status, choose between an administrative appeal and a fresh application, and what each path requires.",
    image: img.documents,
    hero: img.cranes,
    seoTitle: "Turkish Citizenship Rejection: How to Respond (Appeal or Reapply)",
    seoDescription:
      "Rejected Turkish citizenship application? The appeal steps, status checks and reapplication path, explained practically for investors and their families.",
    body: `
A Turkish citizenship application rejection is rare on a well-prepared investment file, but it happens, and when it does the investor is usually looking at a short official notice with little explanation and a deadline that is already running. What matters in the days that follow is doing the right things in the right order.

This guide sets out how to respond: how to confirm what the decision actually is, how to check the status, the two paths forward — an appeal in the administrative court, or a fresh application — and what each requires.

:::warning Act on the date, not the mood
An administrative court challenge to a refusal must generally be filed within **60 days** of the date the decision was notified to you. That deadline does not wait for you to decide whether you feel like appealing. Get the decision to a licensed Turkish lawyer the day you receive it.
:::

## Step 1: Confirm what the decision is

Not every negative-sounding communication is a rejection. Three different things can arrive, and they call for different responses.

- **A deficiency notice** asks for a missing or corrected document. This is not a rejection. Supply the document and the file continues.
- **A return of the file** at the residence permit or certificate of conformity stage means an earlier step failed — usually the investment itself did not qualify. This is not a citizenship rejection, but it means the application cannot proceed until the investment is fixed.
- **A refusal of the citizenship application** is a formal decision that citizenship has not been granted. This is the rejected citizenship application this guide is about.

Your lawyer will confirm which of these you are holding. The distinction matters because the first two are corrected administratively and the third is not.

## Step 2: Check the application status

Confirm the status through the official channels rather than relying on a verbal report.

- The **e-Government portal** (e-Devlet) shows the citizenship application status against your Turkish identity or tax number.
- Your lawyer can obtain confirmation and, where available, the stated reason directly from the Provincial Directorate of Population and Citizenship Affairs.
- Ask for the **date of notification**, in writing. That is the date the appeal deadline runs from.

## Step 3: Understand why

The decision notice may state a reason in general terms or may not. Common causes on investment files include:

- A property that did not meet the regulation: valuation below threshold, seller not eligible, property previously used for another application, annotation not recorded.
- A payment that could not be traced to the applicant or was not converted as required.
- A criminal record, or a security or public-order finding.
- Inconsistencies between documents — a name spelled differently across passports and certificates, a marital status that does not match the records.
- A residence permit that lapsed before the citizenship application was lodged.

Your lawyer will assess which of these applies from the file and, where the notice is silent, from experience of the directorate's practice. Our guide to [why some Turkish citizenship applications get rejected](/knowledge/why-some-turkish-citizenship-applications-get-rejected-and-how-to-ensure-yours-isnt) covers each cause in more depth.

## Step 4: Choose the path — appeal or reapply

There are two paths. They are not mutually exclusive in every case, but the choice between them is the central decision.

### The citizenship appeal process

Citizenship by exceptional means is a discretionary administrative decision. Like other administrative decisions in Türkiye, it can be challenged by an **annulment action in the administrative court**, generally within 60 days of notification. Your lawyer files the action; the court reviews whether the decision was lawful, properly reasoned and proportionate.

An appeal is the right path when:

- The decision appears to rest on an error — a document that was in fact provided, a property that in fact qualified.
- The reason given is one you can rebut with evidence.
- Reapplying would not change the outcome because the underlying facts are the same.

Administrative court proceedings take time, often a year or more, and a successful annulment returns the file for a fresh decision rather than granting citizenship directly. Because the underlying decision is discretionary, courts give the administration latitude, particularly on security-related findings.

### The reapplication path

A fresh application is possible once the cause of the refusal has been resolved. Reapplication requirements are, in substance, the original requirements — the investment must qualify, the documents must be complete and current, and the personal eligibility conditions must be met — plus whatever caused the refusal must now be demonstrably fixed.

Reapplication is the right path when:

- The cause was a curable defect: an ineligible property that can be replaced, a payment that can be redone correctly, a document that can be reissued.
- The refusal was administrative rather than a finding against you personally.
- Time matters more than principle, and a clean second file will be faster than a court.

Be aware that a fresh application on the real estate route may require a fresh qualifying investment if the original property was the problem, and that some documents — criminal record certificates in particular — will need to be reissued because the originals have aged.

## Step 5: Preserve the investment

Whatever path you take, the property remains yours, subject to the three-year annotation if it was recorded. A refusal of citizenship does not undo the purchase. If the property was the cause of the refusal, take advice before selling it, because the annotation restricts sale and the resale itself may need to be structured.

## What to expect from your advisor

A structured advisory relationship should not end at a refusal. At Multi Mulk, our role after a rejection is to:

- Obtain the decision and the notification date, and put the file in front of counsel immediately.
- Reconstruct the file to identify the cause, if the notice does not state one.
- Coordinate the appeal or the reapplication, including any replacement investment.
- Report to you at each step, with the realistic timeline.

If you have received a refusal on a file prepared elsewhere and want an independent view of the options, [contact us](/contact-us).

## Frequently asked questions

### How long do I have to appeal a Turkish citizenship rejection?

Generally 60 days from the date the decision was notified to you, to file an annulment action in the administrative court. Confirm the date and the deadline with a licensed Turkish lawyer immediately.

### Can I reapply after a rejected citizenship application?

Yes, once the cause of the refusal has been resolved. The reapplication requirements are the original requirements plus proof that the problem has been fixed.

### How do I check my Turkish citizenship application status?

Through the e-Government portal with your Turkish identity or tax number, or through your lawyer directly with the receiving directorate.

### Does a rejection affect my family members on the same application?

A refusal of the main applicant's application refuses the family's applications with it, because theirs depend on the main applicant's. A successful appeal or reapplication restores them.

### Is a rejection recorded against me for future Turkish nationality applications?

The previous application is on record, and a fresh application will be reviewed with that history visible. That is not a bar to approval; it is a reason to make sure the second file addresses the first refusal directly.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "what-happens-if-turkish-citizenship-is-rejected",
    title: "What Happens If Turkish Citizenship Is Rejected",
    date: `${DAY}T07:20:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "What a Turkish citizenship application rejection actually means for an investor: the common causes, what happens to the investment and the family's applications, and the legal and procedural steps that follow.",
    image: img.passport,
    hero: img.strait,
    seoTitle: "What Happens If Turkish Citizenship Is Rejected? Causes & Next Steps",
    seoDescription:
      "What a Turkish citizenship application rejection means, the most common causes, and the legal and procedural next steps — appeal or reapplication — explained for investors.",
    body: `
Investors ask about rejection more often than it happens. On a properly prepared Turkish citizenship by investment file, refusal is uncommon. But the fear is reasonable, because the application ends in a discretionary government decision, and the consequences of a refusal — for the family, for the investment, for the timeline — are worth understanding before you begin rather than after.

This guide explains what a Turkish citizenship application rejection means, why it happens, and what follows.

## What a rejection is, and what it is not

Turkish citizenship by investment is granted by exceptional means under Article 12 of the Turkish Citizenship Law, by decision of the Presidency on the proposal of the Ministry of Interior. The decision is discretionary: meeting the investment requirement makes you eligible to apply; it does not entitle you to approval.

A **rejection** is a formal decision that citizenship has not been granted. It is different from:

- A **deficiency notice**, which asks for a missing or corrected document and pauses the file rather than ending it.
- A **returned investment file**, where the certificate of conformity is refused because the property or payment did not meet the regulation. The citizenship application has not been decided; it has not yet been possible to make it.
- A **delay**, which is a file that is still under review, however long that takes.

Most of what investors experience as "rejection" is in fact one of the first two, and both are corrected administratively.

## Why applications are rejected

### The investment did not qualify

The most common cause on real estate files, and the most avoidable. Specifically:

- The valuation was below **USD 400,000** at the official rate on the relevant date.
- The declared value on the title deed was below the threshold, even though the valuation was not.
- The seller was a foreign national, or a company connected to the applicant.
- The property had been used for a previous foreigner's citizenship application.
- The **three-year annotation** was not recorded at transfer.

Every one of these is checkable before purchase. Our [investor protection](/investor-protection) page and our guide to [Turkish citizenship by property investment](/knowledge/turkish-citizenship-by-property-investment-2026) set out the checks.

### The payment could not be traced

The regulation requires payment by bank transfer, with the foreign currency converted through a Turkish bank and documented. Funds sent in cash, from a third party's account, or without the conversion document leave a file that cannot show the investor made the investment.

### A personal eligibility finding

A criminal record, a finding of risk to national security or public order, or a history of immigration violations in Türkiye. These are the cases in which the refusal is about the applicant rather than the file, and they are the hardest to reverse.

### Document inconsistency

Names spelled differently across a passport and a birth certificate; a marital status on the application that does not match the civil records; a certificate whose apostille was obtained in the wrong country. Individually minor; collectively a reason to refuse.

### A lapsed procedural step

A residence permit that expired before the citizenship application was lodged, or a file lodged with a document that had passed its validity period.

## What happens to the family

The spouse and children are applicants on the main applicant's file. If the main applicant's application is refused, theirs are refused with it. If the main applicant later succeeds on appeal or reapplication, the family's applications are restored on the same basis. Family members do not have an independent claim through the investment.

## What happens to the investment

The property remains yours. A refusal of citizenship does not reverse the purchase, and if the three-year annotation was recorded, it remains on the title. Two practical consequences:

- If the property was the reason for the refusal — an ineligible seller, a reused property — it will not qualify on a fresh application either. A replacement investment may be needed.
- Selling the property within the three years is restricted by the annotation. Take legal advice before attempting it.

Our guide to [what triggers citizenship revocation](/knowledge/turkey-citizenship-revoked-what-actually-triggers-it-2026) covers the separate question of what happens to a citizenship already granted.

## The legal and procedural next steps

### Confirm the decision and the notification date

Have your lawyer obtain the decision from the Provincial Directorate of Population and Citizenship Affairs and confirm the date it was notified. Check the citizenship application status on the e-Government portal as well.

### Identify the cause

If the notice does not state a reason, your lawyer reconstructs it from the file and from the directorate's practice. This determines everything that follows.

### Choose between appeal and reapplication

- **Appeal**: an annulment action in the administrative court, generally within **60 days** of notification. Appropriate where the decision rests on an error or a rebuttable finding. Court proceedings are slow — often a year or more — and a successful outcome returns the file for a fresh decision.
- **Reapplication**: a fresh application once the cause has been resolved. Appropriate where the defect is curable — a replacement property, a corrected payment, a reissued document. Reapplication requirements are the original requirements plus proof that the problem is fixed.

Our guide to [how to respond to a Turkish citizenship rejection](/knowledge/how-to-respond-to-a-turkish-citizenship-rejection) walks through each path step by step, and [how to appeal a Turkish citizenship rejection](/knowledge/how-to-appeal-a-turkish-citizenship-rejection-2026) covers the court process in detail.

### Keep the deadline

The 60-day period for an administrative court action runs from notification, not from when you decide. If there is any prospect of appealing, the decision should be with a lawyer within days.

## How to make rejection unlikely

Every cause above except a personal eligibility finding is avoidable before the file is lodged. That is the whole argument for a structured advisory process:

1. Written eligibility review, before any property is chosen.
2. Property compliance checks — valuation, declared value, seller, history, annotation — in writing, before purchase.
3. A payment plan that satisfies the bank and the Ministry.
4. A document matrix per family member, checked against the current list before filing.
5. A licensed lawyer under power of attorney, filing each step on time.

If you would like an independent review of an application prepared elsewhere, or a written eligibility assessment before you begin, [contact us](/contact-us).

## Frequently asked questions

### How common is a Turkish citizenship application rejection?

Uncommon on a properly prepared investment file. Most refusals trace to a property or payment that did not meet the regulation, or to document defects, all of which can be checked before filing.

### If my citizenship is rejected, do I lose the property?

No. The property remains yours. If the three-year annotation was recorded, it stays on the title and restricts sale for the remainder of the period.

### Can I appeal a rejected citizenship application?

Yes. The decision can be challenged by an annulment action in the administrative court, generally within 60 days of notification. A licensed Turkish lawyer files the action.

### Does a rejection stop my family from getting citizenship?

Their applications depend on yours and are refused with it. If you succeed on appeal or reapplication, theirs are restored.

### What are the reapplication requirements after a rejection?

The same requirements as the original application — a qualifying investment, complete and current documents, personal eligibility — plus evidence that the cause of the earlier refusal has been resolved.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "how-to-appeal-a-turkish-citizenship-rejection-2026",
    title: "How to Appeal a Turkish Citizenship Rejection in 2026",
    date: `${DAY}T07:30:00.000Z`,
    topics: ["citizenship", "turkiye"],
    excerpt:
      "The definitive guide to a Turkish citizenship application rejection: why applications are refused, how the administrative appeal works, what a reapplication requires, and how to decide between them within the legal process.",
    image: img.cranes,
    hero: img.istanbulDusk,
    seoTitle: "How to Appeal a Turkish Citizenship Rejection in 2026: Full Guide",
    seoDescription:
      "Why Turkish citizenship applications are rejected, how the administrative court appeal works, the 60-day deadline, and when to reapply instead. A 2026 guide for investors.",
    body: `
When a Turkish citizenship application is refused, the investor has two lawful routes forward: challenge the decision in the administrative court, or resolve the cause and apply again. Both are real options. Neither is automatic. Choosing between them well requires understanding why the application was refused, what the court can and cannot do, and what a fresh application would need.

This is a guide to that decision, and to the appeal process itself, as it stands in 2026.

## Why Turkish citizenship applications are rejected

Citizenship by investment is granted by exceptional means under Article 12 of the Turkish Citizenship Law No. 5901. The investment makes you eligible to apply; the grant is a discretionary decision of the Presidency on the Ministry of Interior's proposal. Refusals fall into four groups.

### Investment non-compliance

The property or payment did not meet the regulation: valuation or declared value below USD 400,000, an ineligible seller, a property previously used for another application, no three-year annotation, funds not transferred or converted as required. These are the majority of refusals on real estate files, and every one is avoidable before purchase.

### Document defects

Missing apostilles, unsworn translations, inconsistent names or civil status across documents, certificates past their validity, a lapsed residence permit.

### Personal eligibility

A criminal record, a finding of risk to national security or public order, prior immigration violations in Türkiye.

### Procedural failure

A step missed or lodged out of sequence — most often the residence permit — so that the citizenship application was not properly before the directorate.

The group your refusal falls into largely determines which route is right.

## Step one: get the decision and the date

Have a licensed Turkish lawyer obtain the written decision from the Provincial Directorate of Population and Citizenship Affairs and confirm the **date of notification**. Check the citizenship application status on the e-Government portal as a cross-reference. The notification date starts the appeal clock.

:::warning The 60-day deadline
An annulment action against an administrative decision must generally be filed in the administrative court within 60 days of notification, under the Administrative Procedure Law. Missing it forecloses the appeal, whatever its merits. If there is any possibility of appealing, the decision should be with counsel within days, not weeks.
:::

## The citizenship appeal process

### What the court reviews

The administrative court does not decide whether you should be a citizen. It decides whether the refusal was **lawful**: whether the administration applied the correct rules, considered the file properly, gave reasons where required, and acted within its discretion. A decision that rests on a factual error — a document that was in fact submitted, a property that in fact met the threshold — is the kind of decision a court can annul.

### What the court gives latitude on

Because the grant is discretionary, courts defer to the administration's judgement, particularly on national security and public-order findings. An appeal against a refusal on those grounds is possible but faces a higher bar, and the evidence behind the finding may not be fully disclosed.

### The procedure

1. Your lawyer files the annulment petition with the competent administrative court within the deadline, setting out the grounds and attaching the file.
2. The administration files its defence, with its reasons and the underlying record.
3. Written exchanges follow; a hearing may be held.
4. The court decides. A successful annulment sets the refusal aside and returns the matter to the administration for a fresh decision consistent with the judgment.
5. Either party may appeal to the regional administrative court, and in some cases onward.

### Timeline and outcome

First-instance proceedings commonly take a year or more, and further appeals add to that. A win does not by itself grant citizenship; it removes the unlawful refusal and requires a new decision. In practice, a clear annulment on a factual error usually leads to approval on redecision.

### When to appeal

- The refusal rests on a demonstrable error.
- The stated reason can be rebutted with evidence already in the file or readily obtainable.
- Reapplying would face the same finding, so only a court can move it.
- Principle, or the record for future applications, matters enough to justify the time.

## The reapplication path

A fresh Turkish nationality application is available once the cause of the refusal has been resolved. The reapplication requirements are the original requirements — a qualifying investment, a complete and current document set, personal eligibility, the residence permit — with one addition: the file must demonstrably fix what the first one got wrong.

### What that means in practice

- **Investment non-compliance**: if the property cannot be made to qualify, a replacement qualifying investment is needed. The original property remains yours, subject to the annotation if recorded.
- **Document defects**: reissue the defective documents; refresh any that have aged, criminal record certificates in particular.
- **Procedural failure**: repeat the missed step in sequence — a new residence permit, then the application.
- **Personal eligibility**: reapplication rarely changes the outcome unless the underlying circumstance has changed. This is the group where an appeal, or a decision not to pursue, is more realistic.

### When to reapply

- The defect is curable and the cure is faster than a court.
- The refusal was administrative rather than a finding against you.
- The cost of a replacement investment, if needed, is acceptable against the time saved.

## Appeal or reapply: a decision table

| Cause of refusal | Appeal | Reapply |
| --- | --- | --- |
| Factual error by the administration | Strong | Possible, if the error is easily corrected in a new file |
| Property did not qualify | Weak | Yes, with a replacement or corrected investment |
| Payment not traceable | Weak | Yes, with a compliant payment |
| Document defects | Weak | Yes, with reissued documents |
| Lapsed residence permit or missed step | Weak | Yes, repeating the step |
| Criminal record or security finding | Possible, higher bar | Unlikely to change the outcome |

Both routes can, in some cases, be pursued in parallel — an appeal to protect the position on the first decision while a corrected second application proceeds. Whether that is sensible depends on the facts and is a question for your lawyer.

## The role of your advisor and your lawyer

The appeal is a legal proceeding and is conducted by a licensed Turkish lawyer. An advisor's role is everything around it: obtaining the decision quickly, reconstructing the file to find the cause, sourcing and vetting a replacement investment if one is needed, rebuilding the document set for a reapplication, and keeping you informed. Our guide to [advisor vs lawyer](/knowledge/turkish-citizenship-advisor-vs-lawyer-guide) explains the division.

If you have received a refusal on a file prepared elsewhere, Multi Mulk can provide an independent review of the file and coordinate either route with counsel. [Contact us](/contact-us) with the decision notice and the notification date.

## Frequently asked questions

### What is the deadline to appeal a Turkish citizenship rejection?

Generally 60 days from notification of the decision, to file an annulment action in the administrative court. Confirm the exact date with a licensed Turkish lawyer.

### Can the court grant me citizenship directly?

No. A successful appeal annuls the refusal and requires the administration to decide again lawfully. In practice a clear annulment usually leads to approval, but the grant remains the administration's.

### Should I appeal or reapply after a rejected citizenship application?

Appeal if the refusal rests on an error you can demonstrate; reapply if the cause is a curable defect in the investment, the documents or the procedure. A security-related refusal is the hardest to reverse by either route.

### Can I check my citizenship application status during an appeal?

The original application will show as decided. The court case has its own record, which your lawyer follows. A redecision after a successful appeal appears as a new status.

### Do I need a new investment to reapply?

Only if the original investment was the cause of the refusal and cannot be corrected. If the property qualified and the refusal was for another reason, the same investment supports the fresh application.
`.trim(),
  },
  // ---------------------------------------------------------------------------
  {
    slug: "how-much-to-invest-for-turkish-citizenship-2026",
    title: "How Much to Invest for Turkish Citizenship in 2026",
    date: `${DAY}T07:40:00.000Z`,
    topics: ["citizenship", "real-estate", "turkiye"],
    excerpt:
      "The minimum USD investment for Turkish citizenship by real estate in 2026, how the threshold is measured, the eligibility conditions attached to it, the other routes, and the legal and process context an investor needs before committing.",
    image: img.istanbul,
    hero: img.passports,
    seoTitle: "How Much to Invest for Turkish Citizenship in 2026 (USD Minimum)",
    seoDescription:
      "The minimum real estate investment for Turkish citizenship is USD 400,000. How it is measured, the eligibility conditions, the other routes, and the legal and process context for 2026.",
    body: `
The investment amount for Turkish citizenship by real estate is **USD 400,000**. That is the figure in the regulation, it has been the figure since June 2022, and it is the figure in 2026. But the number on its own answers less than it appears to, because the regulation is specific about *how* the USD 400,000 is measured, *what* it can be spent on, and *what else* must be true for the purchase to count.

This guide sets out the USD investment requirement, the conditions attached to it, the alternative routes, and the legal and process context around the number.

## The minimum investment, and how it is measured

The threshold is met when a property — or several properties together — has:

1. An **appraised value** of at least USD 400,000, in a report from a valuation firm licensed by the Capital Markets Board, and
2. A **declared sale value** on the title deed of at least USD 400,000.

Both conditions apply. A property appraised at USD 450,000 but registered at a declared value of USD 380,000 does not qualify. The dollar figure is converted at the Central Bank of the Republic of Türkiye's effective selling rate on the relevant date, which is why the lira price of a qualifying property moves as the rate moves.

:::note The figure is a floor, not a budget
USD 400,000 is the minimum the property must be worth. It is not the total cost of citizenship. Transaction taxes, professional fees and government fees sit on top of it, and the property itself should be chosen because it is worth owning, not because it is the cheapest that clears the line.
:::

## The conditions attached to the investment

The regulation attaches several conditions to the purchase. A property that fails any one of them does not qualify, however much it is worth.

- **Eligible seller**: a Turkish citizen or a Turkish legal entity. Property bought from a foreign national does not count, nor does property bought from a company the applicant controls.
- **Not previously used**: the property must not have been the basis of another foreigner's citizenship application. A "citizenship apartment" that has already served once cannot serve twice.
- **Payment by bank transfer**: the purchase price must move by bank transfer, with receipts from both sides. The foreign currency must be sold to a Turkish bank and the conversion documented, as the regulation has required since 2022.
- **Three-year annotation**: at transfer, a commitment not to sell for three years is recorded on the title deed. The property can be sold after that period and citizenship is retained.
- **Certificate of conformity**: after transfer, the Ministry of Environment, Urbanisation and Climate Change confirms that the investment meets the regulation. This certificate is what the residence permit and citizenship applications are built on.

Our guide to [the USD 400,000 rule, fully explained](/knowledge/minimum-investment-for-turkey-citizenship-in-2026-the-400000-rule-fully-explained) goes through each condition in depth, and [can you split the requirement across two properties?](/knowledge/turkey-citizenship-by-investment-400000-can-you-split-the-requirement-across-two-properties) covers multi-property purchases.

## Citizenship eligibility beyond the investment

The investment makes you eligible to apply. The grant is discretionary. The other conditions are:

- A clean criminal record, in Türkiye and elsewhere.
- No finding of risk to national security or public order.
- No history of immigration violations in Türkiye.
- A short-term residence permit, obtained after the certificate of conformity and before the citizenship application.

Your spouse and children under 18 are included in your application. There is no residency requirement, no language test and no interview about your knowledge of Türkiye.

## The other routes, for comparison

Real estate is the route most investors take, and the one Multi Mulk advises on, but the Turkish citizenship program offers others. Each requires the investment to be held for three years.

| Route | Minimum | Held for | Notes |
| --- | --- | --- | --- |
| Real estate | USD 400,000 | 3 years | An owned asset; can be let and later sold |
| Bank deposit | USD 500,000 | 3 years | Cash in a Turkish bank; interest-bearing |
| Government bonds | USD 500,000 | 3 years | Turkish state debt instruments |
| Fixed capital investment | USD 500,000 | 3 years | A business investment confirmed by the Ministry of Industry and Technology |
| Investment or venture capital fund shares | USD 500,000 | 3 years | Fund units, confirmed by the Capital Markets Board |
| Job creation | 50 employees | — | Employment confirmed by the Ministry of Labour and Social Security |

Real estate has the lowest threshold and is the only route that leaves you with a physical asset in a large, liquid market. The deposit route is simpler but the capital sits idle in a currency you may not want exposure to. We compare the two in [real estate vs bank deposit for Turkey citizenship](/knowledge/real-estate-vs-bank-deposit-for-turkey-citizenship).

## What the total cost looks like

Beyond the USD 400,000, an investor should budget for:

- **Title deed transfer tax**, a percentage of the declared value, the split of which is agreed between buyer and seller.
- **VAT** on a new-build purchase from a developer, subject to the exemptions available to foreign buyers who meet the conditions.
- **Valuation fee**, notary fees, and sworn translation fees.
- **Residence permit and citizenship application fees**, per applicant.
- **Legal fees** for the licensed lawyer acting under power of attorney.
- **Advisory fees**, quoted separately.
- **Annual costs of ownership**: property tax, building service charges, insurance.

Our guide to [what Turkish citizenship actually costs all-in](/knowledge/the-400k-question-what-does-turkish-citizenship-actually-cost-all-in-in-2026) puts numbers to each, and the [cost calculator](/tools) estimates the total for your family size.

## Is the investment recoverable?

After the three-year annotation expires, the property can be sold and the citizenship is retained. Whether you recover the capital, or more, depends on the property. A well-located apartment in a district with rental demand and a resale market is an investment that also happens to qualify. A "citizenship unit" in a building that exists only to be sold to applicants is a qualification that may not be an investment. Our [investor protection](/investor-protection) page sets out how to tell the difference, and [the best cities in Türkiye to invest for citizenship](/knowledge/best-cities-in-turkey-to-invest-for-citizenship) looks at where the two objectives align.

## The process, in brief

1. Eligibility review, in writing.
2. Property selection, licensed valuation and compliance checks.
3. Sale contract, bank transfer with conversion, title transfer with annotation.
4. Certificate of conformity.
5. Short-term residence permit.
6. Citizenship application, biometrics, security review.
7. Approval, identity card, passport. Three to six months from the certificate is a realistic estimate for a clean file.

Our guide to [how to file a Turkish citizenship application](/knowledge/how-to-file-a-turkish-citizenship-application) walks through each step.

## Working with Multi Mulk

We advise on the real estate route, with a written eligibility review before any property is discussed, compliance checks on every property before you commit, and licensed Turkish counsel filing each step. If you would like to know what a qualifying property in your preferred district currently costs, and what the all-in figure would be for your family, [contact us](/contact-us).

## Frequently asked questions

### What is the minimum investment for Turkish citizenship in 2026?

USD 400,000 in real estate, measured by both a licensed appraisal and the declared value on the title deed, held for three years. The other routes — bank deposit, government bonds, fixed capital investment, fund shares — require USD 500,000.

### Is the USD 400,000 requirement paid in dollars or lira?

The purchase is typically paid in lira after the foreign currency is sold to a Turkish bank, and the conversion is documented. The threshold is measured in dollars at the Central Bank rate on the relevant date.

### Can I buy more than one property to reach USD 400,000?

Yes, provided each property meets the conditions and the purchases are included in the same certificate of conformity.

### Can I sell the property after getting citizenship?

After the three-year annotation period. Citizenship is retained after the sale.

### Does the investment amount include taxes and fees?

No. Transfer tax, VAT where applicable, professional fees and government fees are in addition to the USD 400,000.
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
