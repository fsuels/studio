// src/lib/documents/us/copyright-assignment/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { copyrightAssignmentSchema } from './schema';
import { copyrightAssignmentQuestions } from './questions';

export const copyrightAssignmentMeta: LegalDocument = {
  id: 'copyright-assignment',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 18,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/copyright-assignment.md',
    es: '/templates/es/us/copyright-assignment.md',
  },
  schema: copyrightAssignmentSchema,
  questions: copyrightAssignmentQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Copyright Assignment Agreement',
      description:
        'Create a legally binding Copyright Assignment Agreement with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'copyright assignment contract',
        'copyright transfer',
        'intellectual property assignment',
      ],
    },
    es: {
      name: 'Acuerdo de Asignación de Derechos de Autor',
      description:
        'Crea un Acuerdo de Asignación de Derechos de Autor legalmente válido con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'contrato de asignación de derechos de autor',
        'transferencia de derechos de autor',
      ],
    },
  },
};
