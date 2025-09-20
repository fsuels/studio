// src/lib/documents/us/sublease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SubleaseAgreementSchema } from './schema';
import { subleaseAgreementQuestions } from './questions';

export const subleaseAgreementMeta: LegalDocument = {
  id: 'sublease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/sublease-agreement.md',
    es: '/templates/es/sublease-agreement.md',
  },
  schema: SubleaseAgreementSchema,
  questions: subleaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Sublease Agreement',
      description:
        'Reduce housing costs or generate income through subleasing arrangements. Navigate complex rental situations legally.',
      aliases: [
        'sublet agreement',
        'subletting contract',
        'sublet lease',
        'sublease contract',
      ],
    },
    es: {
      name: 'Acuerdo de Subarriendo',
      description:
        'Renta tu apartamento a otra persona mientras sigues siendo responsable del contrato original. Útil cuando te mudas temporalmente.',
      aliases: [
        'contrato de subarriendo',
        'subarriendo',
        'subarrendamiento',
        'contrato de subarrendamiento',
      ],
    },
  },
};
