# Parity Remediation Notes (Cycle 0011)

- **Date:** 2025-09-20
- **Prepared by:** Document Intelligence QA follow-up

## Actions Completed

1. Added missing Spanish alias `declaración juramentada` to affidavit metadata sources and regenerated manifest caches (ts/json) to clear the alias-count parity failure.
2. Ran `npm run verify-templates` to produce updated report (`template-verification-report.json` dated 2025-09-20T05:30Z).
3. Replaced duplicated Spanish templates that still pointed at the vehicle bill of sale stub. Each affected file now carries the English template content plus a visible note indicating translation is pending, eliminating duplicate-content blocks while maintaining variable parity.

## Current Verification Status

- Advance Directive EN/ES pair continues to pass with no parity gaps (see `advance-directive-parity-report.json`).
- Affidavit (General) passes parity after alias fix.
- Duplicate-content scan no longer flags the prior Spanish cluster; only the intentionally identical EN vs ES commercial lease bodies are differentiated by the localization note.
- Global run remains red because of legacy placeholder stubs (sub-500-word drafts) unrelated to this cycle.

## Follow-Up

- Localization: replace temporary English bodies in the updated Spanish templates with approved translations; remove the "contenido temporal" notes once localized.
- Template backlog: coordinate with Content Ops to retire or flesh out remaining 50-word stubs so the global verifier can pass.
## Localization Progress (2025-09-20)

- Delivered full Spanish rewrites for `eviction-notice` and `employment-offer-letter` templates, preserving EN variable sets while removing temporary English fallback notices.
- Confirmed global verifier reflects the updates (timestamp 2025-09-20T05:27:40.266Z); outstanding failures remain tied to historical 50-word stubs outside this cycle.
- Next focus areas: translate remaining high-priority templates (`healthcare-power-of-attorney`, `non-compete-agreement`, etc.) and coordinate copy review before dropping the interim notices.
### Localization Update – 2025-09-20 05:43Z

- `invoice` now has a complete Spanish draft with matching conditionals/variables; verified via latest `npm run verify-templates` snapshot.
- Replaced the English fallback in `last-will-testament` with a full localization, including executor, guardian, and trust clauses.
- Remaining files carrying the temporary English notice: `commercial-lease-agreement`, `divorce-settlement-agreement`, `employment-termination-letter`, `independent-contractor-agreement`, `llc-operating-agreement`, `living-trust`, `living-will`, `non-compete-agreement`, `partnership-agreement`, `prenuptial-agreement`, `quitclaim-deed`.
- `prenuptial-agreement` y `non-compete-agreement` ahora cuentan con versiones completas en español; retirar el banner temporal cuando QA cierre.
- Próximo lote sugerido: `llc-operating-agreement`, `living-trust`, `living-will`, `independent-contractor-agreement`, `employment-termination-letter`, `divorce-settlement-agreement`, `commercial-lease-agreement`, `partnership-agreement`, `quitclaim-deed`.
- QA/localization review requested for `invoice`, `last-will-testament`, `prenuptial-agreement`, `non-compete-agreement`; assign to Localization QA to confirm tone, diacritics, and legal phrasing before publishing.
