// src/components/TrustBadges.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, Award } from 'lucide-react'; // Example icons

interface TrustBadgeItem {
  icon: React.ElementType;
  textKey: string;
  defaultText: string;
}

const trustBadgeItems: TrustBadgeItem[] = [
  { icon: ShieldCheck, textKey: 'trustBadges.secure', defaultText: 'SSL Secure Checkout' },
  { icon: Lock, textKey: 'trustBadges.privacy', defaultText: 'Privacy Protected' },
  { icon: Award, textKey: 'trustBadges.attorneyReviewed', defaultText: 'Attorney-Reviewed Templates' },
];

export default function TrustBadges() {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Render a simple placeholder or null during SSR/pre-hydration
    return (
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded-full"></div>
            <div className="h-3 w-20 bg-muted-foreground/10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6">
      {trustBadgeItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <item.icon className="h-3.5 w-3.5 text-green-600" />
          <span>{t(item.textKey, item.defaultText)}</span>
        </div>
      ))}
    </div>
  );
}
