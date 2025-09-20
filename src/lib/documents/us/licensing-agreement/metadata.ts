// src/lib/documents/us/licensing-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { licensingAgreementSchema } from './schema';
import { licensingAgreementQuestions } from './questions';

export const licensingAgreementMeta: LegalDocument = {
  id: 'licensing-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/licensing-agreement.md',
    es: '/templates/es/us/licensing-agreement.md',
  },
  schema: licensingAgreementSchema,
  questions: licensingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Licensing Agreement',
      description:
        'Generate revenue from your intellectual property without selling it. Allow others to use your brand, product, or technology for royalties.',
      aliases: [
        'licensing contract',
        'license agreement',
        'intellectual property license',
      ],
    },
    es: {
      name: 'Acuerdo de Licencia',
      description:
        'Permite que otros usen tu marca, producto o tecnología a cambio de regalías. Define términos de uso y pagos.',
      aliases: [
        'contrato de licencia',
        'licencia de propiedad intelectual',
        'licencia de propiedad intelectual legal',
      ],
    },
  },
};
