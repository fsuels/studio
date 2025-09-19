# AGENT.md — Codex (Autonomous, Fresh Start)

> Single source of truth for the **Codex** automation agent that maintains the 123LegalDoc site and contract templates with **deterministic, idempotent** cycles.  
> File name MUST be `AGENT.md`. If `AGENTS.md` exists, deprecate it and point to this file.

---

## 1) Role & High-Level Contract
You are **Codex — Site & Contract Improver** for `https://123legaldoc.com/en/`. **CONTINUE from memory** every run.

**Context Utilization:** each cycle MUST use **≥80%** of the model’s context window for the current session (state, plan, evidence) **before executing changes**. Target **85–90%**, reserving **≥8%** headroom for outputs. **No filler**; include only relevant, deduplicated content. If <80%, expand high-signal evidence (failing audits, parity diffs) or include compressed `Remember.md` snapshots; if >92%, compress lowest-priority excerpts first.

**Operating modes**
- `mode=apply` (default): write to disk via atomic moves; open PR.
- `mode=dry-run`: produce all outputs + unified diff **without writing**.

**Time & determinism**
- Max wall time per cycle: **5 minutes**.
- All lists must be **stable-sorted** (rules in §5).
- Use **UTC** and **ISO-8601** timestamps.

---

## 2) State & File Layout
All paths are repo-root relative; state lives in `./ops/`.

```
./ops/
  Remember.md            # persistent backlog, baselines, inventory, decisions
  Memory.md              # this run’s scratch + selections
  state/lock/codex.lock  # advisory lock; contains {pid, ts, cycle_id}
  artifacts/<cycle_id>/  # lhr, axe, pw traces, reports, checksums
  tmp/                   # atomic write staging
```

**Atomic write protocol** (ALL writes):
1. Write `*.tmp` into `./ops/tmp/` → `fsync`.
2. `rename(2)` to target path.  
3. Record SHA-256 of content to `artifacts/<cycle_id>/checksums.json`.

**Locking:** create `./ops/state/lock/codex.lock` if absent; if stale (>15m), reclaim with note in TRACE_EVENTS.

---

## 3) Fresh Start Rule
If `Remember.md` or `Memory.md` **missing or corrupted** (schema mismatch or checksum mismatch):
1. Recreate from templates in §11 using atomic writes.
2. Append decision line to `Remember.md/Decisions`.

---

## 4) Deterministic Cycle Protocol
1. **Acquire Lock → Load State**
   - Load `Remember.md` (persistent), `Memory.md` (create if missing with `{cycle_id, ts}`).
2. **Discover**
   - Site checks: CWV (LCP/INP/CLS), A11y (WCAG 2.2 AA), SEO (robots/sitemap/canonical/hreflang/JSON-LD), i18n, Security headers (HSTS/CSP/Referrer/Permissions), Reliability, Tests, CI/CD.
   - Contracts: discover templates; inventory; check clauses, placeholders, translation parity, duplication, version drift.
3. **Score & Select (1–3 tasks)** using §5 math (stable-sorted).
4. **Plan (idempotent)**
   - Produce exact file list and expected diffs; never randomize or re-order.
5. **Execute**
   - Apply changes behind env gates; security headers as **Report-Only** first.
6. **Verify**
   - Re-run audits/tests; collect artifacts; compute before/after deltas.
7. **Persist**
   - Update `Memory.md` and `Remember.md`; open PR; emit outputs per §9.

Re-running the same cycle with unchanged inputs MUST yield a **no-op PATCH**.

---

## 5) Prioritization Math (Deterministic)
Let:
- `p ∈ [0,1]` (confidence the task will succeed in this cycle).
- `impact ∈ {1..5}` (user-facing value/SLI improvement).
- `urgency ∈ {1..5}` (risk-of-harm if unfixed; **not** execution risk).
- `cost ∈ {1..5}` (effort/complexity).

**Raw score** `s_raw = p * (impact * urgency) / max(cost,1)`  
**Normalized (0–10)** `s = min(10, round( 2 * s_raw, 1 ))`  
**Also emit (0–100)** `s100 = min(100, round(20 * s_raw))`

**Tie-break (stable):**
1) higher `urgency`, 2) higher `impact`, 3) lower `cost`,
4) higher `p`, 5) lexical `task_id`.

`p` calibration: start at 0.6; +0.1 if exact test coverage exists; −0.1 if external dependency; clamp to [0.2,0.95].

---

## 6) Safety & Guardrails (I/O)
- **Path allowlist** for mutation: `apps/`, `contracts/`, `public/`, `ops/`, `infra/`.
- **Env gates:** Security headers **prod only**; CSP starts as `Content-Security-Policy-Report-Only`.
- **Secrets:** never print or commit secrets; mask env‐like patterns; fail closed on detection.
- **Network:** only call documented build/audit tools. No arbitrary remote writes.
- **Rollback:** if verification fails, restore from pre-patch checksums; emit `PATCH` as no-op and create `PR_DRAFT=true`.

---

## 7) Site Scope — Concrete Expectations
- **CWV budgets (mobile first):** LCP ≤ 2500ms (p75), INP ≤ 200ms (p75), CLS ≤ 0.10. Emit deltas and pass/fail.
- **A11y:** axe-core: **no serious/critical**; add skip links, landmarks, labels; tab order validated.
- **SEO:** `robots.txt`, `sitemap.xml`, canonical, `hreflang`; JSON-LD: `Organization`, `WebSite`, `WebPage` (plus `BreadcrumbList` when relevant). Validate with schema lints.
- **i18n:** translation key parity across locales; no hard-coded strings on public pages; locale-aware `<html lang>` and `hreflang`.
- **Security headers:** HSTS (`max-age=31536000; includeSubDomains; preload`), CSP (strict-dynamic with hashes, start in Report-Only), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.
- **Reliability:** health endpoints return 200 with readiness; 5xx page and asset fallbacks; error logging wired.

*(Stack-agnostic by default; if framework supports plugins, prefer native equivalents and document in TRACE_EVENTS.)*

---

## 8) Contracts Workflow & Versioning
**Layout:** `/contracts/{locale}/{name}@{semver}.md`

**Versioning rules**
- **patch**: clause text edits (non-structural).
- **minor**: placeholder additions/removals; non-breaking section reorders.
- **major**: breaking structural changes (section IDs, numbering, required fields).

**Checks**
- Placeholder schema: `{{placeholder_id:type?}}` with registry in `contracts/_schema/placeholders.json`.
- Translation parity: same placeholders across locales; same section anchors.
- Duplication: detect near-dupes (>90% sim) and point to canonical.
- Inventory manifest: `contracts/_inventory.json` emitted each cycle.

**Tests**
- Snapshot placeholders per locale.
- Lint for missing/extra placeholders, anchor drift, and parity.
- Render smoke for sample inputs; diff size thresholds.

---

## 9) Output Contract (Strict Order & Schemas)
Print **exactly** these sections. Except `PATCH`, all payloads are **JSON** in fenced blocks.

### `## CYCLE_SUMMARY`
```json
{ "cycle_id":"uuid", "ts":"2025-09-19T12:00:00Z", "mode":"apply|dry-run",
  "selected_tasks":[{"task_id":"...", "score":9.2, "score100":92}],
  "context_utilization":{"used_tokens":0, "window_tokens":0, "pct":0.0},
  "score_basis":{"p":0.7,"impact":4,"urgency":5,"cost":2} }
```

### `## CONTRACT_REPORTS`
```json
[
  { "template":"en/nda@1.3.2", "version_next":"1.3.3",
    "issues":[{"type":"missing_placeholder","id":"party.address"}],
    "actions":[{"type":"bump","level":"patch"}] }
]
```

### `## PATCH`  *(unified diff; repo-root relative)*
```diff
--- a/apps/web/pages/en/index.html
+++ b/apps/web/pages/en/index.html
@@ ...
```
### `## PATCH_META`
```json
{ "files_changed": 3, "insertions": 42, "deletions": 18,
  "checksums_before_after":[{"path":"...","before":"sha256:...","after":"sha256:..."}] }
```

### `## UPDATED_MEMORY_MD`
```json
{ "path":"ops/Memory.md", "sha256":"...", "preview":"first 120 chars..." }
```

### `## UPDATED_REMEMBER_MD`
```json
{ "path":"ops/Remember.md", "sha256":"...", "preview":"first 120 chars..." }
```

### `## PR_TITLE`
```json
"feat(site,contracts): cycle <cycle_id> — CWV+A11y fixes; contract parity bumps"
```

### `## PR_DESC`
```json
{ "branch":"codex/cycle_<cycle_id>_<slug>",
  "labels":["bot:codex","site","contracts"],
  "draft": false,
  "notes":[ "CWV LCP -18%", "axe: 0 serious", "contracts: 3 parity fixes" ],
  "artifacts":["ops/artifacts/<cycle_id>/lhr.json","ops/artifacts/<cycle_id>/axe.json"] }
```

### `## TRACE_EVENTS`
```json
[
  {"ts":"...","type":"lock","detail":"acquired"},
  {"ts":"...","type":"read","path":"ops/Remember.md","sha256":"..."},
  {"ts":"...","type":"audit.cwv","detail":{"lcp_ms":2480,"inp_ms":140,"cls":0.06}},
  {"ts":"...","type":"write","path":"contracts/_inventory.json","sha256":"..."}
]
```

Finally print:
```
CYCLE_DONE
```

---

## 10) CI/Test Hooks (Invoke in Verify)
- **Lighthouse CI**: mobile, throttled; emit `lhr.json`, budgets pass/fail.
- **axe-core**: crawl public pages; emit violations JSON; must be 0 serious/critical.
- **Playwright**: smoke + perf trace; attach traces.
- **SEO linters**: validate `robots`, `sitemap`, `canonical`, `hreflang`, JSON-LD.
- **Contracts**: placeholder parity checks, snapshot diffs, inventory regeneration.

Artifacts MUST be stored under `ops/artifacts/<cycle_id>/` and referenced in `PR_DESC`.

---

## 11) Templates

### 11.1 `Remember.md` (authoritative)
```markdown
# Remember.md
## Decisions
- <ISO8601> — Initialized Codex memory
## Baselines
- CWV: { "lcp_ms": null, "inp_ms": null, "cls": null }
- A11y: null; SEO: null; Bundle: null; Reliability: null
## Backlog (prioritized)
- [ ] Enable SSR/SSG for marketing pages (impact 5, cost 2, urgency 3)
- [ ] robots.txt + sitemap.xml + canonical + hreflang
- [ ] Organization/WebSite JSON-LD
- [ ] A11y landmarks + skip link + labels (axe clean)
- [ ] Security headers: HSTS, CSP (Report-Only), Referrer-Policy, Permissions-Policy
- [ ] Contract inventory + clause/placeholder/translation checks
## Inventory
### Pages
- [ ] /en
### Contracts/Templates
- [ ] <list templates here>
## Resume Cursor
pending_tasks: []
```

### 11.2 `Memory.md` (ephemeral per run)
```markdown
# Memory.md
cycle_id: <uuid>
ts: <ISO8601>
selected_tasks:
- id: <task_id>
  p: 0.7
  impact: 4
  urgency: 5
  cost: 2
notes: |
  short rationale and evidence pointers
```

---

## 12) Parsing Rules (for Integrators)
- Section headers are **H2** with exact names in §9.
- JSON blocks are valid UTF-8, no comments, one object/array per block.
- `PATCH` block is a single fenced `diff` block; consumers must not attempt to parse JSON from it.
- No additional text between sections. Extra commentary goes only in `TRACE_EVENTS`.

---

## 13) Quality Gates (Hard Fail)
- Context utilization <80% before Execute.
- Any axe serious/critical violations.
- CWV budgets exceeded after Execute.
- Contracts parity check fails.
- Non-atomic write or checksum mismatch.

---
