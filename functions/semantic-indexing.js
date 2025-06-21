// functions/semantic-indexing.js
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { getFirestore } = require('firebase-admin/firestore');
const { logger } = require('firebase-functions');
const { Pinecone } = require('@pinecone-database/pinecone');
const { VertexAI } = require('@google-cloud/aiplatform');

// Initialize services
let pinecone, vertexAI, db;

function initializeServices() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  
  if (!vertexAI) {
    vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    });
  }
  
  if (!db) {
    db = getFirestore();
  }
}

// Real-time document indexing
exports.indexDocumentOnCreate = onDocumentCreated(
  {
    document: 'documents/{docId}',
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 540,
  },
  async (event) => {
    initializeServices();
    
    const docId = event.params.docId;
    const docData = event.data.data();
    
    try {
      logger.info(`Indexing new document: ${docId}`);
      
      await indexDocument(docId, docData);
      
      // Update document with indexing status
      await db.collection('documents').doc(docId).update({
        indexedAt: new Date(),
        indexingStatus: 'completed',
      });
      
      logger.info(`Successfully indexed document: ${docId}`);
    } catch (error) {
      logger.error(`Failed to index document ${docId}:`, error);
      
      // Update document with error status
      await db.collection('documents').doc(docId).update({
        indexingStatus: 'failed',
        indexingError: error.message,
      });
    }
  }
);

exports.reindexDocumentOnUpdate = onDocumentUpdated(
  {
    document: 'documents/{docId}',
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 540,
  },
  async (event) => {
    initializeServices();
    
    const docId = event.params.docId;
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    
    // Check if content has actually changed
    const contentChanged = 
      beforeData.content !== afterData.content ||
      beforeData.title !== afterData.title ||
      beforeData.category !== afterData.category;
    
    if (!contentChanged) {
      logger.info(`Document ${docId} updated but content unchanged, skipping reindexing`);
      return;
    }
    
    try {
      logger.info(`Reindexing updated document: ${docId}`);
      
      // Delete old vector
      await deleteDocumentFromIndex(docId);
      
      // Index new version
      await indexDocument(docId, afterData);
      
      // Update document with indexing status
      await db.collection('documents').doc(docId).update({
        indexedAt: new Date(),
        indexingStatus: 'completed',
      });
      
      logger.info(`Successfully reindexed document: ${docId}`);
    } catch (error) {
      logger.error(`Failed to reindex document ${docId}:`, error);
      
      await db.collection('documents').doc(docId).update({
        indexingStatus: 'failed',
        indexingError: error.message,
      });
    }
  }
);

exports.removeDocumentFromIndex = onDocumentDeleted(
  {
    document: 'documents/{docId}',
    region: 'us-central1',
  },
  async (event) => {
    initializeServices();
    
    const docId = event.params.docId;
    
    try {
      logger.info(`Removing deleted document from index: ${docId}`);
      
      await deleteDocumentFromIndex(docId);
      
      logger.info(`Successfully removed document from index: ${docId}`);
    } catch (error) {
      logger.error(`Failed to remove document ${docId} from index:`, error);
    }
  }
);

// Batch processing for bulk indexing
exports.batchIndexDocuments = onSchedule(
  {
    schedule: 'every 24 hours',
    region: 'us-central1',
    memory: '2GiB',
    timeoutSeconds: 3600, // 1 hour timeout
  },
  async (context) => {
    initializeServices();
    
    try {
      logger.info('Starting batch document indexing');
      
      // Find documents that need indexing
      const unindexedQuery = db.collection('documents')
        .where('indexingStatus', 'in', ['pending', 'failed', null])
        .limit(100);
      
      const unindexedDocs = await unindexedQuery.get();
      
      if (unindexedDocs.empty) {
        logger.info('No documents need indexing');
        return;
      }
      
      logger.info(`Found ${unindexedDocs.size} documents to index`);
      
      const batch = db.batch();
      const indexingPromises = [];
      
      unindexedDocs.forEach((doc) => {
        const docId = doc.id;
        const docData = doc.data();
        
        // Update status to processing
        batch.update(doc.ref, {
          indexingStatus: 'processing',
          indexingStartedAt: new Date(),
        });
        
        // Queue for indexing
        indexingPromises.push(
          indexDocument(docId, docData)
            .then(() => {
              logger.info(`Successfully indexed ${docId} in batch`);
              return { docId, status: 'completed' };
            })
            .catch((error) => {
              logger.error(`Failed to index ${docId} in batch:`, error);
              return { docId, status: 'failed', error: error.message };
            })
        );
      });
      
      // Commit status updates
      await batch.commit();
      
      // Process indexing (with concurrency limit)
      const results = await Promise.allSettled(indexingPromises);
      
      // Update final statuses
      const finalBatch = db.batch();
      
      results.forEach((result, index) => {
        const doc = unindexedDocs.docs[index];
        
        if (result.status === 'fulfilled') {
          const { status, error } = result.value;
          finalBatch.update(doc.ref, {
            indexingStatus: status,
            indexedAt: status === 'completed' ? new Date() : null,
            indexingError: error || null,
          });
        } else {
          finalBatch.update(doc.ref, {
            indexingStatus: 'failed',
            indexingError: result.reason?.message || 'Unknown error',
          });
        }
      });
      
      await finalBatch.commit();
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 'completed').length;
      logger.info(`Batch indexing completed: ${successful}/${results.length} successful`);
      
    } catch (error) {
      logger.error('Batch indexing failed:', error);
    }
  }
);

// Cleanup old vectors
exports.cleanupOldVectors = onSchedule(
  {
    schedule: 'every sunday 02:00',
    region: 'us-central1',
  },
  async (context) => {
    initializeServices();
    
    try {
      logger.info('Starting vector cleanup');
      
      // Get all document IDs from Firestore
      const documentsSnapshot = await db.collection('documents').select().get();
      const validDocIds = new Set(documentsSnapshot.docs.map(doc => doc.id));
      
      // Get index stats
      const indexName = process.env.PINECONE_INDEX_NAME || 'legal-docs-semantic-search';
      const index = pinecone.index(indexName);
      const stats = await index.describeIndexStats();
      
      logger.info(`Found ${validDocIds.size} valid documents, ${stats.totalVectorCount} vectors in index`);
      
      // This is a simplified cleanup - in production, you'd need to
      // implement pagination to handle large indexes
      if (stats.totalVectorCount > validDocIds.size * 1.1) {
        logger.info('Index may contain orphaned vectors, consider manual cleanup');
      }
      
    } catch (error) {
      logger.error('Vector cleanup failed:', error);
    }
  }
);

// Helper function to index a document
async function indexDocument(docId, docData) {
  try {
    const { content, title, category, complexity, jurisdiction, governingLaw, tags } = docData;
    
    if (!content || !title) {
      throw new Error('Document missing required content or title');
    }
    
    // Generate embedding
    const embedding = await generateEmbedding(content);
    
    // Prepare metadata
    const metadata = {
      docId,
      title,
      category: category || 'misc',
      complexity: complexity || 'medium',
      jurisdiction: jurisdiction || '',
      governingLaw: governingLaw || '',
      createdAt: docData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastModified: docData.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      tags: Array.isArray(tags) ? tags : [],
      content: content.slice(0, 1000), // Truncate for storage
    };
    
    // Extract entities (simplified version)
    const entities = extractBasicEntities(content);
    Object.assign(metadata, entities);
    
    // Store in Pinecone
    const indexName = process.env.PINECONE_INDEX_NAME || 'legal-docs-semantic-search';
    const namespace = process.env.PINECONE_NAMESPACE || 'documents';
    
    const index = pinecone.index(indexName);
    await index.namespace(namespace).upsert([{
      id: docId,
      values: embedding,
      metadata,
    }]);
    
    logger.info(`Document ${docId} successfully indexed in Pinecone`);
    
  } catch (error) {
    logger.error(`Failed to index document ${docId}:`, error);
    throw error;
  }
}

// Helper function to generate embedding
async function generateEmbedding(text) {
  try {
    const request = {
      instances: [{
        content: text.slice(0, 8000), // Limit token count
      }],
    };

    const [response] = await vertexAI.prediction.predict({
      endpoint: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/${process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'}/publishers/google/models/textembedding-gecko@003`,
      instances: [request],
    });

    if (response.predictions && response.predictions.length > 0) {
      const prediction = response.predictions[0];
      return prediction.embeddings?.values || [];
    }

    throw new Error('No embeddings returned from Vertex AI');
  } catch (error) {
    logger.error('Error generating embedding:', error);
    throw error;
  }
}

// Helper function to delete document from index
async function deleteDocumentFromIndex(docId) {
  try {
    const indexName = process.env.PINECONE_INDEX_NAME || 'legal-docs-semantic-search';
    const namespace = process.env.PINECONE_NAMESPACE || 'documents';
    
    const index = pinecone.index(indexName);
    await index.namespace(namespace).deleteOne(docId);
    
    logger.info(`Document ${docId} removed from Pinecone index`);
  } catch (error) {
    logger.error(`Failed to remove document ${docId} from index:`, error);
    throw error;
  }
}

// Helper function to extract basic entities
function extractBasicEntities(text) {
  const entities = {
    parties: [],
    amounts: [],
    dates: [],
  };
  
  // Extract monetary amounts
  const amountRegex = /\$[\d,]+(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})?\s*dollars?\b/gi;
  const amounts = text.match(amountRegex);
  if (amounts) {
    entities.amounts = [...new Set(amounts.slice(0, 5))];
  }
  
  // Extract dates
  const dateRegex = /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
  const dates = text.match(dateRegex);
  if (dates) {
    entities.dates = [...new Set(dates.slice(0, 5))];
  }
  
  // Extract party names (companies)
  const partyRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:LLC|Inc|Corp|Corporation|Company|Co\.|Ltd|Limited)\b/g;
  const parties = text.match(partyRegex);
  if (parties) {
    entities.parties = [...new Set(parties.slice(0, 5))];
  }
  
  return entities;
}