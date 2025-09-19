# KPI Instrumentation Blueprint - ceo-cycle-0001
compiled_at: 2025-09-19T16:09:03.3536270Z

## Executive Context
- All north-star KPIs in Remember.md remain null because telemetry, analytics, and payment reporting are not wired to durable storage.
- Recent pod work (growth-cycle-0002, document-intel-cycle-0003, platform-cycle-0004/0006, compliance-cycle-0004, ai-automation-cycle-0001) surfaced instrumentation blockers across Platform, Growth, Payments, and Compliance pods.
- This blueprint sequences the minimum viable instrumentation to unblock KPI reporting before the next executive review window.

## Summary Timeline
| Week | Focus | Deliverables | Owning Pod(s) | Dependencies |
|------|-------|--------------|---------------|--------------|
| Week 1 (by 2025-09-26) | Foundation | 1) GA4/warehouse event ingestion for signwell_cta_click & signwell_disclaimer_view.<br>2) Lighthouse CI + axe automated runs on staging builds.<br>3) Stripe dashboard data model approved. | Platform, Growth, Payments | Platform security header refactor (platform backlog), Compliance policy links, Payments audit findings |
| Week 2 (by 2025-10-03) | KPI Dashboards | 1) CWV & Accessibility dashboards in Looker/Metabase fed by CI artifacts.<br>2) SEO coverage report (canonical/hreflang/jsonld) auto-generated post-build.<br>3) Payments success/refund metrics sourced from Stripe webhooks. | Platform, Growth, Compliance, Payments | Week 1 ingestion, compliance policy publication, webhook infra |
| Week 3 (by 2025-10-10) | Customer Journey | 1) Wizard funnel metrics replaced with GA4/warehouse data (remove mock analytics).<br>2) Customer outcome dashboard (wizard->purchase, AOV, NPS placeholders) populated from telemetry + Stripe.<br>3) KPI weekly executive roll-up automated via scheduled notebook. | Growth, Platform, Payments, Compliance | Full ingestion + dashboards, incident telemetry for CSP |

## Metric Playbooks

### Core Web Vitals (CWV)
- **Current state:** Remember.md records null CWV metrics. No automated Lighthouse/PSI integration.
- **Owner:** Platform Engineering (aligns to security/observability charter).
- **Plan:**
  1. Add Lighthouse CI step to existing Vercel Preview pipeline with lighthouse-batch artifact stored under ops/artifacts/platform-cycle-*.
  2. Pipe results to BigQuery (or temporary Firestore collection) with p75 extraction per locale. (Dependency on Platform backlog: consolidate middleware + finalize security headers for accurate perf baselines.)
  3. Share weekly roll-up with CEO pod; surface p75 LCP/INP/CLS in KPI dashboard.
- **Dependencies:** Production-like test pages (Document Intelligence ensures localized templates); Growth ensures marketing routes measured; Compliance ensures policies don't block caching.

### Accessibility (axe serious/critical)
- **Current state:** No automated axe-core validation; manual spot checks only.
- **Owner:** Platform (execution) + Compliance (policy acceptance criteria).
- **Plan:**
  1. Integrate @axe-core/cli or Playwright axe audit into CI, exporting results to ops/artifacts/platform-cycle-<id>/axe-report.json.
  2. Block release trains if serious/critical issues detected; escalate to Compliance for sign-off. (Maps to Compliance backlog: operationalize release gate with evidence.)
  3. Track trendline weekly in KPI roll-up.

### SEO Coverage (canonical, hreflang, JSON-LD)
- **Current state:** SignWell route instrumented (growth-cycle-0001/0002), but site-wide coverage unknown.
- **Owner:** Growth & Platform (rendering + static analysis).
- **Plan:**
  1. Build sitemap/structured data analyzer script to scan src/app/[locale]/(marketing) and docs/ pages; emit coverage report to ops/artifacts/growth-cycle-*.
  2. Automate weekly run triggered by content deploy; dashboard coverage percentages feed Remember.md.
  3. Ensure Compliance reviews disclaimers for each locale before marking coverage complete.

### Payments Success / Refund Rate / MRR
- **Current state:** Stripe flows still mocked; no telemetry or reconciliation (payments-cycle-0001 audit).
- **Owner:** Payments & Monetization pod with Compliance oversight.
- **Plan:**
  1. Replace mock PaymentModal logic (src/components/shared/PaymentModal.tsx) with production Stripe Checkout integration; persist sessions in Firestore.
  2. Implement webhook handler to log successful payments, refunds, disputes into BigQuery/Firestore collections (ops/artifacts/payments-cycle-*).
  3. Create reconciliation job to compute payment_success_rate, refund_rate, and MRR weekly.
  4. Compliance to verify refund policy disclosures align with telemetry outputs (maps to Compliance backlog).

### Customer Journey (Wizard ? Purchase %, AOV, NPS)
- **Current state:** Funnel API uses mock/localStorage metrics; no GA4 ingestion; NPS pipeline absent.
- **Owner:** Growth (analytics), Platform (ingestion), Payments (revenue data), Compliance (messaging guardrails).
- **Plan:**
  1. Platform to pipe signwell_cta_click, signwell_disclaimer_view, and future funnel events into GA4/BigQuery; deprecate mock data in src/app/api/analytics/funnel/route.ts.
  2. Growth to define event taxonomy covering wizard steps, checkout start/complete, support interactions.
  3. Payments to supply order totals to compute AOV; Growth to integrate NPS survey tooling (post-delivery email or in-product prompt) with anonymized storage.
  4. CEO pod to receive weekly wizard_to_purchase_pct, ov_usd, 
ps updates once telemetry live.

### Compliance & Policy Telemetry
- **Current state:** Policy markdowns published (compliance-cycle-0004) but not linked or acknowledged in product flows; incident roster captured yet not integrated with Platform SRE.
- **Owner:** Compliance (policy) + Platform (enforcement) + Growth/Payments (surface copy).
- **Plan:**
  1. Platform to embed policy acknowledgment tracking (e.g., policy_acceptance events) in onboarding and checkout.
  2. Compliance to maintain incident log & roster via Ops automation; Platform SRE to pull contacts into on-call tooling (OpsGenie/PagerDuty placeholder) and log archive reminders.
  3. Weekly compliance checkpoint verifying disclaimers appear in GA4 via signwell_disclaimer_view analog across other routes.

## Deliverable Mapping to Backlog
- **Platform backlog** (“Deploy end-to-end security header stack…”) remains priority but must now include CWV/Axe instrumentation tasks described above.
- **Document Intelligence backlog** (“Backfill overlay… Spanish metadata gaps”) is prerequisite for accurate CWV/SEO telemetry due to localized content coverage.
- **Growth backlog** (“Expand canonical/hreflang…”) aligns with SEO coverage script and GA4 ingestion responsibilities.
- **Payments backlog** (“Replace mocked Stripe flows…”) directly powers payments KPIs.
- **Compliance backlog** (“Publish disclaimers… release-train gate”) extends to policy telemetry & incident automation.
- **AI backlog** (“Deliver bilingual evaluation harness…”) stays blocked on Platform replacing public OpenAI keys; not directly in KPI scope but called out for compliance risk visibility.

## Execution Cadence & Reporting
1. **Daily standup updates**: pod leads report instrumentation progress in executive channel with links to artifacts.
2. **Weekly KPI deck (Fridays)**: CEO pod compiles metrics from dashboards; if metrics missing, include blocker rationale referencing this plan.
3. **Artifact storage**: every instrumentation run must land under ops/artifacts/<pod>-cycle-xxxx/ with checksum entries for audit parity.

## Risk Log
- Missing GA4/property access could delay Growth deliverables; request provisioning by 2025-09-22.
- Stripe production keys & PCI checklist pending; Payments must coordinate with Compliance before live transactions.
- AI guardrail gaps remain a compliance blocker; Platform’s key management task is prerequisite for safe KPI reporting involving AI-assisted flows.

## Next Actions (Owners)
- **Platform (Maya Chen)**: deliver GA4 ingestion + Lighthouse/axe pipelines; provide webhook staging URL for CSP and analytics by 2025-09-26.
- **Growth (Sara Thompson)**: finalize event taxonomy, extend analytics blueprint to remaining marketing routes, and partner with Platform on dashboard schema.
- **Payments (Victor Adeyemi)**: produce Stripe integration plan (client, server, webhook) with milestone dates and required secrets inventory by 2025-09-26.
- **Compliance (Jordan Ellis)**: circulate Spanish policy localization schedule and tie release gate checklist to telemetry evidence uploads.
- **CEO Pod**: validate artifact delivery each Friday; update Remember.md decisions and cross-pod tasks accordingly.