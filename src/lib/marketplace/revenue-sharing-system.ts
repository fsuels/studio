// src/lib/marketplace/revenue-sharing-system.ts
// This module uses Stripe server-side API and should only run on the server

import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import Stripe from 'stripe';
import type {
  MarketplaceTemplate,
  TemplateInstallation,
  CreatorProfile,
} from '@/types/marketplace';

// Initialize Stripe only if the secret key is available
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
}) : null;

/**
 * Revenue Sharing System for Template Marketplace
 * Handles payouts, commission tracking, and financial reporting for creators
 */
export class RevenueServingSystem {
  private db: ReturnType<typeof getDb> | null = null;

  constructor() {
    this.initDb();
  }

  private async initDb() {
    this.db = await getDb();
  }

  private async ensureDb() {
    if (!this.db) {
      await this.initDb();
    }
    return this.db!;
  }

  /**
   * Process revenue share for a template purchase
   */
  async processRevenueDhare(params: {
    templateId: string;
    installationId: string;
    totalAmount: number; // in cents
    currency: string;
    paymentIntentId: string;
    buyerId: string;
  }): Promise<{
    creatorShare: number;
    platformFee: number;
    transactionId: string;
  }> {
    const db = await this.ensureDb();

    // Get template information
    const templateRef = doc(db, 'marketplace-templates', params.templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      throw new Error('Template not found');
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Calculate revenue split
    const creatorSharePercent = template.pricing.creatorShare || 70;
    const platformFeePercent = template.pricing.platformFee || 30;

    const creatorShare = Math.round(
      (params.totalAmount * creatorSharePercent) / 100,
    );
    const platformFee = params.totalAmount - creatorShare;

    // Create transaction record
    const transactionRef = doc(collection(db, 'revenue-transactions'));
    const transaction = {
      id: transactionRef.id,
      templateId: params.templateId,
      installationId: params.installationId,
      creatorId: template.createdBy,
      buyerId: params.buyerId,

      // Financial details
      totalAmount: params.totalAmount,
      creatorShare,
      platformFee,
      currency: params.currency,

      // Share percentages
      creatorSharePercent,
      platformFeePercent,

      // Payment references
      paymentIntentId: params.paymentIntentId,
      stripeTransferId: null, // Will be set when transfer is created

      // Status tracking
      status: 'pending_transfer',
      createdAt: serverTimestamp(),

      // Metadata
      templateName: template.name,
      templateVersion: template.currentVersion,
    };

    await setDoc(transactionRef, transaction);

    // Update creator's pending earnings
    await this.updateCreatorEarnings(template.createdBy, {
      pendingAmount: creatorShare,
      currency: params.currency,
      transactionId: transaction.id,
    });

    // Update template revenue stats
    await this.updateTemplateRevenue(params.templateId, {
      totalRevenue: creatorShare + platformFee,
      creatorRevenue: creatorShare,
      platformRevenue: platformFee,
    });

    return {
      creatorShare,
      platformFee,
      transactionId: transaction.id,
    };
  }

  /**
   * Process payout to creator via Stripe Connect
   */
  async processCreatorPayout(params: {
    creatorId: string;
    amount: number; // in cents
    currency: string;
    payoutPeriod: string; // e.g., "2024-01"
    transactionIds: string[];
  }): Promise<{
    transferId: string;
    payoutId: string;
    amount: number;
    fees: number;
  }> {
    const db = await this.ensureDb();

    // Get creator's Stripe Connect account
    const creatorProfile = await this.getCreatorProfile(params.creatorId);
    if (!creatorProfile.stripeConnectAccountId) {
      throw new Error('Creator does not have a connected Stripe account');
    }

    // Calculate Stripe fees (2.9% + 30¢ for transfers)
    const stripeFee = Math.round(params.amount * 0.029) + 30;
    const netAmount = params.amount - stripeFee;

    try {
      // Check if Stripe is configured
      if (!stripe) {
        throw new Error('Payment system is not configured');
      }
      // Create Stripe transfer to creator's connected account
      const transfer = await stripe.transfers.create({
        amount: netAmount,
        currency: params.currency,
        destination: creatorProfile.stripeConnectAccountId,
        metadata: {
          creator_id: params.creatorId,
          payout_period: params.payoutPeriod,
          transaction_count: params.transactionIds.length.toString(),
        },
      });

      // Create payout record
      const payoutRef = doc(collection(db, 'creator-payouts'));
      const payout = {
        id: payoutRef.id,
        creatorId: params.creatorId,
        amount: params.amount,
        netAmount,
        stripeFee,
        currency: params.currency,
        payoutPeriod: params.payoutPeriod,
        transactionIds: params.transactionIds,

        // Stripe references
        stripeTransferId: transfer.id,

        // Status
        status: 'completed',
        createdAt: serverTimestamp(),
        processedAt: serverTimestamp(),

        // Metadata
        transactionCount: params.transactionIds.length,
        averageTransactionValue: Math.round(
          params.amount / params.transactionIds.length,
        ),
      };

      await setDoc(payoutRef, payout);

      // Update transaction records with payout reference
      const batch = writeBatch(db);
      for (const transactionId of params.transactionIds) {
        const transactionRef = doc(db, 'revenue-transactions', transactionId);
        batch.update(transactionRef, {
          status: 'paid_out',
          payoutId: payout.id,
          paidOutAt: serverTimestamp(),
          stripeTransferId: transfer.id,
        });
      }
      await batch.commit();

      // Update creator earnings
      await this.updateCreatorEarnings(params.creatorId, {
        paidAmount: params.amount,
        pendingAmount: -params.amount, // Reduce pending
        totalEarnings: params.amount,
        lastPayoutDate: new Date(),
      });

      return {
        transferId: transfer.id,
        payoutId: payout.id,
        amount: netAmount,
        fees: stripeFee,
      };
    } catch (error) {
      // Handle payout failure
      await this.handlePayoutFailure({
        creatorId: params.creatorId,
        amount: params.amount,
        currency: params.currency,
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionIds: params.transactionIds,
      });

      throw error;
    }
  }

  /**
   * Get creator earnings summary
   */
  async getCreatorEarnings(
    creatorId: string,
    period?: {
      startDate: Date;
      endDate: Date;
    },
  ): Promise<{
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    currentMonthEarnings: number;
    transactionCount: number;
    averageTransactionValue: number;
    topTemplates: Array<{
      templateId: string;
      templateName: string;
      revenue: number;
      sales: number;
    }>;
    recentTransactions: any[];
    nextPayoutDate: Date;
    nextPayoutAmount: number;
  }> {
    const db = await this.ensureDb();

    // Build query for creator's transactions
    let transactionsQuery = query(
      collection(db, 'revenue-transactions'),
      where('creatorId', '==', creatorId),
      orderBy('createdAt', 'desc'),
    );

    // Apply date filter if provided
    if (period) {
      transactionsQuery = query(
        transactionsQuery,
        where('createdAt', '>=', period.startDate),
        where('createdAt', '<=', period.endDate),
      );
    }

    const transactionsSnap = await getDocs(transactionsQuery);
    const transactions = transactionsSnap.docs.map((doc) => doc.data());

    // Calculate aggregated metrics
    const totalEarnings = transactions.reduce(
      (sum, t) => sum + (t.creatorShare || 0),
      0,
    );
    const pendingEarnings = transactions
      .filter((t) => t.status === 'pending_transfer')
      .reduce((sum, t) => sum + (t.creatorShare || 0), 0);
    const paidEarnings = totalEarnings - pendingEarnings;

    // Current month earnings
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const currentMonthEarnings = transactions
      .filter((t) => new Date(t.createdAt.toDate()) >= currentMonth)
      .reduce((sum, t) => sum + (t.creatorShare || 0), 0);

    // Transaction metrics
    const transactionCount = transactions.length;
    const averageTransactionValue =
      transactionCount > 0 ? totalEarnings / transactionCount : 0;

    // Top performing templates
    const templateRevenue = new Map<
      string,
      { revenue: number; sales: number; name: string }
    >();
    transactions.forEach((t) => {
      const existing = templateRevenue.get(t.templateId) || {
        revenue: 0,
        sales: 0,
        name: t.templateName || '',
      };
      templateRevenue.set(t.templateId, {
        revenue: existing.revenue + (t.creatorShare || 0),
        sales: existing.sales + 1,
        name: t.templateName || existing.name,
      });
    });

    const topTemplates = Array.from(templateRevenue.entries())
      .map(([templateId, data]) => ({
        templateId,
        templateName: data.name,
        revenue: data.revenue,
        sales: data.sales,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10);

    // Next payout calculation (assuming monthly payouts on the 1st)
    const nextPayoutDate = new Date();
    nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);
    nextPayoutDate.setDate(1);

    return {
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      currentMonthEarnings,
      transactionCount,
      averageTransactionValue,
      topTemplates,
      recentTransactions,
      nextPayoutDate,
      nextPayoutAmount: pendingEarnings,
    };
  }

  /**
   * Set up Stripe Connect for creator
   */
  async setupStripeConnect(
    creatorId: string,
    params: {
      email: string;
      businessType: 'individual' | 'company';
      country: string;
      returnUrl: string;
      refreshUrl: string;
    },
  ): Promise<{
    accountId: string;
    onboardingUrl: string;
  }> {
    try {
      // Check if Stripe is configured
      if (!stripe) {
        throw new Error('Payment system is not configured');
      }
      // Create Stripe Express account
      const account = await stripe.accounts.create({
        type: 'express',
        email: params.email,
        business_type: params.businessType,
        country: params.country,
        metadata: {
          creator_id: creatorId,
        },
      });

      // Create account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: params.refreshUrl,
        return_url: params.returnUrl,
        type: 'account_onboarding',
      });

      // Update creator profile with Stripe account ID
      const db = await this.ensureDb();
      const profileRef = doc(db, 'creator-profiles', creatorId);
      await updateDoc(profileRef, {
        stripeConnectAccountId: account.id,
        stripeOnboardingStatus: 'pending',
        stripeOnboardingUrl: accountLink.url,
        updatedAt: serverTimestamp(),
      });

      return {
        accountId: account.id,
        onboardingUrl: accountLink.url,
      };
    } catch (error) {
      console.error('Stripe Connect setup error:', error);
      throw new Error('Failed to set up payment processing');
    }
  }

  /**
   * Generate revenue report for admin/creator
   */
  async generateRevenueReport(params: {
    creatorId?: string; // If provided, report for specific creator
    period: {
      startDate: Date;
      endDate: Date;
    };
    includeBreakdown?: boolean;
  }): Promise<{
    summary: {
      totalRevenue: number;
      creatorRevenue: number;
      platformRevenue: number;
      transactionCount: number;
      uniqueCreators: number;
      uniqueBuyers: number;
      averageTransactionValue: number;
    };
    breakdown?: {
      byTemplate: Array<{
        templateId: string;
        templateName: string;
        revenue: number;
        sales: number;
        uniqueBuyers: number;
      }>;
      byCreator: Array<{
        creatorId: string;
        creatorName: string;
        revenue: number;
        templates: number;
        sales: number;
      }>;
      byPeriod: Array<{
        date: string;
        revenue: number;
        sales: number;
      }>;
    };
  }> {
    const db = await this.ensureDb();

    // Build query
    let q = query(
      collection(db, 'revenue-transactions'),
      where('createdAt', '>=', params.period.startDate),
      where('createdAt', '<=', params.period.endDate),
      orderBy('createdAt', 'desc'),
    );

    // Filter by creator if specified
    if (params.creatorId) {
      q = query(q, where('creatorId', '==', params.creatorId));
    }

    const transactionsSnap = await getDocs(q);
    const transactions = transactionsSnap.docs.map((doc) => doc.data());

    // Calculate summary metrics
    const totalRevenue = transactions.reduce(
      (sum, t) => sum + (t.totalAmount || 0),
      0,
    );
    const creatorRevenue = transactions.reduce(
      (sum, t) => sum + (t.creatorShare || 0),
      0,
    );
    const platformRevenue = transactions.reduce(
      (sum, t) => sum + (t.platformFee || 0),
      0,
    );
    const transactionCount = transactions.length;
    const uniqueCreators = new Set(transactions.map((t) => t.creatorId)).size;
    const uniqueBuyers = new Set(transactions.map((t) => t.buyerId)).size;
    const averageTransactionValue =
      transactionCount > 0 ? totalRevenue / transactionCount : 0;

    const summary = {
      totalRevenue,
      creatorRevenue,
      platformRevenue,
      transactionCount,
      uniqueCreators,
      uniqueBuyers,
      averageTransactionValue,
    };

    // Generate detailed breakdown if requested
    let breakdown;
    if (params.includeBreakdown) {
      breakdown = {
        byTemplate: this.calculateTemplateBreakdown(transactions),
        byCreator: this.calculateCreatorBreakdown(transactions),
        byPeriod: this.calculatePeriodBreakdown(transactions),
      };
    }

    return {
      summary,
      breakdown,
    };
  }

  /**
   * Private helper methods
   */

  private async getCreatorProfile(creatorId: string): Promise<any> {
    const db = await this.ensureDb();
    const profileRef = doc(db, 'creator-profiles', creatorId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      throw new Error('Creator profile not found');
    }

    return profileSnap.data();
  }

  private async updateCreatorEarnings(creatorId: string, updates: any) {
    const db = await this.ensureDb();
    const profileRef = doc(db, 'creator-profiles', creatorId);

    // Get current values
    const profileSnap = await getDoc(profileRef);
    const currentData = profileSnap.data() || {};

    const updateData: any = {};

    if (updates.pendingAmount !== undefined) {
      updateData.pendingEarnings =
        (currentData.pendingEarnings || 0) + updates.pendingAmount;
    }

    if (updates.paidAmount !== undefined) {
      updateData.totalEarnings =
        (currentData.totalEarnings || 0) + updates.paidAmount;
    }

    if (updates.totalEarnings !== undefined) {
      updateData.totalRevenue =
        (currentData.totalRevenue || 0) + updates.totalEarnings;
    }

    if (updates.lastPayoutDate) {
      updateData.lastPayoutDate = updates.lastPayoutDate;
    }

    updateData.updatedAt = serverTimestamp();

    await updateDoc(profileRef, updateData);
  }

  private async updateTemplateRevenue(templateId: string, revenue: any) {
    const db = await this.ensureDb();
    const templateRef = doc(db, 'marketplace-templates', templateId);

    await updateDoc(templateRef, {
      'stats.totalRevenue': revenue.totalRevenue,
      'stats.revenueThisMonth': revenue.totalRevenue, // Simplified
      lastUpdated: serverTimestamp(),
    });
  }

  private async handlePayoutFailure(params: any) {
    const db = await this.ensureDb();

    // Log the failure
    const failureRef = doc(collection(db, 'payout-failures'));
    await setDoc(failureRef, {
      ...params,
      failedAt: serverTimestamp(),
      retryCount: 0,
      status: 'failed',
    });

    // TODO: Implement retry logic and notifications
  }

  private calculateTemplateBreakdown(transactions: any[]) {
    const breakdown = new Map();

    transactions.forEach((t) => {
      const existing = breakdown.get(t.templateId) || {
        templateId: t.templateId,
        templateName: t.templateName || 'Unknown',
        revenue: 0,
        sales: 0,
        uniqueBuyers: new Set(),
      };

      existing.revenue += t.totalAmount || 0;
      existing.sales += 1;
      existing.uniqueBuyers.add(t.buyerId);

      breakdown.set(t.templateId, existing);
    });

    return Array.from(breakdown.values())
      .map((item) => ({
        ...item,
        uniqueBuyers: item.uniqueBuyers.size,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private calculateCreatorBreakdown(transactions: any[]) {
    const breakdown = new Map();

    transactions.forEach((t) => {
      const existing = breakdown.get(t.creatorId) || {
        creatorId: t.creatorId,
        creatorName: 'Creator', // TODO: Get from profile
        revenue: 0,
        templates: new Set(),
        sales: 0,
      };

      existing.revenue += t.creatorShare || 0;
      existing.templates.add(t.templateId);
      existing.sales += 1;

      breakdown.set(t.creatorId, existing);
    });

    return Array.from(breakdown.values())
      .map((item) => ({
        ...item,
        templates: item.templates.size,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private calculatePeriodBreakdown(transactions: any[]) {
    const breakdown = new Map();

    transactions.forEach((t) => {
      const date = new Date(t.createdAt.toDate()).toISOString().split('T')[0];
      const existing = breakdown.get(date) || { date, revenue: 0, sales: 0 };

      existing.revenue += t.totalAmount || 0;
      existing.sales += 1;

      breakdown.set(date, existing);
    });

    return Array.from(breakdown.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }
}

/**
 * Singleton instance for easy access
 */
export const revenueShareSystem = new RevenueServingSystem();
