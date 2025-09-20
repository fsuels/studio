# Advance Directive Verification (document-intel-cycle-0011)

- Verification run: 2025-09-20T04:09:14.9772360Z UTC
- Command: `npm run verify-templates -- --filter advance-directive`
- Overall verification status: 2 of 700 templates passed; 698 failed (errors: 3419, warnings: 697)

## Pass/Fail Evidence
- EN (public/templates/en/advance-directive.md): **PASS** - 997 words, 50 variables, 10 sections; warnings: No content pattern defined for document type: advance-directive
- ES (public/templates/es/advance-directive.md): **PASS** - 1027 words, 50 variables, 10 sections; errors: None; warnings: No content pattern defined for document type: advance-directive

## Bilingual Parity Metrics

| Metric | EN | ES | Delta (ES-EN) |
| --- | --- | --- | --- |
| Word Count | 997 | 1027 | +30 |
| Variable Count | 50 | 50 | 0 |
| Section Count | 10 | 10 | 0 |

## Notes
- Both English and Spanish advance directives now satisfy signature and legal notice checks; keep the bilingual heading text so the verifier detects the required markers.
- Templates remain structurally aligned (50 variables/10 sections shared); Spanish copy carries +30 words relative to English, preserving detailed guidance.
- Broader suite still fails because of placeholder and duplicate Spanish templates; scope follow-up remediation before rerunning global verification.

## Parity Mismatch Summary

- No variable or section mismatches detected; witness/notary variables remain aligned across EN and ES.
- Outstanding warning: `No content pattern defined for document type: advance-directive` persists for both locales (non-blocking guardrail reminder).
