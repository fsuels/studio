# AI & Automation Playbook - OSS Edition

> **Goal:** Replace proprietary dependencies with **free & open** (open-weight / OSI-licensed) components while keeping an OpenAI-compatible API to minimize code change.

---

## Mission Contribution
Design safe, high-accuracy AI experiences that classify matters, guide intake, prefill answers, and surface risks **without** crossing into unauthorized legal advice.

## Guiding Principles
- **Open first:** Prefer Apache-2.0 or MIT models and tooling; accept community licenses (for example Llama or Qwen-72B) only with counsel approval.
- **Self-host by default:** Inference runs on GPU nodes via vLLM; local development uses Ollama. We expose the same OpenAI-compatible API across environments.
- **Privacy by design:** No PII leaves our VPC, logs are redacted, and evaluation data is synthetic or consented.
- **Determinism and safety:** Structured outputs, typed schemas, and layered guardrails (policy -> model -> heuristics -> human).

## Charter
- Own OSS LLM pipelines, integrations, and orchestration used in intake, drafting assistance, and template recommendations.
- Maintain an OpenAI-compatible gateway (vLLM or LiteLLM) with swappable backends (gpt-oss, Llama 3.1, Qwen2.5, DeepSeek-R1).
- Define guardrails: prompt engineering, structured outputs (JSON or Zod), red-team testing, fallback heuristics, human escalation logic.
- Provide analytics on AI usage, accuracy, hallucinations, and user satisfaction.
- Collaborate on data policies ensuring privacy, consent, and jurisdiction-specific restrictions.
- Ship developer tooling for deterministic AI staging: fixtures, mock servers, telemetry hooks.

## Current State Snapshot
- Gateway helpers exist in `src/ai/gateway.ts`, but inference is disabled through stubs; LiteLLM and vLLM are not yet provisioned.
- No guardrail stack is active (Llama Guard 3, Prompt Guard 2, refusal taxonomy, or heuristics).
- Intake and drafting flows lack bilingual (EN and ES) prompts, disclaimers, and evaluation fixtures.
- Observability (Langfuse, Prometheus, and AI dashboards) is not connected; no AI incident escalation telemetry exists.
- Secrets for `AI_GATEWAY_URL` and `AI_GATEWAY_API_KEY` remain informational only; rotations and health probes are undefined.

## 90-Day Objectives
1. Ship the intake assistant with greater than 92% top-1 classification on priority categories and bilingual prompts and disclaimers.
2. Launch the safety framework in production (Llama Guard 3 + Prompt Guard 2 + NeMo Guardrails rules) with less than 1% hallucination-induced defects.
3. Stand up the evaluation harness: lm-evaluation-harness (tasks) plus Ragas (RAG) with weekly scorecards.
4. Deliver observability: Langfuse traces, Prometheus and Grafana metrics, and privacy-safe logs.

## KPIs and Targets
- Classification accuracy >=92% top-1 and >=98% top-3.
- Hallucination or unsafe output rate <1% per 1k sessions with zero critical safety incidents.
- Latency: p95 <1.5 s for classification and <3 s for drafting suggestions.
- Escalation routing: 100% of high-risk scenarios escalate within SLA.

## Replacement Roadmap (Proprietary -> OSS)
| Domain | Proprietary Dependency | OSS Replacement | Notes |
|---|---|---|---|
| Chat inference | OpenAI GPT-4/3.5 | gpt-oss-20b (dev) / gpt-oss-120b (prod) via vLLM | Keep OpenAI-compatible API surface. |
| Alternate inference | Anthropic Claude, OpenAI | Llama 3.1 70B Instruct, Qwen2.5-72B, DeepSeek-R1 | Community licenses require counsel review. |
| Local dev | OpenAI SDK | Ollama serving gpt-oss models | Mirror `/v1/chat/completions`. |
| Embeddings | OpenAI text-embedding-3-large | BGE-M3, GTE-large-en-v1.5, Arctic-Embed via TEI | Select per recall vs latency. |
| Vector store | Pinecone | Qdrant or Milvus (or Weaviate for hybrid) | Run as managed cluster with TLS. |
| Guardrails | OpenAI Moderation | Llama Guard 3, Prompt Guard 2, NeMo Guardrails | Chain policy -> prompt -> heuristics. |
| Eval harness | OpenAI eval suite | lm-evaluation-harness, Ragas | Seed with synthetic bilingual datasets. |
| Observability | OpenAI usage dashboards | Langfuse, Prometheus, Grafana | Redact PII at source. |

## Architecture Overview (OpenAI-Compatible)
- **Gateway:** LiteLLM fronts vLLM, Ollama, and future backends. Provides routing, quotas, model selection, and audit logs.
- **Inference Workers:** vLLM on GPU nodes hosts gpt-oss-* models; optional nodes host Llama 3.1, Qwen2.5, or DeepSeek-R1 for A/B and fallbacks.
- **Embeddings Service:** Text-Embeddings-Inference (TEI) exposes BGE-M3 and other embedding models; integrates with Qdrant.
- **Guardrail Pipeline:** Prompt Guard 2 filters input, Llama Guard 3 validates output intent, heuristics (regex/scoring) enforce UPL avoidance, and NeMo Guardrails manages conversation rules and refusals.
- **Telemetry:** Langfuse captures traces and prompt metadata; Prometheus scrapes LiteLLM, vLLM, and TEI metrics; Grafana dashboards visualize KPIs; application errors are logged via internal handlers with redaction middleware.
- **Storage:** Qdrant handles vector retrieval; Postgres/Firestore store guardrail audit logs and incident tracking; logs remain inside VPC with retention policies.
- **Orchestration:** Cloud scheduler runs evaluation harness jobs; CI validates prompts, JSON schemas, and guardrail coverage before deploy.

## Implementation Plan (90-Day Timeline)
- **Phase 1 (Weeks 1-3): Gateway Foundations**
  - Deploy LiteLLM pointing to gpt-oss-20b via Ollama (dev) and stand up vLLM for staging. Configure health probes and auth.
  - Wire `src/ai/gateway.ts` to pull secrets from secret manager; update intake APIs to surface deterministic errors when gateway is down.
  - Implement Prompt Guard 2 pre-checks and refusal messaging; add EN/ES disclaimers to intake flows.
- **Phase 2 (Weeks 4-6): Safety and Evaluations**
  - Add Llama Guard 3 post-generation checks and fallback heuristics; log outcomes with policy tags.
  - Seed lm-evaluation-harness tasks (classification EN/ES) and Ragas scenarios for RAG usage.
  - Automate weekly eval jobs and publish Langfuse dashboards.
- **Phase 3 (Weeks 7-9): Observability and Scaling**
  - Roll out Prometheus metrics for LiteLLM, vLLM, TEI; wire Grafana SLO boards and alerting pipelines.
  - Expand bilingual prompts, disclaimers, and refusal taxonomy across drafting/summarization flows.
  - Pilot alternate models (Llama 3.1, DeepSeek-R1) behind feature flags with compliance approval.

## Safety and Guardrail Stack
- **Input Hardening:** Prompt Guard 2 detects prompt injection; block or sanitize before hitting inference.
- **Policy Classification:** Llama Guard 3 validates requested task legality and checks for UPL or safety violations.
- **Heuristic Layer:** Maintain regex and scoring rules for known risk keywords; require human escalation for high-risk outputs.
- **Conversation Orchestration:** NeMo Guardrails enforces conversation state machines, disclaimers, and bilingual refusals.
- **Structured Outputs:** Use JSON schemas (Zod) and function-calling to enforce determinism; reject schema-violating responses.
- **Human-in-the-Loop:** Route high-risk or low-confidence cases to subject-matter review; log in incident ticketing system.

## Evaluation and Observability
- **lm-evaluation-harness:** Run weekly classification accuracy checks (EN/ES). Store artifacts in `ops/artifacts/ai-automation-cycle-*/evals/`.
- **Ragas:** Score RAG pipelines for hallucination rate and answer correctness; integrate with Langfuse experiment tracking.
- **Langfuse:** Capture trace spans (gateway, guardrails, model); require PII redaction middleware and sampling strategy.
- **Prometheus/Grafana:** Monitor latency, token throughput, guardrail pass rates, and error codes. Define SLO alerts (<1.5 s p95 classification, <3 s p95 drafting).
- **Incident Runbooks:** Escalate via Opsgenie/Slack when hallucination or UPL incident occurs; auto-create ticket with trace link.

## Operating Cadence
- **Daily:** Monitor safety dashboards, triage flagged conversations, patch prompts and policies.
- **Weekly:** Run evaluations on gold datasets (EN/ES), publish metrics to the executive channel.
- **Biweekly:** Conduct red-team workshops on UPL, bias, privacy gaps; update heuristics.
- **Monthly:** Review model update readiness, document prompt/version changes, coordinate rollouts with compliance.

## System Ownership
- `src/ai/` flows, prompt libraries, pipelines, and inference adapters.
- Safety middleware (intent filters, refusal messages, disclaimer injection).
- AI analytics dashboards and evaluation scripts (`scripts/ai-*`).
- Data annotation repos, labeling guidelines, vendor coordination.

## Reference Stack (Free and Open)
### Inference (chat and completions)
- **Primary:** `gpt-oss-20b` (dev) and `gpt-oss-120b` (prod) via vLLM; maintain OpenAI-compatible schema.
- **Alternates:** Llama 3.1 70B Instruct (Llama license), Qwen2.5-72B Instruct (Qwen license), DeepSeek-R1 (MIT) for A/B tests.
- **Local development:** Ollama serving the same `/v1/chat/completions` contract.

### Embeddings
- Models: BGE-M3 (MIT), GTE-large-en-v1.5 (Apache-2.0), Arctic-Embed (Apache-2.0).
- Serving: Text-Embeddings-Inference container.

### Vector Search
- Qdrant (Apache-2.0) or Milvus (Apache-2.0); Weaviate (BSD-3-Clause) if hybrid search is required.

### Guardrails and Safety
- Llama Guard 3 (policy classifier, EN/ES capable), Llama Prompt Guard 2 (prompt injection defense), NeMo Guardrails (conversation rules), regex and heuristic UPL filters, and static fallbacks.

### Orchestration
- LiteLLM gateway for routing/auth, quotas, per-route model selection.
- Zod schemas for JSON outputs; OpenAI function calling for typed actions.

## Environment Configuration and Secrets
- Required: `AI_GATEWAY_URL` (base URL without trailing slash) and `AI_GATEWAY_API_KEY` (LiteLLM bearer token). Never expose via `NEXT_PUBLIC_*`.
- Optional overrides: `AI_GATEWAY_MODEL`, `AI_GATEWAY_ANALYZE_MODEL`, `AI_GATEWAY_SUMMARY_MODEL`, `AI_GATEWAY_SIMPLIFY_MODEL`, `AI_GATEWAY_EXPLAIN_MODEL`.
- Health checks: expose authenticated `/health` endpoint, enforce quotas, document secret rotation quarterly.
- Store production secrets in secret manager; mirror dev values only in `.env.local`.
- Capture LiteLLM request, latency, and error metrics with Langfuse and Prometheus once online.

## Data and Privacy
- No raw PII in training or evaluation; use salted hashes and synthetic variants.
- Retain prompts and responses without PII; enforce configurable TTLs and jurisdiction-specific storage policies.
- Maintain DSAR and RTBF hooks tied to AI logs and embeddings.

## Collaboration Map
- Platform Engineering: GPU nodes, secrets, circuit breakers, autoscaling.
- Document Intelligence: template metadata, better recommendations, field name alignment.
- Compliance and Legal Ops: review prompts, guardrails, and disclaimers to avoid UPL; approve datasets.
- Growth: feed AI insights into onboarding; capture user feedback for experiments.
- Payments: usage counters for AI upsells and billing.

## Risk and Escalation
- **Safety breach or UPL:** Disable feature flag, notify Compliance and CEO, document incident and mitigation.
- **Model degradation:** Revert to previous prompt/model, log in runbook, schedule retraining.
- **Data leakage:** Purge logs, rotate keys, run security response process, document actions.

## Immediate Next Actions
1. **Spin up inference infrastructure.**
   ```bash
   # Dev (local)
   ollama pull gpt-oss:20b && ollama run gpt-oss:20b
   # Prod (GPU)
   vllm serve openai/gpt-oss-120b --host 0.0.0.0 --port 8000
   ```
   - Add LiteLLM route configuration pointing to the running backend.
2. **Embeddings service.** Deploy TEI with `BAAI/bge-m3`, expose TLS endpoint, and connect Qdrant cluster.
3. **Gateway hardening.** Stand up LiteLLM, route `/v1/*` to vLLM/Ollama, enforce per-route auth and quotas, configure secrets, and document rotation.
4. **Safety pipeline.** Chain Prompt Guard 2 -> Llama Guard 3 -> refusal taxonomy; inject EN/ES disclaimers and log guardrail decisions with incident IDs.
5. **Evaluation harness.** Seed gold sets (top 50 templates in EN/ES), automate weekly lm-evaluation-harness and Ragas runs, store artifacts in `ops/artifacts/ai-automation-cycle-*/evals/`.
6. **Observability.** Enable Langfuse traces, Prometheus scrapers, and Grafana dashboards; define latency and error SLOs with alert thresholds.

## Dependencies and Open Questions
- Await compliance sign-off on refusal taxonomy wording and bilingual disclaimers.
- Need SRE support for GPU autoscaling and Prometheus scraping rules.
- Coordinate with Platform for secret manager integration (`AI_GATEWAY_*`).
- Confirm budget and scheduling for running Qwen2.5-72B or Llama 3.1 at scale.

## Licensing Notes
- gpt-oss: Apache-2.0 (open-weight).
- Llama 3.1: community license (usage restrictions apply).
- Qwen2.5-72B: Qwen license (restrictions; smaller Qwen models are Apache-2.0).
- DeepSeek-R1: MIT.
- All third-party assets require NOTICE retention and policy review.