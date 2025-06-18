// src/lib/documents/us/crop-sharing-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const cropSharingAgreementQuestions: FormQuestion[] = [
  {
    id: 'landownerName',
    type: 'text',
    label: 'Landowner Name',
    placeholder: 'Enter landowner name',
    required: true,
    group: 'landowner',
  },
  {
    id: 'tenantName',
    type: 'text',
    label: 'Tenant/Farmer Name',
    placeholder: 'Enter tenant name',
    required: true,
    group: 'tenant',
  },
  {
    id: 'totalAcreage',
    type: 'text',
    label: 'Total Acreage',
    placeholder: 'Enter total acres',
    required: false,
    group: 'property',
  },
  {
    id: 'cropsToGrow',
    type: 'text',
    label: 'Crops to Grow',
    placeholder: 'Enter crops to be grown',
    required: false,
    group: 'crops',
  },
  {
    id: 'sharePercentageLandowner',
    type: 'text',
    label: 'Landowner Share (%)',
    placeholder: 'Enter landowner share percentage',
    required: false,
    group: 'sharing',
  },
  {
    id: 'sharePercentageTenant',
    type: 'text',
    label: 'Tenant Share (%)',
    placeholder: 'Enter tenant share percentage',
    required: false,
    group: 'sharing',
  },
  {
    id: 'sharingBasis',
    type: 'select',
    label: 'Sharing Basis',
    options: [
      { value: 'gross-crop', label: 'Gross Crop' },
      { value: 'net-proceeds', label: 'Net Proceeds' },
      { value: 'fixed-bushels', label: 'Fixed Bushels' },
      { value: 'fixed-cash', label: 'Fixed Cash' },
    ],
    required: false,
    group: 'sharing',
  },
];