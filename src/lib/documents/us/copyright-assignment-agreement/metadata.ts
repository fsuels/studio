// src/lib/documents/us/copyright-assignment-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CopyrightAssignmentAgreementSchema } from './schema';
import { copyrightAssignmentAgreementQuestions } from './questions';

export const copyrightAssignmentAgreementMeta: LegalDocument = {
  id: 'copyright-assignment-agreement',
  jurisdiction: 'US',
  category: 'Intellectual Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 22.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/copyright-assignment-agreement.md',
    es: '/templates/es/copyright-assignment-agreement.md',
  },
  schema: CopyrightAssignmentAgreementSchema,
  questions: copyrightAssignmentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Copyright Assignment Agreement',
      description: 'Comprehensive agreement for transferring copyright ownership of creative works.',
      aliases: ['copyright transfer', 'copyright conveyance', 'intellectual property assignment'],
    },
    es: {
      name: 'Acuerdo de Cesión de Derechos de Autor',
      description: 'Acuerdo integral para transferir la propiedad de derechos de autor de obras creativas.',
      aliases: ['transferencia de derechos de autor', 'cesión de propiedad intelectual'],
    },
  },
};