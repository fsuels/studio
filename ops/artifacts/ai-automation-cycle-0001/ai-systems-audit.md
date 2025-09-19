# AI Systems Audit (ai-automation-cycle-0001)
- Timestamp: 2025-09-19T15:39:30.4311772Z
- Pod: AI & Automation

## Genkit Pipelines
- `src/ai/ai-instance.ts` replaces Genkit with a stub that logs warnings and never reaches Google AI or vLLM backends; every `ai.definePrompt` call returns a no-op handler.
- src/ai/ai-instance.ts replaces Genkit with a stub that logs warnings and never reaches Google AI or vLLM backends; every i.definePrompt call returns a no-op handler.
- src/ai/flows/infer-document-type.ts still references googleai/gemini-2.5-pro-exp-03-25, but the stub prevents any request, so API consumers get only filtered fallback suggestions until LiteLLM/vLLM is provisioned.
- Other flows (summarize-document.ts, explain-clause.ts, nalyze-form-data.ts) now call the OSS gateway helper (src/ai/gateway.ts), but still lack production LiteLLM/vLLM routing.

**Risk:** Intake flows cannot reach planned OSS models; current implementation violates the Open-first directive and delivers inconsistent behavior between routes.

## Prompt Safety & Guardrails
- No sign of Llama Guard, Prompt Guard, NeMo Guardrails, or heuristic refusal layers across `src/ai` or API routes.
- Prompts encourage domain-specific guidance (e.g., `analyze-form-data.ts` instructs the model to "spot mistakes" as a paralegal) without UPL disclaimers or refusal taxonomy.
- API handlers (`src/app/api/ai/*`, `src/app/api/accessibility/*`) return raw model output or minimal fallback strings without redaction, risk scoring, or structured safety metadata.

**Risk:** High likelihood of unauthorized practice of law responses or hallucinations reaching users with no automated containment.

## Evaluation Harness & Testing
- Repository contains no `scripts/ai-*` or `tests` exercising AI flows; no references to `lm-evaluation-harness`, `Ragas`, or synthetic gold sets.
- CI scripts in `package.json` do not run AI evaluations; there are no fixtures, regression reports, or accuracy baselines for intake/summarization.

**Risk:** Zero coverage for accuracy regressions; cannot track KPI targets (92% top-1 classification, <1% unsafe output).

## Escalation & Monitoring
- No Langfuse, Prometheus, or SLO instrumentation; API routes rely solely on `console.log`/`console.error`.
- No escalation hooks for policy breaches, quota exhaustion, or guardrail failures; errors bubble to clients as 5xx/4xx without notifying Compliance.

**Risk:** Safety incidents or outages would go undetected; guardrail breaches cannot reach on-call or compliance teams.

## Logging & Key Management
- AI gateway depends on server-only AI_GATEWAY_URL and AI_GATEWAY_API_KEY; ensure these secrets stay out of client bundles and are rotated regularly.
- No redaction of prompts/responses; console logs include raw request payloads (`infer-document-type` route logs full bodies).

**Risk:** Credential leakage and PII exposure; violates privacy-by-design and security guardrails.

## Bilingual Coverage
- Only `infer-document-type` input schema references `language`, but AI stub short-circuits real multilingual routing.
- Prompts in `summarize-document.ts`, `explain-clause.ts`, and `analyze-form-data.ts` are English-only; translations rely on `aiInstance.generateText`, which simply echoes prompts back.
- No Spanish evaluation sets, localized disclaimers, or response parity checks.

**Risk:** Spanish users receive degraded or broken experiences; fails bilingual coverage requirement and guardrails.

## Immediate Remediation Targets
1. Replace OpenAI dependencies with OSS-compatible gateway (vLLM/LiteLLM) and server-side secrets; remove `NEXT_PUBLIC_OPENAI_API_KEY` usage.
2. Implement safety stack (Llama Guard 3 + Prompt Guard 2 + refusal taxonomy) with deterministic refusals and compliance logging.
3. Stand up evaluation harness (lm-eval + Ragas) with bilingual gold sets and publish baseline metrics.
4. Instrument Langfuse/Prometheus traces and escalation hooks for guardrail violations and quota errors.
5. Localize prompts/responses, add Spanish disclaimers, and verify parity across EN/ES flows.

## Remediation Progress (2025-09-19T16:12:12.5542250Z)
- Replaced client-exposed NEXT_PUBLIC_OPENAI_API_KEY usage with server-only AI gateway helpers (`src/ai/gateway.ts`).
- Updated analyze, summarize, and clause explanation flows to call the OSS-compatible gateway with bilingual prompts.
- Added `/api/accessibility/explain-clause` and rerouted `ClauseTooltip` to fetch explanations over HTTPS, keeping prompts off the client bundle.
