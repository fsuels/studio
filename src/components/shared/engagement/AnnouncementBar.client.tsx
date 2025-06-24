// src/components/AnnouncementBar.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const calculateTimeLeftUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();

  if (diff <= 0) {
    return { expired: true, timeLeftString: '00:00:00' };
  }

  const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
    2,
    '0',
  );
  const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
  return { expired: false, timeLeftString: `${hours}:${minutes}:${seconds}` };
};

const initialCountdown = { expired: false, timeLeftString: '00:00:00' };

const AnnouncementBar = React.memo(function PromoBanner() {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const dismissedDate = localStorage.getItem('promoDismissedDate');
    const today = new Date().toDateString();
    if (dismissedDate === today) {
      setIsVisible(false);
    }
    // Initialize countdown on the client to avoid server/client mismatches
    const updateCountdown = () => {
      const next = calculateTimeLeftUntilMidnight();
      setCountdown(next);
      if (next.expired) {
        setIsVisible(false);
      }
    };
    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    const today = new Date().toDateString();
    localStorage.setItem('promoDismissedDate', today);
  }, []);

  if (!isVisible || !isHydrated) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-blue-900 text-white overflow-hidden"
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center text-sm relative gap-2 sm:gap-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 shrink-0" />
              <span className="font-medium mr-1">
                {t('announcement.offerTitle', {
                  defaultValue: 'Limited Time Offer:',
                })}
              </span>
              <span>
                {t('announcement.offerDetails', {
                  defaultValue: 'Get 20% off your first document!',
                })}
              </span>
            </div>
            {!countdown.expired && (
              <div className="flex items-center font-mono text-xs bg-blue-800 border border-blue-700 px-2 py-0.5 rounded">
                <Clock className="h-3 w-3 mr-1.5" />
                <span>
                  {t('announcement.expiresIn', { defaultValue: 'Expires in:' })}{' '}
                  {countdown.timeLeftString}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 text-white hover:bg-white/20 hover:text-white focus:bg-white/20 focus:text-white sm:h-6 sm:w-6"
              aria-label={t('announcement.dismissLabel', {
                defaultValue: 'Dismiss promotional banner',
              })}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
export default AnnouncementBar;
