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
        'Viaja con comodidad y eficiencia mientras proteges tu inversión. Asegura servicios de aviación premium con términos claros y seguros adecuados.',
      aliases: [
        'contrato de vuelo charter',
        'acuerdo de jet privado',
        'contrato de la carta de vuelo',
      ],
    },
  },
};
