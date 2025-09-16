// Debug script to check what documents are in the dashboard
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore');

// Firebase config - you'll need to replace with your actual config
const firebaseConfig = {
  // Your firebase config here
};

async function debugDashboard() {
  try {
    console.log('🔍 Starting dashboard debug...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Replace with a real user ID to test
    const userId = 'test-user-id'; // You'll need to replace this
    
    console.log(`📂 Checking documents for user: ${userId}`);
    
    const col = collection(db, 'users', userId, 'documents');
    const q = query(col, orderBy('updatedAt', 'desc'), limit(10));
    const snap = await getDocs(q);
    
    console.log(`📄 Found ${snap.size} documents:`);
    
    snap.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n${index + 1}. Document ID: ${doc.id}`);
      console.log(`   Name: ${data.name || 'No name'}`);
      console.log(`   DocType: ${data.docType || 'No docType'}`);
      console.log(`   Status: ${data.status || 'No status'}`);
      console.log(`   State: ${data.state || 'No state'}`);
      console.log(`   UpdatedAt: ${data.updatedAt ? data.updatedAt.toDate?.() || data.updatedAt : 'No updatedAt'}`);
      console.log(`   CreatedAt: ${data.createdAt ? data.createdAt.toDate?.() || data.createdAt : 'No createdAt'}`);
      console.log(`   DeletedAt: ${data.deletedAt || 'None'}`);
      console.log(`   FormData keys: ${data.formData ? Object.keys(data.formData).join(', ') : 'No formData'}`);
    });
    
    if (snap.size === 0) {
      console.log('❌ No documents found! Check:');
      console.log('   1. User ID is correct');
      console.log('   2. Documents are being saved to the right path');
      console.log('   3. Firebase permissions allow reading');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDashboard();