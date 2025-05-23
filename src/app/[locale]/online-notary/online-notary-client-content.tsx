'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'
import { usStates } from '@/lib/usStates'
import { useTranslation } from 'react-i18next'

export default function OnlineNotaryClientContent() {
  const { t } = useTranslation('common')

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          {t('onlineNotary.headline', 'Online Notary – Easily notarize documents online with guaranteed security and privacy. Legal in all 50 states.')}
        </h1>
        <Button asChild>
          <Link href="/templates">{t('onlineNotary.addDocument', 'Add Document')}</Link>
        </Button>
      </section>

      <section className="flex flex-col items-center md:flex-row md:items-start gap-4">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <p className="text-muted-foreground max-w-xl">
          {t('onlineNotary.description', 'An online notary allows you to get documents notarized remotely through secure video. Your information remains encrypted and private.')}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('onlineNotary.howItWorks', 'How it works')}</h2>
        <ol className="list-decimal ml-6 space-y-2 text-muted-foreground">
          <li>{t('onlineNotary.stepUpload', 'Upload the document.')}</li>
          <li>{t('onlineNotary.stepConnect', 'Connect with a notary via secure video.')}</li>
          <li>{t('onlineNotary.stepPay', 'Pay and download the notarized document.')}</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('onlineNotary.pricingTitle', 'Pricing')}</h2>
        <p className="text-muted-foreground">{t('onlineNotary.pricing', '$25 for the first seal and $10 for each additional seal.')}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('onlineNotary.legalTitle', 'Legal Across the U.S.')}</h2>
        <p className="text-muted-foreground mb-4">{t('onlineNotary.legalDesc', 'Our partner service is legal in all 50 states.')}</p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-sm text-muted-foreground">
          {usStates.map((s) => (
            <li key={s.value}>{s.label}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('onlineNotary.securityTitle', 'Security & Compliance')}</h2>
        <p className="text-muted-foreground">
          {t('onlineNotary.securityDesc', 'Our notary API provider uses end-to-end encryption and maintains strict compliance with state laws and identity verification requirements.')}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">{t('onlineNotary.learnMore', 'Learn More')}</h2>
        <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
          <li>
            <Link href="/faq" className="hover:underline">
              {t('onlineNotary.faqLink', 'Online Notary FAQs')}
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:underline">
              {t('onlineNotary.articlesLink', 'Articles about remote notarization')}
            </Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
