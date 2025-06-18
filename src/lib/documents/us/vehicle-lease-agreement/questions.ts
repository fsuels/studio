// src/lib/documents/us/vehicle-lease-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const vehicleLeaseAgreementQuestions: FormQuestion[] = [
  {
    id: 'lessorName',
    type: 'text',
    label: 'Lessor Name',
    placeholder: 'Enter lessor name',
    required: true,
    group: 'lessor',
  },
  {
    id: 'lesseeName',
    type: 'text',
    label: 'Lessee Name',
    placeholder: 'Enter lessee name',
    required: true,
    group: 'lessee',
  },
  {
    id: 'vehicleYear',
    type: 'text',
    label: 'Vehicle Year',
    placeholder: 'e.g., 2023',
    required: true,
    group: 'vehicle',
  },
  {
    id: 'vehicleMake',
    type: 'text',
    label: 'Vehicle Make',
    placeholder: 'e.g., Honda',
    required: true,
    group: 'vehicle',
  },
  {
    id: 'vehicleModel',
    type: 'text',
    label: 'Vehicle Model',
    placeholder: 'e.g., Accord',
    required: true,
    group: 'vehicle',
  },
  {
    id: 'monthlyPayment',
    type: 'text',
    label: 'Monthly Payment',
    placeholder: 'Enter monthly lease payment',
    required: true,
    group: 'payment',
  },
  {
    id: 'leaseStartDate',
    type: 'text',
    label: 'Lease Start Date',
    placeholder: 'Enter lease start date',
    required: true,
    group: 'terms',
  },
  {
    id: 'leaseEndDate',
    type: 'text',
    label: 'Lease End Date',
    placeholder: 'Enter lease end date',
    required: true,
    group: 'terms',
  },
];