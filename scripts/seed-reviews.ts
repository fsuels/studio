import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import creds from '../serviceAccount.json' assert { type: 'json' };

initializeApp({ credential: cert(creds) });
const db = getFirestore();

const path = process.argv[2];
if (!path) {
  console.error('Please provide a path to a JSON file of reviews');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

await Promise.all(
  data.map((r: any) =>
    db.collection('reviews').add({ ...r, createdAt: new Date() }),
  ),
);

console.log(`✅  Seeded ${data.length} reviews from ${path}`);
process.exit(0);
