# Document Intelligence Playbook

## Mission Contribution
Deliver a complete, legally accurate document catalog with bilingual coverage, structured schemas, and perfect PDF overlays so customers can self-generate compliant paperwork across jurisdictions.

## Charter
- Curate and maintain the master library under `src/lib/documents/` with metadata, schemas (Zod), question flows, and overlay coordinates.
- Ensure placeholder schema registry and parity checks stay authoritative for all locales.
- Manage template lifecycle: intake, legal review coordination, versioning (semver), and deprecation policies.
- Operate verification pipelines (`npm run verify-templates`, parity diffs, axe checks for template pages).
- Own documentation of jurisdiction requirements, mandatory notices, and update cadence.

## 90-Day Objectives
1. Reach 99% template parity across all U.S. states in English and Spanish, including metadata translations and question sets.
2. Resolve all TODOs blocking schema/question completeness (service agreement, quitclaim deed, etc.).
3. Automate templates inventory and placeholder snapshot artifacts per release (`contracts/_inventory.json`, parity reports).
4. Stand up quality dashboards tracking overlay accuracy, translation parity, and legal change queue.

## KPIs & Targets
- Template parity coverage: >=99% of catalog with complete schema + questions in both languages.
- Overlay accuracy: <0.5% field mismatch defects in QA audits.
- Localization completeness: 100% required strings translated; flag and backfill within 48h.
- Legal update SLA: incorporate jurisdiction changes within 10 business days of notice.

## Operating Cadence
- Daily: review legal change feeds, customer feedback, and support escalations relating to document content.
- Weekly: sync with Compliance for statute updates; backlog groom templating tasks; ship parity report to CEO.
- Biweekly: collaborate with AI pod on auto-question generation enhancements.
- Monthly: run full template verification suite and publish findings; audit translation parity.

## System Ownership
- Metadata registry (`src/lib/document-metadata-registry.ts`, JSON outputs) and manifest scripts.
- Placeholder schema definitions (`contracts/_schema/placeholders.json`) and enforcement tooling.
- Overlay assets (`public/forms/...`) and mapping files.
- Template verification scripts (`scripts/verify-templates.ts`, template-monitor).
- Content documentation in `docs/documents/` plus change logs in `Remember.md` backlog entries.

## Tooling & Integrations
- Zod for schema definitions; TypeScript for template modules.
- PDF utilities (pdf-lib), overlay JSON editors, diff tooling.
- QA automation: Playwright flows hitting template routes, Jest snapshot tests for placeholders.
- Collaboration: shared legal research database, translation management system (e.g., Lokalise) or internal spreadsheets.

## Collaboration Map
- Platform Engineering: coordinate deployments, SSR impacts, caching; ensure breaking schema changes are backwards compatible.
- AI & Automation: provide training data (questions, metadata) and feedback on hallucinations; vet auto-generated question proposals.
- Compliance & Legal Ops: validate legal accuracy, disclaimers, mandatory clauses before release.
- Growth & Customer Learning: supply content briefs, template highlights, and localization context for marketing pages.
- Payments & Monetization: flag premium templates or bundles requiring special pricing logic.

## Risk & Escalation
- Legal discrepancy or incorrect clause: halt distribution, notify Compliance, push emergency patch with version bump.
- Missing or broken overlay: remove download temporarily, communicate via release notes, prioritize fix.
- Translation errors causing misinterpretation: roll back localized copy, engage professional translator review.

## Immediate Next Actions
1. Close outstanding TODOs for schemas/questions (service agreement, quitclaim deed, etc.) and document coverage status.
2. Backfill missing Spanish metadata for flagged templates (e.g., warranty deed, leases) and rerun parity audit.
3. Generate latest `contracts/_inventory.json` and store checksum in `ops/artifacts` for traceability.
4. Draft standardized template intake checklist (legal review, placeholder validation, localization) and socialize with pods.
