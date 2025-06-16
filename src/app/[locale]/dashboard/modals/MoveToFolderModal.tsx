'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Folder, FileText, Search, Check } from 'lucide-react';
import type { DashboardFolder } from '@/lib/firestore/dashboardData';

interface MoveToFolderModalProps {
  open: boolean;
  onClose: () => void;
  folders: DashboardFolder[];
  currentFolderId?: string | null;
  onMove: (folderId: string | null) => void;
  documentName?: string;
  documentsCount?: Record<string, number>; // folder id -> document count
}

export default function MoveToFolderModal({
  open,
  onClose,
  folders,
  currentFolderId,
  onMove,
  documentName,
  documentsCount = {},
}: MoveToFolderModalProps) {
  const { t } = useTranslation('common');
  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId || null);

  // Filter folders based on search
  const filteredFolders = useMemo(() => {
    if (!search.trim()) return folders;
    const searchLower = search.toLowerCase();
    return folders.filter(folder => 
      folder.name.toLowerCase().includes(searchLower)
    );
  }, [folders, search]);

  const handleMove = () => {
    onMove(selectedFolderId);
    onClose();
    setSearch('');
  };

  const handleClose = () => {
    onClose();
    setSearch('');
    setSelectedFolderId(currentFolderId || null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Move to Folder')}</DialogTitle>
          <DialogDescription>
            {documentName 
              ? t('Select a folder to move "{{name}}" into', { name: documentName })
              : t('Select a destination folder')}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search folders...')}
            className="pl-9"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-2">
          <div className="space-y-1">
            {/* Root folder option */}
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                transition-colors hover:bg-muted
                ${selectedFolderId === null ? 'bg-primary/10 text-primary' : ''}
              `}
            >
              <FileText className="h-4 w-4 opacity-50" />
              <span className="flex-1 text-left">{t('Root (No Folder)')}</span>
              {selectedFolderId === null && <Check className="h-4 w-4" />}
            </button>

            {/* Folder options */}
            {filteredFolders.map((folder) => {
              const count = documentsCount[folder.id] || 0;
              const isSelected = selectedFolderId === folder.id;
              const isCurrent = currentFolderId === folder.id;

              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    transition-colors hover:bg-muted
                    ${isSelected ? 'bg-primary/10 text-primary' : ''}
                    ${isCurrent ? 'opacity-50' : ''}
                  `}
                  disabled={isCurrent}
                >
                  <Folder className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {count > 0 && `(${count})`}
                  </span>
                  {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
                </button>
              );
            })}

            {filteredFolders.length === 0 && (
              <p className="text-center py-4 text-sm text-muted-foreground">
                {search ? t('No folders found') : t('No folders available')}
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            {t('Cancel')}
          </Button>
          <Button 
            onClick={handleMove} 
            className="flex-1"
            disabled={selectedFolderId === currentFolderId}
          >
            {t('Move')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}