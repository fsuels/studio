// src/components/AnnouncementBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PromoBanner = React.memo(function PromoBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Set to next midnight

      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setIsExpired(true);
        setIsVisible(false); // Auto-hide when expired
        return;
      }

      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    calculateTimeLeft(); // Initial calculation
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (!isVisible || isExpired) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-primary text-primary-foreground overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center text-sm relative gap-2 sm:gap-4">
          <div className="flex items-center">
            <Gift className="h-4 w-4 mr-2 shrink-0" />
            <span className="font-medium mr-1">{t('Limited Time Offer:', {defaultValue: 'Limited Time Offer:'})}</span>
            <span>{t('Get 20% off your first document!', {defaultValue: 'Get 20% off your first document!'})}</span>
          </div>
          <div className="flex items-center font-mono text-xs bg-primary-foreground/20 px-2 py-0.5 rounded">
            <Clock className="h-3 w-3 mr-1.5" />
            <span>{t('Expires in:', {defaultValue: 'Expires in:'})} {timeLeft}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground sm:h-6 sm:w-6"
            aria-label={t('Dismiss promotional banner', {defaultValue: 'Dismiss promotional banner'})}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
export { PromoBanner as AnnouncementBar };
