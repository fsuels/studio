import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';
import { usStates } from '../usStates'; // Adjusted path

export const leaseAgreement: LegalDocument = {
  id: "leaseAgreement",
  name: "Residential Lease Agreement",
  name_es: "Contrato de Arrendamiento Residencial",
  category: "Real Estate",
  description: "Set terms for renting a residential property.",
  description_es: "Establecer términos para alquilar una propiedad residencial.",
  aliases: ["rent apartment", "tenant", "lease form", "landlord agreement"],
  aliases_es: ["alquiler de apartamento", "inquilino", "formulario de arrendamiento", "acuerdo de propietario"],
  languageSupport: ["en", "es"],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 5,
  states: "all",
  schema: z.object({
    landlord_name: z.string().min(1, "Landlord name is required."),
    tenant_name: z.string().min(1, "Tenant name is required."),
    property_address: z.string().min(1, "Property address is required."),
    lease_start: z.string().min(1, "Lease start date is required."), // Should be date
    lease_term: z.coerce.number().int().positive("Lease term must be a positive integer."),
    monthly_rent: z.coerce.number().positive("Monthly rent must be a positive number."),
    rent_due_date: z.string().min(1, "Rent due date is required."),
    security_deposit: z.coerce.number().min(0, "Security deposit must be non-negative.").optional(),
    pets_allowed: z.enum(["yes", "no", "specific"], { errorMap: () => ({ message: "Please select if pets are allowed."}) }),
    pet_conditions: z.string().optional(),
    late_fee_policy: z.string().optional(),
    state: z.string().length(2, "State must be 2 characters."),
  }).refine(data => data.pets_allowed === "specific" ? !!data.pet_conditions : true, {
    message: "Pet conditions are required if pets are allowed with specific conditions",
    path: ["pet_conditions"],
  }),
  questions: [
    { id: "landlord_name", label: "Landlord's Full Name or Company", required: true, type: "text", placeholder: "e.g., Acme Property Management" },
    { id: "tenant_name", label: "Tenant's Full Name", required: true, type: "text", placeholder: "e.g., Jane Doe" },
    { id: "property_address", label: "Full Property Address (incl. unit #)", required: true, type: "textarea", placeholder: "e.g., 123 Main St, Unit 4B, Anytown, USA 12345" },
    { id: "lease_start", label: "Lease Start Date", required: true, type: "date" },
    { id: "lease_term", label: "Lease Term (Months)", required: true, type: "number", placeholder: "e.g., 12" },
    { id: "monthly_rent", label: "Monthly Rent Amount ($)", required: true, type: "number", placeholder: "e.g., 1500" },
    { id: "rent_due_date", label: "Rent Due Date (e.g., 1st of month)", required: true, type: "text", placeholder: "e.g., 1st" },
    { id: "security_deposit", label: "Security Deposit Amount ($)", type: "number", placeholder: "e.g., 1500" },
    { id: "pets_allowed", label: "Are Pets Allowed?", type: "select", required: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "specific", label: "Yes, with conditions" }] },
    { id: "pet_conditions", label: "Pet Conditions (if allowed)", type: "textarea", placeholder: "e.g., One cat under 15 lbs allowed with $200 pet deposit.", required: false },
    { id: "late_fee_policy", label: "Late Fee Policy (Optional)", type: "textarea", placeholder: "e.g., $50 fee if rent is more than 5 days late.", required: false },
    { id: "state", label: "State Governing Lease", type: "select", required: true, options: usStates.map(s => ({ value: s.value, label: s.label })) }
  ],
  upsellClauses: [
    { id: "lateFeeClause", description: "Add detailed late rent fee clause", description_es: "Añadir cláusula detallada de cargo por pago tardío", price: 1 },
    { id: "petPolicy", description: "Include a specific pet policy addendum", description_es: "Incluir un anexo específico de política de mascotas", price: 1 }
  ]
};