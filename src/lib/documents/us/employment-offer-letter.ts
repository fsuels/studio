import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const employmentOfferLetter: LegalDocument = {
  id: 'employment-offer-letter',
  // TODO: Refactor to use translations structure
  name: 'Employment Offer Letter',
  name_es: 'Carta de Oferta de Empleo',
  category: 'Employment',
  description: 'Formalize a job offer with key terms like salary, start date, and position.',
  description_es: 'Formalizar una oferta de trabajo con términos clave como salario, fecha de inicio y puesto.',
  aliases: ["hire employee", "job offer", "terms of employment"],
  aliases_es: ["contratar empleado", "oferta de trabajo", "términos de empleo"],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [] // Placeholder
};