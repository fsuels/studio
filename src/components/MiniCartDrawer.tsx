'use client';
// src/components/MiniCartDrawer.tsx

import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CartContext } from '@/contexts/CartProvider';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MiniCartDrawer() {
  const { cartItems } = React.useContext(CartContext);
  const [open, setOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your Cart</DrawerTitle>
          <DrawerDescription>
            {cartItems.length > 0 ? (
              `You have ${totalItems} item${
                totalItems > 1 ? 's' : ''
              } in your cart.`
            ) : (
              <p>Your cart is empty.</p>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-4 pb-4">
          {cartItems.length > 0 && (
            <ul className="divide-y">
              {cartItems.map((item) => (
                <li
                  key={item.bundle.id}
                  className="flex items-center justify-between py-2"
                >
                  <span className="flex-grow">{item.bundle.title}</span>
                  <span className="font-semibold ml-2">x{item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DrawerFooter className="flex flex-col gap-4">
          <Button
            className={cn(
              'w-full bg-gradient-to-r from-electric-500 to-electric-700 hover:to-electric-600 text-white shadow-glass',
              cartItems.length == 0 && "pointer-events-none opacity-50"
            )}
            onClick={() => {
              console.log('Checkout');
              setOpen(false);
            }}
          >
            Checkout
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
