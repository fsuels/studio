# CSP Metrics Telemetry Validation - platform-cycle-0008

## Summary
- Exposed `/api/security/csp-metrics` JSON endpoint returning counters and last-event metadata for SRE dashboards.
- Added `/api/security/csp-metrics/prom` Prometheus-compatible endpoint sourced from the shared `prom-client` registry.
- Extended `recordCspAlertMetric` to increment Prometheus counters alongside structured audit logging.

## Verification
- Hit the JSON endpoint via unit test to confirm counters increment after synthetic alert recording.
- Validated Prometheus scrape output includes `csp_alerts_total` samples with result/severity/risk labels.
- Tests: `npm run test -- __tests__/middleware/security-headers.test.ts src/lib/security/__tests__/csp-alerts.test.ts src/app/api/security/__tests__/csp-metrics-route.test.ts --runInBand`.

- SRE runbook: ops/runbooks/csp-alert-prometheus.md
- Grafana dashboard template: ops/monitoring/csp-alert-dashboard.json
- Prometheus rules bundle: ops/monitoring/csp-alert-prometheus-rules.yaml
- Monitoring README: ops/monitoring/README.md
- Verification script: node scripts/check-csp-metrics.mjs <baseUrl> [token]
