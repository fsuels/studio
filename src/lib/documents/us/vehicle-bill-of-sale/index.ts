import path from 'path';
import { vehicleBillOfSaleMeta } from './metadata';
import { VehicleBillOfSaleCompliance } from './compliance';

export const vehicleBillOfSale = {
  ...vehicleBillOfSaleMeta,
  compliance: VehicleBillOfSaleCompliance,
  templatePath: (lang: string) =>
    path.join(__dirname, `template.${lang}.md`),
};

export { vehicleBillOfSale as document };

export * from './schema';
export * from './questions';
export * from './compliance';
