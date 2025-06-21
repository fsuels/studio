// src/lib/documents/us/solar-energy-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const solarEnergyAgreementQuestions: FormQuestion[] = [
  {
    id: 'ownerName',
    type: 'text',
    label: 'Property Owner Name',
    placeholder: 'Enter property owner name',
    required: true,
    group: 'owner',
  },
  {
    id: 'installerName',
    type: 'text',
    label: 'Solar Installer Name',
    placeholder: 'Enter solar installer company name',
    required: true,
    group: 'installer',
  },
  {
    id: 'propertyType',
    type: 'select',
    label: 'Property Type',
    options: [
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'industrial', label: 'Industrial' },
      { value: 'agricultural', label: 'Agricultural' },
    ],
    required: false,
    group: 'property',
  },
  {
    id: 'systemSize',
    type: 'text',
    label: 'System Size (kW)',
    placeholder: 'Enter system size in kilowatts',
    required: false,
    group: 'system',
  },
  {
    id: 'financingType',
    type: 'select',
    label: 'Financing Type',
    options: [
      { value: 'cash', label: 'Cash Purchase' },
      { value: 'loan', label: 'Solar Loan' },
      { value: 'lease', label: 'Solar Lease' },
      { value: 'ppa', label: 'Power Purchase Agreement' },
      { value: 'pace', label: 'PACE Financing' },
    ],
    required: false,
    group: 'financial',
  },
  {
    id: 'installationType',
    type: 'select',
    label: 'Installation Type',
    options: [
      { value: 'rooftop', label: 'Rooftop Installation' },
      { value: 'ground-mount', label: 'Ground Mount' },
      { value: 'carport', label: 'Carport/Canopy' },
      { value: 'tracker', label: 'Solar Tracker' },
    ],
    required: false,
    group: 'installation',
  },
];
