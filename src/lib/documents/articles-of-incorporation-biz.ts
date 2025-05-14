import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const articlesOfIncorporationBiz: LegalDocument = {
  id: 'articles-of-incorporation-biz',
  name: 'Articles of Incorporation',
  name_es: 'Acta Constitutiva',
  category: 'Business',
  description: 'Formal document filed with the state to create a corporation.',
  description_es: 'Documento formal presentado al estado para crear una corporación.',
  aliases: ["form corporation", "incorporate business"],
  aliases_es: ["formar corporación", "incorporar negocio"],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 5,
  states: 'all',
  schema: z.object({}), // Placeholder
  questions: [] // Placeholder
};