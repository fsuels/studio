# CSP Incident Response Playbook

## Purpose
Provide a repeatable response plan when CSP telemetry reports high or critical violations so Platform can contain threats, restore service, and coordinate cross-pod communication.

## Trigger Criteria
- `alertDelivered = false` with reason `webhook-network-error` or `webhook-status-*` on risk `high` or `critical`.
- Multiple (>=3) high/critical CSP reports from the same origin within 10 minutes.
- Any violation while `SECURITY_HEADER_MODE = enforce` on production.

## Roles & Contacts
- **Platform On-Call (PagerDuty: platform-primary)** – incident commander, technical containment.
- **SRE On-Call (PagerDuty: sre-primary)** – webhook infrastructure, observability, metrics.
- **Compliance Liaison (ops/compliance/contacts.md)** – regulatory assessment, customer comms.
- **Growth Liaison** – marketing/landing page updates if violation arises from public routes.

## Response Steps
1. **Acknowledge alert**: Platform on-call reviews the CSP violation record in Firestore (`security_csp_reports`) and confirms alert metadata.
2. **Classify severity**:
   - `critical` risk or exploit attempt on core domains ? declare **SEV-1**.
   - `high` risk with blocked third-party hosts ? declare **SEV-2**.
   - Lower severity single events ? log as **Security Watchlist**.
3. **Containment**:
   - Capture offending `document-uri` and `blocked-uri`.
   - If malicious host ? update CSP middleware allow/deny lists (temporary patch) and trigger redeploy.
   - If internal asset misconfiguration ? coordinate with owning pod for fix.
4. **Evidence collection**:
   - Save Firestore doc ID, request headers, and impacted route to `ops/incidents/<incident-id>/context.json`.
   - Snapshot relevant logs (Cloud Logging / Vercel) for timeframe ±15 min.
5. **Communicate**:
   - Open Slack channel `#incident-csp-<date>`; invite Platform, SRE, Compliance, Growth.
   - Post customer impact update in roadmap doc if SEV-1/2.
6. **Mitigation verification**:
   - Re-run affected page through CSP report testing (Chrome report-only harness).
   - Confirm webhook delivery resumed (alert `delivered = true`).
7. **Post-incident**:
   - File postmortem template (ops/runbooks/postmortem-template.md) within 24 hours.
   - Update middleware or alert configuration long-term.

## Metrics & Follow-up
- Record time-to-acknowledge (target <5 min) and time-to-mitigate (target <60 min).
- Ensure alert metrics forwarded to observability backlog (SRE task).
- Review incident summary in weekly Platform sync; log action items in TEAM/Platform-Engineering/memory.json.