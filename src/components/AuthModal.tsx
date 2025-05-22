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
import { Logo } from '@/components/layout/Logo'; // Import the Logo
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void; // This might not be used if we always navigate away
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { t } = useTranslation("common");
  const params = useParams();
  const locale = (params.locale as 'en' | 'es') || 'en';

  // Simplified handler, actual auth happens on the dedicated pages
  const handleNavigation = () => {
    onClose();
    // onAuthSuccess might not be relevant if we always redirect
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader className="text-center items-center space-y-3">
          <Logo wrapperClassName="mb-3" />
          <DialogTitle className="text-2xl font-semibold text-card-foreground">
            {t('Sign In', { defaultValue: 'Sign In' })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t('authModal.accessDashboardDescription', { defaultValue: 'Access your 123LegalDoc dashboard' })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="email-modal" className="text-xs font-medium text-muted-foreground">
              {t('Email', { defaultValue: 'Email' })}
            </Label>
            <Input 
              id="email-modal" 
              type="email" 
              placeholder={t('Enter your email', { defaultValue: 'Enter your email' })} 
              className="bg-background border-input mt-1" 
              disabled // Visual placeholder
            />
          </div>
          <div>
            <Label htmlFor="password-modal" className="text-xs font-medium text-muted-foreground">
              {t('Password', { defaultValue: 'Password' })}
            </Label>
            <Input 
              id="password-modal" 
              type="password" 
              placeholder={t('Enter your password', { defaultValue: 'Enter your password' })} 
              className="bg-background border-input mt-1" 
              disabled // Visual placeholder
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 pt-2">
          <Button asChild className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-base">
            <Link href={`/${locale}/signin`} onClick={handleNavigation}>
              {t('Sign In', { defaultValue: 'Sign In' })}
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {t("Don't have an account?", { defaultValue: "Don't have an account?" })}{' '}
            <Link href={`/${locale}/signup`} onClick={handleNavigation} className="font-semibold text-primary hover:underline">
              {t('Sign Up', { defaultValue: 'Sign Up' })}
            </Link>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
