import type { LegalDocument } from '@/types/documents';
import { llcOperatingAgreementSchema } from './schema';
import { llcOperatingAgreementQuestions } from './questions';

export const llcOperatingAgreementMeta: LegalDocument = {
  id: 'llc-operating-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/llc-operating-agreement.md',
    es: '/templates/es/llc-operating-agreement.md',
  },
  schema: llcOperatingAgreementSchema,
  questions: llcOperatingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'LLC Operating Agreement',
      description: 'Create a legally binding LLC operating agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'llc operating contract',
        'business operating agreement',
        'commercial agreement',
        'company operating agreement'
      ],
    },
    es: {
      name: 'Acuerdo Operativo de LLC',
      description: 'Crea un acuerdo operativo de LLC legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato operativo de llc',
        'acuerdo de operación comercial',
        'acuerdo comercial'
      ],
    },
  },
};
