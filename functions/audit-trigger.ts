import { onDocumentWritten, Change, DocumentSnapshot } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';
import { defineSecret } from 'firebase-functions/params';
import * as crypto from 'crypto';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Define secrets for audit integrity
const auditSigningKey = defineSecret('AUDIT_SIGNING_KEY');

interface AuditEvent {
  id: string;
  timestamp: FieldValue;
  sequence: number;
  previousHash: string;
  currentHash: string;
  
  // Event metadata
  eventType: 'document_created' | 'document_updated' | 'document_deleted' | 
            'user_action' | 'system_change' | 'policy_update' | 'compliance_event';
  
  // Source document information
  source: {
    collection: string;
    documentId: string;
    path: string;
  };
  
  // Change details
  change: {
    type: 'create' | 'update' | 'delete';
    before?: any;
    after?: any;
    diff?: ChangeDetail[];
  };
  
  // Actor information (if available)
  actor?: {
    uid?: string;
    email?: string;
    role?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  
  // Technical context
  technical: {
    functionName: string;
    functionVersion: string;
    executionId: string;
    region: string;
    timestamp: string;
    checksumBefore?: string;
    checksumAfter?: string;
  };
  
  // Compliance context
  compliance: {
    frameworks: string[];
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    retentionPeriod: number;
    legalBasis?: string;
  };
  
  // Integrity verification
  integrity: {
    signature: string;
    witnessHash: string;
    merkleRoot?: string;
    immutable: boolean;
  };
}

interface ChangeDetail {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'addition' | 'modification' | 'deletion';
  diff?: string;
}

// Collections to monitor for audit events
const MONITORED_COLLECTIONS = [
  'users',
  'documents', 
  'orders',
  'payments',
  'templates',
  'policies',
  'feature_flags',
  'settings',
  'support_tickets',
  'audit_config'
];

// Collections that should not be audited to prevent infinite loops
const EXCLUDED_COLLECTIONS = [
  'audit_events',
  'audit_chains',
  'temp_data',
  'cache',
  'sessions'
];

export const auditTrailTrigger = onDocumentWritten(
  {
    document: '{collectionId}/{documentId}',
    secrets: [auditSigningKey],
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  async (event) => {
    const { data, params } = event;
    const collectionId = params.collectionId;
    const documentId = params.documentId;
    
    // Skip excluded collections
    if (EXCLUDED_COLLECTIONS.includes(collectionId)) {
      return;
    }
    
    // Only audit monitored collections or all if not specified
    if (MONITORED_COLLECTIONS.length > 0 && !MONITORED_COLLECTIONS.includes(collectionId)) {
      logger.debug(`Skipping audit for collection: ${collectionId}`);
      return;
    }
    
    try {
      logger.info(`Audit trigger fired for ${collectionId}/${documentId}`);
      
      const auditEvent = await createAuditEvent(data, collectionId, documentId, event);
      
      // Store audit event with retry logic
      await storeAuditEventWithRetry(auditEvent);
      
      logger.info(`Audit event stored successfully for ${collectionId}/${documentId}`);
      
    } catch (error) {
      logger.error('Failed to process audit event:', error);
      
      // Store error event for compliance
      await storeErrorEvent(error, collectionId, documentId, event);
    }
  }
);

async function createAuditEvent(
  change: Change<DocumentSnapshot> | undefined,
  collectionId: string,
  documentId: string,
  event: any
): Promise<AuditEvent> {
  const before = change?.before?.exists ? change.before.data() : null;
  const after = change?.after?.exists ? change.after.data() : null;
  
  // Determine change type
  let changeType: 'create' | 'update' | 'delete';
  if (!before && after) {
    changeType = 'create';
  } else if (before && !after) {
    changeType = 'delete';
  } else {
    changeType = 'update';
  }
  
  // Generate change diff
  const diff = generateDiff(before, after);
  
  // Get current audit sequence
  const sequence = await getNextAuditSequence();
  
  // Get previous audit event hash for chaining
  const previousHash = await getPreviousAuditHash();
  
  // Classify data based on collection and content
  const dataClassification = classifyData(collectionId, after || before);
  
  // Determine compliance frameworks
  const complianceFrameworks = getComplianceFrameworks(collectionId, dataClassification);
  
  // Create audit event
  const auditEvent: Omit<AuditEvent, 'currentHash' | 'integrity'> = {
    id: generateAuditId(),
    timestamp: FieldValue.serverTimestamp(),
    sequence,
    previousHash,
    
    eventType: mapCollectionToEventType(collectionId, changeType),
    
    source: {
      collection: collectionId,
      documentId: documentId,
      path: `${collectionId}/${documentId}`,
    },
    
    change: {
      type: changeType,
      before: before ? sanitizeData(before, dataClassification) : undefined,
      after: after ? sanitizeData(after, dataClassification) : undefined,
      diff,
    },
    
    actor: extractActorInfo(after || before),
    
    technical: {
      functionName: 'auditTrailTrigger',
      functionVersion: '1.0.0',
      executionId: event.id || 'unknown',
      region: 'us-central1',
      timestamp: new Date().toISOString(),
      checksumBefore: before ? calculateChecksum(before) : undefined,
      checksumAfter: after ? calculateChecksum(after) : undefined,
    },
    
    compliance: {
      frameworks: complianceFrameworks,
      dataClassification,
      retentionPeriod: getRetentionPeriod(collectionId, dataClassification),
      legalBasis: getLegalBasis(collectionId, changeType),
    },
  };
  
  // Calculate hash and signature for integrity
  const eventHash = calculateAuditHash(auditEvent);
  const signature = signAuditEvent(auditEvent, eventHash);
  const witnessHash = generateWitnessHash(eventHash);
  
  return {
    ...auditEvent,
    currentHash: eventHash,
    integrity: {
      signature,
      witnessHash,
      immutable: true,
    },
  };
}

function generateDiff(before: any, after: any): ChangeDetail[] {
  const changes: ChangeDetail[] = [];
  
  if (!before && !after) return changes;
  
  const beforeKeys = Object.keys(before || {});
  const afterKeys = Object.keys(after || {});
  const allKeys = [...new Set([...beforeKeys, ...afterKeys])];
  
  for (const key of allKeys) {
    const oldValue = before?.[key];
    const newValue = after?.[key];
    
    if (oldValue !== newValue) {
      let changeType: 'addition' | 'modification' | 'deletion';
      
      if (oldValue === undefined) {
        changeType = 'addition';
      } else if (newValue === undefined) {
        changeType = 'deletion';
      } else {
        changeType = 'modification';
      }
      
      changes.push({
        field: key,
        oldValue: sanitizeValue(oldValue),
        newValue: sanitizeValue(newValue),
        changeType,
        diff: generateFieldDiff(oldValue, newValue),
      });
    }
  }
  
  return changes;
}

function generateFieldDiff(oldValue: any, newValue: any): string {
  if (typeof oldValue === 'string' && typeof newValue === 'string') {
    // Simple line-by-line diff for strings
    const oldLines = oldValue.split('\n');
    const newLines = newValue.split('\n');
    
    let diff = '';
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine !== newLine) {
        if (oldLine) diff += `- ${oldLine}\n`;
        if (newLine) diff += `+ ${newLine}\n`;
      }
    }
    
    return diff;
  }
  
  return `- ${JSON.stringify(oldValue)}\n+ ${JSON.stringify(newValue)}`;
}

async function getNextAuditSequence(): Promise<number> {
  try {
    const counterRef = db.collection('audit_metadata').doc('sequence_counter');
    
    return db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      
      let currentSequence = 0;
      if (counterDoc.exists) {
        currentSequence = counterDoc.data()?.sequence || 0;
      }
      
      const nextSequence = currentSequence + 1;
      
      transaction.set(counterRef, {
        sequence: nextSequence,
        lastUpdated: FieldValue.serverTimestamp(),
      }, { merge: true });
      
      return nextSequence;
    });
  } catch (error) {
    logger.error('Failed to get next audit sequence:', error);
    return Date.now(); // Fallback to timestamp
  }
}

async function getPreviousAuditHash(): Promise<string> {
  try {
    const lastAuditEvent = await db
      .collection('audit_events')
      .orderBy('sequence', 'desc')
      .limit(1)
      .get();
    
    if (!lastAuditEvent.empty) {
      return lastAuditEvent.docs[0].data().currentHash;
    }
    
    return '0'.repeat(64); // Genesis hash
  } catch (error) {
    logger.error('Failed to get previous audit hash:', error);
    return '0'.repeat(64);
  }
}

function classifyData(collectionId: string, data: any): AuditEvent['compliance']['dataClassification'] {
  // Classify based on collection and data content
  const sensitiveCollections = ['users', 'payments', 'orders'];
  const internalCollections = ['templates', 'policies', 'settings'];
  const publicCollections = ['documents'];
  
  if (sensitiveCollections.includes(collectionId)) {
    return 'confidential';
  }
  
  if (internalCollections.includes(collectionId)) {
    return 'internal';
  }
  
  if (publicCollections.includes(collectionId)) {
    return 'public';
  }
  
  // Check data content for sensitive information
  if (data && typeof data === 'object') {
    const sensitiveFields = ['email', 'phone', 'ssn', 'payment', 'credit', 'bank'];
    const dataString = JSON.stringify(data).toLowerCase();
    
    if (sensitiveFields.some(field => dataString.includes(field))) {
      return 'confidential';
    }
  }
  
  return 'internal';
}

function getComplianceFrameworks(collectionId: string, classification: string): string[] {
  const frameworks = ['sox']; // All events are SOX audited
  
  if (classification === 'confidential') {
    frameworks.push('gdpr', 'ccpa');
  }
  
  if (['users', 'payments', 'orders'].includes(collectionId)) {
    frameworks.push('pci_dss');
  }
  
  return frameworks;
}

function mapCollectionToEventType(collectionId: string, changeType: string): AuditEvent['eventType'] {
  if (collectionId === 'users') return 'user_action';
  if (collectionId === 'policies') return 'policy_update';
  if (collectionId === 'feature_flags') return 'system_change';
  if (['payments', 'orders'].includes(collectionId)) return 'compliance_event';
  
  return changeType === 'create' ? 'document_created' : 
         changeType === 'update' ? 'document_updated' : 'document_deleted';
}

function extractActorInfo(data: any): AuditEvent['actor'] | undefined {
  if (!data) return undefined;
  
  return {
    uid: data.userId || data.createdBy || data.uid,
    email: data.userEmail || data.email,
    role: data.userRole || data.role,
    ipAddress: data.ipAddress || 'unknown',
    userAgent: data.userAgent || 'unknown',
  };
}

function sanitizeData(data: any, classification: string): any {
  if (classification === 'confidential') {
    // Remove or hash sensitive fields
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'ssn', 'credit_card', 'bank_account'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
  
  return data;
}

function sanitizeValue(value: any): any {
  if (typeof value === 'string' && value.length > 1000) {
    return value.substring(0, 1000) + '...[TRUNCATED]';
  }
  return value;
}

function getRetentionPeriod(collectionId: string, classification: string): number {
  // Return retention period in days
  if (classification === 'confidential') return 2555; // 7 years
  if (['payments', 'orders'].includes(collectionId)) return 2555; // 7 years for financial
  return 1095; // 3 years for others
}

function getLegalBasis(collectionId: string, changeType: string): string | undefined {
  if (['users', 'payments', 'orders'].includes(collectionId)) {
    return 'contract'; // GDPR legal basis
  }
  return undefined;
}

function generateAuditId(): string {
  return `audit_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

function calculateChecksum(data: any): string {
  return crypto.createHash('sha256')
    .update(JSON.stringify(data, Object.keys(data).sort()))
    .digest('hex');
}

function calculateAuditHash(event: Omit<AuditEvent, 'currentHash' | 'integrity'>): string {
  const eventString = JSON.stringify(event, Object.keys(event).sort());
  return crypto.createHash('sha256').update(eventString).digest('hex');
}

function signAuditEvent(event: any, hash: string): string {
  const signingKey = auditSigningKey.value() || 'default-signing-key';
  return crypto.createHmac('sha256', signingKey).update(hash).digest('hex');
}

function generateWitnessHash(eventHash: string): string {
  return crypto.createHash('sha256')
    .update(eventHash + Date.now().toString())
    .digest('hex');
}

async function storeAuditEventWithRetry(auditEvent: AuditEvent, maxRetries = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await db.collection('audit_events').doc(auditEvent.id).set(auditEvent);
      return; // Success
    } catch (error) {
      logger.warn(`Audit storage attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

async function storeErrorEvent(
  error: any, 
  collectionId: string, 
  documentId: string, 
  event: any
): Promise<void> {
  try {
    const errorEvent = {
      id: generateAuditId(),
      timestamp: FieldValue.serverTimestamp(),
      eventType: 'system_error',
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      source: {
        collection: collectionId,
        documentId: documentId,
        functionName: 'auditTrailTrigger',
      },
      technical: {
        executionId: event.id || 'unknown',
        timestamp: new Date().toISOString(),
      },
    };
    
    await db.collection('audit_errors').doc(errorEvent.id).set(errorEvent);
    logger.info(`Error event stored for failed audit: ${errorEvent.id}`);
  } catch (storeError) {
    logger.error('Failed to store error event:', storeError);
  }
}