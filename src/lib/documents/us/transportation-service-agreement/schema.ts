// src/lib/documents/us/transportation-service-agreement/schema.ts
import { z } from 'zod';

export const TransportationServiceAgreementSchema = z.object({
  // Service Provider Information
  providerName: z.string().min(1, 'Provider name is required'),
  providerAddress: z.string().min(1, 'Provider address is required'),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),
  providerLicense: z.string().optional(),
  
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  
  // Service Details
  serviceType: z.enum(['delivery', 'passenger', 'freight', 'moving', 'courier']).default('delivery'),
  serviceDescription: z.string().min(1, 'Service description is required'),
  serviceArea: z.string().optional(),
  regularSchedule: z.boolean().default(false),
  onDemandService: z.boolean().default(true),
  
  // Vehicle Information
  vehicleType: z.string().optional(),
  vehicleCapacity: z.string().optional(),
  specialEquipment: z.string().optional(),
  
  // Pricing Structure
  pricingModel: z.enum(['per-mile', 'hourly', 'flat-rate', 'per-delivery']).default('per-mile'),
  baseRate: z.string().optional(),
  mileageRate: z.string().optional(),
  hourlyRate: z.string().optional(),
  minimumCharge: z.string().optional(),
  
  // Insurance and Liability
  insuranceRequired: z.boolean().default(true),
  liabilityLimits: z.string().optional(),
  cargoInsurance: z.boolean().default(false),
  
  // Payment Terms
  paymentTerms: z.enum(['immediate', 'net-15', 'net-30']).default('net-30'),
  invoicingSchedule: z.enum(['per-trip', 'weekly', 'monthly']).default('monthly'),
  latePaymentFees: z.boolean().default(false),
  
  // Service Standards
  deliveryTimeframes: z.string().optional(),
  serviceAvailability: z.string().optional(),
  communicationRequirements: z.string().optional(),
  
  // Signature Requirements
  requireProviderSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});