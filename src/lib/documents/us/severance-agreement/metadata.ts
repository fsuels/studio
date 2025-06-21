import type { LegalDocument } from '@/types/documents';
import { severanceAgreementSchema } from './schema';
import { severanceAgreementQuestions } from './questions';

export const severanceAgreementMeta: LegalDocument = {
  id: 'severance-agreement',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/severance-agreement.md',
    es: '/templates/es/severance-agreement.md',
  },
  schema: severanceAgreementSchema,
  questions: severanceAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Severance Agreement',
      description:
        'Create a legally binding severance agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'severance contract',
        'separation agreement',
        'employment separation',
        'severance package',
      ],
    },
    es: {
      name: 'Acuerdo de Indemnización',
      description:
        'Crea un acuerdo de indemnización legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato de indemnización',
        'acuerdo de separación',
        'paquete de indemnización',
      ],
    },
  },
};
