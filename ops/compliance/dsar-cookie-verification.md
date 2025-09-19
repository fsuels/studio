# DSAR & Cookie Banner Verification Checklist

- **Cycle**: compliance-cycle-0006
- **Last Reviewed**: 2025-09-19 (UTC)
- **References**: GDPR Articles 12-23, CCPA Sections 1798.100-1798.135, CPRA Regulations 7025-7028, ePrivacy Directive (cookie consent).

## 1. DSAR Intake & Response
| Item | Requirement | Evidence Path | Owner | Status |
| --- | --- | --- | --- | --- |
| Intake Channels | Confirm in-product privacy dashboard plus email privacy@123legaldoc.com route to Zendesk/Jira workflow. | Screenshots and ticket automation export | Platform + Privacy Officer | Pending |
| Identity Verification | Document process (knowledge-based checks or email confirmation) per GDPR Article 12(6) and CCPA Section 1798.130(a)(2). | SOP attachment ops/compliance/dsar-sop.md (to create) | Compliance | Pending |
| Response Timeline | Track timers (45 days EU, 45 days California with 45-day extension) in DSAR tracker. | DSAR queue export (CSV) | Privacy Officer | Pending |
| Data Delivery | Provide machine-readable format (JSON/CSV) and secure link (expires in 7 days). | Sample response package | Platform | Pending |
| Denial Handling | Capture refusal reasons (manifestly unfounded, excessive) with counsel review. | DSAR decision log | Compliance | Pending |

## 2. Consumer Rights Coverage
- [ ] Right to Know / Access (CCPA Sections 1798.110 and 1798.115) documented in privacy notice Spanish and English.
- [ ] Right to Delete (CCPA Section 1798.105) request flow validated.
- [ ] Right to Opt-Out / Do Not Sell or Share (CCPA Section 1798.120) toggle links localized.
- [ ] Right to Correct (CPRA Section 1798.106) guidance added to DSAR SOP.
- [ ] GDPR Articles 16-21 rights enumerated with refusal taxonomy reference.

## 3. Cookie Banner Verification
| Check | Requirement | Evidence | Owner | Status |
| --- | --- | --- | --- | --- |
| Consent Banner Copy | Ensure bilingual messaging (English/Spanish) summarizing purpose and options. | Banner screenshot plus copy doc | Platform + Growth | Pending |
| Categorized Controls | Provide accept all, reject all, and granular toggles per ePrivacy and GDPR guidance. | Functional test video | Platform | Pending |
| Consent Logging | Store consent records with timestamp, locale, device (GDPR Article 7(1)). | Telemetry export or database query | Platform | Pending |
| Preference Center | Allow user to revisit consent settings via footer link. | QA checklist | Platform | Pending |
| Auto-Blocking | Confirm non-essential scripts blocked until consent granted. | Tag manager config report | Platform | Pending |
| Cookie Inventory | Maintain inventory with purpose, retention, and provider; share with Compliance monthly. | ops/compliance/cookie-inventory.csv | Compliance | Pending |

## 4. Evidence Packaging (Release Gate Section 2)
- Assemble DSAR SOP, queue export, and sample response into ops/artifacts/compliance-cycle-0006/privacy-evidence/.
- Capture cookie banner screenshots (desktop and mobile) and attach hash list in ops/artifacts/compliance-cycle-0006/privacy-cookie-checklist.md.
- Update ops/compliance/release-gate-checklist.md Section 2 with new evidence paths.
- Add summary to Memory.md context evidence when release gate cleared.

## 5. Follow-Up Actions
1. Draft DSAR SOP (ops/compliance/dsar-sop.md) with request lifecycle, verification, fulfillment templates.
2. Coordinate with Platform Engineering on telemetry export for consent logging (align with GA4 ingestion work).
3. Work with Growth to translate cookie banner copy using term glossary from Spanish localization plan.
4. Schedule monthly audit reminder via incident tooling once roster integration is complete.

## Status Notes
- Current release freeze (week of 2025-09-22) cannot lift until DSAR evidence and cookie verification attached.
- Platform to provide telemetry artifacts by 2025-09-25; escalate to CEO pod if blocked.
