'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DashboardFolder } from '@/lib/firestore/dashboardData';
import { Folder, Check } from 'lucide-react';

interface MoveToFolderModalProps {
  open: boolean;
  onClose: () => void;
  folders: DashboardFolder[];
  currentFolderId?: string | null;
  documentName?: string;
  documentsCount: Record<string, number>;
  onMove: (folderId: string | null) => void | Promise<void>;
}

export default function MoveToFolderModal({
  open,
  onClose,
  folders,
  currentFolderId,
  documentName,
  documentsCount,
  onMove,
}: MoveToFolderModalProps) {
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState<string | null>(currentFolderId ?? null);

  useEffect(() => {
    if (open) {
      setSelected(currentFolderId ?? null);
    }
  }, [open, currentFolderId]);

  const handleConfirm = async () => {
    await onMove(selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>{t('Move to Folder')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm mb-4 text-muted-foreground">
          {documentName ? t('moveDocumentInto', { name: documentName }) : t('selectFolder')}
        </p>
        <ScrollArea className="max-h-60 pr-2">
          <div
            className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
              selected === null ? 'bg-accent' : ''
            }`}
            onClick={() => setSelected(null)}
          >
            <span className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              {t('Root (No Folder)')}
            </span>
            {selected === null && <Check className="h-4 w-4" />}
          </div>
          {folders.map((f) => (
            <div
              key={f.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
                selected === f.id ? 'bg-accent' : ''
              }`}
              onClick={() => setSelected(f.id)}
            >
              <span className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                {t(f.name, f.name)}
              </span>
              <span className="text-xs text-muted-foreground">
                {documentsCount[f.id] ?? 0}
              </span>
              {selected === f.id && <Check className="h-4 w-4" />}
            </div>
          ))}
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} type="button">
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleConfirm} type="button">
            {t('Move')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

