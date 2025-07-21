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
      description:
        'Access specialized expertise without the cost of full-time employees. Define project scope and protect your interests with clear terms.',
      aliases: [
        'consultant contract',
        'advisory agreement',
        'professional services agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Consultoría',
      description:
        'Obten experiencia especializada sin contratar empleados de tiempo completo. Establece objetivos claros y protege la propiedad intelectual de tu empresa.',
      aliases: ['contrato de consultor', 'acuerdo de asesoría'],
    },
  },
};
