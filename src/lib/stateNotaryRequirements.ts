// src/lib/stateNotaryRequirements.ts

// Example list of states where notarization is typically required for a Bill of Sale.
// This is NOT exhaustive or legal advice. Consult state-specific laws.
export const requiredNotaryStates: string[] = [
  'AZ', // Arizona
  'KY', // Kentucky
  'LA', // Louisiana
  'MD', // Maryland (for gifts)
  'MT', // Montana
  'NE', // Nebraska (if no title)
  'NV', // Nevada
  'NH', // New Hampshire (if no title and older vehicle)
  'NC', // North Carolina (sometimes, especially if issues with title)
  'OH', // Ohio
  'OK', // Oklahoma
  'PA', // Pennsylvania
  'SC', // South Carolina (for vehicles older than 10 years without title)
  'SD', // South Dakota (if no title)
  'WV', // West Virginia
  'WY', // Wyoming
];

// You might want to expand this with more specific rules or per-document type.
