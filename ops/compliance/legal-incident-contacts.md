# Legal Incident Response Contacts & Archival SOP

_Last updated: 2025-09-19_

This roster supports the legal incident log at `ops/compliance/legal-incident-log.md` and establishes the storage cadence for completed records. It should be updated whenever ownership changes. Use this list when activating the incident response workflow (UPL, privacy breach, deceptive marketing, payments compliance, or other regulatory matters).

## 1. Primary Contacts
| Role | Name | Email / Channel | Responsibilities |
| --- | --- | --- | --- |
| Compliance Lead | Jordan Ellis | jordan.ellis@123legaldoc.com \| `#compliance-ops` Slack | Incident commander; determines notification obligations and regulator communications. |
| Deputy Compliance | Priya Shah | priya.shah@123legaldoc.com | Maintains legal incident log, coordinates evidence collection, manages follow-up tasks. |
| CEO | Morgan Alvarez | morgan.alvarez@123legaldoc.com | Executive escalation, external statements, board/regulator liaison. |
| Platform On-Call | Weekly rotation (see `ops/platform/oncall.md`) | PagerDuty: `platform-oncall` | Implements containment, gathers technical evidence, escalates security incidents. |
| Privacy Officer | Luis Martinez | privacy@123legaldoc.com | Oversees DPIA/PIA, advises on notification requirements, approves privacy communications. |
| Payments Compliance | Sarah Kim | payments@123legaldoc.com | Handles payment processor notifications, chargeback governance, card network escalations. |
| Customer Support Lead | Taylor Brooks | support@123legaldoc.com | Coordinates customer messaging, tracks inbound reports, logs refunds/credits. |
| External Counsel | Redwood Legal LLP | breachdesk@redwood-legal.com | Provides legal advice, drafts regulator notifications, privileged communications. |

## 2. Escalation Workflow
1. **Detection** - Any team member detecting a potential incident notifies Compliance Lead and logs an entry in `ops/compliance/legal-incident-log.md` within 4 hours.
2. **Triage Call** - Compliance Lead triggers an incident bridge in `#incident-bridge` Slack (Zoom link: `https://zoom.us/j/123legalops`). Attendance: Compliance, Platform on-call, Privacy Officer, and relevant pod leads.
3. **Documentation** - Deputy Compliance captures timeline, affected jurisdictions, and containment actions. Evidence stored under `ops/artifacts/<cycle>/incidents/<incident_id>/` with SHA256 checksums.
4. **Notification Decision** - Compliance Lead + Privacy Officer determine regulatory/user notice requirements (GDPR Art.33 within 72 hours; state breach laws vary). External counsel advises on content.
5. **Closure** - After remediation, Compliance Lead approves incident closure in the log, attaches post-mortem, and schedules backlog actions.

## 3. Archival Requirements
- **Active Log** - Maintain current quarter incidents in `ops/compliance/legal-incident-log.md`.
- **Quarterly Archive** - Within 10 business days after quarter end, move closed incidents to `ops/archive/legal-incidents/<year>-Q<quarter>.md` and update the checksum manifest.
- **Access Controls** - Archives should inherit repo permissions but be flagged in PR descriptions for legal review.
- **Retention Period** - Retain incident archives for minimum 7 years to satisfy regulatory inquiries and litigation holds.

## 4. Checklist Integration
- Release gate Section 5 ("Security & Incident Readiness") now references this roster; confirm contact data is current during weekly checklist reviews.
- Attach incident artifacts paths to Memory.md entries when an incident occurs, referencing the relevant archive file once created.

## 5. Change Management
- Update this roster anytime personnel, email aliases, or service providers change. Document revisions in `ops/artifacts/<cycle>/` with checksums.
- Notify CEO and Platform leads of roster updates via Slack `#compliance-ops` channel.


## 6. Change Log
| Date | Change | Author |
| --- | --- | --- |
| 2025-09-19 | Initial roster and archival SOP published; escrow contacts recorded. | Compliance Ops |
