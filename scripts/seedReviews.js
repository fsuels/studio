/* eslint-env node */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import creds from '../serviceAccount.json' assert { type: 'json' };

initializeApp({ credential: cert(creds) });
const db = getFirestore();

const templateId = 'vehicle-bill-of-sale';
const reviews = [
  {
    name: 'Michelle R.',
    location: 'Austin, TX',
    rating: 5,
    quote:
      'Filled out the bill of sale in under 4 minutes and walked out of the DMV the same day!',
    templateId,
    createdAt: new Date(),
  },
  {
    name: 'Aaron D.',
    location: 'Boise, ID',
    rating: 5,
    quote:
      'Loved the guided questions—caught VIN typos I would have missed. Worth every penny.',
    templateId,
    createdAt: new Date(),
  },
  {
    name: 'Isabel G.',
    location: 'Miami, FL',
    rating: 4.8,
    quote:
      'Sold my car privately; this template made the hand-off super professional.',
    templateId,
    createdAt: new Date(),
  },
];

await Promise.all(
  reviews.map((r) => db.collection('reviews').add(r)),
);
console.log('✅ 3 reviews seeded');
process.exit(0);
