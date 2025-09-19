# Legal Incident Log Template

> Record every compliance or regulatory incident within 24 hours of discovery (GDPR Art.33; CCPA Section 1798.82). Duplicate this template per incident or append rows to the log below. Store evidence under `ops/artifacts/<cycle>/incidents/`. See the contact roster in `ops/compliance/legal-incident-contacts.md` for the latest escalation details.

## Intake Checklist
- [ ] Incident categorized (UPL, privacy, marketing, payments, other)
- [ ] Reporter contact captured
- [ ] Time of discovery logged in UTC
- [ ] Impacted jurisdictions identified
- [ ] Immediate containment actions documented
- [ ] Notification obligations evaluated (state AG, regulators, users)

## Incident Log
| Incident ID | Date Reported (UTC) | Reporter / Source | Category | Severity (Low/Med/High) | Jurisdiction(s) | Summary | Immediate Actions | Notification Required (Y/N) | Owner | Status | Closure Date | Artifact Path |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |  |  |

## Post-Mortem Requirements
- [ ] Root cause analysis completed within 5 business days
- [ ] Remediation plan approved by Compliance lead
- [ ] Lessons learned shared with relevant pods
- [ ] Memory.md and Remember.md updated with outcomes

## Escalation Contacts
| Role | Name | Channel |
| --- | --- | --- |
| Compliance Lead | Jordan Ellis | jordan.ellis@123legaldoc.com / Slack #compliance-ops |
| CEO | Morgan Alvarez | morgan.alvarez@123legaldoc.com |
| External Counsel | Redwood Legal LLP | breachdesk@redwood-legal.com |
| Platform On-Call | See ops/platform/oncall.md | PagerDuty: platform-oncall |
| Privacy Officer | Luis Martinez | privacy@123legaldoc.com |
| Customer Support Lead | Taylor Brooks | support@123legaldoc.com |
| Payments Compliance | Sarah Kim | payments@123legaldoc.com |

## Storage & Versioning
- Store the active log at `ops/compliance/legal-incident-log.md`.
- Archive closed incidents quarterly to `ops/archive/legal-incidents/<year>-<quarter>.md`.
- Reference artifact hashes in Memory.md for auditability.

