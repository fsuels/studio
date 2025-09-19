# Compliance Release Gate Checklist

> Store signed copies under `ops/artifacts/<release_cycle>/compliance-release-gate.md`. Complete before lifting weekly release freeze.

## 1. Unauthorized Practice of Law (UPL) Safeguards
- [ ] Disclaimers refreshed for impacted flows (ABA Model Rule 5.5; state UPL statutes)
- [ ] Automated guidance reviewed for scope-of-service limits (no individualized advice)
- [ ] Attorney referral and escalation paths validated
- Evidence:
  - Owner:
  - Timestamp:

## 2. Privacy & Data Protection
- [ ] Data inventory changes assessed (CCPA Section 1798.100; GDPR Art.5 & 25)
- [ ] DPIA/PIA updates attached when new processing introduced
- [ ] Cookie/consent banners verified against locale requirements
- Evidence:
  - Owner:
  - Timestamp:

## 3. Marketing & Claims Review
- [ ] Landing pages, emails, ads reviewed for FTC Act Section 5 truth-in-advertising
- [ ] Testimonials, guarantees, refund language match approved copy
- [ ] Localization and translations spot-checked for parity
- Evidence:
  - Owner:
  - Timestamp:

## 4. Payments & Refund Compliance
- [ ] Pricing and fee disclosures match Terms (Truth in Lending, state refund laws)
- [ ] Refund/chargeback SOP verified with Payments pod
- [ ] Payment processor logs reviewed (Stripe, etc.)
- Evidence:
  - Owner:
  - Timestamp:

## 5. Security & Incident Readiness
- [ ] Security headers report reviewed (CSP, HSTS report-only)
- [ ] Incident log updated; no unresolved critical findings
- [ ] Contact matrix/bridge line confirmed
- Evidence:
  - Owner:
  - Timestamp:

## 6. Cross-Pod Sign-Offs
| Pod | Representative | Sign-off Date | Notes |
| --- | --- | --- | --- |
| Compliance |  |  |  |
| Platform |  |  |  |
| Document Intelligence |  |  |  |
| Growth |  |  |  |
| Payments |  |  |  |
| AI |  |  |  |

## 7. Artifact Upload
- [ ] Signed checklist stored under `ops/artifacts/<release_cycle>/compliance-release-gate.md`
- [ ] Supporting evidence paths listed in Memory.md cycle entry
- [ ] PR/Change log references updated


