import { z } from 'zod';

export const incidentReportSchema = z.object({
  // Basic Incident Information
  basicInfo: z.object({
    reportNumber: z.string().optional(),
    dateOfIncident: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timeOfIncident: z
      .string()
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Time must be in HH:MM format',
      ),
    dateReported: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timeReported: z
      .string()
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Time must be in HH:MM format',
      ),
    location: z.string().min(1, 'Incident location is required'),
    department: z.string().optional(),
    shift: z.enum(['day', 'evening', 'night', 'weekend', 'other']).optional(),
  }),

  // Reporting Person
  reporter: z.object({
    name: z.string().min(1, 'Reporter name is required'),
    title: z.string().optional(),
    department: z.string().optional(),
    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        'Phone must be in format (XXX) XXX-XXXX',
      ),
    email: z.string().email('Invalid email address'),
    relationship: z.enum(['witness', 'supervisor', 'injured_party', 'other']),
  }),

  // Incident Type
  incidentType: z.object({
    category: z.enum([
      'injury',
      'illness',
      'near_miss',
      'property_damage',
      'security',
      'environmental',
      'other',
    ]),
    subcategory: z.string().optional(),
    severity: z.enum(['minor', 'moderate', 'serious', 'critical']),
    workRelated: z.boolean(),
    osha_recordable: z.boolean().optional(),
  }),

  // Injured Person(s)
  injuredPersons: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        employeeId: z.string().optional(),
        jobTitle: z.string().optional(),
        department: z.string().optional(),
        age: z.number().min(16).max(100).optional(),
        experienceInJob: z.string().optional(),
        contactInfo: z
          .object({
            phone: z
              .string()
              .regex(
                /^\(\d{3}\) \d{3}-\d{4}$/,
                'Phone must be in format (XXX) XXX-XXXX',
              )
              .optional(),
            emergencyContact: z.string().optional(),
            emergencyPhone: z
              .string()
              .regex(
                /^\(\d{3}\) \d{3}-\d{4}$/,
                'Phone must be in format (XXX) XXX-XXXX',
              )
              .optional(),
          })
          .optional(),
      }),
    )
    .optional(),

  // Injury Details
  injuryDetails: z
    .object({
      bodyPartsAffected: z.array(z.string()).optional(),
      injuryType: z.array(z.string()).optional(),
      medicalTreatment: z
        .object({
          firstAidGiven: z.boolean(),
          firstAidBy: z.string().optional(),
          sentToDoctor: z.boolean(),
          hospitalName: z.string().optional(),
          returnToWork: z
            .enum([
              'same_day',
              'next_day',
              'restricted_duty',
              'time_off',
              'unknown',
            ])
            .optional(),
        })
        .optional(),
    })
    .optional(),

  // Incident Description
  description: z.object({
    whatHappened: z
      .string()
      .min(
        50,
        'Please provide a detailed description (at least 50 characters)',
      ),
    whatWasDoing: z
      .string()
      .min(20, 'Please describe what the person was doing'),
    equipmentInvolved: z.array(z.string()).optional(),
    materialsInvolved: z.array(z.string()).optional(),
    weatherConditions: z.string().optional(),
    lightingConditions: z
      .enum(['adequate', 'poor', 'very_poor', 'dark'])
      .optional(),
  }),

  // Witnesses
  witnesses: z
    .array(
      z.object({
        name: z.string().min(1, 'Witness name is required'),
        jobTitle: z.string().optional(),
        phone: z
          .string()
          .regex(
            /^\(\d{3}\) \d{3}-\d{4}$/,
            'Phone must be in format (XXX) XXX-XXXX',
          ),
        statement: z.string().min(20, 'Please provide witness statement'),
      }),
    )
    .optional(),

  // Property Damage
  propertyDamage: z
    .object({
      damageOccurred: z.boolean(),
      estimatedCost: z.number().min(0).optional(),
      description: z.string().optional(),
      photosAvailable: z.boolean(),
    })
    .optional(),

  // Contributing Factors
  contributingFactors: z.object({
    unsafeConditions: z.array(z.string()).optional(),
    unsafeActions: z.array(z.string()).optional(),
    environmentalFactors: z.array(z.string()).optional(),
    humanFactors: z.array(z.string()).optional(),
    equipmentFactors: z.array(z.string()).optional(),
  }),

  // Corrective Actions
  correctiveActions: z.object({
    immediateActions: z.string().optional(),
    preventiveActions: z
      .array(
        z.object({
          action: z.string(),
          assignedTo: z.string(),
          dueDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
          status: z.enum(['pending', 'in_progress', 'completed']),
        }),
      )
      .optional(),
    followUpRequired: z.boolean(),
    followUpDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
  }),

  // Supervisor Review
  supervisorReview: z
    .object({
      supervisorName: z.string().optional(),
      reviewDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .optional(),
      comments: z.string().optional(),
      signature: z.string().optional(),
    })
    .optional(),

  // Additional Information
  additionalInfo: z
    .object({
      photos: z.boolean(),
      videoAvailable: z.boolean(),
      policeNotified: z.boolean(),
      insuranceNotified: z.boolean(),
      additionalComments: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .optional(),
});

export type IncidentReport = z.infer<typeof incidentReportSchema>;
