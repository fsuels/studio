// src/lib/documents/us/collection-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CollectionLetterSchema } from './schema';
import { collectionLetterQuestions } from './questions';

export const collectionLetterMeta: LegalDocument = {
  id: 'collection-letter',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  basePrice: 5,
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  states: 'all',
  templatePaths: {
    en: '/templates/en/collection-letter.md',
    es: '/templates/es/collection-letter.md',
  },
  schema: CollectionLetterSchema,
  questions: collectionLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Collection Letter',
      description:
        'Send professional debt collection letters to recover outstanding payments with legal compliance.',
      aliases: [
        'debt collection letter',
        'payment demand',
        'collections notice',
        'past due notice',
      ],
    },
    es: {
      name: 'Carta de Cobranza',
      description:
        'Enviar cartas profesionales de cobranza de deudas para recuperar pagos pendientes con cumplimiento legal.',
      aliases: [
        'carta de cobranza de deuda',
        'demanda de pago',
        'aviso de cobranza',
        'aviso de vencimiento',
      ],
    },
  },
};
