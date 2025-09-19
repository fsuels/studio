# Consent Telemetry Export Instructions

Prepared: 2025-09-19T20:01:31.1444628Z (UTC)
Cycle: compliance-cycle-0015
References: ops/artifacts/compliance-cycle-0010/dsar-dry-run-prep.md; ops/artifacts/compliance-cycle-0014/dsar-dry-run-updates.md; ops/artifacts/compliance-cycle-0014/release-gate-evidence-checklist.md; ops/compliance/dsar-acknowledgment-template.md

## Purpose
Provide Platform with deterministic steps to capture cookie/consent telemetry evidence required for the DSAR dry run and release gate sign-off.

## Export Requirements
- **Data window:** 2025-09-18T00:00Z through 2025-09-23T00:00Z
- **Sources:** Consent banner telemetry (Firestore collection "consent_events"), analytics warehouse table "consent_logs", edge logging if applicable.
- **Fields:** timestamp (UTC ISO-8601), user/test account identifier, event type (banner_shown, banner_acknowledged), locale, policy_version, user_agent snippet, consent_decision.
- **Format:** CSV plus JSON summary; include SHA256 hash for each file.

## Step-by-Step
1. Query consent events for the specified window and test account IDs listed in ops/artifacts/compliance-cycle-0010/dsar-dry-run-prep.md.
2. Export CSV with required fields; save under ops/artifacts/compliance-cycle-0015/consent-telemetry/consent-events.csv.
3. Generate SHA256 hash (Get-FileHash or shasum -a 256) and record in ops/artifacts/compliance-cycle-0015/consent-telemetry/hashes.txt.
4. Produce JSON summary (consent-summary.json) with counts by event type, locale, and policy_version.
5. Capture screenshot of monitoring dashboard (if available) showing consent event timeline; store as consent-events.png in the same directory.
6. Notify Compliance upon completion so evidence can be linked in the release gate checklist.

## Delivery Checklist
- [ ] CSV export saved under ops/artifacts/compliance-cycle-0015/consent-telemetry/consent-events.csv
- [ ] hashes.txt with SHA256 recorded for each file
- [ ] consent-summary.json with aggregated metrics
- [ ] Screenshot evidence (optional but recommended)
- [ ] Confirmation message sent to Compliance with timestamps and hash references

## Notes
- Use test account DSAR-TEST-CO for verification to avoid production PII exposure.
- Redact IP addresses before sharing exports; follow privacy SOP redaction guidelines.
- If telemetry pipeline is unavailable, document blockers immediately so Compliance can escalate.
