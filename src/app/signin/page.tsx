// src/app/signin/page.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';

export default function SignInPage() {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl bg-card border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">{t('Sign In')}</CardTitle>
          <CardDescription>{t('Access your 123LegalDoc dashboard')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-signin" className="text-muted-foreground">{t('Email')}</Label>
            <Input id="email-signin" type="email" placeholder={t('Enter your email')} className="bg-background text-foreground border-input" />
          </div>
          <div>
            <Label htmlFor="password-signin" className="text-muted-foreground">{t('Password')}</Label>
            <Input id="password-signin" type="password" placeholder={t('Enter your password')} className="bg-background text-foreground border-input" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{t('Sign In')}</Button>
          <p className="text-xs text-muted-foreground text-center">
            {t("Don't have an account?")} <Link href="/signup" className="underline text-primary hover:text-primary/80">{t('Sign Up')}</Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
