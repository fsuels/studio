// src/lib/documents/us/employment-offer-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EmploymentOfferLetterSchema } from './schema';
import { employmentOfferLetterQuestions } from './questions';

export const employmentOfferLetterMeta: LegalDocument = {
  id: 'employment-offer-letter',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employment-offer-letter.md',
    es: '/templates/es/employment-offer-letter.md',
  },
  schema: EmploymentOfferLetterSchema,
  questions: employmentOfferLetterQuestions,
  upsellClauses: [],
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
};