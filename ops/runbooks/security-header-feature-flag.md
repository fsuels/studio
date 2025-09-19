# Security Header Feature Flag Runbook

## Purpose
Provide a deterministic toggle procedure for the security-header middleware while we complete telemetry, compliance sign-off, and rollout to production. Use this flag to stage changes safely and to disable headers quickly during incidents.

## Feature Flag Overview
- **Flag**: `FEATURE_SECURITY_HEADERS`
- **Scope**: Edge middleware (locale redirects, tenant rewrites, admin auth flows, general requests)
- **Default**: `true` (headers applied)
- **Accepted values**: `true`, `1`, `yes`, `on`, `enabled`, `false`, `0`, `no`, `off`, `disabled`
- **Fallback**: Any other value, or missing env var, is treated as `true` to avoid accidental disablement.

## Rollout Checklist
1. Confirm CSP telemetry endpoints are healthy (`npm run monitor` or `node scripts/check-csp-metrics.mjs https://<env-host>`).
2. Update the environment variable in the deployment system (Vercel, Firebase Functions runtime config, or container env).
   - Example for Vercel: `vercel env add FEATURE_SECURITY_HEADERS true --environment=production`.
   - Example for Firebase Hosting: `firebase functions:config:set security.headers=true` then redeploy functions + hosting with the updated build.
3. Trigger deployment and monitor build logs for the new env var in the middleware bundle.
4. Verify headers post-deploy:
   - `curl -I https://<env-host>/legal` (should include CSP-Report-Only, Referrer-Policy, Permissions-Policy, etc.).
   - `curl -I https://<env-host>/api/security/csp-report` should return `Content-Security-Policy-Report-Only` unless enforcement is enabled.
5. Update `SECURITY_HEADER_MODE` separately when ready to move from `report-only` to `enforce` (HSTS only emits in enforce mode).

## Disable / Incident Response
1. Set `FEATURE_SECURITY_HEADERS=false` in the affected environment.
2. Redeploy the middleware layer (Vercel redeploy or Firebase hosting deploy).
3. Validate removal via `curl -I`; all security headers should be absent.
4. Document the disablement in the incident timeline and coordinate with Compliance (CSP telemetry will stop).
5. Plan re-enable once root cause is mitigated and telemetry is stable.

## Verification & Testing
- Local/unit: `npx jest --runTestsByPath src/__tests__/middleware/security-headers.test.ts`
  - Validates header application, redirects, tenant rewrites, and feature-flag disable path.
- Smoke check: Hit `/api/security/csp-report` with a sample violation payload and confirm log ingestion.
- Observability: Ensure Grafana dashboards (`ops/monitoring/csp-alert-dashboard.json`) show report-only traffic after toggling on.

## Notes
- The middleware defaults to enabled if the flag is missing, guarding against misconfiguration.
- Keep `FEATURE_SECURITY_HEADERS` in sync across staging and production to avoid drift during release train.
- Coordinate with Compliance before disabling headers longer than 1 hour.
