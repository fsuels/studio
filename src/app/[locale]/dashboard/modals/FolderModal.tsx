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
import { createFolder } from '@/lib/firestore/folderActions';
import { useAuth } from '@/hooks/useAuth';

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FolderModal({ open, onClose }: FolderModalProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  const handleCreate = async () => {
    if (!user?.uid) return;
    await createFolder(user.uid, name || t('UntitledFolder', 'Untitled Folder'));
    onClose();
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
          <Button onClick={handleCreate} type="button">
            {t('create', 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
