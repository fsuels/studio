# Legal Change Monitoring Feed

Last updated: 2025-09-19

## Overview
Daily monitoring workflow that aggregates statutory and regulatory changes, routes urgent updates to the appropriate pod, and archives evidence under `ops/artifacts/<cycle-id>/legal-change/`. The digest covers UPL, privacy, marketing, and payments topics.

## Inputs
| Source | Coverage | Polling Method | Owner |
| --- | --- | --- | --- |
| Fastcase alerts | State legislative updates, case law impacting self-help services | Saved searches exported daily (07:15 CT) | Compliance Ops |
| LexisNexis API | Attorney General press releases, regulatory enforcement | Scheduled job via `scripts/legal-update-ingest.ts` | Document Intelligence |
| State RSS feeds | Secretary of State bulletins, consumer protection advisories | `ops/scripts/state-bulletins.yaml` (cron @ 07:30 CT) | Platform |
| FTC / CFPB newsroom | Federal marketing and refund enforcement | Manual review by 08:00 CT | Growth |
| Zendesk escalations tag `legal_change` | Customer-reported issues | Automated via Zendesk trigger to Slack webhook | CX Lead |

## Daily Workflow
1. **07:00-07:10 CT** - Compliance Ops verifies ingest jobs succeeded (`npm run legal-check`). Failures are logged in `ops/runbooks/legal-feed-triage.md`.
2. **07:30 CT** - Draft digest assembled via `scripts/generate-legal-digest.ts` (outputs Markdown to `ops/tmp/legal-digest.md`).
3. **08:00 CT** - Compliance review (10 minute SLA) to:
   - Tag each item severity (`critical`, `watch`, `info`).
   - Assign follow-up owners (Document Intelligence, Growth, Platform, Payments).
   - Attach relevant statutes or docket numbers.
4. **08:10 CT** - Publish digest to Slack channel `#compliance-alerts` with CC to `#exec-briefing`. Include link to archived Markdown under `ops/artifacts/<cycle-id>/legal-change/<date>.md`.
5. **08:30 CT** - If any item severity `critical`, open PagerDuty incident "LEGAL-CHANGE" with summary and owner, then inform CEO via direct ping.
6. **Throughout day** - Owners update status column in the digest file; Compliance posts completion reactions in Slack thread.

## Escalation Matrix
| Severity | Response | Escalation |
| --- | --- | --- |
| Critical (statutory change in live market, regulator outreach) | Freeze affected experience; convene legal incident bridge within 30 minutes. | CEO, General Counsel (outside), Platform lead |
| High (new disclosure requirement, enforcement trend) | Prioritize in next release train; update knowledge base within 1 business day. | Compliance Director, Document Intelligence PM |
| Medium (proposed legislation, advisory opinions) | Track in backlog; monitor for movement; note in weekly risk brief. | Compliance Ops |
| Informational | Archive only; no action. | N/A |

## Archiving & Evidence
- Store signed-off digest under `ops/artifacts/<cycle-id>/legal-change/YYYY-MM-DD.md`.
- Include source URLs, download timestamps, and assigned owner for traceability.
- Link relevant policy or workflow changes once shipped for audit trail continuity.

## Automation Backlog
- [ ] Convert Fastcase & LexisNexis ingests to scheduled GitHub Action (target 2025-10-15).
- [ ] Add sentiment/keyword scoring to highlight UPL red flags automatically.
- [ ] Pipe digest metadata into BigQuery for trend reporting.

## Example Digest Snippet
```
## 2025-09-19 Digest
- [CRITICAL][WA] RCW 2.48 amendment adds Spanish notice requirement. Owner: Document Intelligence. ETA: 2025-09-20.
- [HIGH][CA] DOJ guidance on refund disclosures; update refund policy section 2. Owner: Compliance Ops.
- [INFO][US] FTC blog reiterates AI marketing substantiation expectations.
```
