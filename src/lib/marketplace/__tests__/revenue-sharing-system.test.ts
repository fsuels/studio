// src/lib/marketplace/__tests__/revenue-sharing-system.test.ts
import { RevenueServingSystem } from '../revenue-sharing-system';
import type {
  PurchaseEvent,
  PayoutRequest,
  RevenueReport,
} from '@/types/marketplace';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    accounts: {
      create: jest.fn(),
      retrieve: jest.fn(),
      update: jest.fn(),
    },
    transfers: {
      create: jest.fn(),
    },
    paymentIntents: {
      create: jest.fn(),
      confirm: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

// Mock Firebase first without referencing mockDb
jest.mock('@/lib/firebase', () => ({
  getDb: jest.fn(),
}));

const mockDb = {
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
};

// After mockDb is defined, set the implementation
const firebase = require('@/lib/firebase');
firebase.getDb.mockImplementation(() => Promise.resolve(mockDb));

// Mock Firestore - define functions inside the mock factory
jest.mock('firebase/firestore', () => {
  const mockGetDocs = jest.fn();
  const mockCollection = jest.fn();
  const mockDoc = jest.fn();
  const mockSetDoc = jest.fn();
  const mockGetDoc = jest.fn();
  const mockUpdateDoc = jest.fn();
  const mockQuery = jest.fn();
  const mockWhere = jest.fn();
  const mockOrderBy = jest.fn();
  const mockLimit = jest.fn();
  const mockAddDoc = jest.fn();

  // Store references for later use
  global.__mockFirestoreRevenue = {
    getDocs: mockGetDocs,
    collection: mockCollection,
    doc: mockDoc,
    setDoc: mockSetDoc,
    getDoc: mockGetDoc,
    updateDoc: mockUpdateDoc,
    query: mockQuery,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    addDoc: mockAddDoc,
    serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000 })),
  };

  return global.__mockFirestoreRevenue;
});

const mockStripe = {
  accounts: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn(),
  },
  transfers: {
    create: jest.fn(),
  },
  paymentIntents: {
    create: jest.fn(),
    confirm: jest.fn(),
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
};

describe('RevenueServingSystem', () => {
  let revenueSystem: RevenueServingSystem;

  const mockPurchaseEvent: PurchaseEvent = {
    templateId: 'template-123',
    purchaserId: 'buyer-456',
    creatorId: 'creator-789',
    amount: 2999, // $29.99
    currency: 'USD',
    creatorShare: 70, // 70%
    platformFee: 30, // 30%
    purchaseId: 'purchase-001',
    timestamp: new Date(),
  };

  beforeEach(() => {
    revenueSystem = new RevenueServingSystem();
    (revenueSystem as any).stripe = mockStripe;
    jest.clearAllMocks();
  });

  describe('setupCreatorAccount', () => {
    it('should create Stripe Connect account for creator', async () => {
      const mockAccount = {
        id: 'acct_123456789',
        type: 'express',
        country: 'US',
        email: 'creator@example.com',
      };

      mockStripe.accounts.create.mockResolvedValue(mockAccount);
      global.__mockFirestoreRevenue.setDoc.mockResolvedValue(undefined);

      const result = await revenueSystem.setupCreatorAccount({
        userId: 'creator-789',
        email: 'creator@example.com',
        country: 'US',
        businessType: 'individual',
      });

      expect(result.stripeAccountId).toBe('acct_123456789');
      expect(result.status).toBe('pending');
      expect(mockStripe.accounts.create).toHaveBeenCalledWith({
        type: 'express',
        country: 'US',
        email: 'creator@example.com',
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
      });
    });

    it('should handle account creation errors', async () => {
      mockStripe.accounts.create.mockRejectedValue(new Error('Stripe error'));

      await expect(
        revenueSystem.setupCreatorAccount({
          userId: 'creator-789',
          email: 'invalid-email',
          country: 'US',
          businessType: 'individual',
        }),
      ).rejects.toThrow('Failed to create Stripe Connect account');
    });
  });

  describe('processRevenueShare', () => {
    it('should calculate and process revenue share correctly', async () => {
      const mockDocRef = { id: 'transaction-123' };
      global.__mockFirestoreRevenue.doc.mockReturnValue(mockDocRef);
      global.__mockFirestoreRevenue.setDoc.mockResolvedValue(undefined);

      const result = await revenueSystem.processRevenueShare(mockPurchaseEvent);

      expect(result.creatorShare).toBe(2099); // $20.99 (70% of $29.99)
      expect(result.platformFee).toBe(900); // $9.00 (30% of $29.99)
      expect(result.transactionId).toBe('transaction-123');

      expect(mockDb.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          type: 'revenue_share',
          templateId: 'template-123',
          creatorId: 'creator-789',
          purchaserId: 'buyer-456',
          totalAmount: 2999,
          creatorShare: 2099,
          platformFee: 900,
          currency: 'USD',
          status: 'pending',
        }),
      );
    });

    it('should handle minimum platform fee', async () => {
      const smallPurchase: PurchaseEvent = {
        ...mockPurchaseEvent,
        amount: 100, // $1.00
        creatorShare: 90,
        platformFee: 10,
      };

      const mockDocRef = { id: 'transaction-123' };
      global.__mockFirestoreRevenue.doc.mockReturnValue(mockDocRef);
      global.__mockFirestoreRevenue.setDoc.mockResolvedValue(undefined);

      const result = await revenueSystem.processRevenueShare(smallPurchase);

      // Should apply minimum platform fee
      expect(result.platformFee).toBe(50); // $0.50 minimum
      expect(result.creatorShare).toBe(50); // Remaining amount
    });
  });

  describe('requestPayout', () => {
    it('should create payout request for creator', async () => {
      const payoutRequest: PayoutRequest = {
        creatorId: 'creator-789',
        amount: 10000, // $100.00
        currency: 'USD',
        method: 'bank_transfer',
        accountDetails: {
          type: 'bank_account',
          accountNumber: '****1234',
          routingNumber: '021000021',
        },
      };

      // Mock available balance
      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          availableBalance: 15000, // $150.00
        }),
      });

      const mockPayoutRef = { id: 'payout-123' };
      mockDb.doc.mockReturnValue(mockPayoutRef);
      global.__mockFirestoreRevenue.setDoc.mockResolvedValue(undefined);

      const result = await revenueSystem.requestPayout(payoutRequest);

      expect(result.payoutId).toBe('payout-123');
      expect(result.status).toBe('pending');
      expect(result.estimatedArrival).toBeDefined();
    });

    it('should reject payout request for insufficient balance', async () => {
      const payoutRequest: PayoutRequest = {
        creatorId: 'creator-789',
        amount: 20000, // $200.00
        currency: 'USD',
        method: 'bank_transfer',
        accountDetails: {
          type: 'bank_account',
          accountNumber: '****1234',
          routingNumber: '021000021',
        },
      };

      // Mock insufficient balance
      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          availableBalance: 10000, // $100.00
        }),
      });

      await expect(revenueSystem.requestPayout(payoutRequest)).rejects.toThrow(
        'Insufficient balance for payout request',
      );
    });

    it('should apply minimum payout amount', async () => {
      const payoutRequest: PayoutRequest = {
        creatorId: 'creator-789',
        amount: 500, // $5.00 (below minimum)
        currency: 'USD',
        method: 'bank_transfer',
        accountDetails: {
          type: 'bank_account',
          accountNumber: '****1234',
          routingNumber: '021000021',
        },
      };

      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ availableBalance: 15000 }),
      });

      await expect(revenueSystem.requestPayout(payoutRequest)).rejects.toThrow(
        'Minimum payout amount is $20.00',
      );
    });
  });

  describe('processPayout', () => {
    it('should process payout via Stripe transfer', async () => {
      const mockTransfer = {
        id: 'tr_123456789',
        amount: 10000,
        currency: 'usd',
        destination: 'acct_123456789',
      };

      mockStripe.transfers.create.mockResolvedValue(mockTransfer);
      global.__mockFirestoreRevenue.updateDoc.mockResolvedValue(undefined);

      const result = await revenueSystem.processPayout(
        'payout-123',
        'acct_123456789',
      );

      expect(result.transferId).toBe('tr_123456789');
      expect(result.status).toBe('completed');
      expect(mockStripe.transfers.create).toHaveBeenCalledWith({
        amount: expect.any(Number),
        currency: 'usd',
        destination: 'acct_123456789',
        transfer_group: 'payout-123',
      });
    });

    it('should handle payout processing errors', async () => {
      mockStripe.transfers.create.mockRejectedValue(
        new Error('Transfer failed'),
      );

      await expect(
        revenueSystem.processPayout('payout-123', 'acct_123456789'),
      ).rejects.toThrow('Failed to process payout');
    });
  });

  describe('generateRevenueReport', () => {
    it('should generate revenue report for creator', async () => {
      const mockTransactions = [
        {
          id: 'trans-1',
          data: () => ({
            templateId: 'template-1',
            totalAmount: 2999,
            creatorShare: 2099,
            platformFee: 900,
            purchaseDate: new Date('2024-01-01'),
          }),
        },
        {
          id: 'trans-2',
          data: () => ({
            templateId: 'template-2',
            totalAmount: 1999,
            creatorShare: 1399,
            platformFee: 600,
            purchaseDate: new Date('2024-01-15'),
          }),
        },
      ];

      global.__mockFirestoreRevenue.getDocs.mockResolvedValue({
        docs: mockTransactions,
      });

      const report = await revenueSystem.generateRevenueReport({
        creatorId: 'creator-789',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        templateId: undefined,
      });

      expect(report.totalRevenue).toBe(3498); // $34.98
      expect(report.totalTransactions).toBe(2);
      expect(report.averageTransactionValue).toBe(1749); // $17.49
      expect(report.templateBreakdown).toHaveLength(2);
    });

    it('should generate platform-wide revenue report', async () => {
      const mockTransactions = [
        {
          id: 'trans-1',
          data: () => ({
            creatorId: 'creator-1',
            totalAmount: 2999,
            creatorShare: 2099,
            platformFee: 900,
            purchaseDate: new Date('2024-01-01'),
          }),
        },
        {
          id: 'trans-2',
          data: () => ({
            creatorId: 'creator-2',
            totalAmount: 1999,
            creatorShare: 1399,
            platformFee: 600,
            purchaseDate: new Date('2024-01-15'),
          }),
        },
      ];

      global.__mockFirestoreRevenue.getDocs.mockResolvedValue({
        docs: mockTransactions,
      });

      const report = await revenueSystem.generateRevenueReport({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      });

      expect(report.totalRevenue).toBe(1500); // Platform fees only: $15.00
      expect(report.totalTransactions).toBe(2);
    });
  });

  describe('updateCreatorBalance', () => {
    it('should update creator balance after transaction', async () => {
      // Mock existing balance
      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          availableBalance: 5000, // $50.00
          totalEarned: 10000, // $100.00
        }),
      });

      global.__mockFirestoreRevenue.updateDoc.mockResolvedValue(undefined);

      await revenueSystem.updateCreatorBalance('creator-789', 2099); // $20.99

      expect(mockDb.updateDoc).toHaveBeenCalledWith(expect.anything(), {
        availableBalance: 7099, // $70.99
        totalEarned: 12099, // $120.99
        lastUpdated: expect.any(Object),
      });
    });

    it('should create balance record for new creator', async () => {
      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => false,
      });

      const mockDocRef = { id: 'balance-123' };
      global.__mockFirestoreRevenue.doc.mockReturnValue(mockDocRef);
      global.__mockFirestoreRevenue.setDoc.mockResolvedValue(undefined);

      await revenueSystem.updateCreatorBalance('creator-789', 2099);

      expect(mockDb.setDoc).toHaveBeenCalledWith(mockDocRef, {
        creatorId: 'creator-789',
        availableBalance: 2099,
        totalEarned: 2099,
        totalWithdrawn: 0,
        currency: 'USD',
        lastUpdated: expect.any(Object),
      });
    });
  });

  describe('getCreatorBalance', () => {
    it('should retrieve creator balance', async () => {
      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          availableBalance: 15000,
          totalEarned: 25000,
          totalWithdrawn: 10000,
          currency: 'USD',
        }),
      });

      const balance = await revenueSystem.getCreatorBalance('creator-789');

      expect(balance.availableBalance).toBe(15000);
      expect(balance.totalEarned).toBe(25000);
      expect(balance.totalWithdrawn).toBe(10000);
      expect(balance.currency).toBe('USD');
    });

    it('should return zero balance for new creator', async () => {
      global.__mockFirestoreRevenue.getDoc.mockResolvedValue({
        exists: () => false,
      });

      const balance = await revenueSystem.getCreatorBalance('creator-789');

      expect(balance.availableBalance).toBe(0);
      expect(balance.totalEarned).toBe(0);
      expect(balance.totalWithdrawn).toBe(0);
    });
  });

  describe('calculatePlatformFee', () => {
    it('should calculate platform fee correctly', () => {
      const fee = revenueSystem.calculatePlatformFee(2999, 30);
      expect(fee).toBe(900); // 30% of $29.99
    });

    it('should apply minimum platform fee', () => {
      const fee = revenueSystem.calculatePlatformFee(100, 10);
      expect(fee).toBe(50); // Minimum $0.50
    });

    it('should apply maximum platform fee', () => {
      const fee = revenueSystem.calculatePlatformFee(100000, 50);
      expect(fee).toBe(10000); // Maximum $100.00
    });
  });

  describe('formatCurrency', () => {
    it('should format currency amounts correctly', () => {
      expect(revenueSystem.formatCurrency(2999, 'USD')).toBe('$29.99');
      expect(revenueSystem.formatCurrency(100, 'USD')).toBe('$1.00');
      expect(revenueSystem.formatCurrency(0, 'USD')).toBe('$0.00');
    });
  });
});
