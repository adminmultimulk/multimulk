# Multi Mulk Global Client Portal, Complete Programme Plan

**Scope:** all 25 sections of the brief, from today's codebase to the finished ecosystem.
**Date:** 10 September 2026

---

## Context

The brief specifies a Global Client Portal for CBI/RBI/Golden Visa: a Program Finder that
qualifies leads, a comparison engine, CRM-connected capture, a logged-in client dashboard with
application tracking and document management, an AI advisor, and management analytics.

It reads as though written against a blank page. It is not. The `multimulk` repo already
contains a typed CBI/RBI programme fact base, a generated comparison engine, a durable lead
pipeline writing to Bitrix24, seven languages with RTL, a staff CMS, and editorial guardrails
that fail the build when a published number has no cited source.

**Position today: the acquisition engine's data foundation is ~70% built, its user-facing
half ~25%, and the servicing engine 0%.**

This document covers the whole brief. Part 1 maps every section to a stage so nothing is
unaccounted for. Parts 3–6 specify each stage. Part 8 sets out how to compress the calendar
with more people.

---



## Part 1 — Coverage map: all 25 sections


| #   | Brief section                                      | Today                                 | Stage                         | Detail     |
| --- | -------------------------------------------------- | ------------------------------------- | ----------------------------- | ---------- |
| 1   | Digital investment-migration advisor               | Foundation only                       | **1**                         | §3.1       |
| 2   | Program Finder (8–12 questions)                    | Not started                           | **1**                         | §3.2       |
| 3   | CBI/RBI comparison engine (21 criteria)            | 12 of 21 criteria; 3 fixed pairs      | **1**                         | §3.3       |
| 4   | Personalised recommendation                        | Not started                           | **1**                         | §3.4       |
| 5   | Lead generation (8 fields)                         | 6 fields, hardened pipeline           | **1**                         | §3.5       |
| 6   | CRM integration (14 attributes)                    | Bitrix24 live, 4 attributes           | **1** + **2**                 | §3.6, §4.5 |
| 7   | Client dashboard (8 panels)                        | Not started                           | **3**                         | §5.2       |
| 8   | Application tracker                                | Not started                           | **3**                         | §5.3       |
| 9   | Document management                                | Not started                           | **3**                         | §5.4       |
| 10  | Property investment module (13 filters, 5 actions) | Search + filters, no personalisation  | **2**                         | §4.2       |
| 11  | Property comparison (18 criteria)                  | 8 of 18 fields; no UI                 | **2**                         | §4.3       |
| 12  | AI assistant                                       | Not started; safeguards already exist | **4**                         | §6.1       |
| 13  | Multilingual (7 languages)                         | **Done**, minus Persian               | **1** + **4**                 | §3.9, §6.4 |
| 14  | Social/campaign integration + UTM                  | Not started                           | **1**                         | §3.7       |
| 15  | WhatsApp integration                               | Button live; no structured hand-off   | **1**                         | §3.8       |
| 16  | Appointment booking                                | Not started                           | **1** request, **3** calendar | §3.8, §5.6 |
| 17  | Automated personalised PDF report                  | Not started                           | **1** web, **2** PDF          | §3.8, §4.6 |
| 18  | Admin panel (14 entity types)                      | Articles + properties + users         | **2**                         | §4.4       |
| 19  | Lead scoring (HOT/WARM/NURTURE)                    | Not started                           | **1**                         | §3.6       |
| 20  | Automated follow-up (day 1/3/7/14)                 | Immediate ack only                    | **2**                         | §4.7       |
| 21  | Analytics dashboard (17 metrics)                   | GA4 events only                       | **4**                         | §6.2       |
| 22  | SEO + GEO strategy                                 | **Largely done**                      | **1** polish                  | §3.10      |
| 23  | End-to-end client journey                          | Top half exists                       | **1–3**                       | Part 7     |
| 24  | Development phasing                                | —                                     | This document                 | Part 8     |
| 25  | Positioning                                        | —                                     | Delivered by §2               | §3.2       |


Four stages, in the brief's own order:


| Stage | Brief's name              | Sections                              | Solo duration |
| ----- | ------------------------- | ------------------------------------- | ------------- |
| **1** | Lead Generation MVP       | 1–6, 13, 14, 15, 16a, 17a, 19, 22, 25 | **2 months**  |
| **2** | Investment Platform       | 6b, 10, 11, 17b, 18, 20               | 2 months      |
| **3** | Client Application Portal | 7, 8, 9, 16b                          | 3 months      |
| **4** | Intelligence & Automation | 12, 13b, 21                           | 2 months      |


**Total solo: ~9 months.** Part 8 shows how to compress this with parallel workstreams.

---



## Part 2 — Architecture

The brief's own closing note is the correct organising principle:

> *Treat the Program Finder as the acquisition engine and the logged-in Client Portal as the
> servicing engine. Keeping those two layers separate will make the first version faster to
> launch and much easier to scale later.*

Three surfaces, each with its own root layout. The codebase already has this pattern
(`app/[lang]/layout.tsx` public, `app/admin/layout.tsx` staff):

```
app/[lang]/…   acquisition + public   anonymous, SEO-indexed, 7 languages
app/portal/…   servicing (Stage 3)    client auth, noindex, private data
app/admin/…    staff (exists)         staff auth, roles, noindex
```



### Cross-cutting decisions, expensive to reverse

1. **Client accounts are not staff accounts.** `User.role` is `SUPERADMIN | EDITOR | LISTER`
  and every admin guard trusts it. Adding `CLIENT` means re-auditing every guard in
   `app/lib/admin/guard.ts`. Add a separate `ClientUser` model and a second Auth.js
   configuration. The `Account`/`Session`/`VerificationToken` adapter tables already exist, so
   a magic-link provider for clients is largely configuration.
2. **Client documents never touch Cloudinary.** Cloudinary is public marketing delivery.
  Passports, police clearance and bank documents go to private storage (Vercel Blob private,
   or S3 with SSE) behind signed short-expiry URLs, with an access-log row per read.
3. **The AI assistant is retrieval-only** over `programmes.ts`. It may explain, compare and
  personalise; never state a threshold, fee or eligibility rule absent from the fact base
   with a cited source. Brief §12, already enforceable because of the existing figures registry.
4. **One client profile object, consumed everywhere.** The Finder, comparison, report, CRM
  payload and eventually the dashboard all read the same `ClientProfile`. Written once in
   Stage 1; never re-modelled.



### Data model — everything added across the four stages


| Stage | New collections                                                                                                                                             |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `Assessment` (answers + computed matches + score), `Activity` (event stream keyed by an anonymous cookie, attached to the lead on submit), `AdvisorProfile` |
| 2     | `ProgrammeRecord` (admin overlay on the static list), `Developer`, `Offer`, `SavedItem` (favourites), `FollowUpSchedule` + `FollowUpSend`                   |
| 3     | `ClientUser`, `Application`, `ApplicationStage`, `Document`, `DocumentAccessLog`, `Message`, `Appointment`, `Notification`                                  |
| 4     | `AiConversation`, `AiCitation`, `MetricSnapshot`                                                                                                            |


House style throughout: pure modules, hand-rolled validation (**no zod** in this project —
see `app/lib/leads/schema.ts`), errors as keys not sentences, `UNKNOWN` sentinels not `null`,
CMS collections overlaying static data at read time (`app/lib/cms/`).

---



## Part 3 — Stage 1 · Lead Generation MVP · Workstream A

Covers brief sections 1–6, 13, 14, 15, 16a, 17a, 19, 22, 25.

### 3.1 The client profile (§1)

`app/lib/assessment/profile.ts` — one type capturing all 17 inputs the brief lists:
nationality, country of residence, family size, dependants' ages, budget, preferred investment
type, citizenship vs residency, preferred countries/regions, desired processing time,
relocation requirement, visa-free requirement, property-investment requirement, rental-income
preference, capital-appreciation preference, education/family priorities, tax considerations,
and relocate-vs-second-passport intent.

Every downstream feature reads this object. It is the spine of the whole platform.

### 3.2 Program Finder (§2, §25)

`app/lib/assessment/` — pure, testable, no AI:

- `questions.ts` — 10 questions covering the 17 profile inputs (several inputs per question).
Each `{ id, kind: "single"|"multi"|"range", optionKeys }`; labels live in the dictionary.
- `match.ts` — **deterministic scoring.** Hard filters first (budget vs cheapest *offered*
route, citizenship-vs-residency, `status !== "closed"`), then a weighted soft score across
processing time, visa-free reach, relocation burden, family fit, tax, region preference and
property/rental fit. Returns `{ programme, score, reasons }[]`. Reuses `cheapestOfferedRoute()`.
- `explain.ts` — derives the ✓ reason list from profile + fact base. Derived, never authored.
- `scoring.ts` — HOT / WARM / NURTURE.

Route `app/[lang]/find-your-programme/`. Multi-step; answers in `sessionStorage` plus a compact
encoded search param so results survive a refresh and are shareable. Reuses `Container`,
`PageHero`, `SelectMenu`, `Modal`, `Link` (locale-aware — never `next/link`).

**Guardrail:** `scripts/check-match.mjs` with fixture profiles → expected top programme, wired
into `npm run check`. A silent scoring regression produces confident, wrong advice about
six-figure investments — worse than a crash.

### 3.3 Comparison engine — all 21 criteria (§3)

`Programme` already carries 12 of the brief's 21 criteria. Add seven as `Known<T>`:

`propertyOwnership`, `rentalPotential`, `exitPossible`, `governmentFees`,
`serviceFeeEstimate`, `renewalRequirement`, plus structured `advantages` / `limitations`
(keys into the dictionary, not prose, so they translate once).

Refactor `comparisonTable()` to take `readonly Programme[]` instead of a `Comparison`; the
three editorial pages keep working by passing `comparisonProgrammes(comparison)`. New route
`/[lang]/compare?p=citizenship:turkiye,residency:uae` — 2–4 programmes, `noindex` (the curated
allowlist exists precisely to avoid doorway pages).

Move `cost-calculator.tsx`'s hardcoded `assumptions` onto the programme record so the
calculator and comparison table cannot disagree.

*Each new field needs a* `figures.ts` *source entry or* `check:figures` *fails the build — which
is the system working, and why business dependency 3 in Part 9 has the earliest deadline.*

### 3.4 Personalised recommendation (§4)

Results route rendering best match with suitability percentage, two to three alternatives, and
the derived reason list, then the advisor CTA. Renders `ProgrammeTable`. `noindex`.

### 3.5 Lead capture (§5)

Extend `app/lib/leads/schema.ts` with the brief's eight fields: full name, nationality, country
of residence, WhatsApp number, email, investment budget, programme of interest, preferred
contact method — plus family size. Add `"assessment"` to `enquiryTypes` and
`Lead.assessment?: { profile, matches, score }`.

The report is gated: capture precedes delivery, reusing the `brochure.ts` pattern.

### 3.6 CRM integration and lead scoring (§6, §19)

An `Activity` collection records programmes viewed, comparisons built, reports downloaded and
appointment requests against an anonymous cookie, then attaches to the lead on submission.
This is what makes "programmes viewed" answerable at all — it is a stream, not a form field.

`bitrix24.ts` extends to map: lead source (the brief's 10 values, resolved from UTM), budget,
nationality, residence, family size, property interest, recommended programme, programmes
compared, lead score, assigned advisor, last activity. Bitrix native `UTM_*` fields plus
`UF_CRM_*` custom fields.

Advisor assignment: `AdvisorProfile` with languages and offices; the lead routes to an advisor
who speaks the enquiry's language — the brief's §13 requirement.

### 3.7 Campaign integration and UTM (§14)

Capture `utm_*`, `gclid`, `fbclid` on first landing in `proxy.ts` (already runs on every public
request) into a first-party cookie; read in the Server Action. Campaign-specific entry points:
`/find-your-programme?focus=turkiye` pre-selects the objective so an Instagram Türkiye ad lands
in a Türkiye-shaped journey rather than a generic one. This makes
Campaign → Lead → Qualified Lead → Appointment measurable, which is §21's premise.

### 3.8 WhatsApp, appointments, report (§15, §16a, §17a)

- **WhatsApp:** `wa.me` link pre-filled with the brief's structured summary, built from the
profile. Pattern exists in `app/lib/events/message.ts`.
- **Appointments (request):** form for online consultation / Dubai office / Istanbul office /
property tour, creating a Bitrix activity. Real calendar sync is Stage 3.
- **Report:** print-styled web report at a tokenised URL, emailed via Resend. Branded PDF is
Stage 2 — this gets the lead magnet live weeks earlier without a rendering dependency on the
critical path.



### 3.9 Languages (§13)

Seven languages already ship. Freeze English wording at week 4 so translation runs in parallel
with weeks 5–8 rather than as a tail. ~200 new keys × 6 languages. `check:i18n` gates the build.

### 3.10 SEO and GEO (§22)

Already largely done — route registry, sitemap with hreflang clusters, JSON-LD, "last verified"
dates. Stage 1 adds: the new programme fields surfaced in the public JSON-LD, and `noindex` on
the Finder results and dynamic comparison so they cannot be read as thin doorway content.

### 3.11 Engineering hygiene (not in the brief, required anyway)

`.github/workflows/check.yml` running `npm run check` on every push. There is currently no
build CI, so the i18n, figures, tables and review gates only run when someone remembers.

### Stage 1 schedule (weeks 2–13 of Workstream A; also the standalone two-month plan if only one developer is available)


| Week | Work                                                                                   |
| ---- | -------------------------------------------------------------------------------------- |
| 1    | Profile type, assessment engine, `check-match.mjs`, CI workflow                        |
| 2    | Finder UI, multi-step state, EN dictionary keys                                        |
| 3    | Results + derived reasons; the seven new `Programme` fields with figure sources        |
| 4    | Dynamic comparison; **EN frozen → translation starts in parallel**                     |
| 5    | Lead capture v2, `Activity` stream, UTM, lead scoring, Bitrix mapping, advisor routing |
| 6    | WhatsApp hand-off, appointment requests, report page + email, analytics events         |
| 7    | Campaign entry points, SEO/JSON-LD, accessibility, RTL                                 |
| 8    | QA, seven locales green, launch                                                        |


---



## Part 4 — Stage 2 · Investment Platform · Workstream B

Covers brief sections 6b, 10, 11, 17b, 18, 20.

### 4.1 Property data model

The brief's §11 asks for 18 comparison criteria. Eight exist (`gyo`, `vatRate`,
`titleDeedTaxRate`, `paymentPlan`, `handover`, `titleDeed`, price, size). Add to the `Property`
model: `developer`, `developerCategory`, `pricePerSqm` (derived), `metroDistanceM`,
`airportDistanceKm`, `rentalEstimate`, `rentalYield` (derived), `resalePotential`,
`deliveryDate` (structured, alongside today's free-text `handover`), `citizenshipEligibility`,
`residencyEligibility`.

Flows through: `prisma/schema.prisma` → `Listing` projection in `app/lib/cms/properties.ts` →
`property-form.tsx` → `listing-page.tsx`. Five well-separated files.

### 4.2 Property investment module (§10)

All 13 filters the brief lists: country, city, district, developer, investment amount,
ready/under-construction, apartment type, citizenship eligibility, residency eligibility,
rental yield, delivery date, payment plan.

Also fixes what exists: today the search filters **entirely client-side with no URL sync, no
sorting and no pagination**, shipping the whole inventory to the browser. Stage 2 moves
filtering server-side with URL-synced state so a filtered search is shareable and bookmarkable.

Personalised shortlists: properties matched to the client's Stage 1 profile — budget,
citizenship eligibility, rental preference.

The five actions: Save, Compare, Request Final Price, Request Video Call, Book Viewing — each
creating a CRM activity against the existing lead.

### 4.3 Property comparison (§11)

Ports `comparisonRows` / `ComparisonValue` / `ProgrammeTable` verbatim from the programme
comparison. **Do not rewrite** — the discriminated union that distinguishes "no requirement"
from "no such route" is already correct and battle-tested.

### 4.4 Admin panel — all 14 entity types (§18)

The brief's requirement: *"We should NOT need a developer every time Türkiye, UAE, Greece or
another jurisdiction changes a program requirement."*

A `ProgrammeRecord` collection overlaying the static list at read time — the exact pattern
`app/lib/cms/` already uses for articles and properties, so the site keeps working with an
empty collection. Admin editors for: countries, programmes, investment thresholds, government
fees, processing periods, family requirements, eligibility rules, properties *(exists)*,
developers, offers, required documents, FAQs, legal updates, advisor profiles.

Every programme-data change records **Updated By, Updated Date, Verified By (legal/compliance)**
— the brief's explicit requirement, and a natural extension of the existing `LegalReview` type.
The `check:review` gate stays: an edit that removes a source still fails the build.

### 4.5 CRM activity timeline (§6b)

The full activity history on the client's CRM profile: every programme viewed, comparison run,
report downloaded, property saved, appointment requested — with last-activity recency driving
follow-up priority.

### 4.6 Branded PDF report (§17b)

Playwright on a Vercel Function rendering the Stage 1 web report to a branded PDF (the 5 GB
function package limit now supports it). Emailed and WhatsApp-shareable, with the brief's 12
sections: client profile, objectives, recommended programme, alternatives, comparison,
investment requirement, timeline, family eligibility, investment options, advantages and
considerations, next steps, assigned advisor.

### 4.7 Automated follow-up (§20)

Day 1 WhatsApp/email, day 3 comparison or educational content, day 7 investment opportunities,
day 14 consultation reminder.

**Under Route A this is configured in Bitrix24, not built.** Bitrix has native automation rules
and we already pay for them; we supply the lead score and the recommended programme, and the
CRM runs the sequence. Building a scheduling engine, sequence templates and suppression logic
inside the website duplicates a system the sales team already uses — about three weeks of work
to end up with two places to change a follow-up message.

The existing hourly cron infrastructure (`app/api/cron/event-reminders/`, `CRON_SECRET`)
remains available if a sequence is ever needed that Bitrix cannot express.

**Suppression is the hard part and the brief calls it out:** once an advisor is in live
conversation, automation must stop. Implemented as a suppression flag driven by CRM activity,
checked before every scheduled send.

---



## Part 5 — Stage 3 · Client Application Portal · Workstream C

Covers brief sections 7, 8, 9, 16b. The largest and most sensitive stage.

### 5.1 Client authentication

`ClientUser` model, separate Auth.js configuration, `app/portal/` root layout (third layout,
following the `app/admin/` precedent). Magic-link or OTP sign-in — clients should not manage
passwords. Strictly separate from staff `User`; no shared role enum.

### 5.2 Client dashboard (§7)

Eight panels, exactly as specified: My Recommended Programmes, My Comparison, My Investment
Options, My Application, My Documents, My Advisor (name, photo, contact), Messages,
Appointments. Reuses `app/components/admin/ui.tsx` for portal chrome.

### 5.3 Application tracker (§8)

`Application` + `ApplicationStage`. The brief's 12 Türkiye stages — property selection,
reservation, bank account, funds transfer, title deed, conformity certificate, residence
permit, citizenship application, biometrics, approval, Turkish ID, passport — modelled as a
configurable stage template per programme, not hardcoded, so UAE and Greece get their own.

States: completed / processing / pending / upcoming. Staff update stages from the admin side;
clients see progress and stop asking on WhatsApp — the brief's stated goal.

### 5.4 Document management (§9)

Document types: passport, marriage certificate, birth certificates, police clearance, proof of
address, bank documents, power of attorney, photographs. Five statuses: received, verified,
correction required, under review, not submitted. Notifications to client and assigned team
member on missing or rejected documents.

**Security requirements, non-negotiable:**

- Private storage (Vercel Blob private or S3 with SSE) — never Cloudinary
- Signed, short-expiry download URLs; no permanent links
- `DocumentAccessLog` row per read: who, what, when, from where
- Role-based access: an advisor sees only their own clients' documents
- Retention policy with scheduled deletion
- Virus scanning on upload
- **A security review before this stage touches a real client's passport**

Multi Mulk operates across Dubai, Istanbul and the EU, so UAE PDPL, Turkish KVKK and GDPR all
apply. A data-protection position should be agreed with legal counsel during month 5, not
after build.

### 5.5 Advisor messaging

`Message` thread per client, visible to the assigned advisor and to management. Email
notification on new message; the thread is the record, not WhatsApp.

### 5.6 Appointments with calendar sync (§16b)

Upgrades Stage 1's request form to real availability: advisor calendars, bookable slots, Dubai
and Istanbul office locations, property tours.

Under Route A (Part 8) this is **configured, not built** — Cal.com or Bitrix's own booking
embedded against advisor calendars, rather than a bespoke two-way Google Calendar integration.
Same capability to the client, roughly two weeks less work.

---



## Part 6 — Stage 4 · Intelligence & Automation · Workstream A, weeks 11–13

Covers brief sections 12, 13b, 21.

### 6.1 AI investment-migration assistant (§12)

**Retrieval-only over the verified fact base.** Answers the brief's example question — *"I have
USD 500,000, live in Dubai with my wife and three children and want a second passport without
relocating"* — by running the Stage 1 matching engine and explaining its output in natural
language.

Constraints, enforced not requested:

- Every factual claim resolves to a `programmes.ts` record and cites its source
- No threshold, fee or eligibility rule may be generated
- Refuses rather than guesses when the fact base says `UNKNOWN`
- Every conversation logged with its citations for compliance review

The existing figures registry is what makes this safe, and it is why this stage is last: the
assistant explains a verified system rather than becoming the system.

### 6.2 Management analytics (§21)

All 17 metrics: visitors, assessment starts, assessment completions, leads, qualified leads,
appointments, conversion rate, sales, average budget, most-searched programmes, most-compared
programmes, lead-producing countries, best campaigns, best advisors, cost per lead, cost per
qualified lead, lead-to-sale conversion.

Fourteen come from data Stages 1–3 already produce. **Three do not:** cost per lead, cost per
qualified lead and campaign spend need advertising spend, which means a Google Ads and Meta
integration or a monthly manual entry. Flagging this now because it is routinely discovered
late.

### 6.3 Advanced personalisation

Recommendations that improve on observed behaviour — which alternatives clients actually pick
over the top match — rather than on the scoring weights alone.

### 6.4 Persian and language completion (§13)

Add `fa` (requested, absent). Promote `tr` and `zh` from `partial` to `published` so they are
advertised in hreflang rather than falling through to English.

---



## Part 7 — The end-to-end client journey (§23)

Every step of the brief's journey, with where it becomes real:


| Journey step                         | Stage                      |
| ------------------------------------ | -------------------------- |
| Social / Google / referral → website | 1 (UTM capture)            |
| Find Your Best Program               | 1                          |
| 8–12 question assessment             | 1                          |
| Personalised results                 | 1                          |
| Compare 2–4 programmes               | 1                          |
| Client details                       | 1                          |
| Personalised report                  | 1 (web) → 2 (PDF)          |
| CRM lead created                     | 1                          |
| Advisor assigned                     | 1                          |
| WhatsApp / call / appointment        | 1 (request) → 3 (calendar) |
| Programme and investment selection   | 2                          |
| Agreement                            | 3                          |
| Client dashboard                     | 3                          |
| Document collection                  | 3                          |
| Investment / property purchase       | 2 + 3                      |
| Application tracking                 | 3                          |
| Residency / citizenship              | 3                          |
| After-sales services                 | 3 + 4                      |


Nothing in the journey is unowned.

---



## Part 8 — Delivering under three months (§24)

**Target: all 25 sections live within 13 weeks.** This is reachable. What follows is what it
actually requires.

### Correcting an earlier assumption

An earlier draft of this plan claimed a four-month floor on the grounds that every stage
depends on Stage 1's client profile. That was wrong: the profile is a type definition — two
days' work, not two months. Once it is agreed in week 1, the stages are largely independent.

The real critical path is the client portal: authentication must land before the dashboard,
tracker, documents and messaging can be built on top of it, and the security review gates the
document system's launch. That path is **10–11 weeks**, which fits inside 13.

### The actual constraint is not the calendar

**This codebase has no automated tests and no build CI.** Today the `npm run check` gate
(typecheck, lint, i18n, figures, tables, review, redirects) runs only when someone remembers.

One developer can work safely that way. Four or five developers landing on an untested
codebase simultaneously cannot — that is how a three-month plan becomes a five-month plan with
a broken site in the middle. **Week 1 is the safety net, for the whole team, before feature
work starts.** It is the highest-leverage week in this plan and the easiest one to skip.

### Two routes to under three months

Both work. They trade people against scope.

**Route A — three developers, and configure what we already pay for.** Recommended.

Several sections do not need building at all. Bitrix24 has native automation, scoring fields
and reporting; we are paying for them today:

| Brief | Instead of building | Configure |
|---|---|---|
| §20 automated follow-up | A scheduling engine, sequences, suppression logic | Bitrix automation rules, driven by the lead score we compute (~3 weeks saved) |
| §19 lead scoring | Storage and routing | We compute HOT/WARM/NURTURE; Bitrix stores it and routes on it (~1 week saved) |
| §21 analytics, partial | A full management dashboard | Bitrix reports + GA4 for 14 of the 17 metrics; build only the 3 they cannot answer (~3 weeks saved) |
| §16b calendar sync | Two-way Google Calendar integration | Cal.com or Bitrix's own booking, embedded (~2 weeks saved) |

That is roughly **9 dev-weeks removed from the build** without removing anything from the
brief — the capability still exists, we simply stop rebuilding a CRM inside our website.

Remaining ~7 dev-months across 3 developers over 12 weeks fits, with the client portal on the
critical path.

**Route B — five to six developers, build everything in-house.** Also fits 13 weeks, but the
quality risk rises sharply on a codebase with no test suite, and coordination overhead is real.
Choose this only if there is a reason to own the follow-up and analytics logic rather than
configure it.

### Route A — the 13-week schedule

**Week 1 · whole team, together.** The safety net and the contracts. Test harness + CI
(`.github/workflows/check.yml`), the `ClientProfile` type, the full data model for all four
stages, and the API boundaries between workstreams. Nothing after this week requires
cross-team negotiation, which is what makes the parallelism work.

**Weeks 2–13 · three parallel workstreams.**

| | Developer A — Acquisition | Developer B — Investment + Admin | Developer C — Client Portal |
|---|---|---|---|
| 2–4 | Assessment engine, `check-match.mjs`, Finder UI | Property data model, the 11 new fields | Client auth, `app/portal/` layout, dashboard shell |
| 5–7 | Results, recommendation, dynamic comparison, 7 new `Programme` fields | Property search server-side + URL sync, personalised shortlists | Application tracker, stage templates per programme |
| 8–10 | Lead capture v2, `Activity` stream, UTM, Bitrix mapping, advisor routing | Property comparison, favourites, admin panel (14 entity types) | Documents: private storage, signed URLs, access log, retention |
| 11–13 | WhatsApp, appointments, report, campaign entry points | Branded PDF, Bitrix automation configuration | Messaging, notifications, **security review**, remediation |

**AI assistant (§12)** — Developer A picks it up from week 11, once the matching engine and
`Activity` stream are stable. It explains a finished system rather than becoming one.

**Translation** — English frozen at week 6 across all three workstreams; six languages
delivered weeks 7–12, verified week 13.

**Security review** — booked in week 1 for week 12. External testers do not have next-week
availability, and §9 cannot launch without it.

### What has to be true for 13 weeks to hold

1. Week 1 is spent on tests and CI, not features. This is the one that gets skipped.
2. All nine business dependencies in Part 9 land on schedule — every one of them now sits on
   the critical path, where in a nine-month plan they had slack.
3. The security review is booked in week 1.
4. Scope is frozen at week 1. At this compression there is no absorption capacity; one added
   section pushes the date.
5. Three developers who can work in this codebase — it has strong conventions (no zod,
   `UNKNOWN` sentinels, errors as keys, CMS overlay pattern) that a new developer needs about
   a week to absorb. Budget it.

### Honest risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Business data (dependencies 1, 2, 6) arrives late | **High** | Start today, before week 1. Dependency 6 is weeks of research. |
| Security review finds issues needing rework | Medium | Book week 12, leave week 13 for remediation. Do not book it for week 13. |
| Untested codebase + parallel teams causes regressions | Medium | Week 1 test harness. Non-negotiable. |
| Translation slips | Medium | Freeze English at week 6; book translators in week 1. |
| Scope grows | **High** | Freeze at week 1 and hold it. |

Two of the five are High, and both are business-side rather than engineering. That is where
this plan will actually be won or lost.

### If only one developer is available

Under three months is not reachable — the arithmetic is roughly 9 dev-months of work. Route A's
configure-don't-build decisions bring it to about 7, which is still 7 months for one person.

In that case the honest choice is **Stage 1 complete in two months** — the full acquisition
engine, in seven languages, and the only stage that generates revenue on its own — then
sequence the rest as leads fund it.

---

## Part 9 — Business dependencies

Not code. In a 13-week schedule **every one of these is on the critical path** — in a
nine-month plan they had slack, and they no longer do. Items 1, 2 and 6 should start before
week 1.


| #   | What                                                                                         | From whom          | Needed by                     | Blocks                                                                                            |
| --- | -------------------------------------------------------------------------------------------- | ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Sourced values for the seven new comparison fields, all 11 programmes                        | Advisory team      | **Week 3**              | `check:figures` refuses to publish unsourced numbers — this can stop a finished Finder going live |
| 2   | Named legal reviewer per programme (all 11 currently say "advisory-team")                    | Legal / compliance | **Week 4**              | Recommending a programme raises the stakes on every figure                                        |
| 3   | Bitrix24 `UF_CRM_*` fields: budget, family size, lead score, recommended programme, advisor  | CRM administrator  | **Week 5**              | Otherwise the data lands as unfilterable free text                                                |
| 4   | Advisor roster — names, photos, languages, offices                                           | Sales management   | **Week 5**              | Language-based routing, §7 dashboard                                                              |
| 5   | Translation capacity, ~200 keys × 6 languages                                                | Translators        | **Booked wk 1, working wk 7** | Seven-language launch                                                                             |
| 6   | Property investment data — developer profiles, rental estimates, distances for every listing | Sales / research   | **Week 2** (research starts now)             | §11 comparison. Likely the long pole of Stage 2 — data entry, not code                            |
| 7   | Data-protection position for client documents (UAE PDPL, KVKK, GDPR)                         | Legal counsel      | **Week 6** (before documents are built)           | §9 cannot launch without it                                                                       |
| 8   | Advertising spend feed or monthly entry                                                      | Marketing          | **Week 10**                   | 3 of the 17 §21 metrics                                                                           |
| 9   | Application stage templates per programme                                                    | Operations         | **Week 5**                   | §8 tracker beyond Türkiye                                                                         |


---



## Part 10 — Verification

**Stage 1** — `npm run check` green (typecheck, lint, i18n, figures, tables, review, redirects,
match). `npm run check:bitrix` confirms a test lead arrives with all new fields populated. Walk
the Finder for three profiles; the recommendation matches the `check-match.mjs` fixture each
time. Confirm results and dynamic comparison return `noindex` and are absent from
`/sitemap.xml`. Confirm the locale gate falls through cleanly at `/ar/…`. Lighthouse the entry
page on mobile — it is a paid-campaign landing target.

**Stage 2** — A programme threshold edited in the admin panel changes every comparison table and
the cost calculator, in all seven languages, without a deploy. Filtered property search is
shareable by URL. Follow-up suppression: a lead with advisor activity receives no scheduled send.

**Week 5** — Penetration test before launch. Verify a client cannot read another client's
documents by ID; that download URLs expire; that every read produces an access-log row; that an
advisor sees only assigned clients. Confirm retention deletion runs.

**Week 10** — Adversarial testing of the AI: confirm it refuses to state a threshold absent from
the fact base, cites a source for every factual claim, and says "I don't know" where the record
says `UNKNOWN`.