# document-intel-cycle-0011 Intake Checklist

- **Prepared By**: Agent 3 (Document Intelligence Ops)
- **Date**: 2025-09-20
- **Cycle Links**: ops/artifacts/document-intel-cycle-0010/compliance-briefing-spanish-metadata.md | TEAM/Document-Intelligence/memory.json

## Cycle Objectives
- [ ] Validate notarization and witness parity across advance-directive EN/ES templates via updated verify-templates checks.
- [ ] Close out Georgia T-7 overlay QA using captured crops and annotated samples in this directory.
- [ ] Stage Washington disclosure insert for intake review once compliance sign-off is filed.

## Required Inputs & Owners
| Item | Owner | Source | Status |
| --- | --- | --- | --- |
| verify-templates parity run (advance-directive focus) | Document Intelligence QA | `npm run verify-templates -- --filter advance-directive` | Complete (report archived 2025-09-20) |
| Georgia T-7 PDF validation (sale date, buyer address) | Overlay QA | Georgia T-7 overlay assets (PNG/PDF) in this folder | In Progress |
| Compliance briefing acknowledgments | Compliance Lead | ops/artifacts/document-intel-cycle-0010/compliance-briefing-spanish-metadata.md | Ready |
| Washington localization insert draft | Compliance & Localization | ops/compliance/state-disclaimer-inserts.md | Ready for review |
## Pre-Flight Checks
1. Confirm new critical parity errors appear when notarization variables drop from either locale.
2. Ensure verify-templates report exports include language + variable metadata for downstream dashboards.
3. Sync with Compliance on Redwood Legal certification chase list (see TEAM/Compliance-Legal/memory.json).

## Open Questions
- Do we need additional Jest coverage for the critical execution variables added to verify-templates?
- Should Washington addendum prompts ship alongside the DSAR checklist or as a distinct intake flow asset?
- What additional placeholder replacements can ride this cycle without blocking QA bandwidth?









