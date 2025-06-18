// src/lib/documents/us/athletic-scholarship-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AthleticScholarshipAgreementSchema } from './schema';
import { athleticScholarshipAgreementQuestions } from './questions';

export const athleticScholarshipAgreementMeta: LegalDocument = {
  id: 'athletic-scholarship-agreement',
  jurisdiction: 'US',
  category: 'Academic & Research',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/athletic-scholarship-agreement.md',
    es: '/templates/es/athletic-scholarship-agreement.md',
  },
  schema: AthleticScholarshipAgreementSchema,
  questions: athleticScholarshipAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Athletic Scholarship Agreement',
      description: 'Agreement for athletic scholarships and student-athlete commitments.',
      aliases: ['sports scholarship contract', 'student athlete agreement', 'athletic aid agreement'],
    },
    es: {
      name: 'Acuerdo de Beca Atlética',
      description: 'Acuerdo para becas atléticas y compromisos de estudiante-atleta.',
      aliases: ['contrato de beca deportiva', 'acuerdo de atleta estudiantil'],
    },
  },
};