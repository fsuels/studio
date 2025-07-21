// src/lib/documents/us/child-travel-consent/schema.ts
import { z } from 'zod';

export const ChildTravelConsentSchema = z.object({
  // Child Information
  childName: z.string().min(1, 'Child name is required'),
  childBirthDate: z.string().optional(),
  childAge: z.string().optional(),
  childCitizenship: z.string().optional(),
  childPassportNumber: z.string().optional(),
  childSSN: z.string().optional(),

  // Parent/Guardian 1 Information
  parent1Name: z.string().min(1, 'First parent name is required'),
  parent1Relationship: z
    .enum(['mother', 'father', 'guardian', 'adoptive-parent'])
    .default('mother'),
  parent1Address: z.string().optional(),
  parent1Phone: z.string().optional(),
  parent1Email: z.string().email().optional(),
  parent1ID: z.string().optional(),

  // Parent/Guardian 2 Information
  parent2Name: z.string().optional(),
  parent2Relationship: z
    .enum(['mother', 'father', 'guardian', 'adoptive-parent'])
    .optional(),
  parent2Address: z.string().optional(),
  parent2Phone: z.string().optional(),
  parent2Email: z.string().email().optional(),
  parent2ID: z.string().optional(),

  // Accompanying Adult Information
  accompanyingAdultName: z.string().optional(),
  accompanyingAdultRelationship: z.string().optional(),
  accompanyingAdultAddress: z.string().optional(),
  accompanyingAdultPhone: z.string().optional(),
  accompanyingAdultID: z.string().optional(),

  // Travel Information
  travelPurpose: z
    .enum(['vacation', 'family-visit', 'education', 'medical', 'other'])
    .default('vacation'),
  travelDestination: z.string().optional(),
  travelDates: z.string().optional(),
  departureDate: z.string().optional(),
  returnDate: z.string().optional(),
  transportationMethod: z
    .enum(['airplane', 'car', 'bus', 'train', 'cruise'])
    .default('airplane'),

  // Accommodation Information
  accommodationType: z
    .enum(['hotel', 'relative', 'friend', 'resort', 'other'])
    .optional(),
  accommodationAddress: z.string().optional(),
  accommodationPhone: z.string().optional(),
  accommodationContact: z.string().optional(),

  // Emergency Contact Information
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactAddress: z.string().optional(),
  localEmergencyContact: z.string().optional(),

  // Medical Information
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  medicalInsurance: z.string().optional(),
  doctorName: z.string().optional(),
  doctorPhone: z.string().optional(),

  // Consent Details
  medicalTreatmentConsent: z.boolean().default(true),
  emergencyMedicalConsent: z.boolean().default(true),
  activityParticipationConsent: z.boolean().default(true),
  photographyConsent: z.boolean().default(true),

  // Travel Documents
  passportRequired: z.boolean().default(false),
  visaRequired: z.boolean().default(false),
  birthCertificateRequired: z.boolean().default(true),
  courtOrderRequired: z.boolean().default(false),
  additionalDocuments: z.string().optional(),

  // Special Instructions
  dietaryRestrictions: z.string().optional(),
  behavioralNotes: z.string().optional(),
  contactRestrictions: z.string().optional(),
  specialInstructions: z.string().optional(),

  // Duration and Validity
  consentValidFrom: z.string().optional(),
  consentValidUntil: z.string().optional(),
  singleTripOnly: z.boolean().default(true),
  multipleTripConsent: z.boolean().default(false),

  // Legal Custody
  custodyArrangement: z
    .enum(['joint', 'sole-custody', 'guardian'])
    .default('joint'),
  custodyDocumentation: z.boolean().default(false),
  courtOrderNumber: z.string().optional(),
  absentParentConsent: z.boolean().default(false),

  // Financial Responsibility
  financialResponsibility: z.string().optional(),
  emergencyFunds: z.string().optional(),
  insuranceCoverage: z.string().optional(),

  // Return Transportation
  returnTransportationArranged: z.boolean().default(true),
  returnFlightDetails: z.string().optional(),
  returnResponsibleParty: z.string().optional(),

  // School and Activities
  schoolNotification: z.boolean().default(false),
  schoolContactInfo: z.string().optional(),
  missedSchoolDays: z.string().optional(),
  extracurricularImpact: z.string().optional(),

  // International Travel
  internationalTravel: z.boolean().default(false),
  countryDestination: z.string().optional(),
  embassyContact: z.string().optional(),
  consularServices: z.string().optional(),

  // Technology and Communication
  communicationSchedule: z.string().optional(),
  phoneAccess: z.boolean().default(true),
  internetAccess: z.boolean().default(true),
  socialMediaRestrictions: z.boolean().default(false),

  // Signature Requirements
  parent1Signature: z.boolean().default(true),
  parent2Signature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});
