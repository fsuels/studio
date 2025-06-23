'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { useToast } from '@/hooks/use-toast';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function AuthActionPage() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const locale = params!.locale as 'en' | 'es';

  // URL parameters
  const mode = searchParams.get('mode');
  const actionCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl');

  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);

  // Verify the action code when component mounts
  useEffect(() => {
    const verifyCode = async () => {
      if (!actionCode || mode !== 'resetPassword') {
        setError('Invalid password reset link. Please request a new one.');
        setIsLoading(false);
        return;
      }

      try {
        const auth = getAuth(app);
        const email = await verifyPasswordResetCode(auth, actionCode);
        setEmail(email);
        setIsValidCode(true);
        setError('');
      } catch (err: any) {
        console.error('Password reset code verification failed:', err);
        
        let errorMessage = 'Invalid or expired password reset link.';
        
        if (err.code === 'auth/expired-action-code') {
          errorMessage = 'This password reset link has expired. Please request a new one.';
        } else if (err.code === 'auth/invalid-action-code') {
          errorMessage = 'This password reset link is invalid or has already been used.';
        } else if (err.code === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled.';
        } else if (err.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address.';
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyCode();
  }, [actionCode, mode]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const auth = getAuth(app);
      await confirmPasswordReset(auth, actionCode!, newPassword);
      
      setIsSuccess(true);
      
      toast({
        title: t('authAction.resetSuccessTitle', { 
          defaultValue: 'Password Reset Successful' 
        }),
        description: t('authAction.resetSuccessDesc', { 
          defaultValue: 'Your password has been updated. You can now sign in with your new password.' 
        }),
      });

      // Redirect to sign-in page after a delay
      setTimeout(() => {
        router.push(`/${locale}/signin`);
      }, 3000);

    } catch (err: any) {
      console.error('Password reset failed:', err);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.code === 'auth/expired-action-code') {
        errorMessage = 'This reset link has expired. Please request a new one.';
      } else if (err.code === 'auth/invalid-action-code') {
        errorMessage = 'This reset link is invalid or has already been used.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full max-w-md shadow-xl bg-card border border-border">
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t('authAction.verifying', { defaultValue: 'Verifying reset link...' })}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full max-w-md shadow-xl bg-card border border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">
              {t('authAction.successTitle', { defaultValue: 'Password Updated!' })}
            </CardTitle>
            <CardDescription>
              {t('authAction.successDescription', { 
                defaultValue: 'Your password has been successfully updated. Redirecting to sign in...' 
              })}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href={`/${locale}/signin`}
              className="w-full"
            >
              <Button className="w-full">
                {t('authAction.signInNow', { defaultValue: 'Sign In Now' })}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Error state
  if (error && !isValidCode) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full max-w-md shadow-xl bg-card border border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">
              {t('authAction.errorTitle', { defaultValue: 'Reset Link Invalid' })}
            </CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Link href={`/${locale}/reset-password`} className="w-full">
              <Button className="w-full">
                {t('authAction.requestNewLink', { defaultValue: 'Request New Reset Link' })}
              </Button>
            </Link>
            <Link
              href={`/${locale}/signin`}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('authAction.backToSignIn', { defaultValue: 'Back to Sign In' })}
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  // Password reset form
  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl bg-card border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">
            {t('authAction.setNewPassword', { defaultValue: 'Set New Password' })}
          </CardTitle>
          <CardDescription>
            {t('authAction.setNewPasswordDesc', { 
              defaultValue: 'Enter your new password for' 
            })}: <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordReset}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label htmlFor="new-password">
                {t('authAction.newPassword', { defaultValue: 'New Password' })}
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('authAction.enterNewPassword', { 
                    defaultValue: 'Enter your new password' 
                  })}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirm-password">
                {t('authAction.confirmPassword', { defaultValue: 'Confirm Password' })}
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('authAction.confirmNewPassword', { 
                  defaultValue: 'Confirm your new password' 
                })}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('authAction.updating', { defaultValue: 'Updating...' })}
                </>
              ) : (
                t('authAction.updatePassword', { defaultValue: 'Update Password' })
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}