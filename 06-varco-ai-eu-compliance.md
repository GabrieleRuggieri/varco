# Varco — AI Compliance Copilot for Selling into the EU

## One-liner

Varco turns EU product regulations (GPSR, EPR, labeling, PPWR) from 27 countries of legal text into a per-SKU checklist with auto-generated documents — so small brands can sell across Europe without a €5,000 consultant per market.

## Contents

1. [Core problem solved](#core-problem-solved)
2. [Why now](#why-now)
3. [Target user](#target-user)
4. [Market size](#market-size)
5. [Key features](#key-features)
6. [How it works — MVP and architecture](#how-it-works--mvp-and-architecture)
7. [Competition and positioning](#competition-and-positioning)
8. [Pricing model](#pricing-model)
9. [Unit economics](#unit-economics)
10. [Why they keep subscribing](#why-they-keep-subscribing)
11. [Go-to-market — first 100 customers](#go-to-market--first-100-customers)
12. [Validation plan](#validation-plan)
13. [12-month roadmap](#12-month-roadmap)
14. [KPIs to watch](#kpis-to-watch)
15. [Biggest risk](#biggest-risk)
16. [Glossary](#glossary)

## Core problem solved

In December 2024, GPSR came into force and thousands of US, UK, and Asian small sellers simply geo-blocked the EU — not because they couldn't comply, but because nobody could tell them *what compliance meant for their products*. Every product placed on the EU market needs a Responsible Person, a technical file and risk assessment, conformity documentation, compliant labeling, and per-country packaging EPR registration (LUCID in Germany, Citeo in France, CONAI in Italy — each with its own portal, fees, and deadlines). PPWR adds a new wave of obligations from August 2026, with more phases in 2028 and 2030. Obligations are per-country, per-category, and constantly changing. The current options are €2–5k consultants per market, fragmented single-obligation services, or abandoning the market entirely. Every geo-blocked checkout is revenue surrendered to compliance paperwork.

## Why now

- **GPSR created the panic moment** — in force since December 13, 2024, it pushed thousands of UK/US sellers out of the EU: Etsy even shipped a shop-level opt-out for the entire EEA, and UK press documents sellers losing a third of their revenue. The pain is acute, recognized, and actively searched for on Google.
- **PPWR is the next wave, already scheduled** — it applies from August 2026, with further phases in 2028 and 2030: every deadline is a predictable demand spike to build the funnel on.
- **Amazon left a vacuum** — it shut down its own "EPR Services on Amazon" program at the end of 2024, pushing sellers toward third-party providers exactly as obligations increased.
- **LLMs make the problem tractable** — classifying thousands of SKUs against multi-country obligation matrices and drafting file skeletons was economically impossible to automate before; now it's an AI orchestration + expert review problem.
- **Incumbents are looking elsewhere** — Avalara and the big TIC firms own tax and enterprise certification; existing EPR services are single-obligation. Nobody owns the end-to-end layer for the small seller.

## Target user

D2C brands and marketplace sellers (Shopify, Amazon, Etsy) with 10–500 SKUs and €100k–10M revenue, selling — or wanting to sell — cross-border into or within the EU: toys, cosmetics, electronics accessories, apparel, home goods. The buyer is the founder or ops manager who got an Amazon suppression email and has no in-house legal. Secondary: e-commerce agencies and aggregators managing compliance for many brands at once.

## Market size

| Level | Estimate | Reasoning |
|---|---|---|
| TAM | €0.5–1.5B/year | 500k–1M sellers with multi-country product compliance obligations into/within the EU × €1–3k/year (currently spent on consultants, fragmented services, or surrendered revenue) |
| SAM | €150–300M/year | 100–150k sellers in the 10–500 SKU segment across the first 5 categories and languages (EN, IT, DE) |
| SOM at 3 years | €4–7M ARR | 1,500–3,000 paying customers + take-rate on brokered services |

Market anchors:

- GPSR impact is documented: small-business webinars with 1,000+ attendees, compliance costs estimated at >£5,000/year for a single SME (UK press, 2025), mass EEA opt-outs on Etsy
- ecosistant (EPR only) already serves 5,000+ sellers; AVASK manages thousands of Amazon sellers on VAT/EPR — demand for compliance-as-a-service is proven
- The price benchmark exists: a consultant costs €2–5k for one market, one time — more than a year of the Growth plan

Sources: Etsy Seller Handbook (GPSR), UK press (Telegraph, ChannelX/ecommercenews, 2025), ecosistant/AVASK/Lizenzero public sites.

## Key features

- **Catalog scan → obligation map** — connect Shopify/Amazon; AI classifies every SKU by category, materials, and target markets, and produces the exact per-country obligation list with severity and deadlines. From "27 countries of legalese" to "your 14 action items"
- **Compliance file builder** — AI drafts risk assessments, technical-file skeletons, declarations of conformity, and required label elements (warnings, RP address, Triman/sorting symbols) per SKU; flags missing supplier documents and chases them with automated requests
- **Responsible Person + EPR registrations, brokered** — appoint the EU Responsible Person and register with national packaging/WEEE schemes through integrated partners, from one dashboard instead of 27 portals
- **Regulation radar** — monitors EU and national rule changes (PPWR phases, category-specific rules), translates legalese into plain language, and tells each seller what changed *for their SKUs* and what to do about it
- **Marketplace shield** — keeps Amazon/Etsy compliance attributes synced so listings don't get suppressed; alerts before a missing data point triggers a 48-hour takedown

## How it works — MVP and architecture

**What gets built first (v1, 4–5 months; the team needs a regulatory lead from day 1, not just developers):**

1. **Catalog connector** — import from Shopify/Amazon: titles, descriptions, materials, images, target markets
2. **SKU classification** — an LLM maps each SKU onto an **expert-curated obligation matrix**; the AI classifies and drafts, but the regulatory determination lives in the verified matrix, never in the model's free-form output
3. **Per-country checklist** — obligations with severity, deadlines, and status; initial coverage: **5 categories × 5 countries** (toys, apparel, electronics accessories, cosmetics, home × DE, FR, IT, ES, NL) — not 27 countries at launch
4. **GPSR document generator** — risk assessment, technical-file skeleton, DoC, label elements; human-reviewed templates per category
5. **RP and EPR via partners** — Responsible Person appointment and scheme registrations through 1–2 integrated partners (broker it, don't build it)

**Deferred:** marketplace shield (attribute sync), full 27-country radar, WEEE/batteries, API and agency workspace.

**The moat is operational:** the obligation matrix kept correct over time. It's regulatory-analyst work, expensive to replicate, and exactly what no pure AI player will want to do.

## Competition and positioning

| Competitor | What it does | Why it's not enough |
|---|---|---|
| Consultants and TIC firms (SGS, TÜV, Intertek) | Bespoke compliance, certification | €2–5k per market, per project; doesn't scale across catalogs or continuous monitoring |
| AVASK | VAT + EPR + RP for Amazon sellers | Service-heavy and tax-led: no per-SKU automation, no self-serve product |
| ecosistant (5k+ sellers), Lizenzero | EPR registrations and filings | Single-obligation: no GPSR, files, labels, or regulatory monitoring |
| ProductIP | Technical file platform | Document-centric and pre-AI: per-file pricing, built for structured importers |
| Obelis and various Authorised Reps | Responsible Person only | One obligation, manual processes |
| Native marketplace tools (Amazon Compliance) | Minimal attribute collection | Amazon-only, reactive, no multi-channel or EPR support |

**Positioning:** the only end-to-end seller-facing layer — AI classification → documents → brokered registrations → continuous monitoring — at SMB pricing. Competitors each solve one obligation; the seller has fourteen.

## Pricing model

| Tier | Price | Includes |
|---|---|---|
| Starter | €79/month | Up to 50 SKUs, 3 countries, obligation map, document generator, regulation radar |
| Growth | €199/month | 250 SKUs, all 27 EU countries, marketplace sync, supplier doc chasing, EPR filing calendar, brokered RP/registrations |
| Scale | €499/month | 1,000+ SKUs, multi-brand workspace, API, agency seats, priority compliance review |

Anchor against the alternative: one consultant, one market, one time costs more than a year of Growth. Brokered services (Responsible Person, PRO registrations) are billed at cost-plus, making Varco a SaaS with an embedded services take-rate.

## Unit economics

| Item | Estimate |
|---|---|
| AI COGS | negligible: <€1 per SKU at onboarding (classification + drafting) |
| The real COGS: knowledge ops | 2 regulatory analysts (~€10–12k/month) maintain the matrix for *all* customers: a fixed cost that dilutes with scale |
| Gross margin | ~70% early → 85–90% at scale (the matrix cost doesn't grow with customers) |
| Brokered services | cost + 20–30% take-rate (RP, scheme registrations) |
| Expected CAC | €200–400 (panic-driven SEO + communities + partners); payback <4 months on the Growth plan |
| Target NRR | 110–120% (more SKUs, more countries, more services over time) |

The structure is a vertical SaaS with embedded services: software scales, analysts guard correctness, partners deliver the physical filings.

## Why they keep subscribing

Compliance is structurally a subscription: new SKUs every month, new markets every quarter, annual EPR declarations and fee filings, PPWR phases landing in 2026, 2028, and 2030, and rules that never stop changing. The lock-in is brutal and legitimate: GPSR requires technical documentation to be retained for 10 years, and that audit trail lives in Varco — leaving means losing your compliance archive. Listings stay hostage too: switch off the sync and marketplace suppressions resume. Revenue expands with the customer (more SKUs, more markets), and the brokered services (RP appointment, PRO registrations) add a take-rate on top of SaaS.

## Go-to-market — first 100 customers

**Beachhead:** UK/US sellers who geo-blocked the EU after GPSR (pain already detonated, they self-identify in forums) + EU sellers who received marketplace suppression emails.

1. **Deadline SEO** — "GPSR checklist", "PPWR requirements 2026", "LUCID registration guide": high-intent queries generated by regulatory panic; every scheduled deadline is a predictable traffic spike
2. **Seller communities** — r/AmazonSellers, r/Etsy, UK/US Facebook groups, post-GPSR forums full of sellers who stopped shipping to the EU: show up with a solved real case
3. **"Free scanner" lead magnet** — connect your catalog, get 1 SKU analyzed for free with its obligation map: immediate value demonstration
4. **Partnerships** — e-commerce accountants, Amazon agencies, freight forwarders/3PLs, and aggregators: those already serving cross-border sellers bring qualified leads for a revenue share
5. **Webinars with trade associations** — the format sellers already use to understand GPSR (the 1,000+ attendee webinars already exist: better to be the speaker)

**Sequence:** land on Starter with a single pain (the suppression email) → expand to Growth as countries are added. First 100: ~30 from geo-blocked seller forums, ~30 from SEO/content, ~40 from partners.

## Validation plan

Before building the platform (6–8 weeks):

1. **30 interviews** with geo-blocked or suspended sellers (recruited in Etsy/Amazon forums): what stopped them, what they tried, what they'd pay
2. **Concierge with 5 brands** — take 5 real brands to GPSR+EPR compliance for Germany and France *by hand*: validates the obligation matrix, measures hours per SKU, tests the RP/scheme partner economics
3. **Per-category landing pages with deposit** — "GPSR for toy sellers", waitlist with a €99 deposit: measures conversion per category and picks the first vertical
4. **Legal review of the perimeter** — *before* launch: framing as "document preparation and verified data", never "legal advice"; disclaimers and liability boundaries approved by a lawyer

**Go/no-go criteria:** 10 paying concierge clients at ≥€1,500/year equivalent; DE+FR matrix completed and validated by an external expert; partner economics sustainable (≥20% margin on brokerage).

## 12-month roadmap

| Phase | Months | Goal |
|---|---|---|
| Validation | 1–2 | Interviews, 5-brand concierge, RP/EPR partner agreement, regulatory lead hired |
| MVP build | 3–6 | Catalog connector, 5-category × 5-country matrix, document generator, checklist; closed beta with 20 brands |
| Public launch | 7 | Anchored to the PPWR deadline (August 2026): the panic spike is the moment of maximum demand |
| Expansion | 8–12 | From 5 to 12 countries, Amazon attribute sync, EPR calendar, agency workspace; target 300 paying customers |

## KPIs to watch

- **Activation:** % of trials connecting a catalog and receiving the obligation map (target >70%); time to "ready for market X"
- **Value:** % of checklists completed within 30 days; marketplace suppressions prevented/resolved (the number to tell in case studies)
- **Matrix quality:** error rate found in quarterly per-country audits (the existential KPI: must trend to zero)
- **Monetization:** brokered services attach rate (target >40% of Growth customers); NRR ≥110%
- **Growth:** CAC payback <4 months; pipeline generated by regulatory spikes (PPWR 2026 → 2028)

## Biggest risk

**Liability and accuracy.** A wrong "you're compliant" can mean seized goods and fines, so the product must ship as document preparation and verified data — human-reviewed templates per category, explicit scope boundaries, never "legal advice" — because one famous failure kills the brand in seller communities. Right behind it: keeping the obligation knowledge base correct across 27 countries is an operational grind you must fund before revenue (it is also the moat), and Avalara or the marketplaces themselves could decide to own this layer — the window is the gap between GPSR panic and incumbent attention.

## Glossary

- **GPSR** — General Product Safety Regulation: EU product safety regulation, in force since December 2024
- **EPR** — Extended Producer Responsibility: the per-country obligation to register and contribute to packaging/product disposal
- **PPWR** — Packaging and Packaging Waste Regulation: EU packaging regulation, applies from August 2026
- **RP (Responsible Person)** — EU-established party responsible for product compliance
- **DoC** — Declaration of Conformity; **WEEE** — waste electrical and electronic equipment
- **SKU** — a single catalog item; **D2C** — direct-to-consumer
- **TIC** — Testing, Inspection & Certification (SGS, TÜV, Intertek…)
- **Take-rate** — percentage retained on brokered services
- **ARR / CAC / NRR / COGS / churn** — standard SaaS metrics: recurring revenue, acquisition cost, net revenue retention, direct costs, cancellation rate
- **TAM / SAM / SOM** — total / serviceable / realistically obtainable market within 3 years
