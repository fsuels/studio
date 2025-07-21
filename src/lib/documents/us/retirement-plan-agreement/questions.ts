// src/lib/documents/us/retirement-plan-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const retirementPlanAgreementQuestions: FormQuestion[] = [
  {
    id: 'employeeName',
    type: 'text',
    label: 'Employee Name',
    placeholder: 'Enter employee full name',
    required: true,
    group: 'employee',
  },
  {
    id: 'employerName',
    type: 'text',
    label: 'Employer Name',
    placeholder: 'Enter employer name',
    required: true,
    group: 'employer',
  },
  {
    id: 'planType',
    type: 'select',
    label: 'Plan Type',
    options: [
      { value: '401k', label: '401(k)' },
      { value: '403b', label: '403(b)' },
      { value: '457', label: '457' },
      { value: 'pension', label: 'Pension Plan' },
      { value: 'profit-sharing', label: 'Profit Sharing' },
      { value: 'sep-ira', label: 'SEP-IRA' },
      { value: 'simple-ira', label: 'SIMPLE IRA' },
    ],
    required: false,
    group: 'plan',
  },
  {
    id: 'employeeContributionPercent',
    type: 'text',
    label: 'Employee Contribution %',
    placeholder: 'Enter contribution percentage',
    required: false,
    group: 'contributions',
  },
  {
    id: 'employerMatchPercent',
    type: 'text',
    label: 'Employer Match %',
    placeholder: 'Enter employer match percentage',
    required: false,
    group: 'contributions',
  },
  {
    id: 'primaryBeneficiary',
    type: 'text',
    label: 'Primary Beneficiary',
    placeholder: 'Enter primary beneficiary name',
    required: false,
    group: 'beneficiary',
  },
];
