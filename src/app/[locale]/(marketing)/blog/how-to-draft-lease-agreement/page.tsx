// Example Blog Post with Internal Linking
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { CategoryDocumentsWidget, BlogFooterLinks } from '@/components/blog/InternalLinkWidget';

export const metadata: Metadata = {
  title: 'How to Draft a Lease Agreement: Complete Guide 2024 | 123LegalDoc',
  description: 'Learn how to draft a comprehensive lease agreement with our step-by-step guide. Includes state requirements, key clauses, and free template.',
  keywords: 'lease agreement, rental agreement, landlord tenant, property lease, lease template',
  openGraph: {
    title: 'How to Draft a Lease Agreement: Complete Guide 2024',
    description: 'Professional guide to creating legally sound lease agreements with expert tips and free templates.',
    type: 'article',
    publishedTime: '2024-12-16',
    authors: ['123LegalDoc Legal Team'],
  }
};

interface PageProps {
  params: { locale: 'en' | 'es' };
}

export default function LeaseAgreementBlogPost({ params }: PageProps) {
  const { locale } = params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                How to Draft a Lease Agreement: Complete Guide 2024
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime="2024-12-16">December 16, 2024</time>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>123LegalDoc Legal Team</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Creating a comprehensive lease agreement is essential for protecting both landlords and tenants. 
                A well-drafted lease agreement establishes clear expectations and helps prevent costly disputes.
              </p>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2>What is a Lease Agreement?</h2>
              
              <p>
                A lease agreement is a legally binding contract between a landlord and tenant that outlines 
                the terms and conditions of renting a property. Our{' '}
                <Link 
                  href={`/${locale}/docs/lease-agreement`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                >
                  lease agreement template
                </Link>{' '}
                provides a professional foundation for your rental relationship.
              </p>

              <CategoryDocumentsWidget category="real-estate" maxLinks={3} />

              <h2>Key Components of a Lease Agreement</h2>

              <h3>1. Property Details</h3>
              <ul>
                <li>Complete property address</li>
                <li>Description of rental unit</li>
                <li>Included amenities and fixtures</li>
                <li>Parking arrangements</li>
              </ul>

              <h3>2. Lease Terms</h3>
              <ul>
                <li>Lease duration (month-to-month or fixed-term)</li>
                <li>Rent amount and due date</li>
                <li>Security deposit requirements</li>
                <li>Late fees and penalties</li>
              </ul>

              <h3>3. Tenant and Landlord Responsibilities</h3>
              <p>
                Clearly defining responsibilities prevents misunderstandings. When managing rental properties 
                as a business, you may also need to hire property managers. Our{' '}
                <Link 
                  href={`/${locale}/docs/employment-contract`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                >
                  employment contract template
                </Link>{' '}
                can help establish clear job expectations for your staff.
              </p>

              <h2>State-Specific Requirements</h2>
              
              <p>
                Different states have varying requirements for lease agreements. It's crucial to understand 
                your local laws:
              </p>

              <ul>
                <li><strong>California:</strong> Rent control laws and tenant protection acts</li>
                <li><strong>Texas:</strong> Property code requirements and security deposit limits</li>
                <li><strong>New York:</strong> Rent stabilization regulations and disclosure requirements</li>
                <li><strong>Florida:</strong> Landlord-tenant act provisions</li>
              </ul>

              <h2>Common Lease Agreement Clauses</h2>

              <h3>Maintenance and Repairs</h3>
              <p>
                Specify who handles different types of maintenance. For major repairs requiring contractors, 
                having a solid{' '}
                <Link 
                  href={`/${locale}/docs/independent-contractor-agreement`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                >
                  independent contractor agreement
                </Link>{' '}
                protects your interests.
              </p>

              <h3>Pet Policy</h3>
              <p>
                Clearly state whether pets are allowed, any pet deposits, and breed restrictions.
              </p>

              <h3>Subletting and Assignment</h3>
              <p>
                Define whether tenants can sublet the property and under what conditions.
              </p>

              <h2>Legal Protection and Documentation</h2>
              
              <p>
                Beyond the lease agreement itself, consider these additional protective measures:
              </p>

              <ul>
                <li>
                  <Link 
                    href={`/${locale}/docs/property-deed`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                  >
                    Property deed verification
                  </Link> to confirm ownership
                </li>
                <li>
                  <Link 
                    href={`/${locale}/docs/eviction-notice`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                  >
                    Eviction notice templates
                  </Link> for non-compliance situations
                </li>
                <li>Insurance documentation and liability waivers</li>
              </ul>

              <h2>Digital Age Considerations</h2>
              
              <p>
                Modern lease agreements should address contemporary issues:
              </p>

              <ul>
                <li>Internet and utility responsibilities</li>
                <li>Smart home device policies</li>
                <li>Digital payment methods</li>
                <li>Communication preferences</li>
              </ul>

              <h2>Conclusion</h2>
              
              <p>
                A properly drafted lease agreement protects both parties and ensures a smooth rental 
                relationship. By including all necessary clauses and following state-specific requirements, 
                you create a solid foundation for your landlord-tenant relationship.
              </p>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Ready to Create Your Lease Agreement?
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  Use our professionally drafted lease agreement template to get started today. 
                  It includes all essential clauses and can be customized for your specific needs.
                </p>
                <Link
                  href={`/${locale}/docs/lease-agreement`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Lease Agreement Template
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>

            {/* Footer Links */}
            <BlogFooterLinks 
              keywords={['lease agreement', 'rental agreement', 'property lease', 'landlord tenant']}
              maxLinks={4}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Table of Contents */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2 text-sm">
                <a href="#what-is-lease" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  What is a Lease Agreement?
                </a>
                <a href="#key-components" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Key Components
                </a>
                <a href="#state-requirements" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  State-Specific Requirements
                </a>
                <a href="#common-clauses" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Common Clauses
                </a>
                <a href="#legal-protection" className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Legal Protection
                </a>
              </nav>
            </div>

            {/* Related Documents Widget */}
            <CategoryDocumentsWidget category="real-estate" maxLinks={4} />

            {/* CTA Widget */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                Need Legal Help?
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm mb-4">
                Get professional legal document templates that comply with your state's laws.
              </p>
              <Link
                href={`/${locale}/templates`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Browse All Templates
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}