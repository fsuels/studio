// src/lib/documents/us/performance-bond/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PerformanceBondSchema } from './schema';
import { performanceBondQuestions } from './questions';

export const performanceBondMeta: LegalDocument = {
  id: 'performance-bond',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/performance-bond.md',
    es: '/templates/es/performance-bond.md',
  },
  schema: PerformanceBondSchema,
  questions: performanceBondQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Performance Bond',
      description:
        'Legal bond guaranteeing completion of contractual obligations and performance standards.',
      aliases: [
        'contract performance bond',
        'completion bond',
        'surety bond',
      ],
    },
    es: {
      name: 'Fianza de Cumplimiento',
      description:
        'Fianza legal que garantiza el cumplimiento de obligaciones contractuales y estándares de rendimiento.',
      aliases: [
        'fianza de rendimiento de contrato',
        'bono de cumplimiento',
        'bono de fianza',
      ],
    },
  },
};
