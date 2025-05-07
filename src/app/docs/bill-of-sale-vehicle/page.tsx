// src/app/docs/bill-of-sale-vehicle/page.tsx
'use client'
import React, { useEffect } from 'react'
import { track } from '@/lib/analytics'
import BillOfSaleTemplateEN from '@/templates/BillOfSaleTemplateEN'
import { useCart } from '@/contexts/CartProvider'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function BillOfSalePage() {
  const { addItem } = useCart() // Correctly destructure addItem
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = React.useState(false);

  useEffect(() => {
    setIsHydrated(true);
    track('view_item', { item_id: 'bill-of-sale-vehicle', item_name: 'Vehicle Bill of Sale' })
  }, [])

  const addToCart = () => {
    if (!isHydrated) return;
    addItem({
      id: 'bill-of-sale-vehicle',
      type: 'doc',
      name: 'Vehicle Bill of Sale', // Should match the name in documentLibrary for consistency
      price: 1995, // Price in cents
    })
    // Optionally, add a toast notification for adding to cart
    // toast({ title: t('Added to cart'), description: t('Vehicle Bill of Sale added to your cart.')});
  }

  if (!isHydrated) {
    return (
      <main className="container mx-auto p-8 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-muted rounded mb-6"></div>
        <div className="h-10 bg-primary rounded w-36"></div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">{t('Vehicle Bill of Sale', { defaultValue: 'Vehicle Bill of Sale'})}</h1>
      <BillOfSaleTemplateEN />
      <div className="mt-6">
        <Button onClick={addToCart} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {t('Start for Free', {defaultValue: 'Start for Free'})}
        </Button>
      </div>
    </main>
  )
}
