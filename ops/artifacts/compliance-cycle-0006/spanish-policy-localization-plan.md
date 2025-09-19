# Spanish Policy Localization Plan - 2025-09-19

- **Cycle**: compliance-cycle-0006
- **Scope**: docs/legal/disclaimer.md, docs/legal/terms-of-service.md, docs/legal/privacy-notice.md, docs/legal/refund-policy.md
- **Objective**: Deliver certified Spanish translations aligned with UPL, consumer protection, and privacy obligations prior to release gate sign-off.

## Regulatory References
- ABA Model Rule 5.5; Texas Government Code Section 81.101 (UPL disclosures for nonlawyer services).
- CCPA Sections 1798.100-1798.185 and 1798.130(a)(2) bilingual notice requirements for prevalent languages.
- FTC .com Disclosures and California Civil Code Section 1723 for refund policy transparency.
- GDPR Articles 12-14 (clear, accessible privacy notices) for international readiness baseline.

## Workflow Overview
1. **Source of Truth Extraction** (Owner: Compliance)
   - Confirm latest English markdown in docs/legal/*.md matches policy freshness audit (ops/artifacts/compliance-cycle-0005/policy-freshness-audit.md).
   - Lock version hashes in checksums before translation handoff.
2. **Translation Drafting** (Owner: Certified translator + Compliance reviewer)
   - Produce formal Spanish translation for each policy with bilingual table capturing defined terms.
   - Maintain markdown structure, headings, and internal links.
3. **Legal QA & Counsel Review** (Owner: Compliance lead + external counsel)
   - Validate jurisdiction-specific clauses (California, Texas, Florida, New York, Illinois) using ops/compliance/jurisdiction-us-baseline.md.
   - Confirm disclaimers preserve "no attorney-client relationship" language and mandatory warnings.
4. **Accessibility & Product Integration** (Owner: Platform + Growth)
   - Surface version metadata (last updated date, review owner) in UI for both languages.
   - Ensure links route to /es/ localized pages and include hreflang annotations.
5. **Release Gate Evidence Packaging** (Owner: Compliance)
   - Store translated policies under docs/legal/es/ with parallel filenames.
   - Generate bilingual verification artifact ops/artifacts/compliance-cycle-0006/policy-translation-signoff.md once approvals complete.

## Policy-Level Tasks
| Policy | Translation Tasks | Legal Checks | Product Actions | Target Date | Owners |
| --- | --- | --- | --- | --- | --- |
| Disclaimer | Translate full body; add jurisdiction footnotes for CA, TX, FL notices. | Verify Probate Code warnings (CA) and nonlawyer disclosures (FL). | Update footer links and onboarding disclosures. | 2025-09-23 | Compliance (content), Platform (UI) |
| Terms of Service | Translate clauses, maintain arbitration and waiver language accuracy. | Ensure dispute resolution and refund references align with Spanish copy. | Surface bilingual modal summaries during checkout. | 2025-09-24 | Compliance + Legal Counsel |
| Privacy Notice | Translate sections, preserve defined terms and rights table. | Check DSAR instructions and opt-out language meet CCPA Section 1798.130. | Link DSAR form and cookie banner Spanish controls. | 2025-09-24 | Privacy Officer + Platform |
| Refund Policy | Translate guarantee, eligibility, and exclusions. | Confirm 30-day guarantee, non-refundable scenarios, and statutory rights. | Sync with Payments refund SOP and support scripts. | 2025-09-25 | Compliance + Payments |

## Quality Checklist
- [ ] Spanish translations peer-reviewed by bilingual attorney or certified translator.
- [ ] Terminology glossary maintained in ops/compliance/policy-glossary-es.json (to be created).
- [ ] All legal references cited inline with footnotes where jurisdiction-specific.
- [ ] Markdown lint and build checks pass (npm run lint, npm run typecheck if required).
- [ ] Release gate checklist updated with Spanish policy evidence paths.

## Risks & Mitigations
- **Risk**: Delay in certified translator availability.
  - *Mitigation*: Engage Redwood Legal LLP bilingual associate on standby; document SLA in vendor tracker.
- **Risk**: Divergence between product copy and policy language.
  - *Mitigation*: Require Growth pod to submit marketing copy diff for compliance review before publishing Spanish funnels.
- **Risk**: Platform integration lag for locale routing.
  - *Mitigation*: Track via Remember.md pending tasks; escalate during go/no-go if not complete by 2025-09-25.

## Deliverables & Artifacts
- Translated markdown files under docs/legal/es/.
- Approval log: ops/artifacts/compliance-cycle-0006/policy-translation-signoff.md.
- Updated release gate checklist referencing bilingual evidence.
- Glossary file: ops/compliance/policy-glossary-es.json containing term mappings.

## Next Steps
1. Compile glossary of recurring terms (for example, "refund", "garantia", "aviso de privacidad").
2. Kick off translation with Redwood Legal LLP; attach engagement confirmation to artifact.
3. Schedule Platform + Growth sync to confirm UI rollout timeline and cookie banner localization.
