import type { DocumentMetadata } from '@/types/documents';

export const metadata: DocumentMetadata = {
  id: 'employment-offer-letter',
  jurisdiction: 'US',
  category: 'Employment',
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
  templatePaths: {
    en: '/templates/en/employment-offer-letter.md',
    es: '/templates/es/employment-offer-letter.md',
  },
  upsellClauses: [],
};