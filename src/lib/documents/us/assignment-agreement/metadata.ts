// src/lib/documents/us/assignment-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { assignmentAgreementSchema } from './schema';
import { assignmentAgreementQuestions } from './questions';

export const assignmentAgreementMeta: Omit<
  LegalDocument,
  'schema' | 'questions'
> = {
  id: 'assignment-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/assignment-agreement.md',
    es: '/templates/es/assignment-agreement.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Assignment Agreement',
      description:
        'Transfer contract rights and obligations from one party to another.',
      aliases: [
        'contract assignment',
        'right assignment',
        'assignment agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Cesión',
      description:
        'Transferir derechos y obligaciones contractuales de una parte a otra.',
      aliases: [
        'cesión de contrato',
        'cesión de derechos',
        'acuerdo de cesión',
      ],
    },
  },
};
