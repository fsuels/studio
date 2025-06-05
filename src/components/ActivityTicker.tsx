'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';


export default function ActivityTicker() {
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const isHomePage = pathname === '/en' || pathname === '/es' || pathname === '/';
  const messages =
    (t('activityTicker.messages', { returnObjects: true }) as string[]) || [];
  const [index, setIndex] = useState(0);

  if (!isHomePage) {
    return null;
  }

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  const message = messages[index % messages.length];

  return (
    <div className="fixed bottom-4 right-4 z-[99] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'bg-background border border-border shadow px-4 py-2 rounded text-sm pointer-events-auto'
          )}
        >
          {message}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
