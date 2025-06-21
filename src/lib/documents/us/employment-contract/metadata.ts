import type { LegalDocument } from '@/types/documents';
import { employmentContractSchema } from './schema';
import { employmentContractQuestions } from './questions';

export const employmentContractMeta: LegalDocument = {
  id: 'employment-contract',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employment-contract.md',
    es: '/templates/es/employment-contract.md',
  },
  schema: employmentContractSchema,
  questions: employmentContractQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employment Contract',
      description:
        'Create a legally binding employment contract with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'employment agreement',
        'job contract',
        'work agreement',
        'employee contract',
      ],
    },
    es: {
      name: 'Contrato de Empleo',
      description:
        'Crea un contrato de empleo legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: ['acuerdo de empleo', 'contrato laboral', 'acuerdo de trabajo'],
    },
  },
};
