# AI & Automation Audit - Cycle 0007 (2025-09-19)

## Critical Findings

1. **Guardrail pipeline not integrated (blocker)**  
   - `evaluateGuardrails` is only referenced in the guardrail module and tests; no API routes invoke it (`src/ai/guardrails/index.ts`, `src/ai/guardrails/__tests__/pipeline.test.ts`).  
   - Result: intake, clause explanation, and summary endpoints call LiteLLM directly without Prompt Guard / Llama Guard enforcement (`src/ai/flows/explain-clause.ts`, `src/services/document-summary.ts`).  
   - Recommendation: wrap all gateway calls with `evaluateGuardrails` before and after inference, log events to Langfuse, and block unsafe outputs until compliance signs off.

2. **Genkit flows still stubbed (functionality broken)**  
   - `ai-instance.ts` intentionally disables Genkit (`src/ai/ai-instance.ts:1`).  
   - `inferDocumentTypeFlow` relies on `ai.definePrompt`, so API responses fall back to "General Inquiry" instead of real classifications (`src/ai/flows/infer-document-type.ts:108`).  
   - Recommendation: replace stub with LiteLLM-backed implementation or migrate flow logic to the new gateway, then add regression tests to ensure real suggestions return.

3. **Legal update summarizer uses OpenAI GPT-4o**  
   - `src/lib/legal-updates/ai-summarizer.ts:1` imports `openai` and hardcodes `model = 'gpt-4o'`, requiring `OPENAI_API_KEY`.  
   - Violates OSS mission and bypasses LiteLLM, exposing direct dependency and potential cost/compliance issues.  
   - Recommendation: refactor to use the LiteLLM gateway with OSS models, ensure guardrails run, and remove `OPENAI_API_KEY` requirements from environments/documentation.

4. **No guardrail timeout enforcement**  
   - Guardrail config exposes `AI_GUARDRAIL_TIMEOUT_MS`, but `createChatCompletion` calls lack an `AbortController`; long-running guardrail requests will hang (`src/ai/guardrails/pipeline.ts:25`).  
   - Recommendation: add abort logic with `AbortController` and surface timeout-specific review verdicts.

## Additional Observations
- Clause explanations and document summaries should use `evaluateGuardrails` post-generation to prevent hallucinated legal advice (`src/ai/flows/explain-clause.ts`, `src/services/document-summary.ts`).
- Heuristic rules currently target English phrases only; add Spanish equivalents before enabling bilingual flows (`src/ai/guardrails/heuristics.ts:10`).
- Update CI to run guardrail tests plus future integration tests once pipeline is wired into API routes.

## Suggested Next Steps
1. Integrate guardrail pipeline into intake, summarization, and clause explanation endpoints; log decisions and refusal messages.  
2. Replace `ai-instance` stub with OSS-backed prompts or migrate flows to direct LiteLLM calls; add evaluation coverage via the new harness.  
3. Refactor legal update summarizer to use LiteLLM OSS models, run guardrails, and document new environment variables.  
4. Implement abort/timeout handling for guardrail model calls and extend heuristics for Spanish compliance triggers.