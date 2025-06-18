// src/lib/documents/us/notarization-request/schema.ts
import { z } from 'zod';

export const NotarizationRequestSchema = z.object({
  // Requester Information
  requesterName: z.string().min(1, 'Requester name is required'),
  requesterAddress: z.string().min(1, 'Requester address is required'),
  requesterPhone: z.string().min(1, 'Requester phone is required'),
  requesterEmail: z.string().email().optional(),
  
  // Document Information
  documentType: z.string().min(1, 'Document type is required'),
  documentDescription: z.string().optional(),
  numberOfPages: z.string().optional(),
  numberOfCopies: z.string().optional(),
  
  // Notarial Act Type
  notarialActType: z.enum(['acknowledgment', 'jurat', 'oath', 'affirmation', 'signature-witnessing']).default('acknowledgment'),
  specialInstructions: z.string().optional(),
  
  // Signer Information
  signerName: z.string().min(1, 'Signer name is required'),
  signerIdType: z.enum(['drivers-license', 'passport', 'state-id', 'military-id']).default('drivers-license'),
  signerIdNumber: z.string().optional(),
  signerIdState: z.string().optional(),
  
  // Appointment Details
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  appointmentLocation: z.enum(['notary-office', 'client-location', 'online']).default('notary-office'),
  mobileNotaryRequested: z.boolean().default(false),
  
  // Fees
  notaryFee: z.string().optional(),
  travelFee: z.string().optional(),
  totalFee: z.string().optional(),
  paymentMethod: z.enum(['cash', 'check', 'credit-card']).default('cash'),
  
  // Special Requirements
  witnessRequired: z.boolean().default(false),
  interpreterRequired: z.boolean().default(false),
  languageNeeded: z.string().optional(),
  disabilityAccommodation: z.boolean().default(false),
  
  // Signature Requirements
  requireRequesterSignature: z.boolean().default(true),
  requireNotarySignature: z.boolean().default(true),
  witnessSignatureRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(false),
});