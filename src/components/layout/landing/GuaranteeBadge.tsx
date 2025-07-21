// src/components/landing/GuaranteeBadge.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GuaranteeBadge = React.memo(function GuaranteeBadge() {
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderText = '...';

  return (
    <section className="w-full py-8 bg-background">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-secondary/80 border border-primary/30 rounded-full px-6 py-3 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium text-secondary-foreground">
            {isHydrated
              ? t('home.satisfactionGuarantee', {
                  defaultValue:
                    '100% Satisfaction Guarantee or Your Money Back',
                })
              : placeholderText}
          </p>
        </div>
      </div>
    </section>
  );
});
export default GuaranteeBadge;
