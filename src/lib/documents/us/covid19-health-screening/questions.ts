import { DocumentQuestion } from '@/types/documents';

export const covid19HealthScreeningQuestions: DocumentQuestion[] = [
  // Organization Information
  {
    id: 'organization.name',
    text: 'Organization/Business name',
    type: 'text',
    required: true,
    placeholder: 'ABC Company, Inc.',
  },
  {
    id: 'organization.address',
    text: 'Organization address',
    type: 'text',
    required: true,
    placeholder: '123 Main Street, City, State 12345',
  },
  {
    id: 'organization.phone',
    text: 'Contact phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567',
  },

  // Screening Configuration
  {
    id: 'screeningConfig.screeningType',
    text: 'How often will screening be conducted?',
    type: 'select',
    required: true,
    options: [
      { value: 'daily', label: 'Daily screening' },
      { value: 'weekly', label: 'Weekly screening' },
      { value: 'event_based', label: 'Before each event/visit' },
      { value: 'as_needed', label: 'As needed' },
    ],
  },
  {
    id: 'screeningConfig.participantType',
    text: 'Who will be screened?',
    type: 'select',
    required: true,
    options: [
      { value: 'employees', label: 'Employees only' },
      { value: 'visitors', label: 'Visitors only' },
      { value: 'contractors', label: 'Contractors only' },
      { value: 'all', label: 'All persons entering facility' },
    ],
  },
  {
    id: 'screeningConfig.temperatureCheck',
    text: 'Include temperature check requirement?',
    type: 'boolean',
    required: true,
    helpText: 'Temperature readings help identify potential fever symptoms',
  },
  {
    id: 'screeningConfig.temperatureThreshold',
    text: 'Temperature threshold (°F)',
    type: 'number',
    required: false,
    placeholder: '100.4',
    conditionalOn: { field: 'screeningConfig.temperatureCheck', value: true },
    helpText: 'CDC recommends 100.4°F (38.0°C) as fever threshold',
  },

  // Personal Information Requirements
  {
    id: 'personalInfo.requireEmployeeId',
    text: 'Require employee ID or badge number?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'personalInfo.requireDepartment',
    text: 'Require department information?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'personalInfo.requireContactInfo',
    text: 'Require contact information (phone/email)?',
    type: 'boolean',
    required: true,
    helpText: 'Useful for contact tracing if needed',
  },
  {
    id: 'personalInfo.requireEmergencyContact',
    text: 'Require emergency contact information?',
    type: 'boolean',
    required: true,
  },

  // Health Questions - Symptoms
  {
    id: 'healthQuestions.timeframeForSymptoms',
    text: 'What timeframe should symptom questions cover?',
    type: 'select',
    required: true,
    options: [
      { value: '24_hours', label: 'Past 24 hours' },
      { value: '48_hours', label: 'Past 48 hours' },
      { value: '72_hours', label: 'Past 72 hours' },
      { value: '14_days', label: 'Past 14 days' },
    ],
    helpText: 'CDC typically recommends 24-48 hours for symptom monitoring',
  },
  {
    id: 'healthQuestions.symptomQuestions.customSymptoms',
    text: 'Additional symptoms to include (optional)',
    type: 'array',
    required: false,
    placeholder: 'E.g., skin rash, pink eye',
    helpText:
      'Add any organization-specific symptoms beyond standard COVID-19 symptoms',
  },

  // Exposure Questions
  {
    id: 'exposureQuestions.travelQuestion',
    text: 'Include travel-related questions?',
    type: 'boolean',
    required: true,
    helpText: 'Ask about recent travel to high-risk areas',
  },
  {
    id: 'exposureQuestions.healthcareFacilityQuestion',
    text: 'Ask about visits to healthcare facilities?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'exposureQuestions.timeframeForExposure',
    text: 'What timeframe should exposure questions cover?',
    type: 'select',
    required: true,
    options: [
      { value: '7_days', label: 'Past 7 days' },
      { value: '10_days', label: 'Past 10 days' },
      { value: '14_days', label: 'Past 14 days' },
    ],
    helpText: 'CDC recommends 14 days for exposure monitoring',
  },

  // Testing Questions
  {
    id: 'testingQuestions.recentTestQuestion',
    text: 'Ask about recent COVID-19 tests?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'testingQuestions.pendingResultsQuestion',
    text: 'Ask about pending test results?',
    type: 'boolean',
    required: true,
    helpText:
      'People with pending results should not enter until results are known',
  },

  // Vaccination Questions
  {
    id: 'vaccinationQuestions.includeVaccinationStatus',
    text: 'Include vaccination status questions?',
    type: 'boolean',
    required: true,
    helpText: 'Note: Vaccination requirements vary by location and industry',
  },
  {
    id: 'vaccinationQuestions.boosterStatus',
    text: 'Ask about booster vaccination status?',
    type: 'boolean',
    required: false,
    conditionalOn: {
      field: 'vaccinationQuestions.includeVaccinationStatus',
      value: true,
    },
  },
  {
    id: 'vaccinationQuestions.vaccinationProofRequired',
    text: 'Require proof of vaccination?',
    type: 'boolean',
    required: false,
    conditionalOn: {
      field: 'vaccinationQuestions.includeVaccinationStatus',
      value: true,
    },
  },

  // Risk Factors
  {
    id: 'riskFactors.includeRiskFactors',
    text: 'Include questions about high-risk factors?',
    type: 'boolean',
    required: true,
    helpText: 'Optional questions about age, chronic conditions, etc.',
  },

  // Response Protocols
  {
    id: 'responseProtocols.failedScreeningAction',
    text: 'What action should be taken if someone fails screening?',
    type: 'select',
    required: true,
    options: [
      { value: 'deny_entry', label: 'Deny entry to facility' },
      { value: 'isolate', label: 'Isolate in designated area' },
      { value: 'send_home', label: 'Send home immediately' },
      { value: 'refer_medical', label: 'Refer to medical professional' },
    ],
  },
  {
    id: 'responseProtocols.notificationRequired',
    text: 'Require notification of failed screenings?',
    type: 'boolean',
    required: true,
    helpText: 'Notify supervisors, HR, or health departments as required',
  },
  {
    id: 'responseProtocols.managerNotification',
    text: 'Notify manager/supervisor of failed screenings?',
    type: 'boolean',
    required: false,
    conditionalOn: {
      field: 'responseProtocols.notificationRequired',
      value: true,
    },
  },

  // Privacy and Data Handling
  {
    id: 'privacy.dataRetentionPolicy',
    text: 'How long will screening data be retained?',
    type: 'text',
    required: true,
    placeholder: 'E.g., 30 days, 6 months, as required by law',
    helpText: 'Check local requirements for data retention periods',
  },
  {
    id: 'privacy.shareWithHealthDept',
    text: 'Share positive screening results with health department?',
    type: 'boolean',
    required: true,
    helpText: 'May be required by local health department protocols',
  },

  // Digital Options
  {
    id: 'digitalOptions.allowElectronicSignature',
    text: 'Allow electronic signatures?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'digitalOptions.qrCodeAccess',
    text: 'Provide QR code for mobile access?',
    type: 'boolean',
    required: true,
    helpText: 'Allows contactless completion on personal devices',
  },
  {
    id: 'digitalOptions.mobileOptimized',
    text: 'Optimize form for mobile devices?',
    type: 'boolean',
    required: true,
  },
];
