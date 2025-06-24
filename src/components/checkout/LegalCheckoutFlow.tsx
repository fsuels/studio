// src/components/checkout/LegalCheckoutFlow.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalCheckoutFlowProps {
  price: number;
  tax?: number;
  userState?: string;
  documentType: string;
  onPayment: () => void;
  className?: string;
}

interface TermsAcceptance {
  userId?: string;
  ip?: string;
  termsVersion: string;
  state?: string;
  timestamp: Date;
  scrolledToBottom: boolean;
  documentType: string;
}

const LegalCheckoutFlow: React.FC<LegalCheckoutFlowProps> = ({
  price,
  tax = 0,
  userState,
  documentType,
  onPayment,
  className,
}) => {
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [termsModalOpen, setTermsModalOpen] = React.useState(false);
  const [scrolledToBottom, setScrolledToBottom] = React.useState(false);
  const [acceptance, setAcceptance] = React.useState<TermsAcceptance | null>(
    null,
  );

  const isNorthCarolina = userState === 'NC';
  const total = price + tax;
  const termsVersion = '2025.1.0';

  // Track scroll position in terms modal
  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= 0.95 && !scrolledToBottom) {
      setScrolledToBottom(true);
    }
  };

  // Log acceptance event
  const logAcceptanceEvent = React.useCallback(
    async (accepted: boolean) => {
      if (!accepted) return;

      const acceptanceData: TermsAcceptance = {
        userId: 'current-user-id', // Replace with actual user ID
        ip: await getUserIP(),
        termsVersion,
        state: userState,
        timestamp: new Date(),
        scrolledToBottom,
        documentType,
      };

      setAcceptance(acceptanceData);

      // In real implementation, send to your logging service
      try {
        await fetch('/api/legal/log-acceptance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(acceptanceData),
        });
      } catch (error) {
        console.error('Failed to log terms acceptance:', error);
      }
    },
    [userState, scrolledToBottom, documentType, termsVersion],
  );

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked) {
      logAcceptanceEvent(true);
    }
  };

  const handlePayment = () => {
    if (termsAccepted && acceptance) {
      onPayment();
    }
  };

  const openTermsModal = () => {
    setTermsModalOpen(true);
    setScrolledToBottom(false);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Order Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{documentType}</span>
            <span className="font-medium">${price.toFixed(2)}</span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 dark:text-gray-300">Tax ({userState})</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Compliance Section */}
      <div className="rounded-lg border bg-gray-50 p-4">
        {/* Disclaimer Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <FileText className="h-3 w-3" />
            <span>DIY legal template · Not legal advice</span>
          </div>
        </div>

        {/* Terms Acceptance Checkbox */}
        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={termsAccepted}
              onCheckedChange={handleTermsChange}
              required
              className="mt-1"
            />
            <span className="text-sm leading-relaxed">
              I agree to the{' '}
              <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    onClick={openTermsModal}
                    className="underline hover:text-blue-600 transition-colors"
                  >
                    Terms & Disclaimer
                  </button>
                </DialogTrigger>
                <TermsModal
                  isNorthCarolina={isNorthCarolina}
                  onScroll={handleTermsScroll}
                  scrolledToBottom={scrolledToBottom}
                />
              </Dialog>
            </span>
          </label>
        </div>

        {/* State-Specific Notice for NC */}
        {isNorthCarolina && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                North Carolina purchasers: Standard warranty disclaimers do not
                apply. Disputes will be resolved in North Carolina courts.
              </p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={!termsAccepted}
          className="w-full"
          size="lg"
        >
          {termsAccepted ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Pay ${total.toFixed(2)}
            </div>
          ) : (
            `Accept Terms to Pay $${total.toFixed(2)}`
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Secure Checkout</span>
          </div>
          <span>•</span>
          <span>No Hidden Fees</span>
          <span>•</span>
          <span>Instant Download</span>
        </div>
      </div>

      {/* Optional Legal Review Upsell */}
      {termsAccepted && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 border-amber-300"
            >
              Optional
            </Badge>
            <div className="flex-1">
              <h4 className="font-medium text-amber-900 mb-1">
                Want Legal Review?
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                Have a licensed attorney review your completed document for
                accuracy and compliance.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 hover:bg-amber-100"
              >
                Add Legal Review (+$99)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Terms Modal Component
const TermsModal: React.FC<{
  isNorthCarolina: boolean;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrolledToBottom: boolean;
}> = ({ isNorthCarolina, onScroll, scrolledToBottom }) => {
  return (
    <DialogContent className="max-w-2xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          Important: Read Before You Buy
        </DialogTitle>
      </DialogHeader>

      <ScrollArea className="h-96 pr-4" onScrollCapture={onScroll}>
        <div className="space-y-4 text-sm">
          {/* Core Disclaimer */}
          <section>
            <h3 className="font-semibold mb-2">Legal Disclaimer</h3>
            <p className="text-gray-700 mb-3">
              <strong>
                123LegalDoc is not a law firm; no attorney-client relationship
                is created.
              </strong>
              This platform provides self-help legal document templates for
              informational purposes only. The information and templates are not
              legal advice and should not be used as a substitute for competent
              legal counsel.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h3 className="font-semibold mb-2">What You're Purchasing</h3>
            <p className="text-gray-700 mb-2">
              You are purchasing access to a digital document template that you
              can customize and download. This is a self-help legal form, not
              legal representation.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Instant download access to document template</li>
              <li>Fillable form with guidance instructions</li>
              <li>No ongoing legal services or advice included</li>
              <li>One-time purchase, no subscription</li>
            </ul>
          </section>

          {/* Warranties and Disclaimers */}
          {!isNorthCarolina && (
            <section>
              <h3 className="font-semibold mb-2">Warranties and Disclaimers</h3>
              <p className="text-gray-700 mb-2">
                THE TEMPLATE IS PROVIDED "AS-IS" WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                NON-INFRINGEMENT.
              </p>
              <p className="text-gray-700">
                We do not warrant that the template will meet your specific
                legal needs or that it will be suitable for your particular
                jurisdiction or situation.
              </p>
            </section>
          )}

          {/* North Carolina Specific Terms */}
          {isNorthCarolina && (
            <section className="p-3 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold mb-2 text-blue-900">
                North Carolina Purchasers
              </h3>
              <p className="text-blue-800 text-sm">
                The above warranty disclaimer does not apply to North Carolina
                purchasers. Any disputes will be resolved in North Carolina
                courts under North Carolina law.
              </p>
            </section>
          )}

          {/* Limitation of Liability */}
          <section>
            <h3 className="font-semibold mb-2">Limitation of Liability</h3>
            <p className="text-gray-700">
              In no event shall 123LegalDoc be liable for any indirect,
              incidental, special, consequential, or punitive damages arising
              from your use of the templates or services.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h3 className="font-semibold mb-2">Your Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Review the template carefully before use</li>
              <li>Consult with an attorney if you have legal questions</li>
              <li>Ensure the document meets your local legal requirements</li>
              <li>Understand that laws vary by jurisdiction</li>
              <li>Use the template at your own risk</li>
            </ul>
          </section>

          {/* Jurisdiction and Venue */}
          <section>
            <h3 className="font-semibold mb-2">Jurisdiction and Venue</h3>
            <p className="text-gray-700">
              {isNorthCarolina
                ? 'For North Carolina purchasers, disputes will be resolved in North Carolina courts under North Carolina law.'
                : 'These terms are governed by Delaware law. Any disputes will be resolved in Delaware courts.'}
            </p>
          </section>

          {/* Professional Legal Services */}
          <section>
            <h3 className="font-semibold mb-2">
              When to Seek Professional Help
            </h3>
            <p className="text-gray-700 mb-2">
              You should consult with a licensed attorney if:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Your situation involves complex legal issues</li>
              <li>Significant assets or legal rights are at stake</li>
              <li>
                You're unsure about legal requirements in your jurisdiction
              </li>
              <li>The document requires notarization or court filing</li>
              <li>You need legal advice about your specific situation</li>
            </ul>
          </section>

          {/* Terms Version */}
          <section className="text-xs text-gray-700 dark:text-gray-300 border-t pt-3">
            <p>Terms Version: 2025.1.0 | Last Updated: January 2025</p>
            <p>
              By purchasing, you acknowledge that you have read and understood
              these terms.
            </p>
          </section>
        </div>
      </ScrollArea>

      {/* Scroll Indicator */}
      {!scrolledToBottom && (
        <div className="text-xs text-center text-gray-700 dark:text-gray-300 border-t pt-2">
          <div className="flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Please scroll to read all terms
          </div>
        </div>
      )}
    </DialogContent>
  );
};

// Helper function to get user IP (mock implementation)
async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('/api/get-client-ip');
    const data = await response.json();
    return data.ip || '0.0.0.0';
  } catch {
    return '0.0.0.0';
  }
}

export default LegalCheckoutFlow;
