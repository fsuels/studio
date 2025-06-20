// src/app/[locale]/terms-of-service/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { auditService } from '@/services/firebase-audit-service';

interface TermsPageProps {
  params: { locale: 'en' | 'es' };
}

export default function LocaleTermsPage({ params }: TermsPageProps) {
  const { locale } = params;
  const { user } = useAuth();

  useEffect(() => {
    // Log terms of service view
    const logTermsView = async () => {
      try {
        await auditService.logComplianceEvent('privacy_viewed', {
          policyType: 'terms_of_service',
          locale,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href
        });
      } catch (error) {
        console.error('Failed to log terms of service view:', error);
      }
    };

    logTermsView();
  }, [locale]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using 123LegalDoc, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily use 123LegalDoc for personal, non-commercial 
          transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
        <p className="mb-4">
          The materials on 123LegalDoc are provided on an 'as is' basis. 123LegalDoc makes 
          no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
        <p className="mb-4">
          In no event shall 123LegalDoc or its suppliers be liable for any damages arising 
          out of the use or inability to use the materials on 123LegalDoc's website.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Legal Advice Disclaimer</h2>
        <p className="mb-4">
          123LegalDoc is not a law firm and does not provide legal advice. The documents 
          generated are for informational purposes only.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact us at 
          legal@123legaldoc.com.
        </p>
      </div>
    </div>
  );
}
