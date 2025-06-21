import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ArrowLeft, HelpCircle, Mail } from 'lucide-react';

interface TenantNotFoundPageProps {
  searchParams: { slug?: string };
}

export default function TenantNotFoundPage({ searchParams }: TenantNotFoundPageProps) {
  const { slug } = searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Building className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Organization Not Found</CardTitle>
            <CardDescription>
              {slug ? (
                <>The organization "<strong>{slug}</strong>" could not be found or is no longer active.</>
              ) : (
                <>The requested organization could not be found.</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>This could happen if:</p>
              <ul className="mt-2 space-y-1 text-left list-disc list-inside">
                <li>The organization link has expired</li>
                <li>The organization has been deactivated</li>
                <li>There's a typo in the web address</li>
                <li>You don't have permission to access this organization</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to 123LegalDoc
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/support">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Need help? Email us at{' '}
                <a 
                  href="mailto:support@123legaldoc.com" 
                  className="text-blue-600 hover:underline"
                >
                  support@123legaldoc.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function generateMetadata({ searchParams }: TenantNotFoundPageProps) {
  return {
    title: 'Organization Not Found - 123LegalDoc',
    description: 'The requested organization could not be found.',
    robots: 'noindex, nofollow',
  };
}