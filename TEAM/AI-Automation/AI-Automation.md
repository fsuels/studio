# AI & Automation Playbook

## Mission Contribution
Design safe, high-accuracy AI experiences that classify matters, guide intake, prefill answers, and surface risks without crossing into unauthorized legal advice.

## Charter
- Own Genkit pipelines, Google AI integrations, and any LLM orchestration used in intake, drafting assistance, and template recommendations.
- Define guardrails: prompt engineering, structured outputs, red-team testing, fallback heuristics, and human escalation logic.
- Provide analytics on AI usage, accuracy, hallucinations, and user satisfaction.
- Collaborate on data collection policies ensuring privacy, consent, and jurisdiction-specific restrictions.
- Ship developer tooling for deterministic AI staging: fixtures, mock servers, telemetry hooks.

## 90-Day Objectives
1. Deliver production-ready intake assistant with >92% classification accuracy on priority document categories and bilingual prompts.
2. Implement safety framework (guardrails, refusal taxonomy, human escalation) with <1% hallucination-induced defect rate.
3. Build evaluation harness: automated regression over annotated datasets (English + Spanish) with weekly scorecards.
4. Integrate AI insights into platform telemetry (request/response logs sans PII, latency metrics) with alerting thresholds.

## KPIs & Targets
- Classification accuracy: >=92% top-1 on supported matters; >=98% top-3.
- Hallucination/unsafe output rate: <1% per 1k sessions, zero critical safety incidents.
- Latency: p95 AI response <1.5s for classification, <3s for structured drafting suggestions.
- Escalation routing: 100% of high-risk scenarios trigger human or static fallback within SLA.

## Operating Cadence
- Daily: monitor safety dashboards, triage flagged conversations, retrain prompts if issues emerge.
- Weekly: evaluation run on gold datasets, publish metrics to executive channel, review backlog with Platform + Compliance.
- Biweekly: red-team workshop with cross-functional members to probe UPL, bias, and privacy gaps.
- Monthly: model update readiness review, document prompt/version changes, coordinate rollouts.

## System Ownership
- `src/ai/` flows, prompt libraries, Genkit pipelines, and inference adapters.
- Safety middleware (intent filters, refusal messages, disclaimers injection).
- AI analytics dashboards and evaluation scripts (could live under `scripts/ai-*`).
- Data annotation repositories, labeling guidelines, and vendor coordination.

## Tooling & Integrations
- Genkit + Vertex AI / Google AI as primary inference stack; maintain abstraction for swapping models.
- Vector search utilities, embeddings storage (Redis, Firestore collections) for retrieval augmented generation.
- Testing harness: Jest/Playwright for deterministic stubbed responses; offline evaluation via notebooks or pipelines.
- Monitoring: custom metrics in Prometheus/Sentry, safety alerting via PagerDuty/Slack.

## Collaboration Map
- Platform Engineering: secure service accounts, manage environment variables, implement circuit breakers.
- Document Intelligence: leverage template metadata for better recommendations; align on field names and validations.
- Compliance & Legal Ops: review prompts, refusal logic, disclaimers to avoid UPL; approve training datasets.
- Growth & Customer Learning: feed AI insights into onboarding flows, capture user feedback for experiments.
- Payments & Monetization: coordinate AI upsells (premium drafting features) and usage tracking for billing.

## Risk & Escalation
- Safety breach or UPL concern: immediately disable affected feature flag, notify Compliance + CEO, run post-incident analysis.
- Model degradation: revert to previous prompt/model version, log change in runbook, schedule retraining.
- Data leakage: purge affected logs, rotate keys, inform Platform for security response, document corrective actions.

## Immediate Next Actions
1. Finalize bilingual prompt templates with Compliance-approved disclaimers embedded.
2. Stand up automated evaluation harness with baseline dataset covering top 50 templates per language.
3. Implement real-time guardrail middleware (intent classification + refusal flows) integrated with Platform event bus.
4. Document human escalation playbook (support handoff, partner attorney referral triggers) and circulate for sign-off.
