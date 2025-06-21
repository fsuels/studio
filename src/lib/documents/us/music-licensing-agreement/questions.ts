// src/lib/documents/us/music-licensing-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const musicLicensingAgreementQuestions: FormQuestion[] = [
  {
    id: 'licensorName',
    type: 'text',
    label: 'Licensor Name',
    placeholder: 'Enter music rights owner name',
    required: true,
    group: 'licensor',
  },
  {
    id: 'licenseeName',
    type: 'text',
    label: 'Licensee Name',
    placeholder: 'Enter licensee name',
    required: true,
    group: 'licensee',
  },
  {
    id: 'songTitle',
    type: 'text',
    label: 'Song Title',
    placeholder: 'Enter song or composition title',
    required: true,
    group: 'music',
  },
  {
    id: 'artistName',
    type: 'text',
    label: 'Artist Name',
    placeholder: 'Enter performing artist name',
    required: false,
    group: 'music',
  },
  {
    id: 'licenseType',
    type: 'select',
    label: 'License Type',
    options: [
      { value: 'sync', label: 'Synchronization' },
      { value: 'mechanical', label: 'Mechanical' },
      { value: 'performance', label: 'Performance' },
      { value: 'master', label: 'Master Recording' },
      { value: 'print', label: 'Print' },
    ],
    required: true,
    group: 'license',
  },
  {
    id: 'useType',
    type: 'select',
    label: 'Intended Use',
    options: [
      { value: 'film', label: 'Film' },
      { value: 'television', label: 'Television' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'video-game', label: 'Video Game' },
      { value: 'streaming', label: 'Streaming' },
      { value: 'radio', label: 'Radio' },
    ],
    required: true,
    group: 'usage',
  },
];
