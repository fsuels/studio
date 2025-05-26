// src/app/[locale]/dashboard/dashboard-client-content.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileSettings from '@/components/ProfileSettings';
import {
  FileText,
  CreditCard,
  UserCircle,
  LogOut,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/hooks/useDashboardData';

// Define a more specific type for Firestore Timestamps if that's what you use
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

interface DocumentData {
  id: string;
  name: string;
  date: FirestoreTimestamp | Date | string;
  status: string;
  docType?: string; // Used for linking to the correct document type if different from ID
}

interface PaymentData {
  id: string;
  date: FirestoreTimestamp | Date | string;
  amount: string;
  documentName: string;
  documentId?: string;
}

interface DashboardClientContentProps {
  locale: 'en' | 'es';
}

export default function DashboardClientContent({
  locale,
}: DashboardClientContentProps) {
  const { t, i18n } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<
    'documents' | 'payments' | 'profile'
  >('documents');
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);

  const {
    documents,
    payments,
    isLoading: isLoadingData,
  } = useDashboardData(user?.uid, {
    enabled: isHydrated && isLoggedIn && !!user?.uid,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !authLoading && !isLoggedIn) {
      router.push(`/${locale}/signin`);
    }
  }, [isHydrated, authLoading, isLoggedIn, router, locale]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/`);
  };

  const formatDate = (
    dateInput: FirestoreTimestamp | Date | string,
  ): string => {
    if (!dateInput) return 'N/A';
    let dateObj: Date;
    if (typeof (dateInput as FirestoreTimestamp).toDate === 'function') {
      dateObj = (dateInput as FirestoreTimestamp).toDate();
    } else if (dateInput instanceof Date) {
      dateObj = dateInput;
    } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      try {
        dateObj = new Date(dateInput);
        if (isNaN(dateObj.getTime())) {
          return String(dateInput);
        }
      } catch {
        return String(dateInput);
      }
    } else {
      return String(dateInput);
    }
    return dateObj.toLocaleDateString(i18n.language || locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || !isHydrated) {
    // Removed !isLoggedIn from here as redirect handles it
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">
          {t('Loading dashboard data...')}
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (
      isLoadingData &&
      (activeTab === 'documents' || activeTab === 'payments')
    ) {
      return (
        <div className="flex items-center justify-center p-8 min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">{t('Loading...')}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'documents':
        return (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="shadow-sm hover:shadow-md transition-shadow bg-card border-border"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">
                    {t(doc.name, doc.name)}
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/${locale}/docs/${doc.docType || doc.id}/start`}
                    >
                      {t('View/Edit')}
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}: {formatDate(doc.date)} | {t('Status')}:{' '}
                    <span
                      className={`font-semibold ${doc.status === 'Signed' || doc.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}
                    >
                      {t(doc.status)}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
            {documents.length === 0 && !isLoadingData && (
              <p className="text-muted-foreground">
                {t('No documents found.')}
              </p>
            )}
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card
                key={payment.id}
                className="shadow-sm bg-card border-border"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">
                    {t(payment.documentName, payment.documentName)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}: {formatDate(payment.date)} | {t('Amount')}:{' '}
                    {payment.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
            {payments.length === 0 && !isLoadingData && (
              <p className="text-muted-foreground">
                {t('No payment history.')}
              </p>
            )}
          </div>
        );
      case 'profile':
        return <ProfileSettings />;
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
          onClick={handleLogout}
          className="mt-2 md:mt-0 text-muted-foreground hover:text-primary"
        >
          <LogOut className="mr-2 h-4 w-4" /> {t('Logout')}
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        {t('Welcome back, {{name}}! Manage your legal documents and account.', {
          name: user?.name || user?.email || 'User',
        })}
      </p>

      <div className="flex flex-col md:flex-row gap-8">
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

        <div className="flex-1 bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border min-h-[300px]">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
