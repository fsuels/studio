# Middleware Consolidation - platform-cycle-0003

## Summary
- Merged locale detection and admin protection logic from `src/middleware.ts` into root `middleware.ts`, ensuring i18n redirects and admin auth run alongside tenant + security header pipeline.
- Added helpers to infer client locale, enforce CSP security headers for admin traffic, and normalize matcher rules.
- Removed duplicate `src/middleware.ts` to prevent drift; all routing/security logic now lives in `middleware.ts`.

## Verifications
- npx eslint middleware.ts src/app/api/security/csp-report/route.ts src/lib/security/csp-report-store.ts

## Follow-ups
- Integrate middleware utilities with automated tests covering locale redirects and admin access.