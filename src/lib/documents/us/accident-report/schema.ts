import { z } from 'zod';

export const accidentReportSchema = z.object({
  // Basic Accident Information
  accidentInfo: z.object({
    reportNumber: z.string().optional(),
    dateOfAccident: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timeOfAccident: z
      .string()
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Time must be in HH:MM format',
      ),
    location: z.string().min(1, 'Accident location is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    county: z.string().optional(),
    weatherConditions: z.enum([
      'clear',
      'cloudy',
      'rain',
      'snow',
      'fog',
      'other',
    ]),
    roadConditions: z.enum([
      'dry',
      'wet',
      'icy',
      'snowy',
      'construction',
      'other',
    ]),
    lightConditions: z.enum([
      'daylight',
      'dawn',
      'dusk',
      'dark_lighted',
      'dark_unlighted',
    ]),
    trafficControl: z
      .enum([
        'none',
        'traffic_signal',
        'stop_sign',
        'yield_sign',
        'officer',
        'other',
      ])
      .optional(),
  }),

  // Police Information
  policeInfo: z.object({
    policeCalled: z.boolean(),
    policeReportNumber: z.string().optional(),
    respondingOfficer: z.string().optional(),
    policeAgency: z.string().optional(),
    ticketsIssued: z.boolean().optional(),
    ticketDetails: z.string().optional(),
  }),

  // Vehicle 1 Information
  vehicle1: z.object({
    driver: z.object({
      name: z.string().min(1, 'Driver name is required'),
      licenseNumber: z.string().optional(),
      licenseState: z.string().optional(),
      address: z.string().min(1, 'Address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(2, 'State is required'),
      zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
      phone: z
        .string()
        .regex(
          /^\(\d{3}\) \d{3}-\d{4}$/,
          'Phone must be in format (XXX) XXX-XXXX',
        ),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .optional(),
      age: z.number().min(16).max(100).optional(),
    }),
    vehicle: z.object({
      year: z
        .number()
        .min(1900)
        .max(new Date().getFullYear() + 1),
      make: z.string().min(1, 'Vehicle make is required'),
      model: z.string().min(1, 'Vehicle model is required'),
      color: z.string().min(1, 'Vehicle color is required'),
      licensePlate: z.string().optional(),
      plateState: z.string().optional(),
      vin: z.string().optional(),
      vehicleType: z.enum([
        'car',
        'truck',
        'suv',
        'van',
        'motorcycle',
        'bus',
        'other',
      ]),
    }),
    insurance: z.object({
      company: z.string().min(1, 'Insurance company is required'),
      policyNumber: z.string().min(1, 'Policy number is required'),
      agentName: z.string().optional(),
      agentPhone: z
        .string()
        .regex(
          /^\(\d{3}\) \d{3}-\d{4}$/,
          'Phone must be in format (XXX) XXX-XXXX',
        )
        .optional(),
    }),
    damage: z.object({
      damageDescription: z.string().min(20, 'Please describe damage in detail'),
      estimatedCost: z.number().min(0).optional(),
      vehicleDriveable: z.boolean(),
      towingRequired: z.boolean(),
      towCompany: z.string().optional(),
    }),
    passengers: z
      .array(
        z.object({
          name: z.string(),
          age: z.number().min(0).max(120),
          relationship: z.string(),
          injured: z.boolean(),
        }),
      )
      .optional(),
  }),

  // Vehicle 2 Information (if applicable)
  vehicle2: z.object({
    involved: z.boolean(),
    driver: z
      .object({
        name: z.string().optional(),
        licenseNumber: z.string().optional(),
        licenseState: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.string().optional(),
        age: z.number().min(16).max(100).optional(),
      })
      .optional(),
    vehicle: z
      .object({
        year: z
          .number()
          .min(1900)
          .max(new Date().getFullYear() + 1)
          .optional(),
        make: z.string().optional(),
        model: z.string().optional(),
        color: z.string().optional(),
        licensePlate: z.string().optional(),
        plateState: z.string().optional(),
        vin: z.string().optional(),
        vehicleType: z
          .enum(['car', 'truck', 'suv', 'van', 'motorcycle', 'bus', 'other'])
          .optional(),
      })
      .optional(),
    insurance: z
      .object({
        company: z.string().optional(),
        policyNumber: z.string().optional(),
        agentName: z.string().optional(),
        agentPhone: z.string().optional(),
      })
      .optional(),
    damage: z
      .object({
        damageDescription: z.string().optional(),
        estimatedCost: z.number().min(0).optional(),
        vehicleDriveable: z.boolean().optional(),
        towingRequired: z.boolean().optional(),
        towCompany: z.string().optional(),
      })
      .optional(),
    passengers: z
      .array(
        z.object({
          name: z.string(),
          age: z.number().min(0).max(120),
          relationship: z.string(),
          injured: z.boolean(),
        }),
      )
      .optional(),
  }),

  // Injuries
  injuries: z.object({
    anyoneInjured: z.boolean(),
    injuredPersons: z
      .array(
        z.object({
          name: z.string(),
          age: z.number().min(0).max(120),
          relationship: z.enum(['driver', 'passenger', 'pedestrian', 'other']),
          injuryDescription: z.string(),
          medicalAttention: z.boolean(),
          hospitalName: z.string().optional(),
          ambulanceCalled: z.boolean(),
        }),
      )
      .optional(),
  }),

  // Witnesses
  witnesses: z
    .array(
      z.object({
        name: z.string().min(1, 'Witness name is required'),
        address: z.string().optional(),
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

  // Accident Description
  description: z.object({
    howAccidentOccurred: z
      .string()
      .min(
        50,
        'Please provide a detailed description (at least 50 characters)',
      ),
    vehicleDirection: z.string().optional(),
    speedEstimate: z.number().min(0).max(200).optional(),
    pointOfImpact: z.string().optional(),
    trafficViolations: z.string().optional(),
    contributingFactors: z.array(z.string()).optional(),
  }),

  // Additional Information
  additionalInfo: z.object({
    photosAvailable: z.boolean(),
    videoAvailable: z.boolean(),
    propertyDamage: z.boolean(),
    propertyDamageDescription: z.string().optional(),
    alcoholInvolved: z.boolean(),
    drugsInvolved: z.boolean(),
    cellPhoneUse: z.boolean(),
    seatbeltUse: z.enum(['all', 'some', 'none', 'unknown']).optional(),
    airbagDeployment: z.boolean().optional(),
    additionalComments: z.string().optional(),
  }),

  // Report Completion
  reportInfo: z.object({
    completedBy: z
      .string()
      .min(1, 'Name of person completing report is required'),
    relationship: z.enum(['driver', 'passenger', 'witness', 'police', 'other']),
    completionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    signature: z.string().optional(),
  }),
});

export type AccidentReport = z.infer<typeof accidentReportSchema>;
