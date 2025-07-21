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
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/* ---------- real Firebase Auth imports -------------------------------- */
import type { UserCredential } from 'firebase/auth';
import { app } from '@/lib/firebase'; // your initialized Firebase app

/* ---------------------------------------------------------------------- */

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (uid?: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const { login, resetPassword } = useAuth(); // local auth context
  const params = useParams();
  const locale = (params?.locale as 'en' | 'es') || 'en';

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [emailModal, setEmailModal] = useState('');
  const [passwordModal, setPasswordModal] = useState('');
  const [confirmPasswordModal, setConfirmPasswordModal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  /* Reset fields each time the modal opens */
  useEffect(() => {
    if (isOpen) {
      setEmailModal('');
      setPasswordModal('');
      setConfirmPasswordModal('');
      setIsSubmitting(false);
      setIsResetEmailSent(false);
      setAuthMode('signin');
    }
  }, [isOpen]);

  /* ------------------------- handler ---------------------------------- */

  const handleAuthAction = async () => {
    setIsSubmitting(true);

    // Handle password reset
    if (authMode === 'reset') {
      if (!emailModal) {
        toast({
          title: t('authModal.errorMissingEmailTitle', {
            defaultValue: 'Email Required',
          }),
          description: t('authModal.errorMissingEmailDesc', {
            defaultValue: 'Please enter your email address.',
          }),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      try {
        await resetPassword(emailModal);
        setIsResetEmailSent(true);
        toast({
          title: t('authModal.resetEmailSentTitle', {
            defaultValue: 'Password Reset Email Sent',
          }),
          description: t('authModal.resetEmailSentDesc', {
            defaultValue: 'Check your email for password reset instructions.',
          }),
        });
      } catch (err: any) {
        toast({
          title: t('authModal.resetFailedTitle', {
            defaultValue: 'Reset Failed',
          }),
          description: err?.message || t('authModal.resetFailedDesc', {
            defaultValue: 'Unable to send password reset email. Please try again.',
          }),
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // basic validation for signin/signup
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
      const {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
      } = await import('firebase/auth');
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
      await login(
        cred.user.email || '',
        undefined,
        cred.user.uid,
        cred.user.displayName || undefined,
      );

      // notify parent with UID immediately
      if (cred.user?.uid) {
        onAuthSuccess(cred.user.uid);
      } else {
        onAuthSuccess();
      }
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
    setIsResetEmailSent(false);
  };

  const switchToResetMode = () => {
    setAuthMode('reset');
    setPasswordModal('');
    setConfirmPasswordModal('');
    setIsResetEmailSent(false);
  };

  const switchToSignInMode = () => {
    setAuthMode('signin');
    setPasswordModal('');
    setConfirmPasswordModal('');
    setIsResetEmailSent(false);
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
          {authMode === 'reset' && isResetEmailSent ? (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
          ) : (
            <Logo wrapperClassName="mb-3" />
          )}
          <DialogTitle className="text-2xl font-semibold text-card-foreground">
            {authMode === 'reset' && isResetEmailSent
              ? t('authModal.resetEmailSentTitle', {
                  defaultValue: 'Check Your Email',
                })
              : authMode === 'reset'
                ? t('authModal.resetPasswordTitle', {
                    defaultValue: 'Reset Your Password',
                  })
                : authMode === 'signin'
                  ? t('Sign In', { defaultValue: 'Sign In' })
                  : t('authModal.createAccountTitle', {
                      defaultValue: 'Create Your Account',
                    })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {authMode === 'reset' && isResetEmailSent
              ? t('authModal.resetEmailSentDescription', {
                  defaultValue: "We've sent password reset instructions to",
                })
              : authMode === 'reset'
                ? t('authModal.resetPasswordDescription', {
                    defaultValue:
                      "Enter your email address and we'll send you a link to reset your password.",
                  })
                : authMode === 'signin'
                  ? t('authModal.accessDashboardDescription', {
                      defaultValue: 'Access your 123LegalDoc dashboard',
                    })
                  : t('authModal.createAccountDescription', {
                      defaultValue: 'Get started with 123LegalDoc today.',
                    })}
          </DialogDescription>
          {authMode === 'reset' && isResetEmailSent && (
            <div className="mt-2 text-sm font-medium text-primary">{emailModal}</div>
          )}
        </DialogHeader>

        {/* ---------------- form fields or success message ---------------- */}
        {authMode === 'reset' && isResetEmailSent ? (
          <div className="py-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                {t('authModal.resetEmailCheckSpam', {
                  defaultValue:
                    "If you don't see the email, check your spam folder. The link will expire in 1 hour.",
                })}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <Label
                htmlFor="email-modal"
                className="text-xs font-medium text-muted-foreground"
              >
                {t('Email', { defaultValue: 'Email' })}
              </Label>
              <Input
                id="email-modal"
                type="email"
                placeholder={t('Enter your email', {
                  defaultValue: 'Enter your email',
                })}
                className="bg-background border-input mt-1 h-10"
                value={emailModal}
                onChange={(e) => setEmailModal(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {authMode !== 'reset' && (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password-modal"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      {t('Password', { defaultValue: 'Password' })}
                    </Label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={switchToResetMode}
                        className="text-xs text-primary hover:text-primary/80 underline"
                      >
                        {t('Forgot Password?', { defaultValue: 'Forgot Password?' })}
                      </button>
                    )}
                  </div>
                  <Input
                    id="password-modal"
                    type="password"
                    placeholder={t('Enter your password', {
                      defaultValue: 'Enter your password',
                    })}
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
                      {t('authModal.confirmPasswordLabel', {
                        defaultValue: 'Confirm Password',
                      })}
                    </Label>
                    <Input
                      id="confirm-password-modal"
                      type="password"
                      placeholder={t('authModal.confirmPasswordPlaceholder', {
                        defaultValue: 'Confirm your password',
                      })}
                      className="bg-background border-input mt-1 h-10"
                      value={confirmPasswordModal}
                      onChange={(e) => setConfirmPasswordModal(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ---------------- buttons ---------------- */}
        <DialogFooter className="flex flex-col gap-4 pt-2">
          {authMode === 'reset' && isResetEmailSent ? (
            <>
              <Button
                onClick={() => setIsResetEmailSent(false)}
                variant="outline"
                className="w-full h-11 text-base"
              >
                {t('authModal.sendAnotherEmail', {
                  defaultValue: 'Send Another Email',
                })}
              </Button>
              <button
                onClick={switchToSignInMode}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('authModal.backToSignIn', { defaultValue: 'Back to Sign In' })}
              </button>
            </>
          ) : (
            <>
              <Button
                onClick={handleAuthAction}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t('authModal.submitting', { defaultValue: 'Processing...' })
                  : authMode === 'reset'
                    ? t('authModal.sendResetLink', {
                        defaultValue: 'Send Reset Link',
                      })
                    : authMode === 'signin'
                      ? t('Sign In', { defaultValue: 'Sign In' })
                      : t('authModal.createAccountButton', {
                          defaultValue: 'Create Account',
                        })}
              </Button>

              {authMode === 'reset' ? (
                <button
                  onClick={switchToSignInMode}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('authModal.backToSignIn', { defaultValue: 'Back to Sign In' })}
                </button>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  {authMode === 'signin'
                    ? t('authModal.promptSignUp', {
                        defaultValue: "Don't have an account?",
                      })
                    : t('authModal.promptSignInShort', {
                        defaultValue: 'Already have an account?',
                      })}{' '}
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
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
