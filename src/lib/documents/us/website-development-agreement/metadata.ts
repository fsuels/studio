// src/lib/documents/us/website-development-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { WebsiteDevelopmentAgreementSchema } from './schema';
import { websiteDevelopmentAgreementQuestions } from './questions';

export const websiteDevelopmentAgreementMeta: LegalDocument = {
  id: 'website-development-agreement',
  jurisdiction: 'US',
  category: 'Professional Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/website-development-agreement.md',
    es: '/templates/es/website-development-agreement.md',
  },
  schema: WebsiteDevelopmentAgreementSchema,
  questions: websiteDevelopmentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Website Development Agreement',
      description:
        'Comprehensive agreement for website design and development services between developer and client.',
      aliases: [
        'web development contract',
        'website design agreement',
        'web services contract',
      ],
    },
    es: {
      name: 'Acuerdo de Desarrollo de Sitio Web',
      description:
        'Acuerdo integral para servicios de diseño y desarrollo de sitios web entre desarrollador y cliente.',
      aliases: ['contrato de desarrollo web', 'acuerdo de diseño web'],
    },
  },
};
