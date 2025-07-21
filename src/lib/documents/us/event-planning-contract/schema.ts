// src/lib/documents/us/event-planning-contract/schema.ts
import { z } from 'zod';

export const EventPlanningContractSchema = z.object({
  // Event Planner Information
  plannerName: z.string().min(1, 'Planner name is required'),
  plannerBusinessName: z.string().optional(),
  plannerAddress: z.string().min(1, 'Planner address is required'),
  plannerPhone: z.string().optional(),
  plannerEmail: z.string().email().optional(),

  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),

  // Event Details
  eventType: z
    .enum([
      'wedding',
      'birthday',
      'corporate',
      'anniversary',
      'graduation',
      'other',
    ])
    .default('wedding'),
  eventName: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  eventVenue: z.string().optional(),
  expectedGuests: z.string().optional(),

  // Services Included
  fullEventPlanning: z.boolean().default(false),
  partialPlanning: z.boolean().default(false),
  dayOfCoordination: z.boolean().default(false),
  venueSelection: z.boolean().default(false),
  vendorCoordination: z.boolean().default(false),
  budgetManagement: z.boolean().default(false),

  // Detailed Services
  cateringCoordination: z.boolean().default(false),
  decorationPlanning: z.boolean().default(false),
  entertainmentBooking: z.boolean().default(false),
  invitationDesign: z.boolean().default(false),
  photographyCoordination: z.boolean().default(false),
  transportationArrangements: z.boolean().default(false),

  // Timeline and Schedule
  planningStartDate: z.string().optional(),
  finalMeetingDate: z.string().optional(),
  setupTime: z.string().optional(),
  eventDuration: z.string().optional(),
  cleanupResponsibility: z.boolean().default(false),

  // Budget and Pricing
  totalBudget: z.string().optional(),
  planningFee: z.string().min(1, 'Planning fee is required'),
  feeStructure: z
    .enum(['flat-fee', 'hourly', 'percentage', 'package'])
    .default('flat-fee'),
  hourlyRate: z.string().optional(),
  percentageOfBudget: z.string().optional(),

  // Payment Terms
  paymentSchedule: z
    .enum(['full-upfront', 'deposit-balance', 'installments'])
    .default('deposit-balance'),
  depositAmount: z.string().optional(),
  depositDueDate: z.string().optional(),
  finalPaymentDate: z.string().optional(),
  latePaymentFees: z.boolean().default(false),

  // Additional Costs
  expenseReimbursement: z.boolean().default(true),
  travelExpenses: z.boolean().default(false),
  vendorMarkups: z.boolean().default(false),
  additionalHours: z.string().optional(),

  // Responsibilities
  plannerResponsibilities: z.string().optional(),
  clientResponsibilities: z.string().optional(),
  decisionMakingProcess: z.string().optional(),
  communicationProtocol: z.string().optional(),

  // Vendor Management
  vendorSelectionProcess: z.string().optional(),
  vendorPaymentResponsibility: z
    .enum(['client', 'planner', 'shared'])
    .default('client'),
  vendorContractReview: z.boolean().default(true),
  vendorInsuranceRequirements: z.boolean().default(false),

  // Changes and Modifications
  changeRequestProcess: z.string().optional(),
  additionalServicesFees: z.boolean().default(true),
  timelineChangeFees: z.boolean().default(false),
  vendorChangeResponsibility: z
    .enum(['client', 'planner', 'shared'])
    .default('client'),

  // Cancellation and Termination
  cancellationPolicy: z.string().optional(),
  cancellationFees: z.boolean().default(true),
  refundPolicy: z.string().optional(),
  terminationNotice: z.string().optional(),
  forceMarjeure: z.boolean().default(true),

  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  plannerInsurance: z.boolean().default(false),
  clientInsurance: z.boolean().default(false),
  vendorLiability: z.boolean().default(false),

  // Intellectual Property
  eventDesignOwnership: z
    .enum(['planner', 'client', 'shared'])
    .default('shared'),
  portfolioRights: z.boolean().default(true),
  photoVideoRights: z.boolean().default(true),

  // Communication
  primaryContact: z.string().optional(),
  meetingSchedule: z.string().optional(),
  responseTimeframe: z.string().optional(),
  emergencyContact: z.string().optional(),

  // Special Provisions
  weatherContingency: z.string().optional(),
  backupVenueRequired: z.boolean().default(false),
  specialRequests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration'])
    .optional(),

  // Signature Requirements
  requirePlannerSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
