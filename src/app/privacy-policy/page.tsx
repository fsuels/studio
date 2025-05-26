// src/app/privacy-policy/page.tsx
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Effective Date: [Insert Date]</p>

        <p>
          Welcome to 123LegalDoc (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). We are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our website and services (collectively,
          the &quot;Service&quot;). Please read this privacy policy carefully.
          If you do not agree with the terms of this privacy policy, please do
          not access the site.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Information We Collect
        </h2>
        <p>
          We may collect information about you in a variety of ways. The
          information we may collect via the Service includes:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <strong>Personal Data:</strong> Personally identifiable information,
            such as your name, email address, and telephone number, and
            demographic information, such as your age, gender, hometown, and
            interests, that you voluntarily give to us when you register with
            the Service or when you choose to participate in various activities
            related to the Service, such as online chat and message boards.
          </li>
          <li>
            <strong>Derivative Data:</strong> Information our servers
            automatically collect when you access the Service, such as your IP
            address, your browser type, your operating system, your access
            times, and the pages you have viewed directly before and after
            accessing the Service.
          </li>
          <li>
            <strong>Document Data:</strong> Information you provide when
            generating documents, including details about your situation, names,
            addresses, and other relevant data points required for the document.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Use of Your Information
        </h2>
        <p>
          Having accurate information about you permits us to provide you with a
          smooth, efficient, and customized experience. Specifically, we may use
          information collected about you via the Service to:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Create and manage your account.</li>
          <li>Generate legal documents based on your input.</li>
          <li>Email you regarding your account or order.</li>
          <li>Improve the efficiency and operation of the Service.</li>
          <li>
            Monitor and analyze usage and trends to improve your experience.
          </li>
          <li>Notify you of updates to the Service.</li>
          <li>
            Prevent fraudulent transactions, monitor against theft, and protect
            against criminal activity.
          </li>
          <li>Process payments and refunds.</li>
          <li>Respond to customer service requests.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Disclosure of Your Information
        </h2>
        <p>
          We may share information we have collected about you in certain
          situations. Your information may be disclosed as follows:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <strong>By Law or to Protect Rights:</strong> If we believe the
            release of information about you is necessary to respond to legal
            process, to investigate or remedy potential violations of our
            policies, or to protect the rights, property, and safety of others,
            we may share your information as permitted or required by any
            applicable law, rule, or regulation.
          </li>
          <li>
            <strong>Third-Party Service Providers:</strong> We may share your
            information with third parties that perform services for us or on
            our behalf, including payment processing, data analysis, email
            delivery, hosting services, customer service, and marketing
            assistance. This includes sharing necessary data with AI service
            providers (like Google Generative AI) solely for the purpose of
            providing core Service features like document type inference and
            potentially document content generation/review, under strict
            confidentiality agreements.
          </li>
          <li>
            <strong>Business Transfers:</strong> We may share or transfer your
            information in connection with, or during negotiations of, any
            merger, sale of company assets, financing, or acquisition of all or
            a portion of our business to another company.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Security of Your Information
        </h2>
        <p>
          We use administrative, technical, and physical security measures to
          help protect your personal information. While we have taken reasonable
          steps to secure the personal information you provide to us, please be
          aware that despite our efforts, no security measures are perfect or
          impenetrable, and no method of data transmission can be guaranteed
          against any interception or other type of misuse.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Policy for Children
        </h2>
        <p>
          We do not knowingly solicit information from or market to children
          under the age of 13. If you become aware of any data we have collected
          from children under age 13, please contact us using the contact
          information provided below.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page. You
          are advised to review this Privacy Policy periodically for any
          changes.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Contact Us
        </h2>
        <p>
          If you have questions or comments about this Privacy Policy, please
          contact us at: [Insert Contact Email/Address]
        </p>
      </div>
    </main>
  );
}
