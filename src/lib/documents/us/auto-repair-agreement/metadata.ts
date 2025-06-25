// src/lib/documents/us/auto-repair-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AutoRepairAgreementSchema } from './schema';
import { autoRepairAgreementQuestions } from './questions';

export const autoRepairAgreementMeta: LegalDocument = {
  id: 'auto-repair-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/auto-repair-agreement.md',
    es: '/templates/es/auto-repair-agreement.md',
  },
  schema: AutoRepairAgreementSchema,
  questions: autoRepairAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Auto Repair Agreement',
      description:
        'Agreement between auto repair shop and customer for vehicle repair services.',
      aliases: [
        'vehicle repair agreement',
        'automotive service agreement',
        'car repair contract',
      ],
    },
    es: {
      name: 'Acuerdo de Reparación Automotriz',
      description:
        'Protege tu inversión en reparaciones automotrices y evita sobrecostos inesperados. Asegura garantías de trabajo y transparencia en precios.',
      aliases: [
        'acuerdo de reparación de vehículos',
        'contrato de servicio automotriz',
      ],
    },
  },
};
