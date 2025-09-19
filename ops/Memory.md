# ops/Memory.md

## Cycle Ledger
- growth-cycle-0002 (2025-09-19T15:48:54.9598881Z, lead: Growth) - ops/artifacts/growth-cycle-0002/signwell-analytics-report.md
- document-intel-cycle-0002 (2025-09-19T15:32:23.4628575Z, lead: DocumentIntelligence) - ops/artifacts/document-intel-cycle-0002/catalog-audit.json
- document-intel-cycle-0001 (2025-09-19T15:10:52.4369864Z, lead: DocumentIntelligence) - ops/artifacts/document-intel-cycle-0001/catalog-audit.json
- platform-cycle-0001 (2025-09-19T15:09:07.9678975Z, lead: Platform) - ops/artifacts/platform-cycle-0001/platform-audit.md
- compliance-cycle-0001 (2025-09-19T14:59:47Z, lead: Compliance) - ops/artifacts/compliance-cycle-0001/compliance-audit.md

## Growth Cycle (growth-cycle-0002)
```
cycle_id: growth-cycle-0002
ts: 2025-09-19T15:48:54.9598881Z
lead_pod: Growth
mode: apply
selected_tasks:
  - id: growth-signwell-analytics-001
    pod: Growth
    p: 0.6
    impact: 4
    urgency: 4
    cost: 2
    notes: Added client-side CTA/disclaimer tracking for SignWell; see src/app/[locale]/(marketing)/signwell/SignWellContent.tsx.
  - id: growth-analytics-gap-brief-001
    pod: Growth
    p: 0.6
    impact: 3
    urgency: 3
    cost: 1
    notes: Documented analytics gap and verification steps in ops/artifacts/growth-cycle-0002/signwell-analytics-report.md.
context_evidence:
  - description: SignWell analytics instrumentation report
    source: ops/artifacts/growth-cycle-0002/signwell-analytics-report.md
  - description: SignWell CTA client component with tracking
    source: src/app/[locale]/(marketing)/signwell/SignWellContent.tsx
  - description: Server metadata and JSON-LD integration
    source: src/app/[locale]/(marketing)/signwell/page.tsx
cross_pod_followups:
  - pod: Platform
    action: Pipe signwell_cta_click & signwell_disclaimer_view events into GA4/warehouse and retire mock funnel metrics
    owner: Platform
  - pod: Compliance
    action: Review SignWell hero/disclaimer copy now tracked for compliance acknowledgement
    owner: Compliance
artifacts:
  - ops/artifacts/growth-cycle-0002/signwell-analytics-report.md
  - ops/artifacts/growth-cycle-0002/checksums.json
```

## Document Intelligence Cycle (document-intel-cycle-0002)
```
cycle_id: document-intel-cycle-0002
ts: 2025-09-19T15:32:23.4628575Z
lead_pod: DocumentIntelligence
mode: apply
selected_tasks:
  - id: docintel-schema-closeout
    pod: DocumentIntelligence
    p: 0.6
    impact: 4
    urgency: 4
    cost: 2
    notes: Implemented schemas/questions for prenuptial agreement, service agreement, and quitclaim deed; lint pass confirmed.
context_evidence:
  - description: Catalog audit snapshot (schema/question backlog cleared)
    source: ops/artifacts/document-intel-cycle-0002/catalog-audit.json
  - description: ESLint run (lint:quiet)
    source: npm run lint:quiet
cross_pod_followups:
  - pod: Compliance
    action: Review updated question flows for notarization and witness guidance
    owner: Compliance
  - pod: Platform
    action: Confirm overlay ingestion and PDF field map deployment once mappings are backfilled
    owner: Platform
artifacts:
  - ops/artifacts/document-intel-cycle-0002/catalog-audit.json
  - ops/artifacts/document-intel-cycle-0002/checksums.json
```

## Shared Active Risks
- Spanish metadata remains incomplete for 19 real estate templates flagged in the audit.
- CSP telemetry currently logs to console only; no durable storage or alerting.
- Duplicate middleware and Next.js config files risk drift in routing and security behaviour.
- Incident response playbook absent; no documented communications or rehearsal schedule.
- Customer-facing policies (disclaimer, ToS, privacy, refund) absent or placeholder; FTC Act Section 5 and state refund statutes exposure.
- Compliance release gate checklist drafted but not yet enforced; UPL and privacy reviews still manual.
- Jurisdiction knowledge base incomplete (only CA plus general data); nationwide coverage mandate unmet.
- International launch claims lack supporting legal research; GDPR transfer safeguards undefined.

## Cross-Pod Follow-Ups
1. Persist CSP reports to durable store with alerting pipeline. (Platform -> Compliance)
2. Consolidate middleware and Next.js config duplication before enforcing headers. (Platform)
3. Draft incident communication playbook aligned with Platform and Compliance expectations. (Platform -> Compliance)
4. Co-design release gate instrumentation with Platform to capture legal sign-offs each train. (Compliance -> Platform)
5. Coordinate with Document Intelligence on state-by-state compliance brief delivery cadence. (Compliance -> DocumentIntelligence)
6. Align Growth marketing copy with forthcoming disclaimers and refund language. (Compliance -> Growth)
7. Partner with Payments on refund SOP and policy implementation. (Compliance -> Payments)
8. Confirm overlay ingestion and PDF field map deployment once Document Intelligence backfills mappings. (DocumentIntelligence -> Platform)
9. Review updated prenuptial/service/quitclaim flows for legal approvals. (Compliance -> DocumentIntelligence)
