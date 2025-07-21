// src/lib/documents/us/architect-contract/schema.ts
import { z } from 'zod';

export const ArchitectContractSchema = z.object({
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().min(1, 'Client phone is required'),
  clientEmail: z.string().email().optional(),

  // Architect Information
  architectName: z.string().min(1, 'Architect name is required'),
  architectFirm: z.string().optional(),
  architectAddress: z.string().min(1, 'Architect address is required'),
  architectPhone: z.string().min(1, 'Architect phone is required'),
  architectEmail: z.string().email().optional(),
  architectLicense: z.string().min(1, 'Architect license is required'),

  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectType: z.enum([
    'residential-new',
    'residential-renovation',
    'commercial-new',
    'commercial-renovation',
    'institutional',
    'industrial',
    'mixed-use',
  ]),
  projectSize: z.string().optional(),
  estimatedConstructionCost: z.string().optional(),

  // Services
  servicesPhase1: z.boolean().default(false), // Schematic Design
  servicesPhase2: z.boolean().default(false), // Design Development
  servicesPhase3: z.boolean().default(false), // Construction Documents
  servicesPhase4: z.boolean().default(false), // Bidding/Negotiation
  servicesPhase5: z.boolean().default(false), // Construction Administration

  additionalServices: z.array(z.string()).default([]),

  // Compensation
  feeStructure: z.enum([
    'fixed-fee',
    'hourly-rate',
    'percentage-of-construction',
    'cost-plus-fee',
  ]),
  totalFee: z.string().optional(),
  hourlyRate: z.string().optional(),
  percentageOfConstruction: z.string().optional(),

  // Payment Terms
  paymentSchedule: z.enum([
    'monthly',
    'phase-based',
    'milestone-based',
    'other',
  ]),
  invoiceFrequency: z.enum(['monthly', 'bi-weekly', 'upon-completion']),
  paymentTerms: z.string().optional(),

  // Timeline
  contractDate: z.string().min(1, 'Contract date is required'),
  serviceStartDate: z.string().min(1, 'Service start date is required'),
  designCompletionDate: z.string().optional(),
  constructionStartDate: z.string().optional(),

  // Deliverables
  drawingsRequired: z.boolean().default(true),
  specificationsRequired: z.boolean().default(true),
  renderings: z.boolean().default(false),
  models: z.boolean().default(false),
  permitDocuments: z.boolean().default(true),

  // Professional Responsibilities
  professionalLiabilityInsurance: z
    .string()
    .min(1, 'Professional liability insurance is required'),
  generalLiabilityInsurance: z.string().optional(),
  sealAndSignature: z.boolean().default(true),
  codeCompliance: z.boolean().default(true),

  // Intellectual Property
  copyrightOwnership: z.enum(['architect-retains', 'client-owns', 'shared']),
  reuseLimitations: z.string().optional(),

  // Changes and Revisions
  revisionPolicy: z.boolean().default(true),
  additionalRevisionFee: z.string().optional(),
  changeOrderProcess: z.boolean().default(true),

  // Termination
  terminationClause: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationCompensation: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z.enum([
    'negotiation',
    'mediation',
    'arbitration',
    'litigation',
  ]),
  governingLaw: z.string().optional(),

  // Signatures
  clientSignatureRequired: z.boolean().default(true),
  architectSignatureRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
});
