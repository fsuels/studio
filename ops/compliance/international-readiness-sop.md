# International Readiness SOP (Draft)

_Last updated: 2025-09-19T18:15:00Z (UTC)_

## Scope
Outline controls required before expanding 123LegalDoc into jurisdictions outside the U.S. Initial focus: EU/EEA (GDPR), UK (UK GDPR/ICO), Canada (PIPEDA).

## Readiness Checklist
1. **Data Mapping & Lawful Basis**
   - Complete data inventory for personal data categories, processing purposes, storage locations.
   - Identify lawful bases (GDPR Art. 6) and document legitimate interest assessments where applicable.
2. **Cross-Border Transfers**
   - Determine transfer mechanism (SCCs, UK IDTA, DPF participation).
   - Execute Data Processing Agreements with vendors; store signed copies under ops/compliance/vendor-dpa/.
   - Maintain Transfer Impact Assessments for high-risk transfers.
3. **Data Subject Rights**
   - Localize DSAR workflows for EU/UK/Canada (language, statutory timelines).
   - Provide in-product access to privacy dashboard; ensure bilingual support.
4. **Localization Requirements**
   - Translate policies and key UX flows into required languages (French for Canada, Spanish for EU markets as needed).
   - Review marketing claims and pricing disclosures for local consumer law.
5. **Security & Incident Response**
   - Confirm breach notification playbook covers EU/UK CA timelines (72 hours to regulators, etc.).
   - Align logging/telemetry with regional data minimization requirements.
6. **Vendor & Subprocessor Review**
   - Maintain subprocessor register with jurisdiction coverage and transfer mechanism.
   - Require vendor SOC2/ISO evidence or equivalent.
7. **Regulatory Engagement**
   - Identify local counsel and DPO requirements; document point of contact.
   - Prepare standard templates for regulator responses.

## Process Flow
1. Kickoff readiness assessment; assign workstream owners (Compliance, Platform, Growth, Legal Counsel).
2. Complete checklist items with evidence stored in ops/artifacts/<cycle>/international-readiness/.
3. Submit findings to CEO pod for go/no-go decision.
4. Monitor ongoing compliance via quarterly reviews.

## Notes
- Expand SOP with detailed templates per jurisdiction once initial assessment begins.
- Link DSAR and translation artifacts when localized flows are ready.