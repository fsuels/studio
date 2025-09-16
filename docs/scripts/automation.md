# Automation Scripts Reference

## Quality & Verification
- `npm run full-check` - runs the integrated quality system (`scripts/integrated-quality-system.js`) plus lint-staged the same way the Husky hook does.
- `scripts/verify-templates.ts` - validates schema/question alignment and ensures every template exports required metadata.
- `scripts/quality-verification-system.js` - aggregates compliance, legal, and translation validations; use before touching `src/lib/documents/` en masse.

## Document Tooling
- `scripts/generate-document-library.js` - regenerates the metadata registry from template source files. Run after adding new templates or jurisdictions.
- `scripts/auto-fix-templates.ts` - attempts to resolve common schema mismatches (missing translation keys, question IDs) automatically.
- `scripts/generate-previews.js` - creates sample preview PDFs for marketing/demo use and syncs with `public/previews/`.
- `scripts/verify-templates.ts --report-only` - emits a JSON report suitable for CI artifacts without failing the run.

## Monitoring & Ops
- `scripts/integrated-quality-system.js` - orchestrates document, translation, and decision system checks; CI and Husky rely on this as the first gate.
- `scripts/monitoring-dashboard.js` - spins up a local dashboard summarizing quality scores; helpful when triaging failures from the integrated gate.
- `scripts/seo-content-uniqueness-system.js` - reviews generated copy for duplication. Schedule it post-deployment if marketing content changed.
- `scripts/template-monitor.ts` - watches template runtime metrics and flags slow renders. Pair with `npm run bundle:size` when investigating regressions.

## How Agents Should Use These Scripts
1. Before opening a PR, run `npm run lint`, `npm run test`, `npm run typecheck`, `npm run e2e`, and `npm run build` to cover the baseline gates.
2. When modifying document templates, add `npm run verify-templates` and, if overlays change, `npm run generate:doc` for the specific document ID.
3. For compliance or translation updates, execute `npm run full-check` to mirror the Husky workflow and prevent noisy pre-commit failures.
4. Record all command outputs that produced fixes or surfaced warnings in the PR description so reviewers and agents can trace remediation steps.
