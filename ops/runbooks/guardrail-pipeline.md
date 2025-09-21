# Guardrail Pipeline Runbook

## Purpose
Outline the Prompt Guard 2 → Llama Guard 3 → heuristic pipeline used before responses reach end users. The runbook documents configuration, failure handling, and escalation paths.

## Components
- **Prompt Guard 2**: Screens incoming prompts for jailbreak/unsafe instructions using LiteLLM.
- **Llama Guard 3**: Validates assistant responses prior to delivery.
- **Heuristic Filter**: Fast regex/keyword checks for UPL and PII exposure when models are unavailable or inconclusive.

## Configuration
Environment variables (all server-side only):
- `AI_GUARDRAILS_ENABLED` (default `true`)
- `AI_GUARDRAIL_PROMPT_MODEL` (e.g., `llama-guard-2-8b`)
- `AI_GUARDRAIL_POLICY_MODEL` (e.g., `llama-guard-3-8b`)
- `AI_GUARDRAIL_TIMEOUT_MS` (default `5000`)

Update `ops/ai/guardrails/config.ts` when adding new knobs. Always rotate guardrail model versions in staging before production.

## Pipeline Flow
1. **Prompt Guard**
   - Input: user prompt + context metadata.
   - Output: JSON response with `allow|review|block` verdict.
   - Escalate to human review when verdict ≠ allow.
2. **Llama Guard** (optional if no response yet)
   - Input: assistant draft response.
   - Escalate or block on non-allow verdict.
3. **Heuristics**
   - Always runs last; blocks known UPL phrases (e.g., "represent me in court").
   - Maintains low-latency fallback when models fail.

## Integration Steps
1. Import `evaluateGuardrails` from `src/ai/guardrails` and run before sending prompts to LiteLLM.
2. Provide `assistantResponse` to `evaluateGuardrails` when validating completions before delivery.
3. Log `decision.events` to Langfuse and internal instrumentation for observability.
4. When `decision.escalate` is `true`, store the trace and route to human reviewers.

## Failure Handling
- Model Error → guardrail returns `review` verdict; API should deny automated response and surface fallback messaging.
- Timeout → treat as `review` and escalate (configurable via `AI_GUARDRAIL_TIMEOUT_MS`).
- Heuristic Block → respond with standardized refusal + escalate to Compliance when severity is `high`.

## Testing
- Run `npm test -- src/ai/guardrails/__tests__/pipeline.test.ts` to ensure heuristics behave as expected.
- Add regression tests for new heuristics and guardrail decision branches.

## Incident Response
1. Capture Langfuse trace ID and guardrail events.
2. File incident ticket with Compliance/Platform.
3. If heuristics misfire, update `HEURISTIC_RULES` with refined regex and release patch after regression tests.

## References
- `src/ai/guardrails/`
- `TEAM/AI-Automation/AI-Automation.md`
- Prompt Guard 2 docs, Llama Guard 3 docs (internal links TBD)
