// src/lib/documents/us/recording-artist-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const recordingArtistAgreementQuestions: FormQuestion[] = [
  {
    id: 'artistName',
    type: 'text',
    label: 'Artist Name',
    placeholder: 'Enter artist or band name',
    required: true,
    group: 'artist',
  },
  {
    id: 'labelName',
    type: 'text',
    label: 'Record Label Name',
    placeholder: 'Enter record label name',
    required: true,
    group: 'label',
  },
  {
    id: 'dealType',
    type: 'select',
    label: 'Deal Type',
    options: [
      { value: 'recording', label: 'Recording Deal' },
      { value: 'distribution', label: 'Distribution Deal' },
      { value: 'development', label: 'Development Deal' },
      { value: '360-deal', label: '360 Deal' },
      { value: 'licensing', label: 'Licensing Deal' },
    ],
    required: false,
    group: 'contract',
  },
  {
    id: 'artistType',
    type: 'select',
    label: 'Artist Type',
    options: [
      { value: 'solo', label: 'Solo Artist' },
      { value: 'band', label: 'Band' },
      { value: 'duo', label: 'Duo' },
      { value: 'group', label: 'Group' },
    ],
    required: false,
    group: 'artist',
  },
  {
    id: 'albumCommitment',
    type: 'text',
    label: 'Album Commitment',
    placeholder: 'Enter number of albums',
    required: false,
    group: 'contract',
  },
  {
    id: 'signingAdvance',
    type: 'text',
    label: 'Signing Advance',
    placeholder: 'Enter signing advance amount',
    required: false,
    group: 'financial',
  },
];
