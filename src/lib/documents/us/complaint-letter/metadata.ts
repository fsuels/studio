// src/lib/documents/us/complaint-letter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ComplaintLetterSchema } from './schema';
import { complaintLetterQuestions } from './questions';

export const complaintLetterMeta: LegalDocument = {
  id: 'complaint-letter',
  jurisdiction: 'US',
  category: 'Personal & Lifestyle',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/complaint-letter.md',
    es: '/templates/es/complaint-letter.md',
  },
  schema: ComplaintLetterSchema,
  questions: complaintLetterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Complaint Letter',
      description:
        'Formal letter to address grievances with businesses or services.',
      aliases: ['grievance letter', 'formal complaint', 'dispute letter'],
    },
    es: {
      name: 'Carta de Queja',
      description: 'Quéjate formalmente con empresas por mal servicio o productos defectuosos. Aumenta posibilidades de reembolso o compensación.',
      aliases: ['carta de reclamo', 'queja formal', 'carta de disputa'],
    },
  },
};
