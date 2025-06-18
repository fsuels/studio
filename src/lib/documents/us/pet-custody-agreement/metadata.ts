// src/lib/documents/us/pet-custody-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PetCustodyAgreementSchema } from './schema';
import { petCustodyAgreementQuestions } from './questions';

export const petCustodyAgreementMeta: LegalDocument = {
  id: 'pet-custody-agreement',
  jurisdiction: 'US',
  category: 'Family',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/pet-custody-agreement.md',
    es: '/templates/es/pet-custody-agreement.md',
  },
  schema: PetCustodyAgreementSchema,
  questions: petCustodyAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Pet Custody Agreement',
      description: 'Agreement establishing custody, care, and financial responsibilities for pets.',
      aliases: ['pet custody contract', 'animal custody agreement', 'pet sharing agreement'],
    },
    es: {
      name: 'Acuerdo de Custodia de Mascotas',
      description: 'Acuerdo que establece custodia, cuidado y responsabilidades financieras para mascotas.',
      aliases: ['contrato de custodia de mascotas', 'acuerdo de cuidado animal'],
    },
  },
};