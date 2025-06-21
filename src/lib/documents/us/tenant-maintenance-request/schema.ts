// src/lib/documents/us/tenant-maintenance-request/schema.ts
import { z } from 'zod';

export const TenantMaintenanceRequestSchema = z.object({
  // Tenant Information
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantPhone: z.string().min(1, 'Tenant phone is required'),
  tenantEmail: z.string().email('Valid email required'),

  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  unitNumber: z.string().optional(),
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordPhone: z.string().optional(),
  landlordEmail: z.string().email().optional(),
  propertyManagerName: z.string().optional(),
  propertyManagerPhone: z.string().optional(),

  // Request Details
  requestDate: z.string().min(1, 'Request date is required'),
  urgencyLevel: z.enum(['emergency', 'urgent', 'routine']),
  problemLocation: z.string().min(1, 'Problem location is required'),
  problemDescription: z
    .string()
    .min(10, 'Detailed problem description is required'),

  // Problem Categories
  problemCategory: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'appliance',
    'structural',
    'pest',
    'security',
    'other',
  ]),

  // Detailed Issues
  waterLeak: z.boolean().default(false),
  noPower: z.boolean().default(false),
  noHeat: z.boolean().default(false),
  noAC: z.boolean().default(false),
  brokenAppliance: z.boolean().default(false),
  pestInfestation: z.boolean().default(false),
  brokenLock: z.boolean().default(false),
  otherIssue: z.boolean().default(false),

  // Additional Information
  howLongProblem: z.string().optional(),
  previouslyReported: z.boolean().default(false),
  previousReportDate: z.string().optional(),
  attemptedRepairs: z.string().optional(),

  // Access Information
  preferredContactMethod: z.enum(['phone', 'email', 'text']),
  bestTimeToContact: z.string().optional(),
  accessInstructions: z.string().optional(),
  petsPresent: z.boolean().default(false),
  petDetails: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Documentation
  photosAvailable: z.boolean().default(false),
  videoAvailable: z.boolean().default(false),
  additionalNotes: z.string().optional(),

  // Signature
  tenantSignatureDate: z.string().optional(),
});
