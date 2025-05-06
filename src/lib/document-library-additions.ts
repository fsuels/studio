ts
// src/lib/document-library-additions.ts

import { Document } from './document-library';

// Additional documents to be added to the existing document library

export const documentLibraryAdditions: Document[] = [
  // --- Business Documents ---
  {
    id: 'nda-contract',
    category: 'Business',
    templateId: 'nda-contract',
    name: 'Non-Disclosure Agreement',
    description: 'Protect your confidential information with a legally binding NDA.',
    aiPowered: true,
  },
  {
    id: 'partnership-agreement',
    category: 'Business',
    templateId: 'partnership-agreement',
    name: 'Partnership Agreement',
    description: 'Establish clear terms and expectations for your business partnership.',
    aiPowered: true,
  },
  {
    id: 'employment-contract',
    category: 'Business',
    templateId: 'employment-contract',
    name: 'Employment Contract',
    description: 'Outline the terms of employment for your new hires.',
    aiPowered: true,
  },
  // --- Real Estate Documents ---
  {
    id: 'residential-lease-agreement',
    category: 'Real Estate',
    templateId: 'residential-lease-agreement',
    name: 'Residential Lease Agreement',
    description: 'Create a lease agreement for renting a residential property.',
    aiPowered: true,
  },
  {
    id: 'commercial-lease-agreement',
    category: 'Real Estate',
    templateId: 'commercial-lease-agreement',
    name: 'Commercial Lease Agreement',
    description: 'Create a lease agreement for renting a commercial property.',
    aiPowered: true,
  },
  {
    id: 'purchase-agreement',
    category: 'Real Estate',
    templateId: 'purchase-agreement',
    name: 'Purchase Agreement',
    description: 'Formalize the purchase of a real estate property.',
    aiPowered: true,
  },
  // --- Personal Documents ---
  {
    id: 'power-of-attorney',
    category: 'Personal',
    templateId: 'power-of-attorney',
    name: 'Power of Attorney',
    description: 'Grant legal authority to another person to act on your behalf.',
    aiPowered: true,
  },
  {
    id: 'last-will-testament',
    category: 'Personal',
    templateId: 'last-will-testament',
    name: 'Last Will and Testament',
    description: 'Outline your wishes for the distribution of your assets.',
    aiPowered: true,
  },
  {
    id: 'prenuptial-agreement',
    category: 'Personal',
    templateId: 'prenuptial-agreement',
    name: 'Prenuptial Agreement',
    description: 'Protect your assets before getting married.',
    aiPowered: true,
  },
];