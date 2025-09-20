// src/lib/documents/us/automotive-service-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AutomotiveServiceAgreementSchema } from './schema';
import { automotiveServiceAgreementQuestions } from './questions';

export const automotiveServiceAgreementMeta: LegalDocument = {
  id: 'automotive-service-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/automotive-service-agreement.md',
    es: '/templates/es/automotive-service-agreement.md',
  },
  schema: AutomotiveServiceAgreementSchema,
  questions: automotiveServiceAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Automotive Service Agreement',
      description: 'Agreement for automotive repair and maintenance services.',
      aliases: [
        'car repair agreement',
        'vehicle service contract',
        'auto maintenance agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Servicio Automotriz',
      description:
        'Extiende la vida útil de tu vehículo y evita reparaciones costosas. Asegura mantenimiento regular con precios fijos y garantías de servicio.',
      aliases: [
        'acuerdo de reparación de autos',
        'contrato de servicio vehicular',
        'acuerdo de mantenimiento automotriz',
      ],
    },
  },
};
