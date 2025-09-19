# Remember.md

## Decisions
- 2025-09-19T15:32:30Z - Cleared schema/question backlog for prenuptial, service, and quitclaim agreements; catalog audit shows zero outstanding TODOs (ops/artifacts/document-intel-cycle-0002/catalog-audit.json)
- 2025-09-19T15:31:59.0453124Z - Persisted CSP violation telemetry to Firestore with audit logging (artifact ops/artifacts/platform-cycle-0002/csp-telemetry.md)
- 2025-09-19T15:30:12.9341861Z - Completed Growth audit and shipped SignWell canonical/hreflang coverage (ops/artifacts/growth-cycle-0001/seo-signwell-report.md)
- 2025-09-19T15:25:00Z - Published compliance release gate checklist and legal incident log templates (ops/compliance/*)
- 2025-09-19T15:09:00Z - Enabled report-only security header pipeline with CSP telemetry endpoint (pending storage wiring)
- 2025-09-19T14:59:47Z - Logged compliance baseline audit; policy stack gaps and release gate deficiencies captured (ops/artifacts/compliance-cycle-0001/compliance-audit.md)
- 2025-09-19T15:06:00Z - Document Intelligence baseline catalog audit logged (artifact ops/artifacts/document-intel-cycle-0001/catalog-audit.json)
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
- last_cycle: platform-cycle-0002
- risks: CSP telemetry stored but lacks automated alerting; middleware duplication still risks drift; incident playbook missing
- focus_next: wire CSP alerts/metrics, consolidate middleware configs, draft incident communication playbook

### Document Intelligence
- last_cycle: document-intel-cycle-0002
- risks: 19 Spanish metadata TODOs remain; overlay field maps incomplete; placeholder registry still limited to 4 templates
- focus_next: localize flagged metadata, backfill overlay field maps, expand placeholder registry, coordinate compliance review of new flows

### AI & Automation
- last_cycle: reset
- risks: no automated evaluation harness; guardrail coverage unclear
- focus_next: inventory Genkit pipelines, design refusal taxonomy, seed bilingual test set

### Compliance & Legal Ops
- last_cycle: compliance-cycle-0002
- risks: Public policy stack still placeholders; release gate checklist adoption pending; incident log contacts unassigned; jurisdiction tracker limited to CA
- focus_next: Draft bilingual policies, operationalize release gate checklist with weekly sign-offs, populate incident log contacts, expand state knowledge base

### Growth & Customer Learning
- last_cycle: growth-cycle-0001
- risks: Funnel API still emits mock/localStorage metrics; translations rely on per-page helpers; marketing analytics events inactive
- focus_next: Partner with Platform on production telemetry, stand up translation catalogs, prep bilingual pricing/trust experiments

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
- (Platform -> Compliance) Align CSP violation escalation and response policy using new Firestore telemetry
- (Payments -> Compliance) Align refund wording and dispute timelines before launch
- (Growth -> Document Intelligence) Sync template highlights for marketing copy accuracy
- (Document Intelligence -> Platform) Coordinate overlay ingestion once new field maps are ready
- (Compliance -> Platform) Embed release gate checklist into weekly go/no-go with evidence upload paths
- (Compliance -> Document Intelligence) Prioritize statutes and notices needed for state knowledge base expansion
- (Compliance -> Document Intelligence) Review updated prenuptial/service/quitclaim flows for notarization and witness guidance
- (Compliance -> Growth) Provide finalized disclaimers and refund copy for marketing funnels once drafted
- (Compliance -> Payments) Supply refund evidence inputs for release gate checklist Section 4

## Resume Cursor
lead_pod: Document-Intelligence
primary_focus: Spanish metadata localization and overlay backlog reduction



