# Spanish Policy Translation Approval Request

_Last updated: 2025-09-19T18:06:00Z (UTC)_

## Purpose
Use this template when engaging certified translators or bilingual counsel to deliver Spanish versions of the policy stack. Attach the completed request to ops/artifacts/compliance-cycle-0009/translation-approvals/ once sent.

## Request Summary
- **Policies in Scope**: docs/legal/disclaimer.md, docs/legal/terms-of-service.md, docs/legal/privacy-notice.md, docs/legal/refund-policy.md
- **Source Hashes**: Refer to ops/artifacts/compliance-cycle-0005/policy-freshness-audit.md and include latest SHA256 values in the engagement email.
- **Desired Delivery**: Signed PDFs + Markdown files under docs/legal/es/ with matching structure.
- **Glossary Reference**: ops/compliance/policy-glossary-es.json (include in package).

## Deliverables Requested
1. Certified Spanish translation for each policy (Markdown + PDF).
2. Translator certification letter (including license number and jurisdiction).
3. Statement confirming adherence to glossary and jurisdictional footnotes.
4. Review notes highlighting any legal nuances requiring Compliance approval.

## Timeline
- Draft delivery: within 3 business days of request acceptance.
- Compliance review window: 2 business days.
- Counsel sign-off: 2 business days after Compliance review (Redwood Legal LLP contact: maria.santos@redwoodlegal.com).

## Submission Instructions (copy/paste email block)
```
Subject: Spanish Policy Translation Request – 123LegalDoc

Hello <Translator Name>,

We need certified Spanish translations for the following policies:
- docs/legal/disclaimer.md
- docs/legal/terms-of-service.md
- docs/legal/privacy-notice.md
- docs/legal/refund-policy.md

Please use the attached glossary (ops/compliance/policy-glossary-es.json) and preserve markdown formatting, headings, anchors, and jurisdictional footnotes. Include your certification letter (license number, jurisdiction, expiration date) and note any legal nuances that require follow-up.

Deliverables:
1. Spanish markdown files with identical filenames under docs/legal/es/.
2. PDF copies suitable for counsel review.
3. Signed certification letter.

Target delivery date: <Date>

Please confirm receipt and feasibility. Thank you!

Regards,
123LegalDoc Compliance Team
legal@123legaldoc.com
```

## Post-Submission Checklist
- [ ] Attach glossary JSON and policy SHA256 hashes to email.
- [ ] Log request in ops/artifacts/compliance-cycle-0009/translation-approvals/translation-approval-log.md (fill translator column).
- [ ] Create Jira ticket `COMPLIANCE-TRANSLATIONS-<id>` linking to request.
- [ ] Schedule review session with Compliance and Growth pods.

## Notes
- Update this template if scope expands (e.g., Washington workflow disclosures or FAQs).
- Store sent email (EML/PDF) under ops/artifacts/compliance-cycle-0009/translation-approvals/ for auditing.