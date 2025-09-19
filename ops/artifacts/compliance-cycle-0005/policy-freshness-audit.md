# Policy Freshness Audit - 2025-09-19

- **Cycle**: compliance-cycle-0005
- **Scope**: docs/legal/disclaimer.md, docs/legal/terms-of-service.md, docs/legal/privacy-notice.md, docs/legal/refund-policy.md
- **Objective**: Validate currency of customer-facing policies and schedule the next reviews (Compliance Playbook 90-Day Objective #1).

## Findings Overview
- All four baseline policies were last versioned on 2025-09-19 and remain accurate for U.S. launch scope.
- Spanish coverage is limited to inline summaries; full translations require counsel review before launch promises bilingual parity.
- Privacy notice aligns with CCPA Sections 1798.100-1798.185 and GDPR Articles 5 and 12 disclosure requirements; monitoring triggered for new state privacy statutes (for example, CPA and VCDPA) ahead of 2025 effective updates.

## Policy Review Matrix
| Policy | Path | Document Date | Review Date (UTC) | Cadence | Next Review Due | Responsible Owner | Legal References | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Service Disclaimer | docs/legal/disclaimer.md | 2025-09-19 | 2025-09-19 | Monthly (UPL risk monitoring) | 2025-10-17 | Compliance (Jordan Ellis) | ABA Model Rule 5.5; Texas Government Code Section 81.101; FTC .com Disclosures | Spanish summary only; needs certified translation plus jurisdiction footnotes.
| Terms of Service | docs/legal/terms-of-service.md | 2025-09-19 | 2025-09-19 | Quarterly | 2025-12-18 | Compliance and Platform | Texas Business and Commerce Code Section 322 (UTMA and E-Sign); AAA Rules | Update dispute resolution section once payments pod finalizes production Stripe rollout.
| Privacy Notice | docs/legal/privacy-notice.md | 2025-09-19 | 2025-09-19 | Monthly (due to evolving state laws) | 2025-10-17 | Privacy Officer (Luis Martinez) | CCPA Sections 1798.100-1798.185; GDPR Articles 12-14; Colorado Privacy Act Section 6-1-1301 | Need bilingual UI notices and DSAR response SLAs documented with Platform.
| Refund Policy | docs/legal/refund-policy.md | 2025-09-19 | 2025-09-19 | Quarterly | 2025-12-18 | Compliance and Payments | California Civil Code Section 1723; FTC Cooling-Off Rule | Align checkout disclosures plus receipt language with Payments SOP before go-live.

## Required Follow-Ups
- Draft full Spanish translations for all four policies with certified reviewer sign-off (Compliance todo #1).
- Coordinate with Platform to surface policy version and review dates in footer and account settings before release gate closes.
- Partner with Payments pod to incorporate refund eligibility logic into support scripts and automated emails.
- Establish change monitoring feed for U.S. privacy legislation (Washington, Utah, Tennessee) and log in jurisdiction knowledge base.

## Evidence
- Verified Markdown sources in repo: docs/legal/disclaimer.md, terms-of-service.md, privacy-notice.md, refund-policy.md (git tree at current HEAD).
- Review session recorded in this artifact; include checksum in ops/artifacts/compliance-cycle-0005/checksums.json.
