// src/lib/documents/us/child-care-authorization-form/schema.ts
import { z } from 'zod';

export const ChildCareAuthorizationFormSchema = z.object({
  // Parent/Guardian Information
  parentName: z.string().min(1, 'Parent/guardian name is required'),
  parentAddress: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email().optional(),
  relationship: z.enum(['parent', 'guardian', 'grandparent']).default('parent'),

  // Child Information
  childName: z.string().min(1, 'Child name is required'),
  childAge: z.string().optional(),
  childBirthDate: z.string().optional(),
  childAddress: z.string().optional(),

  // Authorized Caregiver
  caregiverName: z.string().min(1, 'Caregiver name is required'),
  caregiverAddress: z.string().optional(),
  caregiverPhone: z.string().optional(),
  caregiverRelationship: z.string().optional(),

  // Authorization Period
  authorizationStartDate: z.string().optional(),
  authorizationEndDate: z.string().optional(),
  authorizationType: z
    .enum(['temporary', 'ongoing', 'emergency'])
    .default('temporary'),

  // Medical Authorization
  medicalTreatmentAuthorization: z.boolean().default(true),
  emergencyMedicalCare: z.boolean().default(true),
  medicationAdministration: z.boolean().default(false),
  hospitalPreference: z.string().optional(),
  doctorName: z.string().optional(),
  doctorPhone: z.string().optional(),

  // Emergency Contacts
  emergencyContact1: z.string().optional(),
  emergencyContact1Phone: z.string().optional(),
  emergencyContact2: z.string().optional(),
  emergencyContact2Phone: z.string().optional(),

  // Special Instructions
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  specialInstructions: z.string().optional(),

  // Activities Authorization
  schoolActivities: z.boolean().default(true),
  fieldTrips: z.boolean().default(true),
  sportsActivities: z.boolean().default(true),
  swimmingActivities: z.boolean().default(false),

  // Transportation
  transportationAuthorization: z.boolean().default(false),
  drivingPermission: z.boolean().default(false),

  // Signature Requirements
  parentSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
});
