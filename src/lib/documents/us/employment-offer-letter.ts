import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const employmentOfferLetter: LegalDocument = {
  id: 'employment-offer-letter',
  name: 'Employment Offer Letter',
  category: 'Employment',
  description:
    'Formalize a job offer with key terms like salary, start date, and position.',
  aliases: ['hire employee', 'job offer', 'terms of employment'],
  translations: {
    en: {
      name: 'Employment Offer Letter',
      description:
        'Formalize a job offer with key terms like salary, start date, and position.',
      aliases: ['hire employee', 'job offer', 'terms of employment'],
    },
    es: {
      name: 'Carta de Oferta de Empleo',
      description:
        'Formalizar una oferta de trabajo con términos clave como salario, fecha de inicio y puesto.',
      aliases: ['contratar empleado', 'oferta de trabajo', 'términos de empleo'],
    },
  },
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [], // Placeholder
};
