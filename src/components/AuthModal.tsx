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
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useParams } from 'next/navigation';

/* ---------- real Firebase Auth imports -------------------------------- */
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
} from 'firebase/auth';
import { app } from '@/lib/firebase'; // your initialized Firebase app

/* ---------------------------------------------------------------------- */

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (_mode: 'signin' | 'signup', _uid: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const { login } = useAuth(); // local auth context
  const params = useParams();
  const locale = (params?.locale as 'en' | 'es') || 'en';

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailModal, setEmailModal] = useState('');
  const [passwordModal, setPasswordModal] = useState('');
  const [confirmPasswordModal, setConfirmPasswordModal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Reset fields each time the modal opens */
  useEffect(() => {
    if (isOpen) {
      setEmailModal('');
      setPasswordModal('');
      setConfirmPasswordModal('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  /* ------------------------- handler ---------------------------------- */

  const handleAuthAction = async () => {
    setIsSubmitting(true);

    // basic validation
    if (!emailModal || !passwordModal) {
      toast({
        title: t('authModal.errorMissingFieldsTitle', {
          defaultValue: 'Missing Information',
        }),
        description: t('authModal.errorMissingFieldsDesc', {
          defaultValue: 'Please enter both email and password.',
        }),
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (authMode === 'signup') {
      if (passwordModal !== confirmPasswordModal) {
        toast({
          title: t('authModal.errorPasswordMismatchTitle', {
            defaultValue: 'Password Mismatch',
          }),
          description: t('authModal.errorPasswordMismatchDesc', {
            defaultValue: 'Passwords do not match. Please try again.',
          }),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
    }

    /* -- real Firebase Auth call -------------------------------------- */
    try {
      const auth = getAuth(app);
      let cred: UserCredential;

      if (authMode === 'signup') {
        cred = await createUserWithEmailAndPassword(
          auth,
          emailModal,
          passwordModal,
        );
        toast({
          title: t('authModal.successTitle', {
            context: 'signup',
            defaultValue: 'Account Created!',
          }),
          description: t('authModal.successDescription', {
            defaultValue: 'You can now proceed.',
          }),
        });
      } else {
        cred = await signInWithEmailAndPassword(
          auth,
          emailModal,
          passwordModal,
        );
        toast({
          title: t('authModal.successTitle', {
            context: 'signin',
            defaultValue: 'Sign In Successful!',
          }),
          description: t('authModal.successDescription', {
            defaultValue: 'You can now proceed.',
          }),
        });
      }

      // update local auth context so the rest of the app knows the user
      // pass both email and uid so draft saving uses the real UID
      login(cred.user.email ?? '', cred.user.uid);

      // notify parent (WizardForm)
      onAuthSuccess(authMode, cred.user.uid);
    } catch (err: any) {
      console.error('[AuthModal] Firebase Auth error:', err);
      toast({
        title: t('authModal.errorAuthFailedTitle', {
          defaultValue: 'Authentication Failed',
        }),
        description:
          err?.code === 'auth/email-already-in-use'
            ? t('authModal.errorEmailInUse', {
                defaultValue: 'Email already in use.',
              })
            : err?.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------- JSX ------------------------------------- */

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setPasswordModal('');
    setConfirmPasswordModal('');
  };

  const handleCloseAndReset = () => {
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleCloseAndReset()}
    >
      <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader className="text-center items-center space-y-3">
          <Logo wrapperClassName="mb-3" />
          <DialogTitle className="text-2xl font-semibold text-card-foreground">
            {authMode === 'signin'
              ? t('Sign In', { defaultValue: 'Sign In' })
              : t('authModal.createAccountTitle', {
                  defaultValue: 'Create Your Account',
                })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {authMode === 'signin'
              ? t('authModal.accessDashboardDescription', {
                  defaultValue: 'Access your 123LegalDoc dashboard',
                })
              : t('authModal.createAccountDescription', {
                  defaultValue: 'Get started with 123LegalDoc today.',
                })}
          </DialogDescription>
        </DialogHeader>

        {/* ---------------- form fields ---------------- */}
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="email-modal" className="text-xs font-medium text-muted-foreground">
              {t('Email', { defaultValue: 'Email' })}
            </Label>
            <Input
              id="email-modal"
              type="email"
              placeholder={t('Enter your email', { defaultValue: 'Enter your email' })}
              className="bg-background border-input mt-1 h-10"
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
              className="bg-background border-input mt-1 h-10"
              value={passwordModal}
              onChange={(e) => setPasswordModal(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <Label
                htmlFor="confirm-password-modal"
                className="text-xs font-medium text-muted-foreground"
              >
                {t('authModal.confirmPasswordLabel', { defaultValue: 'Confirm Password' })}
              </Label>
              <Input
                id="confirm-password-modal"
                type="password"
                placeholder={t('authModal.confirmPasswordPlaceholder', { defaultValue: 'Confirm your password' })}
                className="bg-background border-input mt-1 h-10"
                value={confirmPasswordModal}
                onChange={(e) => setConfirmPasswordModal(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          )}
        </div>

        {/* ---------------- buttons ---------------- */}
        <DialogFooter className="flex flex-col gap-4 pt-2">
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

          <p className="text-center text-sm text-muted-foreground">
            {authMode === 'signin'
              ? t('authModal.promptSignUp', { defaultValue: "Don't have an account?" })
              : t('authModal.promptSignInShort', { defaultValue: 'Already have an account?' })}{' '}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleAuthMode();
              }}
              className="font-medium text-primary hover:underline"
            >
              {authMode === 'signin'
                ? t('Sign Up', { defaultValue: 'Sign Up' })
                : t('Sign In', { defaultValue: 'Sign In' })}
            </Link>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
