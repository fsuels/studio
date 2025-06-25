// src/lib/documents/us/bookkeeping-services-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BookkeepingServicesAgreementSchema } from './schema';
import { bookkeepingServicesAgreementQuestions } from './questions';

export const bookkeepingServicesAgreementMeta: LegalDocument = {
  id: 'bookkeeping-services-agreement',
  jurisdiction: 'US',
  category: 'Professional Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/bookkeeping-services-agreement.md',
    es: '/templates/es/bookkeeping-services-agreement.md',
  },
  schema: BookkeepingServicesAgreementSchema,
  questions: bookkeepingServicesAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Bookkeeping Services Agreement',
      description:
        'Professional agreement for bookkeeping and accounting services between service provider and client.',
      aliases: [
        'accounting services agreement',
        'financial services contract',
        'bookkeeper contract',
      ],
    },
    es: {
      name: 'Acuerdo de Servicios de Contabilidad',
      description:
        'Mantén tus finanzas organizadas y cumple con obligaciones fiscales. Obten servicios contables profesionales que impulsen el crecimiento de tu negocio.',
      aliases: [
        'contrato de servicios contables',
        'acuerdo de servicios financieros',
      ],
    },
  },
};
