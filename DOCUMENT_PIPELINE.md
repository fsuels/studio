# Document Pipeline

## Scope & Goals
- One canonical path turns jurisdictional template source files into runtime-ready LegalDocument objects, previews, and PDFs without duplicating business logic.
- The pipeline guarantees bilingual metadata, schema validation, overlay readiness, and safe fallbacks so new templates ship predictably.

Flow overview:
Templates (src/lib/documents/*)
  -> manifest generation
Manifest artifacts (manifest.generated.*)
  -> metadata registries
Dynamic loader and library (loadDocument, getDocumentsByCountry)
  -> consumers (Next.js routes, Firebase Functions, PDF services)
Observability and verification (logs, npm run verify-templates)

## Source Assets
- Template modules live under src/lib/documents/<jurisdiction>/<template> and must export metadata.ts, schema.ts, questions.ts, plus helpers (see docs/documents/overview.md).
- Overlay geometry, icons, and static PDFs remain in public/forms/** so PDF generation can align answers with official layouts.
- Localization assets and shared copy sit in src/lib/localizations.ts and translation utilities; keep template translations self-contained for manifest scraping.

## Build-Time Manifest
- node scripts/generate-document-manifest.mjs walks every metadata.ts, extracts static fields, and emits manifest.generated.ts plus manifest.generated.json (scripts/generate-document-manifest.mjs:6).
- Generated entries capture import paths and lightweight metadata, including bilingual aliases and notarization flags, sorted deterministically.
- CI should rerun the generator after adding or editing templates; guard against stale manifests before committing.

## Metadata Layers
- DOCUMENT_METADATA and helpers in src/lib/document-metadata-registry.ts:5 provide fast search/read APIs without loading template code.
- Legacy-compatible DOCUMENT_REGISTRY in src/lib/document-registry.ts:31 adds route hints, config type detection, and state-aware lookups for the older consumers.

## Runtime Loading Flow
- loadDocument in src/lib/dynamic-document-loader.ts:24 is the single entry point. It checks an in-memory cache, dynamically imports the module listed in the manifest, enriches missing fields, and annotates structured logs.
- Failures fall back to metadata-only envelopes so UI surfaces never throw (src/lib/dynamic-document-loader.ts:138).
- loadDocuments batches imports for country-level hydration; preloadCommonDocuments warms frequently used IDs for UX.

## Library & Search Services
- src/lib/document-library.ts:35 seeds lightweight documents from manifest metadata, then hydrates them via the dynamic loader when requested.
- Country caches (src/lib/document-library.ts:180) keep repeat lookups cheap while findMatchingDocuments performs synonym-aware ranking for catalog search (src/lib/document-library.ts:294).
- src/lib/document-loader.ts:24 preserves legacy callers by delegating to the manifest loader first, then constructing a metadata-derived fallback if dynamic import fails.

## Delivery Surfaces
- Next.js routes under src/app/[locale]/(legal)/documents read from the document library to render listings and editors (src/app/[locale]/(legal)/documents/page.tsx:8).
- Firebase onDraftWrite builds wizard previews directly from manifest metadata, ensuring parity between serverless drafts and the web app (functions/gen-preview.ts:29).
- Server-side PDF generation shares the same logging context and taps overlay assets when composing downloads (src/services/pdf-generator.ts:25).

## Logging & Observability
- src/lib/logging/document-generation-logger.ts:4 standardizes start, success, and error events; every loader and PDF call supplies context such as document ID, cache hits, and durations.
- Downstream monitoring should aggregate the [DocumentGen] prefix; hook alerts on repeated fallback-only responses or long durations.

## Quality Gates & Tooling
- Run npm run verify-templates (drives scripts/verify-templates.ts:9) to validate word count, required sections, variable coverage, and duplicate hashes across EN and ES inventories.
- scripts/template-monitor.ts and parity audits complement manifest generation for overlay readiness and placeholder detection.
- Add Jest or Playwright coverage whenever schemas or questions change; all template additions should ship with at least one smoke test of the wizard flow.

## Operational Checklist
1. Add or update template modules (metadata, schema, questions, overlays).
2. Rebuild the manifest (npm run generate-document-manifest or node scripts/generate-document-manifest.mjs).
3. Execute verification tooling (npm run verify-templates, targeted jest, overlay QA).
4. Spot-check dynamic loading in a dev shell (node -e "import('./dist?')" style) or via the Next.js route to ensure hydration succeeds.
5. Watch logs for new [DocumentGen] ERROR entries after deployment and roll back if fallbacks persist.

## Known Risks & Follow-Ups
- Translation parity automation is still a TODO in pod memory; integrate parity checks into the verification script before broad catalog changes.
- Overlay field maps for specific states (for example GA T-7) require manual QA until the overlay audit suite lands.
- TypeScript type-checks currently fail in other pods; unblock the global build so verify-templates can become a formal gate.
