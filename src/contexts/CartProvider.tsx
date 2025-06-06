'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { parseLargeJSON } from '@/lib/parseLargeJSON';
import { track } from '@/lib/analytics';
import type { Bundle } from '@/data/bundles';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export type CartItem =
  | { id: string; type: 'doc'; name: string; price: number; qty?: number }
  | {
      id: string;
      type: 'bundle';
      name: string;
      price: number;
      qty?: number;
      docIds: string[];
    };

interface CartState {
  items: CartItem[];
  addItem: (_i: CartItem) => void;
  addBundle: (_bundle: Bundle) => void; // ← NEW
  incQty: (_id: string) => void;
  decQty: (_id: string) => void;
  removeItem: (_id: string) => void;
  clear: () => void;
  totalCents: number;
}

const CartCtx = createContext<CartState | undefined>(undefined);

/* ------------------------------------------------------------------ */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  /* ---------- persistence --------------------------------------- */
  useEffect(() => {
    const raw = localStorage.getItem('cartItems');
    if (!raw) return;
    const parse = raw.length > 2000 ? parseLargeJSON<CartItem[]>(raw) : Promise.resolve(JSON.parse(raw));
    parse
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {
        /* ignore */
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  /* ---------- helpers ------------------------------------------- */
  const mutateQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.flatMap((it) =>
        it.id === id
          ? [{ ...it, qty: Math.max(1, (it.qty ?? 1) + delta) }]
          : [it],
      ),
    );

  const addGeneric = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      const next = existing
        ? prev.map((p) =>
            p.id === item.id ? { ...p, qty: (p.qty ?? 1) + 1 } : p,
          )
        : [...prev, { ...item, qty: 1 }];
      track('add_to_cart', { id: item.id, value: item.price / 100 });
      return next;
    });
  };

  /* ---------- public API ---------------------------------------- */
  const api: CartState = useMemo(
    () => ({
      items,
      totalCents: items.reduce((s, i) => s + i.price * (i.qty ?? 1), 0),

      addItem: addGeneric,

      addBundle: (bundle) => {
        addGeneric({
          id: bundle.id,
          type: 'bundle',
          name: bundle.name,
          price: bundle.priceCents,
          docIds: bundle.docIds,
        });
      },

      incQty: (id) => mutateQty(id, +1),
      decQty: (id) => mutateQty(id, -1),

      removeItem: (id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        track('remove_from_cart', { id });
      },

      clear: () => setItems([]),
    }),
    [items],
  );

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart must be used inside <CartProvider>');
  return c;
}
