// src/lib/documents/us/executive-employment-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const executiveEmploymentAgreementMeta: LegalDocument = {
  id: 'executive-employment-agreement',
  jurisdiction: 'US',
  category: 'Employment',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/executive-employment-agreement.md',
    es: '/templates/es/executive-employment-agreement.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Executive Employment Agreement',
      description:
        'Comprehensive employment contract for executive-level positions with enhanced terms, benefits, and protections.',
      aliases: [
        'executive contract',
        'C-level agreement',
        'senior management contract',
      ],
    },
    es: {
      name: 'Contrato de Empleo Ejecutivo',
      description:
        'Contrato de empleo integral para puestos ejecutivos con términos, beneficios y protecciones mejoradas.',
      aliases: [
        'contrato ejecutivo',
        'acuerdo de nivel C',
        'contrato de alta gerencia',
      ],
    },
  },
};
