#!/usr/bin/env tsx
// scripts/addTemplateKeywords.ts
// One-off migration script to populate keywords on existing documents

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type WriteBatch, type DocumentData } from 'firebase-admin/firestore';
import { SYN_MAP } from '../src/config/search';

// Simple stemmer implementation (no external dependencies)
function simpleStem(word: string): string {
  const lowered = word.toLowerCase();
  if (lowered.endsWith('ing')) return lowered.slice(0, -3);
  if (lowered.endsWith('ed')) return lowered.slice(0, -2);
  return lowered;
}

// Initialize Firebase Admin
async function initFirebase() {
  try {
    // Try to load service account from environment or file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccount.json';
    const serviceAccount = require(serviceAccountPath) as ServiceAccount;
    
    initializeApp({
      credential: cert(serviceAccount),
    });
    
    return getFirestore();
  } catch (error) {
    console.error('Failed to initialize Firebase. Make sure you have:', error);
    console.error('1. Set FIREBASE_SERVICE_ACCOUNT_PATH environment variable, or');
    console.error('2. Place serviceAccount.json in the project root');
    process.exit(1);
  }
}

// Generate keywords from document data
function generateKeywords(doc: DocumentData): string[] {
  const keywords = new Set<string>();
  
  // Extract text from various fields
  const textSources = [
    doc.name,
    doc.title,
    doc.description,
    doc.category,
    ...(doc.tags || []),
  ].filter(Boolean);
  
  // Process each text source
  textSources.forEach(text => {
    if (typeof text !== 'string') return;
    
    // Normalize and clean the text
    const cleanText = text
      .normalize('NFKD')
      .replace(/\p{M}/gu, '') // Remove diacritical marks
      .toLowerCase();
    
    // Split into words
    const words = cleanText.split(/\s+/).filter(word => word.length > 2);
    
    // Add original words
    words.forEach(word => keywords.add(word));
    
    // Add stemmed versions
    const stems = words.map(simpleStem);
    stems.forEach(stem => keywords.add(stem));
    
    // Add synonyms for stems
    stems.forEach(stem => {
      const synonyms = SYN_MAP[stem] || [];
      synonyms.forEach(syn => keywords.add(syn.toLowerCase()));
    });
  });
  
  // Convert Set to Array and remove duplicates
  return Array.from(keywords).filter(k => k.length > 0);
}

// Main migration function
async function migrateTemplateKeywords() {
  console.log('Starting template keywords migration...');
  const db = await initFirebase();
  
  let totalProcessed = 0;
  let totalMutated = 0;
  let totalSkipped = 0;
  let totalWrites = 0;
  
  // Collections to process
  const collections = [
    'marketplace-templates',
    'templates', // Legacy collection name if exists
    'legal-documents', // Another possible collection name
  ];
  
  for (const collectionName of collections) {
    console.log(`\nProcessing collection: ${collectionName}`);
    
    try {
      const collection = db.collection(collectionName);
      const snapshot = await collection.get();
      
      if (snapshot.empty) {
        console.log(`Collection ${collectionName} is empty or doesn't exist`);
        continue;
      }
      
      console.log(`Found ${snapshot.size} documents in ${collectionName}`);
      
      // Process in batches of 500
      const batchSize = 500;
      let batch: WriteBatch | null = null;
      let batchCount = 0;
      let batchWrites = 0;
      
      for (const doc of snapshot.docs) {
        totalProcessed++;
        
        // Skip if keywords already exist
        const data = doc.data();
        if (data.keywords && data.keywords.length > 0) {
          totalSkipped++;
          continue;
        }
        
        // Initialize batch if needed
        if (!batch) {
          batch = db.batch();
          batchCount = 0;
        }
        
        // Generate keywords
        const keywords = generateKeywords(data);
        
        if (keywords.length > 0) {
          // Update document with keywords
          batch.update(doc.ref, { keywords });
          batchCount++;
          totalMutated++;
          
          // Commit batch if it reaches the size limit
          if (batchCount >= batchSize) {
            console.log(`Committing batch of ${batchCount} updates...`);
            await batch.commit();
            totalWrites += batchCount;
            batchWrites += batchCount;
            batch = null;
          }
        }
      }
      
      // Commit any remaining updates
      if (batch && batchCount > 0) {
        console.log(`Committing final batch of ${batchCount} updates...`);
        await batch.commit();
        totalWrites += batchCount;
        batchWrites += batchCount;
      }
      
      console.log(`Collection ${collectionName} complete: ${batchWrites} documents updated`);
      
    } catch (error) {
      console.error(`Error processing collection ${collectionName}:`, error);
    }
  }
  
  // Process user documents (if templates are stored per user)
  console.log('\nProcessing user templates...');
  try {
    const usersSnapshot = await db.collection('users').get();
    
    for (const userDoc of usersSnapshot.docs) {
      const templatesRef = userDoc.ref.collection('templates');
      const userTemplatesSnapshot = await templatesRef.get();
      
      if (userTemplatesSnapshot.empty) continue;
      
      let batch: WriteBatch | null = null;
      let batchCount = 0;
      
      for (const templateDoc of userTemplatesSnapshot.docs) {
        totalProcessed++;
        
        const data = templateDoc.data();
        if (data.keywords && data.keywords.length > 0) {
          totalSkipped++;
          continue;
        }
        
        if (!batch) {
          batch = db.batch();
          batchCount = 0;
        }
        
        const keywords = generateKeywords(data);
        
        if (keywords.length > 0) {
          batch.update(templateDoc.ref, { keywords });
          batchCount++;
          totalMutated++;
          
          if (batchCount >= 500) {
            await batch.commit();
            totalWrites += batchCount;
            batch = null;
          }
        }
      }
      
      if (batch && batchCount > 0) {
        await batch.commit();
        totalWrites += batchCount;
      }
    }
  } catch (error) {
    console.error('Error processing user templates:', error);
  }
  
  // Final summary
  console.log('\n=== Migration Summary ===');
  console.log(`Total documents processed: ${totalProcessed}`);
  console.log(`Documents skipped (already had keywords): ${totalSkipped}`);
  console.log(`Mutated docs: ${totalMutated}`);
  console.log(`Total Firestore writes: ${totalWrites}`);
  
  // Cost estimation (as of 2025)
  const estimatedCost = totalWrites * 0.00018; // ~$0.18 per 1000 writes
  console.log(`Estimated Firestore write cost: $${estimatedCost.toFixed(4)}`);
  
  process.exit(0);
}

// Run the migration
migrateTemplateKeywords().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});