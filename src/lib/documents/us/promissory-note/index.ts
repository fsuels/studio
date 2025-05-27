// src/lib/documents/us/promissory-note/index.ts
import path from 'path';
import { cwd } from 'process';
import * as schema from './schema';
import * as questions from './questions';
import { promissoryNoteMeta } from './metadata';

export const document = {
  id: 'promissory-note',
  country: 'us',
  languages: ['en', 'es'],
  templatePath: (lang: string) =>
    path.join(
      cwd(),
      'src',
      'lib',
      'documents',
      'us',
      'promissory-note',
      `template.${lang}.md`,
    ),
  schema,
  questions,
  marketing: promissoryNoteMeta,
} as const;

export { document as promissoryNote };
export * from './schema'; // Keep this if other parts of your app import schema directly from here
export * from './questions'; // Keep this if other parts of your app import questions directly from here
