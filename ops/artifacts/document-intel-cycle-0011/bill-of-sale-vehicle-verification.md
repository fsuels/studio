# Vehicle Bill of Sale Verification (document-intel-cycle-0011)

- Verification run: 2025-09-20T04:35:41.7274470Z UTC
- Command: `npm run verify-templates -- --filter bill-of-sale-vehicle`
- Overall verification status: 6 of 700 templates passed; 694 failed (errors: 3979, warnings: 696)

## Pass/Fail Evidence
- EN (public/templates/en/bill-of-sale-vehicle.md): **PASS** - 833 words, 39 variables, 9 sections; warnings: Inconsistent markdown formatting detected
- ES (public/templates/es/bill-of-sale-vehicle.md): **PASS** - 882 words, 40 variables, 9 sections; warnings: Inconsistent markdown formatting detected

## Bilingual Parity Metrics

| Metric | EN | ES | Delta (ES-EN) |
| --- | --- | --- | --- |
| Word Count | 833 | 882 | +49 |
| Variable Count | 39 | 40 | +1 |
| Section Count | 9 | 9 | 0 |

## Notes
- English agreement expanded above the 500-word threshold, removes the prohibited placeholder footer, and now covers delivery logistics, insurance, and tax allocation.
- Spanish translation mirrors the English structure with bilingual section markers so document-specific checks (Vehicle Description, Purchase Price, Condition of Vehicle) pass without false failures.
- Remaining suite failures stem from legacy placeholder stubs and duplicate Spanish templates; continue replacing them to improve the global verification baseline.
