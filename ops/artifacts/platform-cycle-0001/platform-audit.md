# Platform Audit - platform-cycle-0001

## Next.js Infrastructure
- Primary config in `next.config.mjs` disables critical safety rails (`typescript.ignoreBuildErrors`, `eslint.ignoreDuringBuilds`) and marks `images.unoptimized = true`, undermining CI signal and CWV budgets.
- Duplicate `next.config.ts` conflicts with the `.mjs` version (opposing `trailingSlash` settings, overlapping header definitions). Having both increases drift risk and makes it unclear which config is authoritative.
- Two middleware entry points (`middleware.ts`, `src/middleware.ts`) implement different routing + security logic. Next.js only respects one, so the other silently rots; this split hides bugs and complicates tenancy + admin enforcement.

## Firebase / Backend Services
- `firestore.rules` rely on permissive allow rules without field validation for several collections (e.g., `audit`, `operational_metrics`) and allow any authenticated user to create audit records, increasing tampering risk.
- Cloud Functions (`functions/index.ts`) depend on `functions.config().openai.key` but no secrets management or fallback is documented; missing retry/alerting around Pub/Sub failures beyond log statements.
- No IaC or deployment manifest ties Firebase hosting + functions together, so environment parity cannot be enforced.

## Security Headers & CSP
- Root middleware ships strict headers (HSTS preload, Permissions-Policy, COOP/CORP) directly to all environments without feature flag or staging validation, violating "report-only first" guardrail.
- `Content-Security-Policy` is entirely disabled (`shouldApplyCSP = false`) and no report-only telemetry exists; there is no `/api` endpoint to collect browser reports.
- HSTS preload is risky before domain validation due to irreversible preload list submission; there is no documented rollout plan or exclusion for local development.

## Core Web Vitals
- Latest automated CWV evidence (`performance-results-*.json`) dates back to 2025-06 and is not wired into current CI artifacts; `Remember.md` metrics remain null.
- No Lighthouse budgets or INP/LCP thresholds enforced in CI despite playbook requirement; Next.js build configuration relaxes asset limits (`maxEntrypointSize` 1.2MB) without alerting.

## Telemetry & Observability
- Sentry initialization gated on `NEXT_PUBLIC_SENTRY_DSN`, but there is no `ops/telemetry` documentation or default DSN for staging; no OpenTelemetry wiring despite dependencies.
- `prom-client` is installed yet unused; there is no metrics exporter or health-endpoint surfacing runtime stats.
- No central log aggregation or structured logging strategy beyond scattered `console.log` calls (many include garbled characters from encoding issues).

## CI/CD & Release Engineering
- `.github/workflows/ci.yml` runs lint/typecheck/tests but Next build still ignores TypeScript/ESLint failures, so production deploys can bypass gate.
- Firebase emulators and Playwright start in CI, yet there is no artifact retention into `ops/artifacts`, breaking evidence-first contract.
- No release train documentation or rollback checklist present under `ops/`.

## Incident Readiness
- Repository lacks incident response playbook, on-call rotation, or communication templates despite playbook objective.
- `server.mjs` assumes local TLS certs (`./cert/server.key`) without bundling instructions, preventing quick local incident drills; no fallback to HTTP for emergency use.

## High-Risk Summary
1. Security header stack violates guardrail (enforced HSTS/preload, CSP disabled, no telemetry) — immediate fix required.
2. Configuration drift between `next.config.mjs` / `next.config.ts` and duplicate middleware risks undefined routing/security behavior.
3. Lack of observability (no CSP report sink, no metrics pipeline, sparse CWV evidence) blocks compliance with Platform KPIs.
4. Firestore rules + functions lack hardened validation/logging, exposing audit trail integrity risk.
5. Incident response process undocumented, leaving org unprepared for security events.
