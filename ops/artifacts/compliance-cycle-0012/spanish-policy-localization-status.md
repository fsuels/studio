# Spanish Policy Localization Status - 2025-09-19

- Cycle: compliance-cycle-0012
- Prepared: 2025-09-19T18:51:21.4230470Z (UTC)
- References: ops/artifacts/compliance-cycle-0006/spanish-policy-localization-plan.md; ops/compliance/policy-glossary-es.json; ABA Model Rule 5.5; CCPA Section 1798.130(a)(2); FTC .com Disclosures

## Summary
Certified Spanish translations for the core policy stack were delivered by Redwood Legal LLP on 2025-09-19. Hashes are recorded in ops/artifacts/compliance-cycle-0014/policy-translation-receipt-template.md and release gate evidence has been updated.

## Policy Status
| Policy | SHA256 (2025-09-19) | Translator Status | Compliance Notes | Next Action / Owner | Target |
| --- | --- | --- | --- | --- | --- |
| docs/legal/disclaimer.md | D70C37A143C4460E51DD5A339860C72BDC004B5B5A48FD366A25068E67EDBA6F | Delivered by Redwood Legal LLP (María Santos) | Must preserve "no attorney-client relationship" language per ABA Model Rule 5.5 and Texas Gov. Code Section 81.101 disclosures. | Archive certification PDF and update translation-approval-log.md (Compliance). | 2025-09-23 |
| docs/legal/terms-of-service.md | 93CD66DCBD30D1815A0CC1487A1FB208C4AF0E5C1862BD31DA8106174D5A55FE | Delivered and verified | Arbitration + waiver sections require bilingual parity for enforceability; align with jurisdiction notices in ops/compliance/jurisdiction-us-baseline.md. | Update translation-approval-log.md with counsel confirmation (Compliance + Counsel). | 2025-09-24 |
| docs/legal/privacy-notice.md | 16E326597981B51BCECA745CBD869D3E0B4028AB3367F67C761D8174E201E44D | Delivered and verified | CCPA Section 1798.130(a)(2) mandates Spanish access when targeted; DSAR instructions must stay synchronized with ops/artifacts/compliance-cycle-0010/dsar-dry-run-prep.md. | Monitor DSAR acknowledgment template usage for QA (Compliance). | 2025-09-24 |
| docs/legal/refund-policy.md | 91976662AB05C40480CF253C25543EE5C20ADFA0F069035CC624E088DD6BFCCF | Delivered and verified | Must align with FTC .com Disclosures and California Civil Code Section 1723; payments integration blocked until translations confirmed. | Coordinate con Payments para alinear SOP de reembolsos con traducción publicada (Compliance + Payments). | 2025-09-25 |

## Required Evidence Before Release Freeze
- Translator confirmation email saved to ops/artifacts/compliance-cycle-0009/translation-approvals/email-2025-09-19.pdf.
- Certified translation PDFs with license metadata per translator log.
- Markdown files under docs/legal/es/ mirroring English structure.
- Updated release gate checklist entries referencing bilingual evidence paths.

## Risks & Mitigations
- **Risk:** Falta registrar PDFs firmados y confirmations de consejero. *Mitigación:* archivar certificaciones y correo de aprobación en translation approvals y en release gate checklist.
- **Risk:** Glossary drift once translations delivered. *Mitigation:* schedule sync with Growth & Platform to lock terminology, update policy-glossary-es.json if new terms emerge.
- **Risk:** Product surface lag for Spanish policy links. *Mitigation:* coordinate with Platform using ops/artifacts/compliance-cycle-0011/policy-linking-plan.md milestones; capture evidence in release gate tracker.

## Immediate Next Steps
1. Distribuir traducciones a Platform/Growth y adjuntar certificaciones al tracker.
2. Usar plantilla bilingüe existente para la ejecución del DSAR dry run.
3. Mantener README actualizado y asegurar hreflang/UI se actualicen con nuevas rutas.
