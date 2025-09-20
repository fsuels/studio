import type { LegalDocument } from '@/types/documents';
import { offerLetterSchema } from './schema';
import { offerLetterQuestions } from './questions';

export const offerLetterMeta: LegalDocument = {
  id: 'offer-letter',
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
    en: '/templates/en/employment-offer-letter.md',
    es: '/templates/es/employment-offer-letter.md',
  },
  schema: offerLetterSchema,
  questions: offerLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Job Offer Letter',
      description:
        'Create a professional employment offer letter with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'job offer letter',
        'employment offer',
        'offer of employment',
        'job offer',
      ],
    },
    es: {
      name: 'Carta de Oferta Laboral',
      description:
        'Crea una carta de oferta de empleo profesional con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'oferta de trabajo',
        'carta de trabajo',
        'oferta de empleo',
        'oferta de trabajo legal',
      ],
    },
  },
};
