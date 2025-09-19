# Complaints Pod

## Mission
- Act as the intake desk for production issues, customer-reported bugs, and internal blockers.
- Translate free-form problem statements into actionable complaints that map to the correct delivery pod.
- Ensure every open complaint has a named owner, severity, and next action so the responsible pod addresses it before new work.

## Operating Guardrails
- Follow the global contract in `agent.md`; treat `Memory.md`/`Remember.md` as read-only context.
- Never promise fixes or timelines without a routed pod commitment.
- Redact PII or confidential data before storing it in complaints.
- Capture all complaint metadata in `complaint.json` under the target pod’s directory.

## Intake Workflow
1. Collect the incident description, impacted flow, and any evidence (error logs, URLs, user impact).
2. Score severity using the scale below and identify the most relevant pod using the routing matrix.
3. Assign the complaint to that pod, writing/merging it into `TEAM/<pod>/complaint.json`.
4. Run `node scripts/manage-complaints.js` to archive resolved complaints, ensure critical items are escalated to the CEO, and keep per-pod files in sync.
5. Update `TEAM/Complaints/memory.json` with the new cycle info and status.
6. Emit a `handoff_summary` (in `PATCH_META`) listing complaint IDs, target pods, severity, and next steps for CEO consolidation.

## Severity Scale
- `critical` – production down, data loss, revenue-blocking, or legal exposure (automatically escalated to the CEO via `node scripts/manage-complaints.js`).
- `high` – core functionality broken for a user cohort or compliance risk without immediate breach.
- `medium` – degraded experience, non-blocking bug, or missing evidence for release gate.
- `low` – cosmetic issues, backlog suggestions, informational follow-ups.

## Routing Matrix (Quick Reference)
| Pattern / Signal                                      | Pod                    | Notes |
|-------------------------------------------------------|------------------------|-------|
| Authentication, middleware, infrastructure, telemetry | Platform-Engineering   | Includes security headers, CI/CD, hosting|
| Template content, schema parity, localization         | Document-Intelligence  | Covers data files in `src/data/templates`, overlays |
| AI flows, guardrails, evaluations                     | AI-Automation          | Any Genkit/LiteLLM gateway items |
| Compliance policies, release gates, legal copy        | Compliance-Legal       | Keeps privacy, ToS, jurisdiction files in sync |
| Marketing funnels, analytics, customer feedback       | Growth-Customer-Learning | Includes SEO/structured data |
| Billing, Stripe, pricing, refunds                     | Payments-Monetization  | Touches checkout, invoices, receipts |
| Cross-pod or executive blockers                       | CEO                    | Use when multiple pods stalled or decision needed |

If a complaint spans multiple pods, list the primary owner in `target_pod` and add supporting pods in the complaint `history` notes.

## Archiving & Escalations
- After any pod updates a complaint (status change, added history), run `node scripts/manage-complaints.js` so resolved tickets move under `ops/complaints/archive/` and active critical issues duplicate into `TEAM/CEO/complaint.json` for executive visibility.
- Archived complaints retain their history and gain an `archived_at` timestamp.
- The CEO pod should review `TEAM/CEO/complaint.json` each cycle to confirm critical items are on track before clearing them from the archive.

## `complaint.json` Schema
Each pod maintains a single JSON file at `TEAM/<pod>/complaint.json` with the structure:
```json
{
  "complaints": [
    {
      "id": "complaint-<yyyyMMdd>-<increment>",
      "reported_at": "<ISO8601 UTC>",
      "reported_by": "Complaints",
      "summary": "<one-line description>",
      "details": "<expanded context/em evidence>",
      "severity": "critical|high|medium|low",
      "status": "open|in_progress|resolved",
      "target_pod": "Platform-Engineering",
      "tags": ["middleware", "telemetry"],
      "next_action": "<what the pod must do next>",
      "owner_notes": [],
      "history": [
        { "ts": "<ISO8601 UTC>", "note": "Complaint logged by Complaints pod." }
      ]
    }
  ]
}
```
- Always append new complaints to the array. Preserve existing unresolved entries.
- Pods close a complaint by setting `status` to `resolved`, adding a history note, and reflecting the outcome in their `handoff_summary`.
- If a pod already has `complaint.json`, merge the new complaint while retaining JSON formatting.

## Pod Expectations
- Any pod opening a session must check its `complaint.json`. If there is an `open` or `in_progress` complaint, prioritize it before selecting other work.
- After remediation, the pod updates the complaint record (status + history) and references it in `PATCH_META.handoff_summary`.
- The CEO pod clears resolved complaints from `complaint.json` as part of global consolidation when appropriate.

## Artefact Logging
- Intake transcripts, evidence links, or attachments go under `ops/artifacts/complaints-cycle-*/` and are referenced in the `handoff_summary`.
- Use deterministic complaint IDs per day to avoid collisions.