// functions/index.ts
// Pub/Sub-based template embedding system for ingestion time processing

import * as functions from 'firebase-functions';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import * as crypto from 'crypto';
import OpenAI from 'openai';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Initialize OpenAI with config
const getOpenAIClient = () => {
  const key = functions.config().openai.key;
  if (!key) {
    throw new Error('OpenAI API key not configured. Set with: firebase functions:config:set openai.key="your-key"');
  }
  return new OpenAI({ apiKey: key });
};

/**
 * Retry function with exponential backoff for handling rate limits
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // If it's a rate limit error (429), retry with backoff
      if (error.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        functions.logger.warn(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's not a rate limit error or we've exhausted retries, throw
      throw error;
    }
  }
  
  throw lastError!;
}

/**
 * Firestore trigger: Publish to Pub/Sub when templates are created/updated
 */
export const publishTemplateForEmbedding = onDocumentWritten(
  {
    document: 'templates/{id}',
    region: 'us-central1',
  },
  async (event) => {
    const docId = event.params.id;
    
    try {
      functions.logger.info(`Template ${docId} changed, publishing to Pub/Sub`, { templateId: docId });
      
      // Publish message to Pub/Sub topic
      const { PubSub } = await import('@google-cloud/pubsub');
      const pubsub = new PubSub();
      const topic = pubsub.topic('embed-templates');
      
      const message = { id: docId };
      const messageBuffer = Buffer.from(JSON.stringify(message));
      
      await topic.publishMessage({ data: messageBuffer });
      
      functions.logger.info(`Successfully published template ${docId} to embed-templates topic`);
    } catch (error) {
      functions.logger.error(`Failed to publish template ${docId} to Pub/Sub`, { 
        templateId: docId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      // Don't throw - we don't want to fail the document write
    }
  }
);

/**
 * Pub/Sub subscriber: Process template embedding requests
 */
export const embedTemplate = onMessagePublished(
  {
    topic: 'embed-templates',
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 540,
  },
  async (event) => {
    let templateId: string;
    let firestoreWrites = 0;
    
    try {
      // Parse message
      const messageData = event.data.message.data;
      const message = JSON.parse(Buffer.from(messageData, 'base64').toString());
      templateId = message.id;
      
      if (!templateId) {
        throw new Error('No template ID in Pub/Sub message');
      }
      
      functions.logger.info(`Processing embedding for template ${templateId}`);
      
      // Fetch document by ID
      const docRef = db.collection('templates').doc(templateId);
      const snapshot = await docRef.get();
      firestoreWrites++; // Count the read
      
      if (!snapshot.exists) {
        functions.logger.warn(`Template ${templateId} not found, skipping`);
        return;
      }
      
      const data = snapshot.data()!;
      
      // Check if embedding already exists
      if (data.embedding) {
        functions.logger.info(`Template ${templateId} already has embedding, skipping`);
        return;
      }
      
      // Extract and hash text content
      const text = data.text || '';
      if (!text.trim()) {
        functions.logger.warn(`Template ${templateId} has no text content, skipping`);
        return;
      }
      
      const hashedText = crypto
        .createHash('sha256')
        .update(text)
        .digest('hex')
        .slice(0, 512);
      
      functions.logger.info(`Generated hash for template ${templateId}`, {
        templateId,
        textLength: text.length,
        hashLength: hashedText.length
      });
      
      // Generate embedding with retry logic
      const openai = getOpenAIClient();
      
      const embeddingResponse = await retryWithBackoff(async () => {
        return await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: hashedText,
        });
      }, 3, 1000);
      
      // Log token usage
      const totalTokens = embeddingResponse.usage.total_tokens;
      functions.logger.info('Embedding tokens', { 
        templateId,
        tokens: totalTokens,
        model: 'text-embedding-3-small'
      });
      
      // Convert embedding to Float32Array
      const embeddingVector = embeddingResponse.data[0].embedding;
      const float32Embedding = new Float32Array(embeddingVector);
      
      // Write embedding to Firestore
      await docRef.update({
        embedding: Array.from(float32Embedding), // Firestore doesn't support Float32Array directly
        embeddingModel: 'text-embedding-3-small',
        embeddingTokens: totalTokens,
        embeddedAt: new Date(),
        textHash: hashedText,
      });
      firestoreWrites++; // Count the write
      
      functions.logger.info(`Successfully embedded template ${templateId}`, {
        templateId,
        embeddingDimensions: float32Embedding.length,
        tokens: totalTokens,
        firestoreWrites
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      functions.logger.error(`Failed to embed template`, { 
        templateId: templateId || 'unknown',
        error: errorMessage,
        firestoreWrites
      });
      
      // Update document with error status if we have a template ID
      if (templateId) {
        try {
          await db.collection('templates').doc(templateId).update({
            embeddingError: errorMessage,
            embeddingFailedAt: new Date(),
          });
          firestoreWrites++;
        } catch (updateError) {
          functions.logger.error(`Failed to update error status for template ${templateId}`, {
            updateError: updateError instanceof Error ? updateError.message : String(updateError)
          });
        }
      }
      
      // Don't throw - we want to acknowledge the message to prevent infinite retries
      // The error is logged and stored in the document
    } finally {
      // Log final Firestore write count
      functions.logger.info('Firestore write count', { 
        templateId: templateId || 'unknown',
        firestoreWrites 
      });
    }
  }
);

/**
 * Health check function for monitoring
 */
export const embeddingHealthCheck = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    try {
      // Check OpenAI connection
      const openai = getOpenAIClient();
      await openai.models.list();
      
      // Check Firestore connection
      await db.collection('templates').limit(1).get();
      
      // Check Pub/Sub topic exists
      const { PubSub } = await import('@google-cloud/pubsub');
      const pubsub = new PubSub();
      const topic = pubsub.topic('embed-templates');
      const [exists] = await topic.exists();
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          openai: 'connected',
          firestore: 'connected',
          pubsub: exists ? 'topic-exists' : 'topic-missing',
        }
      });
    } catch (error) {
      functions.logger.error('Health check failed', { error });
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

/**
 * Manual trigger function for bulk embedding processing
 */
export const bulkEmbedTemplates = functions
  .region('us-central1')
  .runWith({ memory: '2GB', timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    try {
      // Query templates without embeddings
      const templatesQuery = db.collection('templates')
        .where('embedding', '==', null)
        .limit(100);
      
      const snapshot = await templatesQuery.get();
      
      if (snapshot.empty) {
        res.status(200).json({
          message: 'No templates need embedding',
          count: 0
        });
        return;
      }
      
      // Publish all to Pub/Sub
      const { PubSub } = await import('@google-cloud/pubsub');
      const pubsub = new PubSub();
      const topic = pubsub.topic('embed-templates');
      
      const publishPromises = snapshot.docs.map(doc => {
        const message = { id: doc.id };
        const messageBuffer = Buffer.from(JSON.stringify(message));
        return topic.publishMessage({ data: messageBuffer });
      });
      
      await Promise.all(publishPromises);
      
      functions.logger.info(`Bulk embedding triggered for ${snapshot.size} templates`);
      
      res.status(200).json({
        message: `Triggered embedding for ${snapshot.size} templates`,
        count: snapshot.size,
        templateIds: snapshot.docs.map(doc => doc.id)
      });
      
    } catch (error) {
      functions.logger.error('Bulk embedding trigger failed', { error });
      res.status(500).json({
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });