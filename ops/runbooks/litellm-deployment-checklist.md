# LiteLLM + vLLM Deployment Checklist Runbook

## Purpose
Provide AI & Platform engineering with a deterministic checklist to deploy LiteLLM in front of vLLM-hosted OSS models while preserving the OpenAI-compatible API, guardrails, and observability requirements.

## Roles & Ownership
- **Primary:** AI & Automation pod (gateway configuration, guardrails, evals).
- **Partners:** Platform Engineering (infrastructure/secrets), SRE (monitoring/autoscaling), Compliance (refusal taxonomy approval).

## Prerequisites
- GPU node pool sized for target model (e.g., gpt-oss-20b requires 24 GB VRAM; gpt-oss-120b requires >=80 GB VRAM with tensor parallelism).
- Container registry access for `vllm/vllm-openai` and `berriai/litellm` images.
- Secret manager entries for `AI_GATEWAY_URL` and `AI_GATEWAY_API_KEY` (distinct per environment).
- Prompt Guard 2 and Llama Guard 3 weights pre-loaded or accessible via internal model store.
- Langfuse project API keys and Prometheus scrape credentials provisioned.

## Environment Topology
```
Client -> LiteLLM (CPU) -> vLLM (GPU) -> Guardrail Pipeline (Prompt Guard 2 -> Llama Guard 3 -> heuristics) -> Response
                               |
                               +-> Langfuse tracer + Prometheus exporter + Sentry instrumentation
```
- LiteLLM runs as stateless service with autoscaling (HPA or equivalent) behind internal load balancer.
- Each vLLM worker exposes `/health` and `/metrics` when launched with `--metrics-port`.

## Deployment Steps
1. **Stage vLLM Worker**
   - Pull model assets onto GPU node or network-attached storage.
   - Launch vLLM (example for staging):
     ```bash
     docker run --gpus=all --rm \
       -p 8000:8000 \
       -p 8001:8001 \
       -e VLLM_LOGGING_LEVEL=INFO \
       vllm/vllm-openai:0.5.2 \
       --model gpt-oss-20b \
       --host 0.0.0.0 \
       --port 8000 \
       --metrics-port 8001 \
       --max-num-seqs 512 \
       --disable-log-requests
     ```
   - Confirm `GET /health` returns `200 OK` and `GET /metrics` exposes Prometheus counters.

2. **Deploy LiteLLM Gateway**
   - Example Kubernetes deployment values:
     ```yaml
     env:
       - name: LITELLM_CONFIG
         value: /etc/litellm/config.yaml
       - name: LITELLM_PORT
         value: "4000"
       - name: LANGFUSE_SERVER
         valueFrom:
           secretKeyRef:
             name: langfuse
             key: server_url
       - name: LANGFUSE_PUBLIC_KEY
         valueFrom:
           secretKeyRef:
             name: langfuse
             key: public_key
       - name: LANGFUSE_SECRET_KEY
         valueFrom:
           secretKeyRef:
             name: langfuse
             key: secret_key
     ports:
       - containerPort: 4000
     readinessProbe:
       httpGet:
         path: /health
         port: 4000
       initialDelaySeconds: 5
       periodSeconds: 10
     ```
   - Mount config map containing LiteLLM routing definition (see Configuration section).
   - Expose service internally; only API layer should reach it.

3. **Configure Secret Manager**
   - Store `AI_GATEWAY_URL` = `https://litellm.<env>.svc.cluster.local:4000` (no trailing slash).
   - Store `AI_GATEWAY_API_KEY` = random 32+ byte token used by app servers.
   - Rotate keys quarterly; document rotation window in incident calendar.
   - Inject secrets into application via server-side environment variables only (never with `NEXT_PUBLIC_*`).

4. **Roll Out Application Update**
   - Ensure runtime pods read new secrets (restart via rollout).
   - Verify `src/ai/gateway.ts` returns `true` for `isAIGatewayConfigured()` in each environment.

5. **Apply Guardrail Chain**
   - Deploy Prompt Guard 2 microservice or library near LiteLLM; expose REST endpoint `/guardrails/prompt-guard`.
   - Deploy Llama Guard 3 classifier (can reuse LiteLLM with smaller model) to validate outputs.
   - Update gateway middleware to:
     1. Run Prompt Guard 2 on user prompt before forwarding to LiteLLM.
     2. Invoke LiteLLM for completion.
     3. Run Llama Guard 3 + heuristic refusal checks on the response before returning to client.
   - Log guardrail outcomes with trace IDs in Langfuse and Sentry breadcrumbs.

6. **Smoke Test**
   - Execute `curl` with staged API key:
     ```bash
     curl -s https://litellm.<env>.svc.cluster.local:4000/v1/chat/completions \
       -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
       -H "Content-Type: application/json" \
       -d '{"model":"gpt-oss-20b","messages":[{"role":"user","content":"hola"}]}'
     ```
   - Expect 200 response <300ms in staging.
   - Confirm guardrail logs show Prompt Guard and Llama Guard passes; verify refusal triggers by submitting a disallowed prompt.

7. **Enable Autoscaling & Resilience**
   - Configure LiteLLM HPA on CPU (target 60%) and concurrency limit (e.g., `max_workers=4`).
   - For vLLM, enable readiness gate on `GET /health` and configure node auto-repair.
   - Set LiteLLM retry policy: `retry: { max_retries: 1, min_seconds: 0.1 }` to avoid duplicate actions.

## LiteLLM Configuration Template
```yaml
model_list:
  - model_name: gpt-oss-20b
    litellm_params:
      model: openai/gpt-oss-20b
      api_base: http://vllm-service:8000
      api_key: dummy
      timeout: 45
routes:
  openai:
    - models:
        - gpt-oss-20b
      completion_params:
        temperature: 0.1
        max_tokens: 800
    - models:
        - llama-3p1-70b-instruct
      condition:
        header: X-AI-Alternate
        value: llama3
logging:
  langfuse:
    host: ${LANGFUSE_SERVER}
    public_key: ${LANGFUSE_PUBLIC_KEY}
    secret_key: ${LANGFUSE_SECRET_KEY}
  prometheus:
    enabled: true
    host: 0.0.0.0
    port: 9100
rate_limits:
  global_per_minute: 600
  per_api_key:
    default: 60
    ai-intake: 120
auth:
  type: bearer
  tokens:
    - ${AI_GATEWAY_API_KEY}
health_checks:
  enabled: true
  endpoint: /health
  require_backend_healthy: true
fallbacks:
  - primary: gpt-oss-20b
    backup: llama-3p1-70b-instruct
    condition: timeout
```

## Observability Checklist
- **Langfuse:** Confirm traces include `environment`, `model`, `guardrail_outcome`, and `latency_ms` properties.
- **Prometheus:** Scrape LiteLLM `/metrics` (port 9100) and vLLM `/metrics` (port 8001). Alert if p95 latency >1.5 s (classification) or error rate >1%.
- **Grafana:** Add dashboards for `litellm_request_latency_seconds` and `vllm_inference_latency_seconds` histograms.
- **Sentry:** Ensure inference errors include sanitized prompt hashes and guardrail decision tags.

## Compliance & Security
- Run refusal taxonomy through Compliance for bilingual approval before production rollout.
- Redact PII from all logs; confirm LiteLLM `log_prompts` disabled.
- Enforce TLS for all north-south traffic and service mesh mTLS for east-west if available.
- Rotate `AI_GATEWAY_API_KEY` and LiteLLM bearer tokens every quarter; record rotation in ops calendar.
- Maintain audit trail: store LiteLLM access logs (redacted) with 30-day retention in centralized logging.

## Evaluation Gate
- Execute lm-evaluation-harness regression suite (EN/ES classification) using LiteLLM endpoint.
- Run Ragas hallucination checks for intake/drafting flows.
- Block production promotion if:
  - Top-1 classification <92% on priority dataset.
  - Hallucination rate >=1% on evaluation set.
  - Guardrail false-negative incidents observed during test window.

## Incident Response
- On gateway outage: fail closed by returning 503 to application; trigger Opsgenie alert via Prometheus rule `up{job="litellm"} == 0` for 1 minute.
- On model degradation: switch LiteLLM route to backup model via config map update; notify Compliance if refusal behavior shifts.
- On data leakage suspicion: revoke API keys, purge LiteLLM/vLLM logs, and follow security incident handbook.

## Validation Checklist (Per Environment)
- [ ] Secrets populated: `AI_GATEWAY_URL`, `AI_GATEWAY_API_KEY`.
- [ ] LiteLLM `/health` returns 200 and backend healthy.
- [ ] Guardrail chain logs each request with trace ID.
- [ ] Prometheus scraping LiteLLM (9100) and vLLM (8001).
- [ ] Langfuse dashboard shows live traces within 5 minutes.
- [ ] Sentry captures synthetic refusal + success events.
- [ ] Evaluation harness results archived in `ops/artifacts/<cycle>/evals/`.
- [ ] Compliance sign-off documented for refusals/disclaimers.

## References
- `TEAM/AI-Automation/AI-Automation.md`
- LiteLLM docs: https://docs.litellm.ai/docs/proxy_server
- vLLM OpenAI docs: https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html
- Guardrails: https://github.com/meta-llama/llama-guard, https://github.com/meta-llama/llama-agentic-system