const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const documents = require('./documents.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadDocuments() {
  console.log('Starting document upload process...');
  const batch = db.batch();
  const ref = db.collection('documents');

  console.log(`Preparing to upload ${documents.length} documents...`);

  documents.forEach((doc) => {
    const docRef = ref.doc(doc.id);
    batch.set(docRef, doc);
  });

  console.log('Committing batch to Firestore...');

  try {
    await batch.commit();
    console.log('Documents uploaded successfully.');
  } catch (error) {
    console.error('Error uploading documents:', error);
  }
}

uploadDocuments().catch(console.error);
