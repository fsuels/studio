// Example React Components demonstrating A/B Testing Implementation
// Ready-to-use components with experiment tracking built-in

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useExperimentWithAuth,
  useFunnelTrackingWithAuth,
} from '@/lib/ab-testing/auth-integration';

// 1. Homepage Hero CTA Button with A/B Testing
export function HeroCTAButton({ className }: { className?: string }) {
  const { variant, isLoading, trackConversion } =
    useExperimentWithAuth('homepage_cta_color');
  const { trackStep } = useFunnelTrackingWithAuth();

  const handleClick = () => {
    trackConversion('homepage_cta_click');
    trackStep('visit', { source: 'homepage_hero', variant });
    // Navigate to document selection
    window.location.href = '/docs';
  };

  if (isLoading) {
    return (
      <Button className={className} disabled>
        Loading...
      </Button>
    );
  }

  // Control variant
  if (!variant || variant === 'variant_0') {
    return (
      <Button
        className={`${className} bg-blue-600 hover:bg-blue-700`}
        onClick={handleClick}
        size="lg"
      >
        Get Started
      </Button>
    );
  }

  // Treatment variant - Orange Action-Oriented
  return (
    <Button
      className={`${className} bg-orange-600 hover:bg-orange-700`}
      onClick={handleClick}
      size="lg"
    >
      Start My Document
    </Button>
  );
}

// 2. Checkout Button with Urgency Testing
export function CheckoutButton({
  onCheckout,
  className,
}: {
  onCheckout: () => void;
  className?: string;
}) {
  const { variant, isLoading, trackConversion } = useExperimentWithAuth(
    'checkout_button_urgency',
  );
  const { trackStep } = useFunnelTrackingWithAuth();

  const handleClick = () => {
    trackConversion('checkout_button_click');
    trackStep('checkout', { variant });
    onCheckout();
  };

  if (isLoading) {
    return (
      <Button className={className} disabled>
        Processing...
      </Button>
    );
  }

  const variants = {
    variant_0: { text: 'Continue', color: 'bg-blue-600 hover:bg-blue-700' },
    variant_1: {
      text: 'Get My Document Now',
      color: 'bg-red-600 hover:bg-red-700',
    },
    variant_2: {
      text: 'Create Legal Document',
      color: 'bg-green-600 hover:bg-green-700',
    },
  };

  const config =
    variants[variant as keyof typeof variants] || variants.variant_0;

  return (
    <Button
      className={`${className} ${config.color}`}
      onClick={handleClick}
      size="lg"
    >
      {config.text}
    </Button>
  );
}

// 3. Homepage Headlines with Value Prop Testing
export function HeroHeadlines() {
  const { variant, isLoading, trackConversion } = useExperimentWithAuth(
    'homepage_headline_value_prop',
  );

  React.useEffect(() => {
    if (!isLoading && variant) {
      // Track headline impression
      trackConversion('headline_impression');
    }
  }, [variant, isLoading]);

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="h-12 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  const headlines = {
    variant_0: {
      main: 'Legal Documents You Can Trust',
      sub: 'Professionally drafted legal forms for all your needs',
    },
    variant_1: {
      main: 'Legal Documents in Minutes, Not Hours',
      sub: 'Create legally-binding documents instantly with our simple wizard',
    },
    variant_2: {
      main: 'Save $500+ on Legal Fees',
      sub: 'Get lawyer-quality documents without the lawyer prices',
    },
  };

  const content =
    headlines[variant as keyof typeof headlines] || headlines.variant_0;

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        {content.main}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{content.sub}</p>
    </div>
  );
}

// 4. Trust Signals for Checkout
export function CheckoutTrustSignals() {
  const { variant, isLoading, trackConversion } = useExperimentWithAuth(
    'checkout_trust_signals',
  );

  React.useEffect(() => {
    if (!isLoading && variant) {
      trackConversion('trust_signals_impression');
    }
  }, [variant, isLoading]);

  if (isLoading) {
    return <div className="h-16 bg-gray-100 animate-pulse rounded"></div>;
  }

  // Control - no trust signals
  if (!variant || variant === 'variant_0') {
    return null;
  }

  // Security badges only
  if (variant === 'variant_1') {
    return (
      <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white text-xs">🔒</span>
          </div>
          <span className="text-sm text-gray-600">
            Your data is protected with 256-bit SSL encryption
          </span>
        </div>
      </div>
    );
  }

  // Money-back guarantee
  if (variant === 'variant_2') {
    return (
      <div className="bg-green-50 p-4 rounded border border-green-200">
        <div className="text-center">
          <div className="font-semibold text-green-800">
            100% Money-Back Guarantee
          </div>
          <div className="text-sm text-green-700 mt-1">
            If you're not completely satisfied, we'll refund your purchase
            within 30 days.
          </div>
        </div>
      </div>
    );
  }

  // Combined trust signals
  if (variant === 'variant_3') {
    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">🔒</span>
            </div>
            <span className="text-sm text-gray-600">Secure & encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Money-back guarantee</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm italic text-gray-600">
            "Saved me $800 in legal fees!" - Sarah M.
          </div>
          <div className="text-xs text-green-600 mt-1">
            ⭐⭐⭐⭐⭐ 4.9/5 from 12,000+ customers
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// 5. Pricing Display with Different Formats
export function DocumentPricing({
  basePrice = 29.99,
  documentType = 'Legal Document',
  onPurchase,
}: {
  basePrice?: number;
  documentType?: string;
  onPurchase?: () => void;
}) {
  const { variant, isLoading, trackConversion } = useExperimentWithAuth(
    'pricing_display_format',
  );

  const handlePurchaseClick = () => {
    trackConversion('pricing_purchase_click');
    onPurchase?.();
  };

  if (isLoading) {
    return <div className="h-24 bg-gray-200 animate-pulse rounded"></div>;
  }

  // Control - Simple price
  if (!variant || variant === 'variant_0') {
    return (
      <Card className="p-4">
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">${basePrice}</div>
            <Button onClick={handlePurchaseClick} className="mt-3 w-full">
              Purchase Document
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Lawyer comparison
  if (variant === 'variant_1') {
    const lawyerPrice = basePrice * 17; // ~$500 for $30 doc
    const savings = lawyerPrice - basePrice;

    return (
      <Card className="p-4 border-green-200">
        <CardContent>
          <div className="text-center">
            <div className="text-sm text-gray-500 line-through">
              Lawyer fees: ${lawyerPrice.toFixed(0)}+
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${basePrice}
            </div>
            <div className="text-sm font-semibold text-green-600">
              Save ${savings.toFixed(0)}+
            </div>
            <Badge variant="secondary" className="mt-2">
              94% Savings
            </Badge>
            <Button
              onClick={handlePurchaseClick}
              className="mt-3 w-full bg-green-600 hover:bg-green-700"
            >
              Get Instant Savings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Value bundle
  if (variant === 'variant_2') {
    return (
      <Card className="p-4 border-blue-200">
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">${basePrice}</div>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Legal {documentType}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Step-by-step instructions</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>30-day email support</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Instant download</span>
              </div>
            </div>
            <Button onClick={handlePurchaseClick} className="mt-4 w-full">
              Get Complete Package
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

// 6. Social Proof Elements
export function SocialProofBanner() {
  const { variant, isLoading, trackConversion } = useExperimentWithAuth(
    'homepage_social_proof',
  );

  React.useEffect(() => {
    if (!isLoading && variant) {
      trackConversion('social_proof_impression');
    }
  }, [variant, isLoading]);

  if (isLoading) {
    return <div className="h-12 bg-gray-100 animate-pulse rounded"></div>;
  }

  // Control - no social proof
  if (!variant || variant === 'variant_0') {
    return null;
  }

  // Customer count only
  if (variant === 'variant_1') {
    return (
      <div className="text-center py-4">
        <div className="text-sm text-gray-600">
          Join 50,000+ customers who trust 123LegalDoc
        </div>
      </div>
    );
  }

  // Recent activity
  if (variant === 'variant_2') {
    const [count, setCount] = React.useState(127);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCount((c) => c + Math.floor(Math.random() * 3));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="text-center py-4">
        <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>{count} documents created in the last hour</span>
        </div>
      </div>
    );
  }

  // Combined social proof
  if (variant === 'variant_3') {
    return (
      <div className="text-center py-4 space-y-2">
        <div className="text-sm text-gray-600">
          Trusted by 50,000+ customers worldwide
        </div>
        <div className="text-xs text-gray-500 italic">
          "Saved me hours and hundreds of dollars!" - Mike T.
        </div>
        <div className="text-xs text-green-600 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live: 247 documents created today</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-yellow-500">
          ⭐⭐⭐⭐⭐{' '}
          <span className="text-xs text-gray-500 ml-1">4.9/5 rating</span>
        </div>
      </div>
    );
  }

  return null;
}

// 7. Simplified Signup Form
export function ExperimentalSignupForm({
  onSignup,
}: {
  onSignup: (data: any) => void;
}) {
  const { variant, isLoading, trackConversion } =
    useExperimentWithAuth('signup_form_length');
  const [formData, setFormData] = React.useState({
    email: '',
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('signup_form_submit');
    onSignup(formData);
  };

  if (isLoading) {
    return <div className="h-32 bg-gray-200 animate-pulse rounded"></div>;
  }

  // Control - full form
  if (!variant || variant === 'variant_0') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    );
  }

  // Email only variant
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Enter your email to get started"
        />
      </div>
      <Button type="submit" className="w-full">
        Get Started Instantly
      </Button>
      <div className="text-xs text-gray-500 text-center">
        You can add more details later
      </div>
    </form>
  );
}

// Usage Example Component
export function ABTestingDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">A/B Testing Demo</h1>
        <p className="text-gray-600">
          This page demonstrates various A/B tests in action. Refresh to see
          different variants.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
        <div className="bg-gray-50 p-8 rounded-lg">
          <HeroHeadlines />
          <div className="mt-6 text-center">
            <HeroCTAButton />
          </div>
          <SocialProofBanner />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Pricing Display</h2>
        <div className="max-w-sm mx-auto">
          <DocumentPricing
            basePrice={29.99}
            documentType="Bill of Sale"
            onPurchase={() => alert('Purchase clicked!')}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Checkout Trust Signals</h2>
        <CheckoutTrustSignals />
        <div className="mt-4 text-center">
          <CheckoutButton onCheckout={() => alert('Checkout clicked!')} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Signup Form</h2>
        <div className="max-w-md mx-auto">
          <ExperimentalSignupForm
            onSignup={(data) => console.log('Signup:', data)}
          />
        </div>
      </section>
    </div>
  );
}
