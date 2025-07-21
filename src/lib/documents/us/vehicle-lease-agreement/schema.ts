// src/lib/documents/us/vehicle-lease-agreement/schema.ts
import { z } from 'zod';

export const VehicleLeaseAgreementSchema = z.object({
  // Lessor Information
  lessorName: z.string().min(1, 'Lessor name is required'),
  lessorAddress: z.string().min(1, 'Lessor address is required'),
  lessorPhone: z.string().optional(),
  lessorEmail: z.string().email().optional(),

  // Lessee Information
  lesseeName: z.string().min(1, 'Lessee name is required'),
  lesseeAddress: z.string().min(1, 'Lessee address is required'),
  lesseePhone: z.string().optional(),
  lesseeEmail: z.string().email().optional(),
  lesseeLicense: z.string().optional(),

  // Vehicle Information
  vehicleYear: z.string().min(1, 'Vehicle year is required'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleVin: z.string().optional(),
  vehicleLicense: z.string().optional(),
  vehicleMileage: z.string().optional(),
  vehicleColor: z.string().optional(),
  vehicleCondition: z.string().optional(),

  // Lease Terms
  leaseStartDate: z.string().min(1, 'Lease start date is required'),
  leaseEndDate: z.string().min(1, 'Lease end date is required'),
  leaseTerm: z.string().optional(),
  monthlyPayment: z.string().min(1, 'Monthly payment is required'),
  securityDeposit: z.string().optional(),

  // Mileage Restrictions
  mileageLimit: z.string().optional(),
  excessMileageRate: z.string().optional(),
  mileageTracking: z.boolean().default(true),

  // Insurance Requirements
  insuranceRequired: z.boolean().default(true),
  minimumCoverage: z.string().optional(),
  insuranceProvider: z.string().optional(),
  additionalInsured: z.boolean().default(true),

  // Maintenance and Repairs
  maintenanceResponsibility: z
    .enum(['lessor', 'lessee', 'shared'])
    .default('lessee'),
  normalWearTear: z.boolean().default(true),
  excessiveWearCharges: z.boolean().default(true),

  // Payment Terms
  paymentDueDate: z.string().optional(),
  latePaymentFee: z.string().optional(),
  paymentMethod: z
    .enum(['check', 'auto-pay', 'cash', 'wire'])
    .default('auto-pay'),

  // Return Conditions
  returnCondition: z.string().optional(),
  returnLocation: z.string().optional(),
  inspectionRequired: z.boolean().default(true),

  // Purchase Option
  purchaseOption: z.boolean().default(false),
  purchasePrice: z.string().optional(),
  purchaseNotice: z.string().optional(),

  // Early Termination
  earlyTerminationAllowed: z.boolean().default(true),
  earlyTerminationFee: z.string().optional(),
  earlyTerminationConditions: z.string().optional(),

  // Default and Remedies
  defaultRemedies: z.string().optional(),
  repossessionRights: z.boolean().default(true),
  deficiencyLiability: z.boolean().default(true),

  // Signature Requirements
  requireLessorSignature: z.boolean().default(true),
  requireLesseeSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
