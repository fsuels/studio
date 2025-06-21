'use client';

import React from 'react';
import Link from 'next/link';
import { useTenant } from '@/contexts/TenantContext';
import {
  useTenantBranding,
  useCompanyInfo,
} from '@/contexts/TenantBrandingContext';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export function TenantFooter() {
  const { tenant } = useTenant();
  const { isWhiteLabel } = useTenantBranding();
  const { companyName, footerText, supportEmail, termsUrl, privacyUrl } =
    useCompanyInfo();

  if (!tenant) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {companyName}
            </h3>

            {tenant.description && (
              <p className="text-gray-600 mb-4 max-w-md">
                {tenant.description}
              </p>
            )}

            {footerText && (
              <p className="text-gray-600 mb-4 max-w-md">{footerText}</p>
            )}

            {/* Contact Information */}
            <div className="space-y-2">
              {supportEmail && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a
                    href={`mailto:${supportEmail}`}
                    className="hover:text-gray-900"
                  >
                    {supportEmail}
                  </a>
                </div>
              )}

              {tenant.contactPhone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a
                    href={`tel:${tenant.contactPhone}`}
                    className="hover:text-gray-900"
                  >
                    {tenant.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/tenant/${tenant.slug}/documents`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Create Documents
                </Link>
              </li>
              <li>
                <Link
                  href={`/tenant/${tenant.slug}/templates`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Browse Templates
                </Link>
              </li>
              <li>
                <Link
                  href={`/tenant/${tenant.slug}/help`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {termsUrl ? (
                <li>
                  <a
                    href={termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    Terms of Service
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
              ) : (
                <li>
                  <Link
                    href={`/tenant/${tenant.slug}/terms`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Terms of Service
                  </Link>
                </li>
              )}

              {privacyUrl ? (
                <li>
                  <a
                    href={privacyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
              ) : (
                <li>
                  <Link
                    href={`/tenant/${tenant.slug}/privacy`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href={`/tenant/${tenant.slug}/disclaimer`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} {companyName}. All rights reserved.
            </p>

            {/* Powered by link for non-white-label */}
            {!isWhiteLabel && (
              <p className="text-sm text-gray-500 mt-4 md:mt-0">
                Powered by{' '}
                <Link
                  href="https://123legaldoc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  123LegalDoc
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
