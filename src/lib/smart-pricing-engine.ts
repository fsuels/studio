// Smart Pricing & Tax Engine
// Multi-currency plans, automatic VAT/GST handling, prorated upgrades, purchase-order billing

import { getLocationFromIP } from './geolocation';
import { 
  getStripePriceId, 
  convertPrice, 
  formatPrice as formatCurrency, 
  getLocalizedPricing,
  getTaxInfo as getCountryTaxInfo,
  getRecommendedCoupon 
} from './stripe-smart-prices';

export interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  baseCurrency: 'USD';
  features: string[];
  stripePriceIds: {
    USD: string;
    EUR: string;
    GBP: string;
  };
  localizedPrices: {
    USD: number;
    EUR: number;
    GBP: number;
  };
  popular?: boolean;
  allowPurchaseOrder?: boolean;
}

export interface PurchaseOrderRequest {
  id: string;
  companyName: string;
  contactEmail: string;
  contactName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    currency: string;
    totalPrice: number;
  }>;
  totalAmount: number;
  currency: string;
  paymentTerms: 'net15' | 'net30' | 'net45' | 'net60';
  poNumber?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: Date;
  dueDate: Date;
}

export class SmartPricingEngine {
  private static instance: SmartPricingEngine;
  private exchangeRates: Map<string, number> = new Map();
  private lastRateUpdate: number = 0;
  private readonly RATE_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  private pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      basePrice: 29,
      baseCurrency: 'USD',
      stripePriceIds: {
        USD: 'price_starter_monthly_usd',
        EUR: 'price_starter_monthly_eur',
        GBP: 'price_starter_monthly_gbp',
      },
      localizedPrices: {
        USD: 29,
        EUR: 26,
        GBP: 23,
      },
      features: [
        '5 documents per month',
        'Basic templates',
        'PDF download',
        'Email support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      basePrice: 79,
      baseCurrency: 'USD',
      stripePriceIds: {
        USD: 'price_professional_monthly_usd',
        EUR: 'price_professional_monthly_eur',
        GBP: 'price_professional_monthly_gbp',
      },
      localizedPrices: {
        USD: 79,
        EUR: 72,
        GBP: 63,
      },
      popular: true,
      features: [
        '25 documents per month',
        'All templates',
        'PDF + Word download',
        'E-signatures included',
        'AI document analysis',
        'Priority support',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      basePrice: 199,
      baseCurrency: 'USD',
      stripePriceIds: {
        USD: 'price_business_monthly_usd',
        EUR: 'price_business_monthly_eur',
        GBP: 'price_business_monthly_gbp',
      },
      localizedPrices: {
        USD: 199,
        EUR: 183,
        GBP: 159,
      },
      allowPurchaseOrder: true,
      features: [
        'Unlimited documents',
        'Team collaboration',
        'API access',
        'Custom templates',
        'Advanced AI features',
        'Phone support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 499,
      baseCurrency: 'USD',
      stripePriceIds: {
        USD: 'price_enterprise_monthly_usd',
        EUR: 'price_enterprise_monthly_eur',
        GBP: 'price_enterprise_monthly_gbp',
      },
      localizedPrices: {
        USD: 499,
        EUR: 459,
        GBP: 399,
      },
      allowPurchaseOrder: true,
      features: [
        'Everything in Business',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment',
      ],
    },
  ];

  public static getInstance(): SmartPricingEngine {
    if (!SmartPricingEngine.instance) {
      SmartPricingEngine.instance = new SmartPricingEngine();
    }
    return SmartPricingEngine.instance;
  }

  constructor() {
    this.initializeExchangeRates();
  }

  private async initializeExchangeRates(): Promise<void> {
    // Initialize with static rates, update with live rates in production
    this.exchangeRates.set('USD', 1.0);
    this.exchangeRates.set('EUR', 0.92);
    this.exchangeRates.set('GBP', 0.80);
    this.lastRateUpdate = Date.now();

    // In production, fetch live rates
    if (process.env.NODE_ENV === 'production') {
      await this.updateExchangeRates();
    }
  }

  private async updateExchangeRates(): Promise<void> {
    try {
      // Use a free exchange rate API (example: exchangerate-api.com)
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const data = await response.json();

      this.exchangeRates.set('USD', 1.0);
      this.exchangeRates.set('EUR', data.rates.EUR);
      this.exchangeRates.set('GBP', data.rates.GBP);
      this.lastRateUpdate = Date.now();

      console.log('✅ Exchange rates updated', {
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
      });
    } catch (error) {
      console.warn('⚠️  Failed to update exchange rates, using cached rates');
    }
  }

  // Get user's currency based on their IP location
  async getUserCurrency(request: Request): Promise<string> {
    try {
      const ip = this.getClientIP(request);
      const location = await getLocationFromIP(ip);

      // Map countries to preferred currencies
      const currencyMap: Record<string, string> = {
        US: 'USD',
        CA: 'USD',
        MX: 'USD',
        GB: 'GBP',
        IE: 'EUR',
        FR: 'EUR',
        DE: 'EUR',
        ES: 'EUR',
        IT: 'EUR',
        NL: 'EUR',
        BE: 'EUR',
        AT: 'EUR',
        PT: 'EUR',
        FI: 'EUR',
        LU: 'EUR',
        MT: 'EUR',
        CY: 'EUR',
        SK: 'EUR',
        SI: 'EUR',
        EE: 'EUR',
        LV: 'EUR',
        LT: 'EUR',
        // Add more as needed
      };

      return currencyMap[location.countryCode] || 'USD';
    } catch (error) {
      console.warn('Failed to detect user currency, defaulting to USD');
      return 'USD';
    }
  }

  private getClientIP(request: Request): string {
    const headers = [
      'cf-connecting-ip',
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
    ];

    for (const header of headers) {
      const value = request.headers.get(header);
      if (value) {
        return value.split(',')[0].trim();
      }
    }

    return '127.0.0.1';
  }

  // Get pricing plan with localized prices
  async getPricingPlans(
    currency: string = 'USD',
    userLocation?: { countryCode: string; stateCode?: string }
  ): Promise<PricingPlan[]> {
    // Ensure exchange rates are fresh
    if (Date.now() - this.lastRateUpdate > this.RATE_CACHE_DURATION) {
      await this.updateExchangeRates();
    }

    return this.pricingPlans.map((plan) => ({
      ...plan,
      localizedPrices: {
        ...plan.localizedPrices,
        displayPrice: plan.localizedPrices[currency as keyof typeof plan.localizedPrices] || plan.basePrice,
        displayCurrency: currency,
      },
    }));
  }



  // Create purchase order request for B2B customers
  private async createPurchaseOrderRequest(
    plan: PricingPlan,
    currency: string,
    location: any,
    options: any
  ): Promise<{ purchaseOrderId: string; requiresPurchaseOrder: boolean }> {
    const purchaseOrderId = `po_${Date.now()}_${plan.id}`;
    
    // This would be stored in your database
    const poRequest: PurchaseOrderRequest = {
      id: purchaseOrderId,
      companyName: '', // To be filled by user
      contactEmail: options.customerEmail || '',
      contactName: '',
      billingAddress: {
        line1: '',
        city: location.city || '',
        state: location.stateCode || '',
        postal_code: '',
        country: location.countryCode || '',
      },
      items: [
        {
          description: `${plan.name} Plan - Monthly Subscription`,
          quantity: 1,
          unitPrice: plan.localizedPrices[currency as keyof typeof plan.localizedPrices],
          currency,
          totalPrice: plan.localizedPrices[currency as keyof typeof plan.localizedPrices],
        },
      ],
      totalAmount: plan.localizedPrices[currency as keyof typeof plan.localizedPrices],
      currency,
      paymentTerms: 'net30',
      status: 'pending',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    console.log('✅ Created purchase order request', {
      purchaseOrderId,
      plan: plan.name,
      currency,
      amount: poRequest.totalAmount,
    });

    return { purchaseOrderId, requiresPurchaseOrder: true };
  }

  // Format price for display
  formatPrice(
    amount: number,
    currency: string,
    locale?: string
  ): string {
    const localeMap: Record<string, string> = {
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
    };

    return new Intl.NumberFormat(locale || localeMap[currency] || 'en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Get tax information for a location
  async getTaxInfo(
    countryCode: string,
    stateCode?: string
  ): Promise<{
    taxRequired: boolean;
    taxType: 'VAT' | 'GST' | 'Sales Tax' | 'None';
    taxRate?: number;
    taxName?: string;
  }> {
    // EU VAT
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    ];

    if (euCountries.includes(countryCode)) {
      return {
        taxRequired: true,
        taxType: 'VAT',
        taxName: 'Value Added Tax',
      };
    }

    // UK VAT
    if (countryCode === 'GB') {
      return {
        taxRequired: true,
        taxType: 'VAT',
        taxRate: 20,
        taxName: 'Value Added Tax',
      };
    }

    // Canada GST/HST
    if (countryCode === 'CA') {
      return {
        taxRequired: true,
        taxType: 'GST',
        taxName: 'Goods and Services Tax',
      };
    }

    // Australia GST
    if (countryCode === 'AU') {
      return {
        taxRequired: true,
        taxType: 'GST',
        taxRate: 10,
        taxName: 'Goods and Services Tax',
      };
    }

    // US Sales Tax (varies by state)
    if (countryCode === 'US') {
      const salesTaxStates = ['CA', 'NY', 'TX', 'FL', 'WA']; // Simplified
      if (stateCode && salesTaxStates.includes(stateCode)) {
        return {
          taxRequired: true,
          taxType: 'Sales Tax',
          taxName: 'Sales Tax',
        };
      }
    }

    return {
      taxRequired: false,
      taxType: 'None',
    };
  }

  // Handle prorated upgrades/downgrades
  async calculateProration(
    currentPlanId: string,
    newPlanId: string,
    billingPeriodStart: Date,
    billingPeriodEnd: Date,
    currency: string = 'USD'
  ): Promise<{
    creditAmount: number;
    chargeAmount: number;
    netAmount: number;
    proratedDays: number;
  }> {
    const currentPlan = this.pricingPlans.find((p) => p.id === currentPlanId);
    const newPlan = this.pricingPlans.find((p) => p.id === newPlanId);

    if (!currentPlan || !newPlan) {
      throw new Error('Plan not found for proration calculation');
    }

    const now = new Date();
    const totalDays = Math.ceil(
      (billingPeriodEnd.getTime() - billingPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingDays = Math.ceil(
      (billingPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const currentPrice = currentPlan.localizedPrices[currency as keyof typeof currentPlan.localizedPrices];
    const newPrice = newPlan.localizedPrices[currency as keyof typeof newPlan.localizedPrices];

    const dailyCurrentRate = currentPrice / totalDays;
    const dailyNewRate = newPrice / totalDays;

    const creditAmount = dailyCurrentRate * remainingDays;
    const chargeAmount = dailyNewRate * remainingDays;
    const netAmount = chargeAmount - creditAmount;

    return {
      creditAmount: Math.round(creditAmount * 100) / 100,
      chargeAmount: Math.round(chargeAmount * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100,
      proratedDays: remainingDays,
    };
  }

  // Get pricing summary for a request
  async getPricingSummary(request: Request, planId?: string): Promise<{
    userCurrency: string;
    userLocation: any;
    availablePlans: PricingPlan[];
    recommendedPlan?: PricingPlan;
    taxInfo: any;
  }> {
    const userCurrency = await this.getUserCurrency(request);
    const ip = this.getClientIP(request);
    const userLocation = await getLocationFromIP(ip);
    
    const availablePlans = await this.getPricingPlans(userCurrency, userLocation);
    const taxInfo = await this.getTaxInfo(userLocation.countryCode, userLocation.stateCode);
    
    const recommendedPlan = planId 
      ? availablePlans.find((p) => p.id === planId)
      : availablePlans.find((p) => p.popular);

    return {
      userCurrency,
      userLocation,
      availablePlans,
      recommendedPlan,
      taxInfo,
    };
  }
}

// Export singleton instance
export const smartPricingEngine = SmartPricingEngine.getInstance();