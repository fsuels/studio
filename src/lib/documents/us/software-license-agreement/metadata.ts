// src/lib/documents/us/software-license-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SoftwareLicenseAgreementSchema } from './schema';
import { softwareLicenseAgreementQuestions } from './questions';

export const softwareLicenseAgreementMeta: LegalDocument = {
  id: 'software-license-agreement',
  jurisdiction: 'US',
  category: 'Technology & IT',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/software-license-agreement.md',
    es: '/templates/es/software-license-agreement.md',
  },
  schema: SoftwareLicenseAgreementSchema,
  questions: softwareLicenseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Software License Agreement',
      description:
        'Generate revenue from your software while protecting intellectual property. Control usage and prevent unauthorized distribution.',
      aliases: [
        'software licensing agreement',
        'end user license agreement',
        'EULA',
      ],
    },
    es: {
      name: 'Acuerdo de Licencia de Software',
      description:
        'Licencia tu software a usuarios mientras proteges tus derechos de propiedad intelectual. Establece términos de uso y restricciones.',
      aliases: [
        'acuerdo de licenciamiento de software',
        'EULA',
        'eula legal',
      ],
    },
  },
};
