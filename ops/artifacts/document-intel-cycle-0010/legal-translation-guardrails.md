# Legal Translation Guardrail Reinforcement (document-intel-cycle-0010)

## Summary
- Extended the mojibake scanner to include `src/lib/legal-translation` TypeScript sources alongside policy/content files.
- Added Jest guardrail tests ensuring the LegalTranslationEngine dictionary contains neither Unicode replacement chars nor `?` mojibake sequences.

## Verification
- `npx jest --runTestsByPath src/lib/legal-translation/__tests__/legal-translation-encoding.guardrails.test.ts --runInBand`
- `npx tsx scripts/i18n/check-mojibake.ts`
- `npx eslint --no-ignore src/lib/legal-translation/__tests__/legal-translation-encoding.guardrails.test.ts` *(ignored by project configuration; see cycle summary)*
