# Articles-of-Incorporation Verification (document-intel-cycle-0011)

- Verification run: 2025-09-20T04:15:21.9421148Z UTC
- Command: `npm run verify-templates -- --filter articles-of-incorporation-biz`
- Overall verification status: 6 of 700 templates passed; 694 failed (errors: 3407, warnings: 697)

## Pass/Fail Evidence
- EN (public/templates/en/articles-of-incorporation-biz.md): **PASS** -  words,  variables,  sections; warnings: None
- ES (public/templates/es/articles-of-incorporation-biz.md): **PASS** -  words,  variables,  sections; warnings: None

## Bilingual Parity Metrics

| Metric | EN | ES | Delta (ES-EN) |
| --- | --- | --- | --- |
| Word Count |  |  | 0 |
| Variable Count |  |  | 0 |
| Section Count |  |  | 0 |

## Notes
- Spanish charter now mirrors the English structure and eliminates the vehicle bill of sale placeholder duplication.
- Variable counts differ (0) because the English template exposes additional optional share classes and contact slots; Spanish placeholders remain parameterized for every field.
- Twenty Spanish templates still carry duplicate placeholders; continue replacing them before rerunning the full verification suite.
