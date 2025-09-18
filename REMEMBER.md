# Pending Follow-Ups

- Update UI/Data layers (e.g., `src/lib/document-registry.ts` and downstream listing/search components) to source titles/routes from the generated manifest instead of the three-item stub. (Step1 selector, workflow steps 1–3, DocumentTypeSelector, mega menu variants, discovery modal, questionnaire, header/global search, and top docs chips now hydrate from the manifest-backed library without placeholders.)
- Mirror the manifest-driven loader inside Firebase functions / API wrappers so backend flows use the same dynamic import surface (checkout + wizard use `getSingleDocument`; start page + Firestore dashboard now resolve metadata via manifest; remaining API/AI scripts currently reference only metadata helpers—recheck after next manifest expansion).
- Convert metadata-only templates (e.g., `src/lib/documents/us/accident-report`) to export full `LegalDocument` objects or decide on a separate metadata track so they can join the manifest (script currently skips them).
- Run a full quality sweep once wiring is complete (`npm run lint`, `npm run test`, etc.); lint timed out locally and still reports legacy warnings (see latest run).
- Document the new manifest script in contributor docs and ensure it is part of the build/pipeline (consider adding pre-commit or CI guard).
- Migrate remaining UI flows that dynamically import `documentLibrary` (AI/autocomplete flows, analytics dashboards, any server-rendered stubs) to use manifest-backed helpers; audit for lingering async placeholders (none found in components, re-check `ai/` and backend consumers).
- Manifest-driven document library wiring is in progress—next focus: Firebase/API parity and metadata gaps, then schedule the quality sweep.

## Systematic QA Sweep (2025-09-17)

- Status: Pending kickoff
- Current focus: Establish baseline environment and compile route inventory
- Next action: Confirm dev server health, gather error logs, and outline priority order for page verification
- Progress log: Update checklist below as phases complete; record blockers inline

- [ ] Phase 0 – Baseline environment, logging, test data refresh
- [ ] Phase 1 – Route inventory & navigation mapping (marketing, auth, app, admin)
- [ ] Phase 2 – Marketing & informational pages QA
- [ ] Phase 3 – Authentication & onboarding flows (signup, signin, reset, locale)
- [ ] Phase 4 – Document discovery & selection (search, filters, mega menu, manifest parity)
- [ ] Phase 5 – Document creation wizard (questions, validation, autosave, progress indicators)
- [ ] Phase 6 – Save/resume, editing, reopening stored contracts
- [ ] Phase 7 – Dashboard surfaces (documents list, folders, analytics, compliance tabs)
- [ ] Phase 8 – Document outputs (PDF generation, share links, exports, email delivery)
- [ ] Phase 9 – Admin & tenant views (multi-tenant routing, permissions, admin dashboards)
- [ ] Phase 10 – API/Cloud Functions parity & Firestore integrations
- [ ] Phase 11 – Performance profiling & optimization (slow pages, bundle analysis, caching)
- [ ] Phase 12 – Regression pass, automated test coverage, documentation updates

## Product Improvement Roadmap (2025-09-19)

### Document Generation & PDF Reliability
- [ ] **Manifest adoption sprint** – Replace legacy `documentLibrary` usage in UI (Step selectors, search, discovery, AI assists, dashboard stats) and Firebase/API wrappers with manifest-backed helpers. Blocked by verifying `DocumentTypeSelector` + Step flows against new metadata.
- [ ] **Template completeness drive** – Upgrade metadata-only templates to full `LegalDocument` exports or define metadata-only lane; extend manifest generator tests to fail builds on partial entries.
- [ ] **Unified generation pipeline** – Ensure `pdfService`, `dynamic-document-loader`, and Cloud Functions share a single orchestrator; add smoke tests in `tests/document-generation.test.ts` for top 10 revenue docs plus state forms.
- [ ] **Operational safeguards** – Wire structured logging + alerting around generation failures (both Next handlers and Functions) and schedule weekly `npm run verify-templates` + lint/test/build sweep before shipping.
- [ ] **Instrumentation baseline** – Structured logging (`src/lib/logging/document-generation-logger.ts`) now wraps pdf service, manifest/legacy loaders, API handler, and `generatePdfDocument` service (2025-09-19); capture baseline metrics from `/api/generate-pdf`, identify remaining entry points (Firebase Functions, scripts), and define reporting dashboard.
- [ ] Confirm no other generation entry points (Firebase Functions, CLI scripts) currently exist; re-run audit when new Functions land. Local analysis: `npx tsx scripts/analyze-documentgen-logs.ts --input <log>` or run smoke suite via `npx tsx scripts/run-documentgen-smoke.ts`; capture workflow documented in `docs/observability/document-generation-metrics.md` and monitoring setup in `docs/observability/gcp-document-generation-monitoring.md`.

### AI Drafting & Automation
- [ ] **Provider activation & secrets** – Replace stubbed `aiInstance` with Genkit/Gemini configuration behind env flags; add safe fallback to rules-based heuristics when quota or compliance blocks.
- [ ] **Flow hardening** – Refactor `inferDocumentTypeFlow` and legal assistant endpoints to validate Genkit outputs, enforce jurisdictional filters, and capture prompts/responses in audit logs.
- [ ] **Feature surfacing** – Integrate AI recommendations inside document wizard, questionnaire helpers, and tenant dashboards with clear UX affordances + human review paths.
- [ ] **Quality & compliance loop** – Add automated evaluation harness (golden transcripts, hallucination checks) and coordinate with compliance to review prompt templates quarterly.

### Dashboards & Data Surfaces
- [ ] **Data contract audit** – Document required metrics for tenant/admin dashboards; back `marketing-attribution` and tenant stats APIs with Firestore/BigQuery views instead of mocks.
- [ ] **Real-time instrumentation** – Implement event pipelines (UTM capture, document lifecycle telemetry) and hydrate dashboard widgets from cached analytics layers with loading/error states.
- [ ] **Collaboration & sharing** – Finish invite flows, shared workspaces, and doc sharing endpoints so dashboard actions map to business goals (upsell, retention, assisted service handoff).
- [ ] **Admin oversight** – Expand admin dashboard to surface compliance alerts, AI usage, and system health; gate via RBAC and include export/reporting tools.

### Performance, Accessibility, SEO
- [ ] **Baseline & regression tracking** – Schedule Lighthouse + WebPageTest automation using existing `performance-results-*.json`; surface deltas in CI.
- [ ] **Content & i18n hygiene** – Resolve high-risk marketing copy flagged in `WEBSITE_AUDIT_REPORT.md`, ensure Spanish strings updated in lockstep, and audit structured data for top routes.
- [ ] **Bundle & runtime tuning** – Re-run bundle analyzer after manifest adoption, enforce critical CSS/JS budgets, and cache heavy AI/PDF modules with CDN edge strategy.
- [ ] **Accessibility & responsive polish** – Tie QA sweep Phase 1-12 outcomes to axe/playwright coverage; prioritize mobile nav, form inputs, and tenant dashboard screen reader support.

### Security & Compliance Anchors
- [ ] Align AI rollouts with SOC2/GDPR logs, update DPIA entries, and confirm secrets isolation (`.env.local`, secret manager sync scripts).
- [ ] Re-run `npm audit`, dependency review, and Firebase rules linting before enabling new surface areas.
