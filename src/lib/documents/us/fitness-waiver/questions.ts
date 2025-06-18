// src/lib/documents/us/fitness-waiver/questions.ts
import type { FormQuestion } from '@/types/documents';

export const fitnessWaiverQuestions: FormQuestion[] = [
  {
    id: 'participantName',
    type: 'text',
    label: 'Participant Name',
    placeholder: 'Enter participant full name',
    required: true,
    group: 'participant',
  },
  {
    id: 'facilityName',
    type: 'text',
    label: 'Fitness Facility Name',
    placeholder: 'Enter gym or facility name',
    required: true,
    group: 'facility',
  },
  {
    id: 'isMinor',
    type: 'checkbox',
    label: 'Participant is under 18 years old',
    required: false,
    group: 'participant',
  },
  {
    id: 'activityType',
    type: 'multiselect',
    label: 'Activities',
    options: [
      { value: 'weight-training', label: 'Weight Training' },
      { value: 'cardio', label: 'Cardiovascular Exercise' },
      { value: 'group-classes', label: 'Group Fitness Classes' },
      { value: 'personal-training', label: 'Personal Training' },
      { value: 'swimming', label: 'Swimming' },
      { value: 'rock-climbing', label: 'Rock Climbing' },
    ],
    required: false,
    group: 'activities',
  },
  {
    id: 'emergencyContactName',
    type: 'text',
    label: 'Emergency Contact Name',
    placeholder: 'Enter emergency contact name',
    required: false,
    group: 'emergency',
  },
  {
    id: 'emergencyContactPhone',
    type: 'text',
    label: 'Emergency Contact Phone',
    placeholder: 'Enter emergency contact phone',
    required: false,
    group: 'emergency',
  },
];