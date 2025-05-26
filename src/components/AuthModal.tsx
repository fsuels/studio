// src/components/AuthModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/layout/Logo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (mode: 'signin' | 'signup', email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const { login } = useAuth(); // Get the login function from useAuth

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailModal, setEmailModal] = useState('');
  const [passwordModal, setPasswordModal] = useState('');
  const [confirmPasswordModal, setConfirmPasswordModal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmailModal('');
      setPasswordModal('');
      setConfirmPasswordModal('');
      setIsSubmitting(false);
      // setAuthMode('signin'); // Default to signin when opened
    }
  }, [isOpen]);

  const handleAuthAction = async () => {
    setIsSubmitting(true);
    if (!emailModal || !passwordModal) {
      toast({
        title: t('authModal.errorMissingFieldsTitle', { defaultValue: 'Missing Information' }),
        description: t('authModal.errorMissingFieldsDesc', { defaultValue: 'Please enter both email and password.' }),
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (authMode === 'signup') {
      if (!confirmPasswordModal) {
        toast({
          title: t('authModal.errorMissingFieldsTitle', { defaultValue: 'Missing Information' }),
          description: t('authModal.errorConfirmPasswordDesc', { defaultValue: 'Please confirm your password.' }),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      if (passwordModal !== confirmPasswordModal) {
        toast({
          title: t('authModal.errorPasswordMismatchTitle', { defaultValue: 'Password Mismatch' }),
          description: t('authModal.errorPasswordMismatchDesc', { defaultValue: 'Passwords do not match. Please try again.' }),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      // Simulate successful signup
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
      login(emailModal); // Call useAuth login
      toast({
        title: t('authModal.successTitle', { context: 'signup', defaultValue: 'Account Created!' }),
        description: t('authModal.successDescription', { defaultValue: 'You can now proceed.' })
      });
      onAuthSuccess('signup', emailModal);
    } else { // authMode === 'signin'
      // Simulate successful signin
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
      login(emailModal); // Call useAuth login
      toast({
        title: t('authModal.successTitle', { context: 'signin', defaultValue: 'Sign In Successful!' }),
        description: t('authModal.successDescription', { defaultValue: 'You can now proceed.' })
      });
      onAuthSuccess('signin', emailModal);
    }
    setIsSubmitting(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(prevMode => (prevMode === 'signin' ? 'signup' : 'signin'));
    // Clear password fields when toggling for better UX
    setPasswordModal('');
    setConfirmPasswordModal('');
  };

  const handleCloseAndReset = () => {
    onClose();
    // Reset to signin mode when modal is closed, ready for next opening
    // setAuthMode('signin'); // This is handled by useEffect on isOpen now
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAndReset()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader className="text-center items-center space-y-3">
          <Logo wrapperClassName="mb-3" />
          <DialogTitle className="text-2xl font-semibold text-card-foreground">
            {authMode === 'signin'
              ? t('Sign In', { defaultValue: 'Sign In' })
              : t('authModal.createAccountTitle', { defaultValue: 'Create Your Account' })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {authMode === 'signin'
              ? t('authModal.accessDashboardDescription', { defaultValue: 'Access your 123LegalDoc dashboard' })
              : t('authModal.createAccountDescription', { defaultValue: 'Get started with 123LegalDoc today.'})}
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
              disabled={isSubmitting}
              required
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
              disabled={isSubmitting}
              required
            />
          </div>
          {authMode === 'signup' && (
            <div>
              <Label htmlFor="confirm-password-modal" className="text-xs font-medium text-muted-foreground">
                {t('authModal.confirmPasswordLabel', { defaultValue: 'Confirm Password' })}
              </Label>
              <Input
                id="confirm-password-modal"
                type="password"
                placeholder={t('authModal.confirmPasswordPlaceholder', { defaultValue: 'Confirm your password' })}
                className="bg-background border-input mt-1"
                value={confirmPasswordModal}
                onChange={(e) => setConfirmPasswordModal(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleAuthAction}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t('authModal.submitting', { defaultValue: 'Processing...' })
              : authMode === 'signin'
              ? t('Sign In', { defaultValue: 'Sign In' })
              : t('authModal.createAccountButton', { defaultValue: 'Create Account' })}
          </Button>
          <Button
            type="button"
            variant="outline" // Changed to outline for better visibility
            onClick={toggleAuthMode}
            className="text-sm text-primary hover:text-primary/80 font-medium w-full h-10 border-primary hover:bg-primary/10"
            disabled={isSubmitting}
          >
            {authMode === 'signin'
              ? t('authModal.createFreeAccount', { defaultValue: "Create Free Account" }) // Use new key
              : t('authModal.promptSignIn', { defaultValue: 'Already have an account? Sign In' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
