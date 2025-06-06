// src/app/[locale]/dashboard/dashboard-client-content.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RenameModal from './modals/RenameModal';
import ProfileSettings from '@/components/ProfileSettings';
import {
  FileText,
  CreditCard,
  UserCircle,
  LogOut,
  Loader2,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/hooks/useDashboardData';
import {
  renameDocument,
  duplicateDocument,
  softDeleteDocument,
} from '@/lib/firestore/documentActions';
import type { DashboardDocument } from '@/lib/firestore/dashboardData';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Define a more specific type for Firestore Timestamps if that's what you use
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
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
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [renameDoc, setRenameDoc] = useState<DashboardDocument | null>(null);

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

  const queryClient = useQueryClient();
  const { toast } = useToast();

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
        const sorted = [...documents].sort((a, b) => {
          const dir = sortDir === 'asc' ? 1 : -1;
          let valA: string | number = '';
          let valB: string | number = '';
          if (sortBy === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
          } else if (sortBy === 'status') {
            valA = a.status.toLowerCase();
            valB = b.status.toLowerCase();
          } else {
            const dA = (typeof a.date === 'object' && 'toDate' in a.date)
              ? a.date.toDate()
              : new Date(a.date as any);
            const dB = (typeof b.date === 'object' && 'toDate' in b.date)
              ? b.date.toDate()
              : new Date(b.date as any);
            valA = dA.getTime();
            valB = dB.getTime();
          }
          if (valA < valB) return -1 * dir;
          if (valA > valB) return 1 * dir;
          return 0;
        });

        const handleSort = (col: 'name' | 'date' | 'status') => {
          if (sortBy === col) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy(col);
            setSortDir('asc');
          }
        };

        return (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort('name')}
                    className="cursor-pointer select-none"
                  >
                    {t('Name')}{' '}
                    {sortBy === 'name' && (sortDir === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('date')}
                    className="cursor-pointer select-none"
                  >
                    {t('LastModified', 'Last Modified')}{' '}
                    {sortBy === 'date' && (sortDir === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('status')}
                    className="cursor-pointer select-none"
                  >
                    {t('Status')}{' '}
                    {sortBy === 'status' && (sortDir === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((doc) => (
                  <TableRow key={doc.id} className="group">
                    <TableCell className="font-medium">
                      <Link
                        href={`/${locale}/docs/${doc.docType}/start`}
                        className="hover:underline"
                      >
                        {t(doc.name, doc.name)}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(doc.date)}</TableCell>
                    <TableCell>{t(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setRenameDoc(doc)}>
                            {t('Rename')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await duplicateDocument(user!.uid, doc.id);
                              toast({
                                title: t('Document duplicated'),
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['dashboardDocuments', user?.uid],
                              });
                            }}
                          >
                            {t('Duplicate')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await softDeleteDocument(user!.uid, doc.id);
                              toast({
                                title: t('Document deleted'),
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['dashboardDocuments', user?.uid],
                              });
                            }}
                          >
                            {t('Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sorted.length === 0 && !isLoadingData && (
              <p className="text-muted-foreground">
                {t('No documents found.')}
              </p>
            )}
            <RenameModal
              open={!!renameDoc}
              currentName={renameDoc?.name || ''}
              onClose={() => setRenameDoc(null)}
              onRename={async (name) => {
                if (!renameDoc) return;
                await renameDocument(user!.uid, renameDoc.id, name);
                toast({ title: t('Document renamed') });
                queryClient.invalidateQueries({
                  queryKey: ['dashboardDocuments', user?.uid],
                });
              }}
            />
          </>
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
