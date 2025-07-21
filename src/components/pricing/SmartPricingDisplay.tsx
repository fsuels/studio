'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, GlobeIcon, ShieldCheckIcon, CreditCardIcon } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  localizedPrices: {
    USD: number;
    EUR: number;
    GBP: number;
    displayPrice?: number;
    displayCurrency?: string;
  };
  features: string[];
  popular?: boolean;
  allowPurchaseOrder?: boolean;
}

interface PricingSummary {
  userCurrency: string;
  userLocation: {
    country: string;
    countryCode: string;
    city: string;
  };
  availablePlans: PricingPlan[];
  recommendedPlan?: PricingPlan;
  taxInfo: {
    taxRequired: boolean;
    taxType: 'VAT' | 'GST' | 'Sales Tax' | 'None';
    taxName?: string;
  };
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SmartPricingDisplayProps {
  locale?: string;
  showLocation?: boolean;
  allowPurchaseOrders?: boolean;
}

export default function SmartPricingDisplay({ 
  locale = 'en',
  showLocation = true,
  allowPurchaseOrders = false 
}: SmartPricingDisplayProps) {
  const [pricingSummary, setPricingSummary] = useState<PricingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingSummary();
  }, []);

  const fetchPricingSummary = async () => {
    try {
      const response = await fetch('/api/pricing/smart-session');
      if (!response.ok) {
        throw new Error('Failed to fetch pricing information');
      }
      const data = await response.json();
      setPricingSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const handleSubscribe = async (planId: string, allowPO: boolean = false) => {
    setProcessingPlan(planId);
    
    try {
      const response = await fetch('/api/pricing/smart-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          locale,
          allowPurchaseOrder: allowPO,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Handle purchase order flow
      if (data.requiresPurchaseOrder) {
        window.location.href = `/purchase-order/${data.purchaseOrderId}`;
        return;
      }

      // Handle Stripe checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchPricingSummary} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!pricingSummary) {
    return null;
  }

  return (
    <div className="py-12">
      {/* Location and Tax Info */}
      {showLocation && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700 mb-4">
            <GlobeIcon className="h-4 w-4" />
            Pricing shown for {pricingSummary.userLocation.country} in {pricingSummary.userCurrency}
          </div>
          
          {pricingSummary.taxInfo.taxRequired && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-xs text-green-700">
              <ShieldCheckIcon className="h-3 w-3" />
              {pricingSummary.taxInfo.taxName} will be calculated at checkout
            </div>
          )}
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pricingSummary.availablePlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(
                      plan.localizedPrices.displayPrice || plan.localizedPrices[pricingSummary.userCurrency as keyof typeof plan.localizedPrices],
                      pricingSummary.userCurrency
                    )}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                onClick={() => handleSubscribe(plan.id, false)}
                disabled={processingPlan === plan.id}
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                {processingPlan === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </>
                )}
              </Button>

              {/* Purchase Order Option for Business Plans */}
              {allowPurchaseOrders && plan.allowPurchaseOrder && (
                <Button
                  onClick={() => handleSubscribe(plan.id, true)}
                  disabled={processingPlan === plan.id}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                >
                  Request Purchase Order
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Smart Pricing Features */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Smart Pricing Features</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <GlobeIcon className="h-8 w-8 text-blue-500" />
            <h4 className="font-medium">Multi-Currency</h4>
            <p className="text-sm text-gray-600">Prices shown in your local currency</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            <h4 className="font-medium">Automatic Tax</h4>
            <p className="text-sm text-gray-600">VAT/GST calculated automatically</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <CreditCardIcon className="h-8 w-8 text-purple-500" />
            <h4 className="font-medium">Flexible Billing</h4>
            <p className="text-sm text-gray-600">Card payments or purchase orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}