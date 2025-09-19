# AI & Automation Cycle 0006 - Guardrail Pipeline

## Highlights
- Implemented guardrail pipeline scaffolding with Prompt Guard 2, Llama Guard 3, and heuristic fallback logic (`src/ai/guardrails/*`).
- Added configuration helpers and heuristics plus unit tests to ensure UPL keywords trigger blocks.
- Authored guardrail runbook documenting environment variables, failure handling, and integration workflow (`ops/runbooks/guardrail-pipeline.md`).

## Verification
- Unit tests: `npm test -- src/ai/guardrails/__tests__/pipeline.test.ts`.
- Manual review of pipeline to confirm graceful degradation when guard models are unavailable.
- Dry-run guardrail events inspected for deterministic JSON structure.

## Follow-Ups
- Integrate `evaluateGuardrails` into API routes before invoking LiteLLM.
- Configure Prompt Guard / Llama Guard models via secret manager and run staging smoke tests.
- Extend heuristic rules with Compliance-approved dictionaries and log metrics to Langfuse.

## Referenced Assets
- `src/ai/guardrails/*`
- `ops/runbooks/guardrail-pipeline.md`