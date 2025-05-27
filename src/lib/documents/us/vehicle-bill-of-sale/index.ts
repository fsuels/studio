import path from 'path';
import { cwd } from 'process';

export const document = {
  id: 'bill-of-sale-vehicle',
  category: 'sales',
  languages: ['en', 'es'],
  templatePath: (lang: string) =>
    path.join(
      cwd(),
      'src',
      'lib',
      'documents',
      'us',
      'vehicle-bill-of-sale',
      `template.${lang}.md`,
    ),
  // re-export existing pieces
  ...require('./schema'),
  ...require('./questions'),
  ...require('./metadata'),
  compliance: require('./compliance').VehicleBillOfSaleCompliance ?? {},
} as const;
export * from './schema';
export * from './questions';
export * from './metadata';
export * from './compliance';
