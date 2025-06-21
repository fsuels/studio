// Advanced Payment Processing System
// Comprehensive billing and subscription management for 123LegalDoc

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal' | 'apple_pay' | 'google_pay';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  customerId: string;
  metadata: {
    fingerprint: string;
    country: string;
    funding: string;
  };
}

interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status:
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'trialing'
    | 'incomplete'
    | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  canceledAt?: string;
  cancelAtPeriodEnd: boolean;
  metadata: {
    documentsIncluded: number;
    features: string[];
    billingCycle: 'monthly' | 'annual';
  };
  pricing: {
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
}

interface Invoice {
  id: string;
  customerId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: string;
  paidAt?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitAmount: number;
    totalAmount: number;
    metadata?: any;
  }>;
  tax: {
    amount: number;
    rate: number;
    jurisdiction: string;
  };
  discount?: {
    amount: number;
    code: string;
    type: 'percentage' | 'fixed';
  };
}

interface UsageRecord {
  id: string;
  customerId: string;
  subscriptionId: string;
  timestamp: string;
  quantity: number;
  action:
    | 'document_generated'
    | 'signature_sent'
    | 'ai_analysis'
    | 'translation'
    | 'storage_used';
  metadata: {
    documentId?: string;
    documentType?: string;
    language?: string;
    fileSize?: number;
  };
}

export class PaymentProcessor {
  private static instance: PaymentProcessor;
  private subscriptions: Map<string, Subscription> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private paymentMethods: Map<string, PaymentMethod[]> = new Map();
  private usageRecords: Map<string, UsageRecord[]> = new Map();
  private billingPlans: Map<string, any> = new Map();

  constructor() {
    this.initializeBillingPlans();
  }

  static getInstance(): PaymentProcessor {
    if (!PaymentProcessor.instance) {
      PaymentProcessor.instance = new PaymentProcessor();
    }
    return PaymentProcessor.instance;
  }

  // Initialize billing plans
  private initializeBillingPlans() {
    this.billingPlans.set('starter', {
      id: 'starter',
      name: 'Starter Plan',
      price: 29,
      currency: 'USD',
      interval: 'month',
      features: [
        '5 documents per month',
        'Basic templates',
        'Email support',
        'PDF download',
      ],
      limits: {
        documentsPerMonth: 5,
        storageGB: 1,
        aiAnalysis: 10,
        signatures: 5,
      },
    });

    this.billingPlans.set('professional', {
      id: 'professional',
      name: 'Professional Plan',
      price: 79,
      currency: 'USD',
      interval: 'month',
      features: [
        '25 documents per month',
        'All templates',
        'Priority support',
        'PDF + Word download',
        'E-signatures included',
        'AI document analysis',
      ],
      limits: {
        documentsPerMonth: 25,
        storageGB: 10,
        aiAnalysis: 100,
        signatures: 25,
      },
    });

    this.billingPlans.set('business', {
      id: 'business',
      name: 'Business Plan',
      price: 199,
      currency: 'USD',
      interval: 'month',
      features: [
        'Unlimited documents',
        'Team collaboration',
        'API access',
        'Custom templates',
        'Phone support',
        'Advanced AI features',
        'Multi-language support',
      ],
      limits: {
        documentsPerMonth: -1, // unlimited
        storageGB: 100,
        aiAnalysis: -1, // unlimited
        signatures: -1, // unlimited
      },
    });

    this.billingPlans.set('enterprise', {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 499,
      currency: 'USD',
      interval: 'month',
      features: [
        'Everything in Business',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment',
      ],
      limits: {
        documentsPerMonth: -1,
        storageGB: -1,
        aiAnalysis: -1,
        signatures: -1,
      },
    });
  }

  // Create subscription
  async createSubscription(
    customerId: string,
    planId: string,
    paymentMethodId: string,
    trialDays?: number,
  ): Promise<Subscription> {
    console.log(`💳 Creating subscription for customer ${customerId}`);

    const plan = this.billingPlans.get(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    const subscriptionId = this.generateSubscriptionId();
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    let trialEnd: string | undefined;
    if (trialDays) {
      const trial = new Date(now);
      trial.setDate(trial.getDate() + trialDays);
      trialEnd = trial.toISOString();
    }

    const subscription: Subscription = {
      id: subscriptionId,
      customerId,
      planId,
      status: trialDays ? 'trialing' : 'active',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      trialEnd,
      cancelAtPeriodEnd: false,
      metadata: {
        documentsIncluded: plan.limits.documentsPerMonth,
        features: plan.features,
        billingCycle: plan.interval === 'month' ? 'monthly' : 'annual',
      },
      pricing: {
        amount: plan.price,
        currency: plan.currency,
        interval: plan.interval,
      },
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Create first invoice if not in trial
    if (!trialDays) {
      await this.createInvoice(customerId, subscriptionId, plan.price);
    }

    console.log(`✅ Subscription created: ${subscriptionId}`);
    return subscription;
  }

  // Create invoice
  async createInvoice(
    customerId: string,
    subscriptionId?: string,
    amount?: number,
    items?: any[],
  ): Promise<Invoice> {
    console.log(`📄 Creating invoice for customer ${customerId}`);

    const invoiceId = this.generateInvoiceId();
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms

    let invoiceAmount = amount || 0;
    let invoiceItems = items || [];

    // If subscription invoice, get details from subscription
    if (subscriptionId && !items) {
      const subscription = this.subscriptions.get(subscriptionId);
      if (subscription) {
        const plan = this.billingPlans.get(subscription.planId);
        if (plan) {
          invoiceAmount = plan.price;
          invoiceItems = [
            {
              description: `${plan.name} - ${plan.interval}ly subscription`,
              quantity: 1,
              unitAmount: plan.price,
              totalAmount: plan.price,
              metadata: { planId: subscription.planId },
            },
          ];
        }
      }
    }

    // Calculate tax (simplified - 8.5% sales tax)
    const taxRate = 0.085;
    const taxAmount = invoiceAmount * taxRate;
    const totalAmount = invoiceAmount + taxAmount;

    const invoice: Invoice = {
      id: invoiceId,
      customerId,
      subscriptionId,
      amount: totalAmount,
      currency: 'USD',
      status: 'open',
      dueDate: dueDate.toISOString(),
      items: invoiceItems,
      tax: {
        amount: taxAmount,
        rate: taxRate,
        jurisdiction: 'US',
      },
    };

    this.invoices.set(invoiceId, invoice);

    console.log(`✅ Invoice created: ${invoiceId} for $${totalAmount}`);
    return invoice;
  }

  // Process payment
  async processPayment(
    invoiceId: string,
    paymentMethodId: string,
    metadata?: any,
  ): Promise<{ success: boolean; transactionId: string; error?: string }> {
    console.log(`💰 Processing payment for invoice ${invoiceId}`);

    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    if (invoice.status !== 'open') {
      throw new Error(
        `Invoice ${invoiceId} is not payable (status: ${invoice.status})`,
      );
    }

    // Simulate Stripe payment processing
    const paymentResult = await this.simulateStripePayment(
      invoice.amount,
      invoice.currency,
      paymentMethodId,
    );

    if (paymentResult.success) {
      // Mark invoice as paid
      invoice.status = 'paid';
      invoice.paidAt = new Date().toISOString();

      // Update subscription status if applicable
      if (invoice.subscriptionId) {
        const subscription = this.subscriptions.get(invoice.subscriptionId);
        if (subscription && subscription.status === 'past_due') {
          subscription.status = 'active';
        }
      }

      console.log(`✅ Payment successful: ${paymentResult.transactionId}`);
    } else {
      console.log(`❌ Payment failed: ${paymentResult.error}`);
    }

    return paymentResult;
  }

  // Track usage for billing
  async trackUsage(
    customerId: string,
    action: UsageRecord['action'],
    quantity: number = 1,
    metadata?: any,
  ): Promise<void> {
    const subscription = this.getActiveSubscription(customerId);
    if (!subscription) {
      throw new Error(`No active subscription for customer ${customerId}`);
    }

    const usageRecord: UsageRecord = {
      id: this.generateUsageId(),
      customerId,
      subscriptionId: subscription.id,
      timestamp: new Date().toISOString(),
      quantity,
      action,
      metadata: metadata || {},
    };

    const customerUsage = this.usageRecords.get(customerId) || [];
    customerUsage.push(usageRecord);
    this.usageRecords.set(customerId, customerUsage);

    // Check if usage exceeds plan limits
    await this.checkUsageLimits(customerId, action);

    console.log(
      `📊 Usage tracked: ${action} (${quantity}) for customer ${customerId}`,
    );
  }

  // Check usage limits
  private async checkUsageLimits(
    customerId: string,
    action: string,
  ): Promise<void> {
    const subscription = this.getActiveSubscription(customerId);
    if (!subscription) return;

    const plan = this.billingPlans.get(subscription.planId);
    if (!plan) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyUsage = this.getMonthlyUsage(customerId, currentMonth);

    // Check document generation limit
    if (action === 'document_generated' && plan.limits.documentsPerMonth > 0) {
      const documentCount = monthlyUsage.filter(
        (u) => u.action === 'document_generated',
      ).length;
      if (documentCount >= plan.limits.documentsPerMonth) {
        console.log(`⚠️ Document limit reached for customer ${customerId}`);
        // Could trigger upgrade prompt or block further generation
      }
    }

    // Check AI analysis limit
    if (action === 'ai_analysis' && plan.limits.aiAnalysis > 0) {
      const analysisCount = monthlyUsage.filter(
        (u) => u.action === 'ai_analysis',
      ).length;
      if (analysisCount >= plan.limits.aiAnalysis) {
        console.log(`⚠️ AI analysis limit reached for customer ${customerId}`);
      }
    }
  }

  // Get monthly usage
  private getMonthlyUsage(customerId: string, month: string): UsageRecord[] {
    const allUsage = this.usageRecords.get(customerId) || [];
    return allUsage.filter((record) => record.timestamp.startsWith(month));
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true,
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    if (cancelAtPeriodEnd) {
      subscription.cancelAtPeriodEnd = true;
      console.log(
        `📅 Subscription ${subscriptionId} will cancel at period end`,
      );
    } else {
      subscription.status = 'canceled';
      subscription.canceledAt = new Date().toISOString();
      console.log(`❌ Subscription ${subscriptionId} canceled immediately`);
    }

    return subscription;
  }

  // Add payment method
  async addPaymentMethod(
    customerId: string,
    type: PaymentMethod['type'],
    details: any,
  ): Promise<PaymentMethod> {
    const paymentMethodId = this.generatePaymentMethodId();

    const paymentMethod: PaymentMethod = {
      id: paymentMethodId,
      type,
      last4: details.last4 || '0000',
      brand: details.brand,
      expiryMonth: details.expiryMonth,
      expiryYear: details.expiryYear,
      isDefault: false,
      customerId,
      metadata: {
        fingerprint: this.generateFingerprint(),
        country: details.country || 'US',
        funding: details.funding || 'credit',
      },
    };

    const customerMethods = this.paymentMethods.get(customerId) || [];

    // If this is the first payment method, make it default
    if (customerMethods.length === 0) {
      paymentMethod.isDefault = true;
    }

    customerMethods.push(paymentMethod);
    this.paymentMethods.set(customerId, customerMethods);

    console.log(`💳 Payment method added for customer ${customerId}`);
    return paymentMethod;
  }

  // Get active subscription
  getActiveSubscription(customerId: string): Subscription | undefined {
    return Array.from(this.subscriptions.values()).find(
      (sub) =>
        sub.customerId === customerId &&
        ['active', 'trialing'].includes(sub.status),
    );
  }

  // Get customer invoices
  getCustomerInvoices(customerId: string): Invoice[] {
    return Array.from(this.invoices.values())
      .filter((invoice) => invoice.customerId === customerId)
      .sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      );
  }

  // Get usage analytics
  getUsageAnalytics(
    customerId: string,
    timeframe: 'month' | 'quarter' | 'year' = 'month',
  ): {
    period: string;
    documentsGenerated: number;
    signaturesProcessed: number;
    aiAnalyses: number;
    totalUsage: number;
    projectedCosts: number;
  } {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const usage = this.usageRecords.get(customerId) || [];
    const periodUsage = usage.filter(
      (record) => new Date(record.timestamp) >= startDate,
    );

    const documentsGenerated = periodUsage.filter(
      (r) => r.action === 'document_generated',
    ).length;
    const signaturesProcessed = periodUsage.filter(
      (r) => r.action === 'signature_sent',
    ).length;
    const aiAnalyses = periodUsage.filter(
      (r) => r.action === 'ai_analysis',
    ).length;

    // Calculate projected costs based on usage
    const subscription = this.getActiveSubscription(customerId);
    const baseCost = subscription ? subscription.pricing.amount : 0;
    const overageCosts = this.calculateOverageCosts(customerId, periodUsage);

    return {
      period: `${startDate.toISOString().slice(0, 7)} to ${now.toISOString().slice(0, 7)}`,
      documentsGenerated,
      signaturesProcessed,
      aiAnalyses,
      totalUsage: periodUsage.length,
      projectedCosts: baseCost + overageCosts,
    };
  }

  // Calculate overage costs
  private calculateOverageCosts(
    customerId: string,
    usage: UsageRecord[],
  ): number {
    const subscription = this.getActiveSubscription(customerId);
    if (!subscription) return 0;

    const plan = this.billingPlans.get(subscription.planId);
    if (!plan) return 0;

    let overageCost = 0;

    // Calculate document overage
    const documentsUsed = usage.filter(
      (r) => r.action === 'document_generated',
    ).length;
    if (
      plan.limits.documentsPerMonth > 0 &&
      documentsUsed > plan.limits.documentsPerMonth
    ) {
      const overage = documentsUsed - plan.limits.documentsPerMonth;
      overageCost += overage * 5; // $5 per additional document
    }

    // Calculate AI analysis overage
    const aiUsed = usage.filter((r) => r.action === 'ai_analysis').length;
    if (plan.limits.aiAnalysis > 0 && aiUsed > plan.limits.aiAnalysis) {
      const overage = aiUsed - plan.limits.aiAnalysis;
      overageCost += overage * 1; // $1 per additional AI analysis
    }

    return overageCost;
  }

  // Simulate Stripe payment
  private async simulateStripePayment(
    amount: number,
    currency: string,
    paymentMethodId: string,
  ): Promise<{ success: boolean; transactionId: string; error?: string }> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      };
    } else {
      const errors = [
        'Insufficient funds',
        'Card declined',
        'Expired card',
        'Invalid CVV',
      ];
      return {
        success: false,
        transactionId: '',
        error: errors[Math.floor(Math.random() * errors.length)],
      };
    }
  }

  // Utility functions
  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateInvoiceId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateUsageId(): string {
    return `usage_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generatePaymentMethodId(): string {
    return `pm_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private generateFingerprint(): string {
    return `fp_${Math.random().toString(36).substr(2, 16)}`;
  }

  // Get billing performance metrics
  getPerformanceMetrics(): {
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRecurringRevenue: number;
    churnRate: number;
    averageRevenuePerUser: number;
    totalInvoices: number;
    paidInvoices: number;
    outstandingAmount: number;
  } {
    const allSubscriptions = Array.from(this.subscriptions.values());
    const activeSubscriptions = allSubscriptions.filter(
      (s) => s.status === 'active',
    );

    const mrr = activeSubscriptions.reduce((sum, sub) => {
      return sum + sub.pricing.amount;
    }, 0);

    const allInvoices = Array.from(this.invoices.values());
    const paidInvoices = allInvoices.filter((inv) => inv.status === 'paid');
    const outstandingInvoices = allInvoices.filter(
      (inv) => inv.status === 'open',
    );

    const outstandingAmount = outstandingInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0,
    );
    const arpu =
      activeSubscriptions.length > 0 ? mrr / activeSubscriptions.length : 0;

    // Simplified churn rate calculation
    const churnRate =
      allSubscriptions.length > 0
        ? (allSubscriptions.filter((s) => s.status === 'canceled').length /
            allSubscriptions.length) *
          100
        : 0;

    return {
      totalSubscriptions: allSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRecurringRevenue: mrr,
      churnRate: Math.round(churnRate * 100) / 100,
      averageRevenuePerUser: Math.round(arpu * 100) / 100,
      totalInvoices: allInvoices.length,
      paidInvoices: paidInvoices.length,
      outstandingAmount: Math.round(outstandingAmount * 100) / 100,
    };
  }
}

// Export singleton instance
export const paymentProcessor = PaymentProcessor.getInstance();
