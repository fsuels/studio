# Spanish Policy Localization Status - 2025-09-19

- Cycle: compliance-cycle-0012
- Prepared: 2025-09-19T18:49:00.2231553Z (UTC)
- References: ops/artifacts/compliance-cycle-0006/spanish-policy-localization-plan.md; ops/compliance/policy-glossary-es.json; ABA Model Rule 5.5; CCPA Section 1798.130(a)(2); FTC .com Disclosures

## Summary
Translations for the core policy stack remain pending confirmation from Redwood Legal LLP. Certified Spanish copies are required to satisfy CCPA bilingual notice obligations and ensure disclaimers stay within unauthorized practice of law safe harbors. Terminology alignment is ready via the maintained glossary, but we must capture translator acceptance, delivery dates, and approval routing before the 2025-09-26 release freeze.

## Policy Status
| Policy | SHA256 (2025-09-19) | Translator Status | Compliance Notes | Next Action / Owner | Target |
| --- | --- | --- | --- | --- | --- |
| docs/legal/disclaimer.md | D70C37A143C4460E51DD5A339860C72BDC004B5B5A48FD366A25068E67EDBA6F | Request sent to Redwood Legal LLP (María Santos) | Must preserve "no attorney-client relationship" language per ABA Model Rule 5.5 and Texas Gov. Code §81.101 disclosures. | Confirm receipt + delivery ETA; record in ops/artifacts/compliance-cycle-0009/translation-approvals/disclaimer-signoff.pdf (Compliance). | 2025-09-23 |
| docs/legal/terms-of-service.md | 93CD66DCBD30D1815A0CC1487A1FB208C4AF0E5C1862BD31DA8106174D5A55FE | Request sent; awaiting acceptance | Arbitration + waiver sections require bilingual parity for enforceability; align with jurisdiction notices in ops/compliance/jurisdiction-us-baseline.md. | Log translator confirmation and assign counsel reviewer once ETA received (Compliance + Counsel). | 2025-09-24 |
| docs/legal/privacy-notice.md | 16E326597981B51BCECA745CBD869D3E0B4028AB3367F67C761D8174E201E44D | Request sent; awaiting acceptance | CCPA §1798.130(a)(2) mandates Spanish access when targeted; DSAR instructions must stay synchronized with ops/artifacts/compliance-cycle-0010/dsar-dry-run-prep.md. | Request sample section for QA and queue bilingual DSAR acknowledgment template (Compliance). | 2025-09-24 |
| docs/legal/refund-policy.md | 91976662AB05C40480CF253C25543EE5C20ADFA0F069035CC624E088DD6BFCCF | Request sent; awaiting acceptance | Must align with FTC .com Disclosures and California Civil Code §1723; payments integration blocked until translations confirmed. | Coordinate with Payments on refund SOP draft while awaiting translation (Compliance + Payments). | 2025-09-25 |

## Required Evidence Before Release Freeze
- Translator confirmation email saved to ops/artifacts/compliance-cycle-0009/translation-approvals/email-2025-09-19.pdf.
- Certified translation PDFs with license metadata per translator log.
- Markdown files under docs/legal/es/ mirroring English structure.
- Updated release gate checklist entries referencing bilingual evidence paths.

## Risks & Mitigations
- **Risk:** No translator acknowledgment yet; delays jeopardize compliance freeze. *Mitigation:* escalate to Redwood Legal LLP by 2025-09-20 COB; prepare alternate vendor list from ops/compliance/translation-vendors.md.
- **Risk:** Glossary drift once translations delivered. *Mitigation:* schedule sync with Growth & Platform to lock terminology, update policy-glossary-es.json if new terms emerge.
- **Risk:** Product surface lag for Spanish policy links. *Mitigation:* coordinate with Platform using ops/artifacts/compliance-cycle-0011/policy-linking-plan.md milestones; capture evidence in release gate tracker.

## Immediate Next Steps
1. Send receipt confirmation follow-up to Redwood Legal LLP and log response in translation approval tracker.
2. Draft bilingual DSAR acknowledgment template referencing privacy notice translation to unblock dry run evidence.
3. Prep docs/legal/es/ staging folder with README on approved commit process once translations arrive.