// src/app/terms-of-service/page.tsx
import React from 'react';

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Effective Date: [Insert Date]</p>

        <p>
          Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;)
          carefully before using the 123LegalDoc website and services
          (the &quot;Service&quot;) operated by [Your Company Name] (&quot;us&quot;, &quot;we&quot;, or
          &quot;our&quot;).
        </p>

        <p>
          Your access to and use of the Service is conditioned upon your
          acceptance of and compliance with these Terms. These Terms apply to
          all visitors, users, and others who wish to access or use the Service.
          By accessing or using the Service, you agree to be bound by these
          Terms. If you disagree with any part of the terms, then you do not
          have permission to access the Service.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Use of Service</h2>
        <p>
          123LegalDoc provides AI-powered tools to assist users in identifying
          potential legal document needs and guiding them through a questionnaire
          to gather information for document generation. The Service includes
          features for voice input transcription, real-time editing, PDF preview,
          and digital signing (where applicable).
        </p>
        <p>
          You agree not to use the Service for any unlawful purpose or in any way
          that interrupts, damages, or impairs the service. You agree to provide
          accurate and complete information when prompted by the Service&apos;s
          questionnaires.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">AI and Content</h2>
        <p>
          The AI features are tools to assist you. The document type inference
          and generated content are based on the information you provide and
          patterns learned by the AI. They are not legal advice. We do not
          guarantee the accuracy, suitability, or completeness of any information
          or documents generated through the Service.
        </p>
        <p>
          You are solely responsible for reviewing and verifying the accuracy and
          appropriateness of any document generated using the Service before
          signing or using it.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">No Legal Advice</h2>
        <p>
          <strong>123LegalDoc is not a law firm and does not provide legal advice.</strong>
          Use of the Service does not create an attorney-client relationship.
          The information and documents provided through the Service are for
          informational purposes only and should not be considered a substitute
          for advice from a qualified legal professional. You should consult with
          a licensed attorney for advice regarding your specific legal situation.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Accounts</h2>
        <p>
          When you create an account with us, you guarantee that you are above
          the age of 18 and that the information you provide us is accurate,
          complete, and current at all times. You are responsible for maintaining
          the confidentiality of your account and password.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Intellectual Property</h2>
        <p>
          The Service and its original content (excluding content provided by users),
          features, and functionality are and will remain the exclusive property of
          [Your Company Name] and its licensors. The documents you generate using
          your own information are your property, but the underlying templates and
          software remain ours.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service
          immediately, without prior notice or liability, under our sole discretion,
          for any reason whatsoever and without limitation, including but not limited
          to a breach of the Terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Limitation of Liability</h2>
        <p>
          In no event shall [Your Company Name], nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including without
          limitation, loss of profits, data, use, goodwill, or other intangible
          losses, resulting from (i) your access to or use of or inability to access
          or use the Service; (ii) any conduct or content of any third party on the
          Service; (iii) any content obtained from the Service; and (iv) unauthorized
          access, use or alteration of your transmissions or content, whether based
          on warranty, contract, tort (including negligence) or any other legal theory,
          whether or not we have been informed of the possibility of such damage.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Disclaimer</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an
          &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties
          of any kind, whether express or implied, including, but not limited to,
          implied warranties of merchantability, fitness for a particular purpose,
          non-infringement or course of performance. We do not warrant that the
          Service will function uninterrupted, secure or available at any particular
          time or location; or that any errors or defects will be corrected.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of
          [Your Jurisdiction, e.g., State of California], United States, without regard
          to its conflict of law provisions.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these
          Terms at any time. We will provide notice of any changes by posting the new
          Terms of Service on this page. By continuing to access or use our Service
          after any revisions become effective, you agree to be bound by the revised
          terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          [Insert Contact Email/Address]
        </p>
      </div>
    </main>
  );
}
