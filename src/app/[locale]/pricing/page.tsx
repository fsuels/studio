// src/app/[locale]/pricing/page.tsx
'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; 
import { Check } from 'lucide-react'; 
import Link from 'next/link'; 
import { useParams } from 'next/navigation';

export default function PricingPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as 'en' | 'es';

  return (
    <main className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
        {t('pricing.title', 'Simple, Transparent Pricing')} 
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        {t('pricing.subtitle', 'Pay only for what you need. No hidden fees, no subscriptions required.')} 
      </p>

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
              $5
              <span className="text-lg font-normal text-muted-foreground"> / {t('pricing.perDocument', 'document')}</span>
            </p>
            <ul className="text-sm text-left space-y-3 text-card-foreground/90">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item1', 'Generate one document')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item2', 'AI-guided questionnaire')}</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.single.item3', 'Downloadable PDF')}</li>
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
              {t('pricing.plans.bundle.title', 'Document Bundle')} 
            </CardTitle>
             <CardDescription className="text-muted-foreground">
                 {t('pricing.plans.bundle.description', 'Ideal for multiple related documents.')}
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-5xl font-bold text-primary mb-6">
              $20
              <span className="text-lg font-normal text-muted-foreground"> / {t('pricing.bundleOf5', 'bundle of 5')}</span>
            </p>
             <ul className="text-sm text-left space-y-3 text-card-foreground/90">
               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {t('pricing.plans.bundle.item1', 'Generate up to 5 documents')}</li>
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
                 {t('pricing.plans.unlimited.description', 'For frequent users &amp; businesses.')}
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

      <p className="text-sm text-muted-foreground mt-12 italic">
         🛡️ {t('pricing.guarantee', '100% Satisfaction Guarantee or Your Money Back on single/bundle purchases.')} 
      </p>
    </main>
  )
}
