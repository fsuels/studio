// src/lib/documents/us/app-development-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AppDevelopmentAgreementSchema } from './schema';
import { appDevelopmentAgreementQuestions } from './questions';

export const appDevelopmentAgreementMeta: LegalDocument = {
  id: 'app-development-agreement',
  jurisdiction: 'US',
  category: 'Technology & IT',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/app-development-agreement.md',
    es: '/templates/es/app-development-agreement.md',
  },
  schema: AppDevelopmentAgreementSchema,
  questions: appDevelopmentAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'App Development Agreement',
      description:
        'Agreement for mobile and web application development services.',
      aliases: ['mobile app development', 'software development contract'],
    },
    es: {
      name: 'Acuerdo de Desarrollo de Aplicaciones',
      description:
        'Acuerdo para servicios de desarrollo de aplicaciones móviles y web.',
      aliases: [
        'desarrollo de app móvil',
        'contrato de desarrollo de software',
      ],
    },
  },
};
