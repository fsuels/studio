// src/components/AuthModal.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void; 
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as 'en' | 'es' || 'en';

  const handleNavigation = () => {
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{t('Authentication Required')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('Please sign in or create an account to save your document and proceed to payment.')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto border-input text-foreground">
            {t('Cancel')}
          </Button>
          <Button asChild className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href={`/${locale}/signup`} onClick={handleNavigation}>
              {t('Sign Up')}
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={`/${locale}/signin`} onClick={handleNavigation}>
              {t('Sign In')}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
