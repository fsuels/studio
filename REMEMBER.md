# Remember.md

## Decisions
- 2025-09-19T10:15:00Z - Reset executive backlog to pod-based structure with shared guardrails
- 2025-09-19T10:15:00Z - Mandated pod Start.MD prompts and memory.json schema across TEAM directory

## Baselines & KPIs
- CWV: { "lcp_ms": null, "inp_ms": null, "cls": null }
- Accessibility: { "axe_serious": null, "axe_critical": null }
- SEO: { "canonical_coverage_pct": 0, "hreflang_coverage_pct": 0, "jsonld_coverage_pct": 0 }
- Payments: { "payment_success_rate_pct": null, "mrr_usd": 0, "refund_rate_pct": null }
- Customer: { "wizard_to_purchase_pct": null, "aov_usd": null, "nps": null }

## Backlog (stable-sorted)
- [ ] (Platform) Deploy end-to-end security header stack with CSP report-only telemetry (impact 5, urgency 4, cost 2)
- [ ] (Document Intelligence) Close outstanding schema/question TODOs and Spanish metadata gaps (impact 5, urgency 4, cost 3)
- [ ] (Growth) Expand canonical, hreflang, and structured data coverage to all marketing routes (impact 4, urgency 3, cost 2)
- [ ] (Payments) Replace mocked Stripe flows with production client/server/webhooks and reconciliation (impact 5, urgency 5, cost 3)
- [ ] (Compliance) Publish disclaimers, ToS, privacy, and refund policies with release-train gate (impact 5, urgency 5, cost 2)
- [ ] (AI) Deliver bilingual evaluation harness and guardrail telemetry for intake assistant (impact 4, urgency 4, cost 3)

## Pod Status Snapshots
### Platform Engineering
- last_cycle: reset
- risks: security headers partially deployed; telemetry not centralized
- focus_next: audit SSR/SSG gaps, lighthouse budgets, incident playbook draft

### Document Intelligence
- last_cycle: reset
- risks: missing schemas/questions for several templates; Spanish metadata incomplete
- focus_next: run verify-templates, regenerate contracts inventory, backfill translations

### AI & Automation
- last_cycle: reset
- risks: no automated evaluation harness; guardrail coverage unclear
- focus_next: inventory Genkit pipelines, design refusal taxonomy, seed bilingual test set

### Compliance & Legal Ops
- last_cycle: reset
- risks: public policies not published; jurisdiction knowledge base untracked
- focus_next: compile policy drafts, build release gate checklist, set legal update cadence

### Growth & Customer Learning
- last_cycle: reset
- risks: marketing routes missing canonical/hreflang; funnel metrics unverified
- focus_next: audit current pages, define analytics QA, plan localization messaging

### Payments & Monetization
- last_cycle: reset
- risks: Stripe integration mocked; no reporting pipeline
- focus_next: map required endpoints, design webhook handling, draft refund/dispute SOP

### CEO
- last_cycle: reset
- risks: cross-pod dependencies undefined; metrics baseline empty
- focus_next: gather pod audits, prioritize backlog, set cycle ownership rotation

## Inventory
### Pages (production parity target)
- [ ] /en (homepage)
- [ ] /[locale]/pricing
- [ ] /[locale]/faq
- [ ] /[locale]/features
- [ ] /[locale]/templates
- [ ] /[locale]/blog/*
- [ ] /[locale]/support

### Templates
- [ ] src/lib/documents (U.S. catalog) - parity status pending audit
- [ ] contracts/* - markdown inventory parity pending audit

### Policies & Artifacts
- [ ] Disclaimers (pending)
- [ ] Terms of Service (pending)
- [ ] Privacy Notice (pending)
- [ ] Refund Policy (pending)

## Pending Cross-Pod Tasks
- (Platform -> Compliance) Validate security header rollout plan against legal requirements
- (Payments -> Compliance) Align refund wording and dispute timelines before launch
- (Growth -> Document Intelligence) Sync template highlights for marketing copy accuracy

## Resume Cursor
lead_pod: Platform-Engineering
primary_focus: security headers audit and telemetry hardening
