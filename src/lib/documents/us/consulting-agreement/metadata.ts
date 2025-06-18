// src/lib/documents/us/consulting-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ConsultingAgreementSchema } from './schema';
import { consultingAgreementQuestions } from './questions';

export const consultingAgreementMeta: LegalDocument = {
  id: 'consulting-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/consulting-agreement.md',
    es: '/templates/es/consulting-agreement.md',
  },
  schema: ConsultingAgreementSchema,
  questions: consultingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Consulting Agreement',
      description: 'Establish terms for professional consulting services with clear scope and compensation.',
      aliases: ['consultant contract', 'advisory agreement', 'professional services agreement'],
    },
    es: {
      name: 'Acuerdo de Consultoría',
      description: 'Establece términos para servicios de consultoría profesional con alcance y compensación claros.',
      aliases: ['contrato de consultor', 'acuerdo de asesoría'],
    },
  },
};