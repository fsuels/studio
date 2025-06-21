import { DocumentQuestion } from '@/types/documents';

export const accidentReportQuestions: DocumentQuestion[] = [
  // Basic Accident Information
  {
    id: 'accidentInfo.dateOfAccident',
    text: 'When did the accident occur?',
    type: 'date',
    required: true,
  },
  {
    id: 'accidentInfo.timeOfAccident',
    text: 'What time did the accident occur?',
    type: 'time',
    required: true,
  },
  {
    id: 'accidentInfo.location',
    text: 'Where did the accident occur? (Street address or intersection)',
    type: 'text',
    required: true,
    placeholder: '123 Main St or Main St & Oak Ave',
  },
  {
    id: 'accidentInfo.city',
    text: 'City',
    type: 'text',
    required: true,
  },
  {
    id: 'accidentInfo.state',
    text: 'State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'accidentInfo.weatherConditions',
    text: 'Weather conditions at time of accident',
    type: 'select',
    required: true,
    options: [
      { value: 'clear', label: 'Clear' },
      { value: 'cloudy', label: 'Cloudy' },
      { value: 'rain', label: 'Rain' },
      { value: 'snow', label: 'Snow' },
      { value: 'fog', label: 'Fog' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'accidentInfo.roadConditions',
    text: 'Road conditions',
    type: 'select',
    required: true,
    options: [
      { value: 'dry', label: 'Dry' },
      { value: 'wet', label: 'Wet' },
      { value: 'icy', label: 'Icy' },
      { value: 'snowy', label: 'Snowy' },
      { value: 'construction', label: 'Construction zone' },
      { value: 'other', label: 'Other' },
    ],
  },

  // Police Information
  {
    id: 'policeInfo.policeCalled',
    text: 'Were police called to the scene?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'policeInfo.policeReportNumber',
    text: 'Police report number (if available)',
    type: 'text',
    required: false,
    conditionalOn: { field: 'policeInfo.policeCalled', value: true },
  },
  {
    id: 'policeInfo.respondingOfficer',
    text: 'Name of responding officer',
    type: 'text',
    required: false,
    conditionalOn: { field: 'policeInfo.policeCalled', value: true },
  },

  // Vehicle 1 - Driver Information
  {
    id: 'vehicle1.driver.name',
    text: 'Driver 1 - Full name',
    type: 'text',
    required: true,
    placeholder: 'Full legal name',
  },
  {
    id: 'vehicle1.driver.licenseNumber',
    text: 'Driver 1 - License number',
    type: 'text',
    required: false,
  },
  {
    id: 'vehicle1.driver.address',
    text: 'Driver 1 - Street address',
    type: 'text',
    required: true,
  },
  {
    id: 'vehicle1.driver.city',
    text: 'Driver 1 - City',
    type: 'text',
    required: true,
  },
  {
    id: 'vehicle1.driver.state',
    text: 'Driver 1 - State',
    type: 'select',
    required: true,
    placeholder: 'Select state',
  },
  {
    id: 'vehicle1.driver.phone',
    text: 'Driver 1 - Phone number',
    type: 'tel',
    required: true,
    placeholder: '(555) 123-4567',
  },

  // Vehicle 1 - Vehicle Information
  {
    id: 'vehicle1.vehicle.year',
    text: 'Vehicle 1 - Year',
    type: 'number',
    required: true,
    placeholder: '2020',
  },
  {
    id: 'vehicle1.vehicle.make',
    text: 'Vehicle 1 - Make',
    type: 'text',
    required: true,
    placeholder: 'Toyota, Ford, etc.',
  },
  {
    id: 'vehicle1.vehicle.model',
    text: 'Vehicle 1 - Model',
    type: 'text',
    required: true,
    placeholder: 'Camry, F-150, etc.',
  },
  {
    id: 'vehicle1.vehicle.color',
    text: 'Vehicle 1 - Color',
    type: 'text',
    required: true,
    placeholder: 'Blue, Red, etc.',
  },
  {
    id: 'vehicle1.vehicle.licensePlate',
    text: 'Vehicle 1 - License plate',
    type: 'text',
    required: false,
  },

  // Vehicle 1 - Insurance
  {
    id: 'vehicle1.insurance.company',
    text: 'Vehicle 1 - Insurance company',
    type: 'text',
    required: true,
    placeholder: 'State Farm, GEICO, etc.',
  },
  {
    id: 'vehicle1.insurance.policyNumber',
    text: 'Vehicle 1 - Policy number',
    type: 'text',
    required: true,
  },

  // Vehicle 1 - Damage
  {
    id: 'vehicle1.damage.damageDescription',
    text: 'Vehicle 1 - Describe damage',
    type: 'textarea',
    required: true,
    placeholder: 'Detailed description of damage to vehicle',
    minLength: 20,
  },
  {
    id: 'vehicle1.damage.vehicleDriveable',
    text: 'Vehicle 1 - Is vehicle driveable?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'vehicle1.damage.towingRequired',
    text: 'Vehicle 1 - Was towing required?',
    type: 'boolean',
    required: true,
  },

  // Vehicle 2
  {
    id: 'vehicle2.involved',
    text: 'Was a second vehicle involved?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'vehicle2.driver.name',
    text: 'Driver 2 - Full name',
    type: 'text',
    required: false,
    conditionalOn: { field: 'vehicle2.involved', value: true },
  },
  {
    id: 'vehicle2.driver.phone',
    text: 'Driver 2 - Phone number',
    type: 'tel',
    required: false,
    placeholder: '(555) 123-4567',
    conditionalOn: { field: 'vehicle2.involved', value: true },
  },
  {
    id: 'vehicle2.insurance.company',
    text: 'Vehicle 2 - Insurance company',
    type: 'text',
    required: false,
    conditionalOn: { field: 'vehicle2.involved', value: true },
  },

  // Injuries
  {
    id: 'injuries.anyoneInjured',
    text: 'Was anyone injured in the accident?',
    type: 'boolean',
    required: true,
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
    placeholder: 'What did the witness see?',
    conditionalOn: { field: 'witnesses.0.name', value: true },
  },

  // Accident Description
  {
    id: 'description.howAccidentOccurred',
    text: 'Describe how the accident occurred',
    type: 'textarea',
    required: true,
    placeholder:
      'Provide a detailed description of how the accident happened, including direction of travel, speed, and sequence of events...',
    minLength: 50,
  },
  {
    id: 'description.speedEstimate',
    text: 'Estimated speed of your vehicle (mph)',
    type: 'number',
    required: false,
    placeholder: '25',
  },

  // Additional Information
  {
    id: 'additionalInfo.photosAvailable',
    text: 'Were photos taken at the scene?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'additionalInfo.alcoholInvolved',
    text: 'Was alcohol involved?',
    type: 'boolean',
    required: true,
  },
  {
    id: 'additionalInfo.cellPhoneUse',
    text: 'Was anyone using a cell phone?',
    type: 'boolean',
    required: true,
  },

  // Report Completion
  {
    id: 'reportInfo.completedBy',
    text: 'Name of person completing this report',
    type: 'text',
    required: true,
    placeholder: 'Your full name',
  },
  {
    id: 'reportInfo.relationship',
    text: 'Your relationship to the accident',
    type: 'select',
    required: true,
    options: [
      { value: 'driver', label: 'Driver' },
      { value: 'passenger', label: 'Passenger' },
      { value: 'witness', label: 'Witness' },
      { value: 'police', label: 'Police officer' },
      { value: 'other', label: 'Other' },
    ],
  },
];
