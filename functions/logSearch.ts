// functions/logSearch.ts
// HTTPS callable function to log zero-result queries with rate limiting and BigQuery integration

import * as functions from 'firebase-functions';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { BigQuery } from '@google-cloud/bigquery';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
try {
  initializeApp();
} catch (error) {
  // App already initialized
}

const db = getFirestore();
const bigquery = new BigQuery();

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 zero-result logs per minute per user
// BigQuery configuration
const DATASET_ID = 'search_analytics';
const TABLE_ID = 'search_zero_results';
interface TokenBucket {
  tokens: number;
  lastRefill: number;
  windowStart: number;
}

interface ZeroResultLogRequest {
  query: string;
  searchType?: 'keyword' | 'semantic' | 'hybrid';
  filters?: {
    negatives?: string[];
    phrases?: string[];
    categories?: string[];
  };
  metadata?: {
    locale?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

interface BigQueryRow {
  uid: string;
  query: string;
  search_type: string;
  filters_negatives: string[];
  filters_phrases: string[];
  filters_categories: string[];
  locale: string;
  user_agent: string;
  session_id: string;
  timestamp: string;
  inserted_at: string;
}

/**
 * Get or create token bucket for rate limiting
 */
async function getTokenBucket(uid: string): Promise<TokenBucket> {
  const bucketRef = db.collection('rate_limits').doc(`search_logs_${uid}`);
  const now = Date.now();
  
  try {
    const bucketDoc = await bucketRef.get();
    
    if (!bucketDoc.exists) {
      // Create new bucket
      const newBucket: TokenBucket = {
        tokens: MAX_REQUESTS_PER_WINDOW,
        lastRefill: now,
        windowStart: now,
      };
      
      await bucketRef.set({
        ...newBucket,
        expiresAt: new Date(now + RATE_LIMIT_WINDOW_MS * 2), // Auto-cleanup after 2 windows
      });
      
      return newBucket;
    }
    
    const bucket = bucketDoc.data() as TokenBucket;
    
    // Reset window if needed
    if (now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
      bucket.tokens = MAX_REQUESTS_PER_WINDOW;
      bucket.windowStart = now;
      bucket.lastRefill = now;
    } else {
      // Refill tokens based on time passed
      const timePassed = now - bucket.lastRefill;
      const tokensToAdd = Math.floor(timePassed / (RATE_LIMIT_WINDOW_MS / MAX_REQUESTS_PER_WINDOW));
      
      if (tokensToAdd > 0) {
        bucket.tokens = Math.min(MAX_REQUESTS_PER_WINDOW, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
      }
    }
    
    return bucket;
  } catch (error) {
    functions.logger.error('Failed to get token bucket', { uid, error });
    // Return permissive bucket on error
    return {
      tokens: MAX_REQUESTS_PER_WINDOW,
      lastRefill: now,
      windowStart: now,
    };
  }
}

/**
 * Update token bucket after consuming a token
 */
async function updateTokenBucket(uid: string, bucket: TokenBucket): Promise<void> {
  const bucketRef = db.collection('rate_limits').doc(`search_logs_${uid}`);
  
  try {
    await bucketRef.set({
      ...bucket,
      expiresAt: new Date(Date.now() + RATE_LIMIT_WINDOW_MS * 2),
    });
  } catch (error) {
    functions.logger.error('Failed to update token bucket', { uid, error });
    // Non-critical error, don't throw
  }
}

/**
 * Retry function with exponential backoff
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
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        functions.logger.warn(`Retry attempt ${attempt + 1}/${maxRetries + 1} in ${delay}ms`, { error: error.message });
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError!;
}

/**
 * Insert zero-result query data into BigQuery
 */
async function insertIntoBigQuery(data: BigQueryRow): Promise<void> {
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLE_ID);
  
  // Ensure table exists
  const [tableExists] = await table.exists();
  if (!tableExists) {
    functions.logger.info('Creating BigQuery table', { dataset: DATASET_ID, table: TABLE_ID });
    
    await table.create({
      schema: [
        { name: 'uid', type: 'STRING', mode: 'REQUIRED' },
        { name: 'query', type: 'STRING', mode: 'REQUIRED' },
        { name: 'search_type', type: 'STRING', mode: 'NULLABLE' },
        { name: 'filters_negatives', type: 'STRING', mode: 'REPEATED' },
        { name: 'filters_phrases', type: 'STRING', mode: 'REPEATED' },
        { name: 'filters_categories', type: 'STRING', mode: 'REPEATED' },
        { name: 'locale', type: 'STRING', mode: 'NULLABLE' },
        { name: 'user_agent', type: 'STRING', mode: 'NULLABLE' },
        { name: 'session_id', type: 'STRING', mode: 'NULLABLE' },
        { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
        { name: 'inserted_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      ],
      timePartitioning: {
        type: 'DAY',
        field: 'timestamp',
      },
      clustering: {
        fields: ['uid', 'search_type'],
      },
    });
  }
  
  // Insert data with retry
  await retryWithBackoff(async () => {
    await table.insert([data]);
    functions.logger.info('Successfully inserted zero-result query into BigQuery', {
      uid: data.uid,
      query: data.query,
      search_type: data.search_type,
    });
  }, 3, 1000);
}

/**
 * Validate request data
 */
function validateRequest(data: any): ZeroResultLogRequest {
  if (!data || typeof data !== 'object') {
    throw new HttpsError('invalid-argument', 'Request data must be an object');
  }
  
  if (!data.query || typeof data.query !== 'string') {
    throw new HttpsError('invalid-argument', 'Query is required and must be a string');
  }
  
  if (data.query.length > 1000) {
    throw new HttpsError('invalid-argument', 'Query too long (max 1000 characters)');
  }
  
  if (data.searchType && !['keyword', 'semantic', 'hybrid'].includes(data.searchType)) {
    throw new HttpsError('invalid-argument', 'Invalid search type');
  }
  
  return {
    query: data.query.trim(),
    searchType: data.searchType || 'keyword',
    filters: {
      negatives: Array.isArray(data.filters?.negatives) ? data.filters.negatives.slice(0, 10) : [],
      phrases: Array.isArray(data.filters?.phrases) ? data.filters.phrases.slice(0, 10) : [],
      categories: Array.isArray(data.filters?.categories) ? data.filters.categories.slice(0, 10) : [],
    },
    metadata: {
      locale: typeof data.metadata?.locale === 'string' ? data.metadata.locale : 'en',
      userAgent: typeof data.metadata?.userAgent === 'string' ? data.metadata.userAgent.slice(0, 500) : '',
      sessionId: typeof data.metadata?.sessionId === 'string' ? data.metadata.sessionId.slice(0, 100) : '',
    },
  };
}

/**
 * HTTPS callable function to log zero-result queries
 * 
 * @param request - Zero-result query data
 * @param context - Firebase function context
 * @returns Success confirmation
 */
export const logZeroResultQuery = onCall(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 30,
    maxInstances: 100,
  },
  async (request) => {
    const startTime = Date.now();
    
    try {
      // Authentication check
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Function must be called by authenticated user');
      }
      
      const uid = request.auth.uid;
      const requestData = validateRequest(request.data);
      
      functions.logger.info('Processing zero-result query log', {
        uid,
        query: requestData.query,
        searchType: requestData.searchType,
      });
      
      // Rate limiting check
      const bucket = await getTokenBucket(uid);
      
      if (bucket.tokens <= 0) {
        const resetTime = bucket.windowStart + RATE_LIMIT_WINDOW_MS;
        const waitTime = Math.max(0, resetTime - Date.now());
        
        functions.logger.warn('Rate limit exceeded for zero-result logging', {
          uid,
          waitTime,
          query: requestData.query,
        });
        
        throw new HttpsError('resource-exhausted', `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`);
      }
      
      // Consume token
      bucket.tokens -= 1;
      await updateTokenBucket(uid, bucket);
      
      // Prepare BigQuery data
      const now = new Date();
      const bigQueryRow: BigQueryRow = {
        uid,
        query: requestData.query,
        search_type: requestData.searchType || 'keyword',
        filters_negatives: requestData.filters?.negatives || [],
        filters_phrases: requestData.filters?.phrases || [],
        filters_categories: requestData.filters?.categories || [],
        locale: requestData.metadata?.locale || 'en',
        user_agent: requestData.metadata?.userAgent || '',
        session_id: requestData.metadata?.sessionId || '',
        timestamp: now.toISOString(),
        inserted_at: now.toISOString(),
      };
      
      // Insert into BigQuery
      await insertIntoBigQuery(bigQueryRow);
      
      const duration = Date.now() - startTime;
      
      functions.logger.info('Zero-result query logged successfully', {
        uid,
        query: requestData.query,
        duration,
        tokensRemaining: bucket.tokens,
      });
      
      return {
        success: true,
        message: 'Zero-result query logged successfully',
        tokensRemaining: bucket.tokens,
        resetTime: bucket.windowStart + RATE_LIMIT_WINDOW_MS,
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (error instanceof HttpsError) {
        functions.logger.warn('Zero-result query logging failed with known error', {
          uid: request.auth?.uid || 'unknown',
          error: error.message,
          code: error.code,
          duration,
        });
        throw error;
      }
      
      functions.logger.error('Zero-result query logging failed with unexpected error', {
        uid: request.auth?.uid || 'unknown',
        error: error instanceof Error ? error.message : String(error),
        duration,
      });
      
      throw new HttpsError('internal', 'Failed to log zero-result query');
    }
  }
);

/**
 * HTTPS function to get user's current rate limit status
 */
export const getRateLimitStatus = onCall(
  {
    region: 'us-central1',
    memory: '128MiB',
    timeoutSeconds: 10,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Function must be called by authenticated user');
    }
    
    const uid = request.auth.uid;
    const bucket = await getTokenBucket(uid);
    
    return {
      tokensRemaining: bucket.tokens,
      maxTokens: MAX_REQUESTS_PER_WINDOW,
      windowStartTime: bucket.windowStart,
      resetTime: bucket.windowStart + RATE_LIMIT_WINDOW_MS,
      rateLimitWindow: RATE_LIMIT_WINDOW_MS,
    };
  }
);

export default logZeroResultQuery;