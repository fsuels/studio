# GCP Monitoring Setup – Document Generation

_Last updated: 2025-09-19_

## 1. Log-Based Metrics

Create two metrics in Cloud Logging → Logs-based metrics.

### Success Count Metric
- **Name**: `documentgen_success_count`
- **Query**:
  ```
  textPayload:"[DocumentGen]" AND textPayload:"SUCCESS"
  ```
- **Labels**:
  - `operation` – extract using `REGEXP_EXTRACT(textPayload, "\[DocumentGen\]\s+SUCCESS\s+([^\s]+)")`
- **Value**: `1` (Counter)

### Error Count Metric
- **Name**: `documentgen_error_count`
- **Query**:
  ```
  textPayload:"[DocumentGen]" AND textPayload:"ERROR"
  ```
- **Labels**:
  - `operation` via `REGEXP_EXTRACT`
- **Value**: `1`

### Latency Distribution Metric
- **Name**: `documentgen_latency`
- **Query**:
  ```
  textPayload:"[DocumentGen]" AND textPayload:"SUCCESS"
  ```
- **Value**: `extract(jsonPayload.durationMs)` using the JSON payload – choose Distribution metric with unit `ms`.

Use the `jsonPayload` field (available after logger update) or extract via `REGEXP_EXTRACT` if stored as text.

## 2. Dashboard Widgets

In Cloud Monitoring → Dashboards, add:
- Time-series chart: `documentgen_success_count` and `documentgen_error_count` stacked by `operation`.
- Scorecard: success rate = success / (success + error) using MQL.
- Heatmap or line chart: `documentgen_latency` (p50, p95).

Sample MQL (success rate):
```
fetch cloud_logging
| metric 'logging.googleapis.com/user/documentgen_success_count'
| group_by [operation], sum(val())
| join (
    fetch cloud_logging
    | metric 'logging.googleapis.com/user/documentgen_error_count'
    | group_by [operation], sum(val())
  )
| map (success := val(), error := val_1)
| map (rate := success / (success + error))
```

## 3. Alerts

Create two alerting policies:

1. **Low Success Rate**
   - Condition: success rate over 15 minutes < 0.995.
   - Use a MQL-based condition similar to dashboard query.
   - Notify ops channel + email.

2. **High Latency**
   - Condition: 95th percentile of `documentgen_latency` > 3000 ms over 15 minutes.
   - Grouped by `operation` to isolate problem areas.

## 4. Automation Hook

- Schedule Cloud Scheduler job daily to trigger a Cloud Function/Workflow that queries metrics and writes a summary doc to Firestore / Slack.
- Include success rate, p95 latency, top failing operations, and link to dashboard.

## 5. Validation Steps

1. Run the smoke suite (`scripts/run-documentgen-smoke.ts`) against staging.
2. Ensure metrics and dashboard charts populate.
3. Temporarily force an error (invalid docType) to test alert path; clear after verification.

Record outcomes in ops journal and update alert recipients as team changes.
