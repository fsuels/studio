# Release Train Compliance Gate Template

Copy this template to the current cycle directory (for example `ops/artifacts/compliance-cycle-0011/`) and complete before the release go/no-go meeting.

## Cycle Metadata
| Field | Value |
| --- | --- |
| Cycle ID | `compliance-cycle-____` |
| Release window | |
| Release train owner | |
| Compliance lead | |
| Change summary | |
| Jira/Tracker link | |

## Readiness Checklist (High-Level)
- [ ] All policy updates merged to `main` and deployed to staging
- [ ] Release notes include customer-facing legal copy changes
- [ ] Regression tests covering regulated workflows are green
- [ ] All checklist artifacts stored under `ops/artifacts/<cycle-id>/`

## Gate 1 - Unauthorized Practice of Law (UPL)
| Item | Owner | Evidence (path or link) | Status |
| --- | --- | --- | --- |
| Wizard copy reviewed for disclaimer language | | `ops/artifacts/<cycle-id>/upl/wizard-copy-____.pdf` | [ ]
| Attorney referral flows validated | | | [ ]
| High-risk template diffs reviewed by counsel | | | [ ]
| UPL risk log updated | | `ops/compliance/upl-risk-log.md` | [ ]

Notes:

## Gate 2 - Marketing & Claims Review
| Item | Owner | Evidence | Status |
| --- | --- | --- | --- |
| Landing pages diff scan reviewed | | `ops/artifacts/<cycle-id>/marketing/diff-report.md` | [ ]
| Paid media & email copy approved | | | [ ]
| Testimonials & pricing claims verified | | | [ ]
| SEO content spot-check complete | | | [ ]

Notes:

## Gate 3 - Privacy & Data Protection
| Item | Owner | Evidence | Status |
| --- | --- | --- | --- |
| Privacy Notice changes logged & published | | `ops/artifacts/<cycle-id>/privacy/privacy-notice-diff.md` | [ ]
| Data capture changes assessed (PIA) | | `ops/artifacts/<cycle-id>/privacy/pia-summary.md` | [ ]
| Cookie/banner updates validated in staging | | | [ ]
| Incident queue & DSAR backlog reviewed | | | [ ]

Notes:

## Gate 4 - Payments & Refund Experience
| Item | Owner | Evidence | Status |
| --- | --- | --- | --- |
| Checkout disclosures match policy versions | | screenshots in `ops/artifacts/<cycle-id>/payments/` | [ ]
| Refund policy surfaced in receipt & help center | | | [ ]
| Chargeback/negative option review complete | | | [ ]

Notes:

## Gate 5 - Localization & Jurisdictional Coverage
| Item | Owner | Evidence | Status |
| --- | --- | --- | --- |
| State-specific notices verified | | matrix export attached | [ ]
| Spanish policy parity check | | `ops/artifacts/<cycle-id>/localization/spanish-diff.md` | [ ]
| International blockers logged | | | [ ]

Notes:

## Gate 6 - Approvals & Communication
| Item | Owner | Evidence | Status |
| --- | --- | --- | --- |
| Legal/compliance sign-off recorded | | signed PDF in cycle folder | [ ]
| Release train go/no-go decision | | meeting notes | [ ]
| Stakeholder broadcast drafted | | | [ ]

Notes:

## Artifact Index
| Artifact | Expected Location |
| --- | --- |
| Signed gate decision | `ops/artifacts/<cycle-id>/release-train-decision.pdf` |
| Policy diff bundle | `ops/artifacts/<cycle-id>/policy-diffs/` |
| Checklists (this file) | `ops/artifacts/<cycle-id>/release-train-checklist.md` |
| Incident & risk snapshot | `ops/artifacts/<cycle-id>/risk-snapshot.md` |

## Sign-Off
| Role | Name | Date | Signature |
| --- | --- | --- | --- |
| Compliance lead | | | |
| Release train owner | | | |
| Product/Engineering approver | | | |

## Retro Notes & Follow-Ups
- [ ] Backlog item(s) created for deferred mitigations
- [ ] Policy freshness tracker updated
- [ ] Lessons learned distributed to stakeholders
