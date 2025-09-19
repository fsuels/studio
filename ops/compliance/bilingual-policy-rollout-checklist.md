# Bilingual Policy Rollout Checklist

_Last updated: 2025-09-19T18:40:00Z (UTC)_

## 1. Translation & Approval
- [ ] Confirm English source hashes (ops/artifacts/compliance-cycle-0009/translation-approvals/policy-hash-summary-2025-09-19.txt).
- [ ] Send translation request (ops/compliance/spanish-translation-approval-request.md); attach glossary and hash summary.
- [ ] Receive Spanish markdown + PDFs; store under docs/legal/es/ and ops/artifacts/compliance-cycle-XXXX/translation-approvals/.
- [ ] Record translator certification and approval dates in translation log.
- [ ] Compliance review for jurisdiction footnotes; document sign-off.
- [ ] Counsel approval captured (signature/email PDF).

## 2. Product Integration
- [ ] Platform updates policy routes `/es/<policy>` with breadcrumbs, metadata, and hreflang.
- [ ] Footer links point to language-specific policies (English/Spanish).
- [ ] In-app modals/tooltips updated with bilingual policy links (checkout, account settings).
- [ ] DSAR/self-service flows reference localized policies.
- [ ] Growth updates marketing pages and emails with bilingual policy references.

## 3. SEO & Discoverability
- [ ] Add hreflang tags for English/Spanish pairs.
- [ ] Update sitemap entries for Spanish policy routes.
- [ ] Validate robots & canonical tags.

## 4. Evidence Packaging
- [ ] Screenshots of UI footer, modals, policy pages (EN/ES).
- [ ] Hashes for Spanish policy files.
- [ ] Update release gate checklist with bilingual evidence paths.
- [ ] Archive approvals and screenshots under ops/artifacts/compliance-cycle-XXXX/bilingual-policy-rollout/.

## 5. Post-Launch Monitoring
- [ ] Monitor analytics to confirm Spanish policy page engagement.
- [ ] Add to legal change monitoring for ongoing updates.
- [ ] Review translations quarterly or upon policy changes.

## Notes
- Coordinate with Platform/Growth for release timeline.
- Update this checklist per jurisdiction (add French Canadian, etc. as needed).