// src/lib/documents/us/patent-assignment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PatentAssignmentSchema } from './schema';
import { patentAssignmentQuestions } from './questions';

export const patentAssignmentMeta: LegalDocument = {
  id: 'patent-assignment',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 25,
  states: 'all',
  templatePaths: {
    en: '/templates/en/patent-assignment.md',
    es: '/templates/es/patent-assignment.md',
  },
  schema: PatentAssignmentSchema,
  questions: patentAssignmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Patent Assignment Agreement',
      description:
        'Complete patent transactions safely by ensuring proper ownership transfer with full legal documentation.',
      aliases: [
        'patent transfer',
        'patent ownership transfer',
        'patent conveyance',
        'patent sale',
      ],
    },
    es: {
      name: 'Acuerdo de Asignación de Patente',
      description:
        'Documento legal para transferir la propiedad de una patente de una parte a otra.',
      aliases: [
        'transferencia de patente',
        'transferencia propiedad patente',
        'transmisión patente',
        'venta patente',
      ],
    },
  },
};
