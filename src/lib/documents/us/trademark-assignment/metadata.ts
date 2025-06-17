// src/lib/documents/us/trademark-assignment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { trademarkAssignmentSchema } from './schema';
import { trademarkAssignmentQuestions } from './questions';

export const trademarkAssignmentMeta: LegalDocument = {
  id: 'trademark-assignment',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/trademark-assignment.md',
    es: '/templates/es/us/trademark-assignment.md',
  },
  schema: trademarkAssignmentSchema,
  questions: trademarkAssignmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Trademark Assignment Agreement',
      description:
        'Create a legally binding Trademark Assignment Agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'trademark assignment contract',
        'trademark transfer',
        'brand assignment',
      ],
    },
    es: {
      name: 'Acuerdo de Asignación de Marca Registrada',
      description:
        'Crea un Acuerdo de Asignación de Marca Registrada legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato de asignación de marca',
        'transferencia de marca registrada',
        'asignación de marca',
      ],
    },
  },
};
