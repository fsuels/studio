// src/lib/documents/us/aviation-charter-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const aviationCharterAgreementQuestions: FormQuestion[] = [
  {
    id: 'operatorName',
    type: 'text',
    label: 'Aircraft Operator Name',
    placeholder: 'Enter aircraft operator name',
    required: true,
    group: 'operator',
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
    id: 'aircraftType',
    type: 'text',
    label: 'Aircraft Type',
    placeholder: 'Enter aircraft type/model',
    required: false,
    group: 'aircraft',
  },
  {
    id: 'charterType',
    type: 'select',
    label: 'Charter Type',
    options: [
      { value: 'one-way', label: 'One Way' },
      { value: 'round-trip', label: 'Round Trip' },
      { value: 'multi-leg', label: 'Multi-leg' },
      { value: 'time-based', label: 'Time Based' },
    ],
    required: false,
    group: 'charter',
  },
  {
    id: 'departureAirport',
    type: 'text',
    label: 'Departure Airport',
    placeholder: 'Enter departure airport code',
    required: false,
    group: 'flight',
  },
  {
    id: 'destinationAirport',
    type: 'text',
    label: 'Destination Airport',
    placeholder: 'Enter destination airport code',
    required: false,
    group: 'flight',
  },
  {
    id: 'passengers',
    type: 'text',
    label: 'Number of Passengers',
    placeholder: 'Enter number of passengers',
    required: false,
    group: 'flight',
  },
];
