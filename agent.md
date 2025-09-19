# AGENT.md - Codex Global Contract

## 1. Mission & Scope
- Build a bilingual, jurisdiction-aware self-help legal document platform. Launch with full U.S. coverage (English + Spanish), then expand internationally with local legal research.
- Provide guided automation, not legal advice. Always disclose that 123LegalDoc is not a law firm and no attorney-client relationship is formed.
- Safeguard users from unauthorized-practice-of-law, deceptive marketing, privacy, and warranty risks while delivering fast, compliant experiences.

## 2. Operating Principles
- Deterministic cycles: re-running with unchanged inputs must yield identical plans, diffs, and outputs.
- Context utilization: before Execute, fill 85-90% of the model window with relevant state, evidence, and plans (no filler). If below target, include high-signal artifacts (audit logs, parity diffs); if above 92%, compress lowest-priority context.
- Wall clock: complete each cycle within 5 minutes.
- Atomic writes: stage edits under `ops/tmp/`, fsync, then rename into place. Log checksums in `ops/artifacts/<cycle_id>/checksums.json`.
- Locks: acquire `ops/state/lock/codex.lock`; reclaim if stale (>15 min) and record in TRACE_EVENTS.
- Global state: CEO cycles own `Memory.md`/`Remember.md` updates; other pods treat them as read-only and submit handoff notes instead.
- Evidence-first: collect measurements (Lighthouse, axe, template parity, billing smoke tests) before claiming success.

## 3. Pod-Aligned Cycle Workflow
1. Acquire & Load - lock repository; load `Remember.md`, repo `Memory.md`, and relevant `TEAM/<pod>/memory.json`. Non-CEO pods must treat `Memory.md` and `Remember.md` as read-only context.
2. Discover - audit systems owned by the active pod (see `TEAM/<pod>/Start.MD`). Pull context from other pods if dependencies exist.
3. Score & Select (1-3 tasks) - use the prioritization rules in section 5. Tie-break deterministically.
4. Plan - produce an idempotent, step-by-step plan (via plan tool). Specify exact files and expected outcomes. Reference pod hand-offs when needed.
5. Execute - apply changes using atomic writes, respecting guardrails (security headers report-only first, no secrets, no UPL). Document actions in TRACE_EVENTS.
6. Verify - run required checks for the touched domain (CWV, axe, SEO, billing, template parity, etc.). Store artifacts under `ops/artifacts/<cycle_id>/` and list them in PR_DESC.
7. Persist & Handoff - update your pod `memory.json` with the new `cycle_id`, ISO-8601 UTC timestamps, notes, and follow-ups. Non-CEO pods DO NOT write to repo `Memory.md` or `Remember.md`; instead, capture handoff notes in outputs for the CEO cycle to merge. CEO sessions consolidate pod updates into the global files and prepare PR metadata (section 7).

Pod leads must start from their `TEAM/<pod>/Start.MD`, which references this contract and outlines pod-specific audits.

## 4. Collaboration & Handoff Rules
- Always read all `TEAM/*/memory.json` when acting as CEO or when pod work impacts another pod.
- Log cross-pod actions in the originating pod memory and flag them in handoff outputs so the CEO can update `Remember.md` under "Pending Cross-Pod Tasks".
- Escalate compliance or safety risks immediately to the CEO pod (update `TEAM/CEO/memory.json`).

## 5. Prioritization Formula (Deterministic)
Let `p` be in [0.2, 0.95], `impact`, `urgency`, `cost` in {1..5}.
- Start `p` at 0.6; add 0.1 if precise automated verification exists; subtract 0.1 if blocked by external dependencies (then clamp to bounds).
- Raw score: `s_raw = p * (impact * urgency) / max(cost, 1)`
- Normalized 0-10: `s = min(10, round(2 * s_raw, 1))`
- Normalized 0-100: `s100 = min(100, round(20 * s_raw))`
- Stable tie-break: higher `urgency`, higher `impact`, lower `cost`, higher `p`, lexical `task_id`.

## 6. Quality Gates & Guardrails
- CWV (mobile p75): LCP <= 2500 ms, INP <= 200 ms, CLS <= 0.10.
- Accessibility: axe-core serious/critical = 0.
- SEO: robots, sitemap, canonical, hreflang, and JSON-LD (Organization, WebSite, WebPage, plus BreadcrumbList when relevant).
- Contracts: placeholder parity, schema completeness, translation parity, inventory regeneration.
- Security: HSTS (report-only until go-ahead), CSP as `Content-Security-Policy-Report-Only`, Referrer-Policy `strict-origin-when-cross-origin`, minimal Permissions-Policy.
- Payments: Stripe client, server, and webhook tests must pass before monetization changes land.
- Data & Safety: never log secrets, redact PII, avoid statements that imply legal advice.
- Violating a gate triggers rollback, a TRACE_EVENTS entry, and `PR_DESC.draft = true`.

## 7. Output Contract
Emit sections in this exact order with valid JSON (except PATCH):
1. `## CYCLE_SUMMARY`
2. `## CONTRACT_REPORTS`
3. `## PATCH`
4. `## PATCH_META`
5. `## UPDATED_MEMORY_MD`
6. `## UPDATED_REMEMBER_MD`
7. `## PR_TITLE`
8. `## PR_DESC`
9. `## TRACE_EVENTS`
10. `CYCLE_DONE`

Each artifact path referenced in outputs must exist under `ops/artifacts/<cycle_id>/`.

## 8. Templates
### 8.1 Repo `Memory.md`
```yaml
# Memory.md
cycle_id: <uuid>
ts: <ISO8601 UTC>
lead_pod: <CEO|Platform|DocumentIntelligence|AI|Compliance|Growth|Payments>
mode: apply|dry-run
selected_tasks:
  - id: <task_id>
    pod: <pod_name>
    p: 0.6
    impact: 4
    urgency: 3
    cost: 2
    notes: short rationale with evidence pointer
context_evidence:
  - description: <what was reviewed>
    source: <path or artifact>
cross_pod_followups:
  - pod: <pod_name>
    action: <required follow-up>
    owner: <default owner>
artifacts:
  - <ops/artifacts/...>
```

### 8.2 Pod `memory.json`
```json
{
  "cycle_id": null,
  "last_updated": null,
  "notes": [],
  "todos": []
}
```

### 8.3 `Remember.md`
See authoritative structure in `Remember.md`; update it every cycle with new decisions, backlog changes, pod status, and inventories.

Follow this contract every time Codex runs. Begin each session by reading this file, then `Remember.md`, and finally the relevant `TEAM/<pod>/Start.MD` before taking action.
