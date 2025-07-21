export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  priceCents: number;
  price?: number;
  slug: string; // for marketing pages (/bundles/{slug})
  docIds: string[]; // IDs from document‑library.ts
  emoji: string; // cute icon in UI
  description?: string;
  imageUrl?: string;
}

export const bundles: Bundle[] = [
  {
    id: 'landlord-starter',
    name: 'Landlord Starter Pack',
    tagline: 'Lease + addenda + eviction notices',
    priceCents: 7900,
    slug: 'landlord-starter-pack',
    emoji: '🏠',
    docIds: [
      'residential‑lease',
      'late‑rent‑notice',
      'lease‑addendum‑pets',
      'lease‑addendum‑smoking',
    ],
  },
  {
    id: 'website-legal',
    name: 'Website Legal Pack',
    tagline: 'Privacy Policy • ToS • GDPR DPA',
    priceCents: 5900,
    slug: 'website-legal-pack',
    emoji: '🌐',
    docIds: [
      'privacy‑policy',
      'terms‑of‑service',
      'gdpr‑dpa',
      'cookie‑banner‑text',
    ],
  },
  // add more …
];
