# AI & Automation Playbook — OSS Edition

> **Goal:** Replace proprietary dependencies with **free & open** (open‑weight / OSI‑licensed) components while keeping an OpenAI‑compatible API to minimize code change.

---

## Mission Contribution
Design safe, high‑accuracy AI experiences that classify matters, guide intake, prefill answers, and surface risks **without** crossing into unauthorized legal advice.

## Guiding Principles
- **Open first:** Prefer Apache‑2.0/MIT models & tools; accept community licenses (e.g., Llama, Qwen‑72B) only with counsel approval.
- **Self‑host by default:** Inference runs on our GPU node(s) via vLLM; local dev via Ollama. Same **OpenAI‑compatible** API across environments.
- **Privacy by design:** No PII leaves our VPC; logs are redacted; eval data is synthetic or consented.
- **Determinism and safety:** Structured outputs, typed schemas, and layered guardrails (policy → model → heuristics → human).

## Charter
- Own **OSS LLM pipelines**, integrations, and orchestration used in intake, drafting assistance, and template recommendations.
- Maintain an **OpenAI‑compatible** gateway (vLLM/LiteLLM) with swappable backends (gpt‑oss, Llama 3.1, Qwen2.5, DeepSeek‑R1).
- Define guardrails: prompt engineering, structured outputs (JSON/Zod), red‑team testing, fallback heuristics, human escalation logic.
- Provide analytics on AI usage, accuracy, hallucinations, and user satisfaction.
- Collaborate on data policies ensuring privacy, consent, and jurisdiction‑specific restrictions.
- Ship developer tooling for deterministic AI staging: fixtures, mock servers, telemetry hooks.

## 90‑Day Objectives
1. **Ship intake assistant** with >92% top‑1 classification on priority categories; bilingual (EN/ES) prompts and disclaimers.
2. **Safety framework** in prod (Llama Guard 3 + Prompt Guard 2 + NeMo Guardrails rules) with <1% hallucination‑induced defects.
3. **Evaluation harness**: lm‑evaluation‑harness (tasks) + Ragas (RAG) with weekly scorecards.
4. **Observability**: Langfuse traces + Prometheus/Grafana metrics + Sentry errors; privacy‑safe logs.

## KPIs & Targets
- Classification accuracy ≥92% top‑1; ≥98% top‑3.
- Hallucination/unsafe output rate <1% per 1k sessions; zero critical safety incidents.
- Latency: p95 <1.5s (classification); <3s (drafting suggestions).
- Escalation routing: 100% of high‑risk scenarios escalate within SLA.

## Operating Cadence
- **Daily:** monitor safety dashboards, triage flagged conversations, patch prompts/policies.
- **Weekly:** run evals on gold datasets (EN/ES), publish metrics to exec channel.
- **Biweekly:** red‑team workshop on UPL, bias, privacy gaps.
- **Monthly:** model update readiness review; document prompt/version changes; coordinate rollouts.

## System Ownership
- `src/ai/` flows, prompt libraries, pipelines, and inference adapters.
- Safety middleware (intent filters, refusal messages, disclaimer injection).
- AI analytics dashboards and evaluation scripts (`scripts/ai-*`).
- Data annotation repos, labeling guidelines, vendor coordination.

## Reference Stack (free & open)
**Inference (chat/completions)**
- **Primary:** `gpt-oss-20b` (dev) → `gpt-oss-120b` (prod) via **vLLM** (OpenAI‑compatible).  
- **Alternates:** **Llama 3.1 70B Instruct** (Llama license), **Qwen2.5‑72B Instruct** (Qwen license), **DeepSeek‑R1** (MIT) — enable per‑feature AB tests.
- **Local dev:** **Ollama** with the same `/v1/chat/completions` schema.

**Embeddings**
- **Models:** **BGE‑M3 (MIT)**, **GTE‑large‑en‑v1.5 (Apache‑2.0)**, **Arctic‑Embed (Apache‑2.0)**.
- **Serving:** **TEI** (Text‑Embeddings‑Inference) container.

**Vector search**
- **Qdrant (Apache‑2.0)** or **Milvus (Apache‑2.0)**; **Weaviate (BSD‑3‑Clause)** if we need hybrid search.

**Guardrails & Safety**
- **Llama Guard 3** (policy classifier, EN/ES capable), **Llama Prompt Guard 2** (prompt‑injection/jailbreak), **NeMo Guardrails** (conversation rules), plus regex/keyword UPL heuristics and static fallbacks.

**Orchestration**
- **Gateway:** **LiteLLM** proxy for routing/auth, quotas, and per‑route model selection.  
- **Schemas:** Zod for JSON outputs; function‑calling for typed actions.

**Observability & QA**
- **Langfuse** traces, **Prometheus/Grafana** metrics, **Sentry** for exceptions; **Evidently** for eval/monitoring.  
- **Evals:** **lm‑evaluation‑harness** (tasks), **Ragas** (RAG), **Playwright/Jest** for UI/API.

## Data & Privacy
- No raw PII in training/eval; use salted hashes + synthetic variants; DSAR/RTBF hooks.  
- Retain prompts/responses sans PII; configurable TTLs; per‑jurisdiction storage policies.

## Collaboration Map
- Platform Eng: GPU nodes, secrets, circuit breakers, autoscaling.
- Document Intelligence: template metadata → better recs; field name alignment.
- Compliance & Legal Ops: review prompts/guardrails/disclaimers to avoid UPL; approve datasets.
- Growth: feed AI insights into onboarding; capture user feedback for experiments.
- Payments: usage counters for AI upsells & billing.

## Risk & Escalation
- **Safety breach/UPL:** disable feature flag; notify Compliance+CEO; post‑incident.
- **Model degradation:** revert to previous prompt/model; log in runbook; schedule retraining.
- **Data leakage:** purge logs; rotate keys; run security response; document actions.

## Immediate Next Actions
1. **Spin up inference:**
   ```bash
   # Dev (local):
   ollama pull gpt-oss:20b && ollama run gpt-oss:20b
   # Prod (GPU):
   vllm serve openai/gpt-oss-120b --host 0.0.0.0 --port 8000
   ```
2. **Embeddings:** deploy TEI with `BAAI/bge-m3`; wire to Qdrant.  
3. **Gateway:** stand up LiteLLM → route `/v1/*` to vLLM/Ollama; add per‑route auth/quotas.  
4. **Safety:** chain Prompt‑Guard‑2 → Llama‑Guard‑3 → refusal taxonomy; inject EN/ES disclaimers.  
5. **Evals:** seed gold sets (top 50 templates × EN/ES); schedule weekly runs.  
6. **Observability:** enable Langfuse traces + Prometheus; define latency/error SLOs.

## Licensing Notes
- **gpt‑oss:** Apache‑2.0 (open‑weight).  
- **Llama 3.1:** community license (usage restrictions).  
- **Qwen2.5‑72B:** Qwen license (restrictions; smaller Qwen are Apache‑2.0).  
- **DeepSeek‑R1:** MIT.  
- All third‑party assets require NOTICE retention and policy review.
