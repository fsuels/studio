
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
import DocumentPreview from '@/components/DocumentPreview'; 
import { requiredNotaryStates } from '@/lib/stateNotaryRequirements';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // Import Link
import { FileText, Lock, DownloadCloud } from 'lucide-react';
import BillOfSaleTemplateES from '@/templates/BillOfSaleTemplateES';

export default function BillOfSalePageES() {
  const { t, i18n } = useTranslation();
  const locale = 'es'; 
  

  const [stateCode, setStateCode] = useState<string>('CA'); 
  const [wantNotary, setWantNotary] = useState<boolean>(requiredNotaryStates.includes(stateCode));
  const { addItem } = useCart();
  const priceCents = 1995; 

  useEffect(() => {
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es');
    }
    track('view_item', { item_id: 'bill-of-sale-vehicle', item_name_es: t('Contrato de Compraventa de Vehículo', { lng: 'es'}), value: priceCents / 100, currency: 'USD' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceCents, i18n]);

  useEffect(() => {
    setWantNotary(requiredNotaryStates.includes(stateCode));
  }, [stateCode]);

   const content = {
    en: { // Keeping EN for reference
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
    { icon: <FileText className="h-6 w-6 text-primary" />, title: currentContent.feature1Title, desc: currentContent.feature1Desc },
    { icon: <Lock className="h-6 w-6 text-primary" />, title: currentContent.feature2Title, desc: currentContent.feature2Desc },
    { icon: <DownloadCloud className="h-6 w-6 text-primary" />, title: currentContent.feature3Title, desc: currentContent.feature3Desc },
  ];

  return (
    <main className="container mx-auto py-12 space-y-12">
      <div className="lg:flex lg:items-start lg:space-x-12">
        <div className="flex-shrink-0 lg:w-1/2">
          <BillOfSaleTemplateES />
        </div>
        <div className="mt-8 lg:mt-0 lg:w-1/2">
          <Badge variant="outline" className="mb-3 border-primary text-primary bg-primary/10">
            {currentContent.attorneyDrafted}
          </Badge>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {currentContent.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground mb-6">
            {currentContent.description}
          </p>
          <div className="mt-6 text-3xl font-semibold text-primary">${(priceCents / 100).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{currentContent.perDocument}</span></div>
          <Button size="lg" className="mt-8 px-8 py-3 text-base" asChild>
            <Link href={`/${locale}/docs/bill-of-sale-vehicle/start`}>
                {currentContent.startFree}
            </Link>
          </Button>

          {/* feature bullet-points */}
          <ul className="mt-10 space-y-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-start space-x-4">
                <span className="icon text-2xl mt-1">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-card-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
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
        <Button size="xl" className="px-10 py-4 text-lg" asChild>
           <Link href={`/${locale}/docs/bill-of-sale-vehicle/start`}>
             {currentContent.getStarted}
           </Link>
        </Button>
      </section>
    </main>
  );
}

