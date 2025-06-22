'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  const { t } = useTranslation('common');
  const params = useParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const locale = params!.locale as 'en' | 'es';

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Prefetch the signin route
  useEffect(() => {
    router.prefetch(`/${locale}/signin`);
  }, [router, locale]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: t('resetPassword.errorTitle', { defaultValue: 'Email Required' }),
        description: t('resetPassword.errorDescription', { 
          defaultValue: 'Please enter your email address.' 
        }),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsEmailSent(true);
      toast({
        title: t('resetPassword.successTitle', { 
          defaultValue: 'Password Reset Email Sent' 
        }),
        description: t('resetPassword.successDescription', { 
          defaultValue: 'Check your email for password reset instructions.' 
        }),
      });
    } catch (err: any) {
      toast({
        title: t('resetPassword.failedTitle', { 
          defaultValue: 'Reset Failed' 
        }),
        description: err?.message || t('resetPassword.failedDescription', { 
          defaultValue: 'Unable to send password reset email. Please try again.' 
        }),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsEmailSent(false);
    setEmail('');
  };

  if (isEmailSent) {
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
              {t('resetPassword.emailSentTitle', { 
                defaultValue: 'Check Your Email' 
              })}
            </CardTitle>
            <CardDescription className="text-base">
              {t('resetPassword.emailSentDescription', { 
                defaultValue: 'We\'ve sent password reset instructions to' 
              })}
            </CardDescription>
            <div className="mt-2 text-sm font-medium text-primary">{email}</div>
          </CardHeader>
          <CardContent>
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                {t('resetPassword.checkSpamNote', { 
                  defaultValue: 'If you don\'t see the email, check your spam folder. The link will expire in 1 hour.' 
                })}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleSendAnother}
              variant="outline"
              className="w-full"
            >
              {t('resetPassword.sendAnother', { 
                defaultValue: 'Send Another Email' 
              })}
            </Button>
            <Link
              href={`/${locale}/signin`}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('resetPassword.backToSignIn', { 
                defaultValue: 'Back to Sign In' 
              })}
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl bg-card border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">
            {t('resetPassword.title', { 
              defaultValue: 'Reset Your Password' 
            })}
          </CardTitle>
          <CardDescription>
            {t('resetPassword.description', { 
              defaultValue: 'Enter your email address and we\'ll send you a link to reset your password.' 
            })}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-reset" className="text-muted-foreground">
                {t('Email')}
              </Label>
              <Input
                id="email-reset"
                type="email"
                placeholder={t('Enter your email')}
                className="bg-background text-foreground border-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? t('resetPassword.sending', { defaultValue: 'Sending...' })
                : t('resetPassword.sendLink', { defaultValue: 'Send Reset Link' })
              }
            </Button>
            <Link
              href={`/${locale}/signin`}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('resetPassword.backToSignIn', { 
                defaultValue: 'Back to Sign In' 
              })}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}