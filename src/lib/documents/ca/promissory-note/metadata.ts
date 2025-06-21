import type { LegalDocumentMetadata } from '@/types/documents';

export const promissoryNoteCAMetadata: LegalDocumentMetadata = {
  jurisdiction: 'CA',
  category: 'Finance',
  languageSupport: ['en', 'fr'],
  basePrice: 7,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  translations: {
    en: {
      name: 'Promissory Note (Canada)',
      description:
        'Formal promise to repay a loan in compliance with Canadian federal and provincial law.',
      aliases: ['IOU', 'loan document', 'payment promise'],
    },
    fr: {
      name: 'Billet à ordre (Canada)',
      description:
        'Promesse officielle de rembourser un prêt conformément à la loi canadienne.',
      aliases: [
        'Reconnaissance de dette',
        'document de prêt',
        'promesse de paiement',
      ],
    },
  },
  templatePaths: {
    // Relative to /src/templates/
    en: 'en/ca/promissory-note-ca.md',
    fr: 'fr/ca/promissory-note-ca.md',
  },
  upsellClauses: [],
};
