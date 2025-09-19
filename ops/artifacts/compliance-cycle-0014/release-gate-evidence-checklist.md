# Release Gate Evidence Checklist - 2025-09-26 Freeze

Prepared: 2025-09-19T19:54:16.2322913Z (UTC)
Cycle: compliance-cycle-0014
References: ops/compliance/release-gate-checklist.md; ops/artifacts/compliance-cycle-0012/release-gate-status-2025-09-26.md; ops/artifacts/compliance-cycle-0012/spanish-policy-localization-status.md; ops/compliance/dsar-acknowledgment-template.md

## Required Evidence
| Area | Artifact | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| UPL Safeguards | Spanish policy markdown + certification (docs/legal/es/*, translation approvals PDFs) | Compliance | Blocked | Await Redwood delivery.
| Privacy | Consent telemetry export + DSAR acknowledgment evidence | Platform + Compliance | Pending | Export sample due before 2025-09-23 dry run.
| Marketing | Funnel copy review log (Growth) referencing Spanish policies | Growth | Pending | Needs final translations and compliance sign-off.
| Payments | Refund SOP alignment memo + Stripe evidence | Payments + Compliance | Blocked | Waiting for Spanish refund policy and Stripe integration.
| Security/Incident | CSP telemetry report + on-call integration proof | Platform | Pending | Must attach latest CSP export and roster tie-in.
| Cross-Pod Sign-Offs | Signed release gate checklist | All pods | Not Started | Capture once blockers cleared.

## Collection Steps
1. Update translation receipt log with hashes immediately upon delivery.
2. Store bilingual DSAR evidence under ops/artifacts/compliance-cycle-0008/privacy-evidence/DSAR-DRYRUN-2025W38/.
3. Collect screenshots/telemetry exports and note SHA256 in policy-translation-receipt.md when created.
4. Coordinate sign-off meeting to review checklist and gather signatures.