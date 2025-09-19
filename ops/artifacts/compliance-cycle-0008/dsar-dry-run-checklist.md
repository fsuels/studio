# DSAR Dry-Run Evidence Checklist

- Cycle: compliance-cycle-0008
- Prepared: 2025-09-19T17:40:00Z (UTC)
- References: ops/compliance/dsar-sop.md, ops/compliance/dsar-cookie-verification.md, ops/artifacts/compliance-cycle-0007/release-gate-status.md

## 1. Scenario Setup
| Item | Details | Owner |
| --- | --- | --- |
| Test Persona | Create test user `dsar.test+co@example.com` with Colorado locale; ensure account has document history and marketing consent records. | Platform |
| Ticket | Open Jira issue `DSAR-DRYRUN-2025W38` with request type Access + Delete (combo scenario). Attach initial request email template from Appendix A. | Compliance |
| Systems | Confirm data sources available: PostgreSQL export job, Firebase auth logs, SendGrid activity, analytics warehouse snapshot, billing data (mock if Stripe unavailable). | Platform + Payments |

## 2. Execution Steps
1. **Intake & Acknowledgment**  
   - Log request metadata per SOP Section "Request Intake".  
   - Send bilingual acknowledgment template; attach copy (.md) to Jira ticket.
2. **Identity Verification**  
   - Perform medium-risk verification (email confirmation + knowledge-based questions).  
   - Upload masked evidence to secure OneDrive and note link inside Jira.
3. **Data Collection**  
   - Export account data from each system; redact internal notes.  
   - Document owner + timestamp for each export in Jira checklist.
4. **Package Assembly**  
   - Create directory `ops/artifacts/compliance-cycle-0008/privacy-evidence/DSAR-DRYRUN-2025W38/`.  
   - Include: `00_cover_letter_EN.md`, `00_cover_letter_ES.md`, `01_data_access.json`, `02_data_access.csv`, `03_action_confirmation.pdf` (deletion confirmation), `hashes.txt` with SHA256 values.  
   - Zip package (`DSAR-DRYRUN-2025W38.zip`), encrypt with AES-256, store password in 1Password vault entry "DSAR Dry Run 2025W38".
5. **Delivery Simulation**  
   - Generate expiring download link (7 days) via SharePoint or S3 pre-signed URL.  
   - Document delivery timestamp and password transmission method in Jira.
6. **Deletion/Opt-Out Confirmation**  
   - Simulate account deletion flag and marketing opt-out; capture screenshots/logs showing status changes.  
   - Record system rollback plan post-test.
7. **Closure & Metrics**  
   - Complete Jira fields: response duration, verification method, denial reason (if any), extension flag.  
   - Add summary comment referencing evidence folder path and checksum file.

## 3. Evidence to Capture
| Evidence | Path/Format | Notes |
| --- | --- | --- |
| Acknowledgment email (EN/ES) | `ops/artifacts/compliance-cycle-0008/privacy-evidence/DSAR-DRYRUN-2025W38/acknowledgment-*` | Use templates from dsar SOP Appendix A. |
| Verification log | Jira comment + secure OneDrive link | Mask PII before attaching. |
| Data exports | JSON + CSV per system | Include `source_system` metadata in filenames. |
| Delivery link proof | Screenshot or log snippet | Ensure expiry timestamp visible. |
| Hash manifest | `hashes.txt` | Include SHA256 for every attachment + encrypted zip. |
| Checklist sign-off | `dsar-dry-run-checklist-signed.md` | Capture owners + timestamps. |

## 4. Acceptance Criteria
- Acknowledgment sent within 24 hours and logged in Jira.
- Verification evidence stored securely with link in ticket.
- All required data sources represented in access package; missing systems noted with rationale.
- Encrypted package uploaded and password communication captured separately.
- Deletion/opt-out simulation documented with rollback steps.
- Jira ticket closed with summary referencing `ops/artifacts/compliance-cycle-0008/privacy-evidence/DSAR-DRYRUN-2025W38/` and checksum entry.

## 5. Follow-Ups
1. Platform: automate hash generation and storage under `hashes.txt` via script for future DSARs.
2. Compliance: schedule quarterly DSAR tabletop using this checklist and store outputs under `ops/artifacts/compliance-cycle-<cycle>/privacy-evidence/`.
3. Payments: once Stripe goes live, add transaction exports and refund ledger screenshots to evidence package.
4. Growth: ensure marketing consent toggle updates are reflected in telemetry export for verification.

## 6. Reporting & Release Gate
- Upload signed checklist to `ops/artifacts/compliance-cycle-0008/privacy-evidence/dsar-dry-run-checklist-signed.md`.
- Update ops/artifacts/compliance-cycle-0007/release-gate-status.md (next cycle) with completion status and blockers cleared.
- Reference this document in the next Compliance memory.json update and cross-pod handoff summary for CEO aggregation.