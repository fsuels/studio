# Policy Linking Implementation Plan

_Last updated: 2025-09-19T18:42:00Z (UTC)_

## Touchpoints
| Area | Requirement | Owner | Notes |
| --- | --- | --- | --- |
| Footer | Link English/Spanish policies with locale-aware routes | Platform | Use dynamic footer component; add hreflang rel tags. |
| Checkout | Surface bilingual policy acknowledgment modal | Platform + Compliance | Modal copy from spanish-translation-approval-request once signed. |
| Onboarding Wizard | Include disclaimer link and bilingual tooltip | Platform | Reference localized disclaimers. |
| Marketing Pages | Update pricing/templates pages with bilingual policy references | Growth | Coordinate with translation sign-off; update SEO meta. |
| Email Templates | Add policy links to transactional emails | Growth | Audit existing templates; add Spanish footers. |
| Help Center | Cross-link policies in Spanish support articles | Compliance + Growth | Ensure new articles reference docs/legal/es/*.

## Integration Steps
1. Create feature flags (`POLICY_LINKS_LOCALE`) for gradual rollout.
2. Update route definitions to include /es endpoints for policies.
3. Ensure sitemap & robots include Spanish policy paths.
4. QA pass: confirm links resolve correctly on all locales.
5. Collect screenshots for release gate evidence.

## Dependencies
- Spanish translations approved (translation log).
- DSAR dry-run evidence to confirm privacy workflows.

## Next Actions
- Platform: add feature flag and locale-aware footer
- Growth: prepare copy updates and QA checklists
- Compliance: review UI for compliance messaging accuracy