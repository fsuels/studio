// src/lib/documents/us/residential-rental-inspection-report/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ResidentialRentalInspectionReportSchema } from './schema';
import { residentialRentalInspectionReportQuestions } from './questions';

export const residentialRentalInspectionReportMeta: LegalDocument = {
  id: 'residential-rental-inspection-report',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/residential-rental-inspection-report.md',
    es: '/templates/es/residential-rental-inspection-report.md',
  },
  schema: ResidentialRentalInspectionReportSchema,
  questions: residentialRentalInspectionReportQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Residential Rental Inspection Report',
      description:
        'Document property condition for move-in and move-out inspections',
      aliases: [],
    },
    es: {
      name: 'Informe de inspección de alquiler residencial',
      description:
        'Documenta el estado de la propiedad durante las inspecciones de entrada y salida.',
      aliases: [],
    },
  },
};
