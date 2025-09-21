// src/lib/marketplace/revenue-sharing-system.ts
import type Stripe from 'stripe';
import { getDb } from '@/lib/firebase';
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  query,
  where,
  orderBy,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { getStripeServerClient } from '@/lib/stripe-server';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface RevenueTransaction {
  id: string;
  creatorId: string;
  templateId: string;
  installationId: string;
  buyerId: string;
  totalAmount: number;
  creatorShare: number;
  platformFee: number;
  currency: string;
  creatorSharePercent?: number;
  platformFeePercent?: number;
  paymentIntentId?: string;
  stripeTransferId?: string | null;
  payoutPeriod?: string;
  status?: string;
  createdAt: Timestamp;
  paidAt?: Timestamp;
}

interface CreatorPayout {
  id: string;
  creatorId: string;
  amount: number;
  currency: string;
  payoutPeriod: string;
  stripeTransferId: string | null;
  status: string;
  fees: number;
  transactionIds: string[];
  createdAt: Timestamp;
}

interface CreatorEarningsSummary {
  creatorId: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  platformFees: number;
  transactionCount: number;
  averageTransactionValue: number;
  topTemplates: Array<{ templateId: string; revenue: number; transactionCount: number }>;
  nextPayoutDate: Date | null;
  nextPayoutAmount: number;
  currency: string;
}

interface RevenueReportSummary {
  totalRevenue: number;
  creatorRevenue: number;
  platformRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  currency: string;
}

interface RevenueReportBreakdown {
  byCreator: Array<{ creatorId: string; revenue: number; transactionCount: number }>;
  byTemplate: Array<{ templateId: string; revenue: number; transactionCount: number }>;
  byCurrency: Array<{ currency: string; revenue: number; transactionCount: number }>;
}

interface RevenueReport {
  summary: RevenueReportSummary;
  breakdown?: RevenueReportBreakdown;
}

const DEFAULT_CURRENCY = 'usd';
const DEFAULT_PLATFORM_FEE_PERCENT = 30;
const DEFAULT_CREATOR_SHARE_PERCENT = 70;

const MIN_PAYOUT_FEE = 50; // .50 in cents
const DEFAULT_PAYOUT_FEE_PERCENT = 0.015;

const toTimestamp = (date: Date): Timestamp => Timestamp.fromDate(date);

const sum = (values: number[]): number =>
  values.reduce((acc, value) => acc + value, 0);

export class RevenueSharingSystem {
  private dbPromise: Promise<ReturnType<typeof getDb>> | null = null;

  private async getDbInstance() {
    if (!this.dbPromise) {
      this.dbPromise = getDb();
    }
    return this.dbPromise;
  }

  private async getStripe(): Promise<Stripe> {
    return getStripeServerClient();
  }

  private buildDateConstraints(period?: DateRange): QueryConstraint[] {
    if (!period) {
      return [];
    }
    return [
      where('createdAt', '>=', toTimestamp(period.startDate)),
      where('createdAt', '<=', toTimestamp(period.endDate)),
    ];
  }

  private getEstimatedFees(amountInCents: number): number {
    const percent =
      Number(process.env.MARKETPLACE_PAYOUT_FEE_PERCENT ?? DEFAULT_PAYOUT_FEE_PERCENT);
    const estimated = Math.round(amountInCents * percent);
    return Math.max(estimated, MIN_PAYOUT_FEE);
  }

  async setupStripeConnect(
    userId: string,
    options: {
      email: string;
      businessType?: 'individual' | 'company';
      country?: string;
      returnUrl: string;
      refreshUrl: string;
    },
  ): Promise<{ accountId: string; onboardingUrl: string }> {
    const stripe = await this.getStripe();

    const account = await stripe.accounts.create({
      type: 'express',
      email: options.email,
      country: options.country ?? 'US',
      business_type: options.businessType ?? 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        marketplace_user_id: userId,
      },
    });

    const onboardingLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: options.refreshUrl,
      return_url: options.returnUrl,
      type: 'account_onboarding',
    });

    const db = await this.getDbInstance();
    const profileRef = doc(db, 'creator-profiles', userId);
    await setDoc(
      profileRef,
      {
        stripeConnectAccountId: account.id,
        stripeConnectOnboardingUrl: onboardingLink.url,
        stripeAccountStatus: account.details_submitted ? 'active' : 'pending',
        businessType: options.businessType ?? 'individual',
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return {
      accountId: account.id,
      onboardingUrl: onboardingLink.url,
    };
  }

  async setupCreatorAccount(params: {
    userId: string;
    email: string;
    country: string;
  }): Promise<{ accountId: string; onboardingUrl: string | null }> {
    const returnUrl =
      process.env.STRIPE_ACCOUNT_LINK_RETURN_URL ??
      'https://example.com/account/return';
    const refreshUrl =
      process.env.STRIPE_ACCOUNT_LINK_REFRESH_URL ??
      'https://example.com/account/refresh';

    const result = await this.setupStripeConnect(params.userId, {
      email: params.email,
      country: params.country,
      returnUrl,
      refreshUrl,
      businessType: 'individual',
    });

    return {
      accountId: result.accountId,
      onboardingUrl: result.onboardingUrl ?? null,
    };
  }

  async processRevenueShare(params: {
    templateId: string;
    installationId: string;
    totalAmount: number;
    currency: string;
    paymentIntentId: string;
    buyerId: string;
    creatorId?: string;
    creatorSharePercent?: number;
    platformFeePercent?: number;
    createdAt?: Date;
  }): Promise<{ transactionId: string; creatorShare: number; platformFee: number }> {
    const db = await this.getDbInstance();

    let creatorId = params.creatorId;
    let creatorSharePercent = params.creatorSharePercent;
    let platformFeePercent = params.platformFeePercent;

    if (!creatorId || creatorSharePercent === undefined || platformFeePercent === undefined) {
      const templateSnap = await getDoc(
        doc(db, 'marketplace-templates', params.templateId),
      );
      if (templateSnap.exists()) {
        const templateData = templateSnap.data() as {
          createdBy?: string;
          pricing?: { creatorShare?: number; platformFee?: number };
        };
        creatorId ??= templateData.createdBy ?? '';
        creatorSharePercent ??=
          templateData.pricing?.creatorShare ?? DEFAULT_CREATOR_SHARE_PERCENT;
        platformFeePercent ??=
          templateData.pricing?.platformFee ?? DEFAULT_PLATFORM_FEE_PERCENT;
      } else {
        creatorSharePercent ??= DEFAULT_CREATOR_SHARE_PERCENT;
        platformFeePercent ??= DEFAULT_PLATFORM_FEE_PERCENT;
      }
    }

    if (!creatorId) {
      throw new Error('Unable to determine template creator for revenue share');
    }

    const creatorShare = Math.round(
      (params.totalAmount * creatorSharePercent) / 100,
    );
    const platformFee = params.totalAmount - creatorShare;

    const transactionRef = doc(collection(db, 'revenue-transactions'));
    await setDoc(transactionRef, {
      creatorId,
      templateId: params.templateId,
      installationId: params.installationId,
      buyerId: params.buyerId,
      totalAmount: params.totalAmount,
      creatorShare,
      platformFee,
      currency: params.currency || DEFAULT_CURRENCY,
      creatorSharePercent,
      platformFeePercent,
      paymentIntentId: params.paymentIntentId,
      stripeTransferId: null,
      status: 'pending_transfer',
      createdAt: params.createdAt ? Timestamp.fromDate(params.createdAt) : serverTimestamp(),
    });

    return {
      transactionId: transactionRef.id,
      creatorShare,
      platformFee,
    };
  }

  private async getTransactions(
    period: DateRange,
    creatorId?: string,
  ): Promise<RevenueTransaction[]> {
    const db = await this.getDbInstance();

    const constraints: QueryConstraint[] = [
      where('createdAt', '>=', toTimestamp(period.startDate)),
      where('createdAt', '<=', toTimestamp(period.endDate)),
      orderBy('createdAt', 'desc'),
    ];

    if (creatorId) {
      constraints.unshift(where('creatorId', '==', creatorId));
    }

    const snapshot = await getDocs(
      query(collection(db, 'revenue-transactions'), ...constraints),
    );

    return snapshot.docs.map<RevenueTransaction>((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as RevenueTransaction),
    }));
  }

  private buildTopTemplates(transactions: RevenueTransaction[]) {
    const map = new Map<string, { templateId: string; revenue: number; transactionCount: number }>();
    transactions.forEach((txn) => {
      const entry =
        map.get(txn.templateId) ?? {
          templateId: txn.templateId,
          revenue: 0,
          transactionCount: 0,
        };
      entry.revenue += txn.creatorShare ?? 0;
      entry.transactionCount += 1;
      map.set(txn.templateId, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }

  async getCreatorEarnings(
    creatorId: string,
    period?: DateRange,
  ): Promise<CreatorEarningsSummary> {
    const effectivePeriod =
      period ??
      {
        startDate: new Date(0),
        endDate: new Date(),
      };

    const transactions = await this.getTransactions(effectivePeriod, creatorId);

    const currency = transactions[0]?.currency ?? DEFAULT_CURRENCY;
    const pendingTransactions = transactions.filter(
      (txn) => (txn.status ?? 'pending_transfer') !== 'paid',
    );

    const pendingEarnings = sum(
      pendingTransactions.map((txn) => txn.creatorShare ?? 0),
    );
    const paidEarnings = sum(
      transactions
        .filter((txn) => (txn.status ?? 'pending_transfer') === 'paid')
        .map((txn) => txn.creatorShare ?? 0),
    );
    const totalEarnings = pendingEarnings + paidEarnings;
    const platformFees = sum(transactions.map((txn) => txn.platformFee ?? 0));
    const transactionCount = transactions.length;
    const averageTransactionValue = transactionCount
      ? Math.round(sum(transactions.map((txn) => txn.totalAmount ?? 0)) / transactionCount)
      : 0;

    const nextPayoutDate = pendingTransactions
      .map((txn) => txn.createdAt?.toDate?.())
      .filter((value): value is Date => value instanceof Date)
      .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;

    return {
      creatorId,
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      platformFees,
      transactionCount,
      averageTransactionValue,
      topTemplates: this.buildTopTemplates(transactions),
      nextPayoutDate,
      nextPayoutAmount: pendingEarnings,
      currency,
    };
  }

  async processCreatorPayout(params: {
    creatorId: string;
    amount: number;
    currency: string;
    payoutPeriod: string;
    transactionIds: string[];
  }): Promise<{
    payoutId: string;
    transferId: string | null;
    amount: number;
    fees: number;
    currency: string;
  }> {
    const db = await this.getDbInstance();
    const stripe = await this.getStripe();

    const profileSnap = await getDoc(doc(db, 'creator-profiles', params.creatorId));
    if (!profileSnap.exists()) {
      throw new Error('Creator profile not found');
    }
    const profileData = profileSnap.data() as {
      stripeConnectAccountId?: string;
    };

    if (!profileData.stripeConnectAccountId) {
      throw new Error('Creator has not connected a Stripe account');
    }

    const transfer = await stripe.transfers.create({
      amount: params.amount,
      currency: params.currency,
      destination: profileData.stripeConnectAccountId,
      description: Marketplace payout for ,
      metadata: {
        creatorId: params.creatorId,
        payoutPeriod: params.payoutPeriod,
      },
    });

    const fees = this.getEstimatedFees(params.amount);
    const payoutRef = doc(collection(db, 'creator-payouts'));
    await setDoc(payoutRef, {
      creatorId: params.creatorId,
      amount: params.amount,
      currency: params.currency,
      payoutPeriod: params.payoutPeriod,
      stripeTransferId: transfer.id,
      status: transfer.status ?? 'pending',
      fees,
      transactionIds: params.transactionIds,
      createdAt: serverTimestamp(),
    });

    if (params.transactionIds.length > 0) {
      const batch = writeBatch(db);
      params.transactionIds.forEach((transactionId) => {
        const txnRef = doc(db, 'revenue-transactions', transactionId);
        batch.update(txnRef, {
          status: 'paid',
          stripeTransferId: transfer.id,
          payoutId: payoutRef.id,
          paidAt: serverTimestamp(),
        });
      });
      await batch.commit();
    }

    return {
      payoutId: payoutRef.id,
      transferId: transfer.id,
      amount: params.amount,
      fees,
      currency: params.currency,
    };
  }

  async generateRevenueReport(params: {
    creatorId?: string;
    period: DateRange;
    includeBreakdown?: boolean;
  }): Promise<RevenueReport> {
    const transactions = await this.getTransactions(params.period, params.creatorId);

    if (transactions.length === 0) {
      return {
        summary: {
          totalRevenue: 0,
          creatorRevenue: 0,
          platformRevenue: 0,
          transactionCount: 0,
          averageTransactionValue: 0,
          currency: DEFAULT_CURRENCY,
        },
        breakdown: params.includeBreakdown
          ? {
              byCreator: [],
              byTemplate: [],
              byCurrency: [],
            }
          : undefined,
      };
    }

    const totalRevenue = sum(transactions.map((txn) => txn.totalAmount ?? 0));
    const creatorRevenue = sum(transactions.map((txn) => txn.creatorShare ?? 0));
    const platformRevenue = sum(transactions.map((txn) => txn.platformFee ?? 0));
    const transactionCount = transactions.length;
    const averageTransactionValue = Math.round(totalRevenue / transactionCount);
    const currency = transactions[0]?.currency ?? DEFAULT_CURRENCY;

    const report: RevenueReport = {
      summary: {
        totalRevenue,
        creatorRevenue,
        platformRevenue,
        transactionCount,
        averageTransactionValue,
        currency,
      },
    };

    if (params.includeBreakdown) {
      const byCreatorMap = new Map<
        string,
        { creatorId: string; revenue: number; transactionCount: number }
      >();
      const byTemplateMap = new Map<
        string,
        { templateId: string; revenue: number; transactionCount: number }
      >();
      const byCurrencyMap = new Map<
        string,
        { currency: string; revenue: number; transactionCount: number }
      >();

      transactions.forEach((txn) => {
        const creatorEntry =
          byCreatorMap.get(txn.creatorId) ?? {
            creatorId: txn.creatorId,
            revenue: 0,
            transactionCount: 0,
          };
        creatorEntry.revenue += txn.creatorShare ?? 0;
        creatorEntry.transactionCount += 1;
        byCreatorMap.set(txn.creatorId, creatorEntry);

        const templateEntry =
          byTemplateMap.get(txn.templateId) ?? {
            templateId: txn.templateId,
            revenue: 0,
            transactionCount: 0,
          };
        templateEntry.revenue += txn.creatorShare ?? 0;
        templateEntry.transactionCount += 1;
        byTemplateMap.set(txn.templateId, templateEntry);

        const currencyEntry =
          byCurrencyMap.get(txn.currency) ?? {
            currency: txn.currency,
            revenue: 0,
            transactionCount: 0,
          };
        currencyEntry.revenue += txn.totalAmount ?? 0;
        currencyEntry.transactionCount += 1;
        byCurrencyMap.set(txn.currency, currencyEntry);
      });

      report.breakdown = {
        byCreator: Array.from(byCreatorMap.values()),
        byTemplate: Array.from(byTemplateMap.values()),
        byCurrency: Array.from(byCurrencyMap.values()),
      };
    }

    return report;
  }
}

export const revenueShareSystem = new RevenueSharingSystem();
