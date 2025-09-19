# Legal Translation Dictionary Hotfix (document-intel-cycle-0009)

## Summary
- Rebuilt the `LegalTranslationEngine` dictionary entries for five canonical contract terms to remove mojibake and restore deterministic ASCII text.
- Ensured translations remain available in Spanish, French, German, and Portuguese with confidence metadata.

## Verification
- `npx eslint src/lib/legal-translation/LegalTranslationEngine.ts`
- `npm run typecheck` (fails on unrelated admin/AI modules; see captured log for evidence)

## Follow Up
- Coordinate with AI and Platform pods to restore global `tsc --noEmit` success so Document Intelligence regression suites can gate releases.
