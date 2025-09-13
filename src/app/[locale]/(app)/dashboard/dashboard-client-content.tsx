'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import RenameModal from './modals/RenameModal';
import FolderModal from './modals/FolderModal';
import MoveToFolderModal from './modals/MoveToFolderModal';
import ProfileSettings from '@/components/shared/ProfileSettings';
import {
  FileText,
  Folder,
  CreditCard,
  UserCircle,
  LogOut,
  Loader2,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  Eye,
  Receipt,
  Plus,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  getFirestore,
  doc as firestoreDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useOptimizedDashboardData } from '@/hooks/useOptimizedDashboardData';
import { DocumentsSkeleton } from './DocumentsSkeleton';
import {
  renameDocument,
  duplicateDocument,
  softDeleteDocument,
  updateDocumentFolder,
  bulkMoveDocuments,
  bulkSoftDeleteDocuments,
} from '@/lib/firestore/documentActions';
import type {
  DashboardDocument,
  DashboardFolder,
} from '@/lib/firestore/dashboardData';
import { getUserDocuments } from '@/lib/firestore/dashboardData';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import OnboardingChecklist from '@/components/onboarding/OnboardingChecklist';
import { useOnboarding } from '@/hooks/useOnboarding';

// Define a more specific type for Firestore Timestamps if that's what you use
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

type DashboardFile =
  | (DashboardDocument & { type: 'document' })
  | (DashboardFolder & {
      type: 'folder';
      status?: string;
      date?: FirestoreTimestamp | Date | string;
      docType?: string;
    });

export interface DashboardClientContentProps {
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
  const { shouldShowOnboarding, markMilestone } = useOnboarding();

  const [isHydrated, setIsHydrated] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [renameDoc, setRenameDoc] = useState<DashboardDocument | null>(null);
  const [duplicatingDocId, setDuplicatingDocId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [moveModalState, setMoveModalState] = useState<{
    open: boolean;
    documentId?: string;
    documentName?: string;
  }>({ open: false });

  const {
    documents,
    payments,
    folders,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
  } = useOptimizedDashboardData(user?.uid, {
    enabled: isHydrated && isLoggedIn && !!user?.uid,
  });

  const files: DashboardFile[] = React.useMemo(() => {
    // Filter documents based on current folder
    const filteredDocs = currentFolderId
      ? documents.filter((d) => d.folderId === currentFolderId)
      : documents.filter((d) => !d.folderId); // Root level documents only

    // Only show folders at root level
    const displayFolders = currentFolderId ? [] : folders;

    return [
      ...displayFolders.map((f) => ({ ...f, type: 'folder' as const })),
      ...filteredDocs.map((d) => ({ ...d, type: 'document' as const })),
    ];
  }, [folders, documents, currentFolderId]);

  // Calculate document counts per folder
  const documentsPerFolder = React.useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      if (doc.folderId) {
        counts[doc.folderId] = (counts[doc.folderId] || 0) + 1;
      }
    });
    return counts;
  }, [documents]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Prefetch document view pages after documents load
  useEffect(() => {
    documents.forEach((doc) => {
      router.prefetch(`/${locale}/docs/${doc.docType}/view?docId=${doc.id}`);
    });
  }, [documents, router, locale]);

  useEffect(() => {
    if (user?.uid) {
      const commonDocTypes = [
        'vehicle-bill-of-sale',
        'lease-agreement',
        'purchase-agreement',
      ];
      commonDocTypes.forEach((docType) => {
        router.prefetch(`/${locale}/docs/${docType}/start`);
      });
    }
  }, [user?.uid, router, locale]);

  useEffect(() => {
    setIsHydrated(true);
    if (user?.uid && !isLoadingData && queryClient) {
      queryClient.prefetchQuery({
        queryKey: ['dashboardDocuments', user.uid],
        queryFn: () => getUserDocuments(user.uid, 5),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [user?.uid, queryClient, isLoadingData]);

  useEffect(() => {
    if (isHydrated && !authLoading && !isLoggedIn) {
      router.push(`/${locale}/signin`);
    }
  }, [isHydrated, authLoading, isLoggedIn, router, locale]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/`);
  };

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
    
    queryClient.setQueryData<DashboardDocument[]>(key, (old = []) => [
      optimistic,
      ...old,
    ]);
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
      await setDoc(firestoreDoc(db, 'users', user.uid, 'documents', newId), {
        name: file.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'Uploaded',
        docType: 'uploaded',
        storagePath: path,
        url,
      });
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
    if (selectedIds.length === files.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map((f) => f.id));
    }
  };

  const handleBulkMove = async (folderId: string | null) => {
    const ids = selectedIds;
    setSelectedIds([]);
    const key = ['dashboardDocuments', user!.uid] as const;
    const previous = queryClient.getQueryData<DashboardDocument[]>(key);
    
    queryClient.setQueryData<DashboardDocument[]>(
      key,
      (old) =>
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

  const handleBulkDelete = async () => {
    const ids = selectedIds;
    const count = ids.length;
    setSelectedIds([]);
    const key = ['dashboardDocuments', user!.uid] as const;
    const previous = queryClient.getQueryData<DashboardDocument[]>(key);
    
    // Optimistic update - remove from UI immediately
    queryClient.setQueryData<DashboardDocument[]>(
      key,
      (old) => old?.filter((d) => !ids.includes(d.id)) || [],
    );
    
    try {
      await bulkSoftDeleteDocuments(user!.uid, ids);
      toast({ 
        title: t('Documents deleted', { count }), 
        description: `${count} ${count === 1 ? t('document') : t('documents')} ${t('deleted successfully')}`
      });
    } catch {
      // Rollback on error
      if (previous) queryClient.setQueryData(key, previous);
      toast({
        title: t('Error deleting documents'),
        description: t('Some documents could not be deleted'),
        variant: 'destructive',
      });
    } finally {
      queryClient.invalidateQueries({ queryKey: key });
    }
  };

  const handleMove = async (docId: string, folderId: string | null) => {
    const key = ['dashboardDocuments', user!.uid] as const;
    const previous = queryClient.getQueryData<DashboardDocument[]>(key);
    
    queryClient.setQueryData<DashboardDocument[]>(
      key,
      (old) =>
        old?.map((d) =>
          d.id === docId ? { ...d, folderId: folderId || undefined } : d,
        ) || [],
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

  const openItem = (item: DashboardFile) => {
    if (item.type === 'folder') {
      // Navigate to folder contents within dashboard
      setCurrentFolderId(item.id);
    } else {
      router.push(`/${locale}/docs/${item.docType}/view?docId=${item.id}`);
    }
  };

  // Reset selected items when folder changes
  useEffect(() => {
    setSelectedIds([]);
  }, [currentFolderId]);

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
    
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === dateObj.toDateString();
    
    if (isToday) {
      // Show time for today's documents
      return `Today ${dateObj.toLocaleTimeString(i18n.language || locale, {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (isYesterday) {
      // Show "Yesterday" with time
      return `Yesterday ${dateObj.toLocaleTimeString(i18n.language || locale, {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      // Show full date for older documents
      return dateObj.toLocaleDateString(i18n.language || locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (authLoading || !isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          {t('Loading your dashboard...')}
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (documents.length === 0 && isLoadingData) {
      return (
        <div className="p-6">
          <DocumentsSkeleton rows={3} />
        </div>
      );
    }

    switch (activeTab) {
      case 'documents': {
        const sorted = [...files].sort((a, b) => {
          const dir = sortDir === 'asc' ? 1 : -1;
          let valA: string | number = '';
          let valB: string | number = '';
          if (sortBy === 'name') {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
          } else if (sortBy === 'status') {
            valA = (a.status || '').toLowerCase();
            valB = (b.status || '').toLowerCase();
          } else {
            const dA =
              typeof a.date === 'object' && a.date && 'toDate' in a.date
                ? (a.date as FirestoreTimestamp).toDate()
                : a.date
                  ? new Date(a.date as string)
                  : new Date(0);
            const dB =
              typeof b.date === 'object' && b.date && 'toDate' in b.date
                ? (b.date as FirestoreTimestamp).toDate()
                : b.date
                  ? new Date(b.date as string)
                  : new Date(0);
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
                    <Button variant="outline" data-tour="create-document">
                      {t('New')} ▼
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={() => setShowFolderModal(true)}>
                      {t('Folder')}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/templates`}>{t('Document')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => router.push(`/${locale}/online-notary`)}
                    >
                      {t('Notarization')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => router.push(`/${locale}/signwell`)}
                    >
                      {t('eSign')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {isFetchingData && !isLoadingData && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {t('Updating...')}
                </div>
              )}
            </div>

            {/* Breadcrumb navigation for folders */}
            {currentFolderId && (
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => setCurrentFolderId(null)}
                >
                  {t('All Documents')}
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">
                  {folders.find((f) => f.id === currentFolderId)?.name ||
                    currentFolderId}
                </span>
                <span className="text-muted-foreground ml-2">
                  (
                  {
                    documents.filter((d) => d.folderId === currentFolderId)
                      .length
                  }{' '}
                  {t('items')})
                </span>
              </div>
            )}

            {selectedIds.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">{t('Move')}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={() => handleBulkMove(null)}>
                      {t('None')}
                    </DropdownMenuItem>
                    {folders.map((f) => (
                      <DropdownMenuItem
                        key={f.id}
                        onSelect={() => handleBulkMove(f.id)}
                      >
                        {t(f.name, f.name)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  {t('Delete')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} {t('selected')}
                </span>
              </div>
            )}

            <FolderModal
              open={showFolderModal}
              onClose={() => setShowFolderModal(false)}
            />

            {isUploading && (
              <div className="mb-4">
                <Progress
                  value={uploadProgress}
                  aria-label={t('Upload progress')}
                />
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4">
                    <Checkbox
                      checked={
                        selectedIds.length === files.length && files.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label={t('Select all')}
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('name')}
                    className="cursor-pointer select-none"
                  >
                    {t('Name')}{' '}
                    {sortBy === 'name' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="inline h-3 w-3" />
                      ) : (
                        <ChevronDown className="inline h-3 w-3" />
                      ))}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('date')}
                    className="cursor-pointer select-none"
                  >
                    {t('LastModified', 'Last Modified')}{' '}
                    {sortBy === 'date' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="inline h-3 w-3" />
                      ) : (
                        <ChevronDown className="inline h-3 w-3" />
                      ))}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('status')}
                    className="cursor-pointer select-none"
                  >
                    {t('Status')}{' '}
                    {sortBy === 'status' &&
                      (sortDir === 'asc' ? (
                        <ChevronUp className="inline h-3 w-3" />
                      ) : (
                        <ChevronDown className="inline h-3 w-3" />
                      ))}
                  </TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`group ${item.type === 'folder' ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        aria-label={t('Select document')}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        {item.type === 'folder' ? (
                          <>
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <button
                              onClick={() => openItem(item)}
                              className="hover:underline text-left"
                            >
                              {t(item.name, item.name)}
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({documentsPerFolder[item.id] || 0})
                              </span>
                            </button>
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <Link
                              href={`/${locale}/docs/${item.docType}/view?docId=${item.id}`}
                              className="hover:underline"
                            >
                              {t(item.name, item.name)}
                            </Link>
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.date ? formatDate(item.date) : '-'}
                    </TableCell>
                    <TableCell>
                      {item.type === 'folder' ? '-' : t(item.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.type === 'document' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                router.push(
                                  `/${locale}/docs/${item.docType}/view?docId=${item.id}`,
                                )
                              }
                            >
                              {t('View')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setRenameDoc(item)}
                            >
                              {t('Rename')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                setMoveModalState({
                                  open: true,
                                  documentId: item.id,
                                  documentName: item.name,
                                })
                              }
                            >
                              <Folder className="mr-2 h-4 w-4" />
                              {t('Move to Folder')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={duplicatingDocId === item.id}
                              onSelect={async () => {
                                setDuplicatingDocId(item.id);
                                const key = [
                                  'dashboardDocuments',
                                  user!.uid,
                                ] as const;
                                
                                const previous = queryClient.getQueryData<DashboardDocument[]>(key);
                                const tempId = `copy-${Date.now()}`;
                                
                                queryClient.setQueryData<DashboardDocument[]>(
                                  key,
                                  (old = []) => [
                                    {
                                      ...(item as DashboardDocument),
                                      id: tempId,
                                      name: `${item.name} (Copy)`,
                                    },
                                    ...old,
                                  ],
                                );
                                
                                try {
                                  await duplicateDocument(user!.uid, item.id);
                                  toast({ title: t('Document duplicated') });
                                } catch {
                                  if (previous)
                                    queryClient.setQueryData(key, previous);
                                  toast({
                                    title: t('Error duplicating document'),
                                    variant: 'destructive',
                                  });
                                } finally {
                                  setDuplicatingDocId(null);
                                  queryClient.invalidateQueries({
                                    queryKey: key,
                                  });
                                }
                              }}
                            >
                              {duplicatingDocId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                t('Duplicate')
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={async () => {
                                const key = [
                                  'dashboardDocuments',
                                  user!.uid,
                                ] as const;
                                
                                const previous = queryClient.getQueryData<DashboardDocument[]>(key);
                                
                                queryClient.setQueryData<DashboardDocument[]>(
                                  key,
                                  (old) => old?.filter((d) => d.id !== item.id) || [],
                                );
                                
                                try {
                                  await softDeleteDocument(user!.uid, item.id);
                                  toast({ title: t('Document deleted') });
                                } catch {
                                  if (previous)
                                    queryClient.setQueryData(key, previous);
                                  toast({
                                    title: t('Error deleting document'),
                                    variant: 'destructive',
                                  });
                                } finally {
                                  queryClient.invalidateQueries({
                                    queryKey: key,
                                  });
                                }
                              }}
                            >
                              {t('Delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {sorted.length === 0 && !isLoadingData && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">
                  {t('No documents yet')}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('Upload a file or create a new document to get started.')}
                </p>
              </div>
            )}

            <RenameModal
              open={!!renameDoc}
              currentName={renameDoc?.name || ''}
              onClose={() => setRenameDoc(null)}
              onRename={async (name) => {
                if (!renameDoc) return;
                const key = ['dashboardDocuments', user!.uid] as const;
                const previous = queryClient.getQueryData<DashboardDocument[]>(key);
                
                queryClient.setQueryData<DashboardDocument[]>(
                  key,
                  (old) =>
                    old?.map((d) =>
                      d.id === renameDoc.id ? { ...d, name } : d,
                    ) || [],
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

            <MoveToFolderModal
              open={moveModalState.open}
              onClose={() => setMoveModalState({ open: false })}
              folders={folders}
              currentFolderId={
                documents.find((d) => d.id === moveModalState.documentId)
                  ?.folderId
              }
              documentName={moveModalState.documentName}
              documentsCount={documentsPerFolder}
              onMove={async (folderId) => {
                if (moveModalState.documentId) {
                  await handleMove(moveModalState.documentId, folderId);
                }
                setMoveModalState({ open: false });
              }}
            />
          </>
        );
      }

      case 'payments':
        return (
          <div className="space-y-6">
            {/* Header with summary stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('Payment History')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('Manage and view your billing history and invoices')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {t('Download All')}
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('Filter')}
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t('Total Spent')}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        $
                        {payments
                          .reduce(
                            (sum, p) =>
                              sum +
                              (parseFloat(
                                String(p.amount).replace(/[^0-9.]/g, ''),
                              ) || 0),
                            0,
                          )
                          .toFixed(2)}
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t('This Month')}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        $
                        {payments
                          .filter((p) => {
                            const d: any = (p as any).date;
                            const paymentDate: Date = d?.toDate ? d.toDate() : new Date(d);
                            const now = new Date();
                            return (
                              paymentDate.getMonth() === now.getMonth() &&
                              paymentDate.getFullYear() === now.getFullYear()
                            );
                          })
                          .reduce(
                            (sum, p) =>
                              sum +
                              (parseFloat(p.amount.replace(/[^0-9.]/g, '')) ||
                                0),
                            0,
                          )
                          .toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t('Total Orders')}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {payments.length}
                      </p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Professional Payment Table */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {t('Transaction History')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('Displaying transactions from all services')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {payments.length} {t('transactions')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/30">
                          <TableHead className="font-semibold text-gray-700 py-4">
                            {t('Product/Service')}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t('Purchase Date')}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t('Amount')}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            {t('Status')}
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-right">
                            {t('Actions')}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment, index) => {
                          const amount =
                            parseFloat(
                              String(payment.amount).replace(/[^0-9.]/g, ''),
                            ) || 0;
                          const d2: any = (payment as any).date;
                          const paymentDate2: Date = d2?.toDate ? d2.toDate() : new Date(d2);
                          const isRecent =
                            paymentDate2 >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                          return (
                            <TableRow
                              key={payment.id || `payment-${index}`}
                              className="hover:bg-gray-50/50 transition-colors border-b border-gray-100"
                            >
                              <TableCell className="py-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <Receipt className="h-4 w-4 text-blue-600" />
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">
                                      {t(
                                        payment.documentName,
                                        payment.documentName,
                                      )}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500">
                                        {t('Service Payment')}
                                      </span>
                                      {isRecent && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          {t('Recent')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="py-4">
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">
                                    {formatDate(payment.date)}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {(() => {
                                      const d3: any = (payment as any).date;
                                      const paymentDate3: Date = d3?.toDate
                                        ? d3.toDate()
                                        : new Date(d3);
                                      return paymentDate3.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      });
                                    })()}
                                  </p>
                                </div>
                              </TableCell>

                              <TableCell className="py-4">
                                <div className="text-sm">
                                  <p className="font-semibold text-gray-900">
                                    ${amount.toFixed(2)}
                                  </p>
                                </div>
                              </TableCell>

                              <TableCell className="py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  {t('Completed')}
                                </span>
                              </TableCell>

                              <TableCell className="py-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Download className="mr-2 h-4 w-4" />
                                      {t('Download Invoice')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Eye className="mr-2 h-4 w-4" />
                                      {t('View Details')}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Receipt className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('No payment history')}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      {t(
                        'When you make purchases or subscribe to services, your payment history will appear here.',
                      )}
                    </p>
                    <Button onClick={() => router.push(`/${locale}/templates`)}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('Create Your First Document')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      {t('Payment Information')}
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      {t(
                        'All payments are processed securely through Stripe. You can download invoices and receipts at any time. For billing questions, contact our support team.',
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        <nav
          className="w-full md:w-64 space-y-2 shrink-0"
          data-tour="dashboard-nav"
        >
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
          {/* Show onboarding checklist if user hasn't completed onboarding */}
          {shouldShowOnboarding && activeTab === 'documents' && (
            <OnboardingChecklist
              onDismiss={() => {
                /* Handle dismiss */
              }}
            />
          )}
          {renderContent()}
        </div>
      </div>

      {/* Onboarding Wizard - shows on first visit */}
      <OnboardingWizard
        autoStart={shouldShowOnboarding}
        onComplete={async () => {
          await markMilestone('dashboardTour');
        }}
        onSkip={() => {
          /* Handle skip */
        }}
      />
    </main>
  );
}
