'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { createFolder } from '@/lib/firestore/folderActions';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FolderModal({ open, onClose }: FolderModalProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    setIsCreating(true);
    if (!user?.uid) { onClose(); return; }
    const key = ['dashboardFolders', user.uid] as const;
    const tmpId = `tmp-${Date.now()}`;
    const prev = queryClient.getQueryData(key);
    const folderName = name || t('UntitledFolder', 'Untitled Folder');
    queryClient.setQueryData(key, (old: any = []) => [
      ...old,
      { id: tmpId, name: folderName },
    ]);
    try {
      const newId = await createFolder(user.uid, folderName);
      queryClient.setQueryData(key, (old: any = []) =>
        old.map((f: any) => (f.id === tmpId ? { id: newId, name: folderName } : f)),
      );
      queryClient.invalidateQueries({ queryKey: key });
      toast({ title: t('Folder created') });
    } catch (err: any) {
      if (prev) queryClient.setQueryData(key, prev);
      console.error('[FolderModal] create folder failed', err);
      toast({ title: t('Error creating folder'), variant: 'destructive' });
    } finally {
      setIsCreating(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>{t('newFolder', 'New Folder')}</DialogTitle>
          <DialogDescription>
            {t('enterFolderName', 'Enter a name for your new folder.')}
          </DialogDescription>
        </DialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} type="button">
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleCreate} type="button" disabled={isCreating}>
            {isCreating && <Spinner className="mr-2 h-4 w-4" />}
            {t('create', 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
