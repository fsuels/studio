# Long-Term Execution Memory (Updated 2025-09-19)

## Document Generation & PDF Reliability – Primary Focus

### Phase 0 – Baseline + Instrumentation (Week 0)
- Inventory all document entry points (web, Firebase Functions, scripts) and capture current success/error rates.
- Enable structured logging across `pdfService`, `dynamic-document-loader`, and generation API routes (trace id + documentId + tenant).
- Establish KPIs: generation success rate ≥ 99.5%, average PDF response time ≤ 3s, regression-budget ≤ 0.1%.
- 2025-09-19: Added `src/lib/logging/document-generation-logger.ts` and wired pdf service + manifest/legacy loaders to emit structured start/success/error events. Next: pull baseline metrics once logs collect and extend instrumentation to Firebase Functions + CLI scripts.
- Current known entry points: Next API `src/app/api/generate-pdf/route.ts` → `src/services/pdf-generator.ts` → `pdfService`; wizard flows using `dynamic-document-loader`; legacy static loader `src/lib/document-loader.ts`. Need to confirm Firebase Functions (`functions/`) and preview scripts mirror the new logger.
- 2025-09-19 (PM update): `src/app/api/generate-pdf/route.ts` and `src/services/pdf-generator.ts` now emit structured logs (requestId, docType, size, status). Pending: verify if any Firebase Functions/scripted PDF flows exist (none identified yet) and add instrumentation if uncovered.
- Baseline capture plan: (1) add log-based metric in Stackdriver/Sentry filtering `[DocumentGen]` with labels `operation`, `status`, `durationMs`; (2) run smoke requests for top 5 docs (wizard + API) and confirm entries for `api.generatePdf`, `service.generatePdfDocument`, and `pdf.*` operations; (3) export aggregated counts (success/error) and P95 duration into ops dashboard (Looker/Datastudio) and share snapshot; (4) schedule daily job to compare metrics to success ≥99.5% / latency ≤3s targets, alert if breached. See tooling in `scripts/analyze-documentgen-logs.ts` and workflow notes in `docs/observability/document-generation-metrics.md` + GCP-specific setup in `docs/observability/gcp-document-generation-monitoring.md`.
- Smoke test flow now documented with example curl/log analysis commands (plus automated helper `scripts/run-documentgen-smoke.ts`) in observability guide; next execution should capture metrics for top 5 documents and archive results in ops dashboards.
- Additional entry points audit: no Firebase Function or CLI workflows currently invoke pdf generation; monitor future Functions additions so they adopt the logger immediately.

### Phase 1 – Manifest Adoption Sprint (Weeks 1–2)
- 2025-09-19: TypeScript sweep now shells `npx tsc --noEmit --skipLibCheck`; Firestore 13.3.0 emits a TS1010 (`*/` expected) error—documented for follow-up.
- 2025-09-19: Quality verifier updated to consume manifest JSON; remaining warnings are environment-only (tsc unavailable in sandbox, lint max-warning exit).
- 2025-09-19: Quality verification script highlights backlog of non-manifest exports/metadata (legacy template dirs); queued for cleanup or manifest parity before enabling full CI gate.
- Replace remaining `documentLibrary` imports in client/server components with manifest-backed selectors (`DocumentTypeSelector`, Step flows, search, discovery, chips, analytics widgets).
- Update Firebase/Cloud Functions (`functions/` equivalents) to consume `dynamic-document-loader` and manifest metadata, adding parity tests.
- Ship regression tests ensuring Step1–3 flows render from manifest for top 20 docs.
- TODO: Produce component checklist (StepOne/Two/Three inputs, DocumentTypeSelector, search bar, mega menus, dashboard stats) with owners + risk notes.
- TODO: Draft integration test plan validating manifest results vs. legacy list for representative categories before swapping default exports.
- Step 1–3 workflow now powered by manifest helpers (`src/lib/workflow/document-workflow.ts`); Step 2 filters templates by state metadata and Step 3 handles loading errors. Manual QA still required to confirm manifest `states` values align with picker options.
- DocumentTypeSelector, SearchBar, and TopDocs chips now use manifest-backed helpers; remaining discovery surfaces (mega menu, analytics dashboards) still rely on legacy library.
- Mega menu still pending; TopDocs now pulls manifest docs per taxonomy mapping but needs manual QA to confirm category alignment.
- Remaining legacy references: Mega menu variants (`src/components/mega-menu/*`) and analytics/dashboard views still import `document-library`; schedule follow-up conversion and remove fallback helpers once complete.
- Consolidated mega menu now hits manifest helper; dashboards & analytics tabs still on legacy library.
- Remaining legacy imports: DocumentFlow, Step1DocumentSelector, HeaderSearch (prefetch/search), semantic analysis utilities; plan phased replacements or removal of legacy helper once these are migrated.
- DocumentFlow now uses manifest helper; Step1 selector + HeaderSearch still rely on legacy library for search/top docs; plan migration.
- 2025-09-19: Updated `src/lib/documents/dynamic-loader.ts` to delegate to the manifest-backed loader so hooks/components no longer rely on the three-item stub; next, align Firebase/API wrappers with the same helper.
- 2025-09-19: `src/lib/document-loader.ts` now calls the manifest loader first and only falls back to metadata stubs when bindings are missing; Firebase Functions/back-office scripts still pending review.
- 2025-09-19: Manifest generator now outputs JSON for cross-runtime sharing and `functions/document-manifest.ts` consumes it so Cloud Functions validate docTypes before rendering previews.
- 2025-09-19: Legacy scripts (e.g., `scripts/count-documents.js`) now read the manifest JSON directly; remaining CLI utilities still need the same update before deprecating TS transpile hacks.

### Phase 2 – Template Completeness & Validation (Weeks 2–4)
- Audit metadata-only templates; promote to full `LegalDocument` exports or document them as metadata-only plus adjust generator to surface warnings.
- Extend `scripts/generate-document-manifest.mjs` to fail CI on missing schema/questions/translations.
- Add fixtures in `tests/fixtures/` and smoke tests for top-10 revenue docs + three state forms.

### Phase 3 – Unified Generation Pipeline (Weeks 4–6)
- Create orchestrator module shared by Next.js routes and Functions to wrap `pdfService`, overlays, and template hydration.
- Implement retry + fallback strategies (cached PDF, escalation to human-assist queue).
- Add contract tests verifying same output bytes between web and backend paths.

### Phase 4 – Operational Safeguards (Weeks 6–8)
- Integrate monitoring (Prometheus/OpenTelemetry) with alerts for failure spikes, slow renders, or template drift.
- Schedule weekly automation: `npm run verify-templates`, lint, tests, build; publish results to ops dashboard.
- Document SOP in `docs/documents/overview.md` + runbook for incident response.

## AI Drafting & Automation – Secondary Track

### Phase A – Foundation & Compliance (Weeks 0–2)
- Replace `src/ai/ai-instance.ts` stub with Genkit/Gemini configuration behind feature flags and environment secrets.
- Draft DPIA update, SOC2 control mapping, and safeguard prompts for UPL/accuracy.

### Phase B – Flow Hardening (Weeks 2–4)
- Refactor `inferDocumentTypeFlow` + AI API routes to enforce schema validation, jurisdiction filters, and audit logging.
- Capture prompts/responses in secure store with retention policy; add redaction of PII.

### Phase C – Feature Surfacing (Weeks 4–6)
- Integrate AI suggestions into wizard sidebars, questionnaire helper text, and tenant dashboards with human-review toggles.
- Build A/B experiments measuring conversion uplift vs. manual flow.

### Phase D – Evaluation Loop (Weeks 6–8)
- Create automated eval harness with golden transcripts, hallucination checks, and bias guardrails.
- Schedule quarterly review with compliance/legal.

## Dashboards & Revenue Insights

### Phase α – Data Contract Audit (Weeks 0–2)
- Document required metrics for tenant/admin dashboards; align with Firestore/BigQuery schemas.
- Replace mock responses in `/api/tenants/*` and `/api/analytics/marketing-attribution` with real data access layers; create fixtures for tests.

### Phase β – Real-Time Instrumentation (Weeks 2–4)
- Implement event pipeline (UTM capture, document lifecycle, AI usage) with batching + caching layer.
- Update dashboard components to show skeletons, error states, and freshness timestamps.

### Phase γ – Collaboration & Sharing (Weeks 4–6)
- Finish invite flows, doc sharing permissions, activity feed, and assisted-service handoff hooks.
- Add upsell prompts tied to usage thresholds.

### Phase δ – Admin Oversight (Weeks 6–8)
- Expand admin dashboard to include compliance alerts, AI usage analytics, SLA metrics, segment reporting, and export tools under RBAC.

## Performance, Accessibility, SEO & i18n

### Stage 1 – Baseline Automation (Weeks 0–1)
- Wire Lighthouse CI + WebPageTest scripts using existing `performance-results-*.json` schema.
- Set budgets: LCP < 2.2s, CLS < 0.05, TBT < 150ms, SEO score ≥ 95.

### Stage 2 – Content & Localization Hygiene (Weeks 1–3)
- Resolve high-risk marketing copy from `WEBSITE_AUDIT_REPORT.md`; update Spanish translations simultaneously.
- Audit structured data (`src/lib/seo/*`) and ensure localized metadata coverage for top routes.

### Stage 3 – Bundle & Runtime Tuning (Weeks 3–5)
- Run `npm run analyze`; enforce chunk budgets; migrate leftover heavy imports to dynamic boundaries.
- Implement CDN caching strategy for AI/PDF assets and evaluate Edge runtime viability.

### Stage 4 – Accessibility & Responsive Polish (Weeks 5–7)
- Expand axe + Playwright coverage for primary flows; fix tenant dashboard keyboard/screen reader gaps.
- Update QA sweep checklist (Phase 0–12) with accessibility gates before release.

## Security & Compliance Anchors

### Sprint S1 (Weeks 0–2)
- Re-run `npm audit`, dependency reviews, Firebase rules linting; patch critical findings.
- Confirm secrets isolation in `.env.local` + secret manager sync scripts.

### Sprint S2 (Weeks 2–4)
- Align AI launch with SOC2/GDPR documentation, update logging retention policies, and verify consent flows.
- Add automated compliance checks (OWASP zap, dependency track) into CI.

## Cross-Team Governance
- Establish bi-weekly steering review covering KPIs per track; share status in `REMEMBER.md` + dashboard.
- Maintain backlog grooming cycle: promote new initiatives only when roadmap phase gates met.
- Keep Memory.md updated after each working session (target 79%+ context retention).
