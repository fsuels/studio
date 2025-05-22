// src/components/AuthModal.tsx
'use client';

import React, { useState } from 'react'; // Added useState
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
import { Logo } from '@/components/layout/Logo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { t } = useTranslation("common");
  const params = useParams();
  const locale = (params.locale as 'en' | 'es') || 'en';
  const { toast } = useToast(); // Initialize useToast

  const [emailModal, setEmailModal] = useState('');
  const [passwordModal, setPasswordModal] = useState('');

  const handleSignInAttempt = () => {
    if (!emailModal || !passwordModal) {
      toast({
        title: t('authModal.errorMissingFieldsTitle', { defaultValue: 'Missing Information' }),
        description: t('authModal.errorMissingFieldsDesc', { defaultValue: 'Please enter both email and password.' }),
        variant: 'destructive',
      });
      return;
    }
    // In a real scenario, you might attempt a quick auth here or just pass data
    // For now, onAuthSuccess will be called, which closes the modal and shows a success toast.
    onAuthSuccess();
    setEmailModal(''); // Clear fields after "attempt"
    setPasswordModal('');
  };

  const handleCloseAndReset = () => {
    setEmailModal('');
    setPasswordModal('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAndReset()}>
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
              value={emailModal}
              onChange={(e) => setEmailModal(e.target.value)}
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
              value={passwordModal}
              onChange={(e) => setPasswordModal(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={handleSignInAttempt} 
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-base"
          >
            {t('Sign In', { defaultValue: 'Sign In' })}
          </Button>
          <Button 
            variant="outline" 
            asChild 
            className="w-full h-11 border-primary text-primary hover:bg-primary/10 text-base"
            onClick={handleCloseAndReset} // Close modal when navigating
          >
            <Link href={`/${locale}/signup`}>
              {t('authModal.createFreeAccount', { defaultValue: 'Create Free Account' })}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
