import { z } from 'zod';

export const covid19HealthScreeningSchema = z.object({
  // Organization Information
  organization: z.object({
    name: z.string().min(1, 'Organization name is required'),
    address: z.string().min(1, 'Address is required'),
    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        'Phone must be in format (XXX) XXX-XXXX',
      ),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
  }),

  // Screening Configuration
  screeningConfig: z.object({
    screeningType: z.enum(['daily', 'weekly', 'event_based', 'as_needed']),
    participantType: z.enum(['employees', 'visitors', 'contractors', 'all']),
    temperatureCheck: z.boolean(),
    temperatureThreshold: z.number().min(90).max(110).optional(),
    requiresSignature: z.boolean(),
    retentionPeriod: z.number().min(1).max(365), // days
  }),

  // Personal Information Fields
  personalInfo: z.object({
    requireFullName: z.boolean().default(true),
    requireEmployeeId: z.boolean(),
    requireDepartment: z.boolean(),
    requireContactInfo: z.boolean(),
    requireEmergencyContact: z.boolean(),
    additionalFields: z
      .array(
        z.object({
          fieldName: z.string(),
          fieldType: z.enum(['text', 'number', 'boolean', 'date']),
          required: z.boolean(),
        }),
      )
      .optional(),
  }),

  // Health Questions
  healthQuestions: z.object({
    temperatureQuestion: z.boolean().default(true),
    symptomQuestions: z.object({
      fever: z.boolean().default(true),
      cough: z.boolean().default(true),
      shortnessOfBreath: z.boolean().default(true),
      fatigue: z.boolean().default(true),
      bodyAches: z.boolean().default(true),
      headache: z.boolean().default(true),
      lossOfTasteSmell: z.boolean().default(true),
      soreThroat: z.boolean().default(true),
      nausea: z.boolean().default(true),
      congestion: z.boolean().default(true),
      diarrhea: z.boolean().default(true),
      customSymptoms: z.array(z.string()).optional(),
    }),
    timeframeForSymptoms: z.enum([
      '24_hours',
      '48_hours',
      '72_hours',
      '14_days',
    ]),
  }),

  // Exposure Questions
  exposureQuestions: z.object({
    closeContactQuestion: z.boolean().default(true),
    travelQuestion: z.boolean(),
    householdMemberQuestion: z.boolean().default(true),
    healthcareFacilityQuestion: z.boolean(),
    customExposureQuestions: z.array(z.string()).optional(),
    timeframeForExposure: z.enum(['7_days', '10_days', '14_days']),
  }),

  // Testing Questions
  testingQuestions: z.object({
    recentTestQuestion: z.boolean(),
    pendingResultsQuestion: z.boolean(),
    positiveTestQuestion: z.boolean().default(true),
    quarantineQuestion: z.boolean().default(true),
    isolationQuestion: z.boolean().default(true),
  }),

  // Vaccination Questions
  vaccinationQuestions: z.object({
    includeVaccinationStatus: z.boolean(),
    fullyVaccinatedDefinition: z.string().optional(),
    boosterStatus: z.boolean(),
    vaccinationProofRequired: z.boolean(),
  }),

  // Risk Assessment
  riskFactors: z.object({
    includeRiskFactors: z.boolean(),
    age65Plus: z.boolean(),
    chronicConditions: z.boolean(),
    immunocompromised: z.boolean(),
    pregnancyStatus: z.boolean(),
    customRiskFactors: z.array(z.string()).optional(),
  }),

  // Response Protocols
  responseProtocols: z.object({
    failedScreeningAction: z.enum([
      'deny_entry',
      'isolate',
      'send_home',
      'refer_medical',
    ]),
    temperatureFailAction: z.enum(['recheck', 'deny_entry', 'isolate']),
    documentationRequired: z.boolean(),
    notificationRequired: z.boolean(),
    managerNotification: z.boolean(),
    hrNotification: z.boolean(),
    healthDeptNotification: z.boolean(),
  }),

  // Privacy and Compliance
  privacy: z.object({
    hipaaCompliance: z.boolean().default(true),
    dataRetentionPolicy: z.string(),
    dataUseStatement: z.string(),
    consentLanguage: z.string(),
    shareWithHealthDept: z.boolean(),
    shareWithManagement: z.boolean(),
  }),

  // Instructions and Disclaimers
  instructions: z.object({
    preScreeningInstructions: z.string().optional(),
    completionInstructions: z.string().optional(),
    healthDisclaimer: z.string().optional(),
    emergencyContacts: z
      .array(
        z.object({
          title: z.string(),
          phone: z.string(),
          email: z.string().optional(),
        }),
      )
      .optional(),
  }),

  // Digital Options
  digitalOptions: z.object({
    allowElectronicSignature: z.boolean(),
    qrCodeAccess: z.boolean(),
    mobileOptimized: z.boolean(),
    autoSubmission: z.boolean(),
    timestampSubmissions: z.boolean(),
  }),
});

export type Covid19HealthScreening = z.infer<
  typeof covid19HealthScreeningSchema
>;
