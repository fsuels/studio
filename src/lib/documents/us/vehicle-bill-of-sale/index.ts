import path from 'path';
import { cwd } from 'process';
import { vehicleBillOfSaleMeta } from './metadata';
import { VehicleBillOfSaleCompliance } from './compliance';

export const vehicleBillOfSale = {
  ...vehicleBillOfSaleMeta,
  compliance: VehicleBillOfSaleCompliance,
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
};

export { vehicleBillOfSale as document };

export * from './schema';
export * from './questions';
export * from './compliance';
export * from './faqs';
