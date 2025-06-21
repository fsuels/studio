// src/lib/documents/us/service-level-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ServiceLevelAgreementSchema } from './schema';
import { serviceLevelAgreementQuestions } from './questions';

export const serviceLevelAgreementMeta: LegalDocument = {
  id: 'service-level-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 13.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/service-level-agreement.md',
    es: '/templates/es/service-level-agreement.md',
  },
  schema: ServiceLevelAgreementSchema,
  questions: serviceLevelAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Service Level Agreement (SLA)',
      description:
        'Create an SLA defining service performance standards and expectations between parties.',
      aliases: ['SLA', 'service level agreement', 'performance agreement'],
    },
    es: {
      name: 'Acuerdo de Nivel de Servicio (SLA)',
      description:
        'Crea un SLA que defina estándares de rendimiento del servicio y expectativas entre partes.',
      aliases: [
        'SLA',
        'acuerdo de nivel de servicio',
        'acuerdo de rendimiento',
      ],
    },
  },
};
