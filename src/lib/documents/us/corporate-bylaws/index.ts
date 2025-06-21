import type { LegalDocument } from '@/types/documents';
import { corporateBylawsMeta } from './metadata';
import { corporateBylawsQuestions } from './questions';
import { corporateBylawsSchema } from './schema';

export const corporateBylaws: LegalDocument = {
  id: 'corporate-bylaws',
  ...corporateBylawsMeta,
  schema: corporateBylawsSchema,
  questions: corporateBylawsQuestions,
};
