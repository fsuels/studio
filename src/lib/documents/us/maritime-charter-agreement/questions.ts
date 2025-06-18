// src/lib/documents/us/maritime-charter-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const maritimeCharterAgreementQuestions: FormQuestion[] = [
  {
    id: 'ownerName',
    type: 'text',
    label: 'Vessel Owner Name',
    placeholder: 'Enter vessel owner name',
    required: true,
    group: 'owner',
  },
  {
    id: 'chartererName',
    type: 'text',
    label: 'Charterer Name',
    placeholder: 'Enter charterer name',
    required: true,
    group: 'charterer',
  },
  {
    id: 'vesselName',
    type: 'text',
    label: 'Vessel Name',
    placeholder: 'Enter vessel name',
    required: false,
    group: 'vessel',
  },
  {
    id: 'vesselType',
    type: 'select',
    label: 'Vessel Type',
    options: [
      { value: 'cargo', label: 'Cargo Ship' },
      { value: 'tanker', label: 'Tanker' },
      { value: 'container', label: 'Container Ship' },
      { value: 'bulk-carrier', label: 'Bulk Carrier' },
      { value: 'yacht', label: 'Yacht' },
      { value: 'fishing', label: 'Fishing Vessel' },
      { value: 'passenger', label: 'Passenger Ship' },
    ],
    required: false,
    group: 'vessel',
  },
  {
    id: 'charterType',
    type: 'select',
    label: 'Charter Type',
    options: [
      { value: 'bareboat', label: 'Bareboat Charter' },
      { value: 'time-charter', label: 'Time Charter' },
      { value: 'voyage-charter', label: 'Voyage Charter' },
      { value: 'demise-charter', label: 'Demise Charter' },
    ],
    required: false,
    group: 'charter',
  },
  {
    id: 'charterRate',
    type: 'text',
    label: 'Charter Rate',
    placeholder: 'Enter charter rate',
    required: false,
    group: 'financial',
  },
];