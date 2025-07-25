import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'testatorName',
    label: 'Your Full Legal Name (Testator)',
    type: 'text',
    required: true,
    placeholder:
      'Enter your full legal name as it appears on official documents',
  },
  {
    id: 'testatorAddress',
    label: 'Your Current Address',
    type: 'textarea',
    required: true,
    placeholder:
      'Enter your complete address including street, city, state, and ZIP code',
  },
  {
    id: 'trustName',
    label: 'Name of Your Existing Trust',
    type: 'text',
    required: true,
    placeholder: 'Enter the full legal name of your trust',
  },
  {
    id: 'trustDate',
    label: 'Date Trust Was Created',
    type: 'date',
    required: true,
  },
  {
    id: 'executor',
    label: 'Executor Full Name',
    type: 'text',
    required: true,
    placeholder:
      'Person who will execute this will and transfer assets to trust',
  },
  {
    id: 'executorAddress',
    label: 'Executor Address',
    type: 'textarea',
    required: true,
    placeholder: 'Complete address of the executor',
  },
  {
    id: 'backupExecutor',
    label: 'Backup Executor Full Name (Optional)',
    type: 'text',
    placeholder: 'Alternative executor if primary is unable to serve',
  },
  {
    id: 'backupExecutorAddress',
    label: 'Backup Executor Address (Optional)',
    type: 'textarea',
    placeholder: 'Complete address of the backup executor',
  },
  {
    id: 'guardianOfMinorChildren',
    label: 'Guardian for Minor Children (Optional)',
    type: 'text',
    placeholder: 'Person to serve as guardian of any minor children',
  },
  {
    id: 'guardianAddress',
    label: 'Guardian Address (Optional)',
    type: 'textarea',
    placeholder: 'Complete address of the guardian',
  },
  {
    id: 'specificBequests',
    label: 'Specific Bequests (Optional)',
    type: 'textarea',
    placeholder:
      'Any specific gifts not going to the trust (e.g., personal items, small monetary gifts)',
  },
  {
    id: 'residualClause',
    label: 'Residual Estate Instructions',
    type: 'textarea',
    required: true,
    placeholder: 'Instructions for transferring remaining assets to your trust',
  },
  {
    id: 'witnessOneName',
    label: 'First Witness Full Name',
    type: 'text',
    required: true,
    placeholder: 'Adult witness to will signing',
  },
  {
    id: 'witnessOneAddress',
    label: 'First Witness Address',
    type: 'textarea',
    required: true,
    placeholder: 'Complete address of first witness',
  },
  {
    id: 'witnessTwoName',
    label: 'Second Witness Full Name',
    type: 'text',
    required: true,
    placeholder: 'Second adult witness to will signing',
  },
  {
    id: 'witnessTwoAddress',
    label: 'Second Witness Address',
    type: 'textarea',
    required: true,
    placeholder: 'Complete address of second witness',
  },
  {
    id: 'executionDate',
    label: 'Will Execution Date',
    type: 'date',
    required: true,
  },
  {
    id: 'executionState',
    label: 'State Where Will is Executed',
    type: 'text',
    required: true,
    placeholder: 'State where you are signing this will',
  },
  {
    id: 'executionCounty',
    label: 'County Where Will is Executed',
    type: 'text',
    required: true,
    placeholder: 'County where you are signing this will',
  },
];
