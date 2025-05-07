// src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, CreditCard, UserCircle, Settings, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // To read query params

// Mock data - replace with actual data fetching
const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

const mockDocuments = [
  { id: 'doc1', name: 'Residential Lease Agreement', date: '2024-05-01', status: 'Signed' },
  { id: 'doc2', name: 'Non-Disclosure Agreement', date: '2024-04-15', status: 'Draft' },
  { id: 'doc3', name: 'Bill of Sale - Vehicle', date: '2024-03-20', status: 'Completed' },
];

const mockPayments = [
  { id: 'pay1', date: '2024-05-01', amount: '$5.00', document: 'Residential Lease Agreement' },
  { id: 'pay2', date: '2024-03-20', amount: '$5.00', document: 'Bill of Sale - Vehicle' },
];

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const authAction = searchParams.get('auth');

  const [activeTab, setActiveTab] = useState<'documents' | 'payments' | 'profile'>('documents');
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (authAction === 'signup') {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md shadow-xl bg-card border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">{t('Sign Up')}</CardTitle>
            <CardDescription>{t('Create your 123LegalDoc account')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-signup" className="text-muted-foreground">{t('Email')}</Label>
              <Input id="email-signup" type="email" placeholder={t('Enter your email')} className="bg-background text-foreground border-input" />
            </div>
            <div>
              <Label htmlFor="password-signup" className="text-muted-foreground">{t('Password')}</Label>
              <Input id="password-signup" type="password" placeholder={t('Create a password')} className="bg-background text-foreground border-input" />
            </div>
             <div>
              <Label htmlFor="confirm-password-signup" className="text-muted-foreground">{t('Confirm Password')}</Label>
              <Input id="confirm-password-signup" type="password" placeholder={t('Confirm your password')} className="bg-background text-foreground border-input" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{t('Create Account')}</Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('Already have an account?')} <Link href="/dashboard?auth=signin" className="underline text-primary hover:text-primary/80">{t('Sign In')}</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (authAction === 'signin') {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md shadow-xl bg-card border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">{t('Sign In')}</CardTitle>
            <CardDescription>{t('Access your 123LegalDoc dashboard')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-signin" className="text-muted-foreground">{t('Email')}</Label>
              <Input id="email-signin" type="email" placeholder={t('Enter your email')} className="bg-background text-foreground border-input" />
            </div>
            <div>
              <Label htmlFor="password-signin" className="text-muted-foreground">{t('Password')}</Label>
              <Input id="password-signin" type="password" placeholder={t('Enter your password')} className="bg-background text-foreground border-input" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{t('Sign In')}</Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('Don\'t have an account?')} <Link href="/dashboard?auth=signup" className="underline text-primary hover:text-primary/80">{t('Sign Up')}</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    );
  }
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">{t('Loading dashboard data...')}</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'documents':
        return (
          <div className="space-y-4">
            {mockDocuments.map((doc) => (
              <Card key={doc.id} className="shadow-sm hover:shadow-md transition-shadow bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">{doc.name}</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/generate?docId=${doc.id}`}>{t('View/Edit')}</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}: {new Date(doc.date).toLocaleDateString(i18n.language)} | {t('Status')}: <span className={`font-semibold ${doc.status === 'Signed' || doc.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>{t(doc.status)}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
            {mockDocuments.length === 0 && <p className="text-muted-foreground">{t('No documents found.')}</p>}
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4">
            {mockPayments.map((payment) => (
              <Card key={payment.id} className="shadow-sm bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-card-foreground">{payment.document}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('Date')}: {new Date(payment.date).toLocaleDateString(i18n.language)} | {t('Amount')}: {payment.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
            {mockPayments.length === 0 && <p className="text-muted-foreground">{t('No payment history.')}</p>}
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
                <p className="text-card-foreground">{mockUser.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('Email')}</Label>
                <p className="text-card-foreground">{mockUser.email}</p>
              </div>
              <Button variant="outline" className="mt-4">
                <Settings className="mr-2 h-4 w-4" /> {t('Edit Profile')}
              </Button>
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
        <Button variant="ghost" size="sm" asChild className="mt-2 md:mt-0 text-muted-foreground hover:text-primary">
          <Link href="/">
             <LogOut className="mr-2 h-4 w-4" /> {t('Logout')}
          </Link>
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {t('Welcome back, {{name}}! Manage your legal documents and account.', { name: mockUser.name })}
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
