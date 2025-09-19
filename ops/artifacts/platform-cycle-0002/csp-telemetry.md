# CSP Telemetry Persistence - platform-cycle-0002

## Summary
- Sanitized CSP reports are now persisted to Firestore (collection `security_csp_reports`) when admin credentials are configured.
- Report risk classification heuristics map directives to risk/alert severities and trigger audit logging via `securityAuditLogger`.
- API captures client metadata (IP, user-agent, referer) for triage while keeping CSP in report-only mode.

## Verifications
- npx eslint middleware.ts src/app/api/security/csp-report/route.ts src/lib/security/csp-report-store.ts

## Follow-ups
- Wire Firestore persistence to alerting/metrics sink once BigQuery pipeline lands.
- Reconcile report retention policy with compliance requirements (7-year baseline).