// src/app/[locale]/privacy-policy/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { auditService } from '@/services/firebase-audit-service';

interface PrivacyPolicyPageProps {
  params: { locale: 'en' | 'es' };
}

export default function LocalePrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const { locale } = params;
  const { user } = useAuth();

  useEffect(() => {
    // Log privacy policy view
    const logPolicyView = async () => {
      try {
        await auditService.logComplianceEvent('privacy_viewed', {
          locale,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href,
        });
      } catch (error) {
        console.error('Failed to log privacy policy view:', error);
      }
    };

    logPolicyView();
  }, [locale]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Information We Collect
        </h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you
          create an account, generate documents, or contact us for support.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve
          our services, including to generate legal documents and provide
          customer support.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Information Sharing
        </h2>
        <p className="mb-4">
          We do not share your personal information with third parties except as
          described in this privacy policy or with your consent.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal
          information. You may also have additional rights under applicable
          privacy laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at privacy@123legaldoc.com.
        </p>
      </div>
    </div>
  );
}
