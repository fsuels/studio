// src/lib/documents/us/advance-directive/questions.ts
import { usStates } from '@/lib/usStates';
import type { Question } from '@/types/documents';

const stateOptions = usStates.map((state) => ({ value: state.value, label: state.label }));

export const questions: Question[] = [
  // Section 1: Principal Details
  {
    id: 'principalFullName',
    type: 'text',
    label: 'Principal Full Legal Name',
    required: true,
    section: 'Principal Information',
    placeholder: 'e.g., Jordan A. Rivera',
  },
  {
    id: 'principalAddress',
    type: 'textarea',
    label: 'Principal Mailing Address',
    required: true,
    section: 'Principal Information',
    placeholder: 'Street, City, State ZIP',
  },
  {
    id: 'principalDateOfBirth',
    type: 'date',
    label: 'Principal Date of Birth',
    required: true,
    section: 'Principal Information',
  },
  {
    id: 'principalSsnLast4',
    type: 'text',
    label: 'Last Four Digits of SSN',
    required: true,
    section: 'Principal Information',
    placeholder: '1234',
    description: 'Used only for identification within the directive.',
  },
  {
    id: 'directiveEffectiveDate',
    type: 'date',
    label: 'Effective Date of this Directive',
    required: true,
    section: 'Principal Information',
  },
  {
    id: 'principalValuesStatement',
    type: 'textarea',
    label: 'Guiding Values or Priorities',
    required: false,
    section: 'Principal Information',
    placeholder: 'Describe personal values that should guide medical decisions.',
  },
  {
    id: 'principalSignatureDate',
    type: 'date',
    label: 'Signature Date for the Principal',
    required: true,
    section: 'Principal Information',
  },

  // Section 2: Primary Agent
  {
    id: 'primaryAgentName',
    type: 'text',
    label: 'Primary Health Care Agent Name',
    required: true,
    section: 'Primary Health Care Agent',
    placeholder: 'e.g., Taylor Morgan',
  },
  {
    id: 'primaryAgentAddress',
    type: 'textarea',
    label: 'Primary Agent Address',
    required: true,
    section: 'Primary Health Care Agent',
  },
  {
    id: 'primaryAgentPhone',
    type: 'text',
    label: 'Primary Agent Phone Number',
    required: true,
    section: 'Primary Health Care Agent',
    placeholder: '(555) 123-4567',
  },
  {
    id: 'primaryAgentEmail',
    type: 'text',
    label: 'Primary Agent Email (optional)',
    required: false,
    section: 'Primary Health Care Agent',
    placeholder: 'name@example.com',
  },

  // Section 3: Alternate Agents (Optional)
  {
    id: 'alternateAgentOneName',
    type: 'text',
    label: 'First Alternate Agent Name',
    required: false,
    section: 'Alternate Agents',
  },
  {
    id: 'alternateAgentOneAddress',
    type: 'textarea',
    label: 'First Alternate Agent Address',
    required: false,
    section: 'Alternate Agents',
  },
  {
    id: 'alternateAgentOnePhone',
    type: 'text',
    label: 'First Alternate Agent Phone',
    required: false,
    section: 'Alternate Agents',
  },
  {
    id: 'alternateAgentTwoName',
    type: 'text',
    label: 'Second Alternate Agent Name',
    required: false,
    section: 'Alternate Agents',
  },
  {
    id: 'alternateAgentTwoAddress',
    type: 'textarea',
    label: 'Second Alternate Agent Address',
    required: false,
    section: 'Alternate Agents',
  },
  {
    id: 'alternateAgentTwoPhone',
    type: 'text',
    label: 'Second Alternate Agent Phone',
    required: false,
    section: 'Alternate Agents',
  },

  // Section 4: Medical Preferences
  {
    id: 'lifeSupportPreference',
    type: 'select',
    label: 'Life-Sustaining Treatment Preference',
    required: true,
    section: 'Medical Preferences',
    options: [
      {
        value: 'to continue all available life-sustaining treatments',
        label: 'Continue all available life-sustaining treatments',
      },
      {
        value: 'to limit life-sustaining treatment to comfort-focused care',
        label: 'Limit treatment to comfort-focused care',
      },
      {
        value: 'to let my health care agent decide based on the circumstances',
        label: 'Let my health care agent decide when the time comes',
      },
    ],
  },
  {
    id: 'cprPreference',
    type: 'select',
    label: 'CPR (Cardiopulmonary Resuscitation) Preference',
    required: true,
    section: 'Medical Preferences',
    options: [
      {
        value: 'to receive cardiopulmonary resuscitation (CPR)',
        label: 'Receive CPR (attempt resuscitation)',
      },
      {
        value: 'to decline CPR and allow natural death',
        label: 'Decline CPR (allow natural death)',
      },
      {
        value: 'to let my health care agent decide at the time',
        label: 'Let my agent decide at the time',
      },
    ],
  },
  {
    id: 'nutritionHydrationPreference',
    type: 'select',
    label: 'Artificial Nutrition & Hydration',
    required: true,
    section: 'Medical Preferences',
    options: [
      {
        value: 'to provide artificial nutrition and hydration',
        label: 'Provide artificial nutrition/hydration',
      },
      {
        value: 'to withhold artificial nutrition and hydration',
        label: 'Withhold artificial nutrition/hydration',
      },
      {
        value: 'to let my health care agent decide based on my prognosis',
        label: 'Let agent decide based on prognosis',
      },
    ],
  },
  {
    id: 'pregnancyDirective',
    type: 'textarea',
    label: 'Instructions If Pregnant (if applicable)',
    required: false,
    section: 'Medical Preferences',
  },
  {
    id: 'qualityOfLifeStatement',
    type: 'textarea',
    label: 'Quality of Life Priorities',
    required: false,
    section: 'Medical Preferences',
  },
  {
    id: 'mentalHealthDirective',
    type: 'textarea',
    label: 'Mental Health Treatment Instructions',
    required: false,
    section: 'Medical Preferences',
  },
  {
    id: 'religiousOrCulturalRequests',
    type: 'textarea',
    label: 'Religious or Cultural Practices to Honor',
    required: false,
    section: 'Medical Preferences',
  },

  // Section 5: Organ Donation
  {
    id: 'organDonationPreference',
    type: 'select',
    label: 'Organ & Tissue Donation Preference',
    required: true,
    section: 'Organ Donation',
    options: [
      {
        value: 'wishes to donate any organs or tissues permitted by law',
        label: 'Donate any organs or tissues permitted by law',
      },
      {
        value: 'prefers to donate only the organs or tissues described below',
        label: 'Donate only the organs/tissues specified below',
      },
      {
        value: 'does not authorize organ or tissue donation',
        label: 'Do not authorize organ or tissue donation',
      },
    ],
  },
  {
    id: 'organDonationDetails',
    type: 'textarea',
    label: 'Specific Donation Instructions (optional)',
    required: false,
    section: 'Organ Donation',
    condition: {
      field: 'organDonationPreference',
      value: 'prefers to donate only the organs or tissues described below',
    },
  },

  // Section 6: Guardianship
  {
    id: 'guardianNomineeName',
    type: 'text',
    label: 'Preferred Guardian Name (if court appointment is needed)',
    required: false,
    section: 'Guardianship',
  },
  {
    id: 'disqualifiedGuardians',
    type: 'textarea',
    label: 'Individuals Who Should NOT Serve as Guardian',
    required: false,
    section: 'Guardianship',
  },

  // Section 7: Care Coordination
  {
    id: 'primaryPhysicianName',
    type: 'text',
    label: 'Primary Physician Name',
    required: false,
    section: 'Care Coordination',
  },
  {
    id: 'primaryPhysicianPhone',
    type: 'text',
    label: 'Primary Physician Phone',
    required: false,
    section: 'Care Coordination',
    placeholder: '(555) 987-6543',
  },
  {
    id: 'preferredHospitalName',
    type: 'text',
    label: 'Preferred Hospital or Facility',
    required: false,
    section: 'Care Coordination',
  },
  {
    id: 'preferredHospitalCity',
    type: 'text',
    label: 'Hospital City/Region',
    required: false,
    section: 'Care Coordination',
  },
  {
    id: 'spiritualAdvisorName',
    type: 'text',
    label: 'Spiritual or Cultural Advisor Name',
    required: false,
    section: 'Care Coordination',
  },
  {
    id: 'spiritualAdvisorPhone',
    type: 'text',
    label: 'Spiritual or Cultural Advisor Phone',
    required: false,
    section: 'Care Coordination',
  },
  {
    id: 'careCoordinationNotes',
    type: 'textarea',
    label: 'Additional Care Coordination Notes',
    required: false,
    section: 'Care Coordination',
  },

  // Section 8: Distribution & Storage
  {
    id: 'emergencyDistributionList',
    type: 'textarea',
    label: 'People/Organizations to Receive Copies',
    required: false,
    section: 'Distribution & Storage',
  },
  {
    id: 'directiveStorageLocation',
    type: 'text',
    label: 'Where the Original Directive Will Be Stored',
    required: false,
    section: 'Distribution & Storage',
  },
  {
    id: 'reviewFrequency',
    type: 'text',
    label: 'Planned Review Frequency',
    required: false,
    section: 'Distribution & Storage',
    placeholder: 'e.g., Every two years or after major life events',
  },

  // Section 9: Legal & Notary
  {
    id: 'governingState',
    type: 'select',
    label: 'State Governing This Directive',
    required: true,
    section: 'Legal & Execution Details',
    options: stateOptions,
  },
  {
    id: 'notaryState',
    type: 'select',
    label: 'Notary State',
    required: true,
    section: 'Legal & Execution Details',
    options: stateOptions,
  },
  {
    id: 'notaryCounty',
    type: 'text',
    label: 'Notary County',
    required: true,
    section: 'Legal & Execution Details',
  },
  {
    id: 'notaryDate',
    type: 'date',
    label: 'Notary Acknowledgement Date',
    required: true,
    section: 'Legal & Execution Details',
  },
  {
    id: 'notaryCommissionExpiration',
    type: 'text',
    label: 'Notary Commission Expiration',
    required: false,
    section: 'Legal & Execution Details',
    placeholder: 'e.g., December 31, 2028',
  },

  // Section 10: Witnesses
  {
    id: 'witnessOneName',
    type: 'text',
    label: 'Witness One Name',
    required: true,
    section: 'Witnesses & Signatures',
  },
  {
    id: 'witnessOneSignatureDate',
    type: 'date',
    label: 'Witness One Signature Date',
    required: true,
    section: 'Witnesses & Signatures',
  },
  {
    id: 'witnessTwoName',
    type: 'text',
    label: 'Witness Two Name',
    required: true,
    section: 'Witnesses & Signatures',
  },
  {
    id: 'witnessTwoSignatureDate',
    type: 'date',
    label: 'Witness Two Signature Date',
    required: true,
    section: 'Witnesses & Signatures',
  },
];
