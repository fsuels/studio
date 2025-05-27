import * as schema from './schema';
import * as questions from './questions';
import * as compliance from './compliance';
import { marketing } from './metadata';

export const document = {
  id: 'bill-of-sale-vehicle',
  country: 'us',
  languages: ['en', 'es'],
  templatePath: (lang: string) =>
    require.resolve(`./template.${lang}.md`),
  schema,
  questions,
  marketing,
  compliance,
} as const;
