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

interface RenameModalProps {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onRename: (name: string) => void | Promise<void>;
}

export default function RenameModal({
  open,
  currentName,
  onClose,
  onRename,
}: RenameModalProps) {
  const { t } = useTranslation('common');
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  const handleSave = async () => {
    await onRename(name);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>{t('renameDoc', 'Rename Document')}</DialogTitle>
          <DialogDescription>
            {t('enterNewName', 'Enter a new name for this document.')}
          </DialogDescription>
        </DialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} type="button">
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSave} type="button">
            {t('save', 'Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
