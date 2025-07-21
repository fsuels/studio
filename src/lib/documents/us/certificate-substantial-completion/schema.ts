// src/lib/documents/us/certificate-substantial-completion/schema.ts
import { z } from 'zod';

export const certificatesubstantialcompletionSchema = z.object({
  // Certificate Information
  certificateNumber: z.string().optional(),
  certificateDate: z.string().min(1, 'Certificate date is required'),
  completionDate: z.string().min(1, 'Substantial completion date is required'),

  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectType: z.enum([
    'residential',
    'commercial',
    'industrial',
    'public',
    'infrastructure',
    'other',
  ]),

  // Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),

  // Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().optional(),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().optional(),

  // Architect/Engineer Information
  architectName: z.string().optional(),
  architectAddress: z.string().optional(),
  architectPhone: z.string().optional(),
  architectLicense: z.string().optional(),

  // Contract Information
  contractDate: z.string().min(1, 'Contract date is required'),
  contractAmount: z.string().min(1, 'Contract amount is required'),
  originalCompletionDate: z
    .string()
    .min(1, 'Original completion date is required'),

  // Completion Details
  workCompleted: z.string().min(1, 'Description of completed work is required'),
  completionPercentage: z.string().optional(),
  remainingWork: z.string().optional(),
  punchListItems: z
    .array(
      z.object({
        item: z.string(),
        description: z.string(),
        location: z.string(),
        priority: z.enum(['high', 'medium', 'low']),
        estimatedCompletion: z.string(),
      }),
    )
    .default([]),

  // Inspection and Approval
  inspectionDate: z.string().optional(),
  inspectedBy: z.string().optional(),
  inspectorTitle: z.string().optional(),
  inspectionResults: z.string().optional(),

  // Code Compliance
  buildingCodeCompliance: z.boolean().default(true),
  permitCompliance: z.boolean().default(true),
  zoningCompliance: z.boolean().default(true),
  accessibilityCompliance: z.boolean().default(true),

  // Permits and Approvals
  permitsObtained: z.array(z.string()).default([]),
  finalInspections: z
    .array(
      z.object({
        inspectionType: z.string(),
        inspectionDate: z.string(),
        inspector: z.string(),
        result: z.enum(['passed', 'failed', 'conditional']),
        notes: z.string().optional(),
      }),
    )
    .default([]),

  // Certificate of Occupancy
  certificateOfOccupancy: z.boolean().default(false),
  occupancyDate: z.string().optional(),
  occupancyType: z.enum(['temporary', 'partial', 'full']).optional(),

  // Utilities and Systems
  utilitiesConnected: z
    .array(
      z.enum([
        'electrical',
        'plumbing',
        'hvac',
        'gas',
        'water',
        'sewer',
        'telecommunications',
        'fire-suppression',
        'security',
      ]),
    )
    .default([]),
  systemsTested: z.array(z.string()).default([]),
  systemsOperational: z.boolean().default(true),

  // Safety and Environmental
  safetyInspections: z.boolean().default(true),
  environmentalCompliance: z.boolean().default(true),
  hazardousMaterialsRemoval: z.boolean().default(false),
  asbestosClearance: z.boolean().default(false),
  leadClearance: z.boolean().default(false),

  // Quality Control
  qualityControlInspections: z.boolean().default(true),
  materialTesting: z.boolean().default(false),
  structuralInspections: z.boolean().default(true),
  specialInspections: z.array(z.string()).default([]),

  // Warranties and Guarantees
  warrantyPeriod: z.string().optional(),
  warrantyStartDate: z.string().optional(),
  materialWarranties: z.boolean().default(true),
  equipmentWarranties: z.boolean().default(true),
  workmanshipWarranty: z.boolean().default(true),

  // Documentation Provided
  asBuiltDrawings: z.boolean().default(false),
  operationManuals: z.boolean().default(false),
  maintenanceManuals: z.boolean().default(false),
  warrantyDocuments: z.boolean().default(false),
  testReports: z.boolean().default(false),

  // Training and Handover
  ownerTraining: z.boolean().default(false),
  trainingDate: z.string().optional(),
  trainingTopics: z.array(z.string()).default([]),
  keyHandover: z.boolean().default(false),

  // Conditions and Restrictions
  useRestrictions: z.array(z.string()).default([]),
  accessRestrictions: z.array(z.string()).default([]),
  temporaryConditions: z.array(z.string()).default([]),

  // Financial Matters
  retainageAmount: z.string().optional(),
  retainageReleaseConditions: z.string().optional(),
  finalPaymentDue: z.string().optional(),
  changOrdersCompleted: z.boolean().default(true),

  // Lien Waivers
  lienWaiversReceived: z.boolean().default(false),
  subcontractorLienWaivers: z.boolean().default(false),
  supplierLienWaivers: z.boolean().default(false),

  // Insurance and Bonds
  insuranceCertificates: z.boolean().default(false),
  bondReleaseConditions: z.string().optional(),

  // Dispute Resolution
  openDisputes: z.boolean().default(false),
  disputeDescription: z.string().optional(),

  // Maintenance Period
  maintenancePeriod: z.string().optional(),
  maintenanceResponsibilities: z.string().optional(),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string(),
        company: z.string(),
        phone: z.string(),
        type: z.string(),
      }),
    )
    .default([]),

  // Special Conditions
  specialConditions: z.array(z.string()).default([]),
  additionalRequirements: z.string().optional(),

  // Approvals and Signatures
  ownerApproval: z.boolean().default(true),
  contractorCertification: z.boolean().default(true),
  architectApproval: z.boolean().default(false),

  // Certification Statements
  certificationStatement: z.string().optional(),
  complianceStatement: z.boolean().default(true),

  // Signatures
  ownerSignature: z.boolean().default(true),
  ownerSignatureDate: z.string().optional(),
  contractorSignature: z.boolean().default(true),
  contractorSignatureDate: z.string().optional(),
  architectSignature: z.boolean().default(false),
  architectSignatureDate: z.string().optional(),

  // Notarization
  requireNotarization: z.boolean().default(false),
  notaryState: z.string().optional(),
  notaryCounty: z.string().optional(),
});
