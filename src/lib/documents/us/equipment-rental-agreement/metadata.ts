// src/lib/documents/us/equipment-rental-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { EquipmentRentalAgreementSchema } from './schema';
import { equipmentRentalAgreementQuestions } from './questions';

export const equipmentRentalAgreementMeta: LegalDocument = {
  id: 'equipment-rental-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/equipment-rental-agreement.md',
    es: '/templates/es/equipment-rental-agreement.md',
  },
  schema: EquipmentRentalAgreementSchema,
  questions: equipmentRentalAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Equipment Rental Agreement',
      description:
        'Create a comprehensive equipment rental agreement for machinery, tools, or other equipment with clear terms and liability protections.',
      aliases: [
        'equipment lease',
        'machinery rental',
        'tool rental agreement',
        'equipment hire agreement'
      ],
    },
    es: {
      name: 'Acuerdo de Alquiler de Equipos',
      description:
        'Crea un acuerdo completo de alquiler de equipos para maquinaria, herramientas u otros equipos con términos claros y protecciones de responsabilidad.',
      aliases: [
        'arrendamiento de equipos',
        'alquiler de maquinaria',
        'acuerdo de alquiler de herramientas'
      ],
    },
  },
};