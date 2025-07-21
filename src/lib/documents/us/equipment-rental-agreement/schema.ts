// src/lib/documents/us/equipment-rental-agreement/schema.ts
import { z } from 'zod';

export const EquipmentRentalAgreementSchema = z.object({
  // Lessor (Owner) Information
  lessorName: z.string().min(1, 'Lessor name is required'),
  lessorCompany: z.string().optional(),
  lessorAddress: z.string().min(1, 'Lessor address is required'),
  lessorPhone: z.string().min(1, 'Lessor phone is required'),
  lessorEmail: z.string().email('Valid email required'),

  // Lessee (Renter) Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeCompany: z.string().optional(),
  lesseeAddress: z.string().min(1, 'Lessee address is required'),
  lesseePhone: z.string().min(1, 'Lessee phone is required'),
  lesseeEmail: z.string().email('Valid email required'),
  lesseeDriverLicense: z.string().optional(),

  // Equipment Details
  equipmentType: z.string().min(1, 'Equipment type is required'),
  equipmentMake: z.string().optional(),
  equipmentModel: z.string().optional(),
  equipmentSerialNumber: z.string().optional(),
  equipmentYear: z.string().optional(),
  equipmentDescription: z.string().min(1, 'Equipment description is required'),
  equipmentValue: z.number().positive('Equipment value must be positive'),
  equipmentCondition: z.enum(['excellent', 'good', 'fair', 'poor']),

  // Rental Terms
  rentalStartDate: z.string().min(1, 'Rental start date is required'),
  rentalEndDate: z.string().min(1, 'Rental end date is required'),
  rentalPeriod: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'custom']),
  deliveryRequired: z.boolean().default(false),
  deliveryAddress: z.string().optional(),
  pickupRequired: z.boolean().default(false),

  // Financial Terms
  rentalRate: z.number().positive('Rental rate must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  paymentFrequency: z.enum(['advance', 'weekly', 'monthly', 'upon-return']),
  paymentMethod: z.enum([
    'cash',
    'check',
    'credit-card',
    'bank-transfer',
    'other',
  ]),
  lateFeePerDay: z.number().min(0, 'Late fee cannot be negative'),

  // Insurance and Liability
  insuranceRequired: z.boolean().default(true),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  liabilityLimit: z.number().optional(),
  damageWaiver: z.boolean().default(false),
  damageWaiverFee: z.number().optional(),

  // Operating Conditions
  authorizedOperators: z.string().optional(),
  operatorCertificationRequired: z.boolean().default(false),
  usageRestrictions: z.string().optional(),
  geographicRestrictions: z.string().optional(),
  maintenanceResponsibility: z.enum(['lessor', 'lessee', 'shared']),

  // Additional Terms
  fuelPolicy: z
    .enum(['full-to-full', 'lessee-pays', 'included', 'not-applicable'])
    .optional(),
  cleaningRequired: z.boolean().default(true),
  normalWearAndTear: z.boolean().default(true),
  subleaseAllowed: z.boolean().default(false),
  earlyTerminationAllowed: z.boolean().default(false),
  earlyTerminationFee: z.number().optional(),

  // Special Conditions
  specialConditions: z.string().optional(),
  prohibitedUses: z.string().optional(),
  requiredPermits: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Signatures
  lessorSignatureDate: z.string().optional(),
  lesseeSignatureDate: z.string().optional(),
});
