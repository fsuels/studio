# CSP Alerting Hook - platform-cycle-0004

## Summary
- Added `src/lib/security/csp-alerts.ts` to send high/critical CSP violations to a webhook defined by `CSP_ALERT_WEBHOOK_URL`.
- Updated Firestore persistence to call the dispatcher after audit logging, returning delivery metadata for future instrumentation.
- Maintained existing Firestore gating and ensured low-risk reports avoid alert noise.

## Verification
- npx eslint middleware.ts src/app/api/security/csp-report/route.ts src/lib/security/csp-report-store.ts src/lib/security/csp-alerts.ts

## Follow-ups
- Connect webhook delivery metrics to observability stack and add automated runbook tests when alerting infra is in place.