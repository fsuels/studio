// scripts/seedReviews.js
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccountPath = './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Missing serviceAccountKey.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

function parseArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

(async () => {
  const templateId = parseArg('templateId');
  const name = parseArg('name');
  const rating = parseInt(parseArg('rating') || '0', 10);
  const quote = parseArg('quote');
  const avatarUrl = parseArg('avatarUrl');

  if (!templateId || !name || !rating || !quote) {
    console.error('Usage: node scripts/seedReviews.js --templateId=ID --name="Full Name" --rating=5 --quote="Your review" [--avatarUrl=url]');
    process.exit(1);
  }

  const docId = `${templateId}-${Date.now()}`;
  await db.collection('reviews').doc(docId).set({
    templateId,
    name,
    rating,
    quote,
    avatarUrl: avatarUrl || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('Review seeded:', docId);
  process.exit(0);
})();
