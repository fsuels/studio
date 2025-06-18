// src/lib/documents/us/volunteer-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { VolunteerAgreementSchema } from './schema';
import { volunteerAgreementQuestions } from './questions';

export const volunteerAgreementMeta: LegalDocument = {
  id: 'volunteer-agreement',
  jurisdiction: 'US',
  category: 'Employment & HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 7.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/volunteer-agreement.md',
    es: '/templates/es/volunteer-agreement.md',
  },
  schema: VolunteerAgreementSchema,
  questions: volunteerAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Volunteer Agreement',
      description: 'Agreement between organization and volunteer for volunteer services and activities.',
      aliases: ['volunteer contract', 'volunteer service agreement', 'community service agreement'],
    },
    es: {
      name: 'Acuerdo de Voluntariado',
      description: 'Acuerdo entre organización y voluntario para servicios y actividades de voluntariado.',
      aliases: ['contrato de voluntario', 'acuerdo de servicio voluntario'],
    },
  },
};