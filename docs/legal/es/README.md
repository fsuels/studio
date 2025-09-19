# Spanish Policy Staging Instructions

Prepared: 2025-09-19T19:45:06.9256728Z (UTC)
Cycle: compliance-cycle-0013
References: ops/artifacts/compliance-cycle-0006/spanish-policy-localization-plan.md; ops/compliance/bilingual-policy-rollout-checklist.md; ops/artifacts/compliance-cycle-0012/spanish-policy-localization-status.md; ops/artifacts/compliance-cycle-0012/release-gate-status-2025-09-26.md

## Folder Expectations
- Place certified Spanish markdown files here using the same filenames as English originals (e.g., disclaimer.md, terms-of-service.md, privacy-notice.md, refund-policy.md).
- Store translator-provided PDFs under ops/artifacts/compliance-cycle-0009/translation-approvals/ and cross-link the filenames in translation-approval-log.md.
- Each markdown file must include a frontmatter block with fields "title", "last_reviewed", and "translator_cert" so policy loaders retain parity.

## Pre-Commit Checklist
- [ ] Verify hashes of English sources (see spanish-policy-localization-status.md) before publishing Spanish counterparts.
- [ ] Run "npm run lint docs/legal" to ensure formatting compatibility with the markdown pipeline.
- [ ] Update ops/compliance/policy-glossary-es.json if new terminology is introduced.
- [ ] Record artifact paths and hashes in ops/artifacts/compliance-cycle-0013/policy-translation-receipt.md (to be created upon delivery).

## Release Gate Alignment
- Link these files in ops/compliance/release-gate-checklist.md under UPL, Privacy, Marketing, and Payments evidence once translations land.
- Notify Platform to wire footer/UI links (Remember.md pending tasks) and capture screenshots for ops/artifacts/compliance-cycle-0013 once implemented.
- Provide Growth with final URLs for marketing copy localization and consent banner references.

## Operational Notes
- Keep this README updated as additional locales or policy types are added.
- Back up certified translations to secure storage per ops/compliance/dsar-sop.md retention guidance.
