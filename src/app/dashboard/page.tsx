// src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicProfileSettings = dynamic(
  () => import('@/components/ProfileSettings'),
  { ssr: false },
);
import {
  FileText,
  CreditCard,
  UserCircle,
  LogOut,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with actual data fetching
const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

const mockDocuments = [
  {
    id: 'doc1',
    name: 'Residential Lease Agreement',
    date: '2024-05-01',
    status: 'Signed',
  },
  {
    id: 'doc2',
    name: 'Non-Disclosure Agreement',
    date: '2024-04-15',
    status: 'Draft',
  },
  {
    id: 'doc3',
    name: 'Bill of Sale - Vehicle',
    date: '2024-03-20',
    status: 'Completed',
  },
];

const mockPayments = [
  {
    id: 'pay1',
    date: '2024-05-01',
    amount: '$5.00',
    document: 'Residential Lease Agreement',
  },
  {
    id: 'pay2',
    date: '2024-03-20',
    amount: '$5.00',
    document: 'Bill of Sale - Vehicle',
  },
];

export default function DashboardPage() {
  const { t, i18n } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<
    'documents' | 'payments' | 'profile'
  >('documents');


  const renderContent = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <div className="space-y-4">
            {mockDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="shadow-sm hover:shadow-md transition-shadow bg-card border-border"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">
                    {t(doc.name, doc.name)}
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/generate?docId=${doc.id}`}>
                      {t('View/Edit')}
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}:{' '}
                    {new Date(doc.date).toLocaleDateString(i18n.language)} |{' '}
                    {t('Status')}:{' '}
                    <span
                      className={`font-semibold ${doc.status === 'Signed' || doc.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}
                    >
                      {t(doc.status)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
            {mockDocuments.length === 0 && (
              <p className="text-muted-foreground">
                {t('No documents found.')}
              </p>
            )}
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4">
            {mockPayments.map((payment) => (
              <Card
                key={payment.id}
                className="shadow-sm bg-card border-border"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">
                    {t(payment.document, payment.document)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}:{' '}
                    {new Date(payment.date).toLocaleDateString(i18n.language)} |{' '}
                    {t('Amount')}: {payment.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
            {mockPayments.length === 0 && (
              <p className="text-muted-foreground">
                {t('No payment history.')}
              </p>
            )}
          </div>
        );
      case 'profile':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">
                  {t('Loading profile settings...')}
                </p>
              </div>
            }
          >
            <DynamicProfileSettings />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('Dashboard')}</h1>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mt-2 md:mt-0 text-muted-foreground hover:text-primary"
        >
          <Link href="/">
            {' '}
            {/* Link to homepage for logout, actual logout logic needed */}
            <LogOut className="mr-2 h-4 w-4" /> {t('Logout')}
          </Link>
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        {t('Welcome back, {{name}}! Manage your legal documents and account.', {
          name: mockUser.name,
        })}
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 space-y-2 shrink-0">
          <Button
            variant={activeTab === 'documents' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-left"
            onClick={() => setActiveTab('documents')}
          >
            <FileText className="mr-2 h-4 w-4" /> {t('My Documents')}
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-left"
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard className="mr-2 h-4 w-4" /> {t('Payment History')}
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-left"
            onClick={() => setActiveTab('profile')}
          >
            <UserCircle className="mr-2 h-4 w-4" /> {t('Profile')}
          </Button>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
