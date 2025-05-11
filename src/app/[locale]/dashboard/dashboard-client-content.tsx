// src/app/[locale]/dashboard/dashboard-client-content.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, CreditCard, UserCircle, Settings, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'; 

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

// --- Placeholder Firestore Data Fetching Functions ---
// You MUST replace these with your actual Firestore implementation.

async function getRecentDocsForUser(userId: string): Promise<DocumentData[]> {
  console.log(`[Firestore MOCK] Fetching recent documents for user ${userId}...`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // Example structure - ensure your actual function returns this structure
  // return [
  //   { id: 'mockDoc1', name: 'Mock Lease Agreement', date: new Date().toISOString(), status: 'Draft', docType: 'lease-agreement' },
  //   { id: 'mockDoc2', name: 'Mock NDA', date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'Signed', docType: 'nda' },
  // ];
  return []; // Default to empty for now
}

async function getPaymentHistoryForUser(userId: string): Promise<PaymentData[]> {
  console.log(`[Firestore MOCK] Fetching payment history for user ${userId}...`);
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
  // Example structure - ensure your actual function returns this structure
  // return [
  //   { id: 'mockPay1', documentName: 'Mock Lease Agreement', documentId: 'mockDoc1', date: new Date().toISOString(), amount: '$35.00' },
  // ];
  return []; // Default to empty for now
}
// --- End Placeholder Functions ---

export default function DashboardClientContent({ locale }: DashboardClientContentProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'documents' | 'payments' | 'profile'>('documents');
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !authLoading && !isLoggedIn) {
      router.push(`/${locale}/signin`);
    }
  }, [isHydrated, authLoading, isLoggedIn, router, locale]);

  useEffect(() => {
    if (isHydrated && isLoggedIn && user?.uid) {
      setIsLoadingData(true);
      Promise.all([
        getRecentDocsForUser(user.uid).catch(err => { 
          console.error("Error fetching documents:", err);
          // toast({ title: t('Error'), description: t('Could not load your documents.'), variant: 'destructive' });
          return []; 
        }),
        getPaymentHistoryForUser(user.uid).catch(err => { 
          console.error("Error fetching payments:", err);
          // toast({ title: t('Error'), description: t('Could not load your payment history.'), variant: 'destructive' });
          return [];
        })
      ]).then(([userDocs, userPayments]) => {
        setDocuments(userDocs);
        setPayments(userPayments); 
        setIsLoadingData(false);
      }).catch(error => {
        console.error("Error fetching dashboard data:", error);
        setIsLoadingData(false);
      });
    } else if (isHydrated && !isLoggedIn) {
      // If not logged in (e.g., after logout), clear data and stop loading
      setDocuments([]);
      setPayments([]);
      setIsLoadingData(false);
    }
  }, [isHydrated, isLoggedIn, user?.uid, t, locale]); // Added locale for consistency if used in toast

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/`);
  };

  const formatDate = (dateInput: FirestoreTimestamp | Date | string): string => {
    if (!dateInput) return 'N/A';
    let dateObj: Date;
    if (typeof (dateInput as FirestoreTimestamp).toDate === 'function') {
      dateObj = (dateInput as FirestoreTimestamp).toDate();
    } else if (dateInput instanceof Date) {
      dateObj = dateInput;
    } else {
      try {
        dateObj = new Date(dateInput);
        if (isNaN(dateObj.getTime())) { 
            return String(dateInput); 
        }
      } catch (e) {
        return String(dateInput); 
      }
    }
    return dateObj.toLocaleDateString(i18n.language || locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (authLoading || !isHydrated ) { // Removed !isLoggedIn from here as redirect handles it
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{t('Loading dashboard data...')}</p>
      </div>
    );
  }
  
  const renderContent = () => {
    if (isLoadingData && (activeTab === 'documents' || activeTab === 'payments')) {
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
              <Card key={doc.id} className="shadow-sm hover:shadow-md transition-shadow bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">{t(doc.name, doc.name)}</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${locale}/docs/${doc.docType || doc.id}/start`}>{t('View/Edit')}</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}: {formatDate(doc.date)} | {t('Status')}: <span className={`font-semibold ${doc.status === 'Signed' || doc.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>{t(doc.status)}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
            {documents.length === 0 && !isLoadingData && <p className="text-muted-foreground">{t('No documents found.')}</p>}
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="shadow-sm bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">{t(payment.documentName, payment.documentName)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}: {formatDate(payment.date)} | {t('Amount')}: {payment.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
            {payments.length === 0 && !isLoadingData && <p className="text-muted-foreground">{t('No payment history.')}</p>}
          </div>
        );
      case 'profile':
        return (
          <Card className="shadow-sm bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">{t('Profile Settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('Name')}</Label>
                <p className="text-card-foreground">{user?.displayName || user?.email?.split('@')[0] || 'N/A'}</p> 
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('Email')}</Label>
                <p className="text-card-foreground">{user?.email || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {t('Dashboard')}
        </h1>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="mt-2 md:mt-0 text-muted-foreground hover:text-primary">
           <LogOut className="mr-2 h-4 w-4" /> {t('Logout')}
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {t('Welcome back, {{name}}! Manage your legal documents and account.', { name: user?.displayName || user?.email || 'User' })}
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
