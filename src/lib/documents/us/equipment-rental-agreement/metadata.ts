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
        'Access expensive equipment without the huge investment of buying. Protect your rental business with damage deposits and liability terms.',
      aliases: [
        'equipment lease',
        'machinery rental',
        'tool rental agreement',
        'equipment hire agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Alquiler de Equipos',
      description:
        'Renta herramientas o maquinaria pesada de manera segura. Define costos, depósitos, responsabilidades y qué pasa si se daña el equipo.',
      aliases: [
        'arrendamiento de equipos',
        'alquiler de maquinaria',
        'acuerdo de alquiler de herramientas',
      ],
    },
  },
};
