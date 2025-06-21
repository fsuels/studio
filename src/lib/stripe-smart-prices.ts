/** Enhanced Stripe Price Management with Smart Pricing Engine
 *  Multi-currency support, automatic tax handling, and purchase order integration
 */

/** Multi-currency Stripe Price IDs for Smart Pricing Engine */
export const SMART_PRICE_LOOKUP: Record<string, Record<string, string>> = {
  /* — subscription plans — */
  'starter': {
    USD: 'price_starter_monthly_usd',
    EUR: 'price_starter_monthly_eur', 
    GBP: 'price_starter_monthly_gbp',
  },
  'professional': {
    USD: 'price_professional_monthly_usd',
    EUR: 'price_professional_monthly_eur',
    GBP: 'price_professional_monthly_gbp',
  },
  'business': {
    USD: 'price_business_monthly_usd',
    EUR: 'price_business_monthly_eur',
    GBP: 'price_business_monthly_gbp',
  },
  'enterprise': {
    USD: 'price_enterprise_monthly_usd',
    EUR: 'price_enterprise_monthly_eur',
    GBP: 'price_enterprise_monthly_gbp',
  },
  /* — individual documents with currency support — */
  'bill-of-sale': {
    USD: 'price_bill_of_sale_usd',
    EUR: 'price_bill_of_sale_eur',
    GBP: 'price_bill_of_sale_gbp',
  },
  'residential-lease': {
    USD: 'price_residential_lease_usd',
    EUR: 'price_residential_lease_eur',
    GBP: 'price_residential_lease_gbp',
  },
  'employment-contract': {
    USD: 'price_employment_contract_usd',
    EUR: 'price_employment_contract_eur',
    GBP: 'price_employment_contract_gbp',
  },
  'nda': {
    USD: 'price_nda_usd',
    EUR: 'price_nda_eur',
    GBP: 'price_nda_gbp',
  },
};

/** Enhanced promo codes with international support */
export const SMART_COUPONS: Record<string, string> = {
  // Standard discounts
  SUMMER10: 'coupon_summer10', // 10% off
  BUNDLE20: 'coupon_bundle20', // 20% off
  
  // International customer incentives
  GLOBAL25: 'coupon_global25', // 25% off for international customers
  EULAUNCH: 'coupon_eu_launch', // Special launch offer for EU customers
  UKSPECIAL: 'coupon_uk_special', // UK market entry discount
  
  // Enterprise discounts
  ENTERPRISE50: 'coupon_enterprise50', // 50% off first month for enterprise
  ANNUALSAVE: 'coupon_annual_save', // Annual billing discount
  
  // Volume discounts
  TEAM10: 'coupon_team10', // 10+ user teams
  ENTERPRISE100: 'coupon_enterprise100', // 100+ user organizations
};

/** Get Stripe Price ID for a plan and currency */
export function getStripePriceId(planId: string, currency: string = 'USD'): string | null {
  const priceMap = SMART_PRICE_LOOKUP[planId];
  if (!priceMap) {
    console.warn(`No price mapping found for plan: ${planId}`);
    return null;
  }
  
  const priceId = priceMap[currency.toUpperCase()];
  if (!priceId) {
    console.warn(`No price ID found for plan: ${planId}, currency: ${currency}. Falling back to USD.`);
    return priceMap['USD'] || null;
  }
  
  return priceId;
}

/** Live currency conversion rates (fetch from API in production) */
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.80,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 149.50,
  CHF: 0.88,
  SEK: 10.85,
  NOK: 10.95,
};

/** Currency symbols for display */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
};

/** Convert price from USD to target currency */
export function convertPrice(usdPrice: number, targetCurrency: string): number {
  const rate = CURRENCY_RATES[targetCurrency.toUpperCase()] || 1.0;
  return Math.round(usdPrice * rate * 100) / 100; // Round to 2 decimal places
}

/** Format price for display in specific currency and locale */
export function formatPrice(amount: number, currency: string, locale?: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    CAD: 'en-CA',
    AUD: 'en-AU',
    JPY: 'ja-JP',
    CHF: 'de-CH',
    SEK: 'sv-SE',
    NOK: 'nb-NO',
  };

  try {
    return new Intl.NumberFormat(locale || localeMap[currency] || 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/** Get appropriate coupon for user's location and plan */
export function getRecommendedCoupon(
  userCountry: string,
  planId: string,
  isNewCustomer: boolean = true
): string | null {
  // Enterprise plans get special discounts
  if (planId === 'enterprise' && isNewCustomer) {
    return 'ENTERPRISE50';
  }
  
  // International customer incentives
  if (userCountry !== 'US') {
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'LU'];
    
    if (userCountry === 'GB') {
      return 'UKSPECIAL';
    } else if (euCountries.includes(userCountry)) {
      return 'EULAUNCH';
    } else {
      return 'GLOBAL25';
    }
  }
  
  // Standard US discounts
  if (planId === 'business' || planId === 'enterprise') {
    return 'BUNDLE20';
  }
  
  return null;
}

/** Validate currency is supported */
export function isSupportedCurrency(currency: string): boolean {
  return Object.keys(CURRENCY_RATES).includes(currency.toUpperCase());
}

/** Get all supported currencies */
export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCY_RATES);
}

/** Price localization based on user's country */
export function getLocalizedPricing(
  basePriceUSD: number,
  userCountry: string
): { currency: string; amount: number; displayPrice: string } {
  const currencyByCountry: Record<string, string> = {
    // North America
    US: 'USD',
    CA: 'CAD',
    
    // Europe (Eurozone)
    DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
    BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
    LU: 'EUR', MT: 'EUR', CY: 'EUR', SK: 'EUR', SI: 'EUR',
    EE: 'EUR', LV: 'EUR', LT: 'EUR',
    
    // Europe (Non-Eurozone)
    GB: 'GBP',
    CH: 'CHF',
    SE: 'SEK',
    NO: 'NOK',
    
    // Asia-Pacific
    AU: 'AUD',
    JP: 'JPY',
  };
  
  const currency = currencyByCountry[userCountry] || 'USD';
  const amount = currency === 'USD' ? basePriceUSD : convertPrice(basePriceUSD, currency);
  const displayPrice = formatPrice(amount, currency);
  
  return { currency, amount, displayPrice };
}

/** Tax information by country */
export const TAX_INFO: Record<string, {
  required: boolean;
  type: 'VAT' | 'GST' | 'Sales Tax' | 'None';
  rate?: number;
  name?: string;
}> = {
  // EU Countries (VAT required)
  DE: { required: true, type: 'VAT', rate: 19, name: 'Mehrwertsteuer' },
  FR: { required: true, type: 'VAT', rate: 20, name: 'TVA' },
  IT: { required: true, type: 'VAT', rate: 22, name: 'IVA' },
  ES: { required: true, type: 'VAT', rate: 21, name: 'IVA' },
  NL: { required: true, type: 'VAT', rate: 21, name: 'BTW' },
  BE: { required: true, type: 'VAT', rate: 21, name: 'BTW/TVA' },
  AT: { required: true, type: 'VAT', rate: 20, name: 'USt' },
  
  // UK
  GB: { required: true, type: 'VAT', rate: 20, name: 'VAT' },
  
  // Canada
  CA: { required: true, type: 'GST', name: 'GST/HST' },
  
  // Australia
  AU: { required: true, type: 'GST', rate: 10, name: 'GST' },
  
  // US (varies by state, handled by Stripe Tax)
  US: { required: true, type: 'Sales Tax', name: 'Sales Tax' },
};

/** Get tax information for a country */
export function getTaxInfo(countryCode: string) {
  return TAX_INFO[countryCode] || { required: false, type: 'None' as const };
}