// src/lib/documents/us/advance-directive-revocation/metadata.ts
import type { LegalDocument } from '@/types/documents';

export const advanceDirectiveRevocationMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'advance-directive-revocation',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/advance-directive-revocation.md',
    es: '/templates/es/advance-directive-revocation.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Advance Directive Revocation',
      description: 'Legal document to revoke or cancel a previously executed advance healthcare directive.',
      aliases: [
        'revocation of advance directive',
        'advance healthcare directive revocation',
        'cancellation of advance directive',
        'advance directive cancellation',
        'revoke healthcare directive',
        'cancel medical directive',
      ],
    },
    es: {
      name: 'Revocación de Directiva Médica Anticipada',
      description: 'Documento legal para revocar o cancelar una directiva médica anticipada ejecutada previamente.',
      aliases: [
        'revocación de directiva anticipada',
        'revocación de directiva médica anticipada',
        'cancelación de directiva anticipada',
        'cancelación de directiva médica',
        'revocar directiva médica',
        'cancelar directiva médica',
      ],
    },
  },
};