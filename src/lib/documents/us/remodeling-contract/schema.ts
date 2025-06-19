// src/lib/documents/us/remodeling-contract/schema.ts
import { z } from 'zod';

export const RemodelingContractSchema = z.object({
  // Homeowner Information
  homeownerName: z.string().min(1, 'Homeowner name is required'),
  homeownerAddress: z.string().min(1, 'Homeowner address is required'),
  homeownerPhone: z.string().min(1, 'Homeowner phone is required'),
  homeownerEmail: z.string().email().optional(),
  
  // Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().min(1, 'Contractor phone is required'),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().min(1, 'Contractor license is required'),
  contractorInsurance: z.string().min(1, 'Insurance information is required'),
  
  // Project Information
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  remodelingType: z.enum(['kitchen', 'bathroom', 'basement', 'attic', 'room-addition', 'whole-house', 'exterior', 'multiple-rooms', 'other']),
  roomsAffected: z.array(z.string()).default([]),
  
  // Work Scope
  workScope: z.string().min(1, 'Work scope is required'),
  materialsIncluded: z.boolean().default(true),
  materialsList: z.string().optional(),
  laborIncluded: z.boolean().default(true),
  specialRequirements: z.string().optional(),
  
  // Timeline
  contractDate: z.string().min(1, 'Contract date is required'),
  startDate: z.string().min(1, 'Start date is required'),
  completionDate: z.string().min(1, 'Completion date is required'),
  workingHours: z.string().optional(),
  workingDays: z.string().optional(),
  
  // Pricing
  contractPrice: z.string().min(1, 'Contract price is required'),
  priceType: z.enum(['fixed-price', 'cost-plus-fixed-fee', 'time-and-materials']),
  paymentSchedule: z.enum(['upfront-progress-final', 'milestone-based', 'weekly', 'monthly']),
  downPayment: z.string().optional(),
  progressPayments: z.string().optional(),
  finalPayment: z.string().optional(),
  
  // Permits and Inspections
  permitsRequired: z.boolean().default(false),
  permitResponsibility: z.enum(['homeowner', 'contractor', 'shared']).optional(),
  inspectionsRequired: z.boolean().default(false),
  inspectionCoordination: z.enum(['homeowner', 'contractor']).optional(),
  
  // Materials and Supplies
  materialSelection: z.enum(['homeowner-selects', 'contractor-selects', 'joint-selection']),
  materialApproval: z.boolean().default(true),
  materialDelivery: z.enum(['contractor-delivers', 'homeowner-delivers', 'joint-responsibility']),
  materialStorage: z.string().optional(),
  wasteDisposal: z.enum(['contractor-responsibility', 'homeowner-responsibility', 'shared']),
  
  // Change Order Process
  changeOrderProcess: z.boolean().default(true),
  changeOrderApproval: z.enum(['written-only', 'verbal-written', 'homeowner-approval']),
  changeOrderPricing: z.string().optional(),
  
  // Insurance and Liability
  contractorInsuranceCoverage: z.string().min(1, 'Insurance coverage amount is required'),
  liabilityInsurance: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),
  bonding: z.boolean().default(false),
  
  // Warranties
  workmanshipWarranty: z.boolean().default(true),
  warrantyPeriod: z.string().optional(),
  materialWarranties: z.boolean().default(true),
  warrantyTerms: z.string().optional(),
  
  // Safety and Protection
  safetyMeasures: z.boolean().default(true),
  propertyProtection: z.boolean().default(true),
  cleanupDaily: z.boolean().default(true),
  cleanupFinal: z.boolean().default(true),
  
  // Utilities and Access
  utilityAccess: z.boolean().default(true),
  keyAccess: z.boolean().default(false),
  workingAccess: z.string().optional(),
  storageAccess: z.boolean().default(false),
  
  // Subcontractors
  subcontractorsAllowed: z.boolean().default(true),
  subcontractorApproval: z.boolean().default(false),
  subcontractorInsurance: z.boolean().default(true),
  
  // Delays and Extensions
  weatherDelays: z.boolean().default(true),
  materialDelays: z.boolean().default(true),
  inspectionDelays: z.boolean().default(true),
  forceMapjeure: z.boolean().default(true),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']),
  governingLaw: z.string().optional(),
  
  // Termination
  terminationClause: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationPayment: z.string().optional(),
  
  // Signatures
  homeownerSignatureRequired: z.boolean().default(true),
  contractorSignatureRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
});