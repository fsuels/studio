// src/lib/documents/us/personal-care-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const personalCareAgreementQuestions: FormQuestion[] = [
  {
    id: 'recipientName',
    type: 'text',
    label: 'Care Recipient Name',
    placeholder: 'Enter name of person receiving care',
    required: true,
    group: 'recipient',
  },
  {
    id: 'recipientAddress',
    type: 'text',
    label: 'Care Recipient Address',
    placeholder: 'Enter complete address where care will be provided',
    required: true,
    group: 'recipient',
  },
  {
    id: 'recipientPhone',
    type: 'text',
    label: 'Care Recipient Phone',
    placeholder: 'Enter phone number',
    required: false,
    group: 'recipient',
  },
  {
    id: 'recipientAge',
    type: 'text',
    label: 'Care Recipient Age',
    placeholder: 'Enter age',
    required: false,
    group: 'recipient',
  },
  {
    id: 'recipientEmergencyContact',
    type: 'text',
    label: 'Emergency Contact Information',
    placeholder: 'Emergency contact name and phone',
    required: false,
    group: 'recipient',
  },
  {
    id: 'caregiverName',
    type: 'text',
    label: 'Caregiver Name',
    placeholder: 'Enter caregiver full name',
    required: true,
    group: 'caregiver',
  },
  {
    id: 'caregiverAddress',
    type: 'text',
    label: 'Caregiver Address',
    placeholder: 'Enter caregiver address',
    required: true,
    group: 'caregiver',
  },
  {
    id: 'caregiverPhone',
    type: 'text',
    label: 'Caregiver Phone',
    placeholder: 'Enter caregiver phone number',
    required: true,
    group: 'caregiver',
  },
  {
    id: 'caregiverQualifications',
    type: 'textarea',
    label: 'Caregiver Qualifications',
    placeholder: 'Describe relevant experience, certifications, training',
    required: false,
    group: 'caregiver',
  },
  {
    id: 'agreementDate',
    type: 'date',
    label: 'Agreement Date',
    required: true,
    group: 'agreement-details',
  },
  {
    id: 'effectiveDate',
    type: 'date',
    label: 'Effective Date',
    required: true,
    group: 'agreement-details',
  },
  {
    id: 'personalCareServices',
    type: 'checkbox',
    label: 'Personal care services (bathing, dressing, etc.)',
    required: false,
    group: 'services',
  },
  {
    id: 'companionshipServices',
    type: 'checkbox',
    label: 'Companionship services',
    required: false,
    group: 'services',
  },
  {
    id: 'housekeepingServices',
    type: 'checkbox',
    label: 'Housekeeping services',
    required: false,
    group: 'services',
  },
  {
    id: 'mealPreparation',
    type: 'checkbox',
    label: 'Meal preparation',
    required: false,
    group: 'services',
  },
  {
    id: 'medicationAssistance',
    type: 'checkbox',
    label: 'Medication assistance',
    required: false,
    group: 'services',
  },
  {
    id: 'transportationServices',
    type: 'checkbox',
    label: 'Transportation services',
    required: false,
    group: 'services',
  },
  {
    id: 'bathingAssistance',
    type: 'checkbox',
    label: 'Bathing assistance',
    required: false,
    group: 'personal-care',
  },
  {
    id: 'dressingAssistance',
    type: 'checkbox',
    label: 'Dressing assistance',
    required: false,
    group: 'personal-care',
  },
  {
    id: 'mobilityAssistance',
    type: 'checkbox',
    label: 'Mobility assistance',
    required: false,
    group: 'personal-care',
  },
  {
    id: 'toiletingAssistance',
    type: 'checkbox',
    label: 'Toileting assistance',
    required: false,
    group: 'personal-care',
  },
  {
    id: 'groomingAssistance',
    type: 'checkbox',
    label: 'Grooming assistance',
    required: false,
    group: 'personal-care',
  },
  {
    id: 'exerciseAssistance',
    type: 'checkbox',
    label: 'Exercise assistance',
    required: false,
    group: 'personal-care',
  },
  {
    id: 'lightHousekeeping',
    type: 'checkbox',
    label: 'Light housekeeping',
    required: false,
    group: 'household',
  },
  {
    id: 'laundryServices',
    type: 'checkbox',
    label: 'Laundry services',
    required: false,
    group: 'household',
  },
  {
    id: 'shoppingServices',
    type: 'checkbox',
    label: 'Shopping services',
    required: false,
    group: 'household',
  },
  {
    id: 'petCare',
    type: 'checkbox',
    label: 'Pet care',
    required: false,
    group: 'household',
  },
  {
    id: 'medicationReminders',
    type: 'checkbox',
    label: 'Medication reminders',
    required: false,
    group: 'medical',
  },
  {
    id: 'medicationAdministration',
    type: 'checkbox',
    label: 'Medication administration',
    required: false,
    group: 'medical',
  },
  {
    id: 'vitalSigns',
    type: 'checkbox',
    label: 'Vital signs monitoring',
    required: false,
    group: 'medical',
  },
  {
    id: 'appointmentReminders',
    type: 'checkbox',
    label: 'Medical appointment reminders',
    required: false,
    group: 'medical',
  },
  {
    id: 'medicalTransportation',
    type: 'checkbox',
    label: 'Transportation to medical appointments',
    required: false,
    group: 'medical',
  },
  {
    id: 'scheduleType',
    type: 'select',
    label: 'Care Schedule Type',
    options: [
      { value: 'live-in', label: 'Live-in Care' },
      { value: 'hourly', label: 'Hourly Care' },
      { value: 'daily', label: 'Daily Care' },
      { value: 'weekly', label: 'Weekly Care' },
      { value: 'as-needed', label: 'As-needed Care' },
    ],
    required: true,
    group: 'schedule',
  },
  {
    id: 'hoursPerWeek',
    type: 'text',
    label: 'Hours Per Week',
    placeholder: 'e.g., 40 hours',
    required: false,
    group: 'schedule',
  },
  {
    id: 'specificSchedule',
    type: 'textarea',
    label: 'Specific Schedule',
    placeholder: 'Describe specific days and times',
    required: false,
    group: 'schedule',
  },
  {
    id: 'overnightCare',
    type: 'checkbox',
    label: 'Overnight care required',
    required: false,
    group: 'schedule',
  },
  {
    id: 'weekendCare',
    type: 'checkbox',
    label: 'Weekend care required',
    required: false,
    group: 'schedule',
  },
  {
    id: 'holidayCare',
    type: 'checkbox',
    label: 'Holiday care required',
    required: false,
    group: 'schedule',
  },
  {
    id: 'compensationType',
    type: 'select',
    label: 'Compensation Type',
    options: [
      { value: 'hourly-wage', label: 'Hourly Wage' },
      { value: 'daily-rate', label: 'Daily Rate' },
      { value: 'weekly-salary', label: 'Weekly Salary' },
      { value: 'monthly-salary', label: 'Monthly Salary' },
      { value: 'live-in-rate', label: 'Live-in Rate' },
    ],
    required: true,
    group: 'compensation',
  },
  {
    id: 'compensationAmount',
    type: 'text',
    label: 'Compensation Amount',
    placeholder: 'Enter amount per hour/day/week/month',
    required: true,
    group: 'compensation',
  },
  {
    id: 'paymentFrequency',
    type: 'select',
    label: 'Payment Frequency',
    options: [
      { value: 'weekly', label: 'Weekly' },
      { value: 'bi-weekly', label: 'Bi-weekly' },
      { value: 'monthly', label: 'Monthly' },
    ],
    required: true,
    group: 'compensation',
  },
  {
    id: 'overtimeRate',
    type: 'text',
    label: 'Overtime Rate',
    placeholder: 'Rate for hours over 40 per week',
    required: false,
    group: 'compensation',
  },
  {
    id: 'mealProvision',
    type: 'checkbox',
    label: 'Meals provided',
    required: false,
    group: 'benefits',
  },
  {
    id: 'transportationAllowance',
    type: 'checkbox',
    label: 'Transportation allowance',
    required: false,
    group: 'benefits',
  },
  {
    id: 'healthInsurance',
    type: 'checkbox',
    label: 'Health insurance provided',
    required: false,
    group: 'benefits',
  },
  {
    id: 'paidTimeOff',
    type: 'checkbox',
    label: 'Paid time off',
    required: false,
    group: 'benefits',
  },
  {
    id: 'sickLeave',
    type: 'checkbox',
    label: 'Sick leave',
    required: false,
    group: 'benefits',
  },
  {
    id: 'liveInArrangement',
    type: 'checkbox',
    label: 'Live-in care arrangement',
    required: false,
    group: 'living-arrangements',
  },
  {
    id: 'privateRoom',
    type: 'checkbox',
    label: 'Private room provided',
    required: false,
    group: 'living-arrangements',
    dependsOn: 'liveInArrangement',
  },
  {
    id: 'privateBathroom',
    type: 'checkbox',
    label: 'Private bathroom provided',
    required: false,
    group: 'living-arrangements',
    dependsOn: 'liveInArrangement',
  },
  {
    id: 'backgroundCheck',
    type: 'checkbox',
    label: 'Background check required',
    required: false,
    group: 'requirements',
  },
  {
    id: 'licensureRequired',
    type: 'checkbox',
    label: 'Professional licensure required',
    required: false,
    group: 'requirements',
  },
  {
    id: 'insuranceRequired',
    type: 'checkbox',
    label: 'Liability insurance required',
    required: false,
    group: 'requirements',
  },
  {
    id: 'cprCertification',
    type: 'checkbox',
    label: 'CPR certification required',
    required: false,
    group: 'requirements',
  },
  {
    id: 'emergencyProcedures',
    type: 'textarea',
    label: 'Emergency Procedures',
    placeholder: 'Describe procedures for medical emergencies',
    required: false,
    group: 'emergency',
  },
  {
    id: 'confidentialityClause',
    type: 'checkbox',
    label: 'Include confidentiality clause',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'mediaRestrictions',
    type: 'checkbox',
    label: 'Restrict photos/social media posting',
    required: false,
    group: 'confidentiality',
  },
  {
    id: 'substituteCaregiver',
    type: 'checkbox',
    label: 'Allow substitute caregivers',
    required: false,
    group: 'substitution',
  },
  {
    id: 'performanceReviews',
    type: 'checkbox',
    label: 'Include performance reviews',
    required: false,
    group: 'performance',
  },
  {
    id: 'reviewFrequency',
    type: 'select',
    label: 'Review Frequency',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'semi-annually', label: 'Semi-annually' },
      { value: 'annually', label: 'Annually' },
    ],
    required: false,
    group: 'performance',
    dependsOn: 'performanceReviews',
  },
  {
    id: 'dailyReports',
    type: 'checkbox',
    label: 'Require daily reports',
    required: false,
    group: 'communication',
  },
  {
    id: 'weeklyReports',
    type: 'checkbox',
    label: 'Require weekly reports',
    required: false,
    group: 'communication',
  },
  {
    id: 'smokingPolicy',
    type: 'select',
    label: 'Smoking Policy',
    options: [
      { value: 'prohibited', label: 'Prohibited' },
      { value: 'designated-areas', label: 'Designated Areas Only' },
      { value: 'allowed', label: 'Allowed' },
    ],
    required: false,
    group: 'restrictions',
  },
  {
    id: 'alcoholPolicy',
    type: 'select',
    label: 'Alcohol Policy',
    options: [
      { value: 'prohibited', label: 'Prohibited' },
      { value: 'off-duty-only', label: 'Off-duty Only' },
      { value: 'allowed', label: 'Allowed' },
    ],
    required: false,
    group: 'restrictions',
  },
  {
    id: 'personalPhoneUse',
    type: 'select',
    label: 'Personal Phone Use Policy',
    options: [
      { value: 'prohibited', label: 'Prohibited' },
      { value: 'limited', label: 'Limited Use' },
      { value: 'emergency-only', label: 'Emergency Only' },
      { value: 'allowed', label: 'Allowed' },
    ],
    required: false,
    group: 'restrictions',
  },
  {
    id: 'liabilityInsurance',
    type: 'checkbox',
    label: 'Liability insurance coverage',
    required: false,
    group: 'insurance',
  },
  {
    id: 'workersCompensation',
    type: 'checkbox',
    label: 'Workers compensation coverage',
    required: false,
    group: 'insurance',
  },
  {
    id: 'terminationNotice',
    type: 'text',
    label: 'Termination Notice Period',
    placeholder: 'e.g., 2 weeks notice',
    required: false,
    group: 'termination',
  },
  {
    id: 'severancePay',
    type: 'checkbox',
    label: 'Severance pay provision',
    required: false,
    group: 'termination',
  },
  {
    id: 'requireRecipientSignature',
    type: 'checkbox',
    label: 'Require care recipient signature',
    required: false,
    group: 'signatures',
  },
  {
    id: 'requireCaregiverSignature',
    type: 'checkbox',
    label: 'Require caregiver signature',
    required: false,
    group: 'signatures',
  },
  {
    id: 'requireFamilySignature',
    type: 'checkbox',
    label: 'Require family member signature',
    required: false,
    group: 'signatures',
  },
];
