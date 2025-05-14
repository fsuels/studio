import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const evictionNotice: LegalDocument = {
  id: 'eviction-notice',
  name: 'Eviction Notice',
  name_es: 'Aviso de Desalojo',
  category: 'Real Estate',
  description: 'Formal notice to a tenant to vacate the property.',
  description_es: 'Notificación formal a un inquilino para desalojar la propiedad.',
  aliases: ["remove tenant", "late rent", "kick out", "notice to quit"],
  aliases_es: ["desalojar inquilino", "renta atrasada", "echar", "notificación de desalojo"],
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  schema: z.object({
    landlordName: z.string().min(1, "Landlord name is required."),
    tenantName: z.string().min(1, "Tenant name is required."),
    propertyAddress: z.string().min(1, "Property address is required."),
    reasonForEviction: z.enum(['nonpayment', 'leaseViolation', 'endOfTerm', 'other'], { errorMap: () => ({ message: "Please select a reason for eviction."}) }),
    reasonDetails: z.string().optional(),
    noticeDate: z.string().min(1, "Notice date is required."), // Date
    vacateDate: z.string().min(1, "Vacate date is required."), // Date
    state: z.string().length(2, "State must be 2 characters."),
  }).refine(data => data.reasonForEviction === 'leaseViolation' || data.reasonForEviction === 'other' ? !!data.reasonDetails : true, {
    message: "Details are required if reason is 'Lease Violation' or 'Other'",
    path: ['reasonDetails'],
  }),
  questions: [
    { id: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
    { id: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
    { id: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
    { id: 'reasonForEviction', label: 'Reason for Eviction', type: 'select', required: true, options: [{ value: 'nonpayment', label: 'Non-payment of Rent' }, { value: 'leaseViolation', label: 'Lease Violation' }, { value: 'endOfTerm', label: 'End of Lease Term' }, { value: 'other', label: 'Other (Specify)' }] },
    { id: 'reasonDetails', label: 'Details of Reason (if violation or other)', type: 'textarea' },
    { id: 'noticeDate', label: 'Date Notice Given', type: 'date', required: true },
    { id: 'vacateDate', label: 'Date Tenant Must Vacate By', type: 'date', required: true },
    { id: 'state', label: 'State Governing Lease', type: 'select', required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
  ]
};