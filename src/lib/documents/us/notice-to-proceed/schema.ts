// src/lib/documents/us/notice-to-proceed/schema.ts
import { z } from 'zod';

export const noticetoproceedSchema = z.object({
  // Notice Information
  noticeNumber: z.string().optional(),
  noticeDate: z.string().min(1, 'Notice date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  
  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectNumber: z.string().optional(),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  
  // Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerRepresentative: z.string().optional(),
  
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
  
  // Contract Information
  contractDate: z.string().min(1, 'Contract date is required'),
  contractAmount: z.string().min(1, 'Contract amount is required'),
  contractNumber: z.string().optional(),
  
  // Work Authorization
  authorizedWork: z.string().min(1, 'Description of authorized work is required'),
  workPhases: z.array(z.string()).default([]),
  workScope: z.string().optional(),
  
  // Schedule Information
  commencementDate: z.string().min(1, 'Work commencement date is required'),
  completionDate: z.string().min(1, 'Work completion date is required'),
  workingDays: z.string().optional(),
  calendarDays: z.string().optional(),
  
  // Milestones
  milestones: z.array(z.object({
    milestone: z.string(),
    description: z.string(),
    dueDate: z.string(),
    criticalPath: z.boolean().default(false),
  })).default([]),
  
  // Pre-Construction Requirements
  preConstructionMeeting: z.boolean().default(false),
  meetingDate: z.string().optional(),
  meetingLocation: z.string().optional(),
  
  // Permits and Approvals
  permitsRequired: z.array(z.string()).default([]),
  permitsObtained: z.boolean().default(false),
  approvalsRequired: z.array(z.string()).default([]),
  approvalsObtained: z.boolean().default(false),
  
  // Insurance and Bonds
  insuranceVerified: z.boolean().default(false),
  bondsProvided: z.boolean().default(false),
  performanceBondAmount: z.string().optional(),
  paymentBondAmount: z.string().optional(),
  
  // Site Conditions
  siteAccess: z.boolean().default(true),
  siteAccessDate: z.string().optional(),
  siteConditions: z.string().optional(),
  utilityConnections: z.array(z.string()).default([]),
  
  // Material and Equipment
  materialDeliverySchedule: z.string().optional(),
  equipmentMobilization: z.string().optional(),
  storageAreas: z.string().optional(),
  
  // Safety Requirements
  safetyPlan: z.boolean().default(false),
  safetyOfficer: z.string().optional(),
  safetyTraining: z.boolean().default(false),
  
  // Quality Control
  qualityControlPlan: z.boolean().default(false),
  inspectionSchedule: z.string().optional(),
  testingRequirements: z.array(z.string()).default([]),
  
  // Environmental Compliance
  environmentalPermits: z.boolean().default(false),
  erosionControl: z.boolean().default(false),
  wasteMangement: z.boolean().default(false),
  
  // Communication Protocols
  projectManager: z.string().optional(),
  superintendent: z.string().optional(),
  communicationMethod: z.enum(['email', 'phone', 'meetings', 'project-management-software']).optional(),
  reportingFrequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']).optional(),
  
  // Progress Reporting
  progressReports: z.boolean().default(false),
  reportSchedule: z.string().optional(),
  reportFormat: z.string().optional(),
  
  // Payment Information
  paymentSchedule: z.string().optional(),
  firstPaymentDate: z.string().optional(),
  paymentTerms: z.string().optional(),
  
  // Change Orders
  changeOrderProcedure: z.string().optional(),
  changeOrderApproval: z.string().optional(),
  
  // Special Conditions
  workingHours: z.string().optional(),
  workingDaysOfWeek: z.array(z.string()).default([]),
  holidays: z.array(z.string()).default([]),
  weatherDelays: z.boolean().default(true),
  
  // Coordination Requirements
  coordinationWithOthers: z.boolean().default(false),
  otherContractors: z.array(z.string()).default([]),
  sequencing: z.string().optional(),
  
  // Documentation Requirements
  submittals: z.array(z.string()).default([]),
  shopDrawings: z.boolean().default(false),
  materialSamples: z.boolean().default(false),
  
  // Notice Conditions
  conditions: z.array(z.string()).default([]),
  specialRequirements: z.string().optional(),
  restrictions: z.array(z.string()).default([]),
  
  // Force Majeure
  forceMajeureProvisions: z.boolean().default(false),
  
  // Dispute Resolution
  disputeNotification: z.string().optional(),
  
  // Modification Rights
  modificationRights: z.boolean().default(true),
  modificationProcedure: z.string().optional(),
  
  // Termination Provisions
  terminationRights: z.boolean().default(false),
  terminationConditions: z.string().optional(),
  
  // Acknowledgment Requirements
  contractorAcknowledgment: z.boolean().default(true),
  acknowledgmentDeadline: z.string().optional(),
  
  // Performance Standards
  performanceStandards: z.array(z.string()).default([]),
  qualityStandards: z.string().optional(),
  
  // Additional Terms
  additionalTerms: z.array(z.string()).default([]),
  specialProvisions: z.string().optional(),
  
  // Distribution List
  distributionList: z.array(z.object({
    name: z.string(),
    title: z.string(),
    company: z.string(),
    method: z.enum(['email', 'mail', 'hand-delivery']),
  })).default([]),
  
  // Signatures
  ownerSignature: z.boolean().default(true),
  ownerSignatureDate: z.string().optional(),
  projectManagerSignature: z.boolean().default(false),
  architectSignature: z.boolean().default(false),
  
  // Delivery Confirmation
  deliveryMethod: z.enum(['email', 'certified-mail', 'hand-delivery', 'fax']).optional(),
  deliveryConfirmation: z.boolean().default(false),
  receiptRequired: z.boolean().default(false),
});