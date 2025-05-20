/*
Prompt Objective:
Create a fully functional `VehicleBillOfSalePage.tsx` React component for a Next.js 15 static-export project using Tailwind CSS, Firebase, and i18next.

Requirements:
1. 🔖 SEO & Metadata:
   - Set dynamic title: "Vehicle Bill of Sale - 100% Legal in All 50 States"
   - Meta description: "Create a legally binding vehicle bill of sale online in minutes. Valid in all 50 states. Free PDF, bilingual, attorney-reviewed."
   - JSON-LD structured data: FAQPage schema + HowTo
2. 🧾 Hero Section:
   - Headline: "Easily Transfer Vehicle Ownership with a Legally Binding Bill of Sale"
   - Subtext: "Attorney-reviewed. Valid in all 50 states. Instantly downloadable."
   - CTA button: “Start My Bill of Sale” → scrolls to dynamic form or sign-up
   - Trust badges: "AI + Human Verified" / "Secure PDF Storage" / "Bilingual Support"
3. 📄 Content Section with Accordion (FAQs)
4. 🌍 i18n Integration (react-i18next)
5. 🧠 Smart Compliance Banner
6. 🛠️ UX Features
7. 💬 Firebase Integration (Optional for MVP)
8. ⚖️ Legal Notice Block
9. 📥 CTA Footer
10. 📦 Tech Stack: Next.js 15 App Router, TailwindCSS 3, Typescript, Firebase Hosting + Firestore, i18next, Markdown loader (optional)
*/

'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { usStates } from '@/lib/document-library';
import {
  vehicleBillOfSaleFaqs,
  type FaqItem,
} from './faqs';
import {
  getVehicleCompliance,
  vehicleComplianceStates,
} from '@/lib/states/vehicle-compliance';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';

export default function VehicleBillOfSalePage() {
  const { t, i18n } = useTranslation('common');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedState, setSelectedState] = useState('');
  const [complianceMessage, setComplianceMessage] = useState('');
  const [faqVisits, setFaqVisits] = useState<Record<string, number>>({});

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    if (selectedState) {
      const compliance = getVehicleCompliance(selectedState);
      if (compliance) {
        setComplianceMessage(
          compliance.notarizationRequired
            ? `⚠️ Notarization required in ${compliance.state}`
            : `✔ Valid in ${compliance.state}`
        );
      }
    }
  }, [selectedState]);

  useEffect(() => {
    // Example Firestore read for compliance data
    async function loadCompliance() {
      try {
        const ref = doc(collection(db, 'compliance'), 'vehicle');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          // Extend compliance data if needed
          console.log('Loaded compliance info from Firestore');
        }
      } catch (err) {
        console.warn('Firestore unavailable or not configured', err);
      }
    }
    loadCompliance();
  }, []);

  const handleFaqToggle = (q: FaqItem) => {
    setFaqVisits((prev) => ({
      ...prev,
      [q.questionEn]: (prev[q.questionEn] || 0) + 1,
    }));
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vehicleBillOfSaleFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answerEn,
      },
    })),
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create a vehicle bill of sale',
    step: [
      'Answer a few questions about the buyer, seller, and vehicle',
      'Review state-specific compliance warnings',
      'Download and sign your PDF',
    ],
  };

  return (
    <>
      <Head>
        <title>Vehicle Bill of Sale - 100% Legal in All 50 States</title>
        <meta
          name="description"
          content="Create a legally binding vehicle bill of sale online in minutes. Valid in all 50 states. Free PDF, bilingual, attorney-reviewed."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([faqJsonLd, howToJsonLd]),
          }}
        />
      </Head>
      <main className="container mx-auto px-4 py-10">
        <section className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t(
              'vehicleBillOfSale.heroTitle',
              'Easily Transfer Vehicle Ownership with a Legally Binding Bill of Sale'
            )}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'vehicleBillOfSale.heroSubtitle',
              'Attorney-reviewed. Valid in all 50 states. Instantly downloadable.'
            )}
          </p>
          <div className="flex justify-center gap-3">
            <Badge>AI + Human Verified</Badge>
            <Badge>Secure PDF Storage</Badge>
            <Badge>Bilingual Support</Badge>
          </div>
          <Button size="lg" className="mt-4" asChild>
            <Link href="/#workflow-start">
              {t('vehicleBillOfSale.startCta', 'Start My Bill of Sale')}
            </Link>
          </Button>
          <button
            className="ml-4 underline text-sm"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
        </section>

        <section className="mb-8 sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border py-2">
          <div className="flex items-center gap-2 justify-center text-sm">
            <select
              className="border rounded px-2 py-1 text-foreground bg-background"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Choose state</option>
              {usStates.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {complianceMessage && (
              <span className="font-medium">{complianceMessage}</span>
            )}
          </div>
        </section>

        <section id="faqs" className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
            {t('vehicleBillOfSale.faqTitle', 'Frequently Asked Questions')}
          </h2>
          <Accordion type="single" collapsible>
            {vehicleBillOfSaleFaqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                onClick={() => handleFaqToggle(faq)}
              >
                <AccordionTrigger className="font-medium text-left">
                  {language === 'en' ? faq.questionEn : faq.questionEs}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {language === 'en' ? faq.answerEn : faq.answerEs}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="max-w-xl mx-auto mb-12">
          <Progress value={33} className="mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            {t(
              'vehicleBillOfSale.progressText',
              'Step 1 of 3: Answer a few questions'
            )}
          </p>
        </section>

        <section className="text-center mb-20">
          <p className="text-xs text-muted-foreground mb-4">
            {t(
              'vehicleBillOfSale.legalNotice',
              'This page is for informational purposes only and does not constitute legal advice. Always consult a licensed attorney in your state.'
            )}
          </p>
          <Button asChild size="lg">
            <Link href="/#workflow-start">
              {t('vehicleBillOfSale.footerCta', 'Create My Bill of Sale Now')}
            </Link>
          </Button>
        </section>
      </main>
    </>
  );
}
