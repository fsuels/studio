'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RenameModal from './modals/RenameModal';
import FolderModal from './modals/FolderModal';
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
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getFirestore, doc as firestoreDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DocumentsSkeleton } from './DocumentsSkeleton';
import {
  renameDocument,
  duplicateDocument,
  softDeleteDocument,
  updateDocumentFolder,
  bulkMoveDocuments,
} from '@/lib/firestore/documentActions';
import type { DashboardDocument } from '@/lib/firestore/dashboardData';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [activeTab, setActiveTab] = useState<'documents' | 'payments' | 'profile'>('documents');
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [renameDoc, setRenameDoc] = useState<DashboardDocument | null>(null);
  const [duplicatingDocId, setDuplicatingDocId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    documents,
    payments,
    folders,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
  } = useDashboardData(user?.uid, {
    enabled: isHydrated && isLoggedIn && !!user?.uid,
  });

  // Prefetch document view pages after documents load
  useEffect(() => {
    documents.forEach((doc) => {
      router.prefetch(`/${locale}/docs/${doc.docType}/view?docId=${doc.id}`);
    });
  }, [documents, router, locale]);

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

  // --- Upload File logic ---
const fileInputRef = useRef<HTMLInputElement>(null);
const [showFolderModal, setShowFolderModal] = useState(false);
const [isUploading, setIsUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadClick = () => {
    if (!user?.uid) {
      router.push(`/${locale}/signin`);
      return;
    }
    fileInputRef.current?.click();
  };

const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !user) return;
  setIsUploading(true);
  setUploadProgress(0);
  const key = ['dashboardDocuments', user.uid] as const;
  const optimistic: DashboardDocument = {
    id: `upload-${Date.now()}`,
    name: file.name,
    date: new Date(),
    status: 'Uploading',
    docType: 'uploaded',
  };
  queryClient.setQueryData<DashboardDocument[]>(key, (old = []) => [...old, optimistic]);
  try {
    const storage = getStorage();
    const db = getFirestore();
    const newId = `uploaded-${Date.now()}`;
    const path = `users/${user.uid}/documents/${newId}-${file.name}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);
    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100,
          );
          setUploadProgress(pct);
        },
        reject,
        () => resolve(),
      );
    });
    const url = await getDownloadURL(task.snapshot.ref);
    await setDoc(
      firestoreDoc(db, 'users', user.uid, 'documents', newId),
      {
        name: file.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'Uploaded',
        docType: 'uploaded',
        storagePath: path,
        url,
      },
    );
    queryClient.invalidateQueries({ queryKey: key });
      toast({ title: t('Document uploaded') });
    setUploadProgress(100);
    } catch (err: unknown) {
      console.error('[dashboard] upload failed', err);
      const desc = err instanceof Error ? err.message : String(err);
      toast({
        title: t('Upload failed'),
        description: desc,
        variant: 'destructive',
      });
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === documents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(documents.map((d) => d.id));
    }
  };

  const handleBulkMove = async (folderId: string | null) => {
    const ids = selectedIds;
    setSelectedIds([]);
    const key = ['dashboardDocuments', user!.uid] as const;
    const previous = queryClient.getQueryData<DashboardDocument[]>(key);
    queryClient.setQueryData<DashboardDocument[]>(key, (old) =>
      old?.map((d) =>
        ids.includes(d.id) ? { ...d, folderId: folderId || undefined } : d,
      ) || [],
    );
    try {
      await bulkMoveDocuments(user!.uid, ids, folderId);
      toast({ title: t('Document moved') });
    } catch {
      if (previous) queryClient.setQueryData(key, previous);
      toast({ title: t('Error moving document'), variant: 'destructive' });
    } finally {
      queryClient.invalidateQueries({ queryKey: key });
    }
  };

  const handleMove = async (docId: string, folderId: string | null) => {
    const key = ['dashboardDocuments', user!.uid] as const;
    const previous = queryClient.getQueryData<DashboardDocument[]>(key);
    queryClient.setQueryData<DashboardDocument[]>(key, (old) =>
      old?.map((d) => (d.id === docId ? { ...d, folderId: folderId || undefined } : d)) || [],
    );
    try {
      await updateDocumentFolder(user!.uid, docId, folderId);
      toast({ title: t('Document moved') });
    } catch {
      if (previous) queryClient.setQueryData(key, previous);
      toast({ title: t('Error moving document'), variant: 'destructive' });
    } finally {
      queryClient.invalidateQueries({ queryKey: key });
    }
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">
          {t('Preparing your dashboard…')}
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (!documents.length && isFetchingData) {
      return (
        <div className="p-6">
          <DocumentsSkeleton />
        </div>
      );
    }

    switch (activeTab) {
      case 'documents': {
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
              : new Date(a.date as string);
            const dB = (typeof b.date === 'object' && 'toDate' in b.date)
              ? b.date.toDate()
              : new Date(b.date as string);
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
            {/* Upload & New controls */}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelected}
            />
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2 items-center">
                  <Button onClick={handleUploadClick} disabled={isUploading}>
                    {isUploading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t('Upload File')}
                  </Button>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{t('New')} ▼</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => setShowFolderModal(true)}>
              {t('Folder')}
            </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/templates`}>{t('Document')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push(`/${locale}/online-notary`)}>
                      {t('Notarization')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push(`/${locale}/signwell`)}>
                      {t('eSign')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center space-x-2 mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">{t('Move')}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => handleBulkMove(null)}>
                  {t('None')}
                </DropdownMenuItem>
                {folders.map((f) => (
                  <DropdownMenuItem key={f.id} onSelect={() => handleBulkMove(f.id)}>
                    {t(f.name, f.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} {t('selected')}
            </span>
          </div>
        )}
        <FolderModal
          open={showFolderModal}
          onClose={() => setShowFolderModal(false)}
        />
      </div>
          {isUploading && (
            <div className="mb-4">
              <Progress value={uploadProgress} aria-label={t('Upload progress')} />
            </div>
          )}

          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4">
                    <Checkbox
                      checked={selectedIds.length === documents.length && documents.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label={t('Select all')}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('name')}
                    className="cursor-pointer select-none"
                  >
                    {t('Name')}{' '}
                    {sortBy === 'name' && (sortDir === 'asc'
                      ? <ChevronUp className="inline h-3 w-3" />
                      : <ChevronDown className="inline h-3 w-3" />)}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('date')}
                    className="cursor-pointer select-none"
                  >
                    {t('LastModified', 'Last Modified')}{' '}
                    {sortBy === 'date' && (sortDir === 'asc'
                      ? <ChevronUp className="inline h-3 w-3" />
                      : <ChevronDown className="inline h-3 w-3" />)}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('status')}
                    className="cursor-pointer select-none"
                  >
                    {t('Status')}{' '}
                    {sortBy === 'status' && (sortDir === 'asc'
                      ? <ChevronUp className="inline h-3 w-3" />
                      : <ChevronDown className="inline h-3 w-3" />)}
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((doc) => (
                  <TableRow key={doc.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(doc.id)}
                        onCheckedChange={() => toggleSelect(doc.id)}
                        aria-label={t('Select document')}
                      />
                    </TableCell>
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
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/${locale}/docs/${doc.docType}/view?docId=${doc.id}`)}>{t('View')}</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setRenameDoc(doc)}>
                            {t('Rename')}
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>{t('Move to Folder')}</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onSelect={() => handleMove(doc.id, null)}>
                                {t('None')}
                              </DropdownMenuItem>
                              {folders.map((f) => (
                                <DropdownMenuItem key={f.id} onSelect={() => handleMove(doc.id, f.id)}>
                                  {t(f.name, f.name)}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            disabled={duplicatingDocId === doc.id}
                            onSelect={async () => {
                              setDuplicatingDocId(doc.id);
                              const key = ['dashboardDocuments', user!.uid] as const;
                              const previous = queryClient.getQueryData<DashboardDocument[]>(key);
                              const tempId = `copy-${Date.now()}`;
                              queryClient.setQueryData<DashboardDocument[]>(key, (old = []) => [
                                ...old,
                                { ...doc, id: tempId, name: `${doc.name} (Copy)` },
                              ]);
                              try {
                                await duplicateDocument(user!.uid, doc.id);
                                toast({ title: t('Document duplicated') });
                              } catch {
                                if (previous) queryClient.setQueryData(key, previous);
                                toast({
                                  title: t('Error duplicating document'),
                                  variant: 'destructive',
                                });
                              } finally {
                                setDuplicatingDocId(null);
                                queryClient.invalidateQueries({ queryKey: key });
                              }
                            }}
                          >
                            {duplicatingDocId === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              t('Duplicate')
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={async () => {
                              const key = ['dashboardDocuments', user!.uid] as const;
                              const previous = queryClient.getQueryData<DashboardDocument[]>(key);
                              queryClient.setQueryData<DashboardDocument[]>(key, (old) =>
                                old?.filter((d) => d.id !== doc.id) || []
                              );
                              try {
                                await softDeleteDocument(user!.uid, doc.id);
                                toast({ title: t('Document deleted') });
                              } catch {
                                if (previous) queryClient.setQueryData(key, previous);
                                toast({ title: t('Error deleting document'), variant: 'destructive' });
                              } finally {
                                queryClient.invalidateQueries({ queryKey: key });
                              }
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
                const key = ['dashboardDocuments', user!.uid] as const;
                const previous = queryClient.getQueryData<DashboardDocument[]>(key);
                queryClient.setQueryData<DashboardDocument[]>(key, (old) =>
                  old?.map((d) => (d.id === renameDoc.id ? { ...d, name } : d)) || []
                );
                try {
                  await renameDocument(user!.uid, renameDoc.id, name);
                  toast({ title: t('Document renamed') });
                } catch (err: unknown) {
                  if (previous) queryClient.setQueryData(key, previous);
                  const message =
                    err instanceof Error && err.message === 'duplicate-name'
                      ? t('duplicateNameError')
                      : t('Error renaming document');
                  toast({ title: message, variant: 'destructive' });
                } finally {
                  queryClient.invalidateQueries({ queryKey: key });
                }
              }}
            />
          </>
        );
      }
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
                    {t('Date')}: {formatDate(payment.date)} | {t('Amount')}: {payment.amount}
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
