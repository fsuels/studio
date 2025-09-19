# EN Template Placeholder Remediation Plan

## Current State
- 700 English templates remain placeholder stubs (≤60 words, missing required sections, zero template variables).
- `npm run verify-templates` fails due to minimum content and structure requirements.
- Spanish catalog also contains duplicate placeholders (23 files identified in verifier output).

## Goals
1. Replace placeholder content with production-ready legal templates that satisfy:
   - ≥500 words (or jurisdiction-specific minimum where higher)
   - Sections `## 1.`, `## 2.`, …, `## Signatures`, and `IMPORTANT LEGAL NOTICE`
   - At least 5 dynamic placeholders (`{{variable}}`) tied to schema/questions
2. Ensure bilingual parity (EN & ES) for high-volume templates before launch.
3. Restore passing `npm run verify-templates` and eliminate duplicate content warnings.

## Remediation Workstream
| Phase | Tasks | Owner | Dependencies |
|-------|-------|-------|--------------|
| Inventory | 1. Use `template-placeholder-audit.csv` for word count/variables summary<br>2. Prioritize top 20 templates (traffic, core workflows) | Doc Intelligence | Content prioritization from Growth, Legal |
| Drafting | 1. Author or license production-ready content<br>2. Tag variables to match existing schema keys<br>3. Add jurisdiction call-outs where needed | Doc Intelligence + Legal collaborators | Conditional formatting guidance from Compliance |
| Review | 1. Legal peer review for accuracy and disclaimers<br>2. Localization vendor engagement for ES parity<br>3. Accessibility/readability check (e.g., Markdown lint) | Legal Ops, Localization | Contracted vendor availability |
| Verification | 1. Run `npm run verify-templates` after each batch<br>2. Address warnings (missing sections, duplicates)<br>3. Update `template-placeholder-audit.csv` snapshots | Doc Intelligence | QA sign-off |
| Release | 1. Update memory & Remember.md via CEO cycle<br>2. Prep changelog & release notes | Doc Intelligence + CEO | | 

## Immediate Next Actions (Week 1)
1. Confirm priority list with Legal/Growth (service agreement, demand letter, NDA, promissory note, bill of sale, lease).
2. Allocate drafting workload (internal counsel vs. licensed content provider).
3. Establish translation pipeline (ES) and QA timeline.
4. Deliver first batch (≥5 templates) and re-run verifier to validate structure before scaling.

## Risks & Mitigations
- **Content sourcing delay:** Engage external provider / license library; escalate to CEO if procurement needed.
- **Variable mismatches:** Align with existing schema or update schema/questions concurrently.
- **ES parity lag:** Queue localization immediately after EN drafting; consider interim machine translation marked for human review.
- **Verification tool changes:** Maintain close sync with tooling team to keep section/variable requirements stable.

## Tracking
- Store ongoing progress updates in `ops/artifacts/document-intel-cycle-0007/template-remediation-progress.csv` (to be created once drafting starts).
- Document completed templates and reviewers for audit purposes.

