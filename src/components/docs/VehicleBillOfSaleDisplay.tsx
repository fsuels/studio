// src/components/docs/VehicleBillOfSaleDisplay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartProvider';
import { track } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import BillOfSalePreview from '@/components/BillOfSalePreview';
import { requiredNotaryStates } from '@/lib/stateNotaryRequirements';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

interface VehicleBillOfSaleDisplayProps {
  locale: 'en' | 'es';
}

export default function VehicleBillOfSaleDisplay({ locale }: VehicleBillOfSaleDisplayProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [stateCode, setStateCode] = useState<string>('CA'); // default, can be changed by a state selector later
  const [wantNotary, setWantNotary] = useState<boolean>(requiredNotaryStates.includes(stateCode));
  const { addItem } = useCart();
  const priceCents = 1995; // $19.95

  useEffect(() => {
    track('view_item', { item_id: 'bill-of-sale-vehicle', value: priceCents / 100, currency: 'USD' });
  }, [priceCents]);

  useEffect(() => {
    if (requiredNotaryStates.includes(stateCode)) {
      setWantNotary(true);
    }
  }, [stateCode]);

  const handleStart = () => {
    const itemName = locale === 'es' ? t('Contrato de Compraventa de Vehículo') : t('Vehicle Bill of Sale');
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
      feature1Title: 'Easy fill-in blanks',
      feature1Desc: 'Your answers auto-populate the PDF fields.',
      feature2Title: 'Secure & trusted',
      feature2Desc: 'Built with bank-grade encryption.',
      feature3Title: 'Instant download',
      feature3Desc: 'Get your PDF in seconds—no delays.',
      notaryRequired: 'Notarization (required by law)',
      notaryOptional: 'Notarization (optional)',
      notaryRequirementText: 'This state requires notarization for legal validity.',
      getStarted: 'Get Started',
    },
    es: {
      title: 'Contrato de Compraventa de Vehículo',
      attorneyDrafted: 'Redactado por abogado',
      description: 'Transfiere la propiedad de tu vehículo de forma segura y conforme a la ley estatal.',
      perDocument: 'por documento',
      startFree: 'Comenzar Gratis',
      previewTitle: 'Vista previa del contrato',
      feature1Title: 'Rellena con facilidad',
      feature1Desc: 'Tus respuestas se colocan automáticamente en el contrato.',
      feature2Title: 'Seguro y confiable',
      feature2Desc: 'Generado con claves de cifrado de grado bancario.',
      feature3Title: 'Entrega instantánea',
      feature3Desc: 'PDF listo en segundos, sin esperas.',
      notaryRequired: 'Notarización (obligatoria por ley)',
      notaryOptional: 'Notarización (opcional)',
      notaryRequirementText: 'Este estado exige notarización para que el contrato sea válido.',
      getStarted: 'Empieza Ahora',
    }
  };

  const currentContent = content[locale];
  const features = [
    { icon: '✍️', title: currentContent.feature1Title, desc: currentContent.feature1Desc },
    { icon: '🔒', title: currentContent.feature2Title, desc: currentContent.feature2Desc },
    { icon: '⚡', title: currentContent.feature3Title, desc: currentContent.feature3Desc },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            {currentContent.title}
          </h1>
          <Badge variant="outline" className="mb-2 border-primary text-primary bg-primary/10">
            {currentContent.attorneyDrafted}
          </Badge>
          <p className="text-lg text-muted-foreground mb-6">
            {currentContent.description}
          </p>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-semibold text-primary">${(priceCents/100).toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">{currentContent.perDocument}</span>
          </div>
          <Button size="lg" className="mt-6" onClick={handleStart}>
            {currentContent.startFree}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-lg border border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                {currentContent.previewTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <BillOfSalePreview height={400} locale={locale}/>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-6 bg-card rounded-lg shadow-md text-center border border-border"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-semibold mb-2 text-card-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Notary Upsell / Requirement */}
      <div className="mt-16 max-w-md mx-auto">
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-card-foreground">
                {requiredNotaryStates.includes(stateCode)
                  ? currentContent.notaryRequired
                  : currentContent.notaryOptional}
              </span>
              <Toggle
                checked={wantNotary}
                onCheckedChange={(checked) => {
                    setWantNotary(checked);
                    track('add_payment_info', { upsell_id: 'notarization', enabled: checked, value: 0 });
                }}
                disabled={requiredNotaryStates.includes(stateCode)}
                aria-label={requiredNotaryStates.includes(stateCode) ? currentContent.notaryRequired : currentContent.notaryOptional}
              />
            </div>
            {requiredNotaryStates.includes(stateCode) && (
              <p className="mt-2 text-xs text-destructive">
                {currentContent.notaryRequirementText}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <Button size="lg" onClick={handleStart}>
          {currentContent.getStarted}
        </Button>
      </div>
    </div>
  );
}
