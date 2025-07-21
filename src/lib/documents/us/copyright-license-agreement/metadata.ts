// src/lib/documents/us/copyright-license-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { CopyrightlicenseagreementSchema } from './schema';
import { copyrightlicenseagreementQuestions } from './questions';

export const copyrightlicenseagreementMeta: LegalDocument = {
  id: 'copyright-license-agreement',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 15,
  states: 'all',
  templatePaths: {
    en: '/templates/en/copyright-license-agreement.md',
    es: '/templates/es/copyright-license-agreement.md',
  },
  schema: CopyrightlicenseagreementSchema,
  questions: copyrightlicenseagreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Copyright License Agreement',
      description: 'Professional copyright license agreement document.',
      aliases: ['copyright license agreement'],
    },
    es: {
      name: 'Acuerdo de Licencia de Derechos de Autor',
      description: 'Permite que otros usen tu contenido creativo (música, arte, escritos) bajo condiciones específicas que tú estableces.',
      aliases: ['copyright license agreement'],
    },
  },
};
