// src/lib/documents/us/personal-training-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const personalTrainingAgreementQuestions: FormQuestion[] = [
  {
    id: 'trainerName',
    type: 'text',
    label: 'Personal Trainer Name',
    placeholder: 'Enter trainer name',
    required: true,
    group: 'trainer',
  },
  {
    id: 'clientName',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client name',
    required: true,
    group: 'client',
  },
  {
    id: 'trainingGoals',
    type: 'textarea',
    label: 'Training Goals',
    placeholder: 'Describe fitness goals and objectives',
    required: true,
    group: 'training',
  },
  {
    id: 'fitnessLevel',
    type: 'select',
    label: 'Current Fitness Level',
    options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    required: true,
    group: 'training',
  },
  {
    id: 'packageType',
    type: 'select',
    label: 'Training Package',
    options: [
      { value: 'single-session', label: 'Single Session' },
      { value: 'package', label: 'Session Package' },
      { value: 'monthly', label: 'Monthly Membership' },
      { value: 'ongoing', label: 'Ongoing Training' },
    ],
    required: true,
    group: 'package',
  },
  {
    id: 'trainingLocation',
    type: 'select',
    label: 'Training Location',
    options: [
      { value: 'gym', label: 'Gym/Fitness Center' },
      { value: 'home', label: 'Client Home' },
      { value: 'outdoor', label: 'Outdoor' },
      { value: 'online', label: 'Online/Virtual' },
    ],
    required: true,
    group: 'location',
  },
];