import { DocumentQuestion } from '@/types/documents';

export const incidentReportQuestions: DocumentQuestion[] = [
  // Basic Information
  {
    id: 'basicInfo.dateOfIncident',
    text: 'When did the incident occur?',
    type: 'date',
    required: true,
  },
  {
    id: 'basicInfo.timeOfIncident',
    text: 'What time did the incident occur?',
    type: 'time',
    required: true,
  },
  {
    id: 'basicInfo.location',
    text: 'Where did the incident occur?',
    type: 'text',
    required: true,
    placeholder: 'Be specific: building, floor, room, equipment, etc.',
  },
  {
    id: 'basicInfo.department',
    text: 'Department where incident occurred',
    type: 'text',
    required: false,
    placeholder: 'Manufacturing, Office, Warehouse, etc.',
  },
  {
    id: 'basicInfo.shift',
    text: 'What shift was it?',
    type: 'select',
    required: false,
    options: [
      { value: 'day', label: 'Day shift' },
      { value: 'evening', label: 'Evening shift' },
      { value: 'night', label: 'Night shift' },
      { value: 'weekend', label: 'Weekend' },
      { value: 'other', label: 'Other' },
    ],
  },

  // Reporter Information
  {
    id: 'reporter.name',
    text: 'Your name (person completing this report)',
    type: 'text',
    required: true,
    placeholder: 'Full name',
  },
  {
    id: 'reporter.title',
    text: 'Your job title',
    type: 'text',
    required: false,
  },
  {
    id: 'reporter.phone',
    text: 'Your phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567',
  },
  {
    id: 'reporter.email',
    text: 'Your email address',
    type: 'email',
    required: true,
  },
  {
    id: 'reporter.relationship',
    text: 'Your relationship to the incident',
    type: 'select',
    required: true,
    options: [
      { value: 'witness', label: 'Witness' },
      { value: 'supervisor', label: 'Supervisor' },
      { value: 'injured_party', label: 'Injured party' },
      { value: 'other', label: 'Other' },
    ],
  },

  // Incident Type
  {
    id: 'incidentType.category',
    text: 'What type of incident was this?',
    type: 'select',
    required: true,
    options: [
      { value: 'injury', label: 'Injury' },
      { value: 'illness', label: 'Illness' },
      { value: 'near_miss', label: 'Near miss' },
      { value: 'property_damage', label: 'Property damage' },
      { value: 'security', label: 'Security incident' },
      { value: 'environmental', label: 'Environmental incident' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'incidentType.severity',
    text: 'How severe was the incident?',
    type: 'select',
    required: true,
    options: [
      { value: 'minor', label: 'Minor - First aid only' },
      { value: 'moderate', label: 'Moderate - Medical treatment required' },
      { value: 'serious', label: 'Serious - Emergency room visit' },
      { value: 'critical', label: 'Critical - Hospitalization' },
    ],
  },
  {
    id: 'incidentType.workRelated',
    text: 'Was this incident work-related?',
    type: 'boolean',
    required: true,
  },

  // Injured Person
  {
    id: 'injuredPersons.0.name',
    text: 'Name of injured person',
    type: 'text',
    required: false,
    placeholder: 'Full name of injured person',
    conditionalOn: { field: 'incidentType.category', value: 'injury' },
  },
  {
    id: 'injuredPersons.0.jobTitle',
    text: 'Job title of injured person',
    type: 'text',
    required: false,
    conditionalOn: { field: 'incidentType.category', value: 'injury' },
  },
  {
    id: 'injuredPersons.0.department',
    text: 'Department of injured person',
    type: 'text',
    required: false,
    conditionalOn: { field: 'incidentType.category', value: 'injury' },
  },

  // Injury Details
  {
    id: 'injuryDetails.bodyPartsAffected',
    text: 'Which body parts were affected?',
    type: 'array',
    required: false,
    placeholder: 'E.g., Left hand, lower back, head',
    conditionalOn: { field: 'incidentType.category', value: 'injury' },
  },
  {
    id: 'injuryDetails.medicalTreatment.firstAidGiven',
    text: 'Was first aid given?',
    type: 'boolean',
    required: false,
    conditionalOn: { field: 'incidentType.category', value: 'injury' },
  },
  {
    id: 'injuryDetails.medicalTreatment.sentToDoctor',
    text: 'Was the person sent to a doctor or hospital?',
    type: 'boolean',
    required: false,
    conditionalOn: { field: 'incidentType.category', value: 'injury' },
  },

  // Description
  {
    id: 'description.whatHappened',
    text: 'Describe in detail what happened',
    type: 'textarea',
    required: true,
    placeholder:
      'Provide a clear, detailed description of the incident. Include sequence of events, conditions present, and any other relevant details...',
    minLength: 50,
  },
  {
    id: 'description.whatWasDoing',
    text: 'What was the person doing when the incident occurred?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the specific activity or task being performed',
    minLength: 20,
  },
  {
    id: 'description.equipmentInvolved',
    text: 'What equipment was involved? (if any)',
    type: 'array',
    required: false,
    placeholder: 'List each piece of equipment separately',
  },

  // Witnesses
  {
    id: 'witnesses.0.name',
    text: 'Witness name',
    type: 'text',
    required: false,
    placeholder: 'Full name of witness',
  },
  {
    id: 'witnesses.0.phone',
    text: 'Witness phone number',
    type: 'tel',
    required: false,
    placeholder: '(555) 123-4567',
    conditionalOn: { field: 'witnesses.0.name', value: true },
  },
  {
    id: 'witnesses.0.statement',
    text: 'Brief witness statement',
    type: 'textarea',
    required: false,
    placeholder: 'What did the witness see or hear?',
    conditionalOn: { field: 'witnesses.0.name', value: true },
  },

  // Property Damage
  {
    id: 'propertyDamage.damageOccurred',
    text: 'Did property damage occur?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'propertyDamage.estimatedCost',
    text: 'Estimated cost of damage',
    type: 'number',
    required: false,
    placeholder: '0',
    conditionalOn: { field: 'propertyDamage.damageOccurred', value: true },
  },
  {
    id: 'propertyDamage.description',
    text: 'Describe the property damage',
    type: 'textarea',
    required: false,
    placeholder: 'Detail what was damaged and extent of damage',
    conditionalOn: { field: 'propertyDamage.damageOccurred', value: true },
  },

  // Contributing Factors
  {
    id: 'contributingFactors.unsafeConditions',
    text: 'Were there any unsafe conditions?',
    type: 'array',
    required: false,
    placeholder: 'E.g., Wet floor, poor lighting, blocked walkway',
  },
  {
    id: 'contributingFactors.unsafeActions',
    text: 'Were there any unsafe actions?',
    type: 'array',
    required: false,
    placeholder:
      'E.g., Not wearing PPE, shortcuts taken, procedures not followed',
  },

  // Immediate Actions
  {
    id: 'correctiveActions.immediateActions',
    text: 'What immediate actions were taken?',
    type: 'textarea',
    required: false,
    placeholder:
      'Describe any immediate steps taken to secure the area, provide aid, etc.',
  },
  {
    id: 'correctiveActions.followUpRequired',
    text: 'Is follow-up action required?',
    type: 'boolean',
    required: true,
  },

  // Additional Information
  {
    id: 'additionalInfo.photos',
    text: 'Were photos taken?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'additionalInfo.policeNotified',
    text: 'Were police notified?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'additionalInfo.additionalComments',
    text: 'Additional comments or information',
    type: 'textarea',
    required: false,
    placeholder: 'Any other relevant information not covered above',
  },
];
