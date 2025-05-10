// src/app/[locale]/pricing/page.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; 
import { Check, ShieldCheck } from 'lucide-react'; 
import Link from 'next/link'; 
import { useParams } from 'next/navigation';
import React from 'react'; // Import React
import { Progress } from "@/components/ui/progress"; // Import Progress component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function PricingPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as 'en' | 'es';

  // Placeholder for freemium credit status
  const freeCreditsUsed = 0; // Example: 0 out of 1 used
  const totalFreeCredits = 1;
  const freeCreditProgress = (freeCreditsUsed / totalFreeCredits) * 100;

  return (
    <main className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
        {t('pricing.title', 'Simple, Transparent Pricing')} 
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        {t('pricing.payPerDocBadge', 'One-time $35/document • No subscription')}
      </p>

      {/* Freemium Credit Section Placeholder */}
      <Card className="max-w-md mx-auto mb-12 shadow-lg border-primary">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{t('pricing.freeCreditTitle', 'Your Free Document Credit')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {t('pricing.freeCreditStatus', { used: freeCreditsUsed, total: totalFreeCredits, defaultValue: `You've used ${freeCreditsUsed} of ${totalFreeCredits} free document credits.` })}
          </p>
          <Progress value={freeCreditProgress} className="w-full h-2 mb-3" />
           <Button asChild variant="link" className="text-sm">
             <Link href={`/${locale}/signup`}>{t('pricing.claimFreeCredit', 'Sign Up to Claim Your Free Document!')}</Link>
           </Button>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Single Document Plan */}
        <Card className="shadow-lg rounded-xl bg-card border border-border transition-all hover:shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              {t('pricing.plans.single.title', 'Single Document')} 
            </CardTitle>
            <CardDescription className="text-muted-foreground">
                {t('pricing.plans.single.description', 'Perfect for one-off needs.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-5xl font-bold text-primary mb-6">
              $35
              <span className="text-lg font-normal text-muted-foreground"> / {t('pricing.perDocument', 'document')}</span>
            </p>
            <ul className="text-sm text-left space-y-3 text-card-foreground/90">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item1', '1 downloadable legal PDF')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item2', 'Clause customization')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item3', 'Email support')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item4', 'Secure sharing (soon)')}</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/${locale}/#workflow-start`}>{t('pricing.cta', 'Get Started')}</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Bundle Plan */}
        <Card className="shadow-lg rounded-xl bg-card border-2 border-primary relative overflow-hidden transition-all hover:shadow-2xl transform md:scale-105">
           <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
             {t('pricing.mostPopular', 'Most Popular')}
           </div>
          <CardHeader className="pb-4 pt-10"> 
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              {t('pricing.plans.bundle.title', '5-Document Bundle')} 
            </CardTitle>
             <CardDescription className="text-muted-foreground">
                 {t('pricing.plans.bundle.description', 'Ideal for multiple related documents.')}
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-5xl font-bold text-primary mb-6">
              $150 
              <span className="text-lg font-normal text-muted-foreground"> / {t('pricing.bundleOf5', 'bundle of 5')}</span>
            </p>
             <ul className="text-sm text-left space-y-3 text-card-foreground/90">
               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.bundle.item1', '5 downloadable PDFs')}</li>
               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.bundle.item2', 'All single document features')}</li>
               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.bundle.item3', 'Credits never expire')}</li>
               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.bundle.item4', 'Best value per document')}</li>
             </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/${locale}/#workflow-start`}>{t('pricing.cta', 'Get Started')}</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Unlimited Plan */}
        <Card className="shadow-lg rounded-xl bg-card border border-border transition-all hover:shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              {t('pricing.plans.unlimited.title', 'Business Pro')} 
            </CardTitle>
             <CardDescription className="text-muted-foreground">
                 {t('pricing.plans.unlimited.description', 'For frequent users & businesses.')}
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-5xl font-bold text-primary mb-6">
              $99
              <span className="text-lg font-normal text-muted-foreground"> / {t('pricing.perMonth', 'month')}</span>
            </p>
            <ul className="text-sm text-left space-y-3 text-card-foreground/90">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.unlimited.item1', 'Unlimited documents')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.unlimited.item2', 'Priority support')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.unlimited.item3', 'Team features (coming soon)')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.unlimited.item4', 'Cancel anytime')}</li>
            </ul>
          </CardContent>
          <CardFooter>
             <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
               <Link href={`/${locale}/support`}>{t('pricing.ctaContact', 'Contact Sales')}</Link>
             </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Comparison Table Placeholder */}
      <section className="mt-16 md:mt-24 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
          {t('pricing.comparisonTitle', 'How We Compare')}
        </h2>
        <Card className="shadow-xl border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t('pricing.featureHeader', 'Feature')}</TableHead>
                <TableHead className="text-center text-primary font-semibold">123LegalDoc</TableHead>
                <TableHead className="text-center text-muted-foreground">{t('pricing.competitorHeader', 'Traditional Lawyer')}</TableHead>
                <TableHead className="text-center text-muted-foreground">{t('pricing.competitorOnlineHeader', 'Other Online Services')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{t('pricing.pricePerDocLabel', 'Avg. Price Per Document')}</TableCell>
                <TableCell className="text-center font-semibold text-foreground">$35</TableCell>
                <TableCell className="text-center text-muted-foreground">$200 - $1000+</TableCell>
                <TableCell className="text-center text-muted-foreground">$50 - $150 (often with subscriptions)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('pricing.customizationLabel', 'Customization Level')}</TableCell>
                <TableCell className="text-center text-foreground">{t('pricing.highLabel', 'High (AI-assisted)')}</TableCell>
                <TableCell className="text-center text-muted-foreground">{t('pricing.veryHighLabel', 'Very High (Tailored)')}</TableCell>
                <TableCell className="text-center text-muted-foreground">{t('pricing.mediumLabel', 'Medium (Templates)')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('pricing.speedLabel', 'Speed')}</TableCell>
                <TableCell className="text-center text-foreground">{t('pricing.minutesLabel', 'Minutes')}</TableCell>
                <TableCell className="text-center text-muted-foreground">{t('pricing.daysWeeksLabel', 'Days/Weeks')}</TableCell>
                <TableCell className="text-center text-muted-foreground">{t('pricing.hoursDaysLabel', 'Hours/Days')}</TableCell>
              </TableRow>
               <TableRow>
                <TableCell>{t('pricing.accessibilityLabel', 'Accessibility')}</TableCell>
                <TableCell className="text-center text-foreground">{t('pricing.accessible247Label', '24/7 Online')}</TableCell>
                <TableCell className="text-center text-muted-foreground">{t('pricing.officeHoursLabel', 'Office Hours, Appointments')}</TableCell>
                <TableCell className="text-center text-muted-foreground">{t('pricing.onlineLimitedSupportLabel', 'Online, Support Varies')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      <div className="mt-16 md:mt-20 flex flex-col items-center">
         <div className="inline-flex items-center gap-2 bg-card text-sm px-5 py-3 rounded-full shadow-md border border-border">
           <ShieldCheck className="h-5 w-5 text-primary" />
           <span className="font-medium text-foreground/90">{t('pricing.guarantee', '100% Satisfaction Guarantee or Your Money Back on single/bundle purchases.')}</span>
         </div>
      </div>
    </main>
  )
}
