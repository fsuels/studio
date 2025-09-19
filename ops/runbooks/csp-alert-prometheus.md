# CSP Alert Telemetry Prometheus Integration Runbook

## Purpose
Provide SRE with a deterministic procedure to scrape CSP alert metrics, wire alerts, and surface dashboards before we flip security headers to enforce.

## Endpoints
- JSON snapshot: `GET /api/security/csp-metrics` (returns counters + last event metadata).
- Prometheus scrape: `GET /api/security/csp-metrics/prom` (text/plain; returns 503 if `prom-client` is unavailable).

## Prerequisites
- Platform deployed with `prom-client` bundled (already in package.json).
- Runtime accessible via HTTPS from Prometheus; secure scrape traffic using existing internal auth or IP restrictions.
- `/api/security/*` routes already receive security headers via middleware; keep caching disabled.

## Prometheus Job Configuration
```yaml
scrape_configs:
  - job_name: csp_alerts
    scheme: https
    metrics_path: /api/security/csp-metrics/prom
    scrape_interval: 30s
    scrape_timeout: 10s
    static_configs:
      - targets:
          - app.123legaldoc.com
    authorization:
      type: Bearer
      credentials: ${CSP_PROMETHEUS_BEARER_TOKEN}
```
- Issue a dedicated bearer token (or rely on mTLS) as required by infrastructure policy.
- For staging, swap `targets` to the staging hostname and confirm a `200` response.
- Prometheus will emit a scrape error if the endpoint returns `503`; investigate server logs for module load failures.

## Grafana Panels
- Query: `sum by (result) (increase(csp_alerts_total[5m]))` – display alert outcomes in the last five minutes.
- Alerting query: `sum by (result)(increase(csp_alerts_total{result="failed"}[5m])) > 0` to page Platform on dispatch failures.
- Track enforcement by filtering `csp_alerts_total{mode="enforce"}` once headers move out of report-only.

## Operational Notes
- JSON endpoint remains useful for debugging; restrict to internal tooling.
- Counters reset on process restart; no manual reset endpoint is provided by design.
- Last event structure mirrors the audit payload (blocked/document URI already redacted upstream).

## Compliance Checklist
- Labels limited to `result`, `severity`, `risk_level`, and `mode`; confirm no PII before enabling enforcement.
- Ensure Prometheus retention complies with security logging policy (default 30d is acceptable per policy baseline).

## Handoff
- Owners: Platform Engineering with SRE partnership.
- Target: finish scrape/Dashboards before enabling `SECURITY_HEADER_MODE=enforce`.

## Monitoring Assets
- Grafana dashboard template: `ops/monitoring/csp-alert-dashboard.json`
- Prometheus rules: `ops/monitoring/csp-alert-prometheus-rules.yaml`
- Monitoring asset guide: `ops/monitoring/README.md`
- Verification script: `node scripts/check-csp-metrics.mjs <baseUrl> [token]`
