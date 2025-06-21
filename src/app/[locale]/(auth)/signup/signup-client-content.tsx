// src/app/[locale]/signup/signup-client-content.tsx
'use client';

import React, { useState } from 'react';
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
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { auditService } from '@/services/firebase-audit-service';
import { createProgressTracker } from '@/lib/onboarding/progress-tracker';

interface SignUpClientContentProps {
  locale: 'en' | 'es';
}

export default function SignUpClientContent({
  locale,
}: SignUpClientContentProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: t('Signup Failed', { defaultValue: 'Signup Failed' }),
        description: t('Passwords do not match.'),
        variant: 'destructive',
      });
      return;
    }
    if (email && password) {
      try {
        const userCredential = await signUp(email, password);

        // Initialize onboarding for new user
        if (userCredential?.user?.uid) {
          const tracker = createProgressTracker(userCredential.user.uid);
          await tracker.initializeProgress(); // Will be set up in onboarding wizard
        }

        // Log successful signup
        await auditService.logAuthEvent('signup', {
          email,
          ipAddress: window.location.hostname,
          userAgent: navigator.userAgent,
          locale,
          success: true,
        });

        toast({
          title: t('Account Created!'),
          description: t('Redirecting to your dashboard...'),
        });
        router.push(`/${locale}/dashboard`);
      } catch (err: any) {
        // Log failed signup attempt
        await auditService.logAuthEvent('signup', {
          email,
          ipAddress: window.location.hostname,
          userAgent: navigator.userAgent,
          locale,
          success: false,
          error: err?.message || 'Authentication error',
        });

        toast({
          title: t('Signup Failed', { defaultValue: 'Signup Failed' }),
          description: err?.message || 'Authentication error',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: t('Signup Failed', { defaultValue: 'Signup Failed' }),
        description: t('Please fill in all fields.'),
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl bg-card border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">
            {t('Sign Up')}
          </CardTitle>
          <CardDescription>
            {t('Create your 123LegalDoc account')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-signup" className="text-muted-foreground">
                {t('Email')}
              </Label>
              <Input
                id="email-signup"
                type="email"
                placeholder={t('Enter your email', {
                  defaultValue: 'Enter your email',
                })}
                className="bg-background text-foreground border-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="password-signup"
                className="text-muted-foreground"
              >
                {t('Password')}
              </Label>
              <Input
                id="password-signup"
                type="password"
                placeholder={t('Create a password', {
                  defaultValue: 'Create a password',
                })}
                className="bg-background text-foreground border-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="confirm-password-signup"
                className="text-muted-foreground"
              >
                {t('Confirm Password')}
              </Label>
              <Input
                id="confirm-password-signup"
                type="password"
                placeholder={t('Confirm your password', {
                  defaultValue: 'Confirm your password',
                })}
                className="bg-background text-foreground border-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('Create Account')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('Already have an account?')}{' '}
              <Link
                href={`/${locale}/signin`}
                className="underline text-primary hover:text-primary/80"
              >
                {t('Sign In')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
