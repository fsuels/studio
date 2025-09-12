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
        "Protect your creative work and control how it's used. Transfer copyright ownership while retaining specific rights that benefit you.",
      aliases: [
        'copyright assignment contract',
        'copyright transfer',
        'intellectual property assignment',
      ],
    },
    es: {
      name: 'Acuerdo de Asignación de Derechos de Autor',
      description:
        'Transfiere ownership de contenido creativo (arte, música, escritos, software) a otra persona o empresa. Especifica qué derechos se transfieren.',
      aliases: [
        'contrato de asignación de derechos de autor',
        'transferencia de derechos de autor',
      ],
    },
  },
};
