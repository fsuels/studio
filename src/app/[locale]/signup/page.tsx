// src/app/[locale]/signup/page.tsx
'use client';

import React, { useState } from 'react'; // Added useState
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { useParams, useRouter } from 'next/navigation'; // Added useRouter
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function SignUpPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { login } = useAuth(); // Use login to simulate account creation + login
  const { toast } = useToast();
  const locale = params.locale as 'en' | 'es';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate, create user in backend, then login
    if (password !== confirmPassword) {
      toast({ title: t('Signup Failed'), description: t('Passwords do not match.'), variant: 'destructive' });
      return;
    }
    if (email && password) { // Basic check
      login(email); // Mock: "creates" account and "logs in"
      toast({ title: t('Account Created!'), description: t('Redirecting to your dashboard...') });
      router.push(`/${locale}/dashboard`); // Redirect to dashboard
    } else {
      toast({ title: t('Signup Failed'), description: t('Please fill in all fields.'), variant: 'destructive' });
    }
  };


  return (
    <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl bg-card border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-card-foreground">{t('Sign Up')}</CardTitle>
          <CardDescription>{t('Create your 123LegalDoc account')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-signup" className="text-muted-foreground">{t('Email')}</Label>
              <Input 
                id="email-signup" 
                type="email" 
                placeholder={t('Enter your email')} 
                className="bg-background text-foreground border-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password-signup" className="text-muted-foreground">{t('Password')}</Label>
              <Input 
                id="password-signup" 
                type="password" 
                placeholder={t('Create a password')} 
                className="bg-background text-foreground border-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
           <div>
              <Label htmlFor="confirm-password-signup" className="text-muted-foreground">{t('Confirm Password')}</Label>
              <Input 
                id="confirm-password-signup" 
                type="password" 
                placeholder={t('Confirm your password')} 
                className="bg-background text-foreground border-input" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{t('Create Account')}</Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('Already have an account?')} <Link href={`/${locale}/signin`} className="underline text-primary hover:text-primary/80">{t('Sign In')}</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
