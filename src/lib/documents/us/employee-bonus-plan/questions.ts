import type { Question } from '@/types/documents';

export const questions: Question[] = [
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    required: true,
    category: 'Company Information',
  },
  {
    id: 'planName',
    type: 'text',
    label: 'Bonus Plan Name',
    required: true,
    category: 'Plan Details',
    placeholder: 'e.g., Annual Performance Bonus Plan',
  },
  {
    id: 'planYear',
    type: 'text',
    label: 'Plan Year',
    required: true,
    category: 'Plan Details',
    placeholder: 'e.g., 2024, Fiscal Year 2024',
  },
  {
    id: 'effectiveDate',
    type: 'date',
    label: 'Plan Effective Date',
    required: true,
    category: 'Plan Details',
  },
  {
    id: 'planObjective',
    type: 'textarea',
    label: 'Plan Objective',
    required: true,
    category: 'Plan Details',
    placeholder: 'Describe the purpose and goals of the bonus plan',
  },
  {
    id: 'eligibilityCriteria',
    type: 'textarea',
    label: 'Eligibility Criteria',
    required: true,
    category: 'Eligibility',
    placeholder: 'Who is eligible for the bonus plan?',
  },
  {
    id: 'employmentStatus',
    type: 'select',
    label: 'Employment Status Requirement',
    required: true,
    category: 'Eligibility',
    options: ['Full-time', 'Part-time', 'All employees'],
  },
  {
    id: 'bonusType',
    type: 'select',
    label: 'Bonus Type',
    required: true,
    category: 'Bonus Structure',
    options: [
      'Individual performance',
      'Team performance',
      'Company performance',
      'Combined',
    ],
  },
  {
    id: 'calculationMethod',
    type: 'textarea',
    label: 'Calculation Method',
    required: true,
    category: 'Bonus Structure',
    placeholder: 'How will bonuses be calculated?',
  },
  {
    id: 'performanceMetrics',
    type: 'textarea',
    label: 'Performance Metrics',
    required: true,
    category: 'Bonus Structure',
    placeholder: 'What metrics will be used to measure performance?',
  },
  {
    id: 'targetBonusPercentage',
    type: 'text',
    label: 'Target Bonus Percentage',
    required: true,
    category: 'Bonus Structure',
    placeholder: 'e.g., 10% of annual salary',
  },
  {
    id: 'maximumBonusPercentage',
    type: 'text',
    label: 'Maximum Bonus Percentage',
    required: true,
    category: 'Bonus Structure',
    placeholder: 'e.g., 20% of annual salary',
  },
  {
    id: 'performancePeriod',
    type: 'select',
    label: 'Performance Period',
    required: true,
    category: 'Performance Periods',
    options: ['Quarterly', 'Semi-annually', 'Annually'],
  },
  {
    id: 'evaluationSchedule',
    type: 'text',
    label: 'Evaluation Schedule',
    required: true,
    category: 'Performance Periods',
    placeholder: 'When will performance be evaluated?',
  },
  {
    id: 'paymentSchedule',
    type: 'text',
    label: 'Payment Schedule',
    required: true,
    category: 'Performance Periods',
    placeholder: 'When will bonuses be paid?',
  },
  {
    id: 'paymentTiming',
    type: 'text',
    label: 'Payment Timing',
    required: true,
    category: 'Payment Terms',
    placeholder: 'e.g., Within 60 days of performance period end',
  },
  {
    id: 'prorationPolicy',
    type: 'textarea',
    label: 'Proration Policy',
    required: true,
    category: 'Payment Terms',
    placeholder: 'How are bonuses prorated for partial periods?',
  },
  {
    id: 'taxImplications',
    type: 'textarea',
    label: 'Tax Implications',
    required: true,
    category: 'Payment Terms',
    placeholder: 'Describe tax treatment of bonus payments',
  },
  {
    id: 'planAdministrator',
    type: 'text',
    label: 'Plan Administrator',
    required: true,
    category: 'Plan Administration',
    placeholder: 'Who will administer the plan?',
  },
  {
    id: 'terminationImpact',
    type: 'textarea',
    label: 'Impact of Employment Termination',
    required: true,
    category: 'Termination Provisions',
    placeholder: 'How does termination affect bonus eligibility?',
  },
  {
    id: 'clawbackProvisions',
    type: 'radio',
    label: 'Include Clawback Provisions?',
    required: true,
    category: 'Termination Provisions',
    options: ['Yes', 'No'],
  },
  {
    id: 'governingState',
    type: 'select',
    label: 'Governing State',
    required: true,
    category: 'Legal Terms',
    options: [
      'Alabama',
      'Alaska',
      'Arizona',
      'Arkansas',
      'California',
      'Colorado',
      'Connecticut',
      'Delaware',
      'Florida',
      'Georgia',
      'Hawaii',
      'Idaho',
      'Illinois',
      'Indiana',
      'Iowa',
      'Kansas',
      'Kentucky',
      'Louisiana',
      'Maine',
      'Maryland',
      'Massachusetts',
      'Michigan',
      'Minnesota',
      'Mississippi',
      'Missouri',
      'Montana',
      'Nebraska',
      'Nevada',
      'New Hampshire',
      'New Jersey',
      'New Mexico',
      'New York',
      'North Carolina',
      'North Dakota',
      'Ohio',
      'Oklahoma',
      'Oregon',
      'Pennsylvania',
      'Rhode Island',
      'South Carolina',
      'South Dakota',
      'Tennessee',
      'Texas',
      'Utah',
      'Vermont',
      'Virginia',
      'Washington',
      'West Virginia',
      'Wisconsin',
      'Wyoming',
    ],
  },
  {
    id: 'signatureDate',
    type: 'date',
    label: 'Plan Approval Date',
    required: true,
    category: 'Signatures',
  },
];
