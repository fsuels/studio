# CSP Alert Monitoring Assets

This folder contains reusable monitoring artifacts for the CSP security header rollout.

## Files
- `csp-alert-dashboard.json` – Grafana dashboard template showing CSP alert counts by result, severity, and mode.
- `csp-alert-prometheus-rules.yaml` – Prometheus alerting rules for dispatch failures and volume spikes.

## Usage
1. **Prometheus**
   - Copy `csp-alert-prometheus-rules.yaml` into the Prometheus rules directory.
   - Add or update the scrape job targeting `/api/security/csp-metrics/prom`.
   - Reload Prometheus to pick up the new rule file.
2. **Grafana**
   - Import `csp-alert-dashboard.json` via *Dashboards → New → Import*.
   - Point the panels at the Prometheus data source configured to scrape CSP metrics.

## Related Runbook
See `../runbooks/csp-alert-prometheus.md` for end-to-end rollout instructions.
