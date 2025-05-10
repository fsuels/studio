// src/components/landing/PromoBanner.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const PromoBanner = React.memo(function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-primary text-primary-foreground overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-center text-sm relative">
          <Gift className="h-4 w-4 mr-2 shrink-0" />
          <span className="font-medium mr-1">Limited Time Offer:</span>
          <span>Get 20% off your first document! Expires soon.</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Dismiss promotional banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
export { PromoBanner };
