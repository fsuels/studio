import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const operatingAgreement: LegalDocument = {
  id: 'operating-agreement',
  name: 'Operating Agreement (LLC)',
  category: 'Business',
  description:
    'Outline the ownership structure and operating procedures for an LLC.',
  aliases: ['LLC agreement', 'limited liability company'],
  translations: {
    en: {
      name: 'Operating Agreement (LLC)',
      description:
        'Outline the ownership structure and operating procedures for an LLC.',
      aliases: ['LLC agreement', 'limited liability company'],
    },
    es: {
      name: 'Acuerdo Operativo (LLC)',
      description:
        'Esbozar la estructura de propiedad y los procedimientos operativos para una LLC.',
      aliases: ['acuerdo de LLC', 'sociedad de responsabilidad limitada'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [], // Placeholder
};
