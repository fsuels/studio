// src/lib/documents/us/joint-venture-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { jointVentureAgreementSchema } from './schema';
import { jointVentureAgreementQuestions } from './questions';

export const jointVentureAgreementMeta: LegalDocument = {
  id: 'joint-venture-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 40,
  states: 'all',
  templatePaths: {
    en: '/templates/en/joint-venture-agreement.md',
    es: '/templates/es/joint-venture-agreement.md',
  },
  schema: jointVentureAgreementSchema,
  questions: jointVentureAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Joint Venture Agreement',
      description:
        'Agreement between parties to collaborate on a specific business project or venture.',
      aliases: [
        'business collaboration',
        'joint venture',
        'strategic partnership',
      ],
    },
    es: {
      name: 'Acuerdo de Empresa Conjunta',
      description:
        'Acuerdo entre partes para colaborar en un proyecto comercial o empresa específica.',
      aliases: [
        'colaboración empresarial',
        'empresa conjunta',
        'asociación estratégica',
      ],
    },
  },
};
