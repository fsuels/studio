// src/app/es/docs/bill-of-sale-vehicle/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartProvider';
import { track } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import DocumentPreview from '@/components/DocumentPreview'; // Updated import
import { requiredNotaryStates } from '@/lib/stateNotaryRequirements';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { FileText, Lock, DownloadCloud } from 'lucide-react';

export default function BillOfSalePageES() {
  const { t, i18n } = useTranslation();
  const locale = 'es'; // Explicitly set locale
  const router = useRouter();

  const [stateCode, setStateCode] = useState<string>('CA'); // default
  const [wantNotary, setWantNotary] = useState<boolean>(requiredNotaryStates.includes(stateCode));
  const { addItem } = useCart();
  const priceCents = 1995; // $19.95

  useEffect(() => {
    // Ensure i18n is ready and set to Spanish for this page if not already
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es');
    }
    track('view_item', { item_id: 'bill-of-sale-vehicle', item_name_es: t('Contrato de Compraventa de Vehículo', { lng: 'es'}), value: priceCents / 100, currency: 'USD' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceCents, i18n]);

  useEffect(() => {
    setWantNotary(requiredNotaryStates.includes(stateCode));
  }, [stateCode]);

  const handleStart = () => {
    const itemName = t('Contrato de Compraventa de Vehículo', {lng: 'es'});
    track('add_to_cart', { item_id: 'bill-of-sale-vehicle', item_name: itemName, value: priceCents / 100, currency: 'USD' });
    addItem({ id: 'bill-of-sale-vehicle', type: 'doc', name: itemName, price: priceCents });
    router.push(`/?docId=bill-of-sale-vehicle&lang=${locale}#workflow-start`);
  };

   const content = {
    en: {
      title: 'Vehicle Bill of Sale',
      attorneyDrafted: 'Attorney-Drafted',
      description: 'Ensure a smooth, legally-compliant transfer of your vehicle’s ownership.',
      perDocument: 'per document',
      startFree: 'Start for Free',
      previewTitle: 'Preview your document',
      previewDescription: 'See exactly what your Bill of Sale will look like—and then click “Start for Free” to fill in your details.',
      feature1Title: 'Easy Fill-in Blanks',
      feature1Desc: 'Your answers auto-populate the PDF fields.',
      feature2Title: 'Secure & Trusted',
      feature2Desc: 'Built with bank-grade encryption.',
      feature3Title: 'Instant Download',
      feature3Desc: 'Get your PDF in seconds—no delays.',
      notaryRequired: 'Notarization (required by law)',
      notaryOptional: 'Notarization (optional)',
      notaryRequirementText: 'This state requires notarization for legal validity.',
      getStarted: 'Get Started',
    },
    es: {
      title: 'Contrato de Compraventa de Vehículo',
      attorneyDrafted: 'Redactado por Abogado',
      description: 'Transfiere la propiedad de tu vehículo de forma segura y conforme a la ley estatal.',
      perDocument: 'por documento',
      startFree: 'Comenzar Gratis',
      previewTitle: 'Vista Previa del Documento',
      previewDescription: 'Vea exactamente cómo se verá su Contrato de Compraventa y luego haga clic en "Comenzar Gratis" para completar sus detalles.',
      feature1Title: 'Fácil de Rellenar',
      feature1Desc: 'Sus respuestas completan automáticamente los campos del PDF.',
      feature2Title: 'Seguro y Confiable',
      feature2Desc: 'Construido con encriptación de grado bancario.',
      feature3Title: 'Descarga Instantánea',
      feature3Desc: 'Obtenga su PDF en segundos, sin demoras.',
      notaryRequired: 'Notarización (obligatoria por ley)',
      notaryOptional: 'Notarización (opcional)',
      notaryRequirementText: 'Este estado exige notarización para que el contrato sea válido.',
      getStarted: 'Empieza Ahora',
    }
  };
  
  const currentContent = content[locale];

  const features = [
    { icon: <FileText className="h-8 w-8 text-primary" />, title: currentContent.feature1Title, desc: currentContent.feature1Desc },
    { icon: <Lock className="h-8 w-8 text-primary" />, title: currentContent.feature2Title, desc: currentContent.feature2Desc },
    { icon: <DownloadCloud className="h-8 w-8 text-primary" />, title: currentContent.feature3Title, desc: currentContent.feature3Desc },
  ];


  return (
    <main className="container mx-auto py-12 px-4">
      {/* Hero Section */}
       <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <Badge variant="outline" className="mb-3 border-primary text-primary bg-primary/10 self-center lg:self-start">
            {currentContent.attorneyDrafted}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {currentContent.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-md">
            {currentContent.description}
          </p>
          <div className="flex items-baseline space-x-2 mb-6">
            <span className="text-4xl font-bold text-primary">${(priceCents / 100).toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">{currentContent.perDocument}</span>
          </div>
          <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base" onClick={handleStart}>
            {currentContent.startFree}
          </Button>
        </motion.div>

        {/* Document Preview Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DocumentPreview docId="bill-of-sale-vehicle" locale={locale} alt={currentContent.title + " preview"} />
        </motion.div>
      </div>
      
      {/* Feature Highlights Section */}
      <section className="py-16 bg-secondary/50 rounded-xl">
        <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
                {t('features.title', {lng: locale, defaultValue: 'Características que Hacen lo Legal Fácil'})}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px hsl(var(--card-foreground) / 0.08)"}}
                className="p-6 bg-card rounded-lg shadow-md text-center border border-border"
              >
                <div className="flex justify-center text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* Notary Upsell / Requirement Section */}
      <section className="mt-16 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border border-border">
            <CardHeader>
                <CardTitle className="text-xl text-center text-card-foreground">
                    {t('Notarization Options', {lng: locale, defaultValue: 'Opciones de Notarización'})}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Toggle
                  checked={wantNotary}
                  onPressedChange={(pressed) => {
                    setWantNotary(pressed);
                    track('add_payment_info', { upsell_id: 'notarization_bill_of_sale', enabled: pressed, value: 0 });
                  }}
                  disabled={requiredNotaryStates.includes(stateCode)}
                  aria-label={currentContent.notaryOptional}
                  variant="outline"
                  size="lg"
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                />
                <span className="font-medium text-card-foreground">
                  {requiredNotaryStates.includes(stateCode)
                    ? currentContent.notaryRequired
                    : currentContent.notaryOptional}
                </span>
              </div>
              {requiredNotaryStates.includes(stateCode) && (
                <p className="mt-2 text-xs text-destructive">
                  {currentContent.notaryRequirementText}
                </p>
              )}
               <p className="text-xs text-muted-foreground mt-2">
                 {t('Notarization services may incur additional fees.', {lng: locale, defaultValue: 'Los servicios de notarización pueden incurrir en tarifas adicionales.'})}
               </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="mt-12 py-12 text-center">
        <Button size="xl" className="px-10 py-4 text-lg" onClick={handleStart}>
          {currentContent.getStarted}
        </Button>
      </section>
    </main>
  );
}
