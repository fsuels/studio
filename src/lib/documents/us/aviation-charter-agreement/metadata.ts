// src/lib/documents/us/aviation-charter-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AviationCharterAgreementSchema } from './schema';
import { aviationCharterAgreementQuestions } from './questions';

export const aviationCharterAgreementMeta: LegalDocument = {
  id: 'aviation-charter-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 34.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/aviation-charter-agreement.md',
    es: '/templates/es/aviation-charter-agreement.md',
  },
  schema: AviationCharterAgreementSchema,
  questions: aviationCharterAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Aviation Charter Agreement',
      description:
        'Agreement for chartering aircraft for transportation and aviation services.',
      aliases: [
        'aircraft charter agreement',
        'private jet charter',
        'flight charter contract',
      ],
    },
    es: {
      name: 'Acuerdo de Flete Aéreo',
      description:
        'Renta aviones privados o jets para viajes de negocios o personales. Define costos, rutas, responsabilidades y seguros de vuelo.',
      aliases: ['contrato de vuelo charter', 'acuerdo de jet privado'],
    },
  },
};
