# Security Header Feature Flag Verification

## Summary
- Feature flag `FEATURE_SECURITY_HEADERS` guards security headers in `middleware.ts`.
- Documentation refreshed (`README.md`, `ops/runbooks/security-header-feature-flag.md`, `LEGAL_UPDATE_INTELLIGENCE_FEED.md`).

## Tests
- `npx jest --runTestsByPath src/__tests__/middleware/security-headers.test.ts`

## Follow-ups
- Track full Jest suite failures (marketplace revenue, dropdown displayName, Playwright in Jest) before CI.
- Stage rehearsal toggling flag per `TEAM/Platform-Engineering/memory.json` todo.
