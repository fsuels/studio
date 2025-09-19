# Data Subject Access Request (DSAR) Standard Operating Procedure

_Last updated: 2025-09-19T17:00:00Z (UTC)_

## Regulatory References
- GDPR Articles 12-23 (EU 2016/679)
- California Consumer Privacy Act (CCPA) Sections 1798.100-1798.135 and California Privacy Rights Act (CPRA) Regulations 7025-7028
- Colorado Privacy Act (Colo. Rev. Stat. 6-1-1301 et seq.)
- Virginia Consumer Data Protection Act (Va. Code 59.1-575 et seq.)
- ePrivacy Directive 2002/58/EC (cookie consent telemetry)

## Purpose & Scope
This SOP governs how 123LegalDoc accepts, verifies, fulfills, and documents DSARs from consumers in jurisdictions where we operate. It applies to:
- Privacy dashboard DSAR submissions
- Email requests sent to privacy@123legaldoc.com
- Requests forwarded by support, platform, or legal escalation channels
- Requests in English and Spanish (leveraging the Spanish policy localization plan per ops/artifacts/compliance-cycle-0006/spanish-policy-localization-plan.md)

## Request Intake
1. **Capture Request Metadata**
   - Log all DSARs in Jira project `DSAR` with fields: requester name, contact email, jurisdiction, request type (access, delete, opt-out, correct, portability), submission channel, and timestamp.
   - Attach original request (email screenshot or dashboard submission JSON) to the Jira ticket.
2. **Automated Acknowledgment (within 24 hours)**
   - Use Zendesk automation to send bilingual (EN/ES) acknowledgment referencing GDPR Article 12(3) and CCPA Section 1798.130.
   - Include ticket reference number, verification requirements, and expected response window.
3. **Conflict Check**
   - Search for duplicate requests within the prior 60 days. If duplicate, mark the ticket with "Duplicate Request" and proceed to identity verification to determine if reuse of prior response is permissible.

## Identity Verification
1. **Risk-Based Approach (GDPR Article 12(6), CCPA Section 1798.130(a)(2))**
   - Low risk (access, portability): match email plus recent login metadata.
   - Medium risk (correction, delete): require confirmation from verified email and two knowledge-based questions (last document generated, billing ZIP).
   - High risk (financial, minors): require notarized affidavit or government-issued ID masked except name and address.
2. **Authorized Agents (CCPA Section 1798.105(c))**
   - Require power of attorney or written authorization plus consumer verification.
3. **Failed Verification**
   - If verification fails twice, escalate to Compliance lead; respond with partial denial citing relevant statute and invite resubmission with additional proof.
4. **Documentation**
   - Store verification evidence in encrypted OneDrive folder linked from the Jira ticket (access restricted to Compliance plus Privacy Officer).

## Response Timeline
- **GDPR**: Respond within one month of receipt; permissible extension up to two additional months for complex requests. Document extension rationale in Jira comment referencing Article 12(3).
- **CCPA/CPRA**: Respond within 45 days; one 45-day extension allowed. Record extension with reason under "Extension Justification" custom field.
- **Colorado CPA and VCDPA**: Respond within 45 days; extension up to 45 days with notification (Colo. Rev. Stat. 6-1-1306, Va. Code 59.1-578).
- Track timelines using Jira automation that triggers reminders at 15-, 30-, and 40-day marks.

## Fulfillment Workflow
1. **Scope Data Sources**
   - Inventory all systems with personal data: PostgreSQL production DB, Firebase auth logs, SendGrid, Stripe (if payments live), Intercom or Zendesk, analytics warehouse.
   - Add additional systems as they come online; update `ops/compliance/dsar-cookie-verification.md` Section 4 when new data sources are added.
2. **Coordinate with System Owners**
   - Platform: export account data (JSON plus CSV) and redact internal notes unrelated to the requester.
   - Growth: supply marketing interaction logs and cookie consent banner telemetry.
   - Payments: provide transaction history, refunds, and chargebacks (if applicable).
3. **Compile Response Package**
   - Assemble `00_cover_letter_EN|ES.md`, `01_data_access.json`, `02_data_access.csv`, and when applicable `03_action_confirmation.pdf` (for deletion or opt-out) in a secure SharePoint folder.
   - Encrypt the package using AES-256 zip with unique passphrase; share passphrase via separate email or secure messaging.
4. **Deliver Response**
   - Provide download link valid for seven days; log delivery timestamp in Jira.
   - Include statutory rights summary and contact for appeals (Colorado and Virginia require appeal process within 45 days).

## Denials and Appeals
1. **Grounds for Denial**
   - Manifestly unfounded or excessive requests (GDPR Article 12(5)).
   - Request beyond 12-month limit without verification (CCPA Section 1798.130(c)).
   - Conflicts with legal obligations (data retention laws, ongoing litigation holds).
2. **Process**
   - Draft denial template citing statute; obtain Compliance lead approval before sending.
   - Provide appeal instructions: for Colorado and Virginia, route to privacy@123legaldoc.com with subject "Appeal" and resolve within 45 days.
3. **Record Keeping**
   - Log denial reason, statute, and resolver in Jira custom fields; store supporting documentation in secure evidence folder.

## Special Cases
- **Minor Consumers**: Require parental or guardian verification consistent with COPPA (16 C.F.R. Part 312). Document method used (signed consent form or government ID).
- **Employee or Contractor Requests**: Route to HR privacy lead; apply local labor law requirements (California Labor Code 1198.5).
- **Data Portability**: Provide machine-readable format (JSON or CSV) and note systems not included due to technical feasibility limits.

## Evidence and Release Gate Integration
- Place completed DSAR packages under `ops/artifacts/compliance-cycle-0007/privacy-evidence/<ticket_id>/` with SHA256 checksums logged in the cycle checksum file.
- Update `ops/compliance/release-gate-checklist.md` Section 2 with ticket IDs once evidence stored.
- Reference this SOP in release gate artifacts (`ops/artifacts/compliance-cycle-0007/release-gate-status.md`).

## Training and Maintenance
- Train support, privacy, and platform teams quarterly; record attendance in LMS export saved to `ops/compliance/training/`.
- Review this SOP quarterly (align with policy freshness cadence) or upon new jurisdiction launch.
- Track changes in `ops/compliance/dsar-sop.md` via git history; archive superseded versions per compliance archive policy.

## Escalations and Contacts
- **Primary Owner**: Compliance and Legal Operations Lead (legal@123legaldoc.com).
- **Privacy Officer**: privacy@123legaldoc.com.
- **Platform Liaison**: platform-oncall@123legaldoc.com (ensures data exports and consent telemetry).
- **Outside Counsel**: escalate via CEO pod for regulator interactions.

## Appendices
- Appendix A: DSAR communication templates (stored separately in `ops/compliance/templates/dsar/`).
- Appendix B: Verification questions bank (restricted; see secure knowledge base).
- Appendix C: Glossary of terms aligning with Spanish localization glossary.
