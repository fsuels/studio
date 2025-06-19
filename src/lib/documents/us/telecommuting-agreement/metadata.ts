// src/lib/documents/us/telecommuting-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const telecommutingAgreementMeta: LegalDocument = {
  id: 'telecommuting-agreement',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/telecommuting-agreement.md',
    es: '/templates/es/telecommuting-agreement.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Telecommuting Agreement',
      description:
        'Establish terms and conditions for remote work arrangements between employer and employee.',
      aliases: ['remote work agreement', 'telework policy', 'work from home contract'],
    },
    es: {
      name: 'Acuerdo de Teletrabajo',
      description:
        'Establecer términos y condiciones para acuerdos de trabajo remoto entre empleador y empleado.',
      aliases: ['acuerdo de trabajo remoto', 'política de teletrabajo', 'contrato de trabajo desde casa'],
    },
  },
};