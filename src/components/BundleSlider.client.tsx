'use client';

import React, { useEffect } from 'react';
import { bundles } from '@/data/bundles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartProvider';
import { motion } from 'framer-motion';
import { track } from '@/lib/analytics';

export default function BundleSlider() {
  const { addBundle } = useCart();

  useEffect(() => {
    bundles.forEach((b) => {
      track('view_item', { id: b.id, value: b.priceCents / 100 });
    });
  }, []);

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <ul className="flex gap-4">
        {bundles.map((b) => (
          <motion.li
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="min-w-[260px]"
          >
            <Card className="card-hover h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>{b.emoji}</span>
                  {b.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{b.tagline}</p>
              </CardHeader>

              <CardContent className="mt-auto flex flex-col gap-3">
                <p className="text-2xl font-bold tracking-tight">
                  {(b.priceCents / 100).toLocaleString('en', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </p>

                <Button
                  onClick={() => {
                    addBundle(b);
                    track('add_to_cart', {
                      id: b.id,
                      value: b.priceCents / 100,
                    });
                  }}
                  className="w-full"
                >
                  Add bundle to cart
                </Button>
              </CardContent>
            </Card>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
