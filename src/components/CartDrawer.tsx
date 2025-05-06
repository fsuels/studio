// src/components/CartDrawer.tsx
'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Trash, X } from 'lucide-react';
import { useCart } from '@/contexts/CartProvider';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';
import { AnimatePresence, motion } from 'framer-motion';

/* --------------------------------------------------
   Utility – price formatter (store keeps cents)
-------------------------------------------------- */
const priceFmt = (cents: number) =>
  (cents / 100).toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
  });

export default function CartDrawer() {
  const {
    items,
    incQty,
    decQty,
    removeItem,
    totalCents,
  } = useCart();
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState('');
  const router = useRouter();

  /* ------------------------------------------------
     Analytics hooks
  ------------------------------------------------ */
  const handleOpenChange = (next: boolean) => {
    if (next && !open && items.length) {
      track('view_item_list', { items });
    }
    setOpen(next);
  };

  const checkout = async () => {
    if (!items.length) return;
    track('begin_checkout', {
      value: totalCents / 100,
      currency: 'USD',
      items,
    });
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, promo }),
    });
    const { url } = await res.json();
    router.push(url);
  };

  /* ------------------------------------------------
     Drawer UI
  ------------------------------------------------ */
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Cart">
          <ShoppingCart className="h-5 w-5" />
          {!!items.length && (
            <Badge className="absolute -right-1 -top-1 px-[6px] py-[1px] text-[10px]">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 sm:w-96 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Items list */}
        <section className="flex-grow space-y-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {items.length === 0 && (
              <motion.p
                key="empty"
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                Cart is empty.
              </motion.p>
            )}

            {items.map((i) => (
              <motion.div
                key={i.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.15 }}
                className="flex items-start justify-between gap-2 border-b pb-2"
              >
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {priceFmt(i.price)} × {i.qty}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => decQty(i.id)} aria-label="Decrease">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-1 text-sm">{i.qty}</span>
                  <Button size="icon" variant="ghost" onClick={() => incQty(i.id)} aria-label="Increase">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(i.id)} aria-label="Remove">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* Promo code */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          {!!promo && (
            <Button variant="ghost" size="icon" onClick={() => setPromo('')} aria-label="Clear promo">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-4">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{priceFmt(totalCents)}</span>
          </div>
          <Button disabled={!items.length} className="w-full" onClick={checkout}>
            Checkout
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
