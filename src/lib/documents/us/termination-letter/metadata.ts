import type { LegalDocument } from '@/types/documents';
import { terminationLetterSchema } from './schema';
import { terminationLetterQuestions } from './questions';

export const terminationLetterMeta: LegalDocument = {
  id: 'termination-letter',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/termination-letter.md',
    es: '/templates/es/termination-letter.md',
  },
  schema: terminationLetterSchema,
  questions: terminationLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employment Termination Letter',
      description: 'Create a professional employment termination letter with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'termination notice',
        'employment termination',
        'firing letter',
        'dismissal letter'
      ],
    },
    es: {
      name: 'Carta de Terminación de Empleo',
      description: 'Crea una carta de terminación de empleo profesional con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'aviso de terminación',
        'carta de despido',
        'terminación laboral'
      ],
    },
  },
};
