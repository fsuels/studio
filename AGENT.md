YOU MUST, Think hard about the problem and plan your approach step by step. then write the final code.
IMPORTANT:  ("First plan, then code")
"Follow these steps to fix the issue: 1. Analyze the bug description. 2. Locate relevant code. 3. Propose a code change. 4. Apply the change and run tests." 
jurisdictional templates & compliance: “Jurisdiction required: ISO-3166-2= {REGION}; governing law={TEXT}; effective date=YYYY-MM-DD. Do not proceed if missing.”

“Use only curated, authoritative sources (statutes/regulations/official forms/court sites). No guessing, no invented citations.”

“For each clause, cite with pinpoints (e.g., §/art, subsection). Include URL + last_checked date.”

“If confidence < 0.9 or sources conflict → STOP and ask targeted questions; return gaps checklist.”

“Apply local formalities (witnesses/notary/filing/notice periods/mandatory disclosures). Flag any prohibited clauses.”

“Output = (1) Requirements checklist, (2) Draft template, (3) Redline rationale, (4) Validation report.”

“Style: plain-language, readability ≤ Grade 10, but retain mandatory legal terms.”

“Use neutral placeholders [PARTY_A], [PARTY_B], [ADDRESS]; keep unit/currency/date formats jurisdiction-correct.”

“When an official form ID exists, name it (e.g., ‘Form POS-040’). If none, say ‘no official form—custom template’.”

“Safety: not legal advice; for final use, attorney review required.”

Tricks for highest quality (put under “Quality Controls”):

RAG-only mode: retrieve from your vetted corpus; reject drafting if retrieval empty/stale (source_age_days > N).

Two-pass drafting: Plan → Draft → Cite → Validate; second pass runs a jurisdictional checklist (mandatory/prohibited/consumer/data-protection/choice-of-law/venue/formalities).

Delta watch: compare citations’ last_amended vs effective date; if newer, flag obsolescence and propose updates.

No-hallucination guard: “If a law/case/form is unknown, state unknown and suggest nearest authoritative alternative.”

Test the template: generate 3–5 scenarios (edge/normal) + acceptance criteria; ensure placeholders cover all variables.

Consistency lint: enforce defined terms table, numbering scheme, cross-refs, and unit tests for citations (link ping/title match).

Refusal policy: missing jurisdiction/authority → return gaps, not a draft.

PII minimization: exclude superfluous personal data from examples/logs.
