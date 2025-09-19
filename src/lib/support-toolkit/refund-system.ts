// Automated Refund/Credit System with Audit Trails
// Lazy-load Firestore and Stripe to keep API route bundles slim
let fsModulePromise: Promise<typeof import('firebase/firestore')> | null = null;
async function FS() {
  if (!fsModulePromise) fsModulePromise = import('firebase/firestore');
  return fsModulePromise;
}

async function DB() {
  const { getDb } = await import('@/lib/firebase');
  return getDb();
}

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  reason:
    | 'customer_request'
    | 'technical_issue'
    | 'billing_error'
    | 'fraud_protection'
    | 'goodwill'
    | 'chargeback';
  status: 'pending' | 'approved' | 'processed' | 'failed' | 'rejected';
  requestedBy: {
    type: 'customer' | 'support_agent' | 'system';
    userId?: string;
    agentId?: string;
    name: string;
  };
  approvedBy?: {
    agentId: string;
    name: string;
    timestamp: number;
  };
  processedAt?: number;
  stripeRefundId?: string;
  auditTrail: RefundAuditEvent[];
  metadata: {
    originalPaymentIntent?: string;
    refundMethod: 'original_payment' | 'store_credit' | 'manual_check';
    customerNotes?: string;
    internalNotes?: string;
    relatedTicketId?: string;
    sessionReplayId?: string;
    autoApprovalRules?: string[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface RefundAuditEvent {
  id: string;
  timestamp: number;
  action:
    | 'created'
    | 'approved'
    | 'rejected'
    | 'processed'
    | 'failed'
    | 'cancelled'
    | 'escalated';
  actor: {
    type: 'customer' | 'support_agent' | 'system' | 'admin';
    id: string;
    name: string;
    ip?: string;
  };
  details: string;
  metadata?: Record<string, any>;
  systemData: {
    userAgent?: string;
    sessionId?: string;
    requestId: string;
  };
}

export interface StoreCreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  orderId?: string;
  refundId?: string;
  expiresAt?: number;
  createdAt: number;
  metadata: Record<string, any>;
}

export interface RefundPolicy {
  id: string;
  name: string;
  conditions: {
    timeLimit?: number; // days
    orderStatus?: string[];
    documentTypes?: string[];
    maxAmount?: number;
    customerTier?: string[];
  };
  autoApproval: {
    enabled: boolean;
    maxAmount?: number;
    requiresManagerApproval?: boolean;
  };
  refundMethod: 'original_payment' | 'store_credit' | 'both';
  active: boolean;
}

class RefundSystemError extends Error {
  constructor(
    message: string,
    public code: string,
    public metadata?: Record<string, any>,
  ) {
    super(message);
    this.name = 'RefundSystemError';
  }
}

export class RefundSystem {
  // Create a new refund request
  static async createRefundRequest(
    orderId: string,
    amount: number,
    reason: RefundRequest['reason'],
    requestedBy: RefundRequest['requestedBy'],
    metadata: Partial<RefundRequest['metadata']> = {},
  ): Promise<RefundRequest> {
    try {
      // Validate order exists and get details
      const db = await DB();
      const { getDoc, doc } = await FS();
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (!orderDoc.exists()) {
        throw new RefundSystemError('Order not found', 'ORDER_NOT_FOUND');
      }

      const orderData = orderDoc.data();

      // Validate refund amount
      if (amount > orderData.payment.amount) {
        throw new RefundSystemError(
          'Refund amount exceeds order total',
          'INVALID_AMOUNT',
        );
      }

      // Check for existing refunds
      const existingRefunds = await this.getRefundsByOrder(orderId);
      const totalRefunded = existingRefunds
        .filter((r) => r.status === 'processed')
        .reduce((sum, r) => sum + r.amount, 0);

      if (totalRefunded + amount > orderData.payment.amount) {
        throw new RefundSystemError(
          'Total refunds would exceed order amount',
          'EXCEEDS_ORDER_TOTAL',
        );
      }

      const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const auditEvent: RefundAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        action: 'created',
        actor: requestedBy,
        details: `Refund request created for $${amount} - Reason: ${reason}`,
        systemData: {
          requestId: refundId,
          sessionId: metadata.sessionReplayId,
        },
      };

      const refundRequest: RefundRequest = {
        id: refundId,
        orderId,
        userId: orderData.customer.id,
        amount,
        reason,
        status: 'pending',
        requestedBy,
        auditTrail: [auditEvent],
        metadata: {
          originalPaymentIntent: orderData.payment.stripePaymentIntentId,
          refundMethod: 'original_payment',
          ...metadata,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Check if eligible for auto-approval
      const autoApprovalResult = await this.checkAutoApproval(
        refundRequest,
        orderData,
      );
      if (autoApprovalResult.approved) {
        refundRequest.status = 'approved';
        refundRequest.metadata.autoApprovalRules =
          autoApprovalResult.appliedRules;

        // Add approval audit event
        refundRequest.auditTrail.push({
          id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          action: 'approved',
          actor: {
            type: 'system',
            id: 'auto-approval',
            name: 'Auto-Approval System',
          },
          details: `Auto-approved based on rules: ${autoApprovalResult.appliedRules.join(', ')}`,
          systemData: { requestId: refundId },
        });
      }

      // Save to database
      const { addDoc, collection } = await FS();
      await addDoc(collection(db, 'refundRequests'), refundRequest);

      // If auto-approved, process immediately
      if (refundRequest.status === 'approved') {
        await this.processRefund(refundId);
      }

      return refundRequest;
    } catch (error) {
      if (error instanceof RefundSystemError) throw error;
      throw new RefundSystemError(
        'Failed to create refund request',
        'CREATION_FAILED',
        { error: error.message },
      );
    }
  }

  // Approve a refund request
  static async approveRefund(
    refundId: string,
    approvedBy: { agentId: string; name: string },
    notes?: string,
  ): Promise<RefundRequest> {
    try {
      const db = await DB();
      const { getDoc, doc, updateDoc } = await FS();
      const refundDoc = await getDoc(doc(db, 'refundRequests', refundId));
      if (!refundDoc.exists()) {
        throw new RefundSystemError(
          'Refund request not found',
          'REFUND_NOT_FOUND',
        );
      }

      const refund = refundDoc.data() as RefundRequest;

      if (refund.status !== 'pending') {
        throw new RefundSystemError(
          'Refund is not in pending status',
          'INVALID_STATUS',
        );
      }

      const auditEvent: RefundAuditEvent = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        action: 'approved',
        actor: {
          type: 'support_agent',
          id: approvedBy.agentId,
          name: approvedBy.name,
        },
        details: `Refund approved by ${approvedBy.name}${notes ? ` - Notes: ${notes}` : ''}`,
        systemData: { requestId: refundId },
      };

      const updatedRefund: Partial<RefundRequest> = {
        status: 'approved',
        approvedBy: {
          ...approvedBy,
          timestamp: Date.now(),
        },
        auditTrail: [...refund.auditTrail, auditEvent],
        updatedAt: Date.now(),
      };

      if (notes) {
        updatedRefund.metadata = {
          ...refund.metadata,
          internalNotes: notes,
        };
      }

      await updateDoc(doc(db, 'refundRequests', refundId), updatedRefund);

      // Process the refund
      return await this.processRefund(refundId);
    } catch (error) {
      if (error instanceof RefundSystemError) throw error;
      throw new RefundSystemError(
        'Failed to approve refund',
        'APPROVAL_FAILED',
        { error: error.message },
      );
    }
  }

  // Process an approved refund
  static async processRefund(refundId: string): Promise<RefundRequest> {
    try {
      const db = await DB();
      const { getDoc, doc, updateDoc } = await FS();
      const refundDoc = await getDoc(doc(db, 'refundRequests', refundId));
      if (!refundDoc.exists()) {
        throw new RefundSystemError(
          'Refund request not found',
          'REFUND_NOT_FOUND',
        );
      }

      const refund = refundDoc.data() as RefundRequest;

      if (refund.status !== 'approved') {
        throw new RefundSystemError('Refund is not approved', 'NOT_APPROVED');
      }

      let auditEvent: RefundAuditEvent;
      let updatedRefund: Partial<RefundRequest>;

      try {
        if (refund.metadata.refundMethod === 'store_credit') {
          // Process as store credit
          await this.addStoreCredit(
            refund.userId,
            refund.amount,
            'refund',
            refund.orderId,
            refundId,
          );

          auditEvent = {
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            action: 'processed',
            actor: {
              type: 'system',
              id: 'store-credit',
              name: 'Store Credit System',
            },
            details: `Store credit of $${refund.amount} added to customer account`,
            systemData: { requestId: refundId },
          };

          updatedRefund = {
            status: 'processed',
            processedAt: Date.now(),
            auditTrail: [...refund.auditTrail, auditEvent],
            updatedAt: Date.now(),
          };
        } else {
          // Process via Stripe
          const stripe = getStripeServerClient();
          const stripeRefund = await stripe.refunds.create({
            payment_intent: refund.metadata.originalPaymentIntent!,
            amount: Math.round(refund.amount * 100), // Convert to cents
            reason: this.mapReasonToStripe(refund.reason),
            metadata: {
              refund_id: refundId,
              order_id: refund.orderId,
              requested_by: refund.requestedBy.type,
            },
          });

          auditEvent = {
            id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            action: 'processed',
            actor: {
              type: 'system',
              id: 'stripe',
              name: 'Stripe Payment System',
            },
            details: `Stripe refund processed: ${stripeRefund.id}`,
            metadata: {
              stripeRefundId: stripeRefund.id,
              stripeStatus: stripeRefund.status,
            },
            systemData: { requestId: refundId },
          };

          updatedRefund = {
            status: 'processed',
            processedAt: Date.now(),
            stripeRefundId: stripeRefund.id,
            auditTrail: [...refund.auditTrail, auditEvent],
            updatedAt: Date.now(),
          };
        }

        await updateDoc(doc(db, 'refundRequests', refundId), updatedRefund);

        return { ...refund, ...updatedRefund } as RefundRequest;
      } catch (error) {
        // Handle processing failure
        const failureAuditEvent: RefundAuditEvent = {
          id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          action: 'failed',
          actor: {
            type: 'system',
            id: 'refund-processor',
            name: 'Refund Processing System',
          },
          details: `Refund processing failed: ${error.message}`,
          metadata: { error: error.message },
          systemData: { requestId: refundId },
        };

        await updateDoc(doc(db, 'refundRequests', refundId), {
          status: 'failed',
          auditTrail: [...refund.auditTrail, failureAuditEvent],
          updatedAt: Date.now(),
        });

        throw new RefundSystemError(
          'Refund processing failed',
          'PROCESSING_FAILED',
          { error: error.message },
        );
      }
    } catch (error) {
      if (error instanceof RefundSystemError) throw error;
      throw new RefundSystemError(
        'Failed to process refund',
        'PROCESSING_ERROR',
        { error: error.message },
      );
    }
  }

  // Store credit management
  static async addStoreCredit(
    userId: string,
    amount: number,
    reason: string,
    orderId?: string,
    refundId?: string,
  ): Promise<StoreCreditTransaction> {
    const creditTransaction: StoreCreditTransaction = {
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      amount,
      type: 'credit',
      reason,
      orderId,
      refundId,
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year expiry
      createdAt: Date.now(),
      metadata: {},
    };

    const db = await DB();
    const { addDoc, collection } = await FS();
    await addDoc(collection(db, 'storeCreditTransactions'), creditTransaction);
    return creditTransaction;
  }

  static async getStoreCreditBalance(userId: string): Promise<number> {
    const db = await DB();
    const { query, collection, where, getDocs } = await FS();
    const q = query(
      collection(db, 'storeCreditTransactions'),
      where('userId', '==', userId),
    );

    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(
      (doc) => doc.data() as StoreCreditTransaction,
    );

    const now = Date.now();
    return transactions
      .filter((t) => !t.expiresAt || t.expiresAt > now) // Filter out expired credits
      .reduce((balance, transaction) => {
        return transaction.type === 'credit'
          ? balance + transaction.amount
          : balance - transaction.amount;
      }, 0);
  }

  // Auto-approval logic
  private static async checkAutoApproval(
    refund: RefundRequest,
    orderData: any,
  ): Promise<{ approved: boolean; appliedRules: string[] }> {
    const appliedRules: string[] = [];

    // Rule 1: Small amounts under $10
    if (refund.amount <= 10) {
      appliedRules.push('small_amount_under_10');
    }

    // Rule 2: Technical issues within 24 hours
    if (
      refund.reason === 'technical_issue' &&
      Date.now() - orderData.createdAt < 24 * 60 * 60 * 1000
    ) {
      appliedRules.push('technical_issue_24h');
    }

    // Rule 3: Premium customers with good history
    if (
      orderData.customer.customerSegment === 'premium' &&
      orderData.customer.totalOrders > 5
    ) {
      appliedRules.push('premium_customer_good_history');
    }

    // Rule 4: Billing errors always auto-approved
    if (refund.reason === 'billing_error') {
      appliedRules.push('billing_error_auto_approve');
    }

    return {
      approved: appliedRules.length > 0,
      appliedRules,
    };
  }

  // Utility methods
  private static mapReasonToStripe(reason: RefundRequest['reason']): string {
    const mapping = {
      customer_request: 'requested_by_customer',
      technical_issue: 'requested_by_customer',
      billing_error: 'duplicate',
      fraud_protection: 'fraudulent',
      goodwill: 'requested_by_customer',
      chargeback: 'fraudulent',
    };
    return mapping[reason] || 'requested_by_customer';
  }

  // Query methods
  static async getRefundsByOrder(orderId: string): Promise<RefundRequest[]> {
    const db = await DB();
    const { query, collection, where, getDocs } = await FS();
    const q = query(
      collection(db, 'refundRequests'),
      where('orderId', '==', orderId),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as RefundRequest,
    );
  }

  static async getRefundsByUser(userId: string): Promise<RefundRequest[]> {
    const db = await DB();
    const { query, collection, where, getDocs } = await FS();
    const q = query(
      collection(db, 'refundRequests'),
      where('userId', '==', userId),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as RefundRequest,
    );
  }

  static async getPendingRefunds(): Promise<RefundRequest[]> {
    const db = await DB();
    const { query, collection, where, getDocs } = await FS();
    const q = query(
      collection(db, 'refundRequests'),
      where('status', '==', 'pending'),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as RefundRequest,
    );
  }
}
